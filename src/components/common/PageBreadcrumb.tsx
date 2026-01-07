import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  segments: BreadcrumbSegment[];
  backLabel?: string;
  className?: string;
}

/**
 * Combined breadcrumb navigation with back button.
 * 
 * Example usage:
 * <PageBreadcrumb 
 *   segments={[
 *     { label: "Home", href: "/" },
 *     { label: "Compare Tests", href: "/compare" },
 *     { label: "Medichecks", href: "/providers/medichecks" },
 *     { label: "Well Woman Blood Test" }
 *   ]}
 *   backLabel="Back to Compare"
 * />
 */
const PageBreadcrumb = ({ 
  segments, 
  backLabel = "Back",
  className = ""
}: PageBreadcrumbProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Find the last segment with an href to use as fallback
      const fallback = [...segments].reverse().find(s => s.href);
      navigate(fallback?.href || '/');
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 ${className}`}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            
            return (
              <BreadcrumbItem key={index}>
                {index > 0 && <BreadcrumbSeparator className="mr-1.5 sm:mr-2.5" />}
                {isLast ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : segment.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={segment.href}>{segment.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink className="text-foreground">{segment.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="gap-2 text-primary hover:text-primary/80 self-start sm:self-auto"
        size="sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Button>
    </div>
  );
};

export default PageBreadcrumb;
