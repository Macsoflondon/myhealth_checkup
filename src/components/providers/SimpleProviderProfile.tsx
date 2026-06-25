import { Mail, Phone, ExternalLink } from "lucide-react";

interface Category {
  heading: string;
  items: string[];
}

interface SimpleProviderProfileProps {
  providerId: string;
  title: string;
  logo: string;
  website: string;
  email?: string;
  phone?: string;
  mission: string;
  about: string;
  services: string;
  whatsNew?: string;
  categories: Category[];
  closingNote?: string;
}

const SimpleProviderProfile = ({
  title,
  logo,
  website,
  email,
  phone,
  mission,
  about,
  services,
  whatsNew,
  categories,
  closingNote,
}: SimpleProviderProfileProps) => (
  <div className="min-h-screen bg-white">
    <div className="container mx-auto px-4 pt-10 pb-0">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[#081129] mb-1">
        {title}
      </h1>
      <div className="h-px bg-gray-200 w-full max-w-2xl mb-6" />
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

          {whatsNew && (
            <section>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#081129] mb-4">What's New</h2>
              <p className="text-foreground font-sans leading-relaxed">{whatsNew}</p>
            </section>
          )}

          <section>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#081129] mb-6">Our Tests</h2>
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
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 text-foreground hover:text-[#081129] transition-colors font-sans">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  {phone}
                </a>
              )}
              <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-[#081129] transition-colors font-sans">
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
                Visit website
              </a>
            </div>
            {closingNote && (
              <p className="mt-4 text-muted-foreground font-sans leading-relaxed">
                {closingNote}
              </p>
            )}
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
