import { Card, CardContent } from "@/components/ui/card";
const PartnerShowcase = () => {
  const partners = [{
    name: "Check My Body Health",
    logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200"
  }, {
    name: "Goodbody",
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200"
  }, {
    name: "LetsGetChecked",
    logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200"
  }, {
    name: "Thriva",
    logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200"
  }, {
    name: "Vitall",
    logo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200"
  }];
  const mediaLogos = ["Bloomberg", "The Guardian", "Cosmopolitan", "TechCrunch"];
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex justify-center">
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="h-12 object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PartnerShowcase;