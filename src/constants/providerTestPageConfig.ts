import { PROVIDER_LOGO_ASSETS } from "@/constants/providerLogoAssets";
// Provider-specific configuration for test detail pages
// This file contains all the unique content for each provider

export interface ProviderFeature {
  title: string;
  description: string;
}

export interface ProviderSampleOption {
  icon: "home" | "clinic";
  title: string;
  description: string;
}

export interface ProviderWhyChoose {
  title: string;
  items: Array<{
    bold: string;
    text: string;
  }>;
}

export interface ProviderQuickInfo {
  sampleType: string;
  labProcessing: string;
  resultsDelivery: string;
  supportPhone?: string;
  supportEmail?: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  logo: string;
  turnaround: string;
  badgeText: string;
  features: ProviderFeature[];
  sampleOptions: ProviderSampleOption[];
  whyChoose: ProviderWhyChoose;
  quickInfo: ProviderQuickInfo;
  ctaText: string;
  ctaButtonText: string;
  aboutText: string;
  canonicalBase: string;
}

export const providerConfigs: Record<string, ProviderConfig> = {
  medichecks: {
    id: "medichecks",
    name: "Medichecks",
    logo: "/lovable-uploads/provider-medichecks-new-v3.webp",
    turnaround: "3 working days",
    badgeText: "Medichecks Blood Test",
    features: [
      {
        title: "Bespoke Doctor's Report",
        description:
          "Personalised insights and actionable advice from qualified doctors",
      },
      {
        title: "UKAS accredited labs",
        description:
          "Established in 2001 with ISO 15189 accredited laboratories",
      },
      {
        title: "Results in 3 days",
        description:
          "Fast turnaround with results in 3 working days (estimated)",
      },
      {
        title: "Free delivery",
        description: "Convenient testing options with free delivery",
      },
    ],
    sampleOptions: [
      {
        icon: "clinic",
        title: "Venous draw at a clinic (+£35)",
        description:
          "Visit one of Medichecks' national clinic partners for a nurse to take your venous blood sample from a vein in your arm. Instructions on how to book are emailed after order processing.",
      },
      {
        icon: "home",
        title: "Venous draw at home with a nurse (+£59)",
        description:
          "Book a home nurse appointment for a nurse to take your venous blood sample from a vein in your arm at your convenience.",
      },
      {
        icon: "clinic",
        title: "Self-arrange professional collection (free)",
        description:
          "Make an appointment at a phlebotomy clinic to have your venous blood sample taken. You will be responsible for arranging your appointment and any additional fees.",
      },
    ],
    whyChoose: {
      title: "Why choose Medichecks?",
      items: [
        {
          bold: "Established in 2001:",
          text: "Over 14,000 5-star reviews on Feefo with decades of trusted health testing experience",
        },
        {
          bold: "Expert Doctor Support:",
          text: "Bespoke doctor's report with actionable advice, expert support, and tailored recommendations",
        },
        {
          bold: "Track Your Health:",
          text: "The Medichecks portal lets you view results, monitor changes, and store your medical history over time",
        },
        {
          bold: "Flexible Collection:",
          text: "Choose from clinic visits, home nurse appointments, or self-arranged professional collection",
        },
      ],
    },
    quickInfo: {
      sampleType: "Venous blood sample",
      labProcessing: "UKAS accredited laboratories",
      resultsDelivery: "Medichecks online dashboard with doctor's report",
      supportPhone: "03450 600 600",
    },
    ctaText:
      "Get ready to elevate your health understanding with a personalised doctor's report. Go beyond results and tap into expert insights tailored just for you.",
    ctaButtonText: "Book",
    aboutText:
      "routine health check that provides a comprehensive look at your overall well-being. It covers biomarkers to assess organ function, nutritional balance, and potential health risks.",
    canonicalBase: "https://myhealthcheckup.co.uk/medichecks",
  },

  "goodbody-clinic": {
    id: "goodbody-clinic",
    name: "Goodbody Clinic",
    logo: PROVIDER_LOGO_ASSETS["goodbody-clinic"].src,
    turnaround: "2-3 working days",
    badgeText: "Goodbody Clinic Blood Test",
    features: [
      {
        title: "Professional collection",
        description: "Trained phlebotomists at all locations",
      },
      {
        title: "UKAS accredited",
        description: "ISO 15189 & CQC regulated laboratories",
      },
      { title: "Fast results", description: "2-3 working days turnaround" },
      {
        title: "Walk-in available",
        description: "Pre-booked or walk-in appointments",
      },
    ],
    sampleOptions: [
      {
        icon: "clinic",
        title: "Pharmacy clinic visit",
        description:
          "Professional venous blood collection at Goodbody Clinic pharmacy locations across the UK. Walk-in or pre-booked appointments available.",
      },
      {
        icon: "home",
        title: "Home nurse visit",
        description:
          "A qualified nurse visits your home to collect your blood sample. Available in select areas for an additional fee.",
      },
    ],
    whyChoose: {
      title: "Why choose Goodbody Clinic?",
      items: [
        {
          bold: "Convenient Locations:",
          text: "Pharmacy clinics across the UK with flexible booking",
        },
        {
          bold: "Professional Service:",
          text: "Trained phlebotomists for comfortable venous blood draw",
        },
        {
          bold: "Quality Assured:",
          text: "UKAS-accredited labs and CQC regulated facilities",
        },
        {
          bold: "Expert Guidance:",
          text: "Clear results with clinical interpretation and support",
        },
      ],
    },
    quickInfo: {
      sampleType: "Venous blood draw",
      labProcessing: "UKAS ISO 15189 accredited",
      resultsDelivery: "Online portal with detailed report",
      supportPhone: "020 7099 6657",
      supportEmail: "info@goodbodyclinic.com",
    },
    ctaText:
      "Book your test with Goodbody Clinic today for professional venous blood collection at a pharmacy near you. Expert service with fast, reliable results.",
    ctaButtonText: "Book",
    aboutText:
      "blood test with professional venous collection at a Goodbody Clinic pharmacy. All tests are processed in UKAS-accredited laboratories with clinical interpretation.",
    canonicalBase: "https://myhealthcheckup.co.uk/goodbody",
  },

  randox: {
    id: "randox",
    name: "Randox Health",
    logo: PROVIDER_LOGO_ASSETS.randox.src,
    turnaround: "3-5 working days",
    badgeText: "Randox Health Test",
    features: [
      {
        title: "Modern clinics",
        description: "State-of-the-art health clinic facilities",
      },
      {
        title: "Advanced Diagnostics",
        description: "Cutting-edge laboratory technology",
      },
      {
        title: "Expert consultation",
        description: "Healthcare professional review included",
      },
      {
        title: "Comprehensive testing",
        description: "Extensive biomarker analysis",
      },
    ],
    sampleOptions: [
      {
        icon: "clinic",
        title: "Randox Health clinic",
        description:
          "Visit a state-of-the-art Randox Health clinic for professional venous blood collection in a modern, comfortable setting.",
      },
      {
        icon: "home",
        title: "Home collection kit",
        description:
          "For select tests, convenient at-home finger-prick collection kits are available with prepaid return postage.",
      },
    ],
    whyChoose: {
      title: "Why choose Randox Health?",
      items: [
        {
          bold: "Global Leader:",
          text: "World-leading diagnostic company with advanced technology",
        },
        {
          bold: "Modern Facilities:",
          text: "State-of-the-art clinics across the UK",
        },
        {
          bold: "Comprehensive Screening:",
          text: "In-depth health checks with detailed biomarker analysis",
        },
        {
          bold: "Expert Care:",
          text: "Professional consultation and personalized recommendations",
        },
      ],
    },
    quickInfo: {
      sampleType: "Venous blood draw",
      labProcessing: "Randox laboratories (ISO certified)",
      resultsDelivery: "Online portal with consultation",
      supportPhone: "0800 2545 130",
    },
    ctaText:
      "Book your comprehensive health check at a Randox Health clinic today. Advanced diagnostics with expert consultation and detailed insights.",
    ctaButtonText: "Book",
    aboutText:
      "comprehensive health test using advanced diagnostic technology. All tests include professional consultation and detailed health insights.",
    canonicalBase: "https://myhealthcheckup.co.uk/randox",
  },

  "lola-health": {
    id: "lola-health",
    name: "Lola Health",
    logo: PROVIDER_LOGO_ASSETS["lola-health"].src,
    turnaround: "2 working days",
    badgeText: "Lola Health Blood Test",
    features: [
      {
        title: "At-home phlebotomy",
        description: "Professional venous blood collection at your home",
      },
      {
        title: "Doctor reviewed",
        description: "All results reviewed by qualified doctors",
      },
      {
        title: "UKAS-accredited labs",
        description: "UKAS-accredited laboratories (ISO 15189)",
      },
      {
        title: "Mobile app results",
        description: "Easy-to-use app with personalized insights",
      },
    ],
    sampleOptions: [
      {
        icon: "home",
        title: "At-home phlebotomy",
        description:
          "A trained phlebotomist visits your home or workplace to collect a venous blood sample. More comfortable than finger-prick with larger sample volumes.",
      },
      {
        icon: "clinic",
        title: "Partner clinic visit",
        description:
          "Visit a Lola Health partner clinic for professional venous blood collection if preferred.",
      },
    ],
    whyChoose: {
      title: "Why choose Lola Health?",
      items: [
        {
          bold: "Professional At-Home Service:",
          text: "Trained phlebotomist visits for venous blood draw (not finger-prick)",
        },
        {
          bold: "UKAS-Accredited Testing:",
          text: "UKAS-accredited laboratories (ISO 15189)",
        },
        {
          bold: "Doctor-Reviewed Results:",
          text: "Qualified doctors review all results with personalized insights",
        },
        {
          bold: "Easy App Access:",
          text: "View results and track health trends via the Lola Health app",
        },
      ],
    },
    quickInfo: {
      sampleType: "Venous blood (at-home phlebotomy)",
      labProcessing: "UKAS-accredited laboratories (ISO 15189)",
      resultsDelivery: "Lola Health app with doctor insights",
      supportEmail: "support@lolahealth.com",
    },
    ctaText:
      "Book your at-home blood test with Lola Health today. Professional phlebotomy service with doctor-reviewed results delivered to your app.",
    ctaButtonText: "Book",
    aboutText:
      "blood test with professional at-home phlebotomy. All results are processed in UKAS-accredited laboratories (ISO 15189) and reviewed by qualified doctors.",
    canonicalBase: "https://myhealthcheckup.co.uk/lola-health",
  },

  "london-medical-laboratory": {
    id: "london-medical-laboratory",
    name: "London Medical Laboratory",
    logo: PROVIDER_LOGO_ASSETS["london-medical-laboratory"].src,
    turnaround: "1-2 working days",
    badgeText: "London Medical Laboratory Test",
    features: [
      {
        title: "Same-day results",
        description: "Express results available for select tests",
      },
      {
        title: "UKAS accredited",
        description: "ISO 15189 accredited laboratory",
      },
      {
        title: "Central London location",
        description: "Convenient Harley Street clinic",
      },
      {
        title: "Expert analysis",
        description: "Specialist doctor review available",
      },
    ],
    sampleOptions: [
      {
        icon: "clinic",
        title: "Harley Street clinic",
        description:
          "Visit the prestigious London Medical Laboratory clinic on Harley Street for professional venous blood collection.",
      },
      {
        icon: "home",
        title: "Home collection service",
        description:
          "Professional phlebotomist visits your home in Greater London area for convenient blood collection.",
      },
    ],
    whyChoose: {
      title: "Why choose London Medical Laboratory?",
      items: [
        {
          bold: "Fast Turnaround:",
          text: "Same-day and next-day results for most tests",
        },
        {
          bold: "UKAS Accredited:",
          text: "ISO 15189 certified for quality and accuracy",
        },
        {
          bold: "Harley Street Location:",
          text: "Prestigious central London clinic with expert staff",
        },
        {
          bold: "Specialist Review:",
          text: "Option for specialist doctor consultation on results",
        },
      ],
    },
    quickInfo: {
      sampleType: "Venous blood draw",
      labProcessing: "London Medical Laboratory (UKAS)",
      resultsDelivery: "Online portal or email delivery",
      supportPhone: "020 7183 0244",
      supportEmail: "info@londonmedicallaboratory.com",
    },
    ctaText:
      "Book your test with London Medical Laboratory for fast, accurate results from a UKAS-accredited Harley Street laboratory.",
    ctaButtonText: "Book",
    aboutText:
      "blood test from a prestigious Harley Street laboratory. Fast turnaround with UKAS-accredited analysis and specialist review available.",
    canonicalBase: "https://myhealthcheckup.co.uk/london-medical-laboratory",
  },

  clinilabs: {
    id: "clinilabs",
    name: "Clinilabs",
    logo: PROVIDER_LOGO_ASSETS.clinilabs.src,
    turnaround: "2-5 working days",
    badgeText: "Clinilabs Blood Test",
    features: [
      {
        title: "UKAS accredited labs",
        description:
          "High-accuracy testing in ISO 15189 accredited laboratories",
      },
      {
        title: "Nationwide coverage",
        description: "Clinic locations available across the UK",
      },
      {
        title: "Fast turnaround",
        description: "Results delivered within 2–5 working days",
      },
      {
        title: "Wide test range",
        description: "Comprehensive menu of blood and health tests",
      },
    ],
    sampleOptions: [
      {
        icon: "clinic",
        title: "Clinic visit",
        description:
          "Visit a Clinilabs partner clinic for professional venous blood collection by a trained phlebotomist.",
      },
    ],
    whyChoose: {
      title: "Why choose Clinilabs?",
      items: [
        {
          bold: "Accredited Testing:",
          text: "ISO 15189 certified laboratories for reliable, accurate results",
        },
        {
          bold: "Broad Test Menu:",
          text: "Comprehensive range covering health, hormones, vitamins, and more",
        },
        {
          bold: "Nationwide Access:",
          text: "Clinic locations across the UK for convenient booking",
        },
        {
          bold: "Fast Results:",
          text: "Turnaround of 2–5 working days with online result delivery",
        },
      ],
    },
    quickInfo: {
      sampleType: "Venous blood draw",
      labProcessing: "ISO 15189 accredited laboratories",
      resultsDelivery: "Secure online portal",
    },
    ctaText:
      "Book your blood test with Clinilabs today for reliable, accredited results at a clinic near you.",
    ctaButtonText: "Book",
    aboutText:
      "blood test processed in ISO 15189 accredited laboratories. Professional phlebotomy and fast, secure online result delivery.",
    canonicalBase: "https://myhealthcheckup.co.uk/clinilabs",
  },

  "london-health-company": {
    id: "london-health-company",
    name: "London Health Company",
    logo: PROVIDER_LOGO_ASSETS["london-health-company"].src,
    turnaround: "2-4 working days",
    badgeText: "London Health Company Blood Test",
    features: [
      {
        title: "Professional phlebotomy",
        description: "Trained phlebotomists for accurate sample collection",
      },
      {
        title: "London-Based",
        description: "Convenient clinic locations across London",
      },
      {
        title: "Comprehensive panels",
        description: "Wide range of blood tests and health checks",
      },
      {
        title: "Fast results",
        description: "Results delivered within 2–4 working days",
      },
    ],
    sampleOptions: [
      {
        icon: "clinic",
        title: "Clinic visit",
        description:
          "Visit a London Health Company clinic for professional venous blood collection by a trained phlebotomist.",
      },
    ],
    whyChoose: {
      title: "Why choose London Health Company?",
      items: [
        {
          bold: "London Convenience:",
          text: "Multiple clinic locations across London for easy access",
        },
        {
          bold: "Professional Service:",
          text: "Trained phlebotomists for accurate and comfortable blood collection",
        },
        {
          bold: "Comprehensive Testing:",
          text: "Wide range of blood tests and health screening panels",
        },
        {
          bold: "Fast Turnaround:",
          text: "Results within 2–4 working days via secure online portal",
        },
      ],
    },
    quickInfo: {
      sampleType: "Venous blood draw",
      labProcessing: "Accredited laboratory partners",
      resultsDelivery: "Online portal delivery",
    },
    ctaText:
      "Book your blood test with London Health Company for professional phlebotomy and reliable results.",
    ctaButtonText: "Book",
    aboutText:
      "blood test with professional venous collection at a London Health Company clinic. Fast, accurate results via secure online portal.",
    canonicalBase: "https://myhealthcheckup.co.uk/london-health-company",
  },

  "medical-diagnosis": {
    id: "medical-diagnosis",
    name: "Medical Diagnosis",
    logo: PROVIDER_LOGO_ASSETS["medical-diagnosis"].src,
    turnaround: "2-5 working days",
    badgeText: "Medical Diagnosis Blood Test",
    features: [
      {
        title: "Clinic-based testing",
        description: "Professional venous blood collection at clinic locations",
      },
      {
        title: "Wide test range",
        description: "Broad menu of diagnostic blood tests and health panels",
      },
      {
        title: "Competitive pricing",
        description: "Affordable private blood testing options",
      },
      {
        title: "Results online",
        description: "Secure online result delivery within 2–5 working days",
      },
    ],
    sampleOptions: [
      {
        icon: "clinic",
        title: "Clinic visit",
        description:
          "Visit a Medical Diagnosis clinic for professional venous blood collection by trained staff.",
      },
    ],
    whyChoose: {
      title: "Why choose Medical Diagnosis?",
      items: [
        {
          bold: "Broad Test Menu:",
          text: "Comprehensive range of diagnostic blood tests and health panels",
        },
        {
          bold: "Competitive Pricing:",
          text: "Affordable private testing with transparent pricing",
        },
        {
          bold: "Clinic Access:",
          text: "Professional venous blood collection at clinic locations",
        },
        {
          bold: "Online Results:",
          text: "Secure digital delivery of results within 2–5 working days",
        },
      ],
    },
    quickInfo: {
      sampleType: "Venous blood draw",
      labProcessing: "Accredited laboratory partners",
      resultsDelivery: "Secure online portal",
      supportPhone: "020 3538 0930",
    },
    ctaText:
      "Book your blood test with Medical Diagnosis for professional collection and reliable results at competitive prices.",
    ctaButtonText: "Book",
    aboutText:
      "blood test with professional venous collection at a Medical Diagnosis clinic. Competitive pricing with secure online result delivery.",
    canonicalBase: "https://myhealthcheckup.co.uk/medical-diagnosis",
  },

  // Service details from sportsbloodtests.co.uk (checked 07/11/2026).
  // Laboratory accreditation signed off by the site owner on 07/11/2026.
  "sports-blood-tests": {
    id: "sports-blood-tests",
    name: "EDGE",
    logo: PROVIDER_LOGO_ASSETS["sports-blood-tests"].src,
    turnaround: "2-3 working days (typical)",
    badgeText: "EDGE blood test",
    features: [
      {
        title: "Sport-specific panels",
        description:
          "Panels built around running, cycling, triathlon, weightlifting and CrossFit",
      },
      {
        title: "Home sample kit",
        description: "Finger-prick kit posted to you and returned by post",
      },
      {
        title: "Doctor-reviewed results",
        description: "EDGE states results are reviewed by a sports doctor",
      },
      {
        title: "Accredited laboratory",
        description:
          "Samples analysed in UKAS ISO 15189 accredited laboratories",
      },
    ],
    sampleOptions: [
      {
        icon: "home",
        title: "Home finger-prick kit",
        description:
          "Collect a small capillary sample at home and post it to the laboratory.",
      },
      {
        icon: "clinic",
        title: "Partner clinic",
        description:
          "EDGE works with CQC-regulated partner clinics. Check booking options on the EDGE website.",
      },
    ],
    whyChoose: {
      title: "About EDGE",
      items: [
        {
          bold: "Sport focus:",
          text: "Panels grouped by sport and sex, with exact prices shown per test",
        },
        {
          bold: "Laboratory:",
          text: "Samples analysed in a UKAS ISO 15189 accredited laboratory",
        },
        {
          bold: "Turnaround:",
          text: "EDGE lists results in 2-3 working days for most tests; not guaranteed",
        },
        {
          bold: "Data security:",
          text: "EDGE states it is ISO 27001 certified",
        },
      ],
    },
    quickInfo: {
      sampleType: "Capillary (finger-prick) home kit",
      labProcessing: "UKAS ISO 15189 accredited laboratory",
      resultsDelivery: "Online results with sports doctor review",
    },
    ctaText:
      "Book with EDGE on its website. Prices and availability are checked against the provider's own pages.",
    ctaButtonText: "Book",
    aboutText:
      "blood test from EDGE, using a home finger-prick kit analysed in a UKAS ISO 15189 accredited laboratory.",
    canonicalBase: "https://myhealthcheckup.co.uk/provider/sports-blood-tests",
  },
};

export const getProviderConfig = (
  providerId: string,
): ProviderConfig | undefined => {
  return providerConfigs[providerId];
};
