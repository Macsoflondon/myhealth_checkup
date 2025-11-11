import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Shield, Activity, Heart } from 'lucide-react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollFadeIn from '@/components/common/ScrollFadeIn';

interface TestCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  turnaround: string;
  biomarkers: string;
  rating: number;
  reviews: number;
  collection: string;
}

const TestCard = ({ id, name, description, price, turnaround, biomarkers, rating, reviews, collection }: TestCardProps) => {
  const navigate = useNavigate();
  
  const handleSelectTest = () => {
    navigate(`/compare?test=${id}`);
  };

  return (
    <Card className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        <h4 className="text-xl font-bold text-gray-900 mb-3">{name}</h4>
        <p className="text-gray-600 text-sm mb-4 flex-1">{description}</p>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">{turnaround}</p>
          <p className="text-sm text-gray-600">{biomarkers}</p>
          
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-600 ml-1">({reviews})</span>
          </div>
        </div>
        
        <div className="text-2xl font-bold text-gray-900 mb-2">{price}</div>
        <p className="text-sm text-gray-500 mb-4">{collection}</p>
        
        <Button
          onClick={handleSelectTest}
          variant="outline"
          className="w-full py-3 text-gray-700 border-gray-300 hover:bg-gray-50 mt-auto"
        >
          Select test
        </Button>
      </CardContent>
    </Card>
  );
};

const FertilityTestsPage = () => {
  const navigate = useNavigate();

  const fertilityTests = [
    {
      id: 'prenatal-paternity',
      name: 'Prenatal Paternity Test',
      description: 'Non-invasive prenatal paternity test using cell-free fetal DNA from a simple blood sample. Accurate results from 8 weeks of pregnancy.',
      price: '£399.00',
      turnaround: 'Results estimated in 7-10 working days',
      biomarkers: '1 result (paternity confirmation)',
      rating: 4.9,
      reviews: 67,
      collection: 'Venous blood collection'
    },
    {
      id: 'gender-reveal',
      name: 'Gender Reveal Blood Test',
      description: 'Early gender determination from 8 weeks pregnancy. Non-invasive test analyzing fetal DNA in maternal blood to reveal your baby\'s sex.',
      price: '£79.00',
      turnaround: 'Results estimated in 3-5 working days',
      biomarkers: '1 result (gender determination)',
      rating: 4.8,
      reviews: 342,
      collection: 'Venous blood collection'
    },
    {
      id: 'prenatalsafe-3',
      name: 'PrenatalSAFE 3 NIPT Blood Test',
      description: 'Non-invasive prenatal test screening for the 3 most common trisomies: Down syndrome (T21), Edwards syndrome (T18), and Patau syndrome (T13).',
      price: '£349.00',
      turnaround: 'Results estimated in 7-10 working days',
      biomarkers: '3 chromosome conditions',
      rating: 5.0,
      reviews: 128,
      collection: 'Venous blood collection'
    },
    {
      id: 'prenatalsafe-5',
      name: 'PrenatalSAFE 5 NIPT Blood Test',
      description: 'Extended NIPT screening covering 5 chromosome conditions including common trisomies plus sex chromosome aneuploidies.',
      price: '£449.00',
      turnaround: 'Results estimated in 7-10 working days',
      biomarkers: '5 chromosome conditions',
      rating: 4.9,
      reviews: 94,
      collection: 'Venous blood collection'
    },
    {
      id: 'prenatalsafe-karyo',
      name: 'PrenatalSAFE Karyo NIPT Blood Test',
      description: 'Comprehensive chromosomal analysis screening all 23 chromosome pairs for numerical abnormalities. Most detailed NIPT available.',
      price: '£599.00',
      turnaround: 'Results estimated in 10-14 working days',
      biomarkers: '23 chromosome pairs',
      rating: 5.0,
      reviews: 56,
      collection: 'Venous blood collection'
    },
    {
      id: 'prenatalsafe-karyo-plus',
      name: 'PrenatalSAFE Karyo Plus NIPT Blood Test',
      description: 'Advanced karyotype screening plus microdeletion syndromes. Screens all chromosomes and 9 common genetic microdeletion conditions.',
      price: '£699.00',
      turnaround: 'Results estimated in 10-14 working days',
      biomarkers: '23 chromosomes + 9 microdeletions',
      rating: 5.0,
      reviews: 41,
      collection: 'Venous blood collection'
    },
    {
      id: 'prenatalsafe-complete-plus',
      name: 'PrenatalSAFE Complete Plus NIPT Blood Test',
      description: 'Most comprehensive NIPT available. Complete chromosome screening, microdeletions, and genetic syndrome panel with genetic counseling.',
      price: '£799.00',
      turnaround: 'Results estimated in 10-14 working days',
      biomarkers: '23 chromosomes + 20+ conditions',
      rating: 5.0,
      reviews: 32,
      collection: 'Venous blood collection'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-[#081129] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Prenatal & Pregnancy Testing</h1>
            <p className="text-xl text-white max-w-2xl mx-auto mb-8">
              Non-invasive prenatal testing (NIPT) for expectant parents. Screen for chromosomal conditions, determine gender early, or confirm paternity safely during pregnancy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/compare?category=fertility" className="flex-1 sm:flex-initial">
                <Button 
                  size="lg" 
                  className="w-full bg-primary text-primary-foreground hover:bg-health-heading"
                >
                  Browse All Fertility Tests
                </Button>
              </Link>
              <Link to="/find-clinic" className="flex-1 sm:flex-initial">
                <Button 
                  size="lg" 
                  className="w-full bg-[#22C0D4] text-white hover:bg-[#E70D69]"
                >
                  Find a Clinic
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#081129] my-[20px] mb-12">
              Why Choose Prenatal Testing?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Safe & Non-Invasive</h3>
                <p className="text-muted-foreground">
                  Simple blood tests with no risk to mother or baby, available from 8 weeks
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Accurate Results</h3>
                <p className="text-muted-foreground">
                  Advanced DNA technology providing highly accurate screening results
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Peace of Mind</h3>
                <p className="text-muted-foreground">
                  Early insights into your baby's health to help you prepare with confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-8 bg-white/[0.31]">
        <div className="flex justify-end mb-6">
          <select className="px-4 py-2 border border-border rounded-md text-sm bg-background text-foreground">
            <option>Featured</option>
            <option>Price, low to high</option>
            <option>Price, high to low</option>
            <option>Most popular</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fertilityTests.map((test) => (
            <TestCard key={test.id} {...test} />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <ScrollFadeIn>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 text-[#081129]">
                  Ready to Start Your Pregnancy Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Compare prenatal tests from trusted UK providers or find a clinic near you
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/compare?category=fertility" className="flex-1 sm:flex-initial">
                    <Button 
                      size="lg" 
                      className="w-full bg-primary text-primary-foreground hover:bg-health-heading"
                    >
                      Browse All Fertility Tests
                    </Button>
                  </Link>
                  <Link to="/find-clinic" className="flex-1 sm:flex-initial">
                    <Button 
                      size="lg" 
                      className="w-full bg-[#22C0D4] text-white hover:bg-[#E70D69]"
                    >
                      Find a Clinic
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FertilityTestsPage;