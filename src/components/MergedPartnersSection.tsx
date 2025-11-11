const logos: Record<string, string> = {
  "The Times": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/ab0f0258d_Screenshot2025-07-14at104930.png",
  "The Guardian": "https://assets.guim.co.uk/images/favicons/fee5e2d6353282167b575c2763531636/152x152.png",
  "Forbes": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Forbes_logo.svg/2560px-Forbes_logo.svg.png",
  "BBC": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/200px-BBC_Logo_2021.svg.png",
  "Women's Health": "https://assets.hearstapps.com/sites/womenshealth/assets/images/favicon.ico?v=2",
  "The Telegraph": "https://www.telegraph.co.uk/etc.designs/telegraph/core/images/icons/apple-touch-icon-152x152.png",
};

const MergedPartnersSection = () => {
  const featuredLogos = Object.entries(logos).slice(0, 4);

  return (
    <section className="w-full bg-white py-12 sm:py-16 relative">
      {/* Top fade from #f9fafb */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#f9fafb] to-transparent pointer-events-none" />
      
      {/* Bottom fade to #eef2f5 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#eef2f5] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Our Partners heading */}
        <h3 className="text-center text-2xl sm:text-3xl font-bold text-[#081129] mb-6">
          Our Partners
        </h3>
        
        {/* Partner logos */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 mb-12">
          {featuredLogos.map(([name, logoUrl]) => (
            <img 
              key={name}
              src={logoUrl} 
              alt={`${name} logo`} 
              className="h-8 sm:h-10 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </div>

        {/* Divider with accent colors */}
        <div className="flex items-center justify-center my-8">
          <div className="h-1 w-24 bg-gradient-to-r from-[#e70d69] to-[#22c0d4] rounded-full" />
        </div>

        {/* Trusted Health Comparison Platform heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#081129] mb-3">
            Trusted Health Comparison Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            We only feature UKAS-accredited laboratories, CQC-regulated clinics, and ISO 15189-certified facilities to ensure you receive the highest quality care.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MergedPartnersSection;
