import { defineMcp } from "@lovable.dev/mcp-js";
import searchTests from "./tools/search-tests";
import getTest from "./tools/get-test";
import listProviders from "./tools/list-providers";
import listCategories from "./tools/list-categories";
import getProvider from "./tools/get-provider";
import compareTests from "./tools/compare-tests";
import findTestsByBiomarker from "./tools/find-tests-by-biomarker";
import { installDenoServeRateLimit } from "./rate-limit";

// Public, anonymous, read-only catalogue server. 60 requests/min per IP.
installDenoServeRateLimit();

export const PUBLIC_TOOLS = [
  searchTests,
  getTest,
  listProviders,
  listCategories,
  getProvider,
  compareTests,
  findTestsByBiomarker,
];

export default defineMcp({
  name: "myhealth-checkup-public-mcp",
  title: "myhealth checkup (public catalogue)",
  version: "0.1.0",
  instructions:
    "Public, read-only tools for myhealth checkup, the UK private diagnostics comparison platform. No sign-in needed. Use search_tests, get_test, compare_tests, find_tests_by_biomarker, list_categories, list_providers and get_provider to compare private blood tests and cancer screening across every listed provider. Each provider and test carries its accreditation flags and an accreditation_status (confirmed, not_confirmed or failed); only describe a provider as accredited when the status is confirmed. Prices are in GBP and turnaround is in days. " +
    "Rules: prices are provider-published and can change, so always show the updated_at date alongside any price. Never rank or recommend a provider on commercial grounds; order only by the criteria the user asks for. Disclose affiliate relationships where present. Do not imply any NHS integration. State that results are for comparison only and are not medical advice. " +
    "Requests are limited to 60 per minute per IP address.",
  tools: PUBLIC_TOOLS,
});
