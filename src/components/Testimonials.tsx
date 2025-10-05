import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  testType: string;
}
const Testimonials = () => {
  const testimonials: Testimonial[] = [{
    name: "Sarah M.",
    role: "Healthcare Professional",
    content: "myhealth checkup's vitamin panel revealed my vitamin D was critically low despite no obvious symptoms. Their doctor explained everything clearly and helped me get back on track. Within 3 months, my levels were optimal and I felt much more energetic.",
    rating: 5,
    testType: "Vitamin Panel"
  }, {
    name: "David L.",
    role: "Finance Manager, 52",
    content: "After my father was diagnosed with prostate cancer, I wanted to be proactive. The PSA test from myhealth checkup was simple to use at home, and the results came back quickly with clear guidance. It gave me peace of mind, and I've recommended it to all my friends.",
    rating: 5,
    testType: "PSA Test"
  }, {
    name: "Emma T.",
    role: "Teacher & Mother of 2",
    content: "I've been struggling with fatigue and digestive issues for years. myhealth checkup's Gut Health package identified both a H. pylori infection and gluten sensitivity. After following their recommendations, I'm feeling better than I have in years!",
    rating: 5,
    testType: "Gut Health Panel"
  }, {
    name: "James W.",
    role: "IT Consultant, 45",
    content: "I chose the subscription plan for regular health monitoring. When my HbA1c showed pre-diabetic levels, I was able to make lifestyle changes immediately. Six months later, my levels were back to normal. This service may have saved me from developing type 2 diabetes.",
    rating: 5,
    testType: "myhealth checkup Essentials"
  }];
  const [currentIndex, setCurrentIndex] = useState(0);
  const previousTestimonial = () => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1);
  };
  const nextTestimonial = () => {
    setCurrentIndex(prevIndex => prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1);
  };
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from people who've taken control of their health with our testing services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Card className="p-8">
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-700 mb-6 italic">
                  "{testimonials[currentIndex].content}"
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-gray-600">{testimonials[currentIndex].role}</p>
                </div>
                <Badge variant="secondary">{testimonials[currentIndex].testType}</Badge>
              </CardContent>
            </Card>

            <div className="flex justify-center items-center mt-6 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={previousTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-health-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;