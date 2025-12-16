import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FlaskConical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SimilarTest {
  id: string;
  test_name: string;
  provider_id: string;
  price: number | null;
  category: string | null;
  biomarker_count: number | null;
}

interface SimilarTestsSectionProps {
  category: string;
  currentTestName?: string;
  currentProvider?: string;
}

const SimilarTestsSection = ({ 
  category, 
  currentTestName,
  currentProvider 
}: SimilarTestsSectionProps) => {
  const [similarTests, setSimilarTests] = useState<SimilarTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarTests = async () => {
      try {
        const { data, error } = await supabase
          .from('provider_tests')
          .select('id, test_name, provider_id, price, category, biomarker_count')
          .eq('is_active', true)
          .ilike('category', `%${category}%`)
          .neq('provider_id', currentProvider || '')
          .order('price', { ascending: true })
          .limit(4);

        if (error) throw error;
        
        // Filter out the current test if name matches
        const filtered = data?.filter(
          test => test.test_name.toLowerCase() !== currentTestName?.toLowerCase()
        ) || [];
        
        setSimilarTests(filtered.slice(0, 3));
      } catch (err) {
        console.error('Error fetching similar tests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarTests();
  }, [category, currentTestName, currentProvider]);

  if (loading || similarTests.length === 0) {
    return null;
  }

  const getProviderRoute = (providerId: string) => {
    const providerRoutes: Record<string, string> = {
      'medichecks': '/medichecks',
      'goodbody': '/goodbody',
      'goodbody-clinic': '/goodbody',
      'thriva': '/thriva',
      'randox': '/randox',
      'tuli-health': '/tuli-health',
      'lola-health': '/lola-health',
      'london-medical-laboratory': '/london-medical-laboratory',
    };
    return providerRoutes[providerId.toLowerCase()] || '/compare';
  };

  const formatProviderName = (providerId: string) => {
    const names: Record<string, string> = {
      'medichecks': 'Medichecks',
      'goodbody': 'Goodbody',
      'goodbody-clinic': 'Goodbody Clinic',
      'thriva': 'Thriva',
      'randox': 'Randox',
      'tuli-health': 'Tuli Health',
      'lola-health': 'Lola Health',
      'london-medical-laboratory': 'London Medical Lab',
    };
    return names[providerId.toLowerCase()] || providerId;
  };

  const generateTestSlug = (testName: string) => {
    return testName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          Compare Similar Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Compare this test with similar options from other trusted providers.
        </p>
        
        <div className="space-y-3">
          {similarTests.map((test) => (
            <Link
              key={test.id}
              to={`${getProviderRoute(test.provider_id)}/${generateTestSlug(test.test_name)}`}
              className="block"
            >
              <div className="border rounded-lg p-3 hover:border-primary hover:bg-accent/50 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{test.test_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {formatProviderName(test.provider_id)}
                      </Badge>
                      {test.biomarker_count && (
                        <span className="text-xs text-muted-foreground">
                          {test.biomarker_count} biomarkers
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {test.price ? (
                      <span className="font-bold text-primary">£{test.price}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Price TBC</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <Link to={`/compare?category=${encodeURIComponent(category)}`}>
            View All {category} Tests
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimilarTestsSection;
