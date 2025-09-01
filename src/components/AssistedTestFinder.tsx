import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Step = 'welcome' | 'gender' | 'concerns';

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

export const AssistedTestFinder = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setCurrentStep('gender');
  };

  const handleBack = () => {
    if (currentStep === 'concerns') {
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
    // Navigate to appropriate category based on selections
    if (selectedConcerns.length > 0) {
      const primaryConcern = selectedConcerns[0];
      navigate(`/compare?category=${primaryConcern}`);
    } else {
      navigate('/compare');
    }
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
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
        <Footer />
      </div>
    );
  }

  if (currentStep === 'gender') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white">
        <Header />
        
        {/* Navigation Controls */}
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

        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How would you describe your gender?
            </h1>
            <p className="text-gray-600 mb-12 text-lg">
              Your answer will help us find the right test for you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              {genderOptions.slice(0, 3).map((option) => (
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
        
        <Footer />
      </div>
    );
  }

  if (currentStep === 'concerns') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white">
        <Header />
        
        {/* Navigation Controls */}
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

        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-12">
              Do you have any health concerns or areas of interest?
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {concernOptions.map((option) => (
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
        
        <Footer />
      </div>
    );
  }

  return null;
};