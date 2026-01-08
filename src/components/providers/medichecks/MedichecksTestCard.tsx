import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export interface MedichecksTestCardProps {
  id: string;
  testName: string;
  description: string | null;
  tagline?: string | null;
  isNew?: boolean;
  turnaroundDays?: number | null;
  biomarkerCount: number | null;
  rating?: number;
  reviewCount?: number;
  price: number | null;
  sampleType: string | null;
  slug: string;
}

const StarRating = ({ rating, reviewCount }: { rating: number; reviewCount: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div 
      className="flex items-center gap-1.5"
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars based on ${reviewCount} reviews`}
    >
      <div className="flex gap-0.5">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">({reviewCount})</span>
    </div>
  );
};

const MedichecksTestCard = ({
  testName,
  description,
  tagline,
  isNew,
  turnaroundDays,
  biomarkerCount,
  rating = 4.5,
  reviewCount = 100,
  price,
  sampleType,
  slug,
}: MedichecksTestCardProps) => {
  const showBanner = isNew || tagline;
  
  return (
    <article className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {/* Banner - Tagline or New Badge */}
      {showBanner && (
        <div 
          className={`py-2 px-4 text-center text-sm font-medium ${
            isNew 
              ? "bg-teal-500 text-white" 
              : "bg-navy text-white"
          }`}
        >
          {isNew ? "New" : tagline}
        </div>
      )}

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-navy leading-tight line-clamp-2 mb-2">
          {testName}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>
        )}

        {/* Metadata Bullets */}
        <ul className="space-y-1.5 mb-4 text-sm text-foreground">
          {turnaroundDays && (
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Results estimated in {turnaroundDays} working days</span>
            </li>
          )}
          {biomarkerCount && biomarkerCount > 0 && (
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{biomarkerCount} biomarkers</span>
            </li>
          )}
        </ul>

        {/* Spacer to push bottom content down */}
        <div className="flex-1" />

        {/* Star Rating */}
        <div className="mb-4">
          <StarRating rating={rating} reviewCount={reviewCount} />
        </div>

        {/* Price */}
        <div className="text-center mb-2">
          <span className="text-2xl font-bold text-foreground">
            £{price?.toFixed(2)}
          </span>
        </div>

        {/* Sample Type */}
        {sampleType && (
          <p className="text-sm text-muted-foreground text-center mb-4">
            {sampleType}
          </p>
        )}

        {/* CTA Button */}
        <Link
          to={`/medichecks/${slug}`}
          className="w-full py-3 px-4 text-center font-medium border border-border rounded-lg bg-background text-foreground hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Select test
        </Link>
      </div>
    </article>
  );
};

export default MedichecksTestCard;
