import { cn } from "@/lib/utils";

interface PageHeadingProps {
  /** Main title text (displayed in navy) */
  title: string;
  /** Accent text with gradient (displayed on second line) */
  accent?: string;
  /** Additional CSS classes */
  className?: string;
  /** Center the heading (default: true) */
  centered?: boolean;
  /** Enable entrance animation (default: true) */
  animate?: boolean;
}

/**
 * Consistent H1 heading component for all pages
 * Features navy title with turquoise-to-pink gradient accent text
 * Includes entrance animation for visual polish
 */
const PageHeading = ({ 
  title, 
  accent, 
  className,
  centered = true,
  animate = true,
}: PageHeadingProps) => {
  return (
    <div className={cn(
      centered && "text-center",
      animate && "animate-fade-in",
      className
    )}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight">
        <span className="text-[#081129] block mb-2">{title}</span>
        {accent && (
          <span 
            className="bg-gradient-to-r from-[#22c0d4] to-[#e70d69] bg-clip-text text-transparent inline-block" 
            style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {accent}
          </span>
        )}
      </h1>
    </div>
  );
};

export default PageHeading;
