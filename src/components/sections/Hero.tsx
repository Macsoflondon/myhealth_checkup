// Hero component - focused on speed, reassurance, and trust
import { useState } from "react";

const Sparkles = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const Search = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export default function HeroPreview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hovered, setHovered] = useState(null);

  const popularSearches = ["Full Blood Count", "Thyroid Function", "Vitamin D", "Liver Function"];

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#f8f9fa" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 60px 24px 70px;
          background: linear-gradient(135deg, #e8f4f8 0%, #f0e8f5 40%, #f5e8ee 100%);
        }

        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(34,192,212,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(231,13,105,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.6) 0%, transparent 100%);
          z-index: 0;
        }

        /* Floating orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.35;
          animation: drift 8s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #22c0d4, transparent);
          top: -80px; left: -60px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, #e70d69, transparent);
          bottom: -40px; right: -40px;
          animation-delay: -3s;
        }
        .orb-3 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, #0a1f5c, transparent);
          top: 40%; right: 5%;
          animation-delay: -5s;
          opacity: 0.15;
        }

        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(20px, -20px) scale(1.08); }
        }

        .content-wrap {
          position: relative;
          z-index: 10;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
        }

        /* Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(231,13,105,0.3);
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #e70d69;
          margin-bottom: 28px;
          box-shadow: 0 2px 16px rgba(231,13,105,0.12), inset 0 1px 0 rgba(255,255,255,0.8);
          animation: fadeSlideDown 0.6s ease both;
        }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Headline */
        .headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 32px;
          animation: fadeSlideUp 0.7s ease 0.15s both;
        }

        .headline-line {
          display: block;
          font-size: clamp(2.2rem, 5.5vw, 4.2rem);
          color: #0a1f5c;
          letter-spacing: -0.02em;
        }

        .headline-accent {
          display: block;
          font-size: clamp(2.4rem, 5.8vw, 4.5rem);
          background: linear-gradient(135deg, #e70d69 0%, #ff6b9d 60%, #e70d69 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
          letter-spacing: -0.02em;
          margin-top: 2px;
        }

        @keyframes shimmer {
          from { background-position: 0% center; }
          to { background-position: 200% center; }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Decorative underline under navy text */
        .headline-navy-wrap {
          position: relative;
          display: inline-block;
        }

        /* CTAs */
        .cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 36px;
          animation: fadeSlideUp 0.7s ease 0.35s both;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.25s ease;
          letter-spacing: 0.01em;
        }

        .btn-teal {
          background: linear-gradient(135deg, #22c0d4, #1aafbf);
          color: white;
          box-shadow: 0 4px 20px rgba(34,192,212,0.35);
        }
        .btn-teal:hover {
          background: linear-gradient(135deg, #e70d69, #c40a58);
          box-shadow: 0 6px 24px rgba(231,13,105,0.35);
          transform: translateY(-2px);
        }

        .btn-pink {
          background: linear-gradient(135deg, #e70d69, #c40a58);
          color: white;
          box-shadow: 0 4px 20px rgba(231,13,105,0.35);
        }
        .btn-pink:hover {
          background: linear-gradient(135deg, #22c0d4, #1aafbf);
          box-shadow: 0 6px 24px rgba(34,192,212,0.35);
          transform: translateY(-2px);
        }

        /* Search card */
        .search-card {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 24px;
          box-shadow:
            0 8px 40px rgba(10,31,92,0.10),
            0 2px 8px rgba(10,31,92,0.06),
            inset 0 1px 0 rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,0.7);
          animation: fadeSlideUp 0.7s ease 0.5s both;
        }

        .search-input-wrap {
          position: relative;
          margin-bottom: 16px;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #22c0d4;
          width: 20px;
          height: 20px;
        }

        .search-input {
          width: 100%;
          padding: 16px 20px 16px 52px;
          border: 1.5px solid rgba(34,192,212,0.25);
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          color: #0a1f5c;
          background: rgba(255,255,255,0.9);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .search-input::placeholder {
          color: #22c0d4;
          opacity: 0.8;
        }

        .search-input:focus {
          border-color: #22c0d4;
          box-shadow: 0 0 0 3px rgba(34,192,212,0.15);
        }

        .popular-wrap {
          background: rgba(248,250,252,0.7);
          border: 1px solid rgba(34,192,212,0.15);
          border-radius: 14px;
          padding: 16px;
        }

        .popular-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #0a1f5c;
          opacity: 0.6;
          margin-bottom: 12px;
        }

        .tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .tag {
          padding: 8px 18px;
          background: linear-gradient(135deg, #22c0d4, #1fb8ca);
          color: white;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
          box-shadow: 0 2px 8px rgba(34,192,212,0.25);
        }

        .tag:hover {
          background: linear-gradient(135deg, #e70d69, #c40a58);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(231,13,105,0.3);
        }

        /* Divider line between navy lines */
        .headline-divider {
          display: block;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #22c0d4, #e70d69);
          border-radius: 2px;
          margin: 10px auto 8px;
        }
      `}</style>

      <section className="hero-section">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="content-wrap">
          {/* Badge */}
          <div>
            <span className="badge">
              <Sparkles className="" style={{ width: 15, height: 15, color: "#22c0d4" }} />
              UK's #1 Health Test Comparison Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="headline">
            <span className="headline-line">Compare the UK's leading</span>
            <span className="headline-divider" />
            <span className="headline-line">private health test providers</span>
            <span className="headline-accent">All in one place!</span>
          </h1>

          {/* CTAs */}
          <div className="cta-row">
            <button className="btn btn-teal">Compare blood tests</button>
            <button className="btn btn-pink">Find the right test for you</button>
          </div>

          {/* Search card */}
          <div className="search-card">
            <div className="search-input-wrap">
              <Search className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Search from over 200 tests…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="popular-wrap">
              <p className="popular-label">Popular searches</p>
              <div className="tag-row">
                {popularSearches.map((s, i) => (
                  <button key={i} className="tag">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Hero;
