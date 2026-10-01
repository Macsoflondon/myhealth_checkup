import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchTests from "./tools/search-tests";
import getTest from "./tools/get-test";
import listProviders from "./tools/list-providers";
import listCategories from "./tools/list-categories";
import getProvider from "./tools/get-provider";
import compareTests from "./tools/compare-tests";
import findTestsByBiomarker from "./tools/find-tests-by-biomarker";
import listMyFavourites from "./tools/list-my-favourites";
import saveFavourite from "./tools/save-favourite";
import removeFavourite from "./tools/remove-favourite";
import getPlatformHealth from "./tools/get-platform-health";
import listScraperAlerts from "./tools/list-scraper-alerts";
import getCatalogueCoverage from "./tools/get-catalogue-coverage";
import listStaleTests from "./tools/list-stale-tests";
import getDataQuality from "./tools/get-data-quality";
import getPriceMovements from "./tools/get-price-movements";
import getSecurityPosture from "./tools/get-security-posture";
import getPerformanceSummary from "./tools/get-performance-summary";
import getBusinessSummary from "./tools/get-business-summary";
import getAdminAuditTrail from "./tools/get-admin-audit-trail";
import getAffiliatePerformance from "./tools/get-affiliate-performance";

const projectRef =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "myhealth-checkup-mcp",
  title: "myhealth checkup",
  version: "0.3.0",
  instructions:
    "Tools for myhealth checkup, the UK private diagnostics comparison platform. Use search_tests, get_test, compare_tests, find_tests_by_biomarker, list_categories, list_providers and get_provider to compare private blood tests and cancer screening across every listed provider. Each provider and test carries its accreditation flags and an accreditation_status (confirmed, not_confirmed or failed); only describe a provider as accredited when the status is confirmed (prices in GBP, turnaround in days). list_my_favourites, save_favourite and remove_favourite act on the signed-in user's saved tests. " +
    "The admin tools (get_platform_health, list_scraper_alerts, get_catalogue_coverage, list_stale_tests, get_data_quality, get_price_movements, get_security_posture, get_performance_summary, get_business_summary, get_admin_audit_trail, get_affiliate_performance) are strictly read-only: scraper and job health, catalogue freshness and quality, pricing movements, security posture metadata, anonymous performance aggregates and aggregate business totals. They require the admin role and every call, including denied attempts, is audit-logged. They return no patient data; some include pseudonymous user IDs, and free-text fields are truncated. " +
    "Rules: prices are provider-published and can change, so always show the updated_at date alongside any price. Never rank or recommend a provider on commercial grounds; order only by the criteria the user asks for. Disclose affiliate relationships where present. Do not imply any NHS integration. State that results are for comparison only and are not medical advice. " +
    "This platform is decision infrastructure only; never present results as medical advice or diagnosis.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchTests,
    getTest,
    listProviders,
    listCategories,
    getProvider,
    compareTests,
    findTestsByBiomarker,
    listMyFavourites,
    saveFavourite,
    removeFavourite,
    getPlatformHealth,
    listScraperAlerts,
    getCatalogueCoverage,
    listStaleTests,
    getDataQuality,
    getPriceMovements,
    getSecurityPosture,
    getPerformanceSummary,
    getBusinessSummary,
    getAdminAuditTrail,
    getAffiliatePerformance,
  ],
});
