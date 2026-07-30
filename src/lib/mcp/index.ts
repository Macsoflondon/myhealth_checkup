import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchTests from "./tools/search-tests";
import getTest from "./tools/get-test";
import listProviders from "./tools/list-providers";
import listMyFavourites from "./tools/list-my-favourites";
import saveFavourite from "./tools/save-favourite";
import getPlatformHealth from "./tools/get-platform-health";
import listScraperAlerts from "./tools/list-scraper-alerts";
import getCatalogueCoverage from "./tools/get-catalogue-coverage";
import getPriceMovements from "./tools/get-price-movements";
import getSecurityPosture from "./tools/get-security-posture";
import getPerformanceSummary from "./tools/get-performance-summary";
import getBusinessSummary from "./tools/get-business-summary";
import getAdminAuditTrail from "./tools/get-admin-audit-trail";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "myhealth-checkup-mcp",
  title: "myhealth checkup",
  version: "0.2.0",
  instructions:
    "Tools for myhealth checkup — the UK private diagnostics comparison platform. Use search_tests and get_test to compare private blood tests and cancer screening across UKAS-accredited, CQC-regulated providers (prices in GBP, turnaround in days). list_providers enumerates partner labs. list_my_favourites and save_favourite act on the signed-in user's saved tests. " +
    "The admin tools (get_platform_health, list_scraper_alerts, get_catalogue_coverage, get_price_movements, get_security_posture, get_performance_summary, get_business_summary, get_admin_audit_trail) are strictly read-only and operational or commercial in nature: scraper and job health, catalogue freshness, pricing movements, security posture metadata, anonymous performance aggregates, and aggregate business totals. They require the signed-in user to hold the admin role, every call is audit-logged, and they contain no patient data — no test results, biomarker readings, health records or personal identifiers are exposed through this server by design. " +
    "This platform is decision infrastructure only — never present results as medical advice or diagnosis.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchTests,
    getTest,
    listProviders,
    listMyFavourites,
    saveFavourite,
    getPlatformHealth,
    listScraperAlerts,
    getCatalogueCoverage,
    getPriceMovements,
    getSecurityPosture,
    getPerformanceSummary,
    getBusinessSummary,
    getAdminAuditTrail,
  ],
});
