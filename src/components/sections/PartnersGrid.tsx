import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { providers } from "@/constants/providers";
import { SectionHeading } from "@/components/ui/section-heading";

const PartnersGrid = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.8;

    // Measure actual rendered width of one full set of providers
    const measureSetWidth = () => {
      const children = track.children;
      if (!children.length) return 0;
      let total = 0;
      for (let i = 0; i < providers.length && i < children.length; i++) {
        total += (children[i] as HTMLElement).offsetWidth;
      }
      return total;
    };

    let setWidth = measureSetWidth();

    const animate = () => {
      if (!setWidth) {
        setWidth = measureSetWidth();
      }
      position -= speed;
      if (setWidth > 0 && Math.abs(position) >= setWidth) {
        position += setWidth;
      }
      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Quadruple for seamless loop
  const items = [...providers, ...providers, ...providers, ...providers];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#081129] relative overflow-hidden">
      {/* Decorative half-circles */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-turquoise/5 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-pink/5 rounded-full -translate-x-1/3 translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-turquoise/5 rounded-full translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/3 left-0 w-44 h-44 bg-brand-pink/5 rounded-full -translate-x-1/2" />
      <div className="absolute top-0 left-1/3 w-36 h-36 bg-brand-turquoise/5 rounded-full -translate-y-1/2" />
      <div className="absolute top-[20%] right-[15%] w-52 h-52 bg-brand-pink/[0.04] rounded-full" />
      <div className="absolute bottom-[20%] left-[25%] w-40 h-40 bg-brand-turquoise/[0.03] rounded-full" />
      <div className="absolute top-[60%] right-[40%] w-48 h-48 bg-brand-pink/[0.03] rounded-full" />
      <div className="absolute top-0 right-[55%] w-60 h-60 bg-brand-turquoise/[0.04] rounded-full -translate-y-1/3" />
      <div className="absolute bottom-0 left-[50%] w-44 h-44 bg-brand-pink/[0.04] rounded-full translate-y-1/3" />
      <div className="absolute top-[45%] left-[5%] w-36 h-36 bg-brand-turquoise/[0.03] rounded-full" />
      <div className="absolute top-[5%] left-[70%] w-52 h-52 bg-brand-pink/[0.04] rounded-full" />
      <div className="absolute bottom-[5%] right-[10%] w-48 h-48 bg-brand-turquoise/[0.03] rounded-full translate-y-1/4" />
      <div className="absolute top-[50%] left-[40%] w-56 h-56 bg-brand-pink/[0.03] rounded-full" />
      <div className="absolute top-[75%] right-[30%] w-44 h-44 bg-brand-turquoise/[0.04] rounded-full" />
      <div className="absolute bottom-[40%] left-[60%] w-40 h-40 bg-brand-pink/[0.04] rounded-full" />
      <div className="absolute top-[10%] left-[10%] w-60 h-60 bg-brand-turquoise/[0.03] rounded-full -translate-x-1/3" />
      <div className="absolute bottom-[60%] right-[50%] w-36 h-36 bg-brand-pink/[0.03] rounded-full" />
      <div className="absolute top-[85%] left-[20%] w-52 h-52 bg-brand-turquoise/[0.04] rounded-full translate-y-1/3" />
      <div className="absolute top-[30%] right-[65%] w-48 h-48 bg-brand-pink/[0.04] rounded-full" />
      <div className="absolute bottom-[15%] left-[75%] w-44 h-44 bg-brand-turquoise/[0.03] rounded-full" />
      <div className="absolute top-[65%] right-[5%] w-56 h-56 bg-brand-pink/[0.03] rounded-full translate-x-1/4" />
      <div className="absolute bottom-[30%] left-[45%] w-40 h-40 bg-brand-turquoise/[0.04] rounded-full" />
      <div className="absolute top-[40%] right-[20%] w-60 h-60 bg-brand-pink/[0.03] rounded-full" />
      <div className="absolute bottom-[50%] left-[85%] w-36 h-36 bg-brand-turquoise/[0.03] rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Section label */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          <span className="text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
            Accredited & Verified
          </span>
          <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
        </div>

        <SectionHeading 
          title="Our Trusted" 
          gradientText="Partners" 
          className="mb-8 sm:mb-10"
          titleClassName="text-white"
        />

        <div
          className="relative overflow-hidden max-w-5xl mx-auto"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
            {items.map((provider, index) => {
              const isGoodbody = provider.id === 'goodbody-clinic';
              return (
                <div key={`${provider.id}-${index}`} className="shrink-0 px-3 sm:px-4" style={{ width: "260px" }}>
                  <Link
                    to={`/provider/${provider.id}`}
                    className="group bg-white rounded-xl p-6 sm:p-8 flex items-center justify-center 
                      w-full h-32 sm:h-40 overflow-hidden
                      border-2 border-[#22c0d4] 
                      transition-all duration-300 ease-out
                      hover:shadow-lg hover:shadow-[#22c0d4]/20 
                      hover:-translate-y-1 hover:scale-105
                      hover:border-[#22c0d4]/30"
                  >
                    <img 
                      src={provider.logo} 
                      alt={`${provider.name} logo`} 
                      className={`w-auto object-contain transition-all duration-300 group-hover:scale-110 ${
                        'max-h-[90px] sm:max-h-[120px]'
                      }`} 
                      loading="lazy" 
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;
