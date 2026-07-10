/**
 * Modular section registry for the Operations Control Centre.
 *
 * Add a new admin/ops subsystem by appending an entry here — it will
 * automatically appear in the sidebar nav and route at /control/:slug.
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
  LineChart,
  Search,
  Download,
  Gauge,
  Siren,
} from "lucide-react";

export type SectionStatus = "live" | "beta" | "stub";

export interface ControlSection {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  status: SectionStatus;
  component: LazyExoticComponent<ComponentType>;
}

export const CONTROL_SECTIONS: ControlSection[] = [
  {
    slug: "overview",
    title: "Executive Overview",
    short: "Overview",
    description: "Platform health score, services, build & environment.",
    icon: Gauge,
    status: "live",
    component: lazy(() => import("./sections/OverviewSection")),
  },
  {
    slug: "live",
    title: "Live Operational Metrics",
    short: "Live Metrics",
    description: "Real-time traffic, conversions, API and error rates.",
    icon: Activity,
    status: "beta",
    component: lazy(() => import("./sections/LiveMetricsSection")),
  },
  {
    slug: "crawls",
    title: "Crawl & Scrape Centre",
    short: "Crawls",
    description: "All provider crawlers — status, history & manual controls.",
    icon: Radar,
    status: "live",
    component: lazy(() => import("./sections/CrawlsSection")),
  },
  {
    slug: "automations",
    title: "Automation Centre",
    short: "Automations",
    description: "Cron jobs, background workers and scheduled tasks.",
    icon: Bot,
    status: "live",
    component: lazy(() => import("./sections/AutomationsSection")),
  },
  {
    slug: "audits",
    title: "Audit Centre",
    short: "Audits",
    description: "SEO, security, accessibility, performance & content audits.",
    icon: ClipboardCheck,
    status: "live",
    component: lazy(() => import("./sections/AuditsSection")),
  },
  {
    slug: "providers",
    title: "Provider Monitoring",
    short: "Providers",
    description: "Per-provider catalog, prices, biomarkers & changes.",
    icon: Building2,
    status: "live",
    component: lazy(() => import("./sections/ProvidersSection")),
  },
  {
    slug: "logs",
    title: "System Logs",
    short: "Logs",
    description: "Searchable error, API, cron, crawler & auth logs.",
    icon: ScrollText,
    status: "live",
    component: lazy(() => import("./sections/LogsSection")),
  },
  {
    slug: "notifications",
    title: "Notification Centre",
    short: "Alerts",
    description: "Prioritised alerts from every subsystem.",
    icon: Bell,
    status: "live",
    component: lazy(() => import("./sections/NotificationsSection")),
  },
  {
    slug: "soc-watch",
    title: "SOC Watch",
    short: "SOC Watch",
    description: "Read-only security operations monitoring and signal correlation.",
    icon: Siren,
    status: "live",
    component: lazy(() => import("./sections/SocWatchSection")),
  },
  {
    slug: "analytics",
    title: "Historical Analytics",
    short: "Analytics",
    description: "Trend dashboards across traffic, revenue & ops.",
    icon: LineChart,
    status: "stub",
    component: lazy(() => import("./sections/AnalyticsSection")),
  },
  {
    slug: "search",
    title: "Global Search",
    short: "Search",
    description: "Search across providers, tests, logs, audits & errors.",
    icon: Search,
    status: "stub",
    component: lazy(() => import("./sections/SearchSection")),
  },
  {
    slug: "export",
    title: "Export Centre",
    short: "Export",
    description: "Export CSV / Excel / PDF / JSON reports.",
    icon: Download,
    status: "stub",
    component: lazy(() => import("./sections/ExportSection")),
  },
];

export const getSection = (slug: string) =>
  CONTROL_SECTIONS.find((s) => s.slug === slug);
