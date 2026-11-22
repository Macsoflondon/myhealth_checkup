import { z } from "npm:zod";

export const throttleInputSchema = z
  .object({
    email: z.string().max(254).email(),
    outcome: z.enum(["check", "failure"]),
  })
  .strict();

export async function readThrottleInput(req: Request) {
  const declaredLength = Number(req.headers.get("content-length"));
  if (declaredLength > 2048) return { status: 413 as const };
  const reader = req.body?.getReader();
  if (!reader) return { status: 400 as const };
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 2048) {
      await reader.cancel();
      return { status: 413 as const };
    }
    chunks.push(value);
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    const parsed = throttleInputSchema.safeParse(
      JSON.parse(new TextDecoder().decode(body)),
    );
    return parsed.success
      ? { status: 200 as const, data: parsed.data }
      : { status: 400 as const };
  } catch {
    return { status: 400 as const };
  }
}
