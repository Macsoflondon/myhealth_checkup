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
    name: 'Medichecks',
    logo: '/lovable-uploads/provider-medichecks-new-v3.png',
    turnaround: '2 working days',
    badgeText: 'Medichecks Blood Test',
    features: [
      { title: 'Doctor Reviewed', description: 'All results reviewed by qualified doctors' },
      { title: 'UKAS Accredited', description: 'ISO 15189 accredited laboratories' },
      { title: 'Fast Results', description: '2 working days from sample receipt' },
      { title: 'Flexible Collection', description: 'Home kit or clinic options' },
    ],
    sampleOptions: [
      {
        icon: 'home',
        title: 'Home Finger-Prick Kit',
        description: 'Easy-to-use finger-prick collection kit delivered to your home. Simple instructions included. Return via Royal Mail using the prepaid envelope.',
      },
      {
        icon: 'clinic',
        title: 'Clinic Venous Blood Draw',
        description: 'Professional venous blood draw at a TDL clinic or partner location. More comfortable for comprehensive panels requiring larger sample volumes.',
      },
    ],
    whyChoose: {
      title: 'Why Choose Medichecks?',
      items: [
        { bold: "UK's Leading Provider:", text: 'Over 300 blood tests with 90,000+ customer reviews (4.7/5 on Feefo)' },
        { bold: 'Medical Excellence:', text: 'UKAS-accredited labs and doctor-reviewed results with personalised insights' },
        { bold: 'Convenient Testing:', text: 'Flexible sample collection with home kits, clinic visits, or home nurse service' },
        { bold: 'Comprehensive Coverage:', text: 'Extensive test catalogue covering 12+ health categories' },
      ],
    },
    quickInfo: {
      sampleType: 'Finger-prick or venous blood',
      labProcessing: 'TDL, Eurofins (UKAS accredited)',
      resultsDelivery: 'Online dashboard with doctor commentary',
      supportPhone: '03450 600 600',
    },
    ctaText: 'Book your test with Medichecks today and get doctor-reviewed results in just 2 working days. Join over 90,000 satisfied customers who trust Medichecks for their health testing needs.',
    ctaButtonText: 'Book with Medichecks',
    aboutText: 'comprehensive blood test that provides detailed insights into your health markers. All tests are processed by UKAS-accredited laboratories (ISO 15189) and reviewed by qualified doctors.',
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
      { title: 'UKAS Accredited', description: 'ISO 15189 & CQC registered laboratories' },
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
        { bold: 'Quality Assured:', text: 'UKAS-accredited labs and CQC registered facilities' },
        { bold: 'Expert Guidance:', text: 'Clear results with clinical interpretation and support' },
      ],
    },
    quickInfo: {
      sampleType: 'Venous blood draw',
      labProcessing: 'UKAS ISO 15189 accredited',
      resultsDelivery: 'Online portal with detailed report',
      supportPhone: '020 7099 6657',
      supportEmail: 'info@goodbody.co.uk',
    },
    ctaText: 'Book your test with GoodBody Clinic today for professional venous blood collection at a pharmacy near you. Expert service with fast, reliable results.',
    ctaButtonText: 'Book with GoodBody',
    aboutText: 'blood test with professional venous collection at a GoodBody Clinic pharmacy. All tests are processed in UKAS-accredited laboratories with clinical interpretation.',
    canonicalBase: 'https://myhealthcheckup.co.uk/goodbody',
  },

  thriva: {
    id: 'thriva',
    name: 'Thriva',
    logo: '/lovable-uploads/provider-thriva.png',
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

  'tuli-health': {
    id: 'tuli-health',
    name: 'Tuli Health',
    logo: '/lovable-uploads/provider-tuli-health.png',
    turnaround: '2-4 working days',
    badgeText: 'Tuli Health Blood Test',
    features: [
      { title: 'Flexible Testing', description: 'At-home or clinic collection options' },
      { title: 'Accredited Labs', description: 'Quality-assured laboratory processing' },
      { title: 'Quick Turnaround', description: '2-4 working days for results' },
      { title: 'Affordable Prices', description: 'Competitive pricing with no hidden fees' },
    ],
    sampleOptions: [
      {
        icon: 'home',
        title: 'At-Home Collection Kit',
        description: 'Easy-to-use finger-prick collection kit delivered to your door with clear instructions and prepaid return postage.',
      },
      {
        icon: 'clinic',
        title: 'Partner Clinic Visit',
        description: 'Professional venous blood collection at a Tuli Health partner clinic location near you.',
      },
    ],
    whyChoose: {
      title: 'Why Choose Tuli Health?',
      items: [
        { bold: 'Accessible Testing:', text: 'Affordable health screening for everyone' },
        { bold: 'Flexible Options:', text: 'Choose between home kits or clinic visits' },
        { bold: 'Quality Results:', text: 'Accredited laboratory processing and analysis' },
        { bold: 'Clear Insights:', text: 'Easy-to-understand results with recommendations' },
      ],
    },
    quickInfo: {
      sampleType: 'Finger-prick or venous blood',
      labProcessing: 'Accredited laboratories',
      resultsDelivery: 'Online portal with clear explanations',
      supportEmail: 'support@tulihealth.com',
    },
    ctaText: 'Order your Tuli Health test today for affordable, convenient health testing. Get reliable results with clear, actionable insights.',
    ctaButtonText: 'Book with Tuli Health',
    aboutText: 'health test with flexible collection options. All tests are processed in accredited laboratories with clear, easy-to-understand results.',
    canonicalBase: 'https://myhealthcheckup.co.uk/tuli-health',
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
};

export const getProviderConfig = (providerId: string): ProviderConfig | undefined => {
  return providerConfigs[providerId];
};
