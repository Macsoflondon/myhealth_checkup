import brandVideo from "@/assets/brand-tagline-video.mp4";

const BrandVideoSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-elevation-3">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-contain bg-brand-navy"
              aria-label="Your health. Your choice. One trusted platform!"
            >
              <source src={brandVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandVideoSection;
