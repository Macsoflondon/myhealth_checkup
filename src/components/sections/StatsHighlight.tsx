const stats = [
  { value: "200+", label: "Tests Compared" },
  { value: "7", label: "Trusted Providers" },
  { value: "100%", label: "UKAS Accredited Labs" },
  { value: "Free", label: "No Cost to Compare" },
];

const StatsHighlight = () => {
  return (
    <section className="pt-4 pb-10 sm:pt-4 sm:pb-12 md:pt-6 md:pb-16 bg-background border-t-4 border-primary">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[hsl(224,67%,10%)] mb-1 sm:mb-2">
                {stat.value}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground font-sans">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsHighlight;
