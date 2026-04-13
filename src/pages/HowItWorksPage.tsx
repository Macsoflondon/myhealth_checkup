import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HowItWorks from "@/components/sections/HowItWorks";
import Enhanced3StepProcess from "@/components/sections/Enhanced3StepProcess";
import PageBanner from "@/components/sections/PageBanner";

const HowItWorksPage = () => {
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>How It Works | myhealth checkup</title>
        <meta name="description" content="Learn how our simple 4-step process makes health testing convenient and accessible. From choosing your test to getting results in 48 hours." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/how-it-works" />
      </Helmet>
      
      <Header />
      <main className="flex-grow">
        <PageBanner
          title="How It"
          accent="Works"
          subtitle="Our simple process makes health testing convenient and accessible. From choosing your test to receiving your results — typically within a few days."
        />
        
        <HowItWorks />
        <Enhanced3StepProcess />
        
        <section className="py-10 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#081120]">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-health-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#081120]">How accurate are the tests?</h3>
                  <p className="text-gray-600">All our partner labs are UKAS-accredited and use the same equipment and standards as NHS laboratories, ensuring hospital-grade accuracy.</p>
                </div>
                
                <div className="border-l-4 border-health-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#081120]">Do I need a doctor's referral?</h3>
                  <p className="text-muted-foreground">No referral needed. You can book any test directly through our platform and get tested at your convenience.</p>
                </div>
                
                <div className="border-l-4 border-health-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#081120]">How long do results take?</h3>
                  <p className="text-muted-foreground">Most results are available within 2–5 working days, depending on the test and provider.</p>
                </div>
                
                <div className="border-l-4 border-health-500 pl-4 sm:pl-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#081120]">Are my results confidential?</h3>
                  <p className="text-muted-foreground">Yes. All results are securely stored and only accessible by you through your personal dashboard.</p>
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
