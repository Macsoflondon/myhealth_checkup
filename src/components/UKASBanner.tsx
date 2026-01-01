import { Shield, Award, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UKASBannerProps {
  className?: string;
}

const UKASBanner = ({ className }: UKASBannerProps) => {
  return (
    <div className={cn("bg-white py-1 sm:py-1.5 px-2 sm:px-3 border-b-2 border-[#e70d69]", className)}>
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-6 md:gap-8 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
            <Shield className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide">
              <span className="text-[#22c0d4]">UKAS</span>
              <span className="text-[#e70d69]"> Accredited</span>
            </span>
          </div>
          
          <div className="w-px h-3 sm:h-4 bg-[#22c0d4] hidden xs:block" />
          
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
            <Award className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#e70d69] flex-shrink-0" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide">
              <span className="text-[#22c0d4]">CQC</span>
              <span className="text-[#e70d69]"> Regulated</span>
            </span>
          </div>
          
          <div className="w-px h-3 sm:h-4 bg-[#22c0d4] hidden xs:block" />
          
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
            <Bookmark className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide">
              <span className="text-[#22c0d4]">ISO</span>
              <span className="text-[#e70d69]"> 15189</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UKASBanner;