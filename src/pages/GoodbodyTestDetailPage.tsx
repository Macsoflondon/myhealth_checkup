import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProviderTestDetailTemplate, { ProviderTestData } from "@/components/templates/ProviderTestDetailTemplate";
import { getProviderConfig } from "@/constants/providerTestPageConfig";

const providerConfig = getProviderConfig('goodbody-clinic')!;

const GoodbodyTestDetailPage = () => {
  const { testId } = useParams<{ testId: string }>();

  const { data: test, isLoading } = useQuery({
    queryKey: ["goodbody-test", testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("id, test_name, category, description, url, price, provider_test_id")
        .eq("provider_id", "goodbody-clinic")
        .eq("id", testId)
        .single();

      if (error) throw error;
      return data as ProviderTestData;
    },
  });

  return (
    <ProviderTestDetailTemplate
      test={test || null}
      providerConfig={providerConfig}
      isLoading={isLoading}
      testId={testId || ''}
    />
  );
};

export default GoodbodyTestDetailPage;
