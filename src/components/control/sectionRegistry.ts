/**
 * Section registry for the AI OS dashboard (Crux Control).
 *
 * Add a subsystem by appending an entry here: it appears in the sidebar, the
 * command palette and routes at /control/:slug. The former /admin/* pages live
 * here too, under the same slug, and /admin/:slug redirects to them.
 */
import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";
import {
  Activity,
  Radar,
  Bot,
  ClipboardCheck,
  Building2,
  ScrollText,
  Bell,
  Search,
  Download,
  Gauge,
  Siren,
  Sparkles,
  MousePointerClick,
  BarChart3,
  PoundSterling,
  Plug,
  Handshake,
  LayoutDashboard,
  RefreshCw,
  Database,
  Map as MapIcon,
  Upload,
  FlaskConical,
  ListChecks,
  Server,
  Timer,
  Globe,
  Stethoscope,
  History,
  FileSearch,
  BellRing,
  KeyRound,
  ShieldCheck,
  Share2,
} from "lucide-react";

export type SectionStatus = "live" | "beta" | "stub";

export type SectionGroup =
  "command" | "growth" | "catalogue" | "operations" | "security" | "system";

export const SECTION_GROUPS: { id: SectionGroup; label: string }[] = [
  { id: "command", label: "Command" },
  { id: "growth", label: "Growth" },
  { id: "catalogue", label: "Catalogue and data" },
  { id: "operations", label: "Operations" },
  { id: "security", label: "Security" },
  { id: "system", label: "System" },
];

export interface ControlSection {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  status: SectionStatus;
  group: SectionGroup;
  /** Shows the 7/28/90-day range picker in the header. */
  usesRange: boolean;
  component: LazyExoticComponent<ComponentType>;
}

export const DEFAULT_SECTION = "command";

export const CONTROL_SECTIONS: ControlSection[] = [
  {
    slug: "command",
    title: "Command centre",
    short: "Command",
    description:
      "AI briefing and the headline figures from every connected source.",
    icon: Sparkles,
    status: "live",
    group: "command",
    usesRange: true,
    component: lazy(() => import("./sections/CommandSection")),
  },
  {
    slug: "clicks",
    title: "Provider clicks",
    short: "Clicks",
    description:
      "Clicks from our pages to provider sites, with automated traffic separated out.",
    icon: MousePointerClick,
    status: "live",
    group: "growth",
    usesRange: true,
    component: lazy(() => import("./sections/ClicksSection")),
  },
  {
    slug: "traffic",
    title: "Traffic and search",
    short: "Traffic",
    description: "Google Analytics 4 and Google Search Console.",
    icon: BarChart3,
    status: "live",
    group: "growth",
    usesRange: true,
    component: lazy(() => import("./sections/TrafficSection")),
  },
  {
    slug: "revenue",
    title: "Revenue",
    short: "Revenue",
    description: "Affiliate commission from imported network reports.",
    icon: PoundSterling,
    status: "live",
    group: "growth",
    usesRange: true,
    component: lazy(() => import("./sections/RevenueSection")),
  },
  {
    slug: "affiliate",
    title: "Affiliate imports",
    short: "Affiliate imports",
    description:
      "Booking-link clicks and conversions imported from affiliate networks. Commission never affects ranking.",
    icon: Handshake,
    status: "live",
    group: "growth",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminAffiliatePage")),
  },
  {
    slug: "test-dashboard",
    title: "Test catalogue",
    short: "Test catalogue",
    description:
      "Master tests with every provider's listing, price and biomarker count.",
    icon: LayoutDashboard,
    status: "live",
    group: "catalogue",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminTestDashboardPage")),
  },
  {
    slug: "scrapers",
    title: "Scraper jobs",
    short: "Scrapers",
    description:
      "Manual runs of the older scraper functions, with job history, alerts and category checks. The scheduled mhc-* price sync runs on its own.",
    icon: RefreshCw,
    status: "live",
    group: "catalogue",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminScraperDashboardPage")),
  },
  {
    slug: "data-refresh",
    title: "Data refresh",
    short: "Data refresh",
    description:
      "Run the older per-provider scrapers by hand, with the database copy as backup. The scheduled mhc-* price sync runs on its own.",
    icon: Database,
    status: "live",
    group: "catalogue",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminDataRefreshPage")),
  },
  {
    slug: "test-mapper",
    title: "Test mapper",
    short: "Test mapper",
    description:
      "Map unmatched provider tests to master tests and review uncertain matches.",
    icon: MapIcon,
    status: "live",
    group: "catalogue",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminTestMapperPage")),
  },
  {
    slug: "test-upload",
    title: "Test upload",
    short: "Test upload",
    description:
      "Load the bundled Medichecks and London Medical Laboratory test lists into the database. This can overwrite scraped prices.",
    icon: Upload,
    status: "live",
    group: "catalogue",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminTestUploadPage")),
  },
  {
    slug: "biomarker-audit",
    title: "Biomarker audit",
    short: "Biomarker audit",
    description:
      "Check stored biomarkers against each provider's live product page, then approve corrections one by one.",
    icon: FlaskConical,
    status: "live",
    group: "catalogue",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminBiomarkerAuditPage")),
  },
  {
    slug: "biomarker-validation",
    title: "Biomarker validation",
    short: "Biomarker validation",
    description:
      "Active tests whose biomarker list is missing, empty or does not match the stated count.",
    icon: ListChecks,
    status: "live",
    group: "catalogue",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminBiomarkerValidationPage")),
  },
  {
    slug: "overview",
    title: "Platform health",
    short: "Platform health",
    description: "Platform health score, services, build and environment.",
    icon: Gauge,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("./sections/OverviewSection")),
  },
  {
    slug: "live",
    title: "Live operational metrics",
    short: "Live metrics",
    description: "Rate limits, CSP reports and audit events in the last hour.",
    icon: Activity,
    status: "beta",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("./sections/LiveMetricsSection")),
  },
  {
    slug: "crawls",
    title: "Crawl and scrape centre",
    short: "Crawls",
    description: "Provider crawlers: status, history and manual controls.",
    icon: Radar,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("./sections/CrawlsSection")),
  },
  {
    slug: "automations",
    title: "Automation centre",
    short: "Automations",
    description: "Cron jobs, background workers and scheduled tasks.",
    icon: Bot,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("./sections/AutomationsSection")),
  },
  {
    slug: "audits",
    title: "Audit centre",
    short: "Audits",
    description:
      "SEO, security, accessibility, performance and content audits.",
    icon: ClipboardCheck,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("./sections/AuditsSection")),
  },
  {
    slug: "providers",
    title: "Provider monitoring",
    short: "Providers",
    description: "Per-provider catalogue, prices, biomarkers and changes.",
    icon: Building2,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("./sections/ProvidersSection")),
  },
  {
    slug: "logs",
    title: "System logs",
    short: "Logs",
    description: "Searchable error, API, cron, crawler and auth logs.",
    icon: ScrollText,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("./sections/LogsSection")),
  },
  {
    slug: "notifications",
    title: "Notification centre",
    short: "Alerts",
    description: "Prioritised alerts from every subsystem.",
    icon: Bell,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("./sections/NotificationsSection")),
  },
  {
    slug: "ops",
    title: "Operations status",
    short: "Ops status",
    description: "Cron jobs and edge functions over the last day.",
    icon: Server,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminOpsPage")),
  },
  {
    slug: "performance",
    title: "Runtime performance",
    short: "Performance",
    description: "Slowest edge functions, worst Web Vitals and cron durations.",
    icon: Timer,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminPerformancePage")),
  },
  {
    slug: "seo-status",
    title: "SEO status",
    short: "SEO status",
    description:
      "Crawlability signals: sitemap, robots.txt and live 404 checks for public routes.",
    icon: Globe,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminSeoStatusPage")),
  },
  {
    slug: "clinical-safety",
    title: "Clinical safety",
    short: "Clinical safety",
    description:
      "Live severity stream, SOC incidents, AI decisions and the execution engine.",
    icon: Stethoscope,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminClinicalSafetyPage")),
  },
  {
    slug: "change-log",
    title: "Change log",
    short: "Change log",
    description: "Every admin action in admin_activity_log, newest first.",
    icon: History,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminChangeLogPage")),
  },
  {
    slug: "soc-watch",
    title: "SOC Watch",
    short: "SOC Watch",
    description:
      "Read-only security operations monitoring and signal correlation.",
    icon: Siren,
    status: "live",
    group: "security",
    usesRange: false,
    component: lazy(() => import("./sections/SocWatchSection")),
  },
  {
    slug: "audit-console",
    title: "Audit console",
    short: "Audit console",
    description: "Search and export the audit trail from every source.",
    icon: FileSearch,
    status: "live",
    group: "security",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminAuditConsolePage")),
  },
  {
    slug: "alert-routing",
    title: "Alert routing",
    short: "Alert routing",
    description:
      "Choose who receives each alert email. The audit console logs every change.",
    icon: BellRing,
    status: "live",
    group: "security",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminAlertRoutingPage")),
  },
  {
    slug: "encryption-status",
    title: "Encryption status",
    short: "Encryption",
    description:
      "Check encrypted personal data coverage and active encryption secrets before rotating keys.",
    icon: KeyRound,
    status: "live",
    group: "security",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminEncryptionStatusPage")),
  },
  {
    slug: "security-diff",
    title: "Security scan diff",
    short: "Security diff",
    description:
      "Hourly snapshots of database security posture, with changes between runs flagged. Also issues admin recovery tokens.",
    icon: ShieldCheck,
    status: "live",
    group: "security",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminSecurityDiffPage")),
  },
  {
    slug: "data-sharing",
    title: "Data sharing grants",
    short: "Data sharing",
    description:
      "Read-only trail of patient-issued FHIR sharing grants. Patients manage their own revocations.",
    icon: Share2,
    status: "live",
    group: "security",
    usesRange: false,
    component: lazy(() => import("@/pages/AdminDataSharingPage")),
  },
  {
    slug: "plugins",
    title: "Plugins and data sources",
    short: "Plugins",
    description:
      "Connect APIs, store credentials in Vault, run and inspect syncs.",
    icon: Plug,
    status: "live",
    group: "system",
    usesRange: false,
    component: lazy(() => import("./sections/PluginsSection")),
  },
  {
    slug: "search",
    title: "Global search",
    short: "Search",
    description: "Search across providers, tests, logs, audits and errors.",
    icon: Search,
    status: "stub",
    group: "system",
    usesRange: false,
    component: lazy(() => import("./sections/SearchSection")),
  },
  {
    slug: "export",
    title: "Export centre",
    short: "Export",
    description: "Export CSV, Excel, PDF and JSON reports.",
    icon: Download,
    status: "stub",
    group: "system",
    usesRange: false,
    component: lazy(() => import("./sections/ExportSection")),
  },
];

/**
 * Retired slugs and where they now live. "analytics" read raw funnel_events
 * client-side (capped at 1,000 rows, automated clicks included); the Clicks
 * and Revenue sections replace it with server-side summaries.
 */
export const SECTION_ALIASES: Record<string, string> = {
  analytics: "clicks",
};

export const getSection = (slug: string) =>
  CONTROL_SECTIONS.find((s) => s.slug === slug);
