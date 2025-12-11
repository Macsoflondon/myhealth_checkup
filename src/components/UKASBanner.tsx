import { Shield, Award, Bookmark } from 'lucide-react';
const UKASBanner = () => {
  return <div className="bg-[hsl(var(--navy))] text-tertiary py-1.5 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 flex-nowrap overflow-x-auto text-[#e70d68]">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Shield className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[8px] sm:text-[10px] md:text-sm whitespace-nowrap text-[#e70d68] font-sans font-bold">UKAS Accredited Labs</span>
          </div>
          
          <div className="w-px h-3 sm:h-4 bg-white/30 flex-shrink-0" />
          
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Award className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[8px] sm:text-[10px] md:text-sm whitespace-nowrap font-sans font-semibold text-[#e70d68]">CQC Regulated</span>
          </div>
          
          <div className="w-px h-3 sm:h-4 bg-white/30 flex-shrink-0" />
          
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Bookmark className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[8px] sm:text-[10px] md:text-sm whitespace-nowrap text-[#e70d68] font-semibold">ISO 15189</span>
          </div>
        </div>
      </div>
    </div>;
};
export default UKASBanner;