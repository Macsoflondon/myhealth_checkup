import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface CategoryPageBottomProps {
  /** e.g. "Why Choose Cancer Screening?" */
  benefitsTitle: string;
  benefits: [BenefitItem, BenefitItem, BenefitItem];
  /** Link for the quiz CTA, defaults to /quiz */
  quizLink?: string;
}

const CategoryPageBottom = ({
  benefitsTitle,
  benefits,
  quizLink = "/quiz",
}: CategoryPageBottomProps) => {
  return (
    <>
      {/* Bottom CTA Banner */}
      <div className="mt-8 mb-12 px-4 sm:px-10">
        <div
          style={{
            background: "linear-gradient(135deg, #e70d69, #22c0d4, #e70d69)",
            padding: "3px",
            borderRadius: "16px",
          }}
        >
          <div
            className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-8 p-6 sm:p-8 md:px-9"
            style={{
              background: "#0a1120",
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
                className="text-xl sm:text-2xl md:text-[28px]"
                style={{
                  color: "#ffffff",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Find the Right Health Test for You
              </h2>
            </div>
            <Link
              to={quizLink}
              className="inline-block whitespace-nowrap text-center w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #e70d69 0%, #ff4d6d 100%)",
                color: "#ffffff",
                border: "none",
                padding: "14px 28px",
                fontSize: "15px",
                fontWeight: 600,
                borderRadius: "10px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
              }
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
        }}
        className="mx-4 sm:mx-10"
      />

      {/* Condensed Benefits Grid */}
      <section style={{ background: "#081129", padding: "32px 0" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              {benefitsTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 bg-[#e70d69] rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {benefit.title}
                    </h3>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryPageBottom;
