import brandVideo from "@/assets/brand-tagline-video.mp4";

const BrandVideoSection = () => {
  return (
    <section className="w-full bg-brand-navy">
      <div className="w-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-auto"
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
