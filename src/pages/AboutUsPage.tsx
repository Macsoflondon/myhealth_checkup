import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FounderStory from "@/components/sections/FounderStory";
import PartnerShowcase from "@/components/sections/PartnerShowcase";
import TrustBadgesSection from "@/components/sections/TrustBadgesSection";
import { SectionHeading } from "@/components/ui/section-heading";
import PageBanner from "@/components/sections/PageBanner";
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
        <title>About Us | myhealth checkup</title>
        <meta name="description" content="Learn about myhealth checkup's mission to make health testing accessible to everyone. Discover our story, values, and commitment to your wellbeing." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/about" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About myhealth checkup",
          "description": "Learn about myhealth checkup's mission to make health testing accessible to everyone.",
          "url": "https://myhealthcheckup.co.uk/about",
          "isPartOf": { "@type": "WebSite", "name": "myhealth checkup", "url": "https://myhealthcheckup.co.uk" },
          "publisher": {
            "@type": "Organization",
            "name": "MYHEALTHCHECKUP LTD",
            "url": "https://myhealthcheckup.co.uk",
            "logo": "https://myhealthcheckup.co.uk/src/assets/logo-1.svg"
          }
        })}</script>
      </Helmet>
      
      <Header />
      <main className="flex-grow bg-[#081129]">
        <PageBanner
          title="About myhealth checkup"
          subtitle="Trusted health comparison platform."
        />

        <TrustBadgesSection />

        <section className="bg-[#081129] py-0">
          <div className="container mx-auto px-4 my-[10px]">
            <SectionHeading 
              title="Our" 
              gradientText="Mission" 
              className="mb-8"
              titleClassName="text-white"
            />
            <div className="text-base sm:text-lg text-muted-foreground space-y-4 sm:space-y-6 max-w-4xl mx-auto">
              <p className="text-white font-light text-left">
                At myhealth checkup, we believe proactive healthcare should be accessible to everyone. Too often, people wait until symptoms appear before taking action on their health. We are changing that narrative by making comprehensive health testing as easy as booking a table at a restaurant.
              </p>
              
              <p className="text-white text-left font-light">
                Our platform connects you with trusted, UKAS-accredited laboratories across the UK, giving you the power to monitor your health on your terms. No more waiting weeks for GP appointments or dealing with complex referrals — just straightforward, clinical-grade testing with expert guidance.
              </p>
              
              <p className="text-white font-light text-base text-left">
                We have partnered with leading providers to bring you the most comprehensive range of tests at competitive prices, maintaining the highest standards of accuracy and confidentiality.
              </p>
            </div>
          </div>
        </section>

        <section className="py-0 bg-[#081129]">
          <div className="container mx-auto px-4 bg-[#081129]">
            <SectionHeading 
              title="Our" 
              gradientText="Values" 
              className="mb-8"
              titleClassName="text-white"
            />
            <p className="max-w-3xl mx-auto text-center text-[#e70d69] font-medium text-base sm:text-xl mb-8 sm:mb-12">
              These core values guide everything we do and shape how we serve our community.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {values.map((value, index) => <div key={index} className="bg-white p-5 sm:p-8 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    {value.icon}
                    <h3 className="text-lg sm:text-xl font-semibold ml-3 text-[#081129]">{value.title}</h3>
                  </div>
                  <p className="text-gray-600">{value.description}</p>
                </div>)}
            </div>
          </div>
        </section>

        <FounderStory />
        <PartnerShowcase />

        <section className="py-10 sm:py-16 bg-[#081129] my-0">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <SectionHeading 
                title="Join The" 
                gradientText="Community" 
                className="mb-8"
                titleClassName="text-white"
              />
              <p className="mb-8 text-[#e70d69] font-medium text-lg">
                Become part of a growing community of health-conscious individuals who are taking charge of their wellbeing through knowledge and early detection.
              </p>
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-600 mb-2">9</div>
                  <p className="text-white">Accredited Providers</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-600 mb-2">300+</div>
                  <p className="text-white">Tests Compared</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-600 mb-2">250+</div>
                  <p className="text-white">Clinic Locations</p>
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
