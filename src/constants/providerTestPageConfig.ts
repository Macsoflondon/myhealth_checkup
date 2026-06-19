// Provider-specific configuration for test detail pages
// This file contains all the unique content for each provider

export interface ProviderFeature {
  title: string;
  description: string;
}

export interface ProviderSampleOption {
  icon: 'home' | 'clinic';
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
    id: 'medichecks',
    name: '\n',
    logo: '/lovable-uploads/provider-medichecks-new-v3.png',
    turnaround: '3 working days',
    badgeText: '\n Blood Test',
    features: [
      { title: 'Bespoke Doctor\'s Report', description: 'Personalised insights and actionable advice from qualified doctors' },
      { title: 'UKAS Accredited Labs', description: 'Established in 2001 with ISO 15189 accredited laboratories' },
      { title: 'Results in 3 Days', description: 'Fast turnaround with results in 3 working days (estimated)' },
      { title: 'Free Delivery', description: 'Convenient testing options with free delivery' },
    ],
    sampleOptions: [
      {
        icon: 'clinic',
        title: 'Venous Draw at a Clinic (+£35)',
        description: 'Visit one of \n\' national clinic partners for a nurse to take your venous blood sample from a vein in your arm. Instructions on how to book are emailed after order processing.',
      },
      {
        icon: 'home',
        title: 'Venous Draw at Home with a Nurse (+£59)',
        description: 'Book a home nurse appointment for a nurse to take your venous blood sample from a vein in your arm at your convenience.',
      },
      {
        icon: 'clinic',
        title: 'Self-Arrange Professional Collection (Free)',
        description: 'Make an appointment at a phlebotomy clinic to have your venous blood sample taken. You will be responsible for arranging your appointment and any additional fees.',
      },
    ],
    whyChoose: {
      title: 'Why Choose \n?',
      items: [
        { bold: 'Established in 2001:', text: 'Over 14,000 5-star reviews on Feefo with decades of trusted health testing experience' },
        { bold: 'Expert Doctor Support:', text: 'Bespoke doctor\'s report with actionable advice, expert support, and tailored recommendations' },
        { bold: 'Track Your Health:', text: 'My\n portal lets you view results, monitor changes, and store your medical history over time' },
        { bold: 'Flexible Collection:', text: 'Choose from clinic visits, home nurse appointments, or self-arranged professional collection' },
      ],
    },
    quickInfo: {
      sampleType: 'Venous blood sample',
      labProcessing: 'UKAS accredited laboratories',
      resultsDelivery: 'My\n online dashboard with doctor\'s report',
      supportPhone: '03450 600 600',
    },
    ctaText: 'Get ready to elevate your health understanding with a personalised doctor\'s report. Go beyond results and tap into expert insights tailored just for you.',
    ctaButtonText: 'Book with \n',
    aboutText: 'routine health check that provides a comprehensive look at your overall well-being. It covers biomarkers to assess organ function, nutritional balance, and potential health risks.',
    canonicalBase: 'https://myhealthcheckup.co.uk/medichecks',
  },

  'goodbody-clinic': {
    id: 'goodbody-clinic',
    name: 'GoodBody Clinic',
    logo: '/lovable-uploads/provider-goodbody-new-v4.png',
    turnaround: '2-3 working days',
    badgeText: 'GoodBody Clinic Blood Test',
    features: [
      { title: 'Professional Collection', description: 'Trained phlebotomists at all locations' },
      { title: 'UKAS Accredited', description: 'ISO 15189 & CQC regulated laboratories' },
      { title: 'Fast Results', description: '2-3 working days turnaround' },
      { title: 'Walk-In Available', description: 'Pre-booked or walk-in appointments' },
    ],
    sampleOptions: [
      {
        icon: 'clinic',
        title: 'Pharmacy Clinic Visit',
        description: 'Professional venous blood collection at GoodBody Clinic pharmacy locations across the UK. Walk-in or pre-booked appointments available.',
      },
      {
        icon: 'home',
        title: 'Home Nurse Visit',
        description: 'A qualified nurse visits your home to collect your blood sample. Available in select areas for an additional fee.',
      },
    ],
    whyChoose: {
      title: 'Why Choose GoodBody Clinic?',
      items: [
        { bold: 'Convenient Locations:', text: 'Pharmacy clinics across the UK with flexible booking' },
        { bold: 'Professional Service:', text: 'Trained phlebotomists for comfortable venous blood draw' },
        { bold: 'Quality Assured:', text: 'UKAS-accredited labs and CQC regulated facilities' },
        { bold: 'Expert Guidance:', text: 'Clear results with clinical interpretation and support' },
      ],
    },
    quickInfo: {
      sampleType: 'Venous blood draw',
      labProcessing: 'UKAS ISO 15189 accredited',
      resultsDelivery: 'Online portal with detailed report',
      supportPhone: '020 7099 6657',
      supportEmail: 'info@goodbodyclinic.com',
    },
    ctaText: 'Book your test with GoodBody Clinic today for professional venous blood collection at a pharmacy near you. Expert service with fast, reliable results.',
    ctaButtonText: 'Book with GoodBody',
    aboutText: 'blood test with professional venous collection at a GoodBody Clinic pharmacy. All tests are processed in UKAS-accredited laboratories with clinical interpretation.',
    canonicalBase: 'https://myhealthcheckup.co.uk/goodbody',
  },

  thriva: {
    id: 'thriva',
    name: 'Thriva',
    logo: '/lovable-uploads/64eb7ed4-e166-41c0-9a8c-d61d1f9fc7f7.png',
    turnaround: '2-3 working days',
    badgeText: 'Thriva Blood Test',
    features: [
      { title: 'At-Home Testing', description: 'Convenient finger-prick collection at home' },
      { title: 'Doctor Reviewed', description: 'All results reviewed by qualified doctors' },
      { title: 'Fast Results', description: '2-3 working days from sample receipt' },
      { title: 'Subscription Options', description: 'Regular testing plans available' },
    ],
    sampleOptions: [
      {
        icon: 'home',
        title: 'Home Finger-Prick Kit',
        description: 'Convenient at-home finger-prick test kit with simple instructions. Return your sample using the prepaid envelope provided.',
      },
      {
        icon: 'clinic',
        title: 'Nurse Collection Service',
        description: 'Optional nurse visit for venous blood collection at your home. Available in select areas for comprehensive panels.',
      },
    ],
    whyChoose: {
      title: 'Why Choose Thriva?',
      items: [
        { bold: 'Convenient Testing:', text: 'Test from home with easy-to-use finger-prick kits' },
        { bold: 'Personalised Insights:', text: 'Doctor-reviewed results with health recommendations' },
        { bold: 'Track Your Health:', text: 'Monitor biomarker trends over time with the Thriva app' },
        { bold: 'Subscription Savings:', text: 'Save with regular testing subscription plans' },
      ],
    },
    quickInfo: {
      sampleType: 'Finger-prick blood',
      labProcessing: 'UKAS accredited laboratories',
      resultsDelivery: 'Thriva app with personalized insights',
      supportEmail: 'support@thriva.co',
    },
    ctaText: 'Order your Thriva test kit today and take control of your health from the comfort of home. Get doctor-reviewed results with personalised recommendations.',
    ctaButtonText: 'Book with Thriva',
    aboutText: 'at-home blood test with convenient finger-prick collection. All results are reviewed by qualified doctors with personalised health insights.',
    canonicalBase: 'https://myhealthcheckup.co.uk/thriva',
  },

  randox: {
    id: 'randox',
    name: 'Randox Health',
    logo: '/lovable-uploads/provider-randox.png',
    turnaround: '3-5 working days',
    badgeText: 'Randox Health Test',
    features: [
      { title: 'Modern Clinics', description: 'State-of-the-art health clinic facilities' },
      { title: 'Advanced Diagnostics', description: 'Cutting-edge laboratory technology' },
      { title: 'Expert Consultation', description: 'Healthcare professional review included' },
      { title: 'Comprehensive Testing', description: 'Extensive biomarker analysis' },
    ],
    sampleOptions: [
      {
        icon: 'clinic',
        title: 'Randox Health Clinic',
        description: 'Visit a state-of-the-art Randox Health clinic for professional venous blood collection in a modern, comfortable setting.',
      },
      {
        icon: 'home',
        title: 'Home Collection Kit',
        description: 'For select tests, convenient at-home finger-prick collection kits are available with prepaid return postage.',
      },
    ],
    whyChoose: {
      title: 'Why Choose Randox Health?',
      items: [
        { bold: 'Global Leader:', text: 'World-leading diagnostic company with advanced technology' },
        { bold: 'Modern Facilities:', text: 'State-of-the-art clinics across the UK' },
        { bold: 'Comprehensive Screening:', text: 'In-depth health checks with detailed biomarker analysis' },
        { bold: 'Expert Care:', text: 'Professional consultation and personalized recommendations' },
      ],
    },
    quickInfo: {
      sampleType: 'Venous blood draw',
      labProcessing: 'Randox laboratories (ISO certified)',
      resultsDelivery: 'Online portal with consultation',
      supportPhone: '0800 2545 130',
    },
    ctaText: 'Book your comprehensive health check at a Randox Health clinic today. Advanced diagnostics with expert consultation and detailed insights.',
    ctaButtonText: 'Book with Randox Health',
    aboutText: 'comprehensive health test using advanced diagnostic technology. All tests include professional consultation and detailed health insights.',
    canonicalBase: 'https://myhealthcheckup.co.uk/randox',
  },


  'lola-health': {
    id: 'lola-health',
    name: 'Lola Health',
    logo: '/lovable-uploads/provider-lola-health.png',
    turnaround: '2-4 working days',
    badgeText: 'Lola Health Blood Test',
    features: [
      { title: 'At-Home Phlebotomy', description: 'Professional venous blood collection at your home' },
      { title: 'Doctor Reviewed', description: 'All results reviewed by qualified doctors' },
      { title: 'NHS-Accredited Labs', description: 'ISO 15189 certified laboratories' },
      { title: 'Mobile App Results', description: 'Easy-to-use app with personalized insights' },
    ],
    sampleOptions: [
      {
        icon: 'home',
        title: 'At-Home Phlebotomy',
        description: 'A trained phlebotomist visits your home or workplace to collect a venous blood sample. More comfortable than finger-prick with larger sample volumes.',
      },
      {
        icon: 'clinic',
        title: 'Partner Clinic Visit',
        description: 'Visit a Lola Health partner clinic for professional venous blood collection if preferred.',
      },
    ],
    whyChoose: {
      title: 'Why Choose Lola Health?',
      items: [
        { bold: 'Professional At-Home Service:', text: 'Trained phlebotomist visits for venous blood draw (not finger-prick)' },
        { bold: 'NHS-Accredited Testing:', text: 'ISO 15189 certified laboratories for accurate results' },
        { bold: 'Doctor-Reviewed Results:', text: 'Qualified doctors review all results with personalized insights' },
        { bold: 'Easy App Access:', text: 'View results and track health trends via the Lola Health app' },
      ],
    },
    quickInfo: {
      sampleType: 'Venous blood (at-home phlebotomy)',
      labProcessing: 'NHS-accredited (ISO 15189)',
      resultsDelivery: 'Lola Health app with doctor insights',
      supportEmail: 'support@lolahealth.com',
    },
    ctaText: 'Book your at-home blood test with Lola Health today. Professional phlebotomy service with doctor-reviewed results delivered to your app.',
    ctaButtonText: 'Book with Lola Health',
    aboutText: 'blood test with professional at-home phlebotomy. All results are processed in NHS-accredited laboratories and reviewed by qualified doctors.',
    canonicalBase: 'https://myhealthcheckup.co.uk/lola-health',
  },

  'london-medical-laboratory': {
    id: 'london-medical-laboratory',
    name: 'London Medical Laboratory',
    logo: '/lovable-uploads/provider-london-medical.png',
    turnaround: '1-2 working days',
    badgeText: 'London Medical Laboratory Test',
    features: [
      { title: 'Same-Day Results', description: 'Express results available for select tests' },
      { title: 'UKAS Accredited', description: 'ISO 15189 accredited laboratory' },
      { title: 'Central London Location', description: 'Convenient Harley Street clinic' },
      { title: 'Expert Analysis', description: 'Specialist doctor review available' },
    ],
    sampleOptions: [
      {
        icon: 'clinic',
        title: 'Harley Street Clinic',
        description: 'Visit the prestigious London Medical Laboratory clinic on Harley Street for professional venous blood collection.',
      },
      {
        icon: 'home',
        title: 'Home Collection Service',
        description: 'Professional phlebotomist visits your home in Greater London area for convenient blood collection.',
      },
    ],
    whyChoose: {
      title: 'Why Choose London Medical Laboratory?',
      items: [
        { bold: 'Fast Turnaround:', text: 'Same-day and next-day results for most tests' },
        { bold: 'UKAS Accredited:', text: 'ISO 15189 certified for quality and accuracy' },
        { bold: 'Harley Street Location:', text: 'Prestigious central London clinic with expert staff' },
        { bold: 'Specialist Review:', text: 'Option for specialist doctor consultation on results' },
      ],
    },
    quickInfo: {
      sampleType: 'Venous blood draw',
      labProcessing: 'London Medical Laboratory (UKAS)',
      resultsDelivery: 'Online portal or email delivery',
      supportPhone: '020 7183 0244',
      supportEmail: 'info@londonmedicallaboratory.com',
    },
    ctaText: 'Book your test with London Medical Laboratory for fast, accurate results from a UKAS-accredited Harley Street laboratory.',
    ctaButtonText: 'Book with London Medical Lab',
    aboutText: 'blood test from a prestigious Harley Street laboratory. Fast turnaround with UKAS-accredited analysis and specialist review available.',
    canonicalBase: 'https://myhealthcheckup.co.uk/london-medical-laboratory',
  },

  'clinilabs': {
    id: 'clinilabs',
    name: 'Clinilabs',
    logo: '/lovable-uploads/provider-clinilabs.png',
    turnaround: '2-5 working days',
    badgeText: 'Clinilabs Blood Test',
    features: [
      { title: 'UKAS Accredited Labs', description: 'High-accuracy testing in ISO 15189 accredited laboratories' },
      { title: 'Nationwide Coverage', description: 'Clinic locations available across the UK' },
      { title: 'Fast Turnaround', description: 'Results delivered within 2–5 working days' },
      { title: 'Wide Test Range', description: 'Comprehensive menu of blood and health tests' },
    ],
    sampleOptions: [
      {
        icon: 'clinic',
        title: 'Clinic Visit',
        description: 'Visit a Clinilabs partner clinic for professional venous blood collection by a trained phlebotomist.',
      },
    ],
    whyChoose: {
      title: 'Why Choose Clinilabs?',
      items: [
        { bold: 'Accredited Testing:', text: 'ISO 15189 certified laboratories for reliable, accurate results' },
        { bold: 'Broad Test Menu:', text: 'Comprehensive range covering health, hormones, vitamins, and more' },
        { bold: 'Nationwide Access:', text: 'Clinic locations across the UK for convenient booking' },
        { bold: 'Fast Results:', text: 'Turnaround of 2–5 working days with online result delivery' },
      ],
    },
    quickInfo: {
      sampleType: 'Venous blood draw',
      labProcessing: 'ISO 15189 accredited laboratories',
      resultsDelivery: 'Secure online portal',
    },
    ctaText: 'Book your blood test with Clinilabs today for reliable, accredited results at a clinic near you.',
    ctaButtonText: 'Book with Clinilabs',
    aboutText: 'blood test processed in ISO 15189 accredited laboratories. Professional phlebotomy and fast, secure online result delivery.',
    canonicalBase: 'https://myhealthcheckup.co.uk/clinilabs',
  },

  'london-health-company': {
    id: 'london-health-company',
    name: 'London Health Company',
    logo: '/lovable-uploads/provider-london-health-company.png',
    turnaround: '2-4 working days',
    badgeText: 'London Health Company Blood Test',
    features: [
      { title: 'Professional Phlebotomy', description: 'Trained phlebotomists for accurate sample collection' },
      { title: 'London-Based', description: 'Convenient clinic locations across London' },
      { title: 'Comprehensive Panels', description: 'Wide range of blood tests and health checks' },
      { title: 'Fast Results', description: 'Results delivered within 2–4 working days' },
    ],
    sampleOptions: [
      {
        icon: 'clinic',
        title: 'Clinic Visit',
        description: 'Visit a London Health Company clinic for professional venous blood collection by a trained phlebotomist.',
      },
    ],
    whyChoose: {
      title: 'Why Choose London Health Company?',
      items: [
        { bold: 'London Convenience:', text: 'Multiple clinic locations across London for easy access' },
        { bold: 'Professional Service:', text: 'Trained phlebotomists for accurate and comfortable blood collection' },
        { bold: 'Comprehensive Testing:', text: 'Wide range of blood tests and health screening panels' },
        { bold: 'Fast Turnaround:', text: 'Results within 2–4 working days via secure online portal' },
      ],
    },
    quickInfo: {
      sampleType: 'Venous blood draw',
      labProcessing: 'Accredited laboratory partners',
      resultsDelivery: 'Online portal delivery',
    },
    ctaText: 'Book your blood test with London Health Company for professional phlebotomy and reliable results.',
    ctaButtonText: 'Book with London Health Company',
    aboutText: 'blood test with professional venous collection at a London Health Company clinic. Fast, accurate results via secure online portal.',
    canonicalBase: 'https://myhealthcheckup.co.uk/london-health-company',
  },

  'medical-diagnosis': {
    id: 'medical-diagnosis',
    name: 'Medical Diagnosis',
    logo: '/lovable-uploads/provider-medical-diagnosis.png',
    turnaround: '2-5 working days',
    badgeText: 'Medical Diagnosis Blood Test',
    features: [
      { title: 'Clinic-Based Testing', description: 'Professional venous blood collection at clinic locations' },
      { title: 'Wide Test Range', description: 'Broad menu of diagnostic blood tests and health panels' },
      { title: 'Competitive Pricing', description: 'Affordable private blood testing options' },
      { title: 'Results Online', description: 'Secure online result delivery within 2–5 working days' },
    ],
    sampleOptions: [
      {
        icon: 'clinic',
        title: 'Clinic Visit',
        description: 'Visit a Medical Diagnosis clinic for professional venous blood collection by trained staff.',
      },
    ],
    whyChoose: {
      title: 'Why Choose Medical Diagnosis?',
      items: [
        { bold: 'Broad Test Menu:', text: 'Comprehensive range of diagnostic blood tests and health panels' },
        { bold: 'Competitive Pricing:', text: 'Affordable private testing with transparent pricing' },
        { bold: 'Clinic Access:', text: 'Professional venous blood collection at clinic locations' },
        { bold: 'Online Results:', text: 'Secure digital delivery of results within 2–5 working days' },
      ],
    },
    quickInfo: {
      sampleType: 'Venous blood draw',
      labProcessing: 'Accredited laboratory partners',
      resultsDelivery: 'Secure online portal',
      supportPhone: '020 3538 0930',
    },
    ctaText: 'Book your blood test with Medical Diagnosis for professional collection and reliable results at competitive prices.',
    ctaButtonText: 'Book with Medical Diagnosis',
    aboutText: 'blood test with professional venous collection at a Medical Diagnosis clinic. Competitive pricing with secure online result delivery.',
    canonicalBase: 'https://myhealthcheckup.co.uk/medical-diagnosis',
  },
};

export const getProviderConfig = (providerId: string): ProviderConfig | undefined => {
  return providerConfigs[providerId];
};
