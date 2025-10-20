export const UtilityBar = () => {
  return <div className="bg-[#081129] pt-2 pb-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* First group - will scroll completely off screen */}
        <div className="flex shrink-0">
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-[#e70d69]">This</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-[#e70d69]">November</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-white">November</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-white">This</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-[#e70d69]">Coming</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-white">November</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
        </div>
        {/* Second group - exact duplicate for seamless loop */}
        <div className="flex shrink-0">
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-[#22c0d4]">November</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-white">November</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-[\xA3] text-white">November</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="font-extrabold text-[#e70d69]">Coming</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="text-[#FA6980]">20% off</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
          <span className="text-xs sm:text-sm font-medium mx-8 sm:mx-12 whitespace-nowrap">
            <span className="text-[#FA6980]">20% off</span> <span className="text-white">all tests with code</span> <span className="text-[#22c0d4] font-bold">LAUNCH20</span>
          </span>
        </div>
      </div>
    </div>;
};