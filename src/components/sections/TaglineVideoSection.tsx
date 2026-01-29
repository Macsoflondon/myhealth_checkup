const TaglineVideoSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#081129]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              className="absolute inset-0 w-full h-full object-contain"
              src="/tagline-video.mp4"
              aria-label="Your health. Your choice. One trusted platform."
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaglineVideoSection;
