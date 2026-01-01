import { Shield, Award, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UKASBannerProps {
  className?: string;
}

const UKASBanner = ({ className }: UKASBannerProps) => {
  return (
    <div className={cn("bg-white py-2 sm:py-2.5 px-3 sm:px-4 border-b-2 border-[#e70d69]", className)}>
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 xs:gap-4 sm:gap-8 md:gap-12 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5">
            <Shield className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold tracking-wide">
              <span className="text-[#22c0d4]">UKAS</span>
              <span className="text-[#e70d69]"> Accredited</span>
            </span>
          </div>
          
          <div className="w-px h-4 sm:h-5 bg-[#22c0d4] hidden xs:block" />
          
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5">
            <Award className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-[#e70d69] flex-shrink-0" />
            <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold tracking-wide">
              <span className="text-[#22c0d4]">CQC</span>
              <span className="text-[#e70d69]"> Regulated</span>
            </span>
          </div>
          
          <div className="w-px h-4 sm:h-5 bg-[#22c0d4] hidden xs:block" />
          
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5">
            <Bookmark className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold tracking-wide">
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