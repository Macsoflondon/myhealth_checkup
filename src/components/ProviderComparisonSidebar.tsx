import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { TestProvider } from "@/types/TestPageTypes";

interface ProviderComparisonSidebarProps {
  providers: TestProvider[];
}

const ProviderComparisonSidebar = ({ providers }: ProviderComparisonSidebarProps) => {
  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-center">Compare Providers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers.map((provider, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">{provider.name}</h4>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">£{provider.price}</div>
              </div>
            </div>
            
            <div className="space-y-1">
              {provider.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <Button size="sm" className="w-full" asChild>
              <a 
                href={provider.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Book with {provider.name}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link to="/compare">
              Compare All Tests
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderComparisonSidebar;