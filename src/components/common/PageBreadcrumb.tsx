import { Link, useNavigate } from "react-router-dom";
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

  return (
    <div className={`flex justify-end gap-2 mb-6 ${className}`}>
      <Link
        to="/"
        className="h-10 w-10 rounded-lg bg-[#22c0d4] hover:bg-[#e70d69] text-white shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label="Home"
      >
        <Home className="h-5 w-5" />
      </Link>
      <button
        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
        className="h-10 w-10 rounded-lg bg-[#22c0d4] hover:bg-[#e70d69] text-white shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PageBreadcrumb;
