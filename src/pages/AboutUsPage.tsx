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
        <title>About Us - My Health Hub</title>
        <meta name="description" content="Learn about My Health Hub's mission to make health testing accessible to everyone. Discover our story, values, and commitment to your wellbeing." />
      </Helmet>
      
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-health-50 to-wellness-50 my-[5px] py-px">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-health-700">
                About My Health Hub
              </h1>
              
            </div>
          </div>
        </div>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
              <div className="text-lg text-gray-600 space-y-6">
                <p>
                  At My Health Hub, we believe that proactive healthcare should be accessible to everyone. Too often, people wait until symptoms appear before taking action on their health. We're changing that narrative by making comprehensive health testing as easy as booking a table at a restaurant.
                </p>
                
                
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
              <p className="text-lg text-gray-600 mb-8">
                Become part of a growing community of health-conscious individuals who are taking charge of their wellbeing through knowledge and early detection.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-600 mb-2">50,000+</div>
                  <p className="text-gray-600">Tests Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-600 mb-2">98%</div>
                  <p className="text-gray-600">Customer Satisfaction</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-600 mb-2">24hrs</div>
                  <p className="text-gray-600">Average Result Time</p>
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