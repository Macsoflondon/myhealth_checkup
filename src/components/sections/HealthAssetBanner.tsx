const HealthAssetBanner = () => {
  return (
    <section className="relative py-6 sm:py-8 md:py-10 bg-brand-navy overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/10 via-transparent to-brand-turquoise/10" />
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold">
          <span className="text-white">Your </span>
          <span className="text-brand-turquoise">health</span>
          <span className="text-white"> is your greatest </span>
          <span className="text-brand-pink">asset</span>
          <span className="text-white">!</span>
        </h2>
      </div>
    </section>
  );
};

export default HealthAssetBanner;
