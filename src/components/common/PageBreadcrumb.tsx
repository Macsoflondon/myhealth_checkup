import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  segments?: BreadcrumbSegment[];
  backLabel?: string;
  className?: string;
}

const PageBreadcrumb = ({ className = "" }: PageBreadcrumbProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render on homepage
  if (location.pathname === "/") return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 flex items-center gap-0 rounded-full shadow-2xl overflow-hidden ${className}`}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Home button */}
      <Link
        to="/"
        className="group relative flex items-center gap-2 pl-5 pr-4 py-3 bg-[hsl(var(--navy))]/90 hover:bg-[hsl(var(--brand-pink))] text-white transition-all duration-300"
        aria-label="Home"
      >
        <Home className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        <span className="text-xs font-heading font-semibold uppercase tracking-wider">Home</span>
      </Link>

      {/* Divider */}
      <div className="w-px h-6 bg-white/20" />

      {/* Back button */}
      <button
        onClick={() =>
          window.history.length > 1 ? navigate(-1) : navigate("/")
        }
        className="group relative flex items-center gap-2 pl-4 pr-5 py-3 bg-[hsl(var(--navy))]/90 hover:bg-[hsl(var(--brand-turquoise))] text-white transition-all duration-300"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        <span className="text-xs font-heading font-semibold uppercase tracking-wider">Back</span>
      </button>
    </div>
  );
};

export default PageBreadcrumb;
