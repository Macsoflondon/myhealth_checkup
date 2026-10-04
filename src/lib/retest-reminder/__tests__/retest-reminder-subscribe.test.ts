import { describe, it, expect, vi } from "vitest";
import {
  handleRetestSubscribe,
  reminderEmail,
  type NewRetestReminder,
  type SubscribeDeps,
} from "../retest-reminder-core";

function makeDeps() {
  const rows = new Map<string, NewRetestReminder & { token: string; status: string }>();
  const sent: string[] = [];
  const deps: SubscribeDeps = {
    now: () => new Date("2026-10-04T12:00:00Z"),
    countRecent: () => Promise.resolve(0),
    recordHit: () => Promise.resolve(),
    insertIfAbsent(row) {
      const key = `${row.email}|${row.interest_slug}|${row.interval_months}`;
      if (rows.has(key)) return Promise.resolve(null);
      const token = "11111111-1111-4111-8111-111111111111";
      rows.set(key, { ...row, token, status: "pending" });
      return Promise.resolve(token);
    },
    sendEmail(m) {
      sent.push(m.to);
      return Promise.resolve();
    },
  };
  return { deps, rows, sent };
}

const valid = {
  email: "Person@Example.com",
  consent: true,
  interest_type: "biomarker",
  interest_slug: "ferritin",
  interest_label: "Ferritin",
  interval_months: 6,
};

const post = (body: unknown) =>
  new Request("http://x/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("retest reminder subscribe", () => {
  it("rejects missing consent", async () => {
    const { deps, rows } = makeDeps();
    const res = await handleRetestSubscribe(post({ ...valid, consent: undefined }), "1.1.1.1", deps);
    expect(res.status).toBe(400);
    expect(rows.size).toBe(0);
  });

  it("rejects consent that is not literally true", async () => {
    const { deps } = makeDeps();
    const res = await handleRetestSubscribe(post({ ...valid, consent: "true" }), "1.1.1.1", deps);
    expect(res.status).toBe(400);
  });

  it("rejects a bad email", async () => {
    const { deps, rows } = makeDeps();
    const res = await handleRetestSubscribe(post({ ...valid, email: "nope" }), "1.1.1.1", deps);
    expect(res.status).toBe(400);
    expect(rows.size).toBe(0);
  });

  it("honeypot returns success and stores nothing", async () => {
    const { deps, rows, sent } = makeDeps();
    const res = await handleRetestSubscribe(post({ ...valid, hp: "bot" }), "1.1.1.1", deps);
    expect(res.status).toBe(200);
    expect(rows.size).toBe(0);
    expect(sent).toHaveLength(0);
  });

  it("duplicate returns identical success and changes nothing", async () => {
    const { deps, rows, sent } = makeDeps();
    const first = await (await handleRetestSubscribe(post(valid), "1.1.1.1", deps)).json();
    const key = "person@example.com|ferritin|6";
    rows.get(key)!.status = "unsubscribed";
    const res = await handleRetestSubscribe(post(valid), "1.1.1.1", deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(first);
    expect(rows.size).toBe(1);
    expect(rows.get(key)!.status).toBe("unsubscribed");
    expect(sent).toHaveLength(1);
  });

  it("stores lowercased email and remind_at = now + interval", async () => {
    const { deps, rows } = makeDeps();
    await handleRetestSubscribe(post(valid), "1.1.1.1", deps);
    const row = [...rows.values()][0];
    expect(row.email).toBe("person@example.com");
    expect(row.remind_at).toBe("2027-04-04T12:00:00.000Z");
  });

  it("returns 429 at 5 requests per IP per hour", async () => {
    const { deps } = makeDeps();
    deps.countRecent = () => Promise.resolve(5);
    const res = await handleRetestSubscribe(post(valid), "1.1.1.1", deps);
    expect(res.status).toBe(429);
  });

  it("email failure does not fail the request", async () => {
    const { deps } = makeDeps();
    deps.sendEmail = vi.fn().mockRejectedValue(new Error("down"));
    const res = await handleRetestSubscribe(post(valid), "1.1.1.1", deps);
    expect(res.status).toBe(200);
  });

  it("reminder email escapes interpolated values", () => {
    const html = reminderEmail("test", "x", "<script>", "11111111-1111-4111-8111-111111111111");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
