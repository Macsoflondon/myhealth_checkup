import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError(true);
      setTimeout(() => setError(false), 2500);
      return;
    }
    setSubmitted(true);
  };

  return (
    <section className="bg-[#081129] py-14 sm:py-16 md:py-20 relative overflow-hidden">
      <NavyDecorativeCircles />
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #22c0d4 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
            <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
              Stay Informed
            </span>
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          </div>
          <SectionHeading
            title="New tests. New providers."
            gradientText="Straight to your inbox."
            titleClassName="text-white"
            gradientClassName="text-brand-turquoise"
          />
          <p className="mt-3 mb-8 text-base sm:text-lg text-white/60 leading-relaxed">
            Health information worth reading. No marketing. No filler. Provider updates, new biomarker guides, and platform improvements — when they matter.
          </p>
          {submitted ? (
            <p className="text-brand-turquoise font-heading font-bold text-base tracking-wide">
              Subscribed ✓ — thank you.
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Your email address"
                aria-label="Email address"
                className="flex-1 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/35 outline-none transition-colors focus:border-brand-turquoise"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1.5px solid ${error ? "#e70d69" : "rgba(34,192,212,0.28)"}`,
                }}
              />
              <button
                onClick={handleSubmit}
                className="bg-brand-turquoise hover:bg-[#1aa8bb] text-[#081129] font-heading font-extrabold text-xs uppercase tracking-[0.1em] px-6 py-3 rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          )}
          <p className="mt-4 text-xs text-white/30 leading-relaxed">
            We will never share your email. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
