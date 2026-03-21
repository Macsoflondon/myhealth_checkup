import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { TestProvider } from "@/types/TestPageTypes";
interface ProviderComparisonSidebarProps {
  providers: TestProvider[];
}
const ProviderComparisonSidebar = ({
  providers
}: ProviderComparisonSidebarProps) => {
  return <Card className="sticky top-8 bg-[#081129] border-[#081129]">
      <CardHeader>
        <CardTitle className="text-center text-white">Compare Providers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers.map((provider, index) => <div key={index} className="border border-white/20 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-white">{provider.name}</h4>
              <div className="text-right">
                <div className="text-xl font-bold text-[#22c0d4]">£{provider.price}</div>
              </div>
            </div>
            
            <div className="space-y-1">
              {provider.features.map((feature, fIndex) => <div key={fIndex} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#22c0d4]" />
                  <span className="text-white/80">{feature}</span>
                </div>)}
            </div>
            
            <Button size="sm" className="w-full bg-[#22c0d4] hover:bg-[#e70d69] text-white" asChild>
              <a href={provider.url} target="_blank" rel="noopener noreferrer" className="mx-[10px] px-0 py-0">
                Book with {provider.name}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>)}
        
        <div className="pt-4 border-t border-white/20">
          <Button variant="outline" size="lg" className="w-full border-white/30 text-white hover:bg-white/10" asChild>
            <Link to="/compare">
              Compare All Tests
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default ProviderComparisonSidebar;
