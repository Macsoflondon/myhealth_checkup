import { Link } from "react-router-dom";
import { MapPin, Droplets, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProviderLogo } from "@/components/providers/ProviderLogo";

interface ClinicCardProps {
  clinic: {
    id: string;
    name: string;
    full_address?: string | null;
    postal_code?: string | null;
    provider_id?: string | null;
    access_note?: string | null;
    distance?: number;
  };
  testCount?: number;
}

const ClinicCard = ({ clinic, testCount }: ClinicCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-brand-turquoise/30 transition-all duration-200">
      {clinic.provider_id && (
        <div className="mb-3">
          <ProviderLogo
            provider={clinic.provider_id}
            className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
          />
        </div>
      )}

      <h3 className="font-heading font-bold text-foreground text-lg mb-2 leading-tight">
        {clinic.name}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {clinic.full_address || clinic.postal_code}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {clinic.distance != null && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-turquoise bg-brand-turquoise/10 px-2 py-1 rounded-full">
            <MapPin className="w-3 h-3" />
            {clinic.distance.toFixed(1)} miles
          </span>
        )}
        {testCount != null && testCount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
            <FlaskConical className="w-3 h-3" />
            {testCount} tests
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-brand-turquoise" />
          <span className="text-sm text-muted-foreground">
            {clinic.access_note || "Blood Tests"}
          </span>
        </div>

        <Link to={`/locations/${clinic.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-white font-medium rounded-lg"
          >
            View Clinic
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ClinicCard;
