import { AffiliateCommissionNote } from "@/components/compliance/AffiliateCommissionNote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { EducationalProviderDetails } from "./educational-provider-details";
import { formatCatalogueMoney, type EducationalProvider } from "@/services/educational-test-catalogue";

export function ProviderComparisonSidebar({ providers }: { providers: EducationalProvider[] }) {
  return (
    <Card className="min-w-0 bg-brand-navy border-brand-navy lg:sticky lg:top-8">
      <CardHeader><CardTitle className="text-center text-on-dark">Compare providers</CardTitle></CardHeader>
      <CardContent className="min-w-0 space-y-4">
        {providers.length === 0 && <p className="text-sm text-on-dark-muted">No matched catalogue tests available.</p>}
        {providers.map((provider) => (
          <div key={provider.id} className="min-w-0 space-y-3 rounded-lg border border-on-dark/20 p-4">
            <h4 className="font-semibold text-on-dark break-words">{provider.name}</h4>
            <p className="text-sm text-on-dark-muted break-words">{provider.testName}</p>
            <div><p className="text-xs text-on-dark-muted">Total expected cost</p><p className="text-xl font-bold text-brand-turquoise">{formatCatalogueMoney(provider.price)}</p></div>
            <EducationalProviderDetails provider={provider} />
            <Button size="sm" className="min-h-11 w-full bg-brand-turquoise text-brand-navy hover:bg-brand-pink hover:text-on-dark" asChild>
              <a href={provider.bookingUrl} target="_blank" rel="noopener sponsored">Book<ExternalLink className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        ))}
        <AffiliateCommissionNote className="text-on-dark-muted" />
        <div className="border-t border-on-dark/20 pt-4"><Button variant="outline" size="lg" className="w-full border-on-dark/30 text-on-dark hover:bg-on-dark/10" asChild><Link to="/compare">Compare all tests</Link></Button></div>
      </CardContent>
    </Card>
  );
}
