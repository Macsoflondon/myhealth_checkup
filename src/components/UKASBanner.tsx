import { Shield, Award, Bookmark } from 'lucide-react';
const UKASBanner = () => {
  return <div className="bg-[hsl(var(--navy))] text-tertiary py-1.5 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 flex-nowrap overflow-x-auto text-[#e70d68]">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[9px] sm:text-xs md:text-base whitespace-nowrap text-[#e70d68] font-sans font-bold">UKAS Accredited Labs</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[9px] sm:text-xs md:text-base whitespace-nowrap font-sans font-semibold text-[#e70d68]">CQC Regulated</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[9px] sm:text-xs md:text-base whitespace-nowrap text-[#e70d68] font-semibold">ISO 15189</span>
          </div>
        </div>
      </div>
    </div>;
};
export default UKASBanner;