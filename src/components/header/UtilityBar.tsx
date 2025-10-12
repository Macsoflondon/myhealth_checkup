export const UtilityBar = () => {
  return (
    <div className="bg-[#081129] text-white pt-3 pb-2 overflow-hidden hidden lg:block">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* First group - will scroll completely off screen */}
        <div className="flex shrink-0">
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
        </div>
        {/* Second group - exact duplicate for seamless loop */}
        <div className="flex shrink-0">
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
          <span className="text-sm font-medium mx-12 whitespace-nowrap">🚀 Almost ready to launch</span>
        </div>
      </div>
    </div>
  );
};
