import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import logoTurquoise from "@/assets/logo-turquoise.png";
import logoPink from "@/assets/logo-pink.png";

interface AnimatedLogoProps {
  className?: string;
  mobileClassName?: string;
}

const logos = [
  { src: logoTurquoise, glowClass: "logo-glow-turquoise" },
  { src: logoPink, glowClass: "logo-glow-pink" },
];

export const AnimatedLogo = ({ className, mobileClassName }: AnimatedLogoProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Wait for fade out, then switch logo
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % logos.length);
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentLogo = logos[currentIndex];

  return (
    <div className={cn("relative", className, mobileClassName)}>
      {/* Glow effect layer */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-xl transition-all duration-1000",
          currentLogo.glowClass,
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
        aria-hidden="true"
      />
      
      {/* Logo image */}
      <img
        src={currentLogo.src}
        alt="myhealth checkup"
        className={cn(
          "relative z-10 h-full w-auto object-contain transition-opacity duration-1000",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
};
