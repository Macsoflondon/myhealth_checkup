# Fix @lovable.dev/mcp-js transitive vulnerabilities

The scan flags 6 issues in `@lovable.dev/mcp-js@0.26.3`, all from two transitive packages. The advisory data confirms patched versions exist:

- **fast-uri** (4 high: SSRF / host confusion) — vulnerable `< 3.1.6`; the project already pins `fast-uri: ^3.1.5` via overrides, which resolved to 3.1.5 — still inside the vulnerable range.
- **qs** (2 moderate: array-limit bypass, DoS) — vulnerable `< 6.16.0`; lockfile has 6.15.3 and nothing pins it yet.

## Changes

`package.json` only (both the `overrides` and `resolutions` blocks, which already exist):

1. Bump `fast-uri` override from `^3.1.5` to `^3.1.6`.
2. Add `qs: ^6.16.0` to `overrides` and `resolutions`.
3. Regenerate the lockfile (`bun install --save-text-lockfile` / npm install as appropriate) so the pins take effect.

No app code changes. `@lovable.dev/mcp-js` itself is left at 0.26.3 — the latest 2.x is a major upgrade of a platform package, not needed to close these advisories.

## Verification

- Confirm lockfile resolves `fast-uri >= 3.1.6` and `qs >= 6.16.0`.
- `bunx tsgo --noEmit` passes.
- Re-run the dependency security scan; mark the mcp-js findings fixed if clear.
