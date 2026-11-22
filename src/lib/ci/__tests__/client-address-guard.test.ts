import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";

const allowed = new Set([
  "src/lib/mcp/rate-limit.ts",
  "src/lib/mcp/__tests__/client-ip.test.ts",
  "supabase/functions/_shared/client-ip.ts",
  "supabase/functions/_shared/client-ip.test.ts",
]);

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === ".git") return [];
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? files(path)
      : /\.[cm]?[jt]sx?$/.test(path)
        ? [path]
        : [];
  });
}

function readsForwardedHeader(source: string): boolean {
  if (!source.toLowerCase().includes("x-forwarded-for")) return false;
  const ast = ts.createSourceFile(
    "file.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const matches: ts.Node[] = [];
  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node)) {
      const method = ts.isPropertyAccessExpression(node.expression)
        ? node.expression.name.text
        : ts.isElementAccessExpression(node.expression) &&
            ts.isStringLiteralLike(node.expression.argumentExpression)
          ? node.expression.argumentExpression.text
          : "";
      const header = node.arguments[0];
      if (
        ["get", "has"].includes(method) &&
        header &&
        ts.isStringLiteralLike(header) &&
        header.text.toLowerCase() === "x-forwarded-for"
      )
        matches.push(node);
    }
    if (
      ts.isElementAccessExpression(node) &&
      ts.isStringLiteralLike(node.argumentExpression) &&
      node.argumentExpression.text.toLowerCase() === "x-forwarded-for"
    )
      matches.push(node);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return matches.length > 0;
}

it("guard recognises normal, mixed-case and bracket address reads", () => {
  expect(readsForwardedHeader('headers.get("x-forwarded-for")')).toBe(true);
  expect(readsForwardedHeader('headers["get"]("X-Forwarded-For")')).toBe(true);
  expect(readsForwardedHeader('headers["x-forwarded-for"]')).toBe(true);
  expect(
    readsForwardedHeader('new Headers({ "x-forwarded-for": "203.0.113.77" })'),
  ).toBe(false);
});

it("no site or Edge function reads X-Forwarded-For outside the approved helpers and tests", () => {
  const violations = [...files("src"), ...files("supabase/functions")]
    .filter(
      (path) =>
        !allowed.has(relative(process.cwd(), path).replaceAll("\\", "/")),
    )
    .filter((path) => readsForwardedHeader(readFileSync(path, "utf8")));
  expect(violations).toEqual([]);
});
