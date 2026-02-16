import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowRight } from "lucide-react";
const HealthResources = () => {
  const resources = [{
    title: "Complete Guide to Blood Tests",
    description: "Everything you need to know about private blood testing in the UK.",
    readTime: "5 min read",
    link: "/resources/blood-tests-guide"
  }, {
    title: "Understanding Your Results",
    description: "How to interpret common biomarkers and when to see a GP.",
    readTime: "7 min read",
    link: "/resources/understanding-results"
  }, {
    title: "Health Screening by Age",
    description: "Recommended tests for different life stages and risk factors.",
    readTime: "6 min read",
    link: "/resources/screening-by-age"
  }];
  return <section className="py-16 bg-[#081129] relative overflow-hidden">
      {/* Decorative half-circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-turquoise/5 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-pink/5 rounded-full -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-0 w-40 h-40 bg-brand-turquoise/5 rounded-full -translate-x-1/2" />
      <div className="absolute bottom-0 right-1/4 w-36 h-36 bg-brand-pink/5 rounded-full translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-[#e70d69] text-center">
            Health Resources Hub
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Clock className="w-4 h-4 mr-2" />
                    {resource.readTime}
                  </div>
                  
                  <Button variant="outline" className="w-full border-health-300 text-white bg-[#e70d69] text-center rounded-none">
                    Read More
                  </Button>
                </CardContent>
              </Card>)}
          </div>
          
          <div className="text-center mt-12 bg-[#081129]">
            <Button className="bg-health-600 hover:bg-health-700">
              View All Resources
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default HealthResources;