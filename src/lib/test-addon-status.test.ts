import { describe, expect, it } from "vitest";
import { isTestAddon } from "./test-addon-status";

describe("source-backed Lola add-on status", () => {
  it("recognises Omega's provider category despite its false flag", () => {
    expect(isTestAddon({ provider_id: "lola-health", is_addon: false, category: "add-on" })).toBe(true);
  });
  it("recognises the provider's explicit product description", () => {
    expect(isTestAddon({ provider_id: "lola-health", is_addon: false, description: "This add-on measures the balance between arachidonic acid (ARA) and eicosapentaenoic acid (EPA)." })).toBe(true);
  });
  it("recognises a provider add-on section", () => {
    expect(isTestAddon({ provider_id: "lola-health", source_section_label: "Add-ons" })).toBe(true);
  });
  it("does not turn a standalone panel offering optional add-ons into an add-on", () => {
    expect(isTestAddon({ provider_id: "lola-health", is_addon: false, category: "General health", description: "A complete panel. You can choose an add-on." })).toBe(false);
  });
  it("does not infer another provider's status from Lola-specific evidence", () => {
    expect(isTestAddon({ provider_id: "medichecks", category: "add-on", description: "This add-on measures iron." })).toBe(false);
  });
  it("preserves explicitly flagged add-ons for any provider", () => {
    expect(isTestAddon({ provider_id: "medichecks", is_addon: true })).toBe(true);
  });
});