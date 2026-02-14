import goodbodyVideo from "@/assets/goodbody-animation.mp4";
import medichecksVideo from "@/assets/medichecks-animation.mp4";

const BrandVideoSection = () => {
  return (
    <section className="w-full bg-brand-navy py-5 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-[3cm] max-w-4xl mx-auto sm:items-start justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full sm:w-[55%] sm:flex-shrink-0 h-auto rounded-lg sm:rounded-xl sm:scale-125 sm:origin-center sm:-translate-x-[2cm]"
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
            className="w-full h-auto rounded-lg sm:rounded-xl sm:mt-[3.5cm]"
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
