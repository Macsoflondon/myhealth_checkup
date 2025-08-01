import { useEffect, useState } from "react";

const PartnerShowcase = () => {
  const mediaLogos = ["Bloomberg", "The Guardian", "Cosmopolitan", "TechCrunch", "Health & Fitness", "BBC Health"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaLogos.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [mediaLogos.length]);

  return (
    <section className="bg-white py-8 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="mb-6 text-center text-primary text-3xl font-normal">Partners featured in</p>
            
            {/* Floating carousel */}
            <div className="relative h-16 flex items-center justify-center">
              <div 
                className="flex gap-12 items-center transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 200}px)`,
                  width: `${mediaLogos.length * 200}px`
                }}
              >
                {mediaLogos.concat(mediaLogos).map((media, index) => (
                  <div
                    key={index}
                    className={`text-lg font-semibold text-foreground/60 whitespace-nowrap transition-opacity duration-500 ${
                      Math.abs((index % mediaLogos.length) - currentIndex) <= 1 ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{ minWidth: '180px', textAlign: 'center' }}
                  >
                    {media}
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {mediaLogos.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PartnerShowcase;