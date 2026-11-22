import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const sourceRoot = join(process.cwd(), "src");
// Brand identity is deliberately owner-sized. ErrorBoundary's two diagnostic
// blocks are exclusively verified-admin/MFA content, not public page text.
const brandBarAllowlist = new Set([
  "components/layout/BrowseByCategoryBar.tsx",
]);
const adminOnlyFiles = new Set(["components/common/ErrorBoundary.tsx"]);

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory())
      return /^(admin|control|os)$/.test(entry.name) ? [] : files(path);
    return /\.(tsx?|jsx?)$/.test(entry.name) &&
      !/\.(test|spec)\./.test(entry.name) &&
      !/^(Admin|Control)/.test(entry.name)
      ? [path]
      : [];
  });
}

describe("public typography floor", () => {
  it("rejects public 10px and 11px text outside the deliberate brand bar", () => {
    const failures = ["components", "pages"]
      .flatMap((directory) => files(join(sourceRoot, directory)))
      .flatMap((path) => {
        const name = relative(sourceRoot, path);
        if (brandBarAllowlist.has(name) || adminOnlyFiles.has(name)) return [];
        return readFileSync(path, "utf8")
          .split("\n")
          .flatMap((line, index) =>
            /text-\[(?:10|11)px\]|fontSize:\s*(?:10|11)\b/.test(line)
              ? [`${name}:${index + 1}`]
              : [],
          );
      });
    expect(failures).toEqual([]);
  });
});
