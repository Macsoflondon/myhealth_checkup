import { Link } from "@/lib/router-compat";

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
export const QuizCTABanner = ({ quizLink = "/find-test", className }: QuizCTABannerProps) => {
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
            className="font-heading"
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
          className="inline-block w-full sm:w-auto shrink-0 whitespace-nowrap text-center px-6 py-3.5 sm:px-9 sm:py-4 transition-transform hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #e70d69 0%, #ff4d6d 100%)",
            color: "#ffffff",
            border: "none",
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
  );
};

export default QuizCTABanner;
