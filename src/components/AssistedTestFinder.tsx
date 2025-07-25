import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

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
      navigate(`/compare-tests?category=${primaryConcern}`);
    } else {
      navigate('/compare-tests');
    }
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Let's find you a test!
            </h1>
            <Button 
              onClick={handleGetStarted}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg rounded-full"
            >
              Get started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'gender') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              How would you describe your gender?
            </h1>
            <p className="text-gray-600 mb-8">
              Your answer will help us find the right test for you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {genderOptions.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleGenderSelect(option.id)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-4 text-lg rounded-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'concerns') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl text-center">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Do you have any health concerns or areas of interest?
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {concernOptions.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleConcernSelect(option.id)}
                  variant={selectedConcerns.includes(option.id) ? 'default' : 'outline'}
                  className={`px-6 py-4 text-lg rounded-full ${
                    selectedConcerns.includes(option.id)
                      ? 'bg-pink-500 hover:bg-pink-600 text-white'
                      : 'border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button 
              onClick={handleContinue}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg rounded-full"
              disabled={selectedConcerns.length === 0}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};