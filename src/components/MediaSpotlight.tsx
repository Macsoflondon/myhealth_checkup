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
          --slide-bg-color: #ffffff;
        }

        .media-spotlight {
          padding: 1.0rem 0;
          background-color: #ffffff;
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
      
      
    </>;
};
export default MediaSpotlight;