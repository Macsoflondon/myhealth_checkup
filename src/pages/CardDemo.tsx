import { InteractiveProductCard } from "@/components/ui/card-7";

const cards = [
  { title: "Full Body Checkup", description: "HealthLabs Diagnostics", price: "$129" },
  { title: "Complete Blood Count", description: "MediCore Diagnostics", price: "$39" },
  { title: "Diabetes Screening Panel", description: "QuickTest Labs", price: "$45" },
  { title: "Lipid Profile Test", description: "PrimeCare Health", price: "$35" },
  { title: "Thyroid Function Test", description: "Apex Diagnostics", price: "$49" },
  { title: "Vitamin D and B12 Panel", description: "Wellness Path Labs", price: "$59" },
  { title: "Liver Function Test", description: "CarePlus Diagnostics", price: "$42" },
  { title: "Kidney Function Test", description: "TrueHealth Labs", price: "$42" },
  { title: "COVID-19 RT-PCR Test", description: "VitalCheck Labs", price: "$25" },
];

const img = (seed: string) =>
  `https://placehold.co/600x800/081129/22c0d4?text=${encodeURIComponent(seed)}`;
const logo = (seed: string) =>
  `https://placehold.co/80x80/e70d69/ffffff?text=${encodeURIComponent(seed.charAt(0))}`;

export const CardDemo = () => {
  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Our Partners' Most Popular Tests
          </h1>
          <p className="text-lg text-muted-foreground">Find Your Perfect Test Match</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {cards.map((c) => (
            <InteractiveProductCard
              key={c.title}
              imageUrl={img(c.title)}
              logoUrl={logo(c.description)}
              title={c.title}
              description={c.description}
              price={c.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardDemo;
