import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { wellnessCategories } from "@/data/wellnessCategories";

const categories = wellnessCategories.map((wc, i) => ({
  id: i + 1,
  name: wc.name,
  count: wc.testCount,
  desc: wc.description,
  icon: wc.icon,
  accent: wc.colorHex,
  tag: getCategoryTag(wc.id),
  link: `/tests/${wc.id}`,
}));

function getCategoryTag(id: string): string {
  const map: Record<string, string> = {
    "longevity-tests": "PREVENTIVE",
    "iron-tests": "ESSENTIAL",
    "heart-health": "CRITICAL",
    "energy-tests": "WELLNESS",
    "nutrition-tests": "WELLNESS",
    "allergy-testing": "IMMUNE",
    "sexual-health": "SPECIALIST",
    "gp-monitoring": "ROUTINE",
    "antibody-tests": "IMMUNE",
    "infection-tests": "SPECIALIST",
    "immunity-tests": "IMMUNE",
    "autoimmunity-tests": "SPECIALIST",
    "liver-health": "ORGAN",
    "kidney-health": "ORGAN",
  };
  return map[id] || "GENERAL";
}

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

const TestCategoriesPage = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [filter, setFilter] = useState("ALL");

  const tags = ["ALL", ...new Set(categories.map((c) => c.tag))];
  const filtered =
    filter === "ALL" ? categories : categories.filter((c) => c.tag === filter);

  return (
    <>
      <Helmet>
        <title>Test Categories | myhealth checkup</title>
        <meta
          name="description"
          content="Browse all health test categories. Compare blood tests, cancer screening, heart health, hormone tests, and more from trusted UK providers."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/test-categories" />
      </Helmet>

      <Header />

      <div
        style={{
          fontFamily: "'Montserrat', 'DM Sans', 'Segoe UI', sans-serif",
          background: "linear-gradient(160deg, #060b18 0%, #0a1120 50%, #060b18 100%)",
          minHeight: "100vh",
          padding: "40px 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
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
            background: "radial-gradient(circle, rgba(233,30,140,0.07) 0%, transparent 70%)",
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
          {/* Breadcrumb */}
          <PageBreadcrumb />

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(233,30,140,0.1)",
                border: "1px solid rgba(233,30,140,0.25)",
                borderRadius: 100,
                padding: "6px 18px",
                marginBottom: 24,
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
                  textTransform: "uppercase",
                }}
              >
                {categories.length} Test Categories
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 800,
                color: "#fff",
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
            </h1>

            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.65)",
                margin: "0 auto 48px",
                maxWidth: 520,
                lineHeight: 1.6,
              }}
            >
              Choose from our comprehensive range of clinically validated wellness
              testing categories
            </p>
          </div>

          {/* Filter pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginBottom: 56,
            }}
          >
            {tags.map((tag) => {
              const active = filter === tag;
              const color = tag === "ALL" ? "#00d4c8" : tagColors[tag];
              return (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  style={{
                    padding: "7px 20px",
                    borderRadius: 100,
                    border: active
                      ? `1.5px solid ${color}`
                      : "1.5px solid rgba(255,255,255,0.1)",
                    background: active
                      ? `${color}18`
                      : "rgba(255,255,255,0.03)",
                    color: active ? color : "rgba(255,255,255,0.4)",
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
              const IconComp = cat.icon;
              return (
                <Link
                  to={cat.link}
                  key={cat.id}
                  onMouseEnter={() => setHovered(cat.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: "relative",
                    background: isHov
                      ? "rgba(255,255,255,0.055)"
                      : "rgba(255,255,255,0.03)",
                    border: isHov
                      ? `1px solid ${cat.accent}50`
                      : "1px solid rgba(255,255,255,0.07)",
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
                    {/* Icon */}
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
                        transition: "all 0.3s ease",
                        transform: isHov ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <IconComp style={{ width: 22, height: 22, color: cat.accent }} />
                    </div>

                    {/* Tag + count */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
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
                          color: "rgba(255,255,255,0.3)",
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
                      color: "rgba(255,255,255,0.65)",
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
                      background: isHov
                        ? `linear-gradient(135deg, ${cat.accent}25, ${cat.accent}10)`
                        : "transparent",
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
                        transform: isHov ? "translateX(3px)" : "translateX(0)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom CTA bar */}
          <div
            style={{
              marginTop: 72,
              padding: "40px 48px",
              borderRadius: 24,
              background: "linear-gradient(135deg, rgba(233,30,140,0.08), rgba(0,212,200,0.08))",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#00d4c8",
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                }}
              >
                Not sure where to start?
              </p>
              <h4
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#fff",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Find the Right Health Test for You
              </h4>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link
                to="/compare"
                style={{
                  padding: "14px 32px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #e91e8c, #c2185b)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  boxShadow: "0 8px 24px rgba(233,30,140,0.3)",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Browse All Tests →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TestCategoriesPage;
