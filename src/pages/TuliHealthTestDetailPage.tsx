import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProviderTestDetailTemplate, { ProviderTestData } from "@/components/templates/ProviderTestDetailTemplate";
import { getProviderConfig } from "@/constants/providerTestPageConfig";
import { findTestByIdOrSlug } from "@/utils/testSlugLookup";

const providerConfig = getProviderConfig('tuli-health')!;

export default function TuliHealthTestDetailPage() {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<ProviderTestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;
      const data = await findTestByIdOrSlug('tuli-health', testId);
      setTest(data);
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
