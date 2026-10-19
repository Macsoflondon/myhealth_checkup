import { strict as assert } from "node:assert";
import { resolveOpenAiApiKey } from "./configuration.ts";

Deno.test("uses the configured Open_AI_API_KEY when OPENAI_API_KEY is absent", () => {
  const env: Record<string, string> = { Open_AI_API_KEY: "test-legacy-key" };
  assert.equal(resolveOpenAiApiKey((name) => env[name]), "test-legacy-key");
});

Deno.test("prefers OPENAI_API_KEY when both secret names exist", () => {
  const env: Record<string, string> = {
    OPENAI_API_KEY: "test-canonical-key",
    Open_AI_API_KEY: "test-legacy-key",
  };
  assert.equal(resolveOpenAiApiKey((name) => env[name]), "test-canonical-key");
});

Deno.test("ignores whitespace-only canonical secrets and trims the legacy key", () => {
  const env: Record<string, string> = { OPENAI_API_KEY: "  ", Open_AI_API_KEY: " test-legacy-key " };
  assert.equal(resolveOpenAiApiKey((name) => env[name]), "test-legacy-key");
});

Deno.test("returns an empty key when neither secret is configured", () => {
  assert.equal(resolveOpenAiApiKey(() => undefined), "");
});