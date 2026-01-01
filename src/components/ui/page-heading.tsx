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
}

/**
 * Consistent H1 heading component for all pages
 * Features navy title with optional gradient accent text
 */
const PageHeading = ({ 
  title, 
  accent, 
  className,
  centered = true 
}: PageHeadingProps) => {
  return (
    <h1 
      className={cn(
        "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight",
        centered && "text-center",
        className
      )}
    >
      <span className="text-[#081129] block">{title}</span>
      {accent && (
        <span className="bg-gradient-to-r from-[#22c0d4] via-[#081129] to-[#e70d69] bg-clip-text text-transparent inline-block" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{accent}</span>
      )}
    </h1>
  );
};

export default PageHeading;
