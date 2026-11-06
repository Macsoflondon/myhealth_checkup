import { Link } from "@/lib/router-compat";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizCTABannerProps {
  /** Link for the quiz CTA, defaults to /find-test */
  quizLink?: string;
  /** Optional wrapper class, e.g. page-level spacing */
  className?: string;
}

/**
 * The standard site-wide quiz call to action.
 * Must look identical on every page — do not fork the styling locally.
 */
export const QuizCTABanner = ({
  quizLink = "/find-test",
  className,
}: QuizCTABannerProps) => {
  return (
    <div
      className={className}
      style={{
        background: "linear-gradient(135deg, #e70d69, #22c0d4, #e70d69)",
        padding: "3px",
        borderRadius: "16px",
      }}
    >
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-8 px-5 py-7 sm:px-9 sm:py-8"
        style={{
          background: "#0a1120",
          borderRadius: "13px",
        }}
      >
        <div className="min-w-0 text-center sm:text-left">
          <p className="type-eyebrow mb-2" style={{ color: "#22c0d4" }}>
            Not sure where to start?
          </p>
          <h2
            className="type-section-title"
            style={{
              color: "#ffffff",
              margin: 0,
            }}
          >
            Find the right health test for you
          </h2>
        </div>
        <Link
          to={quizLink}
          className={cn(
            buttonVariants({ variant: "plain", size: "lg" }),
            "w-full sm:w-auto shrink-0 font-semibold text-white transition-transform hover:-translate-y-0.5",
          )}
          style={{
            background: "linear-gradient(135deg, #e70d69 0%, #ff4d6d 100%)",
            border: "none",
            borderRadius: "10px",
            textDecoration: "none",
          }}
        >
          Start your quiz →
        </Link>
      </div>
    </div>
  );
};

export default QuizCTABanner;
