import { Mail, ExternalLink } from "lucide-react";

interface Category {
  heading: string;
  items: string[];
}

interface SimpleProviderProfileProps {
  providerId: string;
  title: string;
  tagline: string;
  logo: string;
  website: string;
  email?: string;
  mission: string;
  about: string;
  services: string;
  categories: Category[];
}

const SimpleProviderProfile = ({
  title,
  tagline,
  logo,
  website,
  email,
  mission,
  about,
  services,
  categories,
}: SimpleProviderProfileProps) => (
  <div className="min-h-screen bg-white">
    <div className="container mx-auto px-4 pt-10 pb-0">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[#081129] mb-1">
        {title}
      </h1>
      <p className="italic text-lg text-[#22c0d4]" style={{ fontFamily: "'EB Garamond', Garamond, serif" }}>
        {tagline}
      </p>
      <div className="h-px bg-gray-200 w-full max-w-2xl mt-4 mb-6" />
    </div>

    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#081129] mb-4">Our Mission</h2>
            <p className="text-foreground font-sans leading-relaxed">{mission}</p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#081129] mb-4">Who We Are</h2>
            <p className="text-foreground font-sans leading-relaxed">{about}</p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#081129] mb-4">Our Services</h2>
            <p className="text-foreground font-sans leading-relaxed">{services}</p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#081129] mb-6">Available Tests</h2>
            <div className="space-y-6">
              {categories.map((c) => (
                <div key={c.heading}>
                  <h3 className="text-xl font-heading font-bold text-[#081129] mb-3">{c.heading}</h3>
                  <ul className="space-y-1.5 text-muted-foreground font-sans">
                    {c.items.map((i) => (
                      <li key={i}>• {i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#081129] mb-4">Get in Touch</h2>
            <div className="space-y-3">
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-foreground hover:text-[#081129] transition-colors font-sans">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  {email}
                </a>
              )}
              <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-[#081129] transition-colors font-sans">
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
                Visit website
              </a>
            </div>
            <p className="mt-4 text-muted-foreground font-sans leading-relaxed text-sm">
              Pricing, turnaround times and biomarker lists vary by test. Always check the provider's website for the latest details. This information is for educational purposes only and is not medical advice.
            </p>
          </section>
        </div>

        <div className="flex items-start justify-center">
          <div className="bg-gray-50 rounded-lg p-10 flex items-center justify-center sticky top-32">
            <img
              src={logo}
              alt={`${title} logo`}
              className="w-auto max-w-[200px] object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SimpleProviderProfile;
