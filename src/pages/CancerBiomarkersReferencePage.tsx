import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Shield, Activity, Heart, Target, AlertTriangle, Microscope, 
  Info, Users, Clock, Beaker, BookOpen, ExternalLink 
} from "lucide-react";
import { CancerScreeningDisclaimer } from "@/components/compliance/CancerScreeningDisclaimer";
import HeroSection from "@/components/sections/HeroSection";

const biomarkerData = [
  {
    id: "psa",
    name: "PSA (Prostate-Specific Antigen)",
    shortName: "PSA",
    icon: Activity,
    cancerTypes: ["Prostate Cancer"],
    category: "Men's Health",
    description: "A protein produced by the prostate gland. Elevated levels may indicate prostate cancer, benign prostatic hyperplasia (BPH), or prostatitis.",
    whatItMeasures: "PSA tests measure the concentration of prostate-specific antigen in the blood, typically reported in nanograms per millilitre (ng/mL).",
    normalRange: "Generally below 4 ng/mL, though this varies by age. Men over 70 may have slightly higher normal values.",
    clinicalSignificance: [
      "Elevated PSA levels can indicate prostate cancer but are not diagnostic on their own",
      "PSA velocity (rate of change) and PSA density help differentiate between cancer and benign conditions",
      "Free PSA percentage helps distinguish between cancer and BPH",
      "Regular monitoring is recommended for men over 50, or earlier with family history"
    ],
    limitations: [
      "Elevated PSA doesn't always mean cancer—BPH, prostatitis, and recent ejaculation can raise levels",
      "Some prostate cancers don't cause elevated PSA",
      "False positives can lead to unnecessary biopsies"
    ],
    whoShouldConsider: ["Men aged 50+", "Men with family history of prostate cancer", "Men experiencing urinary symptoms", "Men of African-Caribbean descent (higher risk)"],
    variants: ["PSA Total", "PSA Free", "PSA Ratio", "PSA Density"]
  },
  {
    id: "ca125",
    name: "CA-125 (Cancer Antigen 125)",
    shortName: "CA-125",
    icon: Heart,
    cancerTypes: ["Ovarian Cancer", "Fallopian Tube Cancer", "Peritoneal Cancer"],
    category: "Women's Health",
    description: "A protein found on the surface of ovarian cancer cells and some normal tissue. Elevated levels may suggest ovarian cancer or other conditions.",
    whatItMeasures: "CA-125 tests measure the concentration of this glycoprotein in blood, reported in units per millilitre (U/mL).",
    normalRange: "Generally below 35 U/mL in most laboratories.",
    clinicalSignificance: [
      "Primarily used to monitor ovarian cancer treatment response",
      "Can help detect recurrence in women previously treated for ovarian cancer",
      "Combined with transvaginal ultrasound for ovarian cancer screening in high-risk women",
      "May be elevated in other cancers including endometrial, fallopian tube, and peritoneal"
    ],
    limitations: [
      "Not recommended for routine screening in average-risk women",
      "Can be elevated in benign conditions: endometriosis, fibroids, pregnancy, menstruation",
      "Normal CA-125 doesn't rule out ovarian cancer",
      "Less effective in early-stage detection"
    ],
    whoShouldConsider: ["Women with BRCA1/BRCA2 mutations", "Women with family history of ovarian cancer", "Women being monitored after ovarian cancer treatment", "Postmenopausal women with pelvic masses"],
    variants: ["CA-125", "HE4 (Human Epididymis Protein 4)", "ROMA Score"]
  },
  {
    id: "cea",
    name: "CEA (Carcinoembryonic Antigen)",
    shortName: "CEA",
    icon: Target,
    cancerTypes: ["Colorectal Cancer", "Lung Cancer", "Breast Cancer", "Pancreatic Cancer"],
    category: "General Cancer Marker",
    description: "A protein involved in cell adhesion that can be elevated in various cancers. Originally thought to be specific to colon cancer but found in multiple cancer types.",
    whatItMeasures: "CEA blood tests measure the concentration of this antigen, typically reported in nanograms per millilitre (ng/mL).",
    normalRange: "Generally below 3 ng/mL in non-smokers; slightly higher (up to 5 ng/mL) in smokers.",
    clinicalSignificance: [
      "Primary use is monitoring colorectal cancer treatment and detecting recurrence",
      "Pre-surgical CEA levels can help predict prognosis",
      "Rising CEA after treatment may indicate recurrence before symptoms appear",
      "Used alongside imaging to guide treatment decisions"
    ],
    limitations: [
      "Not specific to any single cancer type",
      "Can be elevated in non-cancerous conditions: liver disease, inflammatory bowel disease, smoking",
      "Not recommended for screening in asymptomatic individuals",
      "Some cancers don't produce elevated CEA"
    ],
    whoShouldConsider: ["Patients with diagnosed colorectal cancer", "Those being monitored post-cancer treatment", "Individuals with unexplained symptoms and suspected malignancy"],
    variants: ["CEA", "CA 19-9 (often paired for GI cancers)"]
  },
  {
    id: "afp",
    name: "AFP (Alpha-Fetoprotein)",
    shortName: "AFP",
    icon: AlertTriangle,
    cancerTypes: ["Liver Cancer (Hepatocellular Carcinoma)", "Testicular Cancer", "Ovarian Germ Cell Tumours"],
    category: "Liver & Reproductive",
    description: "A protein normally produced by the foetal liver and yolk sac. In adults, elevated levels may indicate liver cancer or certain germ cell tumours.",
    whatItMeasures: "AFP blood tests measure the concentration of alpha-fetoprotein, reported in nanograms per millilitre (ng/mL) or international units per millilitre (IU/mL).",
    normalRange: "Generally below 10 ng/mL in non-pregnant adults.",
    clinicalSignificance: [
      "Key marker for hepatocellular carcinoma (HCC) surveillance in high-risk patients",
      "Important for monitoring testicular cancer treatment response",
      "Combined with hCG and LDH for testicular cancer staging",
      "Used to screen high-risk populations for liver cancer"
    ],
    limitations: [
      "Can be elevated in non-cancerous liver conditions: hepatitis, cirrhosis",
      "Normal during pregnancy (produced by foetus)",
      "Some liver cancers don't produce elevated AFP",
      "Sensitivity varies depending on tumour size and type"
    ],
    whoShouldConsider: ["Patients with chronic hepatitis B or C", "Those with cirrhosis", "Men with testicular masses or suspected testicular cancer", "Patients being monitored after germ cell tumour treatment"],
    variants: ["AFP", "AFP-L3 (more specific for HCC)"]
  },
  {
    id: "ca19-9",
    name: "CA 19-9 (Carbohydrate Antigen 19-9)",
    shortName: "CA 19-9",
    icon: Beaker,
    cancerTypes: ["Pancreatic Cancer", "Bile Duct Cancer", "Stomach Cancer"],
    category: "Gastrointestinal",
    description: "A carbohydrate tumour marker primarily associated with pancreatic and biliary tract cancers. Useful for monitoring treatment response.",
    whatItMeasures: "CA 19-9 tests measure the concentration of this carbohydrate antigen in blood, reported in units per millilitre (U/mL).",
    normalRange: "Generally below 37 U/mL in most laboratories.",
    clinicalSignificance: [
      "Most useful for monitoring pancreatic cancer treatment",
      "Elevated levels correlate with tumour burden",
      "Can help predict prognosis in pancreatic cancer",
      "Declining levels during treatment suggest positive response"
    ],
    limitations: [
      "Not recommended for screening asymptomatic individuals",
      "Can be elevated in benign conditions: pancreatitis, biliary obstruction, liver disease",
      "About 5-10% of population cannot produce CA 19-9 (Lewis antigen negative)",
      "Not elevated in all pancreatic cancers"
    ],
    whoShouldConsider: ["Patients with diagnosed pancreatic cancer", "Those being monitored after pancreatic surgery", "Patients with biliary tract cancer under treatment"],
    variants: ["CA 19-9"]
  },
  {
    id: "ca15-3",
    name: "CA 15-3 (Cancer Antigen 15-3)",
    shortName: "CA 15-3",
    icon: Heart,
    cancerTypes: ["Breast Cancer"],
    category: "Women's Health",
    description: "A glycoprotein shed from breast cancer cells. Primarily used for monitoring metastatic breast cancer treatment rather than early detection.",
    whatItMeasures: "CA 15-3 tests measure the concentration of this tumour-associated antigen, reported in units per millilitre (U/mL).",
    normalRange: "Generally below 30 U/mL in most laboratories.",
    clinicalSignificance: [
      "Most useful for monitoring metastatic breast cancer treatment",
      "Rising levels may indicate disease progression",
      "Can help assess treatment effectiveness",
      "Sometimes used alongside CA 27.29 (similar marker)"
    ],
    limitations: [
      "Not recommended for early breast cancer detection",
      "Can be elevated in non-breast cancers and benign conditions",
      "Not all breast cancers produce elevated CA 15-3",
      "Levels may not correlate with disease extent in early stages"
    ],
    whoShouldConsider: ["Patients with metastatic breast cancer", "Those being monitored during systemic therapy", "Women with recurrent breast cancer"],
    variants: ["CA 15-3", "CA 27.29 (similar marker)"]
  },
  {
    id: "fit",
    name: "FIT (Faecal Immunochemical Test)",
    shortName: "FIT",
    icon: Target,
    cancerTypes: ["Colorectal Cancer", "Bowel Polyps"],
    category: "Bowel Health",
    description: "A stool-based test that detects hidden blood in faeces, which can be an early sign of bowel cancer or pre-cancerous polyps.",
    whatItMeasures: "FIT detects human haemoglobin (blood) in stool samples using antibodies specific to human blood.",
    normalRange: "A negative result indicates no significant blood detected. Positive threshold varies by laboratory.",
    clinicalSignificance: [
      "Highly effective for population-based bowel cancer screening",
      "Can detect bowel cancer at early, treatable stages",
      "More specific than older guaiac-based tests",
      "Part of the NHS Bowel Cancer Screening Programme"
    ],
    limitations: [
      "Detects blood, not cancer directly—positive results require colonoscopy",
      "Can miss cancers that don't bleed at the time of testing",
      "Not 100% sensitive—regular repeat testing improves detection",
      "Does not detect all polyps"
    ],
    whoShouldConsider: ["Adults aged 45+ (screening)", "Those with family history of bowel cancer", "Anyone with unexplained changes in bowel habits", "People with rectal bleeding or unexplained anaemia"],
    variants: ["FIT", "Quantitative FIT (qFIT)"]
  }
];

const CancerBiomarkersReferencePage = () => {
  return (
    <>
      <Helmet>
        <title>Cancer Biomarkers Reference Library | Tumour Markers Explained | myhealth checkup</title>
        <meta 
          name="description" 
          content="Comprehensive guide to cancer biomarkers and tumour markers. Learn what PSA, CA-125, CEA, AFP and other markers measure, their clinical significance, and limitations." 
        />
        <meta 
          name="keywords" 
          content="cancer biomarkers, tumour markers, PSA test, CA-125, CEA, AFP, CA 19-9, cancer screening markers, blood test cancer markers" 
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/cancer-biomarkers-reference" />
      </Helmet>
      
      
      <Header />
      
      <main className="min-h-screen bg-background">
        <HeroSection
          title="Cancer Biomarkers Reference Library"
          subtitle="A comprehensive guide to understanding tumour markers, what they measure, and their role in cancer screening and monitoring."
        >
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 absolute top-4 left-1/2 -translate-x-1/2 hidden">
            <BookOpen className="h-4 w-4 mr-1" />
            Educational Resource
          </Badge>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/cancer-screening-compare">Compare Cancer Tests</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/cancer-screening">View Cancer Screening</Link>
            </Button>
          </div>
        </HeroSection>

        {/* Disclaimer */}
        <div className="container mx-auto px-4 py-6">
          <CancerScreeningDisclaimer variant="full" />
        </div>

        {/* Introduction */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="py-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Understanding Tumour Markers</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Tumour markers are substances—usually proteins—produced by cancer cells or by the body 
                        in response to cancer. They can be found in blood, urine, or tissue samples. While tumour 
                        markers can be helpful in detecting, diagnosing, and monitoring cancer, they are rarely 
                        definitive on their own and should always be interpreted alongside other diagnostic tests 
                        and clinical examination by a qualified healthcare professional.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Biomarker Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-8">
              {biomarkerData.map((marker) => {
                const IconComponent = marker.icon;
                return (
                  <Card key={marker.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#e70d69] text-white">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{marker.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {marker.category}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {marker.cancerTypes.map((type, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground mb-6">
                        {marker.description}
                      </p>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="measures">
                          <AccordionTrigger className="text-sm font-medium">
                            <span className="flex items-center gap-2">
                              <Beaker className="h-4 w-4 text-primary" />
                              What It Measures
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-muted-foreground">{marker.whatItMeasures}</p>
                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                              <p className="text-xs font-medium">Normal Range:</p>
                              <p className="text-sm">{marker.normalRange}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="significance">
                          <AccordionTrigger className="text-sm font-medium">
                            <span className="flex items-center gap-2">
                              <Microscope className="h-4 w-4 text-primary" />
                              Clinical Significance
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {marker.clinicalSignificance.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="text-primary mt-1">•</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="limitations">
                          <AccordionTrigger className="text-sm font-medium">
                            <span className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              Important Limitations
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {marker.limitations.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="text-amber-500 mt-1">•</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="who">
                          <AccordionTrigger className="text-sm font-medium">
                            <span className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              Who Should Consider This Test
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-wrap gap-2">
                              {marker.whoShouldConsider.map((group, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {marker.variants.length > 1 && (
                          <AccordionItem value="variants">
                            <AccordionTrigger className="text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                Test Variants
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-wrap gap-2">
                                {marker.variants.map((variant, idx) => (
                                  <Badge key={idx} className="bg-primary/10 text-primary border-primary/20">
                                    {variant}
                                  </Badge>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>

                      <div className="mt-6 pt-4 border-t flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/cancer-screening-compare?type=${marker.id === 'psa' ? 'prostate' : marker.id === 'ca125' ? 'ovarian' : marker.id === 'fit' ? 'bowel' : marker.id === 'ca15-3' ? 'breast' : 'multi'}`}>
                            Compare {marker.shortName} Tests
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Points Summary */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-heading font-bold text-center mb-8">
                Key Points to Remember
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Markers Are Not Diagnostic
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      A positive tumour marker result does not mean you have cancer. Similarly, 
                      a negative result does not guarantee you are cancer-free. Results must be 
                      interpreted by healthcare professionals alongside other tests.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Monitoring Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Tumour markers are often most useful when tracked over time. Changes in 
                      marker levels (rising or falling) can provide important information about 
                      disease progression or treatment response.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      False Positives & Negatives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Many factors can affect tumour marker levels, including benign conditions, 
                      medications, and laboratory variations. This is why clinical context is 
                      essential for accurate interpretation.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Consult Healthcare Professionals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Always discuss your results with a qualified healthcare professional who 
                      can consider your complete medical history, symptoms, and other test results 
                      to provide appropriate guidance.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-[#081129]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                Ready to Compare Cancer Screening Tests?
              </h2>
              <p className="text-white/80 mb-6">
                Compare cancer screening tests from trusted UK providers. Find the right test 
                for your needs with transparent pricing and clear biomarker information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <Link to="/cancer-screening-compare">Compare Cancer Tests</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/find-clinic">Find a Clinic</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* NHS Resources */}
        <section className="py-8 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-muted-foreground mb-4">
                For official NHS guidance on cancer screening programmes:
              </p>
              <Button variant="link" className="text-primary" asChild>
                <a 
                  href="https://www.nhs.uk/conditions/cancer/screening/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit NHS Cancer Screening Information
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default CancerBiomarkersReferencePage;
