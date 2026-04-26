import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  gradientText: string;
  className?: string;
  titleClassName?: string;
  gradientClassName?: string;
  /** Enable entrance animation (default: true) */
  animate?: boolean;
}

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
}: SectionHeadingProps) => {
  return (
    <div className={cn(
      "text-center mb-4 sm:mb-6",
      animate && "animate-fade-in",
      className
    )}>
      <h2 className={cn(
        "text-xl sm:text-2xl md:text-3xl lg:text-3xl font-heading font-bold leading-tight",
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

export { SectionHeading };
