import { useState } from "react";
import { Link } from "react-router-dom";
import complianceBadges from "@/assets/compliance/compliance-badges.svg";
import cyberEssentialsLogo from "@/assets/compliance/cyber-essentials-logo.webp";


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

          {/* ========== Brief Medical Disclaimer ========== */}
          <div
            id="medical-disclaimer"
            role="note"
            aria-label="Medical disclaimer"
            className="mt-8 sm:mt-10 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-5 text-center"
          >
            <p className="text-xs sm:text-sm leading-relaxed">
              <span className="font-semibold text-brand-pink">Medical disclaimer:</span>{" "}
              <span className="text-white/85">
                This site provides comparison information only and does not constitute medical advice. See our{" "}
                <Link to="/legal" className="underline hover:text-brand-pink transition-colors">
                  Legal Hub
                </Link>{" "}
                for full details.
              </span>
            </p>
          </div>

        </div>
      </div>

      {/* ========== Pink Divider Line ========== */}
      <div className="h-[2px] bg-brand-pink" />

      {/* ========== Brand Bar ========== */}
      <div className="bg-[#060d20] py-5 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-5">
      {/* Two-column top: Follow Us + Compliance | Stay Informed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {/* Left: Follow Us + Compliance badges */}
        <div className="flex flex-col items-center text-center">
          <SectionHeading title="Follow Us" />
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

          {/* Compliance badges */}
          <div className="flex gap-4 items-center justify-center mt-5">
            <img
              src={complianceBadges}
              alt="ICO Registered, Companies House, UK GDPR compliance badges"
              loading="lazy"
              decoding="async"
              className="h-20 sm:h-24 w-auto object-contain"
            />
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-brand-navy flex items-center justify-center p-2">
              <img src={cyberEssentialsLogo} alt="Cyber Essentials" loading="lazy" decoding="async" className="w-full h-full object-contain" />
            </div>
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
                className="bg-brand-turquoise hover:bg-[#1aa8bb] text-[#081129] font-heading font-extrabold text-xs uppercase tracking-[0.1em] px-4 py-2.5 rounded-lg transition-colors duration-200"
              >
                Subscribe
              </button>
            </div>
          )}
          <p className="mt-3 text-[10px] text-white/40 leading-relaxed">
            We will never share your email. Unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Condensed copyright above faint divider */}
      <p className="mt-5 pt-3 border-t border-white/10 text-center text-[10px] sm:text-xs text-brand-pink/80 font-sans leading-tight">
        © 2026 MYHEALTHCHECKUP LTD. Registered in England &amp; Wales, Company No. 16589056. All rights reserved.
      </p>
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
