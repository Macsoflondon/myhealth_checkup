const MissionSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#081129] mb-4 sm:mb-6 px-2">
            Your health is your{" "}
            <span className="text-[#22c0d4]">greatest asset!</span>
          </h2>

          <div className="space-y-3 sm:space-y-4 text-gray-600 font-sans text-sm sm:text-base md:text-lg leading-relaxed px-2">
            <p>
              At myhealth checkup, we believe everyone deserves access to transparent, trustworthy health information.
              Our mission is to empower you to take control of your health by making it simple to compare private health
              tests from accredited UK providers.
            </p>
            <p>
              We only feature providers that meet rigorous quality standards, including UKAS accreditation and CQC
              regulation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
