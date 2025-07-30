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
    content: "My Health Hub's vitamin panel revealed my vitamin D was critically low despite no obvious symptoms. Their doctor explained everything clearly and helped me get back on track. Within 3 months, my levels were optimal and I felt much more energetic.",
    rating: 5,
    testType: "Vitamin Panel"
  }, {
    name: "David L.",
    role: "Finance Manager, 52",
    content: "After my father was diagnosed with prostate cancer, I wanted to be proactive. The PSA test from My Health Hub was simple to use at home, and the results came back quickly with clear guidance. It gave me peace of mind, and I've recommended it to all my friends.",
    rating: 5,
    testType: "PSA Test"
  }, {
    name: "Emma T.",
    role: "Teacher & Mother of 2",
    content: "I've been struggling with fatigue and digestive issues for years. My Health Hub's Gut Health package identified both a H. pylori infection and gluten sensitivity. After following their recommendations, I'm feeling better than I have in years!",
    rating: 5,
    testType: "Gut Health Panel"
  }, {
    name: "James W.",
    role: "IT Consultant, 45",
    content: "I chose the subscription plan for regular health monitoring. When my HbA1c showed pre-diabetic levels, I was able to make lifestyle changes immediately. Six months later, my levels were back to normal. This service may have saved me from developing type 2 diabetes.",
    rating: 5,
    testType: "Health Hub Essentials"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Real stories from people who've taken control of their health
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Badge variant="outline" className="mb-4">
                  {testimonials[currentIndex].testType}
                </Badge>
              </div>
              
              <blockquote className="text-lg text-gray-700 text-center mb-6 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>
              
              <div className="text-center">
                <p className="font-semibold text-gray-900">{testimonials[currentIndex].name}</p>
                <p className="text-gray-600">{testimonials[currentIndex].role}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={previousTestimonial}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;