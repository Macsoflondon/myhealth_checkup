import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface CollectionHeaderProps {
  title: string;
  intro: string;
  breadcrumb?: string[];
}

const CollectionHeader = ({ title, intro, breadcrumb = [] }: CollectionHeaderProps) => {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-10 md:py-14">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors inline-flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
            </li>
            {breadcrumb.map((crumb, index) => (
              <li key={index} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className={index === breadcrumb.length - 1 ? "text-foreground font-medium" : ""}>
                  {crumb}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        {/* Title - Serif style, centred */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-navy mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {intro}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CollectionHeader;
