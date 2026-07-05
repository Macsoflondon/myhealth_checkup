import type { SocReversibleAction } from "@/api/supabase/socIncidents.api";

export interface SocPlaybookAction {
  key: SocReversibleAction;
  label: string;
  destructive?: boolean;
  description: string;
}

export interface SocPlaybook {
  source: string;
  title: string;
  steps: string[];
  actions: SocPlaybookAction[];
}

// Static, hand-curated playbooks. All actions are reversible or idempotent.
export const socPlaybooks: Record<string, SocPlaybook> = {
  "protected-call": {
    source: "protected-call",
    title: "Denied protected call playbook",
    steps: [
      "Confirm the caller is not a legitimate admin whose token expired.",
      "Check the function referenced — a spike on a single function usually means a client bug or automated probe.",
      "If the caller_id is a UUID, look up the user in role_audit_log to check recent role changes.",
      "If the ip_address is external and volume is high, add a Cloudflare rule or WAF block outside this app.",
      "Resolve the incident with a note describing the caller, likely intent, and any external action taken.",
    ],
    actions: [],
  },
  "scraper-alert": {
    source: "scraper-alert",
    title: "Scraper alert playbook",
    steps: [
      "Open /admin/scrapers and check the provider's last successful run.",
      "Look at the alert_type — count regressions usually indicate a template change on the provider site.",
      "Trigger a manual re-scrape if the change is transient; open a ticket to update selectors if not.",
      "Use the action below to acknowledge every open alert for this (provider, alert_type) pair in one go.",
    ],
    actions: [
      {
        key: "acknowledge_scraper_alerts_for_entity",
        label: "Acknowledge all matching scraper alerts",
        description: "Sets acknowledged=true on every scraper_alerts row for this provider + alert_type.",
      },
      {
        key: "reverse_acknowledge_scraper_alerts_for_entity",
        label: "Undo: reopen those alerts",
        destructive: true,
        description: "Reverses the acknowledge action for the same entity.",
      },
    ],
  },
  "operational-alert": {
    source: "operational-alert",
    title: "Operational alert playbook",
    steps: [
      "Check the source module in the alert entity (e.g. 'ingest:provider:foo').",
      "Look at operational_alerts.occurrence_count — small counts are often self-healing; large counts warrant investigation.",
      "If the underlying issue is fixed, mark all matching alerts resolved with the action below.",
    ],
    actions: [
      {
        key: "resolve_operational_alerts_for_entity",
        label: "Resolve all matching operational alerts",
        description: "Sets is_resolved=true on every operational_alerts row for this (source, entity_type, entity_name).",
      },
      {
        key: "reverse_resolve_operational_alerts_for_entity",
        label: "Undo: reopen those alerts",
        destructive: true,
        description: "Reverses the resolve action for the same entity.",
      },
    ],
  },
  "edge-function": {
    source: "edge-function",
    title: "Edge function failure playbook",
    steps: [
      "Open the Supabase Edge Functions logs for this function (link on the ops dashboard).",
      "Look for a stack trace or 5xx response body — most failures cluster around a single cause.",
      "If it's a deploy regression, roll back the function; if it's a downstream dependency, mitigate at that layer.",
      "Resolve with a link to the fix commit or a note describing the mitigation.",
    ],
    actions: [],
  },
  cron: {
    source: "cron",
    title: "Cron failure playbook",
    steps: [
      "Open cron_run_log for this job on the ops dashboard.",
      "Repeated failures on a single job usually mean the target function or SQL changed shape.",
      "Manually run the underlying function once to confirm the fix, then resolve.",
    ],
    actions: [],
  },
  csp: {
    source: "csp",
    title: "CSP violation playbook",
    steps: [
      "Group by violated_directive — a burst on one directive is usually a script/asset URL change.",
      "Compare against the current CSP header baseline in the security memory.",
      "Either whitelist the legitimate origin in CSP, or remove the offending third-party asset.",
      "Resolve with the diff to the CSP header if changed.",
    ],
    actions: [],
  },
  "security-scan": {
    source: "security-scan",
    title: "Security scan finding playbook",
    steps: [
      "Open the security scan snapshot from the timestamp in the incident.",
      "Triage each finding — the linter reports remediation guidance inline.",
      "Fix issues via migration and re-scan to confirm zero-out.",
    ],
    actions: [],
  },
};

export function playbookForSource(source: string): SocPlaybook {
  return socPlaybooks[source] ?? {
    source,
    title: "Generic incident playbook",
    steps: [
      "Inspect the sample signal IDs and the entity value.",
      "Check the corresponding source table for recent activity.",
      "Resolve with a note describing the root cause and any mitigation.",
    ],
    actions: [],
  };
}
