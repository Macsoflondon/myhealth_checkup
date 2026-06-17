import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  return (
    <footer>
      {/* ========== Top Gradient Divider ========== */}
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      {/* ========== Main Footer ========== */}
      <div className="bg-[#060d20] relative overflow-hidden pt-12 sm:pt-14 pb-8 sm:pb-10">
        {/* Decorative glow orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-turquoise/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <StayInformedSection />
        </div>
      </div>

    </footer>
  );
};

/* ========== Section heading ========== */
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-px flex-1 bg-brand-pink" />
    <span className="text-brand-turquoise text-sm sm:text-base font-semibold uppercase tracking-[0.25em] whitespace-nowrap">
      {title}
    </span>
    <div className="h-px flex-1 bg-brand-pink" />
  </div>
);

/* ========== Stay Informed Section ========== */
const StayInformedSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("Please enter a valid email.");
      setTimeout(() => setError(null), 2500);
      return;
    }
    setLoading(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke(
        "newsletter-subscribe",
        { body: { email: email.trim(), source: "footer", consent: true } }
      );
      if (fnErr || (data as any)?.error) {
        setError((data as any)?.error || "Subscription failed. Try again.");
        setTimeout(() => setError(null), 3000);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Subscription failed. Try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-5">
      {/* Two-column top: Follow Us + Copyright/Disclaimer | Stay Informed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {/* Left: Follow Us + Copyright + Medical Disclaimer */}
        <div className="w-full flex flex-col items-center text-center h-full">
          <div className="w-full">
            <SectionHeading title="Follow Us" />
          </div>
          <div className="flex gap-3 mt-1">
            <SocialIcon
              href="https://www.instagram.com/myhealthcheckup_uk"
              label="Instagram"
              style={{ background: "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.8" fill="none" />
                <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.8" fill="none" />
                <circle cx="17.5" cy="6.5" r="1.25" fill="#fff" />
              </svg>
            </SocialIcon>
            <SocialIcon
              href="https://www.facebook.com/myhealthcheckupuk"
              label="Facebook"
              style={{ background: "#1877F2" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.4v7A10 10 0 0022 12z" />
              </svg>
            </SocialIcon>
            <SocialIcon
              href="https://www.tiktok.com/@myhealthcheckup"
              label="TikTok"
              style={{ background: "#000" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M16.5 3h-2.6v12.2a2.7 2.7 0 11-2.7-2.7c.3 0 .5 0 .8.1V9.9a5.7 5.7 0 00-.8-.1 5.6 5.6 0 105.6 5.6V8.7a7.1 7.1 0 004.2 1.4V7.5a4.3 4.3 0 01-4.5-4.5z" fill="#25F4EE" />
                <path d="M17 3.5h-2.6v12.2a2.7 2.7 0 11-2.7-2.7c.3 0 .5 0 .8.1V10.4a5.7 5.7 0 00-.8-.1 5.6 5.6 0 105.6 5.6V9.2a7.1 7.1 0 004.2 1.4V8a4.3 4.3 0 01-4.5-4.5z" fill="#FE2C55" fillOpacity="0.85" />
                <path d="M16.7 3.2h-2.6v12.2a2.7 2.7 0 11-2.7-2.7c.3 0 .5 0 .8.1V10.1a5.7 5.7 0 00-.8-.1 5.6 5.6 0 105.6 5.6V8.9a7.1 7.1 0 004.2 1.4V7.7a4.3 4.3 0 01-4.5-4.5z" fill="#fff" fillOpacity="0.9" />
              </svg>
            </SocialIcon>
          </div>

          {/* Copyright + Medical Disclaimer — pushed to bottom of column */}
          <div className="mt-6 sm:mt-auto w-full space-y-2 px-1">
            <p className="text-[10px] sm:text-[11px] text-white/60 leading-snug text-center break-words">
              © 2026 MYHEALTHCHECKUP LTD. Registered in England &amp; Wales, Company No. 16589056. All rights reserved.
            </p>
            <p className="text-[10px] sm:text-[11px] text-white/60 leading-snug text-center break-words">
              <span className="text-brand-pink font-semibold">Medical disclaimer:</span>{" "}
              This site provides comparison information only and does not constitute medical advice.{" "}
              <Link to="/legal" className="underline hover:text-brand-pink transition-colors">
                Legal Hub
              </Link>
            </p>
          </div>
        </div>

        {/* Right: Stay Informed */}
        <div>
          <SectionHeading title="Stay Informed" />
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4">
            New tests, new providers, straight to your inbox. Provider updates and platform improvements — when they matter.
          </p>
          {submitted ? (
            <p className="text-brand-turquoise font-heading font-bold text-sm tracking-wide">
              Subscribed ✓ — thank you.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/35 outline-none transition-colors focus:border-brand-turquoise"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1.5px solid ${error ? "#e70d69" : "rgba(34,192,212,0.28)"}`,
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-brand-turquoise hover:bg-brand-pink disabled:opacity-60 text-white font-heading font-extrabold text-xs uppercase tracking-[0.1em] px-4 py-2.5 rounded-lg transition-colors duration-200"
              >
                {loading ? "Subscribing…" : "Subscribe"}
              </button>
              {error && (
                <p className="text-xs text-brand-pink mt-1">{error}</p>
              )}
            </div>
          )}
          <p className="mt-3 text-[10px] text-white/40 leading-relaxed">
            We will never share your email. Unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Brand Bar — moved to where medical disclaimer was */}
      <div className="mt-6 sm:mt-8">
        <div className="h-[2px] bg-brand-pink" />
        <div className="pt-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-xl sm:text-2xl md:text-3xl">
                <span className="text-white">my</span>
                <span className="text-brand-turquoise text-primary-foreground">health</span>
              </span>
              <span className="font-heading text-base sm:text-lg md:text-xl text-brand-turquoise -ml-2 text-primary">
                checkup
              </span>
            </div>
            <p className="font-heading font-bold text-xs sm:text-sm md:text-base text-white">
              Your <span className="text-brand-pink text-primary">health!</span> Your{" "}
              <span className="text-brand-pink">choice!</span> One{" "}
              <span className="text-brand-turquoise text-primary-foreground">trusted</span> platform!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========== Social Icon ========== */
const SocialIcon = ({
  href,
  label,
  children,
  style,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Follow us on ${label}`}
    style={style}
    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 text-white shadow-md"
  >
    {children}
  </a>
);

export default Footer;
