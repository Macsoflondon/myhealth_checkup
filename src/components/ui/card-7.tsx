"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InteractiveProductCardProps {
  imageUrl: string;
  logoUrl: string;
  title: string;
  description: string;
  price: string;
  className?: string;
}

export const InteractiveProductCard: React.FC<InteractiveProductCardProps> = ({
  imageUrl,
  logoUrl,
  title,
  description,
  price,
  className,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [hovering, setHovering] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ry = ((x - cx) / cx) * 8; // max 8deg
    const rx = -((y - cy) / cy) * 8;
    setTilt({ rx, ry });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setHovering(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative w-full max-w-[340px] aspect-[9/12] rounded-3xl bg-card shadow-lg overflow-hidden transition-transform duration-200 ease-out will-change-transform",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: hovering ? "scale(1.06) translateZ(-20px)" : "scale(1.02) translateZ(-20px)",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

      {/* Glassmorphism header */}
      <div
        className="absolute top-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md p-3 shadow-sm"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-tight truncate">{title}</h3>
          <p className="text-white/80 text-xs leading-tight truncate">{description}</p>
        </div>
        <img
          src={logoUrl}
          alt={`${description} logo`}
          className="w-10 h-10 rounded-full object-cover bg-white/80 shrink-0"
        />
      </div>

      {/* Price pill */}
      <div
        className="absolute bottom-16 right-4 rounded-full bg-white text-foreground text-sm font-semibold px-4 py-2 shadow-md"
        style={{ transform: "translateZ(40px)" }}
      >
        {price}
      </div>

      {/* Pagination dots */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5"
        style={{ transform: "translate(-50%, 0) translateZ(30px)" }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === 0 ? "w-5 bg-white" : "w-1.5 bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveProductCard;
