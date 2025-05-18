
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
      case "bioMarkers": return "Bio Markers";
      case "turnaround": return "Turnaround Time";
      case "doctorReview": return "Doctor Review";
      case "collection": return "Sample Collection";
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
