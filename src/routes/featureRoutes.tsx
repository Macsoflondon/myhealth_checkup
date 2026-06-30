import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";

const CompareTests = lazy(() => import("@/pages/CompareTests"));

const IntelligentSearchPage = lazy(() => import("@/pages/IntelligentSearchPage"));
const RecommendationsPage = lazy(() => import("@/pages/RecommendationsPage"));
const ReviewSystem = lazy(() => import("@/components/reviews/ReviewSystem"));
const AssistedTestFinderPage = lazy(() => import("@/pages/AssistedTestFinderPage"));
const TestFinderRecommendationsPage = lazy(() => import("@/pages/TestFinderRecommendationsPage"));
const TestFinderComparePage = lazy(() => import("@/pages/TestFinderComparePage"));
// Clinic-finder routes disabled — pages removed. Legacy paths redirect to home.
const ProviderProfilePage = lazy(() => import("@/pages/ProviderProfilePage"));
const ProviderTestCatalogPage = lazy(() => import("@/pages/ProviderTestCatalogPage"));
const TestDetailPage = lazy(() => import("@/pages/TestDetailPage"));
const ProviderComparisonPage = lazy(() => import("@/pages/ProviderComparisonPage"));
const ProviderTestsCatalogPage = lazy(() => import("@/pages/ProviderTestsCatalogPage"));
const MedichecksTestsCatalogPage = lazy(() => import("@/pages/MedichecksTestsCatalogPage"));
const MedichecksMensHealthPage = lazy(() => import("@/pages/MedichecksMensHealthPage"));
const BloodTestAnalysisPage = lazy(() => import("@/pages/BloodTestAnalysisPage"));
const GoodbodyClinicPage = lazy(() => import("@/pages/GoodbodyClinicPage"));
const CompareBySymptomPage = lazy(() => import("@/pages/CompareBySymptomPage"));
const CompareByGoalPage = lazy(() => import("@/pages/CompareByGoalPage"));
const SymptomDetailPage = lazy(() => import("@/pages/SymptomDetailPage"));
const GoalDetailPage = lazy(() => import("@/pages/GoalDetailPage"));
const ClinilabsPage = lazy(() => import("@/pages/ClinilabsPage"));
const LondonMedicalLaboratoryPage = lazy(() => import("@/pages/LondonMedicalLaboratoryPage"));
const LondonHealthCompanyPage = lazy(() => import("@/pages/LondonHealthCompanyPage"));
const MedicalDiagnosisPage = lazy(() => import("@/pages/MedicalDiagnosisPage"));
const HiddenGapDetectorPage = lazy(() => import("@/pages/HiddenGapDetectorPage"));

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
    <Route path="/find-test/recommendations" element={<TestFinderRecommendationsPage />} />
    <Route path="/find-test/compare" element={<TestFinderComparePage />} />
    <Route path="/assisted-test-finder" element={<AssistedTestFinderPage />} />
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
    <Route path="/providers/clinilabs" element={<ProviderTestsCatalogPage providerId="clinilabs" />} />
    <Route path="/providers/london-health-company" element={<ProviderTestsCatalogPage providerId="london-health-company" />} />
    <Route path="/providers/medical-diagnosis" element={<ProviderTestsCatalogPage providerId="medical-diagnosis" />} />
    <Route path="/clinilabs" element={<ClinilabsPage />} />
    <Route path="/london-medical-laboratory" element={<LondonMedicalLaboratoryPage />} />
    <Route path="/london-health-company" element={<LondonHealthCompanyPage />} />
    <Route path="/medical-diagnosis" element={<MedicalDiagnosisPage />} />
    <Route path="/blood-test-analysis" element={<BloodTestAnalysisPage />} />
    <Route path="/hidden-gap-detector" element={<HiddenGapDetectorPage />} />
  </>
);
