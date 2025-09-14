import React from 'react';

const AccreditationLogos = () => {
  return (
    <section className="w-full py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          {/* Logos Container */}
          <div className="flex justify-center items-center gap-8 mb-4">
            <img 
              src="/accreditation-logos.png" 
              alt="UK Accreditation Logos" 
              className="h-16 w-auto object-contain"
            />
          </div>
          
          {/* Text underneath */}
          <p className="text-lg font-medium text-gray-700">
            We only work with UK accredited providers
          </p>
        </div>
      </div>
    </section>
  );
};

export default AccreditationLogos;