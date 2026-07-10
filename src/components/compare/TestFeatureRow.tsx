
import React from "react";
import { Check, X } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

interface TestFeatureRowProps {
  feature: string;
  items: Array<{
    id: string;
    features: {
      [key: string]: string | boolean;
    };
    price?: number;
  }>;
}

const TestFeatureRow = ({ feature, items }: TestFeatureRowProps) => {
  // Format feature name for display
  const getFeatureDisplayName = (feature: string) => {
    switch (feature) {
      case "bioMarkers": return "Biomarkers";
      case "turnaround": return "Turnaround time";
      case "doctorReview": return "Clinical review";
      case "collection": return "Collection method";
      case "sampleType": return "Sample type";
      case "additionalFees": return "Additional collection fees";
      case "totalCost": return "Total expected cost";
      case "Video otoscopy": return "Video otoscopy";
      case "Both ears": return "Both ears included";
      case "Audiologist performed": return "Audiologist performed";
      case "Free follow-up": return "Free follow-up";
      default: return feature;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium bg-gray-50 sticky left-0">
        {getFeatureDisplayName(feature)}
      </TableCell>
      {items.map((item) => {
        const value = item.features[feature];
        return (
          <TableCell key={`${item.id}-${feature}`} className="text-center">
            {typeof value === "boolean" ? (
              value ? (
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              ) : (
                <X className="h-5 w-5 text-red-500 mx-auto" />
              )
            ) : (
              value || "-"
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default TestFeatureRow;
