export const FeaturedPublications = () => {
  const publications = [
    "Bloomberg",
    "The Guardian",
    "Cosmopolitan",
    "TechCrunch"
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-sm md:text-base font-semibold text-gray-500 uppercase tracking-wider mb-12 md:mb-16">
          Our Partners Have Featured In
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-5xl mx-auto">
          {publications.map((publication) => (
            <div 
              key={publication} 
              className="flex items-center justify-center"
            >
              <h4 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-400 text-center">
                {publication}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
