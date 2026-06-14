import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/sections/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Users,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  Building2,
  Heart,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  Briefcase,
} from "lucide-react";

const enquirySchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  contactName: z.string().trim().min(1, "Contact name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[\d\s+()-]*$/, "Phone number contains invalid characters")
    .optional()
    .or(z.literal("")),
  employees: z.string().trim().min(1, "Please select your company size"),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

const packages = [
  {
    name: "Starter",
    tagline: "Up to 10 employees",
    price: "£49",
    unit: "per employee",
    accentColor: "border-health-400",
    badgeColor: "bg-health-100 text-health-700",
    features: [
      "Core blood test panel (15 biomarkers)",
      "At-home or clinic testing",
      "Digital results within 3–5 days",
      "Employee health dashboard",
      "Dedicated account manager",
    ],
    cta: "Get a quote",
  },
  {
    name: "Business",
    tagline: "11–50 employees",
    price: "£39",
    unit: "per employee",
    accentColor: "border-brand-turquoise",
    badgeColor: "bg-cyan-50 text-cyan-700",
    badge: "Most popular",
    features: [
      "Advanced blood test panel (30 biomarkers)",
      "Clinic visits or at-home kits",
      "Priority results within 48 hours",
      "Company-level health insights dashboard",
      "Dedicated account manager",
      "Anonymised team health report",
    ],
    cta: "Get a quote",
  },
  {
    name: "Enterprise",
    tagline: "50+ employees",
    price: "Custom",
    unit: "volume pricing",
    accentColor: "border-brand-pink",
    badgeColor: "bg-pink-50 text-pink-700",
    features: [
      "Full executive health screening (50+ biomarkers)",
      "On-site clinic days available",
      "Same-day results option",
      "Custom reporting & HR integration",
      "Named account director",
      "Quarterly health trend reviews",
      "Wellbeing programme add-ons",
    ],
    cta: "Contact us",
  },
];

const benefits = [
  {
    icon: <TrendingUp className="h-7 w-7 text-health-600" />,
    title: "Reduce absenteeism",
    description:
      "Proactive health screening catches issues early, keeping your workforce healthy and productive year-round.",
  },
  {
    icon: <Heart className="h-7 w-7 text-health-600" />,
    title: "Attract & retain talent",
    description:
      "Health benefits rank among the top workplace perks. Show employees you invest in their long-term wellbeing.",
  },
  {
    icon: <BarChart3 className="h-7 w-7 text-health-600" />,
    title: "Data-driven wellbeing",
    description:
      "Aggregated, anonymised insights let HR teams spot trends and target wellbeing initiatives where they matter most.",
  },
  {
    icon: <Shield className="h-7 w-7 text-health-600" />,
    title: "UKAS-accredited labs",
    description:
      "Every test is processed by CQC-registered, UKAS-accredited laboratories — the same standard as the NHS.",
  },
  {
    icon: <Clock className="h-7 w-7 text-health-600" />,
    title: "Minimal disruption",
    description:
      "Flexible at-home kits or local clinic appointments mean employees fit testing around their schedules.",
  },
  {
    icon: <Building2 className="h-7 w-7 text-health-600" />,
    title: "Simple billing",
    description:
      "One consolidated monthly invoice per company. No per-employee admin headaches.",
  },
];

const faqs = [
  {
    q: "How does group testing work?",
    a: "We set up a company account and send employees a unique invitation link. They choose their nearest clinic or request an at-home kit, then receive results directly in their personal dashboard. You see only anonymised, aggregated data unless an employee opts to share.",
  },
  {
    q: "Is employee health data kept confidential?",
    a: "Yes. Individual results belong to the employee. You receive an anonymised company health report. We are fully GDPR-compliant and never share identifiable health data with employers without explicit written consent.",
  },
  {
    q: "Which tests are included?",
    a: "Packages cover core biomarkers such as full blood count, liver function, kidney function, cholesterol, thyroid, HbA1c, and vitamin D. Advanced and Enterprise tiers add hormones, inflammation markers, and cardiovascular risk panels.",
  },
  {
    q: "Can we book on-site clinic days?",
    a: "Enterprise clients can arrange on-site testing days. A qualified phlebotomist visits your offices; results are uploaded to each employee's dashboard within 48 hours.",
  },
  {
    q: "What if an employee gets a concerning result?",
    a: "Every result comes with a clinical interpretation guide. Employees with out-of-range results are advised to follow up with their GP. Optional GP-referral letter add-ons are available on Business and Enterprise tiers.",
  },
  {
    q: "Is there a minimum number of employees?",
    a: "Our Starter plan starts at just 2 employees, so even the smallest teams can benefit from group health screening.",
  },
];

const testimonials = [
  {
    quote:
      "Rolling out health screening across our 40-person team was seamless. Our HR admin time was practically zero and employee feedback has been overwhelmingly positive.",
    author: "Sarah T.",
    role: "HR Director, Tech SME",
  },
  {
    quote:
      "The anonymised dashboard gave us the confidence to launch a targeted mental-health and nutrition programme. Worth every penny.",
    author: "James R.",
    role: "People & Culture Lead, Retail Group",
  },
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full items-center justify-between text-left font-semibold text-[#081120] hover:text-health-600 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{q}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 flex-shrink-0 ml-2" />
        ) : (
          <ChevronDown className="h-5 w-5 flex-shrink-0 ml-2" />
        )}
      </button>
      {open && <p className="mt-3 text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
};

const SmallBusinessPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      employees: "",
      message: "",
    },
  });

  const onSubmit = async (_data: EnquiryFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast({
        title: "Enquiry received",
        description:
          "Thank you! A member of our business team will be in touch within one working day.",
      });
      form.reset();
    } catch {
      toast({
        title: "Error",
        description: "There was a problem submitting your enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Employee Health Screening for Small Businesses",
    description:
      "Group health testing packages for UK small and medium businesses. UKAS-accredited blood tests, HR dashboards, and flexible booking.",
    url: "https://myhealthcheckup.co.uk/for-business",
    provider: {
      "@type": "Organization",
      name: "myhealth checkup",
      url: "https://myhealthcheckup.co.uk",
    },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    serviceType: "Occupational Health Screening",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Employee Health Screening for Small Businesses | myhealth checkup</title>
        <meta
          name="description"
          content="Affordable group health testing packages for UK small businesses. UKAS-accredited blood tests, digital results, and anonymised HR dashboards. From £39 per employee."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/for-business" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <PageBanner
          title="Health Screening for"
          accent="Your Team"
          subtitle="Affordable, UKAS-accredited health testing for UK small businesses. Boost productivity, retain talent, and keep your workforce at its best."
        >
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <a href="#packages">
              <Button size="lg" className="bg-brand-turquoise hover:bg-cyan-500 text-white font-semibold">
                View packages
              </Button>
            </a>
            <a href="#enquiry">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Get a free quote
              </Button>
            </a>
          </div>
        </PageBanner>

        {/* Trust bar */}
        <section className="bg-[#081129] border-t border-white/10 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              {[
                { icon: <Award className="h-4 w-4" />, label: "UKAS-accredited labs" },
                { icon: <Shield className="h-4 w-4" />, label: "CQC-registered" },
                { icon: <Users className="h-4 w-4" />, label: "2–500+ employees" },
                { icon: <Clock className="h-4 w-4" />, label: "Results in 48 hrs" },
                { icon: <Briefcase className="h-4 w-4" />, label: "One invoice per company" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-[#081120] mb-4">
                Why invest in employee health screening?
              </h2>
              <p className="text-gray-600 text-lg">
                Organisations that prioritise employee health see measurable returns — fewer sick days,
                stronger retention, and a culture people want to be part of.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((b) => (
                <Card key={b.title} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="mb-4">{b.icon}</div>
                    <h3 className="font-semibold text-[#081120] text-lg mb-2">{b.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stat strip */}
        <section className="bg-gradient-to-r from-[#081129] to-[#0d1f3c] py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white max-w-4xl mx-auto">
              {[
                { stat: "£630", label: "Average cost of one sick day per employee (CIPD)" },
                { stat: "3×", label: "ROI on preventive health spending (Deloitte)" },
                { stat: "87%", label: "Employees who feel more valued with health benefits" },
                { stat: "48h", label: "Average turnaround for results" },
              ].map(({ stat, label }) => (
                <div key={stat}>
                  <div className="text-3xl font-bold text-[#22c0d4] mb-1">{stat}</div>
                  <div className="text-xs text-white/70 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section id="packages" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-[#081120] mb-4">Packages &amp; pricing</h2>
              <p className="text-gray-600">
                Transparent pricing with no hidden fees. All packages include UKAS-accredited testing,
                digital results, and a dedicated account manager.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {packages.map((pkg) => (
                <Card
                  key={pkg.name}
                  className={`relative border-2 ${pkg.accentColor} shadow-sm hover:shadow-lg transition-shadow`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-brand-turquoise text-white text-xs px-3 py-1">
                        {pkg.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <CardTitle className="text-xl font-bold text-[#081120]">{pkg.name}</CardTitle>
                      <Badge variant="secondary" className={`text-xs ${pkg.badgeColor}`}>
                        {pkg.tagline}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <span className="text-4xl font-extrabold text-[#081120]">{pkg.price}</span>
                      {pkg.price !== "Custom" && (
                        <span className="text-sm text-gray-500 ml-1">{pkg.unit}</span>
                      )}
                      {pkg.price === "Custom" && (
                        <span className="text-sm text-gray-500 ml-1">{pkg.unit}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-health-600 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a href="#enquiry">
                      <Button className="w-full bg-[#081129] hover:bg-[#0d1f3c] text-white font-semibold">
                        {pkg.cta}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">
              All prices exclude VAT. Volume discounts available for 100+ employees.{" "}
              <a href="#enquiry" className="underline hover:text-health-600">
                Contact us
              </a>{" "}
              for bespoke pricing.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-[#081120] mb-4">How it works</h2>
              <p className="text-gray-600">From sign-up to results in four simple steps.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Choose a package",
                  desc: "Select the plan that fits your team size and health goals, or talk to us for a custom quote.",
                },
                {
                  step: "2",
                  title: "Invite your employees",
                  desc: "We send personalised invitations. Each employee books their own slot — clinic or at-home.",
                },
                {
                  step: "3",
                  title: "Testing takes place",
                  desc: "UKAS-accredited labs process samples to NHS-grade standards. No disruption to your business.",
                },
                {
                  step: "4",
                  title: "Results & insights",
                  desc: "Employees get individual digital results. You receive an anonymised team health dashboard.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#081129] text-[#22c0d4] font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {step}
                  </div>
                  <h3 className="font-semibold text-[#081120] mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gray-50 py-14">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#081120] text-center mb-8">
              What our clients say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {testimonials.map((t) => (
                <Card key={t.author} className="border border-gray-100 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4 leading-relaxed">"{t.quote}"</p>
                    <div>
                      <div className="font-semibold text-[#081120] text-sm">{t.author}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-[#081120] mb-8 text-center">
                Frequently asked questions
              </h2>
              <div className="space-y-0">
                {faqs.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enquiry form */}
        <section id="enquiry" className="bg-[#081129] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">Get a free quote</h2>
                <p className="text-[#22c0d4] text-lg">
                  Tell us about your team and we'll send a tailored proposal within one working day.
                </p>
              </div>

              <Card className="bg-white shadow-xl">
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Acme Ltd" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Work email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="jane@acme.co.uk" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="07700 900000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="employees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of employees *</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select team size</option>
                                <option value="2-10">2–10 employees</option>
                                <option value="11-25">11–25 employees</option>
                                <option value="26-50">26–50 employees</option>
                                <option value="51-100">51–100 employees</option>
                                <option value="100+">100+ employees</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional information</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any specific health areas you'd like to focus on, or questions for our team…"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-turquoise hover:bg-cyan-500 text-white font-semibold py-3"
                      >
                        {isSubmitting ? "Sending…" : "Request a free quote"}
                      </Button>

                      <p className="text-xs text-gray-400 text-center">
                        By submitting this form you agree to our{" "}
                        <Link to="/privacy-policy" className="underline hover:text-health-600">
                          Privacy Policy
                        </Link>
                        . We will never share your data with third parties.
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 mb-4">
              Prefer to speak to someone?{" "}
              <Link to="/contact" className="text-health-600 font-semibold hover:underline">
                Contact our team
              </Link>{" "}
              or explore our{" "}
              <Link to="/compare" className="text-health-600 font-semibold hover:underline">
                individual tests
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SmallBusinessPage;
