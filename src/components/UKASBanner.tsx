import { Shield, Award, Lock } from 'lucide-react';
const UKASBanner = () => {
  return <div className="bg-[hsl(var(--navy))] text-tertiary py-2 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-4 md:gap-8 text-xs md:text-sm">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
            <span className="text-tertiary font-mono text-center font-medium text-base">UKAS accredited labs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
            <span className="text-base font-normal text-center font-mono text-tertiary">CQC regulated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
            <span className="text-tertiary font-normal text-base font-mono text-center">ISO 15189 certified</span>
          </div>
        </div>
      </div>
    </div>;
};
export default UKASBanner;