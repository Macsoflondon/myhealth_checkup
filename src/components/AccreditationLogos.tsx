import React from 'react';
const AccreditationLogos = () => {
  return <section className="w-full py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          {/* Text above */}
          <p className="text-4xl text-[#22c0d4] font-medium mb-4">
            We only work with UK accredited providers
          </p>
          
          {/* Logos Container */}
          <div className="flex justify-center items-center gap-8">
            <img src="/cqc-logo.png" alt="CQC - Care Quality Commission" className="h-32 w-auto object-contain" />
            <img src="/ukas-logo.png" alt="UKAS - United Kingdom Accreditation Service" className="h-32 w-auto object-contain" />
            <img src="/iso-logo.png" alt="ISO - International Organization for Standardization" className="h-32 w-auto object-contain" />
          </div>
        </div>
      </div>
    </section>;
};
export default AccreditationLogos;