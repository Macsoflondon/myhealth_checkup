import { Shield, Award, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UKASBannerProps {
  className?: string;
}

const UKASBanner = ({ className }: UKASBannerProps) => {
  return (
    <div className={cn("bg-white py-2 sm:py-2.5 px-3 sm:px-4 border-b border-border/30", className)}>
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 flex-nowrap overflow-x-auto">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap text-[#081129] font-medium tracking-wide">UKAS Accredited</span>
          </div>
          
          <div className="w-px h-4 sm:h-5 bg-[#081129]/20 flex-shrink-0" />
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap text-[#081129] font-medium tracking-wide">CQC Regulated</span>
          </div>
          
          <div className="w-px h-4 sm:h-5 bg-[#081129]/20 flex-shrink-0" />
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Bookmark className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap text-[#081129] font-medium tracking-wide">ISO 15189</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UKASBanner;