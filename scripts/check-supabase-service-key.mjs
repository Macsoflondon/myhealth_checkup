#!/usr/bin/env node
/**
 * Checks that SUPABASE_SERVICE_ROLE_KEY holds a service-role key for this
 * project, and prints what it found without printing the key.
 *
 * A legacy Supabase key is a JWT whose payload states its role ("anon" or
 * "service_role") and project ref. Neither claim is secret, so logging them
 * lets CI say exactly why a call failed (wrong role, wrong project, stray
 * whitespace from a paste) instead of a bare 401 or row-level-security error.
 *
 * Usage: node scripts/check-supabase-service-key.mjs [expected-project-ref]
 *
 * Set REQUIRE_SB_SECRET=1 when the key goes to an edge function that compares
 * the bearer string with its own SUPABASE_SERVICE_ROLE_KEY (security-scan-
 * snapshot, promote-provider-tests). In this project that runtime value is an
 * sb_secret_ key, the same one stored in Vault as service_role_key, so a
 * genuine legacy service_role JWT still gets a 401. supabase-js callers
 * (Blog aggregate) accept either form.
 */
const EXPECTED_REF = process.argv[2] || "clvuioagsgfadynuvodj";
const raw = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const problems = [];
const facts = [`length ${raw.length}`];

if (raw !== raw.trim())
  problems.push(
    "the value has leading or trailing whitespace (often a line break from the paste)",
  );
const key = raw.trim();

if (key.startsWith("sb_secret_")) {
  facts.push("format: secret API key (sb_secret_)");
} else if (key.startsWith("sb_publishable_")) {
  facts.push("format: publishable key (sb_publishable_)");
  problems.push("this is the public publishable key, not a service-role key");
} else {
  const parts = key.split(".");
  if (parts.length !== 3) {
    facts.push("format: not a JWT");
    problems.push(
      "the value is not a complete JWT (expected three dot-separated parts); it may be truncated",
    );
  } else {
    let payload = null;
    try {
      payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    } catch {
      problems.push(
        "the JWT payload could not be decoded; the value may be truncated or altered",
      );
    }
    if (payload) {
      facts.push(
        `format: legacy JWT, role "${payload.role}", project ref "${payload.ref}"`,
      );
      if (payload.role !== "service_role")
        problems.push(`the JWT role is "${payload.role}", not "service_role"`);
      else if (process.env.REQUIRE_SB_SECRET === "1")
        problems.push(
          "this is a valid legacy service_role key, but the edge function compares it with its own key, " +
            "which in this project is the sb_secret_ secret key (Supabase > Project Settings > API Keys > Secret keys)",
        );
      if (payload.ref && payload.ref !== EXPECTED_REF)
        problems.push(
          `the key belongs to project "${payload.ref}", not "${EXPECTED_REF}"`,
        );
    }
  }
}

console.log(`SUPABASE_SERVICE_ROLE_KEY: ${facts.join("; ")}.`);
if (problems.length) {
  for (const p of problems)
    console.log(`::error::SUPABASE_SERVICE_ROLE_KEY: ${p}.`);
  process.exit(1);
}
console.log("SUPABASE_SERVICE_ROLE_KEY: service-role key for this project.");
