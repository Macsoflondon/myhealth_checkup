import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProviderTestDetailTemplate, { ProviderTestData } from "@/components/templates/ProviderTestDetailTemplate";
import { getProviderConfig } from "@/constants/providerTestPageConfig";
import { findTestByIdOrSlug } from "@/utils/testSlugLookup";

interface ProviderTestDetailPageProps {
  providerId: string;
}

export default function ProviderTestDetailPage({ providerId }: ProviderTestDetailPageProps) {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<ProviderTestData | null>(null);
  const [loading, setLoading] = useState(true);

  const providerConfig = getProviderConfig(providerId)!;

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;
      setLoading(true);
      const data = await findTestByIdOrSlug(providerId, testId);
      setTest(data);
      setLoading(false);
    };

    fetchTest();
  }, [testId, providerId]);

  return (
    <ProviderTestDetailTemplate
      test={test}
      providerConfig={providerConfig}
      isLoading={loading}
      testId={testId || ''}
    />
  );
}
