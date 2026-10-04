export type RetestInterestType = "test" | "biomarker";
export type RetestInterval = 3 | 6 | 12;

export interface RetestReminderRequest {
  email: string;
  interestType: RetestInterestType;
  interestSlug: string;
  interestLabel: string;
  intervalMonths: RetestInterval;
  consent: boolean;
  hp: string;
}

export async function subscribeRetestReminder(req: RetestReminderRequest): Promise<void> {
  const res = await fetch("/api/public/retest-reminder/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: req.email,
      interest_type: req.interestType,
      interest_slug: req.interestSlug,
      interest_label: req.interestLabel,
      interval_months: req.intervalMonths,
      consent: req.consent,
      hp: req.hp,
    }),
  });
  if (!res.ok) throw new Error(`subscribe failed: ${res.status}`);
}
