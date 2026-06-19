import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HealthDataHub } from "@/components/dashboard/HealthDataHub";
import { MfaEnrollment } from "@/components/auth/MfaEnrollment";
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
        <title>My Dashboard | myhealth checkup</title>
        <meta
          name="description"
          content="Manage your saved tests, providers, orders, profile and health data in one place on myhealth checkup."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/health-dashboard" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>


      <div className="min-h-screen flex flex-col bg-white">
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
