import { Shield, Award, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UKASBannerProps {
  className?: string;
}

const UKASBanner = ({ className }: UKASBannerProps) => {
  return (
    <div className={cn("bg-[hsl(var(--navy))] text-tertiary py-1 sm:py-1.5 px-2 sm:px-4", className)}>
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 flex-nowrap overflow-x-auto text-[#e70d68]">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap text-[#e70d68] font-sans font-bold">UKAS Accredited</span>
          </div>
          
          <div className="w-px h-3 sm:h-4 bg-[#22c0d4]/50 flex-shrink-0" />
          
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap font-sans font-semibold text-[#e70d68]">CQC Regulated</span>
          </div>
          
          <div className="w-px h-3 sm:h-4 bg-[#22c0d4]/50 flex-shrink-0" />
          
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#22c0d4] flex-shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap text-[#e70d68] font-semibold">ISO 15189</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UKASBanner;