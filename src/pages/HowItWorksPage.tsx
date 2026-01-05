import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Enhanced3StepProcess from "@/components/Enhanced3StepProcess";
const HowItWorksPage = () => {
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>How It Works - myhealth checkup</title>
        <meta name="description" content="Learn how our simple 4-step process makes health testing convenient and accessible. From choosing your test to getting results in 48 hours." />
      </Helmet>
      
      <Header />
      <main className="flex-grow">
        
        
        <HowItWorks />
        <Enhanced3StepProcess />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-health-500 pl-6">
                  <h3 className="text-xl font-semibold mb-2">How accurate are the tests?</h3>
                  <p className="text-gray-600">All our partner labs are UKAS-accredited and use the same equipment and standards as NHS laboratories, ensuring hospital-grade accuracy.</p>
                </div>
                
                <div className="border-l-4 border-health-500 pl-6">
                  <h3 className="text-xl font-semibold mb-2">Do I need a doctor's referral?</h3>
                  <p className="text-gray-600">No referral needed! You can book any test directly through our platform and get tested at your convenience.</p>
                </div>
                
                <div className="border-l-4 border-health-500 pl-6">
                  <h3 className="text-xl font-semibold mb-2">How long do results take?</h3>
                  <p className="text-gray-600">Most results are available within 24-48 hours, with some specialized tests taking up to 5 working days.</p>
                </div>
                
                <div className="border-l-4 border-health-500 pl-6">
                  <h3 className="text-xl font-semibold mb-2">Are my results confidential?</h3>
                  <p className="text-gray-600">Absolutely. All results are securely stored and only accessible by you through your personal dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default HowItWorksPage;