import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProviderTestDetailTemplate, { ProviderTestData } from "@/components/templates/ProviderTestDetailTemplate";
import { getProviderConfig } from "@/constants/providerTestPageConfig";

const providerConfig = getProviderConfig('randox')!;

export default function RandoxTestDetailPage() {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<ProviderTestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;

      const { data, error } = await supabase
        .from('provider_tests')
        .select('id, test_name, category, description, url, price, provider_test_id')
        .eq('provider_id', 'randox')
        .eq('provider_test_id', testId)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        setTest(data);
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
