import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  gradientText: string;
  className?: string;
  titleClassName?: string;
  gradientClassName?: string;
  /** Enable entrance animation (default: true) */
  animate?: boolean;
  /** Show pink decorative swoosh above heading (default: true) */
  showSwoosh?: boolean;
}

const PinkSwoosh = () => (
  <svg className="mx-auto mb-3" width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 15 Q20 2 40 10 Q60 18 75 5" stroke="#e70d69" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * Consistent section heading component with navy title + turquoise-to-pink gradient subtitle
 * Matches the "Your Health Journey / Simplified" and "Find a Clinic / Near You" pattern
 * Includes entrance animation for visual polish
 */
const SectionHeading = ({
  title,
  gradientText,
  className,
  titleClassName,
  gradientClassName,
  animate = true,
  showSwoosh = true,
}: SectionHeadingProps) => {
  return (
    <div className={cn(
      "text-center mb-4 sm:mb-6",
      animate && "animate-fade-in",
      className
    )}>
      {showSwoosh && <PinkSwoosh />}
      <h2 className={cn(
        "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold leading-tight",
        titleClassName
      )}>
        <span>{title} </span>
        <span className={cn(gradientClassName)}>
          {gradientText}
        </span>
      </h2>
    </div>
  );
};

export { SectionHeading, PinkSwoosh };
