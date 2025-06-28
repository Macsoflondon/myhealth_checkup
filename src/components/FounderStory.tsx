
import { Card, CardContent } from "@/components/ui/card";

const FounderStory = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-health-700">
            A Word from our Founder
          </h2>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="bg-gray-100 p-8 lg:p-12 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400"
                    alt="Founder discussing health testing solutions" 
                    className="w-full max-w-sm rounded-lg shadow-lg"
                  />
                </div>
                
                <div className="p-8 lg:p-12">
                  <blockquote className="text-lg text-gray-700 leading-relaxed mb-6">
                    "My Health Hub was born out of the need to make health testing accessible and understandable for everyone. I had been using health tests for years to monitor my family's health after we experienced health challenges that could have been prevented with early detection.
                    <br /><br />
                    Getting tested was simple and quick with results in hours, which was brilliant compared to waiting weeks for NHS appointments. However, it was expensive and I had to travel far to access quality testing.
                    <br /><br />
                    I realized that others must be in the same situation, looking for better options and closer clinics. I discovered there was no comprehensive site that compared all health tests across providers, so My Health Hub was born!
                    <br /><br />
                    My mission is to help people take control of their health by understanding their bodies, whether for prevention, lifestyle optimization, or life planning. Whatever health insights you need, we can help you find the right test."
                  </blockquote>
                  
                  <footer className="text-health-700 font-semibold">
                    — Sarah Johnson, Founder
                  </footer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FounderStory;
