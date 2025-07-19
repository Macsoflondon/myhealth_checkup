import { Card, CardContent } from "@/components/ui/card";
const FounderStory = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded with a mission to make healthcare accessible and transparent, 
                My Health Hub was created to empower individuals to take control of their health journey.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-4">Why We Started</h3>
                <p className="text-gray-600 mb-4">
                  We believe everyone deserves access to high-quality health testing without the long waits 
                  and complexity of traditional healthcare systems.
                </p>
                <p className="text-gray-600">
                  Our platform connects you with trusted providers, giving you the power to compare, 
                  choose, and book the right tests for your health needs.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-2">Our Mission</h4>
                <p className="text-sm text-gray-600">
                  To democratize healthcare by providing transparent, accessible, and comprehensive 
                  health testing solutions for everyone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default FounderStory;