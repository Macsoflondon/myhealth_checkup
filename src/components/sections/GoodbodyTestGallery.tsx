import { useState } from "react";
import { Link } from "react-router-dom";
import { getGoodbodyTestBySlug, testNameToSlug } from "@/data/goodbodyTestDetails";
import { HoverExpand_001 } from "@/components/ui/expand-on-hover";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Mail, Phone, Info, FlaskConical, Loader2, Droplet, Clock } from "lucide-react";
import { findTestByIdOrSlug, generateTestSlug, type TestData } from "@/utils/testSlugLookup";

const TABS = ["General Health", "Hormone & Fertility", "Cancer Screening"] as const;
type Tab = typeof TABS[number];

type GalleryImage = { src: string; alt: string; code: string; objectFit?: string };

const GENERAL_HEALTH_TESTS: GalleryImage[] = [
  { src: "/images/tests/advanced-well-man.png", alt: "Advanced Well Man Blood Test", code: "Advanced Well Man", objectFit: "contain" },
  { src: "/images/tests/general-health-blood-test.png", alt: "General Health Blood Test", code: "General Health", objectFit: "contain" },
  { src: "/images/tests/premium-complete-blood-test.png", alt: "Premium Complete Blood Test", code: "Premium Complete", objectFit: "contain" },
  { src: "/images/tests/complete-allergy-blood-test.png", alt: "Complete Allergy Blood Test", code: "Complete Allergy", objectFit: "contain" },
  { src: "/images/tests/kidney-blood-test.png", alt: "Kidney Blood Test", code: "Kidney", objectFit: "contain" },
  { src: "/images/tests/nad-plus-blood-test.png", alt: "NAD+ Blood Test", code: "NAD+", objectFit: "contain" },
  { src: "/images/tests/cholesterol-blood-test.png", alt: "Cholesterol Blood Test", code: "Cholesterol", objectFit: "contain" },
  { src: "/images/tests/full-blood-count-blood-test.png", alt: "Full Blood Count Blood Test", code: "Full Blood Count", objectFit: "contain" },
  { src: "/images/tests/liver-blood-test.png", alt: "Liver Blood Test", code: "Liver", objectFit: "contain" },
  { src: "/images/tests/vitamins-blood-test.png", alt: "Vitamins Blood Test", code: "Vitamins", objectFit: "contain" },
  { src: "/images/tests/sports-fitness-blood-test.png", alt: "Sports & Fitness Blood Test", code: "Sports & Fitness", objectFit: "contain" },
  { src: "/images/tests/advanced-well-woman.png", alt: "Advanced Well Woman Blood Test", code: "Advanced Well Woman", objectFit: "contain" },
  { src: "/images/tests/coeliac-screen-blood-test.png", alt: "Coeliac Screen Blood Test", code: "Coeliac Screen", objectFit: "contain" },
  { src: "/images/tests/cardiac-risk-blood-test.png", alt: "Cardiac Risk Blood Test", code: "Cardiac Risk", objectFit: "contain" },
  { src: "/images/tests/anaemia-blood-test.png", alt: "Anaemia Blood Test", code: "Anaemia", objectFit: "contain" },
  { src: "/images/tests/weight-loss-blood-test.png", alt: "Weight Loss Blood Test", code: "Weight Loss", objectFit: "contain" },
  { src: "/images/tests/trace-metal-blood-test.png", alt: "Trace Metal Blood Test", code: "Trace Metal", objectFit: "contain" },
  { src: "/images/tests/autoimmune-disease-blood-test.png", alt: "Autoimmune Disease Blood Test", code: "Autoimmune Disease", objectFit: "contain" },
  { src: "/images/tests/helicobacter-pylori-blood-test.png", alt: "Helicobacter Pylori Blood Test", code: "Helicobacter Pylori", objectFit: "contain" },
  { src: "/images/tests/blood-group-blood-test.png", alt: "Blood Group Blood Test", code: "Blood Group", objectFit: "contain" },
  { src: "/images/tests/tiredness-fatigue-blood-test.png", alt: "Goodbody Tiredness and Fatigue Blood Test kit box", code: "Tiredness and Fatigue", objectFit: "contain" },
  { src: "/images/tests/advanced-vitamins-blood-test.png", alt: "Goodbody Advanced Vitamins Blood Test kit box", code: "Advanced Vitamins", objectFit: "contain" },
  { src: "/images/tests/iron-blood-test.png", alt: "Goodbody Iron Blood Test kit box", code: "Iron", objectFit: "contain" },
];

const HORMONE_FERTILITY_TESTS: GalleryImage[] = [
  { src: "/images/female-hormone-fertility.png", alt: "Goodbody Female Hormone & Fertility Blood Test kit box", code: "Female Hormone & Fertility", objectFit: "contain" },
  { src: "/images/prenatalsafe-5-nipt.png", alt: "Goodbody PrenatalSAFE 5 NIPT Blood Test kit box", code: "PrenatalSAFE 5 NIPT", objectFit: "contain" },
  { src: "/images/testosterone-blood-test.png", alt: "Goodbody Testosterone Blood Test kit box", code: "Testosterone", objectFit: "contain" },
  { src: "/images/thyroid-function-blood-test.png", alt: "Goodbody Thyroid Function Blood Test kit box", code: "Thyroid Function", objectFit: "contain" },
  { src: "/images/pregnancy-blood-test.png", alt: "Goodbody Pregnancy Blood Test kit box", code: "Pregnancy", objectFit: "contain" },
  { src: "/images/anti-mullerian-hormone.png", alt: "Goodbody Anti-Mullerian Hormone Blood Test kit box", code: "Anti-Mullerian Hormone", objectFit: "contain" },
  { src: "/images/prenatalsafe-complete-plus-nipt.png", alt: "Goodbody PrenatalSAFE Complete Plus NIPT Blood Test kit box", code: "PrenatalSAFE Complete Plus NIPT", objectFit: "contain" },
  { src: "/images/male-hormone-fertility.png", alt: "Goodbody Male Hormone and Fertility Blood Test kit box", code: "Male Hormone & Fertility", objectFit: "contain" },
  { src: "/images/prenatalsafe-3-nipt.png", alt: "Goodbody PrenatalSAFE 3 NIPT Blood Test kit box", code: "PrenatalSAFE 3 NIPT", objectFit: "contain" },
  { src: "/images/cortisol-stress-blood-test.png", alt: "Goodbody Cortisol Stress Blood Test kit box", code: "Cortisol Stress", objectFit: "contain" },
  { src: "/images/prenatalsafe-karyo-plus-nipt.png", alt: "Goodbody PrenatalSAFE Karyo Plus NIPT Blood Test kit box", code: "PrenatalSAFE Karyo Plus NIPT", objectFit: "contain" },
  { src: "/images/thyroid-blood-test.png", alt: "Goodbody Thyroid Blood Test kit box", code: "Thyroid", objectFit: "contain" },
];

const CANCER_SCREENING_TESTS: GalleryImage[] = [
  { src: "/images/tests/early-cancer-screening.png", alt: "Early Cancer Screening Test", code: "TruCheck™ Early Cancer Screening", objectFit: "contain" },
  { src: "/images/tests/episwitch-pse.png", alt: "EpiSwitch PSE Prostate Test", code: "EpiSwitch® PSE Prostate", objectFit: "contain" },
  { src: "/images/tests/guardant-reveal.png", alt: "Guardant Reveal MRD & Therapy Response Monitoring", code: "Guardant Reveal™", objectFit: "contain" },
  { src: "/images/tests/lung-cancer-screening.png", alt: "Lung Cancer Screening Blood Test", code: "Lung Cancer Screening", objectFit: "contain" },
  { src: "/images/tests/guardant-360-cdx.png", alt: "Guardant 360 CDx Blood Collection Kit", code: "Guardant360® CDx", objectFit: "contain" },
  { src: "/images/tests/hpv-cervical-cancer-screening.png", alt: "HPV Cervical Cancer Screening", code: "HPV Cervical Cancer Screening", objectFit: "contain" },
  { src: "/images/tests/prostate-psa-blood-test.png", alt: "Prostate PSA Blood Test", code: "Prostate PSA", objectFit: "contain" },
  { src: "/images/tests/bowel-cancer-stool-test.png", alt: "Bowel Cancer Stool Test", code: "Bowel Cancer Stool Test", objectFit: "contain" },
];

const GOODBODY_LOGO = "/lovable-uploads/provider-goodbody-logo-new.png";

const GoodbodyTestGallery = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Hormone & Fertility");
  const [testDetailOpen, setTestDetailOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const getTestsForTab = () => {
    switch (activeTab) {
      case "General Health": return GENERAL_HEALTH_TESTS;
      case "Hormone & Fertility": return HORMONE_FERTILITY_TESTS;
      case "Cancer Screening": return CANCER_SCREENING_TESTS;
      default: return [];
    }
  };

  const handleTestClick = async (image: GalleryImage) => {
    setSelectedImage(image);
    setTestLoading(true);
    setTestDetailOpen(true);

    const slug = generateTestSlug(image.code);
    const data = await findTestByIdOrSlug('goodbody-clinic', slug);
    setTestData(data);
    setTestLoading(false);
  };

  // Build overlay data for the gallery
  const getOverlayData = (image: GalleryImage) => {
    const slug = testNameToSlug(image.code);
    const staticData = getGoodbodyTestBySlug(slug);
    return {
      price: staticData?.price ?? null,
      biomarkerCount: staticData?.biomarkers?.length ?? null,
      turnaround: staticData?.turnaround ?? null,
    };
  };

  return (
    <div className="md:col-span-2 mt-6 mb-4">
      {/* Banner + Tab Navigation — logo/slogan left, tabs inline */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-4">
        {/* Logo */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div className="bg-white rounded-lg p-3 sm:p-4 flex items-center justify-center" style={{ maxHeight: "320px" }}>
            <img
              src={GOODBODY_LOGO}
              alt="Goodbody Clinic"
              className="h-40 sm:h-48 md:h-56 w-auto object-contain"
            />
          </div>
        </div>

        {/* Tab Navigation — About first, then category tabs */}
        <nav className="flex items-center gap-3 sm:gap-5 md:gap-7 flex-wrap" aria-label="Goodbody test categories">
          <button
            onClick={() => setAboutOpen(true)}
            className="text-xs sm:text-sm md:text-base font-sans transition-all duration-200 pb-1 text-white font-bold border-b-2 border-brand-turquoise flex items-center gap-1"
          >
            <Info className="h-3.5 w-3.5" />
            About
          </button>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-xs sm:text-sm md:text-base font-sans font-bold text-white transition-all duration-200 pb-1 border-b-2 border-brand-turquoise",
                activeTab === tab
                  ? "opacity-100"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Inline Gallery — click directly opens detail modal */}
      <div className="flex items-start justify-center pt-1">
        <HoverExpand_001
          images={getTestsForTab()}
          onTestClick={handleTestClick}
          getOverlayData={getOverlayData}
        />
      </div>

      {/* View Profile Button */}
      <div className="flex justify-center mt-8">
        <Link
          to="/provider/goodbody"
          className="inline-block bg-brand-turquoise hover:bg-brand-pink text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
        >
          View Goodbody Profile
        </Link>
      </div>

      {/* ===== Test Detail Modal (Reference card style) ===== */}
      <Dialog open={testDetailOpen} onOpenChange={setTestDetailOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden border-0 rounded-2xl">
          {testLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand-turquoise" />
              <p className="text-sm text-muted-foreground">Loading test details…</p>
            </div>
          ) : (() => {
            const staticSlug = selectedImage ? testNameToSlug(selectedImage.code) : "";
            const staticData = staticSlug ? getGoodbodyTestBySlug(staticSlug) : null;
            const testName = staticData?.name || selectedImage?.code || "Test";
            const category = staticData?.category || testData?.category || activeTab;
            const price = staticData?.price ?? testData?.price ?? null;
            const biomarkerCount = staticData?.biomarkers?.length || testData?.biomarker_count || null;
            const turnaround = staticData?.turnaround || "3–5 working days";
            const description = staticData?.description || testData?.description || null;
            const sampleType = staticData?.sampleType || "Venous blood sample";
            const biomarkers = staticData?.biomarkers || [];
            const bookUrl = testData?.url || staticData?.goodbodyUrl || "https://www.goodbodyclinic.com";
            const BRAND_COLOR = "#009B8D";

            return (
              <>
                <DialogHeader className="sr-only">
                  <DialogTitle>{testName}</DialogTitle>
                  <DialogDescription>Goodbody Clinic test details</DialogDescription>
                </DialogHeader>

                {/* Colored Header Banner */}
                <div className="px-6 pt-6 pb-5 text-white" style={{ backgroundColor: BRAND_COLOR }}>
                  <p className="text-sm opacity-80 mb-1">Goodbody Clinic · {category}</p>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3">{testName}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {price != null && (
                      <span className="inline-flex items-center bg-black/20 text-white text-sm font-bold px-3 py-1 rounded-full">
                        £{price}
                      </span>
                    )}
                    {biomarkerCount != null && biomarkerCount > 0 && (
                      <span className="inline-flex items-center gap-1 bg-black/20 text-white text-sm px-3 py-1 rounded-full">
                        🧬 {biomarkerCount} biomarkers
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 bg-black/20 text-white text-sm px-3 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5" /> {turnaround}
                    </span>
                  </div>
                </div>

                {/* White Body */}
                <div className="px-6 py-5 space-y-5 max-h-[55vh] overflow-y-auto">
                  {/* Description */}
                  {description && (
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">{description}</p>
                  )}

                  {/* Collection Method */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Collection Method</h4>
                    <div className="flex flex-wrap gap-2">
                      {sampleType.toLowerCase().includes("venous") && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                          <Droplet className="h-3.5 w-3.5" /> Venous
                        </span>
                      )}
                      {sampleType.toLowerCase().includes("finger") && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                          <Droplet className="h-3.5 w-3.5" /> Finger-prick
                        </span>
                      )}
                      {!sampleType.toLowerCase().includes("venous") && !sampleType.toLowerCase().includes("finger") && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                          <Droplet className="h-3.5 w-3.5" /> {sampleType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Biomarkers */}
                  {biomarkers.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Biomarkers Included</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {biomarkers.map((b) => (
                          <span key={b} className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provider Info Card */}
                  <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: `${BRAND_COLOR}10` }}>
                    <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: BRAND_COLOR }}>
                      G
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: BRAND_COLOR }}>Goodbody Clinic</p>
                      <p className="text-xs text-muted-foreground">Private health testing with 200+ clinics nationwide</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["200+ Clinics", "GP Report Included", "CQC Registered"].map((badge) => (
                          <span key={badge} className="text-[10px] font-semibold px-2 py-0.5 rounded border" style={{ color: BRAND_COLOR, borderColor: BRAND_COLOR }}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-3">
                    <a
                      href={bookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors duration-200 hover:opacity-90"
                      style={{ backgroundColor: BRAND_COLOR }}
                    >
                      Book with Goodbody Clinic →
                    </a>
                    <Link
                      to={`/compare?test=${encodeURIComponent(testName)}`}
                      className="inline-flex items-center justify-center font-semibold py-3 px-5 rounded-xl text-sm border border-gray-200 text-foreground hover:bg-gray-50 transition-colors"
                    >
                      + Compare
                    </Link>
                  </div>

                  <p className="text-[11px] text-center text-muted-foreground">
                    You'll be taken to Goodbody Clinic's website to complete your booking.
                  </p>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ===== About Modal ===== */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[#f8f6f3] border-border">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <img src={GOODBODY_LOGO} alt="Goodbody Clinic" className="h-12 w-auto object-contain" />
              <div>
                <DialogTitle className="text-2xl font-heading text-[#3d3529]">
                  Goodbody Clinic
                </DialogTitle>
                <DialogDescription className="text-[#6b6459]">
                  Goodbody Clinic
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-8 text-[#4a443b] font-sans leading-relaxed">
            <section>
              <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-2">Our Mission</h3>
              <p>You know your body better than anyone. When something doesn't feel right or you simply want to stay ahead of potential health issues, waiting months for answers isn't good enough. Goodbody Clinic exists to give you fast, reliable health insights without the long NHS waiting times.</p>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-2">Who We Are</h3>
              <p>Goodbody Clinic is a trusted private health testing provider, helping thousands of people across the UK to monitor, check, and improve their health. We offer testing at our clinic in Bath, through over 250 partner clinics nationwide, or in the comfort of your own home. Rated Excellent on Trustpilot with over 3,400 reviews.</p>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-2">Our Services</h3>
              <p>We offer one of the most comprehensive ranges of private health tests available in the UK. From Advanced Well Man and Well Woman blood tests (covering 48–51 biomarkers) to the Premium Complete Blood Test analysing 62 key biomarkers. For cancer screening, our TruCheck™ Early Cancer Screening blood test can detect markers for over 70 types of solid cancer tumours.</p>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-2">Get in Touch</h3>
              <div className="space-y-2">
                <a href="mailto:clinic@goodbodywellness.co.uk" className="flex items-center gap-2 text-[#4a443b] hover:text-[#3d3529] transition-colors">
                  <Mail className="h-4 w-4 text-[#9b958a]" />
                  clinic@goodbodywellness.co.uk
                </a>
                <a href="tel:01225444144" className="flex items-center gap-2 text-[#4a443b] hover:text-[#3d3529] transition-colors">
                  <Phone className="h-4 w-4 text-[#9b958a]" />
                  01225 444 144
                </a>
              </div>
              <p className="mt-3 text-sm text-[#6b6459]">Test at home, at one of 200+ nationwide clinics, or with a nurse visit. No GP referral needed for most tests.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoodbodyTestGallery;
