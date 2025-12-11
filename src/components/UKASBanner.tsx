import { Shield, Award, Bookmark } from 'lucide-react';
const UKASBanner = () => {
  return <div className="bg-[hsl(var(--navy))] text-tertiary py-1.5 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-[#e70d68] md:gap-10">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Shield className="w-3 h-3 text-[hsl(var(--primary))] flex-shrink-0 sm:w-[14px] sm:h-[12px] text-[#22c0d4]" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap text-[#e70d68] font-sans md:text-xl font-bold">UKAS Accredited Labs </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[hsl(var(--primary))] flex-shrink-0 text-[#22c0d4]" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap font-sans font-semibold text-[#e70d68] md:text-base">CQC Regulated</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[hsl(var(--primary))] flex-shrink-0 text-[#22c0d4]" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap text-[#e70d68] font-semibold md:text-base">ISO 15189</span>
          </div>
        </div>
      </div>
    </div>;
};
export default UKASBanner;