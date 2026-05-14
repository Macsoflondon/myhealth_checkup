import { HoverExpand_001 } from "@/components/ui/expand-on-hover";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const TEST_PRODUCTS = [
  { src: "/images/tests/advanced-well-man.webp", alt: "Advanced Well Man Blood Test", code: "Advanced Well Man", objectFit: "contain" },
  { src: "/images/tests/premium-complete-blood-test.webp", alt: "Premium Complete Blood Test", code: "Premium Complete", objectFit: "contain" },
  { src: "/images/tests/early-cancer-screening.webp", alt: "Early Cancer Screening Test", code: "Cancer Screening", objectFit: "contain" },
  { src: "/images/tests/female-hormone-fertility.webp", alt: "Female Hormone & Fertility Test", code: "Hormone & Fertility", objectFit: "contain" },
  { src: "/images/tests/thyroid-blood-test.webp", alt: "Thyroid Blood Test", code: "Thyroid", objectFit: "contain" },
  { src: "/images/tests/kidney-blood-test.webp", alt: "Kidney Blood Test", code: "Kidney", objectFit: "contain" },
  { src: "/images/tests/cholesterol-blood-test.webp", alt: "Cholesterol Blood Test", code: "Cholesterol", objectFit: "contain" },
  { src: "/images/tests/liver-blood-test.webp", alt: "Liver Blood Test", code: "Liver", objectFit: "contain" },
  { src: "/images/tests/vitamins-blood-test.webp", alt: "Vitamins Blood Test", code: "Vitamins", objectFit: "contain" },
  { src: "/images/tests/sports-fitness-blood-test.webp", alt: "Sports & Fitness Blood Test", code: "Sports & Fitness", objectFit: "contain" },
  { src: "/images/tests/episwitch-pse.webp", alt: "EpiSwitch PSE Prostate Test", code: "EpiSwitch PSE", objectFit: "contain" },
];

interface TestProductFilmstripProps {
  className?: string;
}

const TestProductFilmstrip = ({ className }: TestProductFilmstripProps) => {
  return (
    <section className={cn("py-12 md:py-20 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Explore Our"
          gradientText="Test Range"
          className="mb-4"
        />
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Browse health tests from trusted & accredited providers — compare and find the right one for you.
        </p>
        <div className="h-screen flex items-center justify-center">
          <HoverExpand_001 images={TEST_PRODUCTS} showLabels={false} />
        </div>
      </div>
    </section>
  );
};

export default TestProductFilmstrip;
