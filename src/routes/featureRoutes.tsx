import { Route, Navigate } from "react-router-dom";
import CompareTests from "@/pages/CompareTests";
import IntelligentSearchPage from "@/pages/IntelligentSearchPage";
import RecommendationsPage from "@/pages/RecommendationsPage";
import ReviewSystem from "@/components/reviews/ReviewSystem";
import AssistedTestFinderPage from "@/pages/AssistedTestFinderPage";
import FindClinicPage from "@/pages/FindClinicPage";
import ClinicDetailPage from "@/pages/ClinicDetailPage";
import ProviderProfilePage from "@/pages/ProviderProfilePage";
import ProviderTestCatalogPage from "@/pages/ProviderTestCatalogPage";
import TestDetailPage from "@/pages/TestDetailPage";
import ProviderComparisonPage from "@/pages/ProviderComparisonPage";
import ProviderTestsCatalogPage from "@/pages/ProviderTestsCatalogPage";
import MedichecksTestsCatalogPage from "@/pages/MedichecksTestsCatalogPage";
import MedichecksMensHealthPage from "@/pages/MedichecksMensHealthPage";
import BloodTestAnalysisPage from "@/pages/BloodTestAnalysisPage";
import GoodbodyClinicPage from "@/pages/GoodbodyClinicPage";
import CompareBySymptomPage from "@/pages/CompareBySymptomPage";
import CompareByGoalPage from "@/pages/CompareByGoalPage";
import SymptomDetailPage from "@/pages/SymptomDetailPage";
import GoalDetailPage from "@/pages/GoalDetailPage";

export const featureRoutes = (
  <>
    <Route path="/compare" element={<CompareTests />} />
    <Route path="/compare/symptoms" element={<CompareBySymptomPage />} />
    <Route path="/compare/symptoms/:symptomSlug" element={<SymptomDetailPage />} />
    <Route path="/compare/goals" element={<CompareByGoalPage />} />
    <Route path="/compare/goals/:goalSlug" element={<GoalDetailPage />} />
    <Route path="/search" element={<IntelligentSearchPage />} />
    <Route path="/recommendations" element={<RecommendationsPage />} />
    <Route path="/reviews" element={<ReviewSystem />} />
    <Route path="/find-test" element={<AssistedTestFinderPage />} />
    <Route path="/assisted-test-finder" element={<AssistedTestFinderPage />} />
    <Route path="/find-clinic" element={<FindClinicPage />} />
    <Route path="/find-a-clinic" element={<Navigate to="/find-clinic" replace />} />
    <Route path="/locations" element={<Navigate to="/find-clinic" replace />} />
    <Route path="/locations/:clinicId" element={<ClinicDetailPage />} />
    <Route path="/provider/:providerId" element={<ProviderProfilePage />} />
    <Route path="/provider/:providerId/tests" element={<ProviderTestCatalogPage />} />
    <Route path="/provider/:providerId/tests/:testId" element={<TestDetailPage />} />
    <Route path="/providers" element={<Navigate to="/trusted-providers" replace />} />
    <Route path="/providers/compare" element={<ProviderComparisonPage />} />
    <Route path="/providers/goodbody-clinic" element={<ProviderTestsCatalogPage providerId="goodbody-clinic" />} />
    <Route path="/goodbody-clinic" element={<GoodbodyClinicPage />} />
    <Route path="/providers/medichecks" element={<MedichecksTestsCatalogPage />} />
    <Route path="/medichecks/mens-health" element={<MedichecksMensHealthPage />} />
    <Route path="/providers/thriva" element={<ProviderTestsCatalogPage providerId="thriva" />} />
    <Route path="/providers/randox" element={<ProviderTestsCatalogPage providerId="randox" />} />
    <Route path="/providers/lola-health" element={<ProviderTestsCatalogPage providerId="lola-health" />} />
    <Route path="/providers/london-medical-laboratory" element={<ProviderTestsCatalogPage providerId="london-medical-laboratory" />} />
    <Route path="/blood-test-analysis" element={<BloodTestAnalysisPage />} />
  </>
);
