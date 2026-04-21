import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { Button } from "@/components/ui/button";
import { Heart, Activity, Shield } from "lucide-react";
import PageHeading from "@/components/ui/page-heading";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { CategoryStandardHero } from "@/components/category/CategoryStandardHero";

const wellnessCategoryCards = [
  {
    id: "longevity-tests",
    name: "Longevity Tests",
    count: 3,
    desc: "Comprehensive health markers for longevity and preventive care",
    icon: "⟳",
    accent: "#00d4c8",
    tag: "PREVENTIVE",
  },
  {
    id: "iron-tests",
    name: "Iron Tests",
    count: 2,
    desc: "Iron levels, ferritin, and anaemia screening",
    icon: "◈",
    accent: "#e91e8c",
    tag: "ESSENTIAL",
  },
  {
    id: "heart-health",
    name: "Heart Health",
    count: 2,
    desc: "Cardiovascular risk assessment and heart health monitoring",
    icon: "♡",
    accent: "#ff4d6d",
    tag: "CRITICAL",
  },
  {
    id: "energy-tests",
    name: "Energy Tests",
    count: 3,
    desc: "Fatigue, tiredness, and energy level testing",
    icon: "◎",
    accent: "#f0a500",
    tag: "WELLNESS",
  },
  {
    id: "nutrition-tests",
    name: "Nutrition Tests",
    count: 2,
    desc: "Vitamin levels and nutritional deficiency screening",
    icon: "◇",
    accent: "#00c896",
    tag: "WELLNESS",
  },
  {
    id: "allergy-testing",
    name: "Allergy Tests",
    count: 1,
    desc: "Allergy screening and immune response testing",
    icon: "◉",
    accent: "#ff7043",
    tag: "IMMUNE",
  },
  {
    id: "sexual-health",
    name: "Sexual Health",
    count: 2,
    desc: "Comprehensive sexual health and hormone screening",
    icon: "⬡",
    accent: "#9b59b6",
    tag: "SPECIALIST",
  },
  {
    id: "gp-monitoring",
    name: "GP Monitoring",
    count: 4,
    desc: "Routine health checks and general practitioner monitoring",
    icon: "⊕",
    accent: "#00b4d8",
    tag: "ROUTINE",
  },
  {
    id: "antibody-tests",
    name: "Antibody Tests",
    count: 2,
    desc: "Antibody screening and autoimmune disease detection",
    icon: "⋈",
    accent: "#e91e8c",
    tag: "IMMUNE",
  },
  {
    id: "infection-tests",
    name: "Infection Tests",
    count: 2,
    desc: "Infectious disease screening and pathogen detection",
    icon: "⬟",
    accent: "#5b9bd5",
    tag: "SPECIALIST",
  },
  {
    id: "immunity-tests",
    name: "Immunity Tests",
    count: 2,
    desc: "Immune system function and defense assessment",
    icon: "◬",
    accent: "#f0b429",
    tag: "IMMUNE",
  },
  {
    id: "autoimmunity-tests",
    name: "Autoimmunity",
    count: 2,
    desc: "Autoimmune condition screening and monitoring",
    icon: "◑",
    accent: "#e91e8c",
    tag: "SPECIALIST",
  },
  {
    id: "liver-health",
    name: "Liver Health",
    count: 2,
    desc: "Liver function testing and hepatic health monitoring",
    icon: "⬢",
    accent: "#ff5c5c",
    tag: "ORGAN",
  },
  {
    id: "kidney-health",
    name: "Kidney Health",
    count: 1,
    desc: "Kidney function assessment and renal health screening",
    icon: "◐",
    accent: "#00d4c8",
    tag: "ORGAN",
  },
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
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const tags = ["ALL", ...Array.from(new Set(wellnessCategoryCards.map((c) => c.tag)))];
  const filtered = filter === "ALL" ? wellnessCategoryCards : wellnessCategoryCards.filter((c) => c.tag === filter);

  return (
    <>
      <Helmet>
        <title>Wellness Tests | myhealth checkup</title>
        <meta
          name="description"
          content="Comprehensive wellness blood tests including liver, kidney, cardiac risk, sports fitness, and stress testing. Professional health screening from £25."
        />
        <meta
          name="keywords"
          content="wellness blood tests, health screening, liver test, kidney test, cardiac risk, sports fitness test, anaemia test, cortisol test"
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/wellness" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Wellness Tests | myhealth checkup" />
        <meta
          property="og:description"
          content="Comprehensive wellness blood tests for optimal health monitoring and screening"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/wellness" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wellness Tests | myhealth checkup" />
        <meta name="twitter:description" content="Comprehensive wellness blood tests for optimal health monitoring" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <CategoryStandardHero
          pillLabel="General Wellness"
          benefits={[
            { icon: Shield, title: "Early Detection", description: "Identify issues before they become serious" },
            { icon: Activity, title: "Optimise Performance", description: "Monitor biomarkers to enhance wellbeing" },
            { icon: Heart, title: "Peace of Mind", description: "Confidence in your health status" },
          ]}
        />

        {/* Browse Tests by Category */}
        <section
          style={{
            background: "#081129",
            padding: "32px 40px 72px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
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
                      border: active || isHoveredTag ? `1.5px solid ${color}` : "1.5px solid rgba(255,255,255,0.4)",
                      background: active || isHoveredTag ? `${color}18` : "rgba(6,11,24,0.3)",
                      color: active || isHoveredTag ? color : "#ffffff",
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
              {filtered.map((cat) => {
                const isHov = hovered === cat.id;
                return (
                  <Link
                    key={cat.id}
                    to={`/compare?category=${cat.id}`}
                    onMouseEnter={() => setHovered(cat.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position: "relative",
                      background: "#ffffff", // white cards
                      border: isHov ? `1px solid ${cat.accent}50` : "1px solid rgba(0,0,0,0.06)",
                      borderRadius: 20,
                      padding: "28px 28px 24px",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isHov ? "translateY(-4px)" : "translateY(0)",
                      boxShadow: isHov ? "0 18px 40px rgba(0,0,0,0.18)" : "0 4px 18px rgba(0,0,0,0.12)",
                      backdropFilter: "none",
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
                          background: `${cat.accent}10`,
                          border: `1px solid ${cat.accent}40`,
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column" as const,
                          alignItems: "flex-end",
                          gap: 6,
                        }}
                      >
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
                        <span
                          style={{
                            fontSize: 12,
                            color: "#1b1f3b",
                            fontWeight: 500,
                          }}
                        >
                          {cat.count} {cat.count === 1 ? "test" : "tests"}
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#060b18",
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
                        color: "rgba(6,11,24,0.75)",
                        margin: "0 0 24px",
                        lineHeight: 1.6,
                      }}
                    >
                      {cat.desc}
                    </p>

                    {/* CTA - always in accent colour */}
                    <div
                      style={{
                        width: "100%",
                        padding: "12px 0",
                        borderRadius: 12,
                        border: `1px solid ${cat.accent}`,
                        background: `linear-gradient(135deg, ${cat.accent}20, ${cat.accent}10)`,
                        color: cat.accent,
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

        {/* Bottom CTA Banner - white buffer wrapper */}
        <section style={{ background: "#ffffff", padding: "48px 40px" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              background: "linear-gradient(135deg, #e70d69, #22c0d4, #e70d69)",
              padding: "3px",
              borderRadius: "16px",
            }}
          >
            <div
              className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8"
              style={{
                background: "#0a1120",
                padding: "32px 36px",
                borderRadius: "13px",
              }}
            >
              <div className="text-center sm:text-left">
                <p
                  style={{
                    color: "#22c0d4",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Not Sure Where to Start?
                </p>
                <h2
                  style={{
                    color: "#ffffff",
                    fontSize: "clamp(22px, 3vw, 28px)",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Find the Right Health Test for You
                </h2>
              </div>
              <Link
                to="/quiz"
                className="inline-block whitespace-nowrap text-center"
                style={{
                  background: "linear-gradient(135deg, #e70d69 0%, #ff4d6d 100%)",
                  color: "#ffffff",
                  padding: "16px 36px",
                  fontSize: "16px",
                  fontWeight: 600,
                  borderRadius: "10px",
                  textDecoration: "none",
                }}
              >
                Start Your Quiz →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default WellnessPage;
