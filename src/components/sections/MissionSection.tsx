const MissionSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            <span className="text-[hsl(var(--navy))]">Your health is your </span>
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              greatest asset
            </span>
          </h2>
          
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            <p>
              At myhealth checkup, we believe everyone deserves access to transparent, trustworthy health information. Our mission is to empower you to take control of your health by making it simple to compare private health tests from accredited UK providers.
            </p>
            <p>
              We only feature providers that meet rigorous quality standards, including UKAS accreditation and CQC regulation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
