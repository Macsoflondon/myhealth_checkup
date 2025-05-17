
import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compareData } from "@/data/compareData";
import { cn } from "@/lib/utils";

interface CompareTableProps {
  category: string;
  providers: string[];
}

const CompareTable = ({ category, providers }: CompareTableProps) => {
  const isAllProviders = providers.includes("all");
  
  // Filter data based on category and selected providers
  const filteredData = compareData.filter((item) => {
    if (item.category !== category) return false;
    return isAllProviders || providers.includes(item.provider.toLowerCase());
  });

  // Get unique features across all items for the selected category
  const allFeatures = filteredData.reduce((acc, item) => {
    Object.keys(item.features).forEach((feature) => {
      if (!acc.includes(feature)) {
        acc.push(feature);
      }
    });
    return acc;
  }, [] as string[]);

  // Sort features so important ones appear first
  const sortedFeatures = [
    "turnaround",
    "collection",
    "doctorReview",
    "price",
    ...allFeatures.filter(f => !["turnaround", "collection", "doctorReview", "price"].includes(f))
  ];

  return (
    <div className="w-full overflow-auto pb-4">
      <Table>
        <TableCaption>
          Compare health services across leading providers
        </TableCaption>
        <TableHeader className="bg-gray-50 sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[180px] min-w-[180px]">Test / Service</TableHead>
            {filteredData.map((item) => (
              <TableHead 
                key={item.id}
                className="min-w-[200px]"
              >
                <div className="flex flex-col items-center gap-1">
                  <img 
                    src={item.providerLogo} 
                    alt={item.provider} 
                    className="h-10 w-auto object-contain mb-2"
                  />
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-health-600 font-bold">£{item.price.toFixed(2)}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFeatures.map((feature) => (
            <TableRow key={feature}>
              <TableCell className="font-medium bg-gray-50 sticky left-0">
                {feature === "turnaround" ? "Turnaround Time" : 
                 feature === "doctorReview" ? "Doctor Review" : 
                 feature === "price" ? "Price" : 
                 feature === "collection" ? "Sample Collection" : 
                 feature}
              </TableCell>
              {filteredData.map((item) => {
                const value = item.features[feature];
                return (
                  <TableCell key={`${item.id}-${feature}`} className="text-center">
                    {typeof value === "boolean" ? (
                      value ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )
                    ) : feature === "price" ? (
                      <span className="font-bold">£{item.price.toFixed(2)}</span>
                    ) : (
                      value || "-"
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="bg-gray-50 sticky left-0">Order</TableCell>
            {filteredData.map((item) => (
              <TableCell key={`${item.id}-order`} className="text-center">
                <Button size="sm" className="w-full">
                  Order Now
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CompareTable;
