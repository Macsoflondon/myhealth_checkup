#!/usr/bin/env python3
"""
sync_script_template.py — 6-Hour Refresh Sync Script
=====================================================
Demonstrates how the automated refresh cycle scrapes Medichecks and Lola Health
to keep bloodTests.json up to date. Designed to run every 6 hours via cron/scheduler.

Usage:
    python sync_script_template.py

Dependencies:
    pip install requests beautifulsoup4 pandas openpyxl
"""

import json
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import requests
from bs4 import BeautifulSoup

# ─── Configuration ────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent
JSON_OUTPUT = BASE_DIR / "bloodTests.json"
LOG_FORMAT = "%(asctime)s [%(levelname)s] %(message)s"
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
logger = logging.getLogger("sync_script")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    )
}

REQUEST_TIMEOUT = 30
RATE_LIMIT_DELAY = 2  # seconds between requests


# ─── Medichecks Scraper ───────────────────────────────────────────────────────

class MedichecksScraper:
    """Scrapes the Medichecks blood test catalogue."""

    BASE_URL = "https://www.medichecks.com"
    CATALOGUE_URL = f"{BASE_URL}/blood-tests"

    def fetch_test_listing(self, page: int = 1) -> Optional[list[dict]]:
        """Fetch a page of test listings from Medichecks."""
        url = f"{self.CATALOGUE_URL}?page={page}"
        logger.info(f"[Medichecks] Fetching page {page}: {url}")

        try:
            resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"[Medichecks] Request failed: {e}")
            return None

        soup = BeautifulSoup(resp.text, "html.parser")
        tests = []

        # Example parsing logic — adapt selectors to actual site structure
        product_cards = soup.select(".product-card, .test-card, [data-test-id]")
        for card in product_cards:
            title_el = card.select_one("h2, h3, .product-title, .test-name")
            price_el = card.select_one(".price, .product-price, [data-price]")
            link_el = card.select_one("a[href]")

            if title_el:
                test = {
                    "Provider": "Medichecks",
                    "Test Name": title_el.get_text(strip=True),
                    "Test URL": (
                        self.BASE_URL + link_el["href"]
                        if link_el and link_el.get("href", "").startswith("/")
                        else link_el.get("href", "") if link_el else ""
                    ),
                    "Price": self._parse_price(price_el),
                    "Last Validated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                }
                tests.append(test)

        logger.info(f"[Medichecks] Found {len(tests)} tests on page {page}")
        return tests

    def fetch_test_detail(self, test_url: str) -> Optional[dict]:
        """Fetch detailed info for a single test (biomarkers, categories)."""
        logger.info(f"[Medichecks] Fetching detail: {test_url}")

        try:
            resp = requests.get(test_url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"[Medichecks] Detail request failed: {e}")
            return None

        soup = BeautifulSoup(resp.text, "html.parser")

        # Extract biomarkers list
        biomarker_els = soup.select(".biomarker-name, .biomarker-item, li.biomarker")
        biomarkers = [el.get_text(strip=True) for el in biomarker_els]

        # Extract sample collection method
        sample_el = soup.select_one(".sample-type, .collection-method")
        sample_method = sample_el.get_text(strip=True) if sample_el else None

        return {
            "Biomarkers (from Notes)": ", ".join(biomarkers) if biomarkers else None,
            "Number of Biomarkers": len(biomarkers) if biomarkers else None,
            "Sample Collection Method": sample_method,
        }

    @staticmethod
    def _parse_price(el) -> Optional[float]:
        if not el:
            return None
        text = el.get_text(strip=True).replace("£", "").replace(",", "")
        try:
            return float(text)
        except (ValueError, TypeError):
            return None


# ─── Lola Health Scraper ──────────────────────────────────────────────────────

class LolaHealthScraper:
    """Scrapes the Lola Health blood test catalogue."""

    BASE_URL = "https://www.lolahealth.com"
    CATALOGUE_URL = f"{BASE_URL}/blood-tests"

    def fetch_test_listing(self) -> Optional[list[dict]]:
        """Fetch the full test listing from Lola Health."""
        logger.info(f"[Lola Health] Fetching catalogue: {self.CATALOGUE_URL}")

        try:
            resp = requests.get(
                self.CATALOGUE_URL, headers=HEADERS, timeout=REQUEST_TIMEOUT
            )
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"[Lola Health] Request failed: {e}")
            return None

        soup = BeautifulSoup(resp.text, "html.parser")
        tests = []

        # Example parsing — adapt to actual Lola Health DOM structure
        product_items = soup.select(
            ".product-item, .test-listing-item, [class*='TestCard']"
        )
        for item in product_items:
            title_el = item.select_one("h2, h3, .title, .test-title")
            price_el = item.select_one(".price, span[class*='price']")
            link_el = item.select_one("a[href]")
            biomarker_count_el = item.select_one(
                ".biomarker-count, [class*='biomarker']"
            )

            if title_el:
                test = {
                    "Provider": "Lola Health",
                    "Test Name": title_el.get_text(strip=True),
                    "Test URL": (
                        self.BASE_URL + link_el["href"]
                        if link_el and link_el.get("href", "").startswith("/")
                        else link_el.get("href", "") if link_el else ""
                    ),
                    "Price": self._parse_price(price_el),
                    "Number of Biomarkers": self._parse_count(biomarker_count_el),
                    "Last Validated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                }
                tests.append(test)

        logger.info(f"[Lola Health] Found {len(tests)} tests")
        return tests

    def fetch_test_detail(self, test_url: str) -> Optional[dict]:
        """Fetch detailed biomarker info for a single Lola Health test."""
        logger.info(f"[Lola Health] Fetching detail: {test_url}")

        try:
            resp = requests.get(test_url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"[Lola Health] Detail request failed: {e}")
            return None

        soup = BeautifulSoup(resp.text, "html.parser")

        biomarker_els = soup.select(".biomarker, .marker-name, li[class*='marker']")
        biomarkers = [el.get_text(strip=True) for el in biomarker_els]

        category_els = soup.select(".category-tag, .test-category")
        categories = [el.get_text(strip=True) for el in category_els]

        sample_el = soup.select_one(
            ".sample-info, .collection-type, [class*='sample']"
        )

        return {
            "Biomarkers (from Notes)": ", ".join(biomarkers) if biomarkers else None,
            "Number of Biomarkers": len(biomarkers) if biomarkers else None,
            "Categories": "; ".join(categories) if categories else None,
            "Sample Collection Method": (
                sample_el.get_text(strip=True) if sample_el else None
            ),
        }

    @staticmethod
    def _parse_price(el) -> Optional[float]:
        if not el:
            return None
        text = el.get_text(strip=True).replace("£", "").replace(",", "")
        try:
            return float(text)
        except (ValueError, TypeError):
            return None

    @staticmethod
    def _parse_count(el) -> Optional[int]:
        if not el:
            return None
        import re
        match = re.search(r"(\d+)", el.get_text(strip=True))
        return int(match.group(1)) if match else None


# ─── Sync Orchestrator ────────────────────────────────────────────────────────

class SyncOrchestrator:
    """
    Coordinates the 6-hour refresh cycle:
    1. Scrapes Medichecks and Lola Health for updated test data.
    2. Merges scraped data with existing records (other providers untouched).
    3. Writes an updated bloodTests.json.
    """

    COLUMNS = [
        "Provider", "Test Name", "Test URL", "Sample Collection Method",
        "Number of Biomarkers", "Price", "Biomarkers (from Notes)",
        "Categories", "Goals", "Sub-Goals", "Tags", "Last Validated",
    ]

    def __init__(self):
        self.medichecks = MedichecksScraper()
        self.lola = LolaHealthScraper()

    def load_existing_data(self) -> list[dict]:
        """Load the current bloodTests.json."""
        if JSON_OUTPUT.exists():
            with open(JSON_OUTPUT, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def save_data(self, records: list[dict]) -> None:
        """Write minified JSON output."""
        with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, separators=(",", ":"))
        logger.info(f"Saved {len(records)} records to {JSON_OUTPUT}")

    def merge_scraped_data(
        self, existing: list[dict], scraped: list[dict], provider: str
    ) -> list[dict]:
        """
        Replace records for a given provider with freshly scraped data.
        Records from other providers remain untouched.
        """
        # Keep all records from other providers
        other_records = [r for r in existing if r.get("Provider") != provider]

        # Ensure scraped records have all columns
        for record in scraped:
            for col in self.COLUMNS:
                record.setdefault(col, None)

        merged = other_records + scraped
        logger.info(
            f"Merged: {len(other_records)} other + {len(scraped)} {provider} "
            f"= {len(merged)} total"
        )
        return merged

    def run_sync(self, dry_run: bool = False) -> dict:
        """
        Execute the full sync cycle.

        Args:
            dry_run: If True, scrape but don't overwrite the JSON file.

        Returns:
            Summary dict with counts and status.
        """
        start_time = time.time()
        logger.info("=" * 60)
        logger.info("Starting 6-hour sync cycle")
        logger.info("=" * 60)

        existing = self.load_existing_data()
        logger.info(f"Loaded {len(existing)} existing records")

        summary = {
            "started_at": datetime.now(timezone.utc).isoformat(),
            "medichecks_scraped": 0,
            "lola_health_scraped": 0,
            "total_records": len(existing),
            "errors": [],
        }

        # ── Scrape Medichecks ──
        logger.info("-" * 40)
        logger.info("Scraping Medichecks...")
        mc_tests = []
        for page in range(1, 15):  # Up to 14 pages
            page_tests = self.medichecks.fetch_test_listing(page=page)
            if not page_tests:
                break
            mc_tests.extend(page_tests)
            time.sleep(RATE_LIMIT_DELAY)

        if mc_tests:
            # Fetch details for each test (with rate limiting)
            for test in mc_tests[:5]:  # Demo: limit to 5 detail fetches
                if test.get("Test URL"):
                    detail = self.medichecks.fetch_test_detail(test["Test URL"])
                    if detail:
                        test.update(detail)
                    time.sleep(RATE_LIMIT_DELAY)

            summary["medichecks_scraped"] = len(mc_tests)
            if not dry_run:
                existing = self.merge_scraped_data(existing, mc_tests, "Medichecks")
        else:
            summary["errors"].append("Medichecks: No tests scraped")

        # ── Scrape Lola Health ──
        logger.info("-" * 40)
        logger.info("Scraping Lola Health...")
        lola_tests = self.lola.fetch_test_listing()

        if lola_tests:
            for test in lola_tests[:5]:  # Demo: limit to 5 detail fetches
                if test.get("Test URL"):
                    detail = self.lola.fetch_test_detail(test["Test URL"])
                    if detail:
                        test.update(detail)
                    time.sleep(RATE_LIMIT_DELAY)

            summary["lola_health_scraped"] = len(lola_tests)
            if not dry_run:
                existing = self.merge_scraped_data(existing, lola_tests, "Lola Health")
        else:
            summary["errors"].append("Lola Health: No tests scraped")

        # ── Save Results ──
        if not dry_run and (mc_tests or lola_tests):
            self.save_data(existing)
            summary["total_records"] = len(existing)

        elapsed = time.time() - start_time
        summary["duration_seconds"] = round(elapsed, 2)
        summary["completed_at"] = datetime.now(timezone.utc).isoformat()

        logger.info("=" * 60)
        logger.info(f"Sync complete in {elapsed:.1f}s")
        logger.info(f"  Medichecks: {summary['medichecks_scraped']} tests")
        logger.info(f"  Lola Health: {summary['lola_health_scraped']} tests")
        logger.info(f"  Total records: {summary['total_records']}")
        if summary["errors"]:
            logger.warning(f"  Errors: {summary['errors']}")
        logger.info("=" * 60)

        return summary


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    """
    Run with: python sync_script_template.py
    
    For production 6-hour scheduling, add a cron entry:
        0 */6 * * * /usr/bin/python3 /path/to/sync_script_template.py >> /var/log/health_sync.log 2>&1
    
    Or use a task scheduler / systemd timer.
    """
    orchestrator = SyncOrchestrator()

    # Run in dry_run mode by default for safety during development
    # Set dry_run=False for production use
    result = orchestrator.run_sync(dry_run=True)

    print("\n--- Sync Summary ---")
    print(json.dumps(result, indent=2))
