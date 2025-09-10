import { useOptimizedImage } from "@/hooks/useOptimizedImage";
import heroVideoPlaceholder from "@/assets/hero-video-placeholder.jpg";

const HeroVideoPlayer = () => {
  const { imageSrc, isLoading } = useOptimizedImage({
    src: heroVideoPlaceholder,
    placeholder: "/placeholder.svg"
  });

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
      {/* Video Placeholder - will show the generated image */}
      <div className="relative aspect-video bg-gradient-to-br from-health-primary/20 to-health-secondary/20">
        {!isLoading && (
          <img
            src={imageSrc}
            alt="People enjoying healthy lives and visiting modern medical clinics"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <div className="w-0 h-0 border-l-[16px] border-l-health-primary border-y-[12px] border-y-transparent ml-1"></div>
          </div>
        </div>

        {/* Video Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h3 className="text-white text-lg font-semibold mb-2">Your Health Journey Starts Here</h3>
          <p className="text-white/90 text-sm">See how thousands are taking control of their health with our trusted testing services.</p>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoPlayer;