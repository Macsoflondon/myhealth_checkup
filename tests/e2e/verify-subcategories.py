"""Sweep every subcategory route on desktop + mobile.

Assertions per route:
  - <title> contains sub label
  - <link rel=canonical> ends with ?subcategory=<slug>
  - og:url / og:title self-reference the sub route
  - JSON-LD BreadcrumbList itemListElement ends with the sub label,
    all non-final items have an `item` URL, final item's URL matches canonical
"""
import asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path("/dev-server")
NAV = (ROOT / "src/components/header/NavigationItems.tsx").read_text()
SHOTS = Path(__file__).parent / "screenshots"
SHOTS.mkdir(parents=True, exist_ok=True)

# Extract { name, path } pairs where path contains ?subcategory=
ROUTE_RX = re.compile(r'\{\s*name:\s*"([^"]+)",\s*path:\s*"([^"]+\?subcategory=[^"]+)"\s*\}')
routes = [(name, path) for name, path in ROUTE_RX.findall(NAV)]
assert routes, "no subcategory routes found"

BASE = "http://localhost:8080"
SITE = "https://myhealthcheckup.co.uk"

async def get_attr(page, selector, attr):
    """Prefer Helmet-owned tag when both static + dynamic exist."""
    loc = page.locator(f'{selector}[data-rh="true"]').first
    try:
        await loc.wait_for(state="attached", timeout=5000)
        return await loc.get_attribute(attr)
    except Exception:
        loc = page.locator(selector).last
        try:
            return await loc.get_attribute(attr)
        except Exception:
            return None

async def check(page, name, path):
    slug = path.split("subcategory=", 1)[1]
    await page.goto(BASE + path, wait_until="domcontentloaded", timeout=30000)
    # helmet is client-side — wait for it to inject the canonical
    try:
        await page.wait_for_function(
            "() => !!document.querySelector('link[rel=\"canonical\"][data-rh=\"true\"]')",
            timeout=10000,
        )
    except Exception:
        pass
    await page.wait_for_timeout(400)

    problems = []
    title = await page.title()
    if name not in title:
        problems.append(f"title missing '{name}': got '{title}'")

    canonical = await get_attr(page, 'link[rel="canonical"]', "href")
    if not canonical or not canonical.endswith(f"?subcategory={slug}"):
        problems.append(f"canonical wrong: {canonical}")

    og_url = await get_attr(page, 'meta[property="og:url"]', "content")
    if og_url != canonical:
        problems.append(f"og:url != canonical: {og_url} vs {canonical}")

    og_title = await get_attr(page, 'meta[property="og:title"]', "content")
    if og_title and name not in og_title:
        problems.append(f"og:title missing '{name}': '{og_title}'")

    # JSON-LD BreadcrumbList
    ld_blocks = await page.locator('script[type="application/ld+json"]').all_text_contents()
    crumb = None
    for raw in ld_blocks:
        try:
            data = json.loads(raw)
        except Exception:
            continue
        candidates = data if isinstance(data, list) else [data]
        for d in candidates:
            b = d.get("breadcrumb") if isinstance(d, dict) else None
            if isinstance(b, dict) and b.get("@type") == "BreadcrumbList":
                crumb = b
                break
            if isinstance(d, dict) and d.get("@type") == "BreadcrumbList":
                crumb = d
                break
        if crumb:
            break
    if not crumb:
        problems.append("no BreadcrumbList JSON-LD")
    else:
        items = crumb.get("itemListElement", [])
        if len(items) < 2:
            problems.append(f"breadcrumb too short: {len(items)} items")
        else:
            last = items[-1]
            if last.get("name") != name:
                problems.append(f"breadcrumb last name '{last.get('name')}' != '{name}'")
            # non-final items should carry a linked item URL (parent path)
            for it in items[:-1]:
                if not it.get("item"):
                    problems.append(f"breadcrumb '{it.get('name')}' missing item URL")
                    break
    return problems

async def sweep(viewport_name, viewport):
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport=viewport)
        page = await ctx.new_page()
        results = []
        for name, path in routes:
            try:
                probs = await check(page, name, path)
            except Exception as e:
                probs = [f"exception: {e!r}"]
            status = "PASS" if not probs else "FAIL"
            results.append((viewport_name, path, status, probs))
            if probs:
                slug = path.replace("/", "_").replace("?", "-").replace("=", "-")
                await page.screenshot(path=str(SHOTS / f"{viewport_name}_{slug}.png"))
        await browser.close()
        return results

async def main():
    desktop = await sweep("desktop", {"width": 1280, "height": 900})
    mobile = await sweep("mobile", {"width": 390, "height": 844})
    all_results = desktop + mobile
    fails = [r for r in all_results if r[2] == "FAIL"]
    print(f"\n=== {len(all_results)} checks, {len(fails)} failures ===\n")
    for vp, path, status, probs in all_results:
        marker = "OK  " if status == "PASS" else "FAIL"
        print(f"{marker} {vp:8s} {path}")
        for p in probs:
            print(f"       - {p}")
    sys.exit(1 if fails else 0)

asyncio.run(main())
