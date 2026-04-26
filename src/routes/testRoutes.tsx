import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import ProviderRedirect from "@/components/routing/ProviderRedirect";

const CancerScreeningPage = lazy(() => import("@/pages/CancerScreeningPage"));
const CancerComparisonPage = lazy(() => import("@/pages/CancerComparisonPage"));
const CancerBiomarkersReferencePage = lazy(() => import("@/pages/CancerBiomarkersReferencePage"));
const DiabetesTestingPage = lazy(() => import("@/pages/DiabetesTestingPage"));
const HeartHealthPage = lazy(() => import("@/pages/HeartHealthPage"));
const VitaminDeficiencyPage = lazy(() => import("@/pages/VitaminDeficiencyPage"));
const GutHealthPage = lazy(() => import("@/pages/GutHealthPage"));
const MensHealthPage = lazy(() => import("@/pages/MensHealthPage"));
const WomensHealthPage = lazy(() => import("@/pages/WomensHealthPage"));
const FertilityTestsPageWrapper = lazy(() => import("@/pages/FertilityTestsPage"));
const AtHomeTestsPage = lazy(() => import("@/pages/AtHomeTestsPage"));
const MostPopularTestsPage = lazy(() => import("@/pages/MostPopularTestsPage"));
const WellnessPage = lazy(() => import("@/pages/WellnessPage"));
const SportsPerformancePage = lazy(() => import("@/pages/SportsPerformancePage"));
const ThyroidPage = lazy(() => import("@/pages/ThyroidPage"));
const HormonesPage = lazy(() => import("@/pages/HormonesPage"));
const GeneralHealthTestPage = lazy(() => import("@/pages/GeneralHealthTestPage"));
const MaleHormoneTestPage = lazy(() => import("@/pages/MaleHormoneTestPage"));
const VitaminDTestPage = lazy(() => import("@/pages/VitaminDTestPage"));
const IronProfileTestPage = lazy(() => import("@/pages/IronProfileTestPage"));
const LipidProfileTestPage = lazy(() => import("@/pages/LipidProfileTestPage"));
const WellWomanTestPage = lazy(() => import("@/pages/WellWomanTestPage"));
const FemaleHormonesTestPage = lazy(() => import("@/pages/FemaleHormonesTestPage"));
const CategoryLandingPage = lazy(() => import("@/pages/CategoryLandingPage"));
const ProviderTestDetailPage = lazy(() => import("@/pages/ProviderTestDetailPage"));

export const testRoutes = (
  <>
    {/* Dynamic Category Landing Page */}
    <Route path="/tests/:category" element={<CategoryLandingPage />} />

    {/* Legacy Category Pages - specific routes override dynamic */}
    <Route path="/tests/cancer" element={<CancerScreeningPage />} />
    <Route path="/cancer-screening-compare" element={<CancerComparisonPage />} />
    <Route path="/cancer-biomarkers-reference" element={<CancerBiomarkersReferencePage />} />
    <Route path="/tests/diabetes" element={<DiabetesTestingPage />} />
    <Route path="/tests/heart" element={<HeartHealthPage />} />
    <Route path="/tests/vitamins" element={<VitaminDeficiencyPage />} />
    <Route path="/tests/gut" element={<GutHealthPage />} />
    <Route path="/tests/mens-health" element={<MensHealthPage />} />
    <Route path="/tests/womens-health" element={<WomensHealthPage />} />
    <Route path="/fertility-tests" element={<FertilityTestsPageWrapper />} />
    <Route path="/tests/fertility" element={<Navigate to="/fertility-tests" replace />} />
    <Route path="/at-home-tests" element={<AtHomeTestsPage />} />
    <Route path="/popular-tests" element={<MostPopularTestsPage />} />
    <Route path="/most-popular-tests" element={<Navigate to="/popular-tests" replace />} />
    <Route path="/wellness" element={<WellnessPage />} />
    <Route path="/sports-performance" element={<SportsPerformancePage />} />
    <Route path="/thyroid" element={<ThyroidPage />} />
    <Route path="/hormones" element={<HormonesPage />} />
    <Route path="/mens-health" element={<Navigate to="/tests/mens-health" replace />} />
    <Route path="/womens-health" element={<Navigate to="/tests/womens-health" replace />} />

    {/* Specific Test Pages */}
    <Route path="/test/general-health" element={<GeneralHealthTestPage />} />
    <Route path="/test/male-hormones" element={<MaleHormoneTestPage />} />
    <Route path="/test/vitamin-d" element={<VitaminDTestPage />} />
    <Route path="/test/iron-profile" element={<IronProfileTestPage />} />
    <Route path="/test/lipid-profile" element={<LipidProfileTestPage />} />
    <Route path="/test/well-woman" element={<WellWomanTestPage />} />
    <Route path="/test/female-hormones" element={<FemaleHormonesTestPage />} />

    {/* Provider Test Detail Pages - inline providerId */}
    <Route path="/lola-health/:testId" element={<ProviderTestDetailPage providerId="lola-health" />} />
    <Route path="/goodbody-clinic/:testId" element={<ProviderTestDetailPage providerId="goodbody-clinic" />} />
    <Route path="/goodbody/:testId" element={<ProviderTestDetailPage providerId="goodbody-clinic" />} />
    <Route path="/medichecks/:testId" element={<ProviderTestDetailPage providerId="medichecks" />} />
    <Route path="/thriva/:testId" element={<ProviderTestDetailPage providerId="thriva" />} />
    <Route path="/randox/:testId" element={<ProviderTestDetailPage providerId="randox" />} />
    <Route path="/london-medical-laboratory/:testId" element={<ProviderTestDetailPage providerId="london-medical-laboratory" />} />

    {/* Provider route aliases/redirects for cleaner URLs */}
    <Route path="/randox-health/:testId" element={<ProviderRedirect from="randox-health" to="randox" />} />
  </>
);
