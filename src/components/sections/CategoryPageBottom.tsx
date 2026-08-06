
import { LucideIcon } from "lucide-react";
import QuizCTABanner from "@/components/sections/QuizCTABanner";


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
                style={{
                  background: "linear-gradient(135deg, #e70d69, #22c0d4, #e70d69)",
                  padding: "3px",
                  borderRadius: "16px",
                }}
              >
                <div
                  className="h-full text-center sm:text-left"
                  style={{ background: "#0a1120", padding: "24px", borderRadius: "13px" }}
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#22c0d4]/20 text-[#22c0d4]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-base font-bold text-white mt-4">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-white mt-1.5 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

        <QuizCTABanner quizLink={quizLink} />
      </div>
    </section>
  );
};


export default CategoryPageBottom;
