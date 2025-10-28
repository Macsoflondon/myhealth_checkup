import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const OutcomeTestimonials = () => {
  const testimonials = [
    {
      name: "Patricia R.",
      age: 42,
      location: "London",
      image: "/lovable-uploads/hero-image-2.png",
      symptomsBefore: ["Chronic Fatigue", "Brain Fog", "Weight Gain"],
      outcome: "Discovered severe vitamin D deficiency and thyroid dysfunction",
      quote: "I feel like a completely different person. My energy is back, I've lost the weight, and my mind is sharp again. Within 3 months, all my levels normalised.",
      improvement: "93% improvement in quality of life",
      testUsed: "Ultimate Performance"
    },
    {
      name: "James T.",
      age: 55,
      location: "Manchester",
      image: "/lovable-uploads/hero-image-3.png",
      symptomsBefore: ["High Cholesterol", "Family Heart History", "Anxiety"],
      outcome: "Caught pre-diabetic markers early, preventing full diabetes",
      quote: "The lipid panel showed my LDL was dangerously high. I made diet changes immediately and six months later, my cardiologist was amazed at the improvement.",
      improvement: "Reduced cardiovascular risk by 40%",
      testUsed: "Heart Health Panel"
    },
    {
      name: "Sophie M.",
      age: 35,
      location: "Birmingham",
      image: "/lovable-uploads/hero-image-4.png",
      symptomsBefore: ["Fertility Struggles", "Irregular Cycles", "Low Energy"],
      outcome: "Identified PCOS and insulin resistance affecting fertility",
      quote: "After two years of trying, the hormone panel revealed PCOS. With treatment, I conceived within 6 months. I'm now a mum to a beautiful baby girl.",
      improvement: "Achieved pregnancy after 2 years",
      testUsed: "Female Fertility"
    },
    {
      name: "David K.",
      age: 48,
      location: "Bristol",
      image: "/lovable-uploads/hero-image-1.png",
      symptomsBefore: ["Low Mood", "Poor Sleep", "Reduced Libido"],
      outcome: "Found critically low testosterone for his age",
      quote: "I thought I was just getting older. The test showed my testosterone was that of a 70-year-old. With treatment, I feel 10 years younger.",
      improvement: "Energy and mood dramatically improved",
      testUsed: "Male Hormone"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#081129] mb-4">
            Results That <span className="text-[#e70d69]">Change Lives</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Real people, real results. See how private testing helped them take control
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-64 md:h-auto">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-2xl font-bold">{current.name}</div>
                  <div className="text-sm opacity-90">{current.age}, {current.location}</div>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 sm:p-10 bg-white relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-[#e70d69] opacity-10" />
                
                {/* Symptoms Before */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Symptoms Before
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {current.symptomsBefore.map((symptom, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                  "{current.quote}"
                </blockquote>

                {/* Outcome */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-semibold text-green-800 mb-1">Discovery</div>
                  <div className="text-green-900">{current.outcome}</div>
                </div>

                {/* Improvement Stat */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-[#22c0d4] mb-1">
                    {current.improvement}
                  </div>
                  <div className="text-sm text-gray-600">Test Used: {current.testUsed}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <Button
              onClick={goToPrevious}
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-2 border-[#22c0d4] hover:bg-[#22c0d4] hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#e70d69] w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={goToNext}
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-2 border-[#22c0d4] hover:bg-[#22c0d4] hover:text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#22c0d4] mb-2">93%</div>
            <div className="text-sm text-gray-600">Improved quality of life</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#e70d69] mb-2">81%</div>
            <div className="text-sm text-gray-600">Better energy levels</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#22c0d4] mb-2">4.8/5</div>
            <div className="text-sm text-gray-600">Average customer rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#e70d69] mb-2">10k+</div>
            <div className="text-sm text-gray-600">Tests completed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutcomeTestimonials;
