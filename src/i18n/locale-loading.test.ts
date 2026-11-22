import { describe, expect, it } from "vitest";
import i18n, { SUPPORTED_LANGUAGES } from "./config";

describe("on-demand locale resources", () => {
  it("loads each selected non-English locale without losing English", async () => {
    for (const language of SUPPORTED_LANGUAGES) {
      await i18n.changeLanguage(language);
      expect(i18n.hasResourceBundle(language, "translation")).toBe(true);
    }
    expect(i18n.hasResourceBundle("en", "translation")).toBe(true);
    await i18n.changeLanguage("en");
  });
});
