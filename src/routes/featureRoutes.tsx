import { Route, Navigate } from "react-router-dom";
import CompareTests from "@/pages/CompareTests";
import IntelligentSearchPage from "@/pages/IntelligentSearchPage";
import RecommendationsPage from "@/pages/RecommendationsPage";
import ReviewSystem from "@/components/reviews/ReviewSystem";
import AssistedTestFinderPage from "@/pages/AssistedTestFinderPage";
import FindClinicPage from "@/pages/FindClinicPage";
import LocationsPage from "@/pages/LocationsPage";
import ClinicDetailPage from "@/pages/ClinicDetailPage";
import ProviderProfilePage from "@/pages/ProviderProfilePage";
import ProviderTestCatalogPage from "@/pages/ProviderTestCatalogPage";
import TestDetailPage from "@/pages/TestDetailPage";
import AllProvidersPage from "@/pages/AllProvidersPage";
import ProviderComparisonPage from "@/pages/ProviderComparisonPage";
import GoodbodyTestsCatalogPage from "@/pages/GoodbodyTestsCatalogPage";
import MedichecksTestsCatalogPage from "@/pages/MedichecksTestsCatalogPage";
import MedichecksMensHealthPage from "@/pages/MedichecksMensHealthPage";
import ThrivaTestsCatalogPage from "@/pages/ThrivaTestsCatalogPage";
import RandoxTestsCatalogPage from "@/pages/RandoxTestsCatalogPage";
import LolaHealthTestsCatalogPage from "@/pages/LolaHealthTestsCatalogPage";

import LondonMedicalLabTestsCatalogPage from "@/pages/LondonMedicalLabTestsCatalogPage";

export const featureRoutes = (
  <>
    <Route path="/compare" element={<CompareTests />} />
    <Route path="/search" element={<IntelligentSearchPage />} />
    <Route path="/recommendations" element={<RecommendationsPage />} />
    <Route path="/reviews" element={<ReviewSystem />} />
    <Route path="/find-test" element={<AssistedTestFinderPage />} />
    <Route path="/assisted-test-finder" element={<AssistedTestFinderPage />} />
    <Route path="/find-clinic" element={<FindClinicPage />} />
    <Route path="/find-a-clinic" element={<Navigate to="/find-clinic" replace />} />
    <Route path="/locations" element={<LocationsPage />} />
    <Route path="/locations/:clinicId" element={<ClinicDetailPage />} />
    <Route path="/provider/:providerId" element={<ProviderProfilePage />} />
    <Route path="/provider/:providerId/tests" element={<ProviderTestCatalogPage />} />
    <Route path="/provider/:providerId/tests/:testId" element={<TestDetailPage />} />
    <Route path="/providers" element={<AllProvidersPage />} />
    <Route path="/providers/compare" element={<ProviderComparisonPage />} />
    <Route path="/providers/goodbody-clinic" element={<GoodbodyTestsCatalogPage />} />
    <Route path="/providers/medichecks" element={<MedichecksTestsCatalogPage />} />
    <Route path="/medichecks/mens-health" element={<MedichecksMensHealthPage />} />
    <Route path="/providers/thriva" element={<ThrivaTestsCatalogPage />} />
    <Route path="/providers/randox" element={<RandoxTestsCatalogPage />} />
    <Route path="/providers/lola-health" element={<LolaHealthTestsCatalogPage />} />
    
    <Route path="/providers/london-medical-laboratory" element={<LondonMedicalLabTestsCatalogPage />} />
  </>
);
