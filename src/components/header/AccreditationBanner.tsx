import { Shield, Award, BookOpen } from "lucide-react";

/**
 * Accreditation banner for header - displays UKAS, CQC, and ISO badges
 */
const AccreditationBanner = () => {
  return (
    <div className="flex items-center gap-4 lg:gap-6">
      {/* UKAS Accredited */}
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-[#22c0d4]" strokeWidth={1.5} />
        <span className="text-sm lg:text-base font-semibold text-[#22c0d4] tracking-wide">
          UKAS Accredited
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 lg:h-6 bg-white/30" />

      {/* CQC Regulated */}
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 lg:w-6 lg:h-6 text-[#e70d69]" strokeWidth={1.5} />
        <span className="text-sm lg:text-base font-semibold text-[#e70d69] tracking-wide">
          CQC Regulated
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 lg:h-6 bg-white/30" />

      {/* ISO 15189 */}
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-[#22c0d4]" strokeWidth={1.5} />
        <span className="text-sm lg:text-base font-semibold text-[#22c0d4] tracking-wide">
          ISO 15189
        </span>
      </div>
    </div>
  );
};

export default AccreditationBanner;
