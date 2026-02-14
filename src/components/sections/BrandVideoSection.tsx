import goodbodyVideo from "@/assets/goodbody-animation.mp4";
import medichecksVideo from "@/assets/medichecks-animation.mp4";

const BrandVideoSection = () => {
  return (
    <section className="w-full bg-brand-navy py-8 sm:py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="text-center text-base sm:text-2xl uppercase tracking-[0.2em] text-white/60 font-heading mb-6 sm:mb-10">
          Our Featured Partners of the Month
        </p>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 max-w-5xl mx-auto sm:items-start sm:ml-[5%] sm:mr-auto">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full sm:w-[50%] sm:flex-shrink-0 h-auto rounded-lg sm:rounded-xl sm:-translate-y-4"
            aria-label="GoodBody Clinic – Your health. Your choice. One trusted platform!"
          >
            <source src={goodbodyVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full sm:w-[45%] h-auto rounded-lg sm:rounded-xl sm:mt-8"
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
