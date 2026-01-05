const logos: Record<string, string> = {
  "The Times": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/ab0f0258d_Screenshot2025-07-14at104930.png",
  "The Guardian": "https://assets.guim.co.uk/images/favicons/fee5e2d6353282167b575c2763531636/152x152.png",
  "Forbes": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Forbes_logo.svg/2560px-Forbes_logo.svg.png",
  "BBC": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/200px-BBC_Logo_2021.svg.png",
  "Women's Health": "https://assets.hearstapps.com/sites/womenshealth/assets/images/favicon.ico?v=2",
  "The Telegraph": "https://www.telegraph.co.uk/etc/designs/telegraph/core/images/icons/apple-touch-icon-152x152.png",
};

interface Provider {
  featured_in?: string[];
}

interface AsFeaturedInProps {
  providers?: Provider[];
}

export default function AsFeaturedIn({ providers = [] }: AsFeaturedInProps) {
  const allFeaturedIn = [...new Set(providers.flatMap(p => p.featured_in || []))];
  
  if (allFeaturedIn.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-center text-lg text-gray-500 font-semibold mb-6">AS FEATURED IN</h3>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {allFeaturedIn.map((name: string) => (
            <img 
              key={name}
              src={logos[name]} 
              alt={`${name} logo`} 
              className="h-8 grayscale opacity-70"
            />
          ))}
        </div>
      </div>
    </section>
  );
}