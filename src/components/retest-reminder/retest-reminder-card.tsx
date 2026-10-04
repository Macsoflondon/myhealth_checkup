import { useId, useState, type FormEvent } from "react";
import {
  subscribeRetestReminder,
  type RetestInterestType,
  type RetestInterval,
} from "@/api/supabase/retestReminders.api";

export const RETEST_CONSENT_TEXT =
  "I agree to receive one email from myhealth checkup at the time I chose. I can unsubscribe at any time.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface RetestReminderCardProps {
  interestType: RetestInterestType;
  interestSlug: string;
  interestLabel: string;
  /** Injected for tests; defaults to the real service call. */
  submit?: typeof subscribeRetestReminder;
  now?: () => Date;
}

interface FieldErrors {
  email?: string;
  consent?: string;
  form?: string;
}

export function validateRetestForm(email: string, consent: boolean): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = email.trim();
  if (!trimmed) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(trimmed) || trimmed.length > 254)
    errors.email = "Enter an email address like name@example.com.";
  if (!consent) errors.consent = "Tick the box so we can send you the email.";
  return errors;
}

function addMonths(from: Date, months: number): Date {
  const d = new Date(from.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
}

export function RetestReminderCard({
  interestType,
  interestSlug,
  interestLabel,
  submit = subscribeRetestReminder,
  now = () => new Date(),
}: RetestReminderCardProps) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [interval, setIntervalMonths] = useState<RetestInterval>(6);
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [doneDate, setDoneDate] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validateRetestForm(email, consent);
    setErrors(v);
    if (v.email || v.consent) return;
    setSubmitting(true);
    try {
      await submit({
        email: email.trim().toLowerCase(),
        interestType,
        interestSlug,
        interestLabel,
        intervalMonths: interval,
        consent: true,
        hp,
      });
      setDoneDate(
        addMonths(now(), interval).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    } catch {
      setErrors({ form: "We could not set your reminder. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="relative rounded-2xl border border-brand-turquoise/40 bg-white p-4 text-brand-navy sm:p-6"
    >
      <h3 id={`${id}-heading`} className="text-lg font-bold">
        Get a reminder to look again
      </h3>
      <p className="mt-1 text-sm text-brand-navy/70">One email. No account needed.</p>

      {doneDate ? (
        <p role="status" className="mt-4 font-semibold">
          Done. We will email you on {doneDate}.
        </p>
      ) : (
        <form noValidate onSubmit={onSubmit} className="mt-4 space-y-4">
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={`${id}-hp`}>Leave this field empty</label>
            <input
              id={`${id}-hp`}
              name="hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <label htmlFor={`${id}-email`} className="block text-sm font-semibold">
                Email address
              </label>
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${id}-email-err` : undefined}
                className="mt-1 min-h-11 w-full rounded-lg border border-brand-navy/30 px-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
              />
              {errors.email && (
                <p id={`${id}-email-err`} className="mt-1 text-sm text-brand-pink">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor={`${id}-interval`} className="block text-sm font-semibold">
                Remind me in
              </label>
              <select
                id={`${id}-interval`}
                value={interval}
                onChange={(e) => setIntervalMonths(Number(e.target.value) as RetestInterval)}
                className="mt-1 min-h-11 w-full rounded-lg border border-brand-navy/30 bg-white px-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
              >
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor={`${id}-consent`}
              className="flex min-h-11 cursor-pointer items-start gap-3 text-sm"
            >
              <input
                id={`${id}-consent`}
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? `${id}-consent-err` : undefined}
                className="mt-0.5 h-5 w-5 shrink-0 accent-brand-pink"
              />
              <span>{RETEST_CONSENT_TEXT}</span>
            </label>
            {errors.consent && (
              <p id={`${id}-consent-err`} className="mt-1 text-sm text-brand-pink">
                {errors.consent}
              </p>
            )}
          </div>

          {errors.form && (
            <p role="alert" className="text-sm text-brand-pink">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="min-h-11 w-full rounded-lg bg-brand-pink px-5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:ring-offset-2 disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Setting reminder…" : "Set reminder"}
          </button>
        </form>
      )}
    </section>
  );
}
