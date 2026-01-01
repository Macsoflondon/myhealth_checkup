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
import GoodbodyTestsCatalogPage from "@/pages/GoodbodyTestsCatalogPage";

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
    <Route path="/providers/goodbody-clinic" element={<GoodbodyTestsCatalogPage />} />
  </>
);
