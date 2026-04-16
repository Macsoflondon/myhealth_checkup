import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { Button } from "@/components/ui/button";
import { Heart, Activity, Shield } from "lucide-react";
import PageHeading from "@/components/ui/page-heading";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";

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

      <main className="min-h-screen bg-primary-foreground">
        {/* Browse Tests by Category */}
        <section
          style={{
            background: "#081129",
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
            {/* General Wellness pill row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                marginBottom: 24,
              }}
            >
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
            </div>

            {/* Heading and subtext */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 800,
                  color: "#ffffff",
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
                  color: "rgba(255,255,255,0.8)",
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

        <CategoryPageBottom
          benefitsTitle="Why should I Test?"
          benefits={[
            {
              icon: Shield,
              title: "Early Detection",
              description: "Identify issues before they become serious",
            },
            {
              icon: Activity,
              title: "Optimise Performance",
              description: "Monitor biomarkers to enhance wellbeing",
            },
            {
              icon: Heart,
              title: "Peace of Mind",
              description: "Confidence in your health status",
            },
          ]}
        />
      </main>

      <Footer />
    </>
  );
};

export default WellnessPage;
