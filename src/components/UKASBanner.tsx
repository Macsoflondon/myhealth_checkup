import { Shield, Award, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UKASBannerProps {
  className?: string;
}

const UKASBanner = ({ className }: UKASBannerProps) => {
  return (
    <div className={cn("bg-white py-1.5 sm:py-2 px-2 sm:px-4 border-b border-border/30", className)}>
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-6 md:gap-10 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
            <Shield className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-[#081129] font-medium tracking-wide">UKAS</span>
          </div>
          
          <div className="w-px h-3 sm:h-4 bg-[#081129]/20 hidden xs:block" />
          
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
            <Award className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-[#081129] font-medium tracking-wide">CQC</span>
          </div>
          
          <div className="w-px h-3 sm:h-4 bg-[#081129]/20 hidden xs:block" />
          
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
            <Bookmark className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-[#081129] font-medium tracking-wide">ISO 15189</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UKASBanner;