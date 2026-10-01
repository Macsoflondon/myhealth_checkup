import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  moreNavigationItems,
  primaryNavigationItems,
} from "@/components/header/NavigationItems";

/**
 * Every internal link in the main navigation, mega menus, footer, HTML site map
 * page and public/sitemap.xml must resolve to a registered file-based route.
 */
const root = process.cwd();
const routeFiles = readdirSync(resolve(root, "src/routes")).filter(
  (f) => /\.tsx?$/.test(f) && !f.startsWith("__root") && !f.startsWith("api."),
);

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const routePatterns: RegExp[] = routeFiles.map((file) => {
  const segments = file
    .replace(/\.tsx?$/, "")
    .replace(/\[\.\]/g, "\u0000")
    .split(".")
    .map((s) => s.replace(/\u0000/g, "."))
    .filter((s) => s !== "index" && !s.startsWith("_"));
  const body = segments
    .map((s) => (s === "$" ? ".+" : s.startsWith("$") ? "[^/]+" : escapeRe(s)))
    .join("/");
  return new RegExp(`^/${body}/?$`);
});

const toPath = (href: string): string => {
  const noOrigin = href.replace(/^https?:\/\/[^/]+/, "");
  const path = noOrigin.split(/[?#]/)[0] ?? "/";
  return path === "" ? "/" : path;
};

const isRegistered = (href: string): boolean => {
  const path = toPath(href);
  return routePatterns.some((re) => re.test(path));
};

const literalLinks = (file: string): string[] => {
  const src = readFileSync(resolve(root, file), "utf8");
  return [...src.matchAll(/(?:to|path)[=:]\s*["'](\/[^"']*)["']/g)].map(
    (m) => m[1] ?? "",
  );
};

const navLinks = [
  ...primaryNavigationItems.flatMap((i) => [
    i.path,
    ...(i.dropdownItems ?? []).map((d) => d.path),
  ]),
  ...moreNavigationItems.map((i) => i.path),
];

const sitemapLinks = [
  ...readFileSync(resolve(root, "public/sitemap.xml"), "utf8").matchAll(
    /<loc>([^<]+)<\/loc>/g,
  ),
].map((m) => (m[1] ?? "").trim());

const sources: Record<string, string[]> = {
  navigation: navLinks,
  footer: literalLinks("src/components/layout/Footer.tsx"),
  "site map page": literalLinks("src/pages/SitemapPage.tsx"),
  "sitemap.xml": sitemapLinks,
};

describe("navigation and sitemap links", () => {
  it.each(Object.entries(sources))(
    "every %s link resolves to a registered route",
    (_name, links) => {
      expect(links.length).toBeGreaterThan(0);
      expect(links.filter((l) => !isRegistered(l))).toEqual([]);
    },
  );

  it("sitemap.xml lists no duplicate URLs", () => {
    expect(new Set(sitemapLinks).size).toBe(sitemapLinks.length);
  });
});
