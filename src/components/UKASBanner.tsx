import { Shield, Award, Lock } from 'lucide-react';
const UKASBanner = () => {
  return <div className="bg-[hsl(var(--navy))] text-tertiary py-2 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-8 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Shield className="w-3 h-3 text-[hsl(var(--primary))] flex-shrink-0 sm:w-[14px] sm:h-[12px] text-[#e70d68]" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap text-[#e70d68] md:text-base font-semibold">UKAS accredited</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[hsl(var(--primary))] flex-shrink-0" />
            <span className="text-tertiary font-medium text-[10px] sm:text-xs md:text-sm whitespace-nowrap">CQC regulated</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[hsl(var(--primary))] flex-shrink-0" />
            <span className="text-tertiary font-medium text-[10px] sm:text-xs md:text-sm whitespace-nowrap">ISO 15189</span>
          </div>
        </div>
      </div>
    </div>;
};
export default UKASBanner;