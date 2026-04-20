import { useState, FormEvent } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  // Honeypot — bots fill hidden fields; humans don't.
  const [hp, setHp] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Silently drop bot submissions (honeypot tripped)
    if (hp) {
      setDone(true);
      return;
    }
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    if (!consent) {
      toast({ title: "Consent required", description: "Please confirm you'd like to receive emails.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: trimmed, source: "footer", consent: true, hp },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);

      setDone(true);
      toast({ title: "Subscribed", description: (data as { message?: string })?.message ?? "Thanks — you're subscribed." });
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Subscription failed. Please try again.";
      toast({ title: "Subscription failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-brand-turquoise/30" />
        <span className="text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] whitespace-nowrap">
          Newsletter
        </span>
        <div className="h-px flex-1 bg-brand-turquoise/30" />
      </div>

      <p className="text-white/80 text-xs sm:text-sm font-sans mb-3 leading-relaxed">
        Independent updates on private health testing, new providers, and price changes. No spam.
      </p>

      {done ? (
        <div className="flex items-center gap-2 text-brand-turquoise text-sm font-sans">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <span>You're subscribed. Check your inbox.</span>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          {/* Honeypot field (hidden from users, visible to bots) */}
          <input
            type="text"
            name="company"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] w-px h-px opacity-0 pointer-events-none"
          />
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" aria-hidden="true" />
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full h-10 rounded-md bg-white/10 border border-white/20 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-brand-turquoise disabled:opacity-60"
            />
          </div>

          <label className="flex items-start gap-2 text-[11px] sm:text-xs text-white/70 leading-relaxed cursor-pointer">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={loading}
              className="mt-0.5 h-3.5 w-3.5 rounded border-white/30 bg-white/10 accent-brand-pink shrink-0"
            />
            <span>
              I agree to receive emails from myhealth checkup. See our{" "}
              <a href="/privacy-policy" className="underline hover:text-brand-pink">privacy policy</a>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-md bg-brand-pink hover:bg-brand-pink/90 text-white text-sm font-semibold font-sans transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Subscribing…
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterSignup;
