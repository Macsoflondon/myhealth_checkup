# Part 16: hosting-compatible script CSP

27/11/2026. No publication or database migration.

Removed strict-dynamic from script-src. The directive retains self, the per-response nonce, Cookiebot sources on public pages and the existing preview source rule. Inline scripts still need the nonce. Other CSP directives, nonce generation, nonced Cookiebot elements and private HTML Cache-Control are unchanged. Admin pages still omit Cookiebot.

## Verification

- All 1,369 platform unit tests passed; the 19 security-header tests also passed after formatting. Tests reject strict-dynamic and unsafe-inline in script-src across public/admin and production/preview policies, with and without nonces.
- Changed-file ESLint and git diff checks passed.
- Automatic compilation reports build OK. A separately invoked production build was not run because this sandbox prohibits manual project builds; production artefact verification remains unavailable.
- Browser checks on `/`, `/compare`, `/cookies` and `/tests/heart` returned 200 with distinct nonces, private/no-cache HTML headers, React-attached controls, zero page errors and zero securitypolicyviolation events. Cookiebot loaded with nonced script elements on all four pages.
- Interactive `/compare` filtering changed rendered results. A nonce-free same-origin `/__l5e/part16-check.js` test script executed under the actual revised response CSP without violations. This script was intercepted inside the test browser only, not added to the app.
- The published site's actual injected analytics script and visit recording were not reverified: the site was intentionally not published. Preview/browser compatibility is verified, not production deployment.

Domain workflow: mhc-skill-os (SECURE/VERIFY).