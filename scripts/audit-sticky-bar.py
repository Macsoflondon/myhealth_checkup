#!/usr/bin/env python3
"""
Sticky Category Bar route audit.

1. Extracts every static <Route path="..."> from src/routes/*.tsx (+ src/App.tsx).
2. Visits each route on the local dev server (default http://localhost:8080).
3. Verifies <nav aria-label="Sticky category navigation"> renders in the DOM.
4. Prints a pass/fail table and writes JSON + Markdown reports to
   /tmp/browser/sticky-audit/.

Usage:
  python3 scripts/audit-sticky-bar.py                      # full audit
  python3 scripts/audit-sticky-bar.py --base http://localhost:8080
  python3 scripts/audit-sticky-bar.py --only /wellness,/contact
  python3 scripts/audit-sticky-bar.py --list               # print discovered routes
"""
from __future__ import annotations
import argparse, asyncio, json, os, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROUTE_FILES = [ROOT / "src/App.tsx", *sorted((ROOT / "src/routes").glob("*.tsx"))]
ROUTE_RE = re.compile(r'<Route\s+path=["\']([^"\']+)["\']')
SELECTOR = 'nav[aria-label="Sticky category navigation"]'
HERO_GATED = {"/"}  # homepage: bar hides until hero scrolls past
OUT_DIR = Path("/tmp/browser/sticky-audit")


def discover_routes() -> list[str]:
    found: set[str] = set()
    for f in ROUTE_FILES:
        if not f.exists():
            continue
        for m in ROUTE_RE.finditer(f.read_text(encoding="utf-8")):
            p = m.group(1)
            if "*" in p or ":" in p:
                continue  # skip catch-all / parameterised
            found.add(p if p.startswith("/") else f"/{p}")
    return sorted(found)


async def run(base: str, targets: list[str]) -> int:
    from playwright.async_api import async_playwright

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Auditing {len(targets)} route(s) against {base}\n")
    results = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()
        for path in targets:
            url = f"{base}{path}"
            status, note, http = "pass", "", 0
            try:
                resp = await page.goto(url, wait_until="domcontentloaded", timeout=15000)
                http = resp.status if resp else 0
                try:
                    await page.wait_for_load_state("networkidle", timeout=5000)
                except Exception:
                    pass
                present = await page.locator(SELECTOR).first.count()
                if path in HERO_GATED:
                    # Bar is rendered into the DOM but visually hero-gated; presence is fine.
                    status = "pass" if present else "fail"
                    note = "hero-gated (DOM present)" if present else "StickyCategoryBar missing"
                else:
                    status = "pass" if present else "fail"
                    if not present:
                        note = "StickyCategoryBar missing"
            except Exception as e:
                status = "error"
                note = str(e).splitlines()[0][:160]
            icon = {"pass": "v", "fail": "x", "warn": "!", "error": "."}[status]
            print(f"{icon} {path:<48} {status.upper():<6} {note}")
            results.append({"path": path, "status": status, "http": http, "note": note})
        await browser.close()

    summary = {
        "base": base,
        "total": len(results),
        "pass": sum(r["status"] == "pass" for r in results),
        "fail": sum(r["status"] == "fail" for r in results),
        "warn": sum(r["status"] == "warn" for r in results),
        "error": sum(r["status"] == "error" for r in results),
        "results": results,
    }
    (OUT_DIR / "report.json").write_text(json.dumps(summary, indent=2))
    md = [
        "# Sticky Category Bar Audit",
        f"Base: {base}",
        "",
        f"**{summary['pass']}** pass · **{summary['fail']}** fail · "
        f"**{summary['warn']}** warn · **{summary['error']}** error (of {summary['total']})",
        "",
        "| Status | Route | Note |",
        "| --- | --- | --- |",
        *[f"| {r['status']} | `{r['path']}` | {r['note']} |" for r in results],
    ]
    (OUT_DIR / "report.md").write_text("\n".join(md))
    print(f"\nReports: {OUT_DIR}/report.json  {OUT_DIR}/report.md")
    return 1 if (summary["fail"] or summary["error"]) else 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://localhost:8080")
    ap.add_argument("--only", default="")
    ap.add_argument("--list", action="store_true")
    a = ap.parse_args()
    routes = discover_routes()
    if a.list:
        print("\n".join(routes))
        return 0
    only = [s.strip() for s in a.only.split(",") if s.strip()]
    targets = [r for r in routes if r in only] if only else routes
    if not targets:
        print("No routes to audit.", file=sys.stderr)
        return 1
    return asyncio.run(run(a.base, targets))


if __name__ == "__main__":
    sys.exit(main())
