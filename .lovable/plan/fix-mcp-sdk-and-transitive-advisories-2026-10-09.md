# Fix the MCP SDK advisory and two transitive advisories with real upgrades

Date: 2026-10-09

## Problem

The Dependency Vulnerability Scan failed on five findings, all reached through dependencies we do not control directly:

- GHSA-6qxp-vccf-f47h (high): `@modelcontextprotocol/sdk` 1.28.0, pinned exactly by `@lovable.dev/mcp-js`. Patched in 1.31.0.
- GHSA-rj75-hqrm-r3gf (moderate): `postcss-selector-parser` 6.0.10, pinned exactly by `@tailwindcss/typography`. Patched in 7.1.6.
- GHSA-g7r4-m6w7-qqqr (low): `esbuild` 0.27.7, nested under `@lovable.dev/mcp-js`. Patched in 0.28.1.

## Fix

Add all three packages to both `overrides` and `resolutions` in `package.json`, following the same approach as the earlier mcp-js transitive fix. The lockfile now resolves the SDK to 1.32.1, esbuild to 0.28.2 and postcss-selector-parser to 7.1.6. `npm audit` reports 0 vulnerabilities at every severity, so the workflow uses the plain `npm audit --audit-level=high` check again with no exception list.

## Verification

- `npm ci`, all 681 unit tests and `npm run build` pass.
- Every build output file is byte-identical to a build made before the change, apart from two files that embed build timestamps. The generated `mcp` and `mcp-public` edge function sources are unchanged.
- A live protocol check through `@lovable.dev/mcp-js` on SDK 1.32.1 passed `initialize`, `tools/list` and `tools/call`.

## Removal condition

Deployed edge functions import `npm:@lovable.dev/mcp-js@0.26.3`, which resolves its own SDK pin (1.28.0) at runtime in Deno. The overrides above only change what this repository installs. MCP servers are not affected by the advisory, which concerns OAuth clients. When Lovable ships an `@lovable.dev/mcp-js` release that pins SDK 1.31.0 or later, upgrade it and delete the `@modelcontextprotocol/sdk` and `esbuild` overrides. Keep the `postcss-selector-parser` override until `@tailwindcss/typography` moves to a patched release.
