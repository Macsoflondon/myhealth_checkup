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
  return <section className="bg-white py-[10px] font-semibold text-[#22c0d4] text-5xl">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          
          <div className="text-center mb-12">
            
            
            
          </div>

          {/* Partner logos */}
          

          {/* Media mentions */}
          <div className="text-center">
            <p className="mb-4 text-center text-[#7429c1] text-4xl font-normal">Partners featured in</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {mediaLogos.map((media, index) => <span key={index} className="text-lg font-semibold text-[#081129]">
                  {media}
                </span>)}
            </div>
          </div>

          {/* Health category cards */}
          
        </div>
      </div>
    </section>;
};
export default PartnerShowcase;