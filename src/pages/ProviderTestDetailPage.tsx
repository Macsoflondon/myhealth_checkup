import { useParams } from "@/lib/router-compat";
import { useState, useEffect } from "react";
import ProviderTestDetailTemplate, {
  ProviderTestData,
} from "@/components/templates/ProviderTestDetailTemplate";
import { getProviderConfig } from "@/constants/providerTestPageConfig";
import { findTestByIdOrSlug } from "@/utils/testSlugLookup";

interface ProviderTestDetailPageProps {
  providerId: string;
  /**
   * The test as loaded by the route loader (on the server for the first
   * page view, in the browser on later navigations). When present for the
   * current test id the page renders it straight away, with no loading
   * state and no second request.
   */
  initialTest?: ProviderTestData | null;
  /** The test id or slug that `initialTest` was loaded for. */
  initialTestKey?: string;
}

export default function ProviderTestDetailPage({
  providerId,
  initialTest = null,
  initialTestKey,
}: ProviderTestDetailPageProps) {
  const { testId } = useParams<{ testId: string }>();
  const hasInitial = Boolean(initialTest) && initialTestKey === testId;
  const [test, setTest] = useState<ProviderTestData | null>(
    hasInitial ? initialTest : null,
  );
  const [loading, setLoading] = useState(!hasInitial);

  const providerConfig = getProviderConfig(providerId)!;

  useEffect(() => {
    if (!testId) return;
    if (initialTest && initialTestKey === testId) {
      setTest(initialTest);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchTest = async () => {
      setLoading(true);
      const data = await findTestByIdOrSlug(providerId, testId);
      if (cancelled) return;
      setTest(data);
      setLoading(false);
    };

    fetchTest();
    return () => {
      cancelled = true;
    };
  }, [testId, providerId, initialTest, initialTestKey]);

  return (
    <ProviderTestDetailTemplate
      test={test}
      providerConfig={providerConfig}
      isLoading={loading}
      testId={testId || ""}
    />
  );
}
