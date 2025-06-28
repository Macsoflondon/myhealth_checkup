
import { Card, CardContent } from "@/components/ui/card";

const PartnerShowcase = () => {
  const partners = [
    { name: "Check My Body Health", logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200" },
    { name: "Goodbody", logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200" },
    { name: "LetsGetChecked", logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200" },
    { name: "Thriva", logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200" },
    { name: "Vitall", logo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200" }
  ];

  const mediaLogos = [
    "Bloomberg", "The Guardian", "Cosmopolitan", "TechCrunch"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-health-700">
            Meet our Partners
          </h2>
          
          <div className="text-center mb-12">
            <p className="text-xl text-gray-600 mb-4 max-w-4xl mx-auto">
              We compare the best Health Tests on offer from the leading providers and specialists. We only partner with companies who are dedicated to delivering trustworthy and accurate results, with full support and advice for each customer, to ensure the best experience from start to finish.
            </p>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover your current health and identify any future risks through Health Tests from the UK's leading providers and health specialists.
            </p>
          </div>

          {/* Partner logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            {partners.map((partner, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center justify-center">
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`}
                    className="h-12 w-auto object-contain"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Media mentions */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Our Partners have featured in:</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {mediaLogos.map((media, index) => (
                <span key={index} className="text-lg font-semibold text-gray-400">
                  {media}
                </span>
              ))}
            </div>
          </div>

          {/* Health category cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-pink-100 to-pink-200">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400"
                  alt="Women's Health"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-pink-700">Women's Health</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Understand your body better through quick and easy Women's Health Tests that enable you to take control of your health. You have a busy life, and you don't have time to sit and wait for a doctor's appointment.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400"
                  alt="Men's Health"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-700">Men's Health</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Some men are more at risk of developing health conditions than others, for example if there is a history of certain health concerns within the family or due to certain lifestyle choices.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200">
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400"
                  alt="Wellness"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Wellness</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Understand how your lifestyle impacts your well-being through quick and easy Health Tests that can give you the results you need to make changes and improve your health.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerShowcase;
