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
        
        <section className="py-16 bg-[#081129]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-white">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#22c0d4] mb-4">Step 1: Choosing Your Test</h3>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">How do I choose the right test for my needs?</h4>
                      <p className="text-white">Browse our comparison platform to view tests side-by-side from trusted UK providers. Filter by category, price, turnaround time, and sample method. Each test includes detailed biomarker information and customer reviews to help you make an informed choice.</p>
                    </div>
                    
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">What information is provided for each test?</h4>
                      <p className="text-white">Every test listing includes the full biomarker panel, sample collection method (blood, saliva, urine, etc.), turnaround time, pricing, provider accreditations, and real customer reviews. You'll know exactly what you're getting before you book.</p>
                    </div>
                    
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">Can I compare tests from different providers?</h4>
                      <p className="text-white">Yes! Our platform allows you to compare identical or similar tests across multiple providers side-by-side. See price differences, turnaround times, additional services, and customer ratings all in one view.</p>
                    </div>
                    
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">Do I need a doctor's referral to book a test?</h4>
                      <p className="text-white">No referral needed. All tests on our platform can be booked directly without a GP referral, giving you convenient access to private health testing when you need it.</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#22c0d4] mb-4">Step 2: Booking Your Test</h3>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">How do I book my test?</h4>
                      <p className="text-white">Once you've chosen your test, click through to the provider's booking system. You'll be able to select your preferred appointment date and time, choose between a clinic visit or home sample collection, and complete your secure payment.</p>
                    </div>
                    
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">Can I get my test done at home?</h4>
                      <p className="text-white">Many of our providers offer home visit services or postal test kits. During the booking process, you can select your preferred sample collection method based on what the provider offers for your chosen test.</p>
                    </div>
                    
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">What payment methods are accepted?</h4>
                      <p className="text-white">Payment is handled directly by your chosen provider. Most accept major credit/debit cards, and some offer payment plans or accept private medical insurance. Check with your specific provider during booking.</p>
                    </div>
                    
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">Can I cancel or reschedule my appointment?</h4>
                      <p className="text-white">Cancellation and rescheduling policies vary by provider. Most offer flexible rescheduling options if you contact them in advance. Check your provider's specific terms during the booking process.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#22c0d4] mb-4">Step 3: Getting Results & Aftercare</h3>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">How long does it take to get my results?</h4>
                      <p className="text-white">Most results are delivered within 24-48 hours of your sample reaching the lab. Some specialised tests may take 3-5 working days. Your provider will give you a specific timeframe when you book.</p>
                    </div>
                    
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">How will I receive my results?</h4>
                      <p className="text-white">Results are typically delivered via a secure online portal where you can view, download, and print your report. Many providers also offer follow-up consultations with healthcare professionals to discuss your results.</p>
                    </div>
                    
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">Are the test results accurate and reliable?</h4>
                      <p className="text-white">All our partner providers use UKAS-accredited laboratories that meet the same rigorous standards as NHS labs. Tests are processed using hospital-grade equipment and reviewed by qualified medical professionals.</p>
                    </div>
                    
                    <div className="border-l-4 border-health-500 pl-6">
                      <h4 className="text-xl font-semibold mb-2 text-white">What should I do after receiving my results?</h4>
                      <p className="text-white">Your results will include reference ranges showing whether your biomarkers are within normal limits. Many providers offer GP consultations or specialist referrals if needed. You can also share your results with your NHS GP for continuity of care.</p>
                    </div>
                  </div>
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