import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import scene1Park from "@/assets/video-scenes/scene-1-park.jpg";
import scene2Cafe from "@/assets/video-scenes/scene-2-cafe.jpg";
import scene3Reception from "@/assets/video-scenes/scene-3-reception.jpg";
import scene4Consultation from "@/assets/video-scenes/scene-4-consultation.jpg";
import scene5Exit from "@/assets/video-scenes/scene-5-exit.jpg";

const HeroVideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);

  const scenes = [
    {
      image: scene1Park,
      title: "Living Life to the Fullest",
      subtitle: "Your everyday moments matter - from morning jogs to family time"
    },
    {
      image: scene2Cafe,
      title: "Staying Connected",
      subtitle: "Quality time with friends and pursuing your passions"
    },
    {
      image: scene3Reception,
      title: "Professional Healthcare",
      subtitle: "Modern, welcoming facilities with caring staff"
    },
    {
      image: scene4Consultation,
      title: "Expert Care",
      subtitle: "Professional consultations in comfortable settings"
    },
    {
      image: scene5Exit,
      title: "Peace of Mind",
      subtitle: "Taking charge of your health with confidence and ease"
    }
  ];

  const SCENE_DURATION = 4000; // 4 seconds per scene

  useEffect(() => {
    if (!isPlaying) return;

    const progressInterval = setInterval(() => {
      setSceneProgress(prev => {
        if (prev >= 100) {
          setCurrentSceneIndex(current => (current + 1) % scenes.length);
          return 0;
        }
        return prev + (100 / (SCENE_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isPlaying, scenes.length]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && sceneProgress === 0) {
      setSceneProgress(0);
    }
  };

  const currentScene = scenes[currentSceneIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
      <div className="relative aspect-video bg-gradient-to-br from-health-primary/20 to-health-secondary/20">
        <img
          src={currentScene.image}
          alt={currentScene.title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Play/Pause Button Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-health-primary" />
            ) : (
              <Play className="w-8 h-8 text-health-primary ml-1" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div className="absolute top-4 left-4 right-4">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${sceneProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Scene Indicators */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {scenes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSceneIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Video Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h3 className="text-white text-lg font-semibold mb-2 transition-all duration-500">
            {currentScene.title}
          </h3>
          <p className="text-white/90 text-sm transition-all duration-500">
            {currentScene.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoPlayer;