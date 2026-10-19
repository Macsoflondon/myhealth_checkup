/** Prefer the canonical secret while supporting the existing deployed name. */
export function resolveOpenAiApiKey(readEnv: (name: string) => string | undefined): string {
  return readEnv("OPENAI_API_KEY")?.trim() || readEnv("Open_AI_API_KEY")?.trim() || "";
}