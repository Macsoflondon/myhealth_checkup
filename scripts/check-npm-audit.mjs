// Fails when npm audit reports a high or critical advisory that is not
// listed in ALLOWLIST. Every entry needs a reason and an expiry date.
// An expired entry fails the check again, which forces a fresh review.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const ALLOWLIST = [
  {
    id: "GHSA-6qxp-vccf-f47h",
    expires: "2026-11-09",
    reason:
      "@modelcontextprotocol/sdk OAuth client advisory with no patched " +
      "release. @lovable.dev/mcp-js imports only the SDK server modules " +
      "and this repository hosts an MCP server, so the client code is unused.",
  },
];

const BLOCKING = new Set(["high", "critical"]);

function advisoryId(url) {
  const match = /GHSA-[a-z0-9-]+/i.exec(url ?? "");
  return match ? match[0] : String(url);
}

/** Returns each high or critical advisory once, from `npm audit --json`. */
export function collectAdvisories(report) {
  const found = new Map();
  for (const vuln of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vuln.via ?? []) {
      // String entries only name another affected package.
      if (typeof via === "string" || !BLOCKING.has(via.severity)) continue;
      const id = advisoryId(via.url);
      if (!found.has(id)) {
        found.set(id, {
          id,
          severity: via.severity,
          name: via.name,
          title: via.title,
        });
      }
    }
  }
  return [...found.values()];
}

export function evaluate(report, allowlist, today) {
  const advisories = collectAdvisories(report);
  const seen = new Set(advisories.map((item) => item.id));
  const blocking = [];
  const accepted = [];
  const expired = [];
  for (const advisory of advisories) {
    const entry = allowlist.find((item) => item.id === advisory.id);
    if (!entry) blocking.push(advisory);
    else if (entry.expires < today) expired.push({ ...advisory, ...entry });
    else accepted.push({ ...advisory, ...entry });
  }
  const unused = allowlist.filter((item) => !seen.has(item.id));
  return { blocking, accepted, expired, unused };
}

function readReport() {
  try {
    const output = execFileSync("npm", ["audit", "--json"], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    return JSON.parse(output);
  } catch (error) {
    // npm audit exits non-zero when it finds anything, and still prints JSON.
    if (error.stdout) return JSON.parse(error.stdout);
    throw error;
  }
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  const { blocking, accepted, expired, unused } = evaluate(
    readReport(),
    ALLOWLIST,
    today,
  );
  for (const item of accepted) {
    console.log(
      `Accepted until ${item.expires}: ${item.id} (${item.severity}) ` +
        `${item.name}. ${item.reason}`,
    );
  }
  for (const item of unused) {
    console.log(`No longer reported, remove from ALLOWLIST: ${item.id}`);
  }
  for (const item of expired) {
    console.error(
      `Exception expired on ${item.expires}: ${item.id} (${item.severity}) ` +
        `${item.name}. Review it, then renew or remove the entry.`,
    );
  }
  for (const item of blocking) {
    console.error(
      `Blocking: ${item.id} (${item.severity}) ${item.name}: ${item.title}`,
    );
  }
  if (blocking.length > 0 || expired.length > 0) process.exit(1);
  console.log("No unaccepted high or critical advisories.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
