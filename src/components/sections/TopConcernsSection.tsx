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
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Care for Your{" "}
            <span className="bg-gradient-to-r from-[#22c0d4] to-[#1a9aa8] bg-clip-text text-transparent">
              Top Concerns
            </span>
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
                className="group p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className={`w-6 h-6 ${category.colorClass}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
