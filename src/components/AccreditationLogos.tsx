import React from 'react';
const AccreditationLogos = () => {
  return <section className="w-full py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          {/* Text above */}
          <p className="text-4xl text-[#22c0d4] font-medium mb-4">
            We only work with UK accredited providers
          </p>
          
          {/* Accreditation Banner */}
          <div className="flex justify-center items-center">
            <img src="/accreditation-banner.png" alt="UK Accredited Providers - CQC, UKAS, ISO Certified" className="max-h-50 max-w-70" />
          </div>
        </div>
      </div>
    </section>;
};
export default AccreditationLogos;