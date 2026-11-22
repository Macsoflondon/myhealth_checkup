import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/router-compat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { getProviderDisplayName } from "@/utils/providerRoutes";
import { formatCatalogueMoney, getSimilarCatalogueTests, resolveSimilarCategory } from "@/services/educational-test-catalogue";
import { describeBiomarkers } from "@/lib/resolve-test-fields";

interface SimilarTestsSectionProps {
  category?: string | null;
  categoryIds?: string[] | null | undefined;
  currentTestName?: string;
  currentProvider?: string;
}

const SimilarTestsSection = ({ category, categoryIds, currentTestName, currentProvider }: SimilarTestsSectionProps) => {
  const knownCategory = resolveSimilarCategory(category, categoryIds);
  const { data: similarTests = [] } = useQuery({
    queryKey: ["similar-catalogue-tests", knownCategory, currentTestName, currentProvider],
    queryFn: () => getSimilarCatalogueTests(knownCategory, currentTestName, currentProvider),
    enabled: knownCategory !== null,
  });
  if (!knownCategory || similarTests.length === 0) return null;
  return (
    <Card className="mt-6 min-w-0 bg-white border-brand-navy">
      <CardHeader><CardTitle className="flex items-center gap-2 text-brand-navy"><FlaskConical className="h-5 w-5 text-brand-turquoise" />Compare similar tests</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {similarTests.map((test) => (
            <Link key={test.id} to={`/provider/${test.provider_id}/tests/${test.id}`} className="grid min-w-0 gap-2 rounded-lg border border-brand-navy/20 p-3 sm:grid-cols-[minmax(0,1fr)_auto] hover:border-brand-turquoise">
              <div className="min-w-0"><h4 className="text-sm font-medium text-brand-navy break-words">{test.test_name}</h4><p className="text-xs text-muted-foreground">{getProviderDisplayName(test.provider_id ?? "")} · {describeBiomarkers(test).label}</p></div>
              <div><p className="text-xs text-muted-foreground">Total expected cost</p><span className="font-bold text-brand-turquoise-text">{formatCatalogueMoney(test.total_expected_cost)}</span></div>
            </Link>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-4 min-h-11 w-full text-brand-navy" asChild><Link to={`/compare?category=${encodeURIComponent(knownCategory)}`}>View related tests</Link></Button>
      </CardContent>
    </Card>
  );
};
export default SimilarTestsSection;
