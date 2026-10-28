import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Tool, ToolContent, ToolHeader } from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import assistantMark from "@/assets/assistant/assistant-mark-96.webp";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  assistantChatFetch,
  ChatHistoryRejectedError,
} from "@/lib/assistant/chat-transport";

export const STORAGE_KEY = "mhc-assistant-messages";
const SUGGESTIONS = [
  "How do you rank tests?",
  "Cheapest full blood count?",
  "Which tests include ferritin?",
];

/** localStorage can throw in private browsing; never let it crash the panel. */
export function saveMessages(messages: UIMessage[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    /* storage unavailable */
  }
}

export function clearMessages(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

type CatalogueTest = {
  name: string;
  provider: string;
  totalExpectedCostGbp: number;
};

function parseCatalogueOutput(output: unknown): CatalogueTest[] | null {
  if (typeof output !== "object" || output === null) return null;
  const tests = (output as { tests?: unknown }).tests;
  if (!Array.isArray(tests)) return null;
  return tests.flatMap((t) => {
    if (typeof t !== "object" || t === null) return [];
    const { name, provider, totalExpectedCostGbp } = t as Record<
      string,
      unknown
    >;
    return typeof name === "string" &&
      typeof provider === "string" &&
      typeof totalExpectedCostGbp === "number"
      ? [{ name, provider, totalExpectedCostGbp }]
      : [];
  });
}

const CatalogueSearchResult = ({ output }: { output: unknown }) => {
  const tests = parseCatalogueOutput(output);
  if (!tests) return null;
  if (tests.length === 0)
    return (
      <p className="text-sm text-brand-navy/70">
        No matching tests found in the catalogue.
      </p>
    );
  return (
    <ul className="space-y-1.5 text-sm text-brand-navy">
      {tests.map((t, i) => (
        <li key={i} className="flex items-baseline justify-between gap-3">
          <span className="min-w-0">
            <span className="font-medium">{t.name}</span>
            <span className="text-brand-navy/60"> · {t.provider}</span>
          </span>
          <span className="shrink-0 font-semibold">
            £{t.totalExpectedCostGbp.toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export const ChatPanel = ({ onClose }: { onClose: () => void }) => {
  const [restarted, setRestarted] = useState(false);
  const initial = useMemo(loadMessages, []);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/public/assistant",
        fetch: assistantChatFetch,
      }),
    [],
  );
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: "site-assistant",
    messages: initial,
    transport,
    onError: (error) => {
      if (error instanceof ChatHistoryRejectedError) {
        setMessages([]);
        clearMessages();
        setRestarted(true);
        return;
      }
      const msg = error.message.includes("429")
        ? "You're sending messages quickly. Please wait a minute."
        : error.message.includes("402")
          ? "The assistant is temporarily unavailable."
          : "Something went wrong. Please try again.";
      toast.error(msg);
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (status === "ready" || status === "error") {
      if (messages.length) saveMessages(messages);
      else clearMessages();
      textareaRef.current?.focus();
    }
  }, [messages, status]);

  useEffect(() => textareaRef.current?.focus(), []);

  const submit = (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || busy) return;
    setRestarted(false);
    void sendMessage({ text });
  };

  const reset = () => {
    stop();
    setMessages([]);
    clearMessages();
    setRestarted(false);
    textareaRef.current?.focus();
  };

  const lastIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      role="dialog"
      aria-label="myhealth checkup assistant"
      className="fixed bottom-24 left-4 right-4 z-[60] flex h-[min(620px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-brand-navy/15 bg-background shadow-e3 sm:left-6 sm:right-auto sm:w-[400px]"
    >
      <header className="flex items-center gap-3 border-b border-brand-navy/10 px-4 py-3">
        <img
          src={assistantMark}
          alt=""
          width={32}
          height={32}
          className="size-8"
        />
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold text-brand-navy">
            Ask myhealth checkup
          </p>
          <p className="text-xs text-brand-navy/60">
            Not medical advice. Your questions are processed by an{" "}
            <Link to="/privacy-policy" className="underline underline-offset-2">
              AI service
            </Link>
            , so please don&apos;t share personal health details.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="New conversation"
          onClick={reset}
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close assistant"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </header>

      <Conversation className="flex-1">
        <ConversationContent>
          {restarted && (
            <p role="status" className="text-sm text-brand-navy">
              Your chat has restarted. Please ask your question again.
            </p>
          )}
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={
                <img
                  src={assistantMark}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12"
                />
              }
              title="How can I help?"
              description="Ask about tests, prices, biomarkers or how the site works."
            >
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => void sendMessage({ text: s })}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent
                  className={
                    m.role === "user"
                      ? "group-[.is-user]:bg-brand-turquoise group-[.is-user]:text-brand-navy"
                      : "bg-transparent text-brand-navy"
                  }
                >
                  {m.parts.map((part, i) => {
                    if (part.type === "text")
                      return (
                        <MessageResponse key={i}>{part.text}</MessageResponse>
                      );
                    if (part.type === "tool-search_tests")
                      return (
                        <Tool key={i} defaultOpen={false}>
                          <ToolHeader
                            type={part.type}
                            state={part.state}
                            title="Searched the catalogue"
                          />
                          <ToolContent>
                            {part.state === "output-error" ? (
                              <p className="text-sm text-brand-navy/70">
                                The catalogue search failed. Please try again.
                              </p>
                            ) : (
                              <CatalogueSearchResult output={part.output} />
                            )}
                          </ToolContent>
                        </Tool>
                      );
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {busy && lastIsUser && (
            <Shimmer className="text-sm">Thinking…</Shimmer>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-brand-navy/10 p-3">
        <PromptInput onSubmit={submit}>
          <PromptInputTextarea
            ref={textareaRef}
            placeholder="Ask a question"
            maxLength={1000}
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
