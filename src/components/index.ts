// Barrel export for commonly used components

// Layout components
export { default as Header } from "./layout/Header";
export { default as Footer } from "./layout/Footer";

// Common components
export { ErrorBoundary } from "./common/ErrorBoundary";
export { ScrollToTop } from "./common/ScrollToTop";
export { default as FloatingNavDock } from "./common/FloatingNavDock";
export { LazySection } from "./common/LazySection";
export { default as ScrollFadeIn } from "./common/ScrollFadeIn";
export { default as TestBreadcrumb } from "./common/TestBreadcrumb";
export { SaveProviderButton } from "./common/SaveProviderButton";

// Section components
export { default as Hero } from "./sections/Hero";
export { default as TestCategories } from "./sections/TestCategories";
export { default as FeaturedTests } from "./sections/FeaturedTests";
export { default as FeaturedProviders } from "./sections/FeaturedProviders";
export { default as Testimonials } from "./sections/Testimonials";
export { default as CallToAction } from "./sections/CallToAction";
export { default as NationwideClinics } from "./sections/NationwideClinics";
export { default as AccreditationLogos } from "./sections/AccreditationLogos";
export { default as HowItWorks } from "./sections/HowItWorks";
export { default as JourneySimplified } from "./sections/JourneySimplified";
export { default as TopConcernsSection } from "./sections/TopConcernsSection";
export { default as FindClinicSection } from "./sections/FindClinicSection";
export { default as HereToHelp } from "./sections/HereToHelp";
export { default as FinalCTA } from "./sections/FinalCTA";
export { default as TrustPlatformSection } from "./sections/TrustPlatformSection";
export { FeaturedPublications } from "./sections/FeaturedPublications";

// Provider components
export { ProviderLogo } from "./providers/ProviderLogo";

// Compare components (via barrel)
export * from "./compare";

// Clinic components (via barrel)
export * from "./clinic";

// Booking components (via barrel)
export * from "./booking";

// Test components (via barrel)
export * from "./tests";
