import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink } from "lucide-react";
import { AffiliateCommissionNote } from "@/components/compliance/AffiliateCommissionNote";
import { EducationalProviderDetails } from "./educational-provider-details";
import { formatCatalogueMoney, type EducationalProvider } from "@/services/educational-test-catalogue";

export function ProviderPriceComparison({ providers }: { providers: EducationalProvider[]; testName: string }) {
  return (
    <Card className="mt-6 min-w-0 bg-brand-navy border-brand-navy">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-on-dark"><Award className="h-5 w-5 shrink-0 text-brand-turquoise" />Price comparison</CardTitle>
        <p className="text-xs text-on-dark-muted">Sorted by total expected cost, low to high</p>
      </CardHeader>
      <CardContent className="min-w-0">
        {providers.length === 0 && <p className="text-sm text-on-dark-muted">No matched catalogue tests available.</p>}
        <div className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.id} className="grid min-w-0 gap-3 rounded-lg border border-on-dark/20 p-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <h4 className="font-medium text-on-dark break-words">{provider.name}</h4>
                <p className="mb-2 text-sm text-on-dark-muted break-words">{provider.testName}</p>
                <EducationalProviderDetails provider={provider} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
                <div className="text-on-dark"><p className="text-xs">Total expected cost</p><p className="font-bold text-brand-turquoise">{formatCatalogueMoney(provider.price)}</p></div>
                <Button size="sm" className="min-h-11 bg-brand-turquoise text-brand-navy hover:bg-brand-pink hover:text-on-dark" asChild>
                  <a href={provider.bookingUrl} target="_blank" rel="noopener sponsored">Book<ExternalLink className="ml-1 h-3 w-3" /></a>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <AffiliateCommissionNote className="mt-4 text-on-dark-muted" />
      </CardContent>
    </Card>
  );
}
