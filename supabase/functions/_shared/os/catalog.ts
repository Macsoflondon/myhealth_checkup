/**
 * AI OS plugin catalogue for Crux Control.
 *
 * Pure data with no imports and no runtime APIs, so the os-plugins edge
 * function (Deno) and the dashboard (Vite) load the same definitions.
 * Adding a plugin: add an entry here, an adapter in
 * supabase/functions/os-plugins/adapters/, and register the adapter in
 * supabase/functions/os-plugins/adapters/index.ts.
 */

export type OsPluginCategory =
  "clicks" | "traffic" | "social" | "revenue" | "platform";

/**
 * native: data the platform records itself (no credentials, always live).
 * sync: pulled from a third-party API by the hourly os-plugins sync.
 * service: called on demand (the AI briefing).
 */
export type OsPluginKind = "native" | "sync" | "service";

export type OsPluginSecret = {
  /** Edge function environment variable name, also the Vault key. */
  key: string;
  label: string;
  help: string;
  /** Multi-line value such as a service account JSON key. */
  multiline?: boolean;
  /**
   * Vault namespace when several plugins share one credential, e.g. the
   * Google service account used by both GA4 and Search Console. Defaults to
   * the plugin id.
   */
  scope?: string;
};

export type OsPluginSecretGroup = {
  label: string;
  secrets: OsPluginSecret[];
};

export type OsPluginConfigField = {
  key: string;
  label: string;
  help: string;
  /** text: one string. list: comma-separated strings. map: "key=value" lines. */
  type: "text" | "list" | "map";
  required?: boolean;
  placeholder?: string;
};

export type OsPluginDefinition = {
  id: string;
  name: string;
  category: OsPluginCategory;
  kind: OsPluginKind;
  summary: string;
  /** Any one complete group is enough. Empty for plugins with no credentials. */
  secretGroups: OsPluginSecretGroup[];
  config: OsPluginConfigField[];
  defaultConfig: Record<string, unknown>;
  /** Snapshot datasets the sync writes to os_plugin_snapshots. */
  datasets: string[];
  docsUrl: string | null;
  limitations: string[];
  privacy: string;
};

const GOOGLE_SERVICE_ACCOUNT: OsPluginSecret = {
  key: "GOOGLE_SERVICE_ACCOUNT_JSON",
  label: "Google service account key (JSON)",
  help: "Create a service account in Google Cloud, download its JSON key and paste the whole file. Grant the account read access in GA4 (Property access management, Viewer) and in Search Console (Users and permissions, Restricted).",
  multiline: true,
  scope: "google",
};

export const OS_PLUGINS: readonly OsPluginDefinition[] = [
  {
    id: "provider_clicks",
    name: "Provider clicks",
    category: "clicks",
    kind: "native",
    summary:
      "Every click from a myhealth checkup page to a provider's site, logged by /api/public/affiliate-click.",
    secretGroups: [],
    config: [],
    defaultConfig: {},
    datasets: [],
    docsUrl: null,
    limitations: [
      "Clicks from automation browsers, crawlers and fast repeat sweeps are counted but kept out of qualified clicks.",
      "A click shows intent to visit a provider. It does not confirm a booking.",
    ],
    privacy:
      "Stores the provider, test, page path and placement only. No IP address, user agent or account id.",
  },
  {
    id: "conversion_import",
    name: "Conversion import",
    category: "revenue",
    kind: "native",
    summary:
      "Affiliate conversions uploaded as CSV on the Affiliate admin page.",
    secretGroups: [],
    config: [],
    defaultConfig: {},
    datasets: [],
    docsUrl: "/admin/affiliate",
    limitations: [
      "Revenue appears only after someone imports the network's report.",
    ],
    privacy: "Stores network references and amounts. No customer details.",
  },
  {
    id: "site_status",
    name: "Site status",
    category: "platform",
    kind: "sync",
    summary: "Checks each hour that the public site answers, and how fast.",
    secretGroups: [],
    config: [
      {
        key: "urls",
        label: "Addresses to check",
        help: "Comma-separated full URLs.",
        type: "list",
        required: true,
        placeholder: "https://www.myhealthcheckup.co.uk/",
      },
    ],
    defaultConfig: {
      urls: [
        "https://www.myhealthcheckup.co.uk/",
        "https://myhealthcheckup.co.uk/",
      ],
    },
    datasets: ["checks"],
    docsUrl: null,
    limitations: [
      "Checks run from Supabase's network, so they confirm the site is reachable from the internet, not from every region.",
    ],
    privacy: "Sends one anonymous request per address.",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    category: "traffic",
    kind: "sync",
    summary:
      "Sessions, users, key events, top pages, channels and outbound link clicks from the GA4 Data API.",
    secretGroups: [
      { label: "Google service account", secrets: [GOOGLE_SERVICE_ACCOUNT] },
    ],
    config: [
      {
        key: "property_id",
        label: "GA4 property ID",
        help: "Numbers only. GA4 Admin, Property settings.",
        type: "text",
        required: true,
        placeholder: "123456789",
      },
    ],
    defaultConfig: {},
    datasets: ["daily", "top_pages", "channels", "outbound_clicks"],
    docsUrl:
      "https://developers.google.com/analytics/devguides/reporting/data/v1",
    limitations: [
      "GA4 only records visitors who accept analytics cookies, so it undercounts compared with first-party clicks.",
      "The sync reads complete days up to yesterday. Today's figures appear tomorrow.",
      "Outbound clicks need GA4 enhanced measurement turned on.",
    ],
    privacy:
      "Reads aggregated reports only. No visitor-level data leaves Google.",
  },
  {
    id: "search_console",
    name: "Google Search Console",
    category: "traffic",
    kind: "sync",
    summary:
      "Search clicks, impressions, click-through rate and position, with top queries and pages.",
    secretGroups: [
      {
        label:
          "Lovable connector (the sitemap resubmission job already uses it)",
        secrets: [
          {
            key: "LOVABLE_API_KEY",
            label: "Lovable API key",
            help: "Set by Lovable for edge functions. Paste it here only if the sync reports it missing.",
          },
          {
            key: "GOOGLE_SEARCH_CONSOLE_API_KEY",
            label: "Search Console connection key",
            help: "The connection key of the Google Search Console connector in Lovable.",
          },
        ],
      },
      { label: "Google service account", secrets: [GOOGLE_SERVICE_ACCOUNT] },
    ],
    config: [
      {
        key: "site_url",
        label: "Search Console property",
        help: "Exactly as Search Console lists it, e.g. https://myhealthcheckup.co.uk/ or sc-domain:myhealthcheckup.co.uk.",
        type: "text",
        required: true,
        placeholder: "https://myhealthcheckup.co.uk/",
      },
    ],
    // The site redirects www to the apex, and the connected Google account
    // has access to the apex URL-prefix property (checked 9 Oct 2026).
    defaultConfig: { site_url: "https://myhealthcheckup.co.uk/" },
    datasets: ["daily", "top_queries", "top_pages"],
    docsUrl:
      "https://developers.google.com/webmaster-tools/v1/searchanalytics/query",
    limitations: [
      "Google publishes Search Console data two to three days late.",
      "Google withholds rare queries for privacy, so query totals sum to less than the daily totals.",
    ],
    privacy: "Reads aggregated search data only.",
  },
  {
    id: "metricool",
    name: "Social media (Metricool)",
    category: "social",
    kind: "sync",
    summary:
      "Followers and recent posts with their reach and engagement for the Facebook, Instagram and TikTok accounts connected in Metricool.",
    secretGroups: [
      {
        label: "Metricool API",
        secrets: [
          {
            key: "METRICOOL_USER_TOKEN",
            label: "Metricool API token",
            help: "Metricool, Account settings, API. The API needs the Advanced or Custom plan.",
          },
        ],
      },
    ],
    config: [
      {
        key: "user_id",
        label: "Metricool user ID",
        help: "The number after userId= in Metricool's address bar.",
        type: "text",
        required: true,
      },
      {
        key: "blog_id",
        label: "Metricool brand ID",
        help: "The number after blogId= in Metricool's address bar.",
        type: "text",
        required: true,
      },
      {
        key: "timezone",
        label: "Time zone",
        help: "IANA time zone used for daily figures.",
        type: "text",
        required: true,
        placeholder: "Europe/London",
      },
      {
        key: "networks",
        label: "Networks",
        help: "Comma-separated: facebook, instagram, tiktok.",
        type: "list",
        required: true,
      },
    ],
    // Brand "Myhealth Checkup" as listed by Metricool on 2026-10-09. These are
    // account identifiers, not credentials; the API token stays in Vault.
    defaultConfig: {
      user_id: "5383189",
      blog_id: "6977338",
      timezone: "Europe/London",
      networks: ["facebook", "instagram", "tiktok"],
    },
    datasets: ["posts", "followers"],
    docsUrl: "https://app.metricool.com/resources/apidocs/index.html",
    limitations: [
      "Metricool only exposes its API on the Advanced and Custom plans.",
      "Each network reports a different set of metrics, so some columns stay empty for some networks.",
    ],
    privacy:
      "Reads the brand's own public posts and account totals. No follower identities.",
  },
  {
    id: "awin",
    name: "Awin affiliate network",
    category: "revenue",
    kind: "sync",
    summary:
      "Pulls Awin transactions from the last 90 days into affiliate conversions, matched to provider clicks where possible.",
    secretGroups: [
      {
        label: "Awin API",
        secrets: [
          {
            key: "AWIN_API_TOKEN",
            label: "Awin API token",
            help: "Awin, Account, API credentials, Create API token.",
          },
        ],
      },
    ],
    config: [
      {
        key: "publisher_id",
        label: "Awin publisher ID",
        help: "Your Awin publisher (affiliate) account number.",
        type: "text",
        required: true,
      },
      {
        key: "advertiser_map",
        label: "Advertiser to provider",
        help: "One line per advertiser: awin-advertiser-id=provider-id, e.g. 12345=medichecks. Unmapped advertisers are stored as awin-<id>.",
        type: "map",
      },
    ],
    defaultConfig: { advertiser_map: {} },
    datasets: ["summary"],
    docsUrl:
      "https://help.awin.com/apidocs/returns-a-list-of-transactions-for-a-given-publisher",
    limitations: [
      "Awin returns at most 31 days per request, so each sync makes three requests.",
      "Conversions match a click only when the provider's sub-ID parameter carries our click id (set subIdParam to clickref in src/lib/affiliate/affiliate-config.ts).",
      "Only GBP transactions are stored.",
    ],
    privacy:
      "Stores transaction references and amounts. Awin does not share customer details with publishers.",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "revenue",
    kind: "sync",
    summary:
      "Daily gross, fees, refunds and net from Stripe balance transactions, for revenue paid to us directly.",
    secretGroups: [
      {
        label: "Stripe restricted key",
        secrets: [
          {
            key: "STRIPE_SECRET_KEY",
            label: "Stripe restricted key",
            help: "Developers, API keys, Create restricted key with Read access to Balance transactions only.",
          },
        ],
      },
    ],
    config: [],
    defaultConfig: {},
    datasets: ["daily"],
    docsUrl: "https://docs.stripe.com/api/balance_transactions/list",
    limitations: [
      "GBP only.",
      "Each sync reads up to 2,000 balance transactions from the last 90 days and says so when it stops short.",
    ],
    privacy: "Reads amounts and dates only. No card or customer details.",
  },
  {
    id: "ai_briefing",
    name: "AI briefing (Claude)",
    category: "platform",
    kind: "service",
    summary:
      "Writes a short summary of the dashboard's figures. Every number it states must match a figure on the dashboard, or the dashboard drops that line.",
    secretGroups: [
      {
        label: "Anthropic API",
        secrets: [
          {
            key: "ANTHROPIC_API_KEY",
            label: "Anthropic API key",
            help: "console.anthropic.com, API keys.",
          },
        ],
      },
    ],
    config: [],
    defaultConfig: {},
    datasets: [],
    docsUrl: "https://docs.claude.com/en/api/overview",
    limitations: [
      "Without a key the dashboard shows rule-based insights only.",
    ],
    privacy:
      "Sends aggregated dashboard figures only. No visitor or customer data.",
  },
];

export function getOsPlugin(id: string): OsPluginDefinition | undefined {
  return OS_PLUGINS.find((p) => p.id === id);
}

/** Vault namespace for a secret: its shared scope, or the plugin id. */
export function secretScope(
  plugin: OsPluginDefinition,
  secret: OsPluginSecret,
): string {
  return secret.scope ?? plugin.id;
}
