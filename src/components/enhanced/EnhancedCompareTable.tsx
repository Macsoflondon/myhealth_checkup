
import React, { useState, useMemo } from "react";
import { Star, Shield, Clock, MapPin, Award, ChevronDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TestProvider {
  id: string;
  name: string;
  provider: string;
  providerLogo: string;
  price: number;
  originalPrice?: number;
  turnaroundTime: string;
  collectionMethod: string;
  biomarkers: string[];
  trustScore: number;
  accreditations: string[];
  isRecommended?: boolean;
  isBestValue?: boolean;
  reviewCount: number;
  rating: number;
  location: string;
  available: boolean;
}

interface EnhancedCompareTableProps {
  category: string;
  providers: string[];
  searchTerm?: string;
  sortOrder?: 'asc' | 'desc';
  data: TestProvider[];
}

const EnhancedCompareTable = ({ category, providers, searchTerm = '', sortOrder = 'asc', data }: EnhancedCompareTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvider = providers.includes("all") || providers.includes(item.provider.toLowerCase());
      return matchesSearch && matchesProvider;
    }).sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      return b.price - a.price;
    });
  }, [data, searchTerm, providers, sortOrder]);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const TrustBadges = ({ accreditations, trustScore }: { accreditations: string[]; trustScore: number }) => (
    <div className="flex flex-wrap gap-1">
      {accreditations.map(acc => (
        <Badge key={acc} variant="outline" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          {acc}
        </Badge>
      ))}
      <Badge variant="secondary" className="text-xs">
        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
        {trustScore}/10
      </Badge>
    </div>
  );

  return (
    <div className="w-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-health-600" />
            <span className="font-medium">Most Comprehensive</span>
          </div>
          {filteredData.find(item => item.isRecommended) && (
            <div className="text-sm text-gray-600">
              {filteredData.find(item => item.isRecommended)?.name} - 
              £{filteredData.find(item => item.isRecommended)?.price}
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-green-600" />
            <span className="font-medium">Best Value</span>
          </div>
          {filteredData.find(item => item.isBestValue) && (
            <div className="text-sm text-gray-600">
              {filteredData.find(item => item.isBestValue)?.name} - 
              £{filteredData.find(item => item.isBestValue)?.price}
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Fastest Results</span>
          </div>
          <div className="text-sm text-gray-600">
            {Math.min(...filteredData.map(item => parseInt(item.turnaroundTime)))} days
          </div>
        </Card>
      </div>

      {/* Main Comparison Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-gray-50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="min-w-[300px] sticky left-0 bg-gray-50 z-20">Test Details</TableHead>
              <TableHead className="text-center min-w-[120px]">Price</TableHead>
              <TableHead className="text-center min-w-[120px]">Trust Score</TableHead>
              <TableHead className="text-center min-w-[120px]">Turnaround</TableHead>
              <TableHead className="text-center min-w-[140px]">Collection</TableHead>
              <TableHead className="text-center min-w-[100px]">Reviews</TableHead>
              <TableHead className="text-center min-w-[120px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <React.Fragment key={item.id}>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="sticky left-0 bg-white z-10">
                    <div className="flex items-start gap-3">
                      <img 
                        src={item.providerLogo} 
                        alt={item.provider} 
                        className="h-8 w-8 object-contain flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          {item.isRecommended && (
                            <Badge className="bg-health-600 text-white text-xs">Recommended</Badge>
                          )}
                          {item.isBestValue && (
                            <Badge className="bg-green-600 text-white text-xs">Best Value</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{item.provider}</p>
                        <TrustBadges accreditations={item.accreditations} trustScore={item.trustScore} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(item.id)}
                          className="mt-1 p-0 h-auto text-xs text-health-600"
                        >
                          {expandedRows.has(item.id) ? 'Hide' : 'Show'} details
                          <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${expandedRows.has(item.id) ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-health-600">£{item.price}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-gray-500 line-through">£{item.originalPrice}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.trustScore}/10</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{item.turnaroundTime}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{item.collectionMethod}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({item.reviewCount})</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      className="bg-health-600 hover:bg-health-700 text-white"
                      disabled={!item.available}
                    >
                      {item.available ? 'Book Now' : 'Out of Stock'}
                    </Button>
                  </TableCell>
                </TableRow>
                
                {expandedRows.has(item.id) && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-gray-50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Biomarkers Tested</h4>
                          <div className="flex flex-wrap gap-1">
                            {item.biomarkers.map(marker => (
                              <Badge key={marker} variant="outline" className="text-xs">
                                {marker}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Location & Service</h4>
                          <p className="text-sm text-gray-600">{item.location}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.collectionMethod}</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EnhancedCompareTable;
