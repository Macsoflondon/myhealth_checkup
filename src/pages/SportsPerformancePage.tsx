import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SportsPerformancePage = () => {
  return (
    <>
      <Helmet>
        <title>Sports Performance Tests - Health Testing Platform</title>
        <meta name="description" content="Optimize your athletic performance with comprehensive sports nutrition and fitness testing." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Sports Performance Tests</h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover specialized tests to enhance your athletic performance, from nutrition assessments to fitness biomarkers.
            </p>
            
            {/* Placeholder content */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Available Sports Performance Tests</h2>
              <p className="text-gray-600">
                Sports performance tests are being loaded from our comprehensive database...
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default SportsPerformancePage;