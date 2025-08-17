
import React, { useState } from "react";
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { compareData } from "@/data/compareData";
import { useAuth } from "@/context/AuthContext";

// Import our new components
import TestFeatureRow from "./compare/TestFeatureRow";
import ProviderHeader from "./compare/ProviderHeader";
import FavoriteAction from "./compare/FavoriteAction";
import OrderAction from "./compare/OrderAction";
import RealtimeToggle from "./compare/RealtimeToggle";

// Import our new hooks
import { useRealtimePriceUpdates } from "@/hooks/useRealtimePriceUpdates";
import { useFavorites } from "@/hooks/useFavorites";
import { useOrders } from "@/hooks/useOrders";

import { filterAndSortCompareData, SortOrder } from "@/lib/compareFilter";

interface CompareTableProps {
  category: string;
  providers: string[];
  searchTerm?: string;
  sortOrder?: SortOrder;
}

// Extend the compare data type to include availability
interface CompareDataWithAvailability {
  id: string;
  category: string;
  name: string;
  provider: string;
  providerLogo: string;
  price: number;
  features: {
    [key: string]: string | boolean;
  };
  available: boolean;
}

const CompareTable = ({ category, providers, searchTerm = '', sortOrder = 'asc' }: CompareTableProps) => {
  const { user } = useAuth();
  const [isRealtime, setIsRealtime] = useState(true);
  
  // Use our custom hooks
  const priceUpdates = useRealtimePriceUpdates(isRealtime);
  const { favorites, toggleFavorite } = useFavorites(user, category);
  const { placeOrder } = useOrders(user);
  
  // Filter data based on category, providers and search term
  const filteredData = filterAndSortCompareData(compareData, {
    category,
    providers,
    searchTerm,
    sortOrder
  });

  // Apply real-time price updates if available
  const dataWithUpdates: CompareDataWithAvailability[] = filteredData.map(item => {
    const update = priceUpdates.find(
      u => u.test_id === item.id && u.provider === item.provider
    );
    
    if (update) {
      return {
        ...item,
        price: update.price,
        available: update.available
      };
    }
    return {
      ...item,
      available: true // Default to available if no update
    };
  });

  // Get unique features across all items for the selected category
  const allFeatures = dataWithUpdates.reduce((acc, item) => {
    Object.keys(item.features).forEach((feature) => {
      if (!acc.includes(feature)) {
        acc.push(feature);
      }
    });
    return acc;
  }, [] as string[]);

  // Filter out the features we want to remove
  const filteredFeatures = allFeatures.filter(f => 
    !["price", "GP follow-up", "Nutritional advice"].includes(f)
  );

  // Sort features so Bio Markers appears first, followed by other important ones
  const sortedFeatures = [
    "bioMarkers",
    "turnaround",
    "collection",
    "doctorReview",
    ...filteredFeatures.filter(f => !["bioMarkers", "turnaround", "collection", "doctorReview"].includes(f))
  ];

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="font-semibold text-lg">
          {filteredData.length} results found
        </h2>
        
        <RealtimeToggle 
          isRealtime={isRealtime} 
          toggleRealtime={() => setIsRealtime(!isRealtime)} 
        />
      </div>
      
      <div className="overflow-x-auto -mx-4 px-4">
      
        <Table className="min-w-[800px]">
          <TableCaption className="text-xs md:text-sm">
            Compare health services across leading providers
          </TableCaption>
          <TableHeader className="bg-gray-50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[120px] md:w-[180px] min-w-[120px] md:min-w-[180px] text-xs md:text-sm">Test / Service</TableHead>
              {dataWithUpdates.map((item) => (
                <ProviderHeader key={item.id} item={item} />
              ))}
            </TableRow>
          </TableHeader>
        <TableBody>
          {sortedFeatures.map((feature) => (
            <TestFeatureRow 
              key={feature}
              feature={feature}
              items={dataWithUpdates}
            />
          ))}
          {/* Favorite row */}
          <TableRow>
            <TableCell className="bg-gray-50 sticky left-0 text-xs md:text-sm">Save</TableCell>
            {dataWithUpdates.map((item) => (
              <FavoriteAction 
                key={`${item.id}-favorite`}
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={(id) => toggleFavorite(id, item)}
              />
            ))}
          </TableRow>
          {/* Order row */}
          <TableRow>
            <TableCell className="bg-gray-50 sticky left-0 text-xs md:text-sm">Order</TableCell>
            {dataWithUpdates.map((item) => (
              <OrderAction
                key={`${item.id}-order`}
                item={item}
                onPlaceOrder={placeOrder}
              />
            ))}
          </TableRow>
        </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompareTable;
