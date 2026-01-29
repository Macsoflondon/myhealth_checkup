import { Play } from "lucide-react";

interface VideoCardProps {
  videoSrc?: string;
  label: string;
  isPlaceholder?: boolean;
}

const VideoCard = ({ videoSrc, label, isPlaceholder = false }: VideoCardProps) => {
  return (
    <div className="group bg-white rounded-2xl p-3 md:p-4 shadow-elevation-3 hover:shadow-elevation-4 transition-all duration-300 hover:-translate-y-1">
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-brand-navy">
        {isPlaceholder ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
              <Play className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-semibold">Coming Soon</p>
            <p className="text-sm text-white/70 mt-1">Video launching shortly</p>
          </div>
        ) : (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            className="absolute inset-0 w-full h-full object-contain"
            src={videoSrc}
            aria-label={label}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <p className="text-center mt-4 font-bold text-brand-navy text-lg">
        {label}
      </p>
    </div>
  );
};

const TaglineVideoSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-brand-navy relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy/90 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              See How It Works
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
              Watch how we're making health testing simpler and more accessible
            </p>
          </div>
          
          {/* Video grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Video 1: myhealth checkup tagline */}
            <VideoCard 
              videoSrc="/tagline-video.mp4"
              label="myhealth checkup"
            />
            
            {/* Video 2: Medichecks placeholder */}
            <VideoCard 
              label="Medichecks"
              isPlaceholder={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaglineVideoSection;
