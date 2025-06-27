
import React, { useState } from 'react';
import { Star, Clock, MapPin, Shield, Users, ChevronRight, Heart, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface ProductDetailProps {
  productId: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Mock product data
  const product = {
    id: productId,
    name: "Complete Health MOT",
    provider: "Medichecks",
    providerLogo: "/api/placeholder/80/40",
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    reviewCount: 2847,
    description: "Our most comprehensive health check covering 68 biomarkers including full blood count, liver function, kidney function, diabetes markers, cholesterol, vitamins, minerals, and hormones.",
    turnaroundTime: "2-3 working days",
    collectionMethod: "At-home finger prick test",
    sampleType: "Blood",
    fasting: "12 hours",
    accreditations: ["UKAS", "CQC", "ISO 15189"],
    biomarkers: [
      "Full Blood Count (12 markers)",
      "Liver Function (7 markers)",
      "Kidney Function (4 markers)",
      "Bone Health (3 markers)",
      "Diabetes (3 markers)",
      "Cholesterol (6 markers)",
      "Thyroid Function (3 markers)",
      "Vitamins (8 markers)",
      "Minerals (5 markers)",
      "Hormones (17 markers)"
    ],
    whoIsItFor: [
      "Adults over 30 seeking comprehensive health insight",
      "Those with family history of chronic conditions",
      "Individuals experiencing unexplained symptoms",
      "Health-conscious people wanting preventive screening"
    ],
    whatYouGet: [
      "At-home test kit with detailed instructions",
      "Comprehensive results report",
      "GP-reviewed results with recommendations",
      "Personal health dashboard access",
      "Free follow-up consultation if needed"
    ]
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <span>Health Tests</span>
        <ChevronRight className="h-4 w-4" />
        <span>Blood Tests</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Product Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={product.providerLogo} 
                alt={product.provider} 
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-gray-600">{product.provider}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="font-medium ml-1">{product.rating}</span>
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
              </div>
              <div className="flex gap-1">
                {product.accreditations.map(acc => (
                  <Badge key={acc} variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {acc}
                  </Badge>
                ))}
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Quick Facts */}
          <Card className="p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Clock className="h-5 w-5 text-health-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Results in</div>
                <div className="text-xs text-gray-600">{product.turnaroundTime}</div>
              </div>
              <div className="text-center">
                <MapPin className="h-5 w-5 text-health-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Collection</div>
                <div className="text-xs text-gray-600">{product.collectionMethod}</div>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 text-health-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Biomarkers</div>
                <div className="text-xs text-gray-600">68 markers</div>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 text-health-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Fasting</div>
                <div className="text-xs text-gray-600">{product.fasting}</div>
              </div>
            </div>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="biomarkers" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="biomarkers">What's Tested</TabsTrigger>
              <TabsTrigger value="who-for">Who It's For</TabsTrigger>
              <TabsTrigger value="what-get">What You Get</TabsTrigger>
            </TabsList>
            
            <TabsContent value="biomarkers" className="mt-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Biomarkers Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.biomarkers.map((marker, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-health-600 rounded-full"></div>
                      <span className="text-sm">{marker}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="who-for" className="mt-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">This Test Is Ideal For</h3>
                <div className="space-y-2">
                  {product.whoIsItFor.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="what-get" className="mt-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">What's Included</h3>
                <div className="space-y-2">
                  {product.whatYouGet.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="p-6">
              <div className="text-3xl font-bold text-health-600 mb-2">
                £{product.price}
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    £{product.originalPrice}
                  </span>
                )}
              </div>
              
              {product.originalPrice && (
                <div className="text-sm text-green-600 mb-4">
                  Save £{product.originalPrice - product.price} 
                  ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                </div>
              )}
              
              <Button className="w-full mb-4 bg-health-600 hover:bg-health-700 text-lg py-6">
                Book This Test
              </Button>
              
              <div className="flex gap-2 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex-1"
                >
                  <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sample type:</span>
                  <span>{product.sampleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fasting required:</span>
                  <span>{product.fasting}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Results in:</span>
                  <span>{product.turnaroundTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection:</span>
                  <span>{product.collectionMethod}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Need help choosing?</div>
                <Button variant="outline" size="sm" className="w-full">
                  Compare Similar Tests
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
