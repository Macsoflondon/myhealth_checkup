/**
 * Section registry for the AI OS dashboard (Crux Control).
 *
 * Add a subsystem by appending an entry here: it appears in the sidebar, the
 * command palette and routes at /control/:slug.
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
  Share2,
  PoundSterling,
  Plug,
} from "lucide-react";

export type SectionStatus = "live" | "beta" | "stub";

export type SectionGroup = "command" | "growth" | "operations" | "system";

export const SECTION_GROUPS: { id: SectionGroup; label: string }[] = [
  { id: "command", label: "Command" },
  { id: "growth", label: "Growth" },
  { id: "operations", label: "Operations" },
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
    slug: "social",
    title: "Social media",
    short: "Social",
    description:
      "Followers and recent posts on Facebook, Instagram and TikTok.",
    icon: Share2,
    status: "live",
    group: "growth",
    usesRange: true,
    component: lazy(() => import("./sections/SocialSection")),
  },
  {
    slug: "revenue",
    title: "Revenue",
    short: "Revenue",
    description: "Affiliate commission and direct payments.",
    icon: PoundSterling,
    status: "live",
    group: "growth",
    usesRange: true,
    component: lazy(() => import("./sections/RevenueSection")),
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
    slug: "soc-watch",
    title: "SOC Watch",
    short: "SOC Watch",
    description:
      "Read-only security operations monitoring and signal correlation.",
    icon: Siren,
    status: "live",
    group: "operations",
    usesRange: false,
    component: lazy(() => import("./sections/SocWatchSection")),
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
