import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Activity, Users, Baby, Flower2, Stethoscope, Target, Moon } from 'lucide-react';
const getCategoryColor = (category: string) => {
  const colorMap: {
    [key: string]: string;
  } = {
    "Complete Health": "bg-red-500 text-white",
    // Red like Blood Tests
    "Women's Wellness": "bg-pink-500 text-white",
    // Pink like Hormone Tests  
    "Menopause Health": "bg-purple-600 text-white",
    // Purple for menopause
    "Hormone Health": "bg-pink-600 text-white",
    // Magenta like Hormone Tests
    "Fertility Health": "bg-green-500 text-white",
    // Green like Thyroid Tests
    "Pregnancy Health": "bg-rose-400 text-white",
    // Light pink for pregnancy
    "PCOS Health": "bg-orange-500 text-white" // Orange like Diabetes Testing
  };
  return colorMap[category] || "bg-gray-500 text-white";
};
const getCategoryBorderColor = (category: string) => {
  const borderColorMap: {
    [key: string]: string;
  } = {
    "Complete Health": "border-red-500",
    // Red like Blood Tests
    "Women's Wellness": "border-pink-500",
    // Pink like Hormone Tests  
    "Menopause Health": "border-purple-600",
    // Purple for menopause
    "Hormone Health": "border-pink-600",
    // Magenta like Hormone Tests
    "Fertility Health": "border-green-500",
    // Green like Thyroid Tests
    "Pregnancy Health": "border-rose-400",
    // Light pink for pregnancy
    "PCOS Health": "border-orange-500" // Orange like Diabetes Testing
  };
  return borderColorMap[category] || "border-gray-500";
};
const getCategoryButtonColor = (category: string) => {
  const buttonColorMap: {
    [key: string]: string;
  } = {
    "Complete Health": "bg-red-500 hover:bg-red-600",
    // Red like Blood Tests
    "Women's Wellness": "bg-pink-500 hover:bg-pink-600",
    // Pink like Hormone Tests  
    "Menopause Health": "bg-purple-600 hover:bg-purple-700",
    // Purple for menopause
    "Hormone Health": "bg-pink-600 hover:bg-pink-700",
    // Magenta like Hormone Tests
    "Fertility Health": "bg-green-500 hover:bg-green-600",
    // Green like Thyroid Tests
    "Pregnancy Health": "bg-rose-400 hover:bg-rose-500",
    // Light pink for pregnancy
    "PCOS Health": "bg-orange-500 hover:bg-orange-600" // Orange like Diabetes Testing
  };
  return buttonColorMap[category] || "bg-gray-500 hover:bg-gray-600";
};
const WomensHealthPage = () => {
  const {
    t
  } = useTranslation();
  const womensHealthTests = [{
    id: "premium-complete-blood-women",
    name: t('womensHealth.tests.premiumComplete.name'),
    description: t('womensHealth.tests.premiumComplete.description'),
    icon: Stethoscope,
    category: t('womensHealth.tests.premiumComplete.category'),
    price: t('womensHealth.tests.premiumComplete.price'),
    biomarkers: t('womensHealth.tests.premiumComplete.biomarkers', {
      returnObjects: true
    }) as string[],
    suitableFor: t('womensHealth.tests.premiumComplete.suitableFor', {
      returnObjects: true
    }) as string[],
    turnaround: t('womensHealth.tests.premiumComplete.turnaround')
  }, {
    id: "advanced-well-woman",
    name: t('womensHealth.tests.advancedWellWoman.name'),
    description: t('womensHealth.tests.advancedWellWoman.description'),
    icon: Shield,
    category: t('womensHealth.tests.advancedWellWoman.category'),
    price: t('womensHealth.tests.advancedWellWoman.price'),
    biomarkers: t('womensHealth.tests.advancedWellWoman.biomarkers', {
      returnObjects: true
    }) as string[],
    suitableFor: t('womensHealth.tests.advancedWellWoman.suitableFor', {
      returnObjects: true
    }) as string[],
    turnaround: t('womensHealth.tests.advancedWellWoman.turnaround')
  }, {
    id: "menopause-blood-test",
    name: t('womensHealth.tests.menopause.name'),
    description: t('womensHealth.tests.menopause.description'),
    icon: Moon,
    category: t('womensHealth.tests.menopause.category'),
    price: t('womensHealth.tests.menopause.price'),
    biomarkers: t('womensHealth.tests.menopause.biomarkers', {
      returnObjects: true
    }) as string[],
    suitableFor: t('womensHealth.tests.menopause.suitableFor', {
      returnObjects: true
    }) as string[],
    turnaround: t('womensHealth.tests.menopause.turnaround')
  }, {
    id: "female-hormones",
    name: t('womensHealth.tests.femaleHormones.name'),
    description: t('womensHealth.tests.femaleHormones.description'),
    icon: Flower2,
    category: t('womensHealth.tests.femaleHormones.category'),
    price: t('womensHealth.tests.femaleHormones.price'),
    biomarkers: t('womensHealth.tests.femaleHormones.biomarkers', {
      returnObjects: true
    }) as string[],
    suitableFor: t('womensHealth.tests.femaleHormones.suitableFor', {
      returnObjects: true
    }) as string[],
    turnaround: t('womensHealth.tests.femaleHormones.turnaround')
  }, {
    id: "amh-fertility",
    name: t('womensHealth.tests.amhFertility.name'),
    description: t('womensHealth.tests.amhFertility.description'),
    icon: Baby,
    category: t('womensHealth.tests.amhFertility.category'),
    price: t('womensHealth.tests.amhFertility.price'),
    biomarkers: t('womensHealth.tests.amhFertility.biomarkers', {
      returnObjects: true
    }) as string[],
    suitableFor: t('womensHealth.tests.amhFertility.suitableFor', {
      returnObjects: true
    }) as string[],
    turnaround: t('womensHealth.tests.amhFertility.turnaround')
  }, {
    id: "pregnancy-blood-test",
    name: t('womensHealth.tests.pregnancy.name'),
    description: t('womensHealth.tests.pregnancy.description'),
    icon: Heart,
    category: t('womensHealth.tests.pregnancy.category'),
    price: t('womensHealth.tests.pregnancy.price'),
    biomarkers: t('womensHealth.tests.pregnancy.biomarkers', {
      returnObjects: true
    }) as string[],
    suitableFor: t('womensHealth.tests.pregnancy.suitableFor', {
      returnObjects: true
    }) as string[],
    turnaround: t('womensHealth.tests.pregnancy.turnaround')
  }, {
    id: "pcos-blood-test",
    name: t('womensHealth.tests.pcos.name'),
    description: t('womensHealth.tests.pcos.description'),
    icon: Target,
    category: t('womensHealth.tests.pcos.category'),
    price: t('womensHealth.tests.pcos.price'),
    biomarkers: t('womensHealth.tests.pcos.biomarkers', {
      returnObjects: true
    }) as string[],
    suitableFor: t('womensHealth.tests.pcos.suitableFor', {
      returnObjects: true
    }) as string[],
    turnaround: t('womensHealth.tests.pcos.turnaround')
  }];
  const healthConcerns = [{
    name: t('womensHealth.healthConcerns.irregularPeriods.name'),
    description: t('womensHealth.healthConcerns.irregularPeriods.description'),
    symptoms: t('womensHealth.healthConcerns.irregularPeriods.symptoms', {
      returnObjects: true
    }) as string[],
    recommendedTest: t('womensHealth.healthConcerns.irregularPeriods.recommendedTest')
  }, {
    name: t('womensHealth.healthConcerns.menopauseSymptoms.name'),
    description: t('womensHealth.healthConcerns.menopauseSymptoms.description'),
    symptoms: t('womensHealth.healthConcerns.menopauseSymptoms.symptoms', {
      returnObjects: true
    }) as string[],
    recommendedTest: t('womensHealth.healthConcerns.menopauseSymptoms.recommendedTest')
  }, {
    name: t('womensHealth.healthConcerns.pcosSymptoms.name'),
    description: t('womensHealth.healthConcerns.pcosSymptoms.description'),
    symptoms: t('womensHealth.healthConcerns.pcosSymptoms.symptoms', {
      returnObjects: true
    }) as string[],
    recommendedTest: t('womensHealth.healthConcerns.pcosSymptoms.recommendedTest')
  }, {
    name: t('womensHealth.healthConcerns.fertilityPlanning.name'),
    description: t('womensHealth.healthConcerns.fertilityPlanning.description'),
    symptoms: t('womensHealth.healthConcerns.fertilityPlanning.symptoms', {
      returnObjects: true
    }) as string[],
    recommendedTest: t('womensHealth.healthConcerns.fertilityPlanning.recommendedTest')
  }];
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{t('womensHealth.pageTitle')}</title>
        <meta name="description" content={t('womensHealth.metaDescription')} />
        <meta name="keywords" content={t('womensHealth.metaKeywords')} />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/womens-health" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={t('womensHealth.ogTitle')} />
        <meta property="og:description" content={t('womensHealth.ogDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/womens-health" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('womensHealth.twitterTitle')} />
        <meta name="twitter:description" content={t('womensHealth.twitterDescription')} />
      </Helmet>
      
      <Header />
      <main className="flex-grow bg-background">
        {/* Health Concerns */}
        <section className="py-16 bg-[#081129]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('womensHealth.healthConcernsTitle')}
                </h2>
                <p className="text-lg text-gray-300">
                  {t('womensHealth.healthConcernsSubtitle')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {healthConcerns.map((concern, index) => <Card key={index} className="border-gray-600 bg-white/10 backdrop-blur-sm shadow-lg shadow-white/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">{concern.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-300">
                        {concern.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-white">{t('womensHealth.commonSymptoms')}</h4>
                        <div className="flex flex-wrap gap-1">
                          {concern.symptoms.map((symptom, idx) => <Badge key={idx} variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                              {symptom}
                            </Badge>)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-white">{t('womensHealth.recommendedTest')}</h4>
                        <p className="text-sm text-pink-300 font-medium">{concern.recommendedTest}</p>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-12 text-[#e70d69]">
                {t('womensHealth.benefitsTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-white/20 bg-[#e70d69]">
                    <Heart className="h-8 w-8 text-pink-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{t('womensHealth.hormoneBenefitTitle')}</h3>
                  <p className="text-[#e70d69] font-medium">
                    {t('womensHealth.hormoneBenefitDescription')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-white/20 bg-[#e70d69]">
                    <Baby className="h-8 w-8 text-pink-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{t('womensHealth.fertilityBenefitTitle')}</h3>
                  <p className="text-[#e70d69] font-medium">
                    {t('womensHealth.fertilityBenefitDescription')}
                  </p>
                </div>
                <div className="text-center rounded-md">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-white/20 bg-[#e70d69]">
                    <Shield className="h-8 w-8 text-pink-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{t('womensHealth.preventiveBenefitTitle')}</h3>
                  <p className="text-[#e70d69] font-medium">
                    {t('womensHealth.preventiveBenefitDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default WomensHealthPage;