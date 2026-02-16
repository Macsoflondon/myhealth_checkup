import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import logo1 from "@/assets/logo-1.svg";
import logo2 from "@/assets/logo-2.svg";
import logo3 from "@/assets/logo-3.svg";

interface AnimatedLogoProps {
  className?: string;
  mobileClassName?: string;
}

const logos = [logo1, logo2, logo3];

export const AnimatedLogo = ({ className, mobileClassName }: AnimatedLogoProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % logos.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative", className, mobileClassName)}>
      <img
        src={logos[currentIndex]}
        alt="myhealth checkup"
        className={cn(
          "relative z-10 h-full w-auto object-contain transition-opacity duration-1000",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
};
