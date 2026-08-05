import { Link } from "@/lib/router-compat";
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
  /** Link for the quiz CTA, defaults to /find-test */
  quizLink?: string;
}

const CategoryPageBottom = ({
  benefitsTitle,
  benefits,
  quizLink = "/find-test",
}: CategoryPageBottomProps) => {
  return (
    <section style={{ background: "#ffffff", padding: "48px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2 className="font-heading text-center text-2xl sm:text-3xl font-bold text-[#081129] mb-8">
          {benefitsTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-[#081129]/10 bg-[#f7fafc] p-6 text-center sm:text-left"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#22c0d4]/12 text-[#22c0d4]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-heading text-base font-bold text-[#081129] mt-4">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[#081129]/70 mt-1.5 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div
          style={{
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
              to={quizLink}
              className="inline-block whitespace-nowrap text-center"
              style={{
                background: "linear-gradient(135deg, #e70d69 0%, #ff4d6d 100%)",
                color: "#ffffff",
                border: "none",
                padding: "16px 36px",
                fontSize: "16px",
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
    </section>
  );
};

export default CategoryPageBottom;
