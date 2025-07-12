
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  testType: string;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah M.",
      role: "Healthcare Professional",
      content: "My Health Hub's vitamin panel revealed my vitamin D was critically low despite no obvious symptoms. Their doctor explained everything clearly and helped me get back on track. Within 3 months, my levels were optimal and I felt much more energetic.",
      rating: 5,
      testType: "Vitamin Panel"
    },
    {
      name: "David L.",
      role: "Finance Manager, 52",
      content: "After my father was diagnosed with prostate cancer, I wanted to be proactive. The PSA test from My Health Hub was simple to use at home, and the results came back quickly with clear guidance. It gave me peace of mind, and I've recommended it to all my friends.",
      rating: 5,
      testType: "PSA Test"
    },
    {
      name: "Emma T.",
      role: "Teacher & Mother of 2",
      content: "I've been struggling with fatigue and digestive issues for years. My Health Hub's Gut Health package identified both a H. pylori infection and gluten sensitivity. After following their recommendations, I'm feeling better than I have in years!",
      rating: 5,
      testType: "Gut Health Panel"
    },
    {
      name: "James W.",
      role: "IT Consultant, 45",
      content: "I chose the subscription plan for regular health monitoring. When my HbA1c showed pre-diabetic levels, I was able to make lifestyle changes immediately. Six months later, my levels were back to normal. This service may have saved me from developing type 2 diabetes.",
      rating: 5,
      testType: "Health Hub Essentials"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const previousTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Stories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our tests have helped people take control of their health
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <button 
            onClick={previousTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white rounded-full p-2 shadow-md z-10 hidden md:block"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="flex-shrink-0 w-full p-8 border border-gray-100">
                  <div className="mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 mt-1 block">
                      Used: {testimonial.testType}
                    </span>
                  </div>
                  
                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white rounded-full p-2 shadow-md z-10 hidden md:block"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
          
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? "bg-health-600" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="md:hidden mt-6 flex justify-center gap-4">
          <button 
            onClick={previousTestimonial}
            className="bg-white rounded-full p-2 shadow-md"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={nextTestimonial}
            className="bg-white rounded-full p-2 shadow-md"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
