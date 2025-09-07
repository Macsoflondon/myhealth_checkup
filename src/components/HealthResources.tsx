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
  return <section className="py-16 bg-[#1a1b34]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#e70d69] text-center">
            Health Resources
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
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>)}
          </div>
          
          <div className="text-center mt-12 bg-[#1a1b34]">
            <Button size="lg" className="bg-health-600 hover:bg-health-700">
              View All Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default HealthResources;