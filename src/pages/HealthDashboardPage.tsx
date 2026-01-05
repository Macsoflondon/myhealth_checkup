import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HealthDataHub } from "@/components/dashboard/HealthDataHub";
import { useAuth } from "@/context/AuthContext";

const HealthDashboardPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Health Dashboard | myhealth checkup</title>
        <meta 
          name="description" 
          content="Track your health journey with test results, biomarkers, and wellness data all in one place. Upload test results and view trends over time." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <HealthDataHub />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HealthDashboardPage;
