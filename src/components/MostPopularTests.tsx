import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
interface TestCardProps {
  id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  turnaround: string;
  biomarkers: string;
  rating: number;
  reviews: number;
  collection: string;
}
const TestCard = ({
  id,
  category,
  name,
  description,
  price,
  turnaround,
  biomarkers,
  rating,
  reviews,
  collection
}: TestCardProps) => {
  const navigate = useNavigate();
  const handleSelectTest = () => {
    navigate(`/compare?test=${id}`);
  };
  return <Card className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 h-full flex flex-col">
      <div className="bg-[#1a365d] text-white p-4 text-center">
        <h3 className="text-sm font-medium">{category}</h3>
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <h4 className="text-xl font-bold text-gray-900 mb-3">{name}</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{description}</p>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">{turnaround}</p>
          <p className="text-sm text-gray-600">{biomarkers}</p>
          
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
            <span className="text-sm text-gray-600 ml-1">({reviews})</span>
          </div>
        </div>
        
        <div className="text-2xl font-bold text-gray-900 mb-2">{price}</div>
        <p className="text-sm text-gray-500 mb-4">{collection}</p>
        
        <Button onClick={handleSelectTest} variant="outline" className="w-full py-3 text-gray-700 border-gray-300 hover:bg-gray-50 mt-auto">
          Select test
        </Button>
      </CardContent>
    </Card>;
};
const MostPopularTests = () => {
  const navigate = useNavigate();
  const popularTests = [{
    id: 'lola-core-health-45',
    category: 'Comprehensive Health Panel',
    name: 'Core Health 45 - Lola Health',
    description: '45 essential biomarkers including blood analysis, cardiovascular health, kidney function, inflammation, vitamins, liver function, thyroid function, diabetes screening, and full blood count. Includes at-home phlebotomy service and doctor-reviewed results.',
    price: '£140.00',
    turnaround: 'Results estimated in 2-4 working days',
    biomarkers: '45 biomarkers',
    rating: 4.7,
    reviews: 847,
    collection: 'At-home phlebotomy service'
  }, {
    id: 'optimal-health',
    category: 'Longevity called. It wants your blood',
    name: 'Optimal Health Blood Test',
    description: 'Unlock a deeper understanding of your health with our most comprehensive panel covering 59 biomarkers',
    price: '£249.00',
    turnaround: 'Results estimated in 4 working days',
    biomarkers: '59 biomarkers',
    rating: 4.9,
    reviews: 1542,
    collection: 'Venous collection'
  }, {
    id: 'ultimate-performance',
    category: 'Unlock your peak performance',
    name: 'Ultimate Performance Blood Test',
    description: 'Are you looking to transform your body composition and physical performance? This test analyzes key markers',
    price: '£199.00',
    turnaround: 'Results estimated in 3 working days',
    biomarkers: '57 biomarkers',
    rating: 4.8,
    reviews: 892,
    collection: 'Finger-prick or Venous collection'
  }, {
    id: 'advanced-well-woman',
    category: 'Get the answers you\'ve been looking for',
    name: 'Advanced Well Woman Blood Test',
    description: 'Take control of your health with our best-selling women\'s health test covering hormones, nutrition and more',
    price: '£159.00',
    turnaround: 'Results estimated in 3 working days',
    biomarkers: '47 biomarkers',
    rating: 4.7,
    reviews: 1234,
    collection: 'Finger-prick or Venous collection'
  }];
  return <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
             
             
            
          </nav>
          
          <h1 className="text-4xl font-bold mb-4 text-center text-[#22c0d4]" style={{
          color: '#22c0d4'
        }}>The Most Popular Tests Amongst Our Providers</h1>
          <p className="text-lg font-medium text-center text-[#081129]">Check out our best selling tests, used by thousands of people</p>
        </div>

        <div className="flex justify-end mb-6">
          <select className="px-4 border border-gray-300 rounded-md text-sm bg-[#e70d69] px-14 ">
            <option>Price, high to low</option>
            <option>Price, low to high</option>
            <option>Most popular</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTests.map(test => <TestCard key={test.id} {...test} />)}
        </div>

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/compare')} className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-8 py-3 text-lg font-medium rounded-full">
            View all tests
          </Button>
        </div>
      </div>
    </section>;
};
export default MostPopularTests;