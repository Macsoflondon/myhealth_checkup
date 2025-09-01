import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ThyroidPage = () => {
  return (
    <>
      <Helmet>
        <title>Thyroid Function Tests - Health Testing Platform</title>
        <meta name="description" content="Comprehensive thyroid testing to assess your thyroid function and hormone levels." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Thyroid Function Tests</h1>
            <p className="text-lg text-gray-600 mb-8">
              Monitor your thyroid health with comprehensive hormone testing including TSH, T3, T4, and thyroid antibodies.
            </p>
            
            {/* Placeholder content */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Available Thyroid Tests</h2>
              <p className="text-gray-600">
                Thyroid tests are being loaded from our comprehensive database...
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ThyroidPage;