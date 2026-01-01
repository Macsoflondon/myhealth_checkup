import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  gradientText: string;
  className?: string;
  titleClassName?: string;
  gradientClassName?: string;
}

/**
 * Consistent section heading component with navy title + turquoise-to-pink gradient subtitle
 * Matches the "Your Health Journey / Simplified" and "Find a Clinic / Near You" pattern
 */
const SectionHeading = ({
  title,
  gradientText,
  className,
  titleClassName,
  gradientClassName,
}: SectionHeadingProps) => {
  return (
    <div className={cn("text-center mb-4 sm:mb-6", className)}>
      <h2 className={cn(
        "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-[#081129] mb-2",
        titleClassName
      )}>
        {title}
      </h2>
      <span 
        className={cn(
          "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold bg-gradient-to-r from-[#22c0d4] to-[#e70d69] bg-clip-text text-transparent inline-block",
          gradientClassName
        )}
        style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {gradientText}
      </span>
    </div>
  );
};

export { SectionHeading };
