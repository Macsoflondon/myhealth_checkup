import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guards the shared type scale in src/styles.css. Each step must stay
 * clearly larger than the step below it at every breakpoint, phones
 * included, so page titles never drift back towards section-title size.
 */

const css = readFileSync(resolve(__dirname, "styles.css"), "utf8");

const BREAKPOINTS = [375, 640, 768, 1024, 1280] as const;
const ROOT_PX = 16;
/** Minimum ratio between neighbouring heading steps. */
const MIN_HEADING_RATIO = 1.2;

function utilityBody(name: string): string {
  const start = css.indexOf(`@utility ${name} {`);
  if (start === -1) throw new Error(`@utility ${name} not found`);
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") depth--;
    if (depth === 0) return css.slice(start, i + 1);
  }
  throw new Error(`@utility ${name} is not closed`);
}

function toPx(value: string): number {
  const m = value.trim().match(/^([\d.]+)(rem|px)$/);
  if (!m) throw new Error(`Unsupported font-size value: ${value}`);
  return m[2] === "rem" ? Number(m[1]) * ROOT_PX : Number(m[1]);
}

/** Returns the font size (px) the utility resolves to at a viewport width. */
function sizeAt(name: string, width: number): number {
  const body = utilityBody(name);
  const inner = body.slice(body.indexOf("{") + 1, -1);
  const base = inner
    .replace(/@media[^{]*\{[^}]*\}/g, "")
    .match(/font-size:\s*([^;]+);/);
  if (!base) throw new Error(`${name} has no base font-size`);
  let size = toPx(base[1]);
  const media = [
    ...inner.matchAll(
      /@media\s*\(min-width:\s*(\d+)px\)\s*\{\s*font-size:\s*([^;]+);\s*\}/g,
    ),
  ]
    .map((m) => ({ min: Number(m[1]), px: toPx(m[2]) }))
    .sort((a, b) => a.min - b.min);
  for (const step of media) if (width >= step.min) size = step.px;
  return size;
}

describe("type scale in src/styles.css", () => {
  it.each(BREAKPOINTS)("keeps clear steps at %ipx", (width) => {
    const page = sizeAt("type-page-title", width);
    const section = sizeAt("type-section-title", width);
    const subsection = sizeAt("type-subsection-title", width);
    const card = sizeAt("type-card-title", width);
    const body = sizeAt("type-body", width);
    const small = sizeAt("type-small", width);
    const minor = Math.max(subsection, card);

    expect(page / section).toBeGreaterThanOrEqual(MIN_HEADING_RATIO);
    expect(section / minor).toBeGreaterThanOrEqual(MIN_HEADING_RATIO);
    expect(minor).toBeGreaterThan(body);
    expect(body).toBeGreaterThan(small);
  });

  it("keeps page titles in the 44 to 48px range on desktop", () => {
    const page = sizeAt("type-page-title", 1280);
    expect(page).toBeGreaterThanOrEqual(44);
    expect(page).toBeLessThanOrEqual(48);
  });

  it("defines the eyebrow utility below the minor heading step", () => {
    for (const width of BREAKPOINTS) {
      expect(sizeAt("type-eyebrow", width)).toBeLessThan(
        sizeAt("type-subsection-title", width),
      );
    }
  });

  it("uses Montserrat for every heading utility", () => {
    for (const name of [
      "type-page-title",
      "type-section-title",
      "type-subsection-title",
      "type-card-title",
      "type-eyebrow",
    ]) {
      expect(utilityBody(name)).toMatch(/font-family:[^;]*Montserrat/);
    }
  });
});
