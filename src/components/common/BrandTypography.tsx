import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Brand Typography Component Library
 * Demonstrates the three core brand fonts and their usage guidelines
 * 
 * Brand Fonts:
 * - Montserrat: Headings and bold statements
 * - Lato: Body text and general content
 * - EB Garamond: Elegant accents and premium messaging
 */

const BrandTypography = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#081129] mb-4">
          myhealth checkup Typography System
        </h1>
        <p className="text-xl text-gray-600 font-elegant italic">
          A showcase of our three brand fonts and their application guidelines
        </p>
      </div>

      {/* Montserrat - Headings */}
      <Card className="mb-8 border-2 border-[#22c0d4]">
        <CardHeader>
          <CardTitle className="text-3xl font-heading font-bold text-[#22c0d4]">
            Montserrat — Headlines & Impact
          </CardTitle>
          <CardDescription className="text-base">
            Primary font for headings, titles, and bold statements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-5xl font-heading font-bold text-[#081129] mb-2">
              Hero Headline
            </h2>
            <p className="text-sm text-gray-500">font-heading font-bold text-5xl</p>
          </div>
          
          <div>
            <h3 className="text-4xl font-heading font-bold text-[#081129] mb-2">
              Section Heading
            </h3>
            <p className="text-sm text-gray-500">font-heading font-bold text-4xl</p>
          </div>
          
          <div>
            <h4 className="text-3xl font-heading font-semibold text-[#081129] mb-2">
              Subsection Heading
            </h4>
            <p className="text-sm text-gray-500">font-heading font-semibold text-3xl</p>
          </div>
          
          <div>
            <h5 className="text-2xl font-heading font-medium text-[#081129] mb-2">
              Card Title
            </h5>
            <p className="text-sm text-gray-500">font-heading font-medium text-2xl</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h6 className="font-heading font-semibold text-[#081129] mb-2">Usage Guidelines:</h6>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Use for all H1-H6 heading elements</li>
              <li>Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)</li>
              <li>Pair with generous line-height for maximum impact</li>
              <li>Use tracking-tight for large sizes (text-4xl+)</li>
              <li>Perfect for stats, numbers, and emphasis</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lato - Body Text */}
      <Card className="mb-8 border-2 border-[#e70d69]">
        <CardHeader>
          <CardTitle className="text-3xl font-heading font-bold text-[#e70d69]">
            Lato — Body Text & Clarity
          </CardTitle>
          <CardDescription className="text-base">
            Primary font for body content, navigation, and UI elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-lg font-sans font-normal text-gray-800 leading-relaxed mb-2">
              This is large body text. Lato provides excellent readability for longer content sections. 
              Its clean, modern design makes it perfect for descriptive text, feature explanations, and general content.
            </p>
            <p className="text-sm text-gray-500">font-sans font-normal text-lg leading-relaxed</p>
          </div>
          
          <div>
            <p className="text-base font-sans font-normal text-gray-800 leading-relaxed mb-2">
              This is standard body text. Use this size for most content across the site. 
              Lato maintains clarity at various sizes and weights, making it versatile for different contexts.
            </p>
            <p className="text-sm text-gray-500">font-sans font-normal text-base leading-relaxed</p>
          </div>
          
          <div>
            <p className="text-sm font-sans font-normal text-gray-600 mb-2">
              This is small body text, perfect for captions, metadata, and supplementary information.
            </p>
            <p className="text-xs text-gray-500">font-sans font-normal text-sm</p>
          </div>

          <div>
            <p className="text-base font-sans font-light text-gray-700 leading-relaxed mb-2">
              Use font-light (300) for elegant, airy text that needs to feel less heavy while maintaining readability.
            </p>
            <p className="text-sm text-gray-500">font-sans font-light text-base</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h6 className="font-heading font-semibold text-[#081129] mb-2">Usage Guidelines:</h6>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Default font for all body content</li>
              <li>Weights: 300 (light), 400 (regular), 500 (medium), 700 (bold)</li>
              <li>Use leading-relaxed for better readability</li>
              <li>Perfect for paragraphs, lists, and descriptions</li>
              <li>Works well for navigation and UI elements</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* EB Garamond - Elegant Accents */}
      <Card className="mb-8 border-2 border-[#081129]">
        <CardHeader>
          <CardTitle className="text-3xl font-heading font-bold text-[#081129]">
            EB Garamond — Elegant Accents
          </CardTitle>
          <CardDescription className="text-base">
            Premium serif font for quotes, taglines, and sophisticated messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-2xl font-elegant italic text-gray-800 leading-relaxed mb-2">
              "Your health is your greatest asset. Take control with confidence."
            </p>
            <p className="text-sm text-gray-500">font-elegant italic text-2xl leading-relaxed</p>
          </div>
          
          <div>
            <p className="text-xl font-elegant italic text-gray-700 leading-relaxed mb-2">
              "At myhealth checkup, we believe in empowering you with knowledge and choice."
            </p>
            <p className="text-sm text-gray-500">font-elegant italic text-xl leading-relaxed</p>
          </div>
          
          <div>
            <blockquote className="border-l-4 border-[#22c0d4] pl-6 py-2">
              <p className="text-lg font-elegant italic text-gray-700 leading-relaxed mb-2">
                "The test revealed issues I never knew existed. Within months, I felt like a completely different person."
              </p>
              <cite className="text-sm font-sans text-gray-600 not-italic">— Patricia R., London</cite>
            </blockquote>
            <p className="text-sm text-gray-500 mt-2">font-elegant italic text-lg (testimonial)</p>
          </div>

          <div>
            <p className="text-lg font-elegant font-normal text-gray-800 leading-relaxed mb-2">
              Use regular (non-italic) Garamond for premium headlines that need elegance without the formality of quotes.
            </p>
            <p className="text-sm text-gray-500">font-elegant font-normal text-lg</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h6 className="font-heading font-semibold text-[#081129] mb-2">Usage Guidelines:</h6>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Use sparingly for maximum impact</li>
              <li>Perfect for customer testimonials and quotes</li>
              <li>Ideal for taglines and brand statements</li>
              <li>Typically used in italic for authenticity</li>
              <li>Creates premium, trustworthy feel</li>
              <li>Weights: 400 (regular), 500 (medium), 600 (semibold)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Example Combinations */}
      <Card className="mb-8 bg-gradient-to-br from-gray-50 to-white">
        <CardHeader>
          <CardTitle className="text-3xl font-heading font-bold text-[#1a1b34]">
            Typography in Action
          </CardTitle>
          <CardDescription className="text-base">
            Real-world examples combining all three fonts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Example 1: Hero Section */}
          <div className="bg-[#081129] p-8 rounded-lg text-white">
            <h2 className="text-4xl font-heading font-bold mb-4">
              It's time to feel like <span className="text-[#22c0d4]">yourself again</span>
            </h2>
            <p className="text-xl font-elegant italic mb-6 text-white/90">
              Your health is your greatest asset. Take control with confidence.
            </p>
            <p className="text-base font-sans leading-relaxed text-white/80">
              Compare private blood tests, health screenings, and wellness services from the UK's most trusted providers.
            </p>
          </div>

          {/* Example 2: Testimonial Card */}
          <div className="border-2 border-gray-200 p-6 rounded-lg">
            <h3 className="text-2xl font-heading font-bold text-[#1a1b34] mb-4">
              Real Results That Matter
            </h3>
            <blockquote className="border-l-4 border-[#e70d69] pl-6 mb-4">
              <p className="text-xl font-elegant italic text-gray-700 leading-relaxed mb-3">
                "I feel like a completely different person. My energy is back, I've lost the weight, and my mind is sharp again."
              </p>
              <cite className="text-base font-sans text-gray-600 not-italic font-medium">
                — Patricia R., 42, London
              </cite>
            </blockquote>
            <p className="text-base font-sans text-gray-600">
              Patricia discovered severe vitamin D deficiency through our testing. Within 3 months, all her levels normalised.
            </p>
          </div>

          {/* Example 3: Stats Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-heading font-bold text-[#22c0d4] mb-2">93%</div>
              <div className="text-sm font-sans text-gray-600">Improved quality of life</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-heading font-bold text-[#e70d69] mb-2">4.8/5</div>
              <div className="text-sm font-sans text-gray-600">Average rating</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-heading font-bold text-[#081129] mb-2">10k+</div>
              <div className="text-sm font-sans text-gray-600">Tests completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="bg-[#081129] text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-heading font-bold text-white">
            Quick Reference Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xl font-heading font-bold text-[#22c0d4] mb-3">Montserrat</h4>
              <ul className="text-sm space-y-1 text-white/80">
                <li>✓ All headings (H1-H6)</li>
                <li>✓ Statistics & numbers</li>
                <li>✓ Button labels</li>
                <li>✓ Navigation items</li>
                <li>✓ Bold emphasis</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-heading font-bold text-[#e70d69] mb-3">Lato</h4>
              <ul className="text-sm space-y-1 text-white/80">
                <li>✓ Body paragraphs</li>
                <li>✓ Descriptions</li>
                <li>✓ Lists & captions</li>
                <li>✓ Form labels</li>
                <li>✓ UI text</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-heading font-bold text-white mb-3">EB Garamond</h4>
              <ul className="text-sm space-y-1 text-white/80">
                <li>✓ Testimonials</li>
                <li>✓ Quotes & pullquotes</li>
                <li>✓ Brand taglines</li>
                <li>✓ Premium messaging</li>
                <li>✓ Key value props</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandTypography;