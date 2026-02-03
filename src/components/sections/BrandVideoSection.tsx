import brandVideo from "@/assets/brand-tagline-video.mp4";

const BrandVideoSection = () => {
  return (
    <section className="w-full bg-brand-navy py-5 sm:py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-auto rounded-lg sm:rounded-xl"
          aria-label="Your health. Your choice. One trusted platform!"
        >
          <source src={brandVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default BrandVideoSection;
