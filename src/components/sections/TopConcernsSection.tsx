import { Link } from "react-router-dom";
import { Activity, Heart, Droplets, Zap, User, UserCheck, ShieldCheck, Link2, Settings, Ribbon, Flame, Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  link: string;
}

const categories: CategoryCard[] = [
  {
    id: "general-health",
    title: "General Health Checks",
    description: "Comprehensive wellness screening for overall health monitoring.",
    icon: Activity,
    colorClass: "text-[#22c0d4]",
    link: "/compare?category=general-health"
  },
  {
    id: "heart-cholesterol",
    title: "Heart & Cholesterol",
    description: "Cardiovascular health and lipid profile assessments.",
    icon: Heart,
    colorClass: "text-[#e70d69]",
    link: "/compare?category=heart-health"
  },
  {
    id: "diabetes",
    title: "Diabetes & Blood Sugar",
    description: "Blood glucose and HbA1c monitoring for diabetes care.",
    icon: Droplets,
    colorClass: "text-[#22c0d4]",
    link: "/compare?category=diabetes"
  },
  {
    id: "hormones",
    title: "Hormones & Fertility",
    description: "Hormone balance and reproductive health testing.",
    icon: Zap,
    colorClass: "text-[#f59e0b]",
    link: "/compare?category=hormones"
  },
  {
    id: "mens-health",
    title: "Men's Health",
    description: "Tailored tests for male-specific health concerns.",
    icon: User,
    colorClass: "text-[#e70d69]",
    link: "/compare?category=mens-health"
  },
  {
    id: "womens-health",
    title: "Women's Health",
    description: "Specialised screening for female health needs.",
    icon: UserCheck,
    colorClass: "text-[#e70d69]",
    link: "/compare?category=womens-health"
  },
  {
    id: "sexual-health",
    title: "Sexual Health & STIs",
    description: "Confidential STI screening and sexual wellness tests.",
    icon: ShieldCheck,
    colorClass: "text-[#22c0d4]",
    link: "/compare?category=sexual-health"
  },
  {
    id: "vitamins",
    title: "Vitamins & Nutrition",
    description: "Nutritional deficiency and vitamin level testing.",
    icon: Link2,
    colorClass: "text-[#e70d69]",
    link: "/compare?category=vitamins"
  },
  {
    id: "thyroid",
    title: "Thyroid Health",
    description: "Complete thyroid function and antibody testing.",
    icon: Settings,
    colorClass: "text-[#22c0d4]",
    link: "/compare?category=thyroid"
  },
  {
    id: "cancer-screening",
    title: "Cancer Screening",
    description: "Early detection markers for various cancer types.",
    icon: Ribbon,
    colorClass: "text-[#22c0d4]",
    link: "/compare?category=cancer"
  },
  {
    id: "longevity",
    title: "Longevity & Performance",
    description: "Advanced biomarkers for optimal health and ageing.",
    icon: Flame,
    colorClass: "text-[#e70d69]",
    link: "/compare?category=longevity"
  },
  {
    id: "weight-metabolism",
    title: "Weight & Metabolism",
    description: "Metabolic health and weight management insights.",
    icon: Scale,
    colorClass: "text-[#22c0d4]",
    link: "/compare?category=metabolism"
  }
];

const TopConcernsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      {/* Top gradient divider */}
      <div className="h-1 w-full bg-gradient-to-r from-[hsl(187,72%,48%)] to-[hsl(335,89%,48%)] -mt-16 mb-16" />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-4 text-brand-pink">
            Comprehensive Care for Your Top Concerns
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our clinically curated categories to find the right test for your health needs.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                to={category.link}
                className="group p-6 bg-card rounded-xl border-2 border-[#081129] hover:shadow-[0_0_20px_rgba(8,17,41,0.15)] hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 group-hover:-translate-y-1 transition-all duration-300">
                  <IconComponent className={`w-6 h-6 ${category.colorClass} transition-colors duration-300`} />
                </div>
                <h3 className="font-semibold text-[#081129] mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-[#081129] leading-relaxed">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-[#22c0d4] hover:bg-[#e70d69] text-white transition-colors duration-300"
          >
            <Link to="/compare">
              View all categories
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopConcernsSection;
