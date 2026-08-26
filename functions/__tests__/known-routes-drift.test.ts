import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { isKnownRoute } from "../_known-routes";

/**
 * Guards against allow-list drift: every file-based route under src/routes must
 * be recognised by the Cloudflare middleware, otherwise real pages return 404.
 */
const IGNORED_PREFIXES = ["__root", "api", "[.]lovable"];

const toPath = (file: string): string => {
  const base = file.replace(/\.tsx?$/, "");
  const segments = base
    .split(".")
    .filter((segment) => segment !== "index")
    .map((segment) => (segment.startsWith("$") ? "sample" : segment));
  return `/${segments.join("/")}`.replace(/\/+$/, "") || "/";
};

describe("known-routes allow-list", () => {
  const files = readdirSync(resolve(process.cwd(), "src/routes"))
    .filter((file) => /\.tsx?$/.test(file))
    .filter((file) => !IGNORED_PREFIXES.some((prefix) => file.startsWith(prefix)));

  it.each(files)("recognises %s", (file) => {
    expect(isKnownRoute(toPath(file))).toBe(true);
  });
});
