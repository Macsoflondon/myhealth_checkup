import type { UIMessage, UIMessageChunk } from "ai";
import { ASSISTANT_MAX_HISTORY, sanitiseUserText } from "./assistant-prompt";

const MAX_REPLY_TEXT = 4000;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const encoder = new TextEncoder();

const signingKey = (secret: string) =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const payload = (id: string, texts: string[], issuedAt: number) =>
  encoder.encode(
    JSON.stringify(["mhc-assistant-history-v1", id, texts, issuedAt]),
  );

export const signAssistantReply = async (
  secret: string,
  id: string,
  texts: string[],
  issuedAt = Date.now(),
) => {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(secret),
    payload(id, texts, issuedAt),
  );
  return {
    issuedAt,
    signature: Array.from(new Uint8Array(signature), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join(""),
  };
};

const verifyReply = async (
  secret: string,
  id: string,
  texts: string[],
  metadata: unknown,
): Promise<boolean> => {
  if (
    !metadata ||
    typeof metadata !== "object" ||
    !("historyProof" in metadata)
  )
    return false;
  const proof = metadata.historyProof;
  if (
    !proof ||
    typeof proof !== "object" ||
    !("signature" in proof) ||
    !("issuedAt" in proof)
  )
    return false;
  const { signature, issuedAt } = proof;
  if (
    typeof signature !== "string" ||
    !/^[a-f0-9]{64}$/.test(signature) ||
    typeof issuedAt !== "number" ||
    !Number.isSafeInteger(issuedAt) ||
    issuedAt > Date.now() ||
    Date.now() - issuedAt > MAX_AGE_MS
  )
    return false;
  const bytes = Uint8Array.from(signature.match(/.{2}/g) ?? [], (pair) =>
    Number.parseInt(pair, 16),
  );
  return crypto.subtle.verify(
    "HMAC",
    await signingKey(secret),
    bytes,
    payload(id, texts, issuedAt),
  );
};

/** Only authenticated server replies may become assistant-role model context. */
export const sanitiseSignedHistory = async (
  raw: unknown,
  secret: string,
): Promise<
  | { messages: UIMessage[] }
  | { error: 400; reason: "invalid_request" | "invalid_assistant_reply" }
> => {
  if (!Array.isArray(raw) || raw.length === 0)
    return { error: 400, reason: "invalid_request" };
  const messages: UIMessage[] = [];
  // Verify the whole request, including replies outside the model context window.
  for (const entry of raw) {
    if (!entry || typeof entry !== "object")
      return { error: 400, reason: "invalid_request" };
    const m = entry as {
      id?: unknown;
      role?: unknown;
      parts?: unknown;
      metadata?: unknown;
    };
    if (m.role !== "user" && m.role !== "assistant") continue;
    if (!Array.isArray(m.parts))
      return {
        error: 400,
        reason:
          m.role === "assistant"
            ? "invalid_assistant_reply"
            : "invalid_request",
      };
    const texts = m.parts.flatMap((part: unknown) => {
      if (
        !part ||
        typeof part !== "object" ||
        !("type" in part) ||
        part.type !== "text" ||
        !("text" in part) ||
        typeof part.text !== "string"
      )
        return [];
      return [m.role === "user" ? sanitiseUserText(part.text) : part.text];
    });
    const id = typeof m.id === "string" ? m.id : crypto.randomUUID();
    if (
      m.role === "assistant" &&
      !(await verifyReply(secret, id, texts, m.metadata))
    )
      return { error: 400, reason: "invalid_assistant_reply" };
    messages.push({
      id,
      role: m.role,
      parts: texts.map((text) => ({
        type: "text",
        text: m.role === "assistant" ? text.slice(0, MAX_REPLY_TEXT) : text,
      })),
    });
  }
  return messages.some((message) => message.role === "user")
    ? { messages: messages.slice(-ASSISTANT_MAX_HISTORY) }
    : { error: 400, reason: "invalid_request" };
};

/** Sign only completed streams, using exactly the text parts delivered to the browser. */
export const signAssistantStream = (secret: string) => {
  const state = { id: "", failed: false };
  const texts = new Map<string, string>();
  return new TransformStream<UIMessageChunk, UIMessageChunk>({
    async transform(chunk, controller) {
      if (chunk.type === "start") state.id = chunk.messageId ?? "";
      if (chunk.type === "error" || chunk.type === "abort") state.failed = true;
      if (chunk.type === "text-start") texts.set(chunk.id, "");
      if (chunk.type === "text-delta")
        texts.set(chunk.id, (texts.get(chunk.id) ?? "") + chunk.delta);
      if (chunk.type === "finish" && state.id && !state.failed) {
        const historyProof = await signAssistantReply(secret, state.id, [
          ...texts.values(),
        ]);
        controller.enqueue({ ...chunk, messageMetadata: { historyProof } });
      } else controller.enqueue(chunk);
    },
  });
};
