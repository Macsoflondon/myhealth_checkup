import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FlaskConical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getProviderRoute, getProviderDisplayName } from "@/utils/providerRoutes";

interface SimilarTest {
  id: string;
  test_name: string;
  provider_id: string;
  price: number | null;
  category: string | null;
  biomarker_count: number | null;
  provider_test_id: string | null;
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
        const { getDbCategoriesForSlug } = await import('@/constants/categories');
        const dbCategories = getDbCategoriesForSlug(category);
        
        let query = supabase
          .from('provider_tests')
          .select('id, test_name, provider_id, price, category, biomarker_count, provider_test_id')
          .eq('is_active', true);
        
        if (dbCategories && dbCategories.length > 0) {
          query = query.in('category', dbCategories);
        } else {
          query = query.ilike('category', `%${category}%`);
        }
        
        const { data, error } = await query
          .neq('provider_id', currentProvider || '')
          .order('price', { ascending: true })
          .limit(4);

        if (error) throw error;
        
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

  const formatProviderName = (providerId: string) => {
    return getProviderDisplayName(providerId);
  };

  const getTestSlug = (test: SimilarTest) => {
    if (test.provider_test_id) {
      return test.provider_test_id;
    }
    if (test.provider_id === 'goodbody-clinic' || test.provider_id === 'goodbody') {
      return test.id;
    }
    return test.test_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <Card className="mt-6 bg-white border-[#081129]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#081129]">
          <FlaskConical className="w-5 h-5 text-[#22c0d4]" />
          Compare Similar Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#081129]/60 mb-4">
          Compare this test with similar options from other trusted providers.
        </p>
        
        <div className="space-y-3">
          {similarTests.map((test) => (
            <Link
              key={test.id}
              to={`${getProviderRoute(test.provider_id)}/${getTestSlug(test)}`}
              className="block"
            >
              <div className="border border-[#081129]/20 rounded-lg p-3 hover:border-[#22c0d4]/40 hover:bg-[#081129]/5 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate text-[#081129]">{test.test_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs bg-[#081129]/10 text-[#081129]/70">
                        {formatProviderName(test.provider_id)}
                      </Badge>
                      {test.biomarker_count && (
                        <span className="text-xs text-[#081129]/50">
                          {test.biomarker_count} biomarkers
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {test.price ? (
                      <span className="font-bold text-[#22c0d4]">£{test.price}</span>
                    ) : (
                      <span className="text-sm text-[#081129]/50">Price TBC</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button variant="outline" size="sm" className="state-layer relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-300 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:relative [&_svg]:z-10 border-2 bg-transparent hover:text-white hover:scale-105 active:scale-95 h-9 px-3 w-full mt-4 text-[#081129] hover:bg-[#081129]/10 relative z-10 border-primary" asChild>
          <Link to={`/compare?category=${encodeURIComponent(category)}`}>
            View All {category} Tests
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimilarTestsSection;
