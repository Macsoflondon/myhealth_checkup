import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';

type Step = 'welcome' | 'gender' | 'concerns' | 'results';

interface GenderOption {
  id: string;
  label: string;
}

interface ConcernOption {
  id: string;
  label: string;
}

const genderOptions: GenderOption[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'neither', label: 'Neither' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const concernOptions: ConcernOption[] = [
  { id: 'general-health', label: 'General health check' },
  { id: 'hormones', label: 'Hormones' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'fertility', label: 'Fertility' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'bowel', label: 'Bowel' },
  { id: 'prostate', label: 'Prostate' }
];

// Mock test data based on concerns
const getRecommendedTests = (concerns: string[], gender: string) => {
  const allTests = [
    {
      id: 'psa-test',
      name: 'PSA (Prostate Specific Antigen) Blood Test',
      category: 'Small test, big insights',
      description: 'Are you over 50, over 45 and of black ethnicity, or have a strong family history of prostate cancer? Our PSA Blood Test...',
      price: '£45.00',
      turnaround: 'Results estimated in 2 working days',
      biomarkers: '1 biomarkers',
      collection: 'Finger-prick or Venous collection',
      rating: 4.8,
      reviews: 217,
      relevantFor: ['prostate', 'general-health']
    },
    {
      id: 'optimal-health',
      name: 'Optimal Health Blood Test',
      category: 'Longevity called. It wants your blood',
      description: 'Unlock a deeper understanding of your health with our most comprehensive panel covering 59 biomarkers',
      price: '£249.00',
      turnaround: 'Results estimated in 4 working days',
      biomarkers: '59 biomarkers',
      collection: 'Venous collection',
      rating: 4.9,
      reviews: 1542,
      relevantFor: ['general-health', 'fitness', 'nutrition']
    },
    {
      id: 'fertility-test',
      name: 'Male Fertility Sperm Test',
      category: 'Get the answers you\'ve been looking for',
      description: 'Are you planning to have children and want to make sure your sperm and hormone levels are normal? Perhaps you and your...',
      price: '£209.00',
      turnaround: 'Results estimated in 2 working days',
      biomarkers: '23 biomarkers',
      collection: 'Finger-prick or Venous collection',
      rating: 5.0,
      reviews: 1,
      relevantFor: ['fertility']
    },
    {
      id: 'lifestyle-test',
      name: 'Health and Lifestyle Blood Test',
      category: 'Healthy habits start here',
      description: 'Do you want to know whether you are at risk of common lifestyle-related conditions? Perhaps you\'re already taking steps to...',
      price: '£89.00',
      turnaround: 'Results estimated in 3 working days',
      biomarkers: '19 biomarkers',
      collection: 'Finger-prick or Venous collection',
      rating: 4.7,
      reviews: 892,
      relevantFor: ['general-health', 'fitness', 'nutrition']
    },
    {
      id: 'thyroid-test',
      name: 'Advanced Thyroid Function Blood Test',
      category: 'Get the answers you\'ve been looking for',
      description: 'Are you experiencing symptoms like fatigue, weight changes, or mood swings? Our comprehensive thyroid test...',
      price: '£99.00',
      turnaround: 'Results estimated in 3 working days',
      biomarkers: '10 biomarkers',
      collection: 'Finger-prick or Venous collection',
      rating: 4.8,
      reviews: 634,
      relevantFor: ['thyroid', 'hormones']
    },
    {
      id: 'hormone-test',
      name: 'Male Hormone Blood Test',
      category: 'Hormonal balance check',
      description: 'Check your testosterone, cortisol, and other key hormones that affect energy, mood, and overall wellbeing...',
      price: '£129.00',
      turnaround: 'Results estimated in 3 working days',
      biomarkers: '8 biomarkers',
      collection: 'Finger-prick or Venous collection',
      rating: 4.6,
      reviews: 423,
      relevantFor: ['hormones', 'fitness']
    }
  ];

  // Filter tests based on selected concerns
  const relevantTests = allTests.filter(test => 
    concerns.some(concern => test.relevantFor.includes(concern))
  );

  // If no specific matches, return general health tests
  if (relevantTests.length === 0) {
    return allTests.filter(test => test.relevantFor.includes('general-health')).slice(0, 4);
  }

  // Return up to 4 most relevant tests
  return relevantTests.slice(0, 4);
};

export const AssistedTestFinder = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setCurrentStep('gender');
  };

  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('concerns');
    } else if (currentStep === 'concerns') {
      setCurrentStep('gender');
    } else if (currentStep === 'gender') {
      setCurrentStep('welcome');
    }
  };

  const handleRestart = () => {
    setCurrentStep('welcome');
    setSelectedGender('');
    setSelectedConcerns([]);
  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setCurrentStep('concerns');
  };

  const handleConcernSelect = (concernId: string) => {
    setSelectedConcerns(prev => {
      if (prev.includes(concernId)) {
        return prev.filter(id => id !== concernId);
      }
      return [...prev, concernId];
    });
  };

  const handleContinue = () => {
    setCurrentStep('results');
  };

  const handleSelectTest = (testId: string) => {
    navigate(`/compare?test=${testId}`);
  };

  const handleViewAllTests = () => {
    if (selectedConcerns.length > 0) {
      const primaryConcern = selectedConcerns[0];
      navigate(`/compare?category=${primaryConcern}`);
    } else {
      navigate('/compare');
    }
  };

  // Navigation controls component
  const NavigationControls = () => (
    <div className="flex justify-between items-center p-6 max-w-6xl mx-auto">
      <Button 
        onClick={handleBack} 
        variant="outline" 
        className="flex items-center gap-2 px-6 py-3 rounded-full border-gray-300"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <Button 
        onClick={handleRestart} 
        variant="outline" 
        className="flex items-center gap-2 px-6 py-3 rounded-full border-pink-300 text-pink-600"
      >
        <RotateCcw className="w-4 h-4" />
        Restart
      </Button>
    </div>
  );

  if (currentStep === 'welcome') {
    return (
      <div className="bg-gradient-to-b from-pink-100 to-white min-h-[80vh]">
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
              Let's find you a test!
            </h1>
            <Button 
              onClick={handleGetStarted} 
              className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-12 py-4 text-lg font-medium rounded-full transition-colors"
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'gender') {
    return (
      <div className="bg-gradient-to-b from-pink-100 to-white min-h-[80vh]">
        <NavigationControls />
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How would you describe your gender?
            </h1>
            <p className="text-gray-600 mb-12 text-lg">
              Your answer will help us find the right test for you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              {genderOptions.slice(0, 3).map(option => (
                <Button 
                  key={option.id} 
                  onClick={() => handleGenderSelect(option.id)} 
                  className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-8 py-4 text-lg font-medium rounded-full min-w-[180px] transition-colors"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={() => handleGenderSelect('prefer-not-to-say')} 
                className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-8 py-4 text-lg font-medium rounded-full min-w-[180px] transition-colors"
              >
                Prefer not to say
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'concerns') {
    return (
      <div className="bg-gradient-to-b from-pink-100 to-white min-h-[80vh]">
        <NavigationControls />
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-12">
              Do you have any health concerns or areas of interest?
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {concernOptions.map(option => (
                <Button 
                  key={option.id} 
                  onClick={() => handleConcernSelect(option.id)} 
                  variant={selectedConcerns.includes(option.id) ? 'default' : 'outline'} 
                  className={`px-6 py-4 text-lg font-medium rounded-full transition-colors ${
                    selectedConcerns.includes(option.id) 
                      ? 'bg-[#E91E63] hover:bg-[#C2185B] text-white border-[#E91E63]' 
                      : 'border-[#E91E63] text-[#E91E63] hover:bg-[#E91E63] hover:text-white'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={handleContinue} 
              className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-12 py-4 text-lg font-medium rounded-full transition-colors disabled:opacity-50" 
              disabled={selectedConcerns.length === 0}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    const recommendedTests = getRecommendedTests(selectedConcerns, selectedGender);

    return (
      <div className="bg-gradient-to-b from-pink-100 to-white bg-white min-h-[80vh]">
        <NavigationControls />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Recommended for you ({recommendedTests.length})
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recommendedTests.map(test => (
              <div key={test.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-[#1a365d] text-white p-4 text-center">
                  <h3 className="text-sm font-medium">{test.category}</h3>
                </div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{test.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{test.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">{test.turnaround}</p>
                    <p className="text-sm text-gray-600">{test.biomarkers}</p>
                    
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({test.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-900 mb-2">{test.price}</div>
                  <p className="text-sm text-gray-500 mb-4">{test.collection}</p>
                  
                  <Button 
                    onClick={() => handleSelectTest(test.id)} 
                    variant="outline" 
                    className="w-full py-3 text-[#081129] border-gray-300 hover:bg-gray-50"
                  >
                    Select test
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleViewAllTests} 
              className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-8 py-3 text-lg font-medium rounded-full"
            >
              View all tests
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};