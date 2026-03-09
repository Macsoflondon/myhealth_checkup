import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UKASBanner from "@/components/UKASBanner";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Shield, Home, ArrowLeft } from "lucide-react";
import PageHeading from "@/components/ui/page-heading";

const wellnessCategoryCards = [
  { id: "longevity-tests", name: "Longevity Tests", count: 3, desc: "Comprehensive health markers for longevity and preventive care", icon: "⟳", accent: "#00d4c8", tag: "PREVENTIVE" },
  { id: "iron-tests", name: "Iron Tests", count: 2, desc: "Iron levels, ferritin, and anaemia screening", icon: "◈", accent: "#e91e8c", tag: "ESSENTIAL" },
  { id: "heart-health", name: "Heart Health", count: 2, desc: "Cardiovascular risk assessment and heart health monitoring", icon: "♡", accent: "#ff4d6d", tag: "CRITICAL" },
  { id: "energy-tests", name: "Energy Tests", count: 3, desc: "Fatigue, tiredness, and energy level testing", icon: "◎", accent: "#f0a500", tag: "WELLNESS" },
  { id: "nutrition-tests", name: "Nutrition Tests", count: 2, desc: "Vitamin levels and nutritional deficiency screening", icon: "◇", accent: "#00c896", tag: "WELLNESS" },
  { id: "allergy-testing", name: "Allergy Tests", count: 1, desc: "Allergy screening and immune response testing", icon: "◉", accent: "#ff7043", tag: "IMMUNE" },
  { id: "sexual-health", name: "Sexual Health", count: 2, desc: "Comprehensive sexual health and hormone screening", icon: "⬡", accent: "#9b59b6", tag: "SPECIALIST" },
  { id: "gp-monitoring", name: "GP Monitoring", count: 4, desc: "Routine health checks and general practitioner monitoring", icon: "⊕", accent: "#00b4d8", tag: "ROUTINE" },
  { id: "antibody-tests", name: "Antibody Tests", count: 2, desc: "Antibody screening and autoimmune disease detection", icon: "⋈", accent: "#e91e8c", tag: "IMMUNE" },
  { id: "infection-tests", name: "Infection Tests", count: 2, desc: "Infectious disease screening and pathogen detection", icon: "⬟", accent: "#5b9bd5", tag: "SPECIALIST" },
  { id: "immunity-tests", name: "Immunity Tests", count: 2, desc: "Immune system function and defense assessment", icon: "◬", accent: "#f0b429", tag: "IMMUNE" },
  { id: "autoimmunity-tests", name: "Autoimmunity", count: 2, desc: "Autoimmune condition screening and monitoring", icon: "◑", accent: "#e91e8c", tag: "SPECIALIST" },
  { id: "liver-health", name: "Liver Health", count: 2, desc: "Liver function testing and hepatic health monitoring", icon: "⬢", accent: "#ff5c5c", tag: "ORGAN" },
  { id: "kidney-health", name: "Kidney Health", count: 1, desc: "Kidney function assessment and renal health screening", icon: "◐", accent: "#00d4c8", tag: "ORGAN" },
];

const tagColors: Record<string, string> = {
  PREVENTIVE: "#00d4c8",
  ESSENTIAL: "#e91e8c",
  CRITICAL: "#ff4d6d",
  WELLNESS: "#00c896",
  IMMUNE: "#9b59b6",
  SPECIALIST: "#5b9bd5",
  ROUTINE: "#00b4d8",
  ORGAN: "#ff7043",
};

const WellnessPage = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const tags = ["ALL", ...Array.from(new Set(wellnessCategoryCards.map((c) => c.tag)))];
  const filtered = filter === "ALL" ? wellnessCategoryCards : wellnessCategoryCards.filter((c) => c.tag === filter);
  return <>
      <Helmet>
        <title>Wellness Blood Tests | Comprehensive Health Screening | myhealth checkup - Your health. Your choice. One trusted platform!</title>
        <meta name="description" content="Comprehensive wellness blood tests including liver, kidney, cardiac risk, sports fitness, and stress testing. Professional health screening from £25." />
        <meta name="keywords" content="wellness blood tests, health screening, liver test, kidney test, cardiac risk, sports fitness test, anaemia test, cortisol test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/wellness" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Wellness Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta property="og:description" content="Comprehensive wellness blood tests for optimal health monitoring and screening" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/wellness" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wellness Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta name="twitter:description" content="Comprehensive wellness blood tests for optimal health monitoring" />
      </Helmet>
      
      <UKASBanner />
      <Header />
      
      <main className="min-h-screen bg-background">

        {/* Browse Tests by Category */}
        <section
          style={{
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            background: "#ffffff",
            padding: "72px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(6,11,24,0.08) 1px, transparent 0)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />
          {/* Ambient glow orbs */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "-5%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(233,30,140,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              right: "-5%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,212,200,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
            {/* Header */}
            {/* General Wellness pill row with nav buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 24 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(233,30,140,0.1)",
                  border: "1px solid rgba(233,30,140,0.25)",
                  borderRadius: 100,
                  padding: "6px 18px",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#e91e8c",
                    display: "inline-block",
                    boxShadow: "0 0 8px #e91e8c",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#e91e8c",
                    textTransform: "uppercase" as const,
                  }}
                >
                  General Wellness
                </span>
              </div>
              {/* Nav buttons - right aligned, parallel with pill */}
              <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 8 }}>
                <Link
                  to="/"
                  className="!h-9 !w-9 rounded-lg bg-[#22c0d4] hover:bg-[#e70d69] text-white shadow-lg transition-all duration-300 flex items-center justify-center"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
                  className="!h-9 !w-9 rounded-lg bg-[#22c0d4] hover:bg-[#e70d69] text-white shadow-lg transition-all duration-300 flex items-center justify-center"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Heading and subtext */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 800,
                  color: "#060b18",
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Browse Tests by{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #00d4c8, #e91e8c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Category
                </span>
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: "#060b18",
                  margin: "0 auto 48px",
                  maxWidth: 520,
                  lineHeight: 1.6,
                }}
              >
                Choose from our comprehensive range of clinically validated wellness testing categories
              </p>
            </div>

            {/* Filter pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap" as const,
                gap: 8,
                justifyContent: "center",
                marginBottom: 56,
              }}
            >
              {tags.map((tag) => {
                const active = filter === tag;
                const isHoveredTag = hoveredTag === tag;
                const color = tag === "ALL" ? "#00d4c8" : tagColors[tag];
                return (
                  <button
                    key={tag}
                    onClick={() => setFilter(tag)}
                    onMouseEnter={() => setHoveredTag(tag)}
                    onMouseLeave={() => setHoveredTag(null)}
                    style={{
                      padding: "7px 20px",
                      borderRadius: 100,
                      border: active || isHoveredTag ? `1.5px solid ${color}` : "1.5px solid rgba(6,11,24,0.12)",
                      background: active || isHoveredTag ? `${color}18` : "rgba(6,11,24,0.03)",
                      color: active || isHoveredTag ? color : "#060b18",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      outline: "none",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Cards grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {filtered.map((cat, i) => {
                const isHov = hovered === cat.id;
                return (
                  <Link
                    key={cat.id}
                    to={`/compare?category=${cat.id}`}
                    onMouseEnter={() => setHovered(cat.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position: "relative",
                      background: "#0a1120",
                      border: isHov ? `1px solid ${cat.accent}50` : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 20,
                      padding: "28px 28px 24px",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isHov ? "translateY(-4px)" : "translateY(0)",
                      boxShadow: isHov
                        ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${cat.accent}20, inset 0 1px 0 rgba(255,255,255,0.08)`
                        : "0 4px 20px rgba(0,0,0,0.2)",
                      backdropFilter: "blur(12px)",
                      overflow: "hidden",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {/* Accent glow on hover */}
                    {isHov && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 1,
                          background: `linear-gradient(90deg, transparent, ${cat.accent}80, transparent)`,
                        }}
                      />
                    )}

                    {/* Top row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: `${cat.accent}15`,
                          border: `1px solid ${cat.accent}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          color: cat.accent,
                          transition: "all 0.3s ease",
                          transform: isHov ? "scale(1.05)" : "scale(1)",
                        }}
                      >
                        {cat.icon}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: 6 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            color: tagColors[cat.tag],
                            background: `${tagColors[cat.tag]}15`,
                            padding: "3px 10px",
                            borderRadius: 100,
                            border: `1px solid ${tagColors[cat.tag]}30`,
                          }}
                        >
                          {cat.tag}
                        </span>
                        <span style={{ fontSize: 12, color: "#ffffff", fontWeight: 500 }}>
                          {cat.count} {cat.count === 1 ? "test" : "tests"}
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#fff",
                        margin: "0 0 10px",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.9)",
                        margin: "0 0 24px",
                        lineHeight: 1.6,
                      }}
                    >
                      {cat.desc}
                    </p>

                    {/* CTA */}
                    <div
                      style={{
                        width: "100%",
                        padding: "12px 0",
                        borderRadius: 12,
                        border: `1px solid ${cat.accent}40`,
                        background: isHov ? `linear-gradient(135deg, ${cat.accent}25, ${cat.accent}10)` : "transparent",
                        color: isHov ? cat.accent : "rgba(255,255,255,0.4)",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      View Tests
                      <span
                        style={{
                          display: "inline-block",
                          transition: "transform 0.3s ease",
                          transform: isHov ? "translateX(4px)" : "translateX(0)",
                        }}
                      >
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        {/* Bottom CTA Section */}
        <div style={{ marginTop: "32px", marginBottom: "48px", padding: "0 40px" }}>
          {/* CTA Content with tricolour border */}
          <div
            style={{
              background: "linear-gradient(135deg, #e70d69, #22c0d4, #e70d69)",
              padding: "3px",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                background: "#0a1120",
                padding: "40px 48px",
                borderRadius: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "32px",
                flexWrap: "wrap" as const,
              }}
            >
              <div>
                <p
                  style={{
                    color: "#22c0d4",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    marginBottom: "8px",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Not Sure Where to Start?
                </p>
                <h2
                  style={{
                    color: "#ffffff",
                    fontSize: "28px",
                    fontWeight: "700",
                    margin: 0,
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Find the Right Health Test for You
                </h2>
              </div>
              <Link
                to="/quiz"
                style={{
                  background: "linear-gradient(135deg, #e70d69 0%, #ff4d6d 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "16px 36px",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  transition: "transform 0.2s ease",
                  textDecoration: "none",
                  whiteSpace: "nowrap" as const,
                  display: "inline-block",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
              >
                Start Your Quiz →
              </Link>
            </div>
          </div>
        </div>

        {/* Tricolour divider */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #22c0d4, #e70d69, #22c0d4)",
            margin: "0 40px",
          }}
        />

        {/* Benefits Section - Condensed */}
        <section className="py-6 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl font-bold text-foreground mb-4">Why Choose Wellness Testing?</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">Early Detection</h3>
                  <p className="text-xs text-muted-foreground">Identify issues before they become serious</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">Optimize Performance</h3>
                  <p className="text-xs text-muted-foreground">Monitor biomarkers to enhance wellbeing</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">Peace of Mind</h3>
                  <p className="text-xs text-muted-foreground">Confidence in your health status</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>;
};
export default WellnessPage;