import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, ExternalLink, Home, Building2, TestTube } from "lucide-react";
import { buildProviderBookingUrl, externalLinkProps } from "@/utils/urlTracking";
import { getProviderLogo } from "@/constants/providers";

interface ProviderTestOption {
  id: string;
  providerId: string;
  providerName: string;
  price: number;
  turnaroundTime: string;
  collectionMethod: string;
  biomarkerCount?: number;
  url?: string;
  rating?: number;
  reviews?: string;
}

interface ProviderComparisonTableProps {
  testName: string;
  providers: ProviderTestOption[];
  className?: string;
}

export const ProviderComparisonTable: React.FC<ProviderComparisonTableProps> = ({
  testName,
  providers,
  className = ""
}) => {
  if (providers.length === 0) {
    return null;
  }

  // Sort by price ascending
  const sortedProviders = [...providers].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedProviders[0]?.price;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TestTube className="h-5 w-5 text-primary" />
          Compare Prices for {testName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare this test across {providers.length} trusted UK providers
        </p>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground">Provider</th>
                <th className="pb-3 font-medium text-muted-foreground text-center">Price</th>
                <th className="pb-3 font-medium text-muted-foreground text-center">Turnaround</th>
                <th className="pb-3 font-medium text-muted-foreground text-center">Collection</th>
                <th className="pb-3 font-medium text-muted-foreground text-center">Biomarkers</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={getProviderLogo(provider.providerId)} 
                          alt={provider.providerName}
                        />
                        <AvatarFallback>{provider.providerName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link 
                          to={`/provider/${provider.providerId}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {provider.providerName}
                        </Link>
                        {provider.rating && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{provider.rating}</span>
                            {provider.reviews && <span>({provider.reviews})</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-lg font-bold text-primary">
                      £{provider.price.toFixed(2)}
                    </span>
                    {provider.price === lowestPrice && (
                      <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                        Lowest
                      </Badge>
                    )}
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{provider.turnaroundTime}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <Badge variant="outline" className="text-xs">
                      {provider.collectionMethod.includes('home') || provider.collectionMethod.includes('Home') ? (
                        <>
                          <Home className="h-3 w-3 mr-1" />
                          Home Kit
                        </>
                      ) : (
                        <>
                          <Building2 className="h-3 w-3 mr-1" />
                          Clinic
                        </>
                      )}
                    </Badge>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-sm font-medium">
                      {provider.biomarkerCount || '-'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {provider.url ? (
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                        <a 
                          href={buildProviderBookingUrl(provider.url, provider.providerId, testName)}
                          {...externalLinkProps}
                        >
                          Book Now
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </a>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/provider/${provider.providerId}`}>
                          View Provider
                        </Link>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {sortedProviders.map((provider) => (
            <Card key={provider.id} className="relative overflow-hidden">
              {provider.price === lowestPrice && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-bl">
                  Lowest Price
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={getProviderLogo(provider.providerId)} 
                      alt={provider.providerName}
                    />
                    <AvatarFallback>{provider.providerName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link 
                      to={`/provider/${provider.providerId}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {provider.providerName}
                    </Link>
                    {provider.rating && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{provider.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-xl font-bold text-primary">
                      £{provider.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <span className="text-xs">{provider.turnaroundTime}</span>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    {provider.collectionMethod.includes('home') || provider.collectionMethod.includes('Home') ? (
                      <>
                        <Home className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="text-xs">Home Kit</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="text-xs">Clinic</span>
                      </>
                    )}
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <TestTube className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <span className="text-xs">{provider.biomarkerCount || '-'} markers</span>
                  </div>
                </div>
                
                {provider.url ? (
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <a 
                      href={buildProviderBookingUrl(provider.url, provider.providerId, testName)}
                      {...externalLinkProps}
                    >
                      Book with {provider.providerName}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/provider/${provider.providerId}`}>
                      View {provider.providerName}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderComparisonTable;
