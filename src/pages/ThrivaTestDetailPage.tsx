import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProviderTestDetailTemplate, { ProviderTestData } from "@/components/templates/ProviderTestDetailTemplate";
import { getProviderConfig } from "@/constants/providerTestPageConfig";

const providerConfig = getProviderConfig('thriva')!;

export default function ThrivaTestDetailPage() {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<ProviderTestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;

      const { data, error } = await supabase
        .from('provider_tests')
        .select('id, test_name, category, description, url, price, provider_test_id, biomarkers_list, biomarker_count')
        .eq('provider_id', 'thriva')
        .eq('provider_test_id', testId)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        const biomarkers = data.biomarkers_list 
          ? (Array.isArray(data.biomarkers_list) ? data.biomarkers_list : null)
          : null;
        setTest({ ...data, biomarkers_list: biomarkers as string[] | null });
      }
      setLoading(false);
    };

    fetchTest();
  }, [testId]);

  return (
    <ProviderTestDetailTemplate
      test={test}
      providerConfig={providerConfig}
      isLoading={loading}
      testId={testId || ''}
    />
  );
}
