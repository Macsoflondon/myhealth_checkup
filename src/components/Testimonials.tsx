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
  return;
};
export default Testimonials;