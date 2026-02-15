import medichecksVideo from "@/assets/medichecks-animation.mp4";

const BrandVideoSection = () => {
  return (
    <section className="w-full bg-brand-navy py-8 sm:py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="text-center text-base sm:text-2xl uppercase tracking-[0.2em] text-white/60 font-heading mb-6 sm:mb-10">
          Our Featured Partners of the Month
        </p>
        <div className="flex justify-center max-w-2xl mx-auto">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-auto rounded-lg sm:rounded-xl"
            aria-label="Medichecks – Your health. Your choice. One trusted platform!"
          >
            <source src={medichecksVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default BrandVideoSection;
