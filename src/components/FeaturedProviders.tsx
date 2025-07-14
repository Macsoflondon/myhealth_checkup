import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Clock, CreditCard } from "lucide-react";

const FeaturedProviders = () => {
  const providers = [
    {
      name: "Medichecks",
      logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=50&fit=crop",
      rating: 4.8,
      reviews: 12000,
      turnaround: "24-48 hrs",
      payLater: ["Clearpay", "Klarna"],
      badges: ["UKAS", "CQC"],
      mostPopular: true
    },
    {
      name: "Thriva",
      logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=50&fit=crop",
      rating: 4.7,
      reviews: 8500,
      turnaround: "2-3 days",
      payLater: ["Payl8r"],
      badges: ["UKAS", "MHRA"],
      mostPopular: false
    },
    {
      name: "Randox",
      logo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=100&h=50&fit=crop",
      rating: 4.6,
      reviews: 6200,
      turnaround: "1-2 days",
      payLater: ["Clearpay"],
      badges: ["UKAS", "Lab Accredited"],
      mostPopular: false
    },
    {
      name: "Everlywell",
      logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=50&fit=crop",
      rating: 4.5,
      reviews: 4100,
      turnaround: "3-5 days",
      payLater: ["Klarna"],
      badges: ["FDA Approved", "CLIA"],
      mostPopular: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Providers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare trusted, accredited providers offering comprehensive health testing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((provider, index) => (
            <Card key={index} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${provider.mostPopular ? 'ring-2 ring-health-accent border-health-accent' : ''}`}>
              {provider.mostPopular && (
                <div className="absolute top-0 right-0 bg-health-accent text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img 
                    src={provider.logo} 
                    alt={`${provider.name} logo`}
                    className="h-8 w-16 object-contain"
                  />
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-900">{provider.rating}</span>
                    <span className="text-sm text-gray-500">({provider.reviews.toLocaleString()})</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">{provider.name}</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Results in</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{provider.turnaround}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {provider.badges.map((badge, badgeIndex) => (
                      <Badge key={badgeIndex} variant="secondary" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {provider.payLater.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Pay Later Available:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {provider.payLater.map((service, serviceIndex) => (
                          <Badge key={serviceIndex} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders;