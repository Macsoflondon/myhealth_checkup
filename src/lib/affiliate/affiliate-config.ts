/**
 * Per-provider affiliate settings. Fill in `subIdParam` with the sub-ID
 * parameter each affiliate network expects (for example "subid", "clickref"
 * or "utm_content"). When it is null the click is still logged, but the
 * outbound URL is left unchanged.
 */
export type AffiliateProviderConfig = {
  /** Hostnames (and their subdomains) that belong to this provider. */
  hosts: readonly string[];
  /** Query parameter that carries our click_id, or null if not configured. */
  subIdParam: string | null;
};

export const AFFILIATE_PROVIDERS: Readonly<
  Record<string, AffiliateProviderConfig>
> = {
  medichecks: { hosts: ["medichecks.com"], subIdParam: null },
  randox: { hosts: ["randoxhealth.com", "randox.com"], subIdParam: null },
  "london-medical-laboratory": {
    hosts: ["londonmedicallaboratory.com"],
    subIdParam: null,
  },
  "lola-health": { hosts: ["lolahealth.com"], subIdParam: null },
  "goodbody-clinic": { hosts: ["goodbodyclinic.com"], subIdParam: null },
  "london-health-company": {
    hosts: ["londonhealthcompany.co.uk"],
    subIdParam: null,
  },
  "medical-diagnosis": {
    hosts: ["medical-diagnosis.co.uk"],
    subIdParam: null,
  },
  clinilabs: { hosts: ["clinilabs.co.uk"], subIdParam: null },
};

/** Returns the provider id that owns a hostname, or null. */
export function providerForHost(hostname: string): string | null {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  for (const [providerId, cfg] of Object.entries(AFFILIATE_PROVIDERS)) {
    if (cfg.hosts.some((h) => host === h || host.endsWith(`.${h}`))) {
      return providerId;
    }
  }
  return null;
}
