import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Shield, Loader2, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Step =
  | 'welcome'
  | 'who'
  | 'gender'
  | 'age'
  | 'goal'
  | 'concerns'
  | 'symptoms'
  | 'preferences'
  | 'loading'
  | 'results';

interface QuizAnswers {
  who: string;
  gender: string;
  ageRange: string;
  goal: string;
  concerns: string[];
  symptoms: string[];
  sampleMethod: string;
  budget: string;
  speed: string;
}

interface Recommendation {
  testId: string;
  testName: string;
  provider: string;
  price: number;
  biomarkers: number;
  url: string | null;
  badge: string;
  reasons: string[];
  caveat?: string;
}

interface AIResults {
  recommendations: Recommendation[];
  disclaimer: string;
}

const TOTAL_STEPS = 7;

const stepOrder: Step[] = ['who', 'gender', 'age', 'goal', 'concerns', 'symptoms', 'preferences'];

const whoOptions = [
  { id: 'just-me', label: 'Just me' },
  { id: 'someone-else', label: 'Someone else' },
  { id: 'my-family', label: 'My family' },
];

const genderOptions = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'non-binary', label: 'Non-binary' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const ageOptions = [
  { id: 'under-30', label: 'Under 30' },
  { id: '30-39', label: '30–39' },
  { id: '40-49', label: '40–49' },
  { id: '50-59', label: '50–59' },
  { id: '60-plus', label: '60+' },
];

const goalOptions = [
  { id: 'general-health', label: 'General health check' },
  { id: 'specific-symptoms', label: 'Investigate specific symptoms' },
  { id: 'preventive', label: 'Preventive screening' },
  { id: 'monitor-condition', label: 'Monitor existing condition' },
  { id: 'fitness-performance', label: 'Fitness & performance optimisation' },
];

const concernOptions = [
  { id: 'fatigue', label: 'Fatigue or low energy' },
  { id: 'hormones', label: 'Hormonal changes' },
  { id: 'heart', label: 'Heart & cholesterol' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'fertility', label: 'Fertility' },
  { id: 'vitamins', label: 'Vitamin deficiencies' },
  { id: 'digestive', label: 'Digestive issues' },
  { id: 'weight', label: 'Weight management' },
  { id: 'sexual-health', label: 'Sexual health' },
  { id: 'cancer-screening', label: 'Cancer screening' },
  { id: 'liver', label: 'Liver health' },
  { id: 'diabetes', label: 'Diabetes risk' },
  { id: 'bone-joint', label: 'Bone & joint health' },
  { id: 'allergies', label: 'Allergies' },
  { id: 'none', label: 'None — just a general check' },
];

const symptomOptions = [
  { id: 'tiredness', label: 'Unexplained tiredness' },
  { id: 'brain-fog', label: 'Brain fog or poor concentration' },
  { id: 'hair-skin', label: 'Hair loss or skin changes' },
  { id: 'irregular-periods', label: 'Irregular periods' },
  { id: 'joint-pain', label: 'Joint pain or stiffness' },
  { id: 'frequent-infections', label: 'Frequent infections' },
  { id: 'mood-anxiety', label: 'Mood changes or anxiety' },
  { id: 'sleep-problems', label: 'Sleep problems' },
  { id: 'family-history', label: 'Family history of chronic disease' },
  { id: 'none', label: 'None of the above' },
];

const sampleMethodOptions = [
  { id: 'home-kit', label: 'Home test kit' },
  { id: 'clinic-visit', label: 'Clinic visit' },
  { id: 'either', label: 'Either is fine' },
];

const budgetOptions = [
  { id: 'under-50', label: 'Under £50' },
  { id: '50-100', label: '£50–£100' },
  { id: '100-200', label: '£100–£200' },
  { id: '200-500', label: '£200–£500' },
  { id: 'no-preference', label: 'No preference' },
];

const speedOptions = [
  { id: 'asap', label: 'As fast as possible' },
  { id: 'within-week', label: 'Within a week' },
  { id: 'no-rush', label: 'No rush' },
];

const providerNames: Record<string, string> = {
  medichecks: 'Medichecks',
  goodbody: 'Goodbody Clinic',
  thriva: 'Thriva',
  randox: 'Randox Health',
  'lola-health': 'Lola Health',
  lml: 'London Medical Laboratory',
};

export const AssistedTestFinder = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [answers, setAnswers] = useState<QuizAnswers>({
    who: '',
    gender: '',
    ageRange: '',
    goal: '',
    concerns: [],
    symptoms: [],
    sampleMethod: '',
    budget: '',
    speed: '',
  });
  const [results, setResults] = useState<AIResults | null>(null);
  const navigate = useNavigate();

  const currentStepIndex = stepOrder.indexOf(currentStep as any);
  const progressPercent = currentStepIndex >= 0 ? Math.round(((currentStepIndex + 1) / TOTAL_STEPS) * 100) : 0;

  const handleBack = () => {
    if (currentStep === 'results' || currentStep === 'loading') {
      setCurrentStep('preferences');
      return;
    }
    const idx = stepOrder.indexOf(currentStep as any);
    if (idx > 0) setCurrentStep(stepOrder[idx - 1]);
    else if (idx === 0) setCurrentStep('welcome');
  };

  const handleRestart = () => {
    setCurrentStep('welcome');
    setAnswers({ who: '', gender: '', ageRange: '', goal: '', concerns: [], symptoms: [], sampleMethod: '', budget: '', speed: '' });
    setResults(null);
  };

  const handleSingleSelect = (field: keyof QuizAnswers, value: string, autoAdvance = true) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (autoAdvance) {
      const idx = stepOrder.indexOf(currentStep as any);
      if (idx < stepOrder.length - 1) {
        setCurrentStep(stepOrder[idx + 1]);
      }
    }
  };

  const handleMultiSelect = (field: 'concerns' | 'symptoms', value: string) => {
    setAnswers(prev => {
      const current = prev[field];
      if (value === 'none') return { ...prev, [field]: ['none'] };
      const filtered = current.filter(v => v !== 'none');
      if (filtered.includes(value)) return { ...prev, [field]: filtered.filter(v => v !== value) };
      return { ...prev, [field]: [...filtered, value] };
    });
  };

  const handleNext = () => {
    const idx = stepOrder.indexOf(currentStep as any);
    if (idx < stepOrder.length - 1) {
      setCurrentStep(stepOrder[idx + 1]);
    }
  };

  const handleSubmitQuiz = async () => {
    setCurrentStep('loading');
    try {
      const { data, error } = await supabase.functions.invoke('quiz-recommendations', {
        body: answers,
      });

      if (error) {
        console.error('Quiz error:', error);
        toast.error('Failed to generate recommendations. Please try again.');
        setCurrentStep('preferences');
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setCurrentStep('preferences');
        return;
      }

      setResults(data as AIResults);
      setCurrentStep('results');
    } catch (e) {
      console.error('Quiz error:', e);
      toast.error('Something went wrong. Please try again.');
      setCurrentStep('preferences');
    }
  };

  const NavigationControls = () => (
    <div className="flex justify-between items-center p-6 max-w-6xl mx-auto">
      <Button
        onClick={handleBack}
        variant="outline"
        className="flex items-center gap-2 px-6 py-3 rounded-full border-muted-foreground/30"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <Button
        onClick={handleRestart}
        variant="outline"
        className="flex items-center gap-2 px-6 py-3 rounded-full border-secondary/40 text-secondary"
      >
        <RotateCcw className="w-4 h-4" />
        Restart
      </Button>
    </div>
  );

  const ProgressHeader = () => (
    <div className="max-w-2xl mx-auto px-6 pt-4 pb-2">
      <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
        <span>Step {currentStepIndex + 1} of {TOTAL_STEPS}</span>
        <span>{progressPercent}%</span>
      </div>
      <Progress value={progressPercent} className="h-2 bg-muted" />
    </div>
  );

  const OptionCard = ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`w-full px-6 py-4 text-left text-lg font-medium rounded-2xl border-2 transition-all duration-200 ${
        selected
          ? 'bg-secondary text-secondary-foreground border-secondary'
          : 'bg-card text-card-foreground border-border hover:border-secondary/50 hover:shadow-md'
      }`}
    >
      {label}
    </button>
  );

  // === WELCOME ===
  if (currentStep === 'welcome') {
    return (
      <div className="bg-gradient-to-b from-secondary/10 to-background min-h-[80vh]">
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-montserrat">
              Find the Right Health Test for You
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Answer a few questions about your health goals and we'll recommend the most relevant tests from trusted UK providers.
            </p>
            <Button
              onClick={() => setCurrentStep('who')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-12 py-4 text-lg font-medium rounded-full transition-colors"
            >
              Start Quiz
            </Button>
            <p className="text-sm text-muted-foreground mt-6">
              🔒 Your answers are not stored. This tool does not provide medical advice.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === LOADING ===
  if (currentStep === 'loading') {
    return (
      <div className="bg-gradient-to-b from-secondary/10 to-background min-h-[80vh]">
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="text-center max-w-md mx-auto">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-3 font-montserrat">
              Analysing your answers…
            </h2>
            <p className="text-muted-foreground">
              We're matching your profile against tests from 6 trusted UK providers to find the best options for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === RESULTS ===
  if (currentStep === 'results' && results) {
    return (
      <div className="bg-gradient-to-b from-secondary/10 to-background min-h-[80vh]">
        <NavigationControls />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-montserrat">
              Your Recommended Tests
            </h1>
            <p className="text-muted-foreground">Based on your answers, here are the tests we think suit you best.</p>
          </div>

          <div className="space-y-6 mb-8">
            {results.recommendations.map((rec, i) => (
              <div
                key={rec.testId}
                className={`rounded-2xl border-2 p-6 bg-card ${
                  i === 0 ? 'border-primary shadow-lg' : 'border-border'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      rec.badge === 'Best Match'
                        ? 'bg-primary/10 text-primary'
                        : rec.badge === 'Best Value'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {rec.badge}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {providerNames[rec.provider] || rec.provider}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{rec.testName}</h3>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="font-semibold text-foreground text-lg">£{rec.price?.toFixed(2)}</span>
                  {rec.biomarkers > 0 && <span>{rec.biomarkers} biomarkers</span>}
                </div>

                <div className="space-y-1 mb-4">
                  {rec.reasons.map((reason, j) => (
                    <p key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      {reason}
                    </p>
                  ))}
                </div>

                {rec.caveat && (
                  <p className="text-xs text-muted-foreground italic mb-4">{rec.caveat}</p>
                )}

                {rec.url && (
                  <a
                    href={rec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View test details <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <Button
              onClick={() => {
                const ids = results.recommendations.map(r => r.testId).join(',');
                navigate(`/compare?tests=${ids}`);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium rounded-full"
            >
              Compare These Tests
            </Button>

            <div>
              <button onClick={handleRestart} className="text-sm text-muted-foreground hover:text-foreground underline">
                Change my answers
              </button>
            </div>

            <p className="text-xs text-muted-foreground max-w-lg mx-auto mt-6">
              {results.disclaimer || 'This tool provides general guidance only. It is not a medical diagnosis. Consult your GP for personalised medical advice.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === QUIZ STEPS ===
  const renderStepContent = () => {
    switch (currentStep) {
      case 'who':
        return (
          <StepLayout title="Who is this test for?">
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              {whoOptions.map(o => (
                <OptionCard key={o.id} label={o.label} selected={answers.who === o.id} onClick={() => handleSingleSelect('who', o.id)} />
              ))}
            </div>
          </StepLayout>
        );

      case 'gender':
        return (
          <StepLayout title="How would you describe your gender?" subtitle="Some tests are gender-specific, so this helps us filter accurately.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {genderOptions.map(o => (
                <OptionCard key={o.id} label={o.label} selected={answers.gender === o.id} onClick={() => handleSingleSelect('gender', o.id)} />
              ))}
            </div>
          </StepLayout>
        );

      case 'age':
        return (
          <StepLayout title="What is your age range?" subtitle="Age-appropriate screening varies. This helps us prioritise the right tests.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
              {ageOptions.map(o => (
                <OptionCard key={o.id} label={o.label} selected={answers.ageRange === o.id} onClick={() => handleSingleSelect('ageRange', o.id)} />
              ))}
            </div>
          </StepLayout>
        );

      case 'goal':
        return (
          <StepLayout title="What's your main health goal?">
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              {goalOptions.map(o => (
                <OptionCard key={o.id} label={o.label} selected={answers.goal === o.id} onClick={() => handleSingleSelect('goal', o.id)} />
              ))}
            </div>
          </StepLayout>
        );

      case 'concerns':
        return (
          <StepLayout title="Do you have any specific areas of concern?" subtitle="Select all that apply.">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {concernOptions.map(o => (
                <OptionCard key={o.id} label={o.label} selected={answers.concerns.includes(o.id)} onClick={() => handleMultiSelect('concerns', o.id)} />
              ))}
            </div>
            <div className="text-center mt-6">
              <Button
                onClick={handleNext}
                disabled={answers.concerns.length === 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 text-lg rounded-full disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          </StepLayout>
        );

      case 'symptoms':
        return (
          <StepLayout title="Are you experiencing any of these?" subtitle="Optional — select any that apply, or skip.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {symptomOptions.map(o => (
                <OptionCard key={o.id} label={o.label} selected={answers.symptoms.includes(o.id)} onClick={() => handleMultiSelect('symptoms', o.id)} />
              ))}
            </div>
            <div className="text-center mt-6">
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 text-lg rounded-full"
              >
                {answers.symptoms.length === 0 ? 'Skip' : 'Next'}
              </Button>
            </div>
          </StepLayout>
        );

      case 'preferences':
        return (
          <StepLayout title="Your practical preferences">
            <div className="max-w-lg mx-auto space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Sample collection method</h3>
                <div className="grid grid-cols-1 gap-3">
                  {sampleMethodOptions.map(o => (
                    <OptionCard key={o.id} label={o.label} selected={answers.sampleMethod === o.id} onClick={() => handleSingleSelect('sampleMethod', o.id, false)} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Budget</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {budgetOptions.map(o => (
                    <OptionCard key={o.id} label={o.label} selected={answers.budget === o.id} onClick={() => handleSingleSelect('budget', o.id, false)} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">How quickly do you need results?</h3>
                <div className="grid grid-cols-1 gap-3">
                  {speedOptions.map(o => (
                    <OptionCard key={o.id} label={o.label} selected={answers.speed === o.id} onClick={() => handleSingleSelect('speed', o.id, false)} />
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={!answers.sampleMethod || !answers.budget || !answers.speed}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-12 py-4 text-lg font-medium rounded-full disabled:opacity-40"
                >
                  Get My Recommendations
                </Button>
              </div>
            </div>
          </StepLayout>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-secondary/10 to-background min-h-[80vh]">
      <NavigationControls />
      <ProgressHeader />
      <div className="p-4 pb-16">{renderStepContent()}</div>
    </div>
  );
};

function StepLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto pt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground font-montserrat">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2 text-lg">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
