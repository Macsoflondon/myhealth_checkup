import { useEffect } from "react";
const MediaSpotlight = () => {
  useEffect(() => {
    const track = document.querySelector('.marquee__track');
    if (track) {
      // Safely duplicate slides using cloneNode instead of innerHTML
      const slides = Array.from(track.children);
      slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
      });
    }
  }, []);
  return <>
      <style>{`
        :root {
          --accent-color: #22c0d4;
          --slide-gap: 2.5rem;
          --slide-height: 70px;
          --slide-height-accent: 80px;
          --slide-bg-color: #081129;
        }

        .media-spotlight {
          padding: 1.0rem 0;
          background-color: #081129;
        }
        @media (min-width: 768px) {
          .media-spotlight {
            padding: 2rem 0;
          }
        }

        .media-spotlight__title {
          text-align: center;
          font-size: 2rem;
          color: var(--accent-color);
          margin-bottom: 1.0rem;
          font-weight: 800;
        }

        .marquee {
          overflow: hidden;
          position: relative;
        }

        .marquee__track {
          display: flex;
          gap: var(--slide-gap);
          animation: marquee 20s linear infinite;
        }

        .marquee__slide {
          flex-shrink: 0;
          background-color: var(--slide-bg-color);
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marquee__slide img {
          height: var(--slide-height);
          object-fit: contain;
          display: block;
        }
        /* Accent height for specific slides if needed */
        .marquee__slide.accent img {
          height: var(--slide-height-accent);
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - var(--slide-gap))); }
        }
      `}</style>
      
      <section aria-labelledby="press-mentions-title" className="media-spotlight bg-[f#ffffff] bg-[#22c0d4]">
        <h2 id="press-mentions-title" className="media-spotlight__title my-[10px] text-4xl text-[#e70d69] text-center font-semibold">As Seen In</h2>
        <div role="region" aria-label="Press mentions carousel" className="marquee bg-[#22c0d4]">
          <div className="marquee__track">
            {/* Interleaved Medicheck & Goodbody logos */}
            <div className="marquee__slide accent">
              <img src="https://www.medichecks.com/cdn/shop/files/Homepage-WH_768x768.png?v=1741598202" alt="Woman & Home logo" />
            </div>
            <div className="marquee__slide">
              <img src="https://cdn.goodbodyclinic.co.uk/wp-content/uploads/2023/01/1-3.png" alt="Goodbody Clinic logo 1" />
            </div>
            <div className="marquee__slide">
              <img src="https://www.medichecks.com/cdn/shop/files/MensHealth-2025_768x768.png?v=1741001681" alt="Men's Health logo" />
            </div>
            <div className="marquee__slide">
              <img src="https://cdn.goodbodyclinic.co.uk/wp-content/uploads/2023/01/3-2.png" alt="Goodbody Clinic logo 2" />
            </div>
            <div className="marquee__slide accent">
              <img src="https://www.medichecks.com/cdn/shop/files/Homepage-MW_768x768.png?v=1741598201" alt="Marketing Week logo" />
            </div>
            <div className="marquee__slide">
              <img src="https://cdn.goodbodyclinic.co.uk/wp-content/uploads/2023/01/2-2.png" alt="Goodbody Clinic logo 3" />
            </div>
            <div className="marquee__slide">
              <img src="https://www.medichecks.com/cdn/shop/files/Inews-2025_768x768.png?v=1741001682" alt="iNews logo" />
            </div>
            <div className="marquee__slide">
              <img src="https://cdn.goodbodyclinic.co.uk/wp-content/uploads/2023/01/4-2.png" alt="Goodbody Clinic logo 4" />
            </div>
            <div className="marquee__slide">
              <img src="https://www.medichecks.com/cdn/shop/files/Mirror-2025_768x768.png?v=1741001681" alt="Mirror logo" />
            </div>
            <div className="marquee__slide">
              <img src="https://cdn.goodbodyclinic.co.uk/wp-content/uploads/2023/01/5-2.png" alt="Goodbody Clinic logo 5" />
            </div>
            <div className="marquee__slide accent">
              <img src="https://www.medichecks.com/cdn/shop/files/Homepage-WH_768x768.png?v=1741598202" alt="Woman & Home logo" />
            </div>
            <div className="marquee__slide accent">
              <img src="https://cdn.goodbodyclinic.co.uk/wp-content/uploads/2023/03/website-as-featured-in-logos-500-%C3%97-300px.png" alt="Featured in logos 1" />
            </div>
            <div className="marquee__slide">
              <img src="https://www.medichecks.com/cdn/shop/files/MensHealth-2025_768x768.png?v=1741001681" alt="Men's Health logo" />
            </div>
            <div className="marquee__slide accent">
              <img src="https://cdn.goodbodyclinic.co.uk/wp-content/uploads/2023/03/website-as-featured-in-logos-500-%C3%97-300px-1.png" alt="Featured in logos 2" />
            </div>
            <div className="marquee__slide">
              <img src="https://cdn.goodbodyclinic.co.uk/wp-content/uploads/2023/04/BBC-logo.png" alt="BBC logo" />
            </div>
            {/* Slides will be duplicated by JS for seamless infinite loop */}
          </div>
        </div>
      </section>
    </>;
};
export default MediaSpotlight;