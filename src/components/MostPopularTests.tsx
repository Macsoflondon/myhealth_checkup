import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Star, TrendingUp, Award, Users } from 'lucide-react';
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
      <div className="bg-[#1a365d] text-white p-3 sm:p-4 text-center">
        <h3 className="text-xs sm:text-sm font-medium">{category}</h3>
      </div>
      
      <CardContent className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{name}</h4>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-1">{description}</p>
        
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-600">{turnaround}</p>
          <p className="text-xs sm:text-sm text-gray-600">{biomarkers}</p>
          
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
            <span className="text-xs sm:text-sm text-gray-600 ml-1">({reviews})</span>
          </div>
        </div>
        
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">{price}</div>
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{collection}</p>
        
        <Button onClick={handleSelectTest} variant="outline" className="w-full py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 border-gray-300 hover:bg-gray-50 mt-auto">
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
  return <>
      {/* Hero Section */}
      <section className="bg-[#081129] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Most Popular Tests</h1>
            <p className="text-xl text-white max-w-2xl mx-auto mb-8">
              Check out our best-selling tests, trusted by thousands of people across the UK for comprehensive health screening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-health-heading" onClick={() => navigate('/compare')}>
                Browse All Tests
              </Button>
              <Button size="lg" className="bg-[#22C0D4] text-white hover:bg-[#E70D69]" onClick={() => navigate('/find-clinic')}>
                Find a Clinic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 my-[10px] py-[10px] bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#081129] my-[20px] mb-12">
              Why Choose Popular Tests?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Proven Track Record</h3>
                <p className="text-muted-foreground">
                  Tests chosen by thousands of satisfied customers for reliable health insights
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  Our most popular tests cover the widest range of essential health markers
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Community Trust</h3>
                <p className="text-muted-foreground">
                  Join thousands who trust these tests for their health monitoring needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section className="bg-white/[0.31] py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">

        <div className="flex justify-end mb-4 sm:mb-6">
          <select className="px-3 sm:px-4 md:px-14 py-2 border border-gray-300 rounded-md text-xs sm:text-sm bg-[#e70d69] text-white">
            <option>Price, high to low</option>
            <option>Price, low to high</option>
            <option>Most popular</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {popularTests.map(test => <TestCard key={test.id} {...test} />)}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Button onClick={() => navigate('/compare')} className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-medium rounded-full w-full sm:w-auto">
            View all tests
          </Button>
        </div>
      </div>
    </section>
    </>;
};
export default MostPopularTests;