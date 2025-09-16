import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      id: 'male-fertility-sperm',
      name: 'Male Fertility Sperm Test',
      description: 'Are you planning to have children and want to make sure your sperm and hormone levels are normal? Perhaps you and your...',
      price: '£209.00',
      turnaround: 'Results estimated in 2 working days',
      biomarkers: '23 biomarkers',
      rating: 5.0,
      reviews: 1,
      collection: 'Finger-prick or Venous collection'
    },
    {
      id: 'advanced-male-fertility',
      name: 'Advanced Male Fertility Hormone Blood Test',
      description: 'Have you and your partner been trying to conceive for a while? With our Advanced Male Fertility Hormon...',
      price: '£72.00',
      turnaround: 'Results estimated in 2 working days',
      biomarkers: '7 biomarkers',
      rating: 4.5,
      reviews: 14,
      collection: 'Finger-prick or Venous collection'
    },
    {
      id: 'zika-antibodies',
      name: 'Zika Virus Antibodies Blood Test (Flavivirus)',
      description: 'Recently travelled to a Zika-affected area or planning pregnancy? This test detects Zika virus IgM and IgG antibodies, helping...',
      price: '£189.00',
      turnaround: 'Results estimated in 14 working days',
      biomarkers: '2 biomarkers',
      rating: 5.0,
      reviews: 3,
      collection: 'Venous collection'
    },
    {
      id: 'erectile-dysfunction',
      name: 'Erectile Dysfunction Blood Test',
      description: 'Investigate the potential causes of erectile dysfunction with hormone and health markers that could be affecting your sexual health',
      price: '£99.00',
      turnaround: 'Results estimated in 3 working days',
      biomarkers: '12 biomarkers',
      rating: 4.6,
      reviews: 28,
      collection: 'Finger-prick or Venous collection'
    },
    {
      id: 'chlamydia-gonorrhoea',
      name: 'Chlamydia and Gonorrhoea Urine Test',
      description: 'Have no symptoms but want a quick and private screening for chlamydia and gonorrhoea? Our discreet postal urine test',
      price: '£59.00',
      turnaround: 'Results estimated in 2 working days',
      biomarkers: '2 biomarkers',
      rating: 4.8,
      reviews: 156,
      collection: 'Urine collection'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <span className="cursor-pointer hover:text-[#E91E63]" onClick={() => navigate('/')}>Home</span> 
            <span className="mx-2">/</span> 
            <span>Male Fertility Blood Tests</span>
          </nav>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Male Fertility Blood Tests</h1>
          <p className="text-lg text-gray-600">Our male fertility tests were created by award winning fertility nurse and consultant, Kate Davies. Test a range of factors from hormone levels to sexual health.</p>
        </div>

        <div className="flex justify-end mb-6">
          <select className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default FertilityTestsPage;