import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FounderStory from "@/components/FounderStory";
import PartnerShowcase from "@/components/PartnerShowcase";
import { Shield, Users, Award, Heart } from "lucide-react";
const AboutUsPage = () => {
  const values = [{
    icon: <Shield className="h-8 w-8 text-health-600" />,
    title: "Trust & Transparency",
    description: "We believe in complete transparency about our testing processes, pricing, and partnerships."
  }, {
    icon: <Users className="h-8 w-8 text-health-600" />,
    title: "Accessibility for All",
    description: "Making high-quality health testing accessible to everyone, regardless of location or circumstance."
  }, {
    icon: <Award className="h-8 w-8 text-health-600" />,
    title: "Quality Excellence",
    description: "Partnering only with UKAS-accredited laboratories to ensure the highest standards of accuracy."
  }, {
    icon: <Heart className="h-8 w-8 text-health-600" />,
    title: "Health Empowerment",
    description: "Empowering individuals to take control of their health through knowledge and early detection."
  }];
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About Us - myhealth checkup</title>
        <meta name="description" content="Learn about myhealth checkup's mission to make health testing accessible to everyone. Discover our story, values, and commitment to your wellbeing." />
      </Helmet>
      
      <Header />
      <main className="flex-grow bg-[#1a1b34]">
        <div className="bg-gradient-to-br from-health-50 to-wellness-50 py-[4px] bg-[#1a1b34]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl mb-6 my-[30px] text-[#22c0d4] text-center md:text-4xl font-semibold">
                About myhealth checkup
              </h1>
            </div>
          </div>
        </div>

        <section className="bg-white py-[4px] my-[10px]">
          <div className="container mx-auto px-4 my-0 py-[10px] bg-[#1a1b34]">
            <div className="max-w-4xl mx-auto">
              <div className="text-lg text-gray-600 space-y-6">
                <p className="text-white my-0 py-[20px]">
                  <strong>Your Health Is Your Greatest Asset</strong> and it deserves the best care.
                  At myhealth checkup, we rigorously screen every provider we feature, ensuring you only see the UK's most reputable health and wellness testing options. From routine blood tests to advanced wellness panels, our partners meet the highest standards of quality, working with UKAS-accredited laboratories, CQC-regulated clinics, and ISO 15189-certified facilities.
                </p>
                
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#1a1b34] py-0">
          <div className="container mx-auto px-4 my-[10px]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#22c0d4] my-[20px]">Our Mission</h2>
              <div className="text-lg text-gray-600 space-y-6 max-w-4xl mx-auto">
                <p className="text-white">
                  At myhealth checkup, we believe proactive healthcare should be accessible to everyone. Too often, people wait until symptoms appear before taking action on their health. We are changing that narrative by making comprehensive health testing as easy as booking a table at a restaurant.
                </p>
                
                <p className="text-white">
                  Our platform connects you with trusted, UKAS-accredited laboratories across the UK, giving you the power to monitor your health on your terms. No more waiting weeks for GP appointments or dealing with complex referrals, just straightforward, clinical-grade testing with expert guidance.
                </p>
                
                <p className="text-[t] text-white">
                  We have partnered with leading providers to bring you the most comprehensive range of tests at competitive prices, maintaining the highest standards of accuracy and confidentiality.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-0">
          <div className="container mx-auto px-4 bg-[#1a1b34]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#22c0d4]">Our Values</h2>
              <p className="text-xl max-w-3xl mx-auto text-white">
                These core values guide everything we do and shape how we serve our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    {value.icon}
                    <h3 className="text-xl font-semibold ml-3">{value.title}</h3>
                  </div>
                  <p className="text-gray-600">{value.description}</p>
                </div>)}
            </div>
          </div>
        </section>

        <FounderStory />
        <PartnerShowcase />

        <section className="py-16 bg-[#1a1b34] my-0">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-[#22c0d4]">Join Our Community</h2>
              <p className="text-lg mb-8 text-white">
                Become part of a growing community of health-conscious individuals who are taking charge of their wellbeing through knowledge and early detection.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-600 mb-2">50,000+</div>
                  <p className="text-white">Tests Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-600 mb-2">98%</div>
                  <p className="text-white">Customer Satisfaction</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-600 mb-2">24hrs</div>
                  <p className="text-white">Average Result Time</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default AboutUsPage;