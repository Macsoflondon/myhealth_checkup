import { useState } from 'react';
import {
  Search, Sparkles, AlertTriangle, CheckCircle2, CircleDashed,
  ChevronDown, ChevronUp, Shield, ArrowRight, Stethoscope,
  Activity, Clock, TrendingUp, Target, AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface RecommendedTest {
  testName: string;
  provider: string;
  price: number | null;
  reason: string;
}

interface HealthGap {
  category: string;
  status: 'unchecked' | 'partial' | 'likely-covered';
  urgency: 'low' | 'medium' | 'high';
  explanation: string;
  recommendedTests: RecommendedTest[];
}

interface GapAnalysisResult {
  medicalDisclaimer: string;
  overallSummary: string;
  coverageScore: number;
  gaps: HealthGap[];
  topPriority: string;
  generalAdvice: string;
}

const LIFESTYLE_OPTIONS = [
  { value: 'sedentary', label: 'Mostly sedentary (desk job, little exercise)' },
  { value: 'lightly-active', label: 'Lightly active (occasional exercise)' },
  { value: 'active', label: 'Active (regular exercise 3–4×/week)' },
  { value: 'very-active', label: 'Very active (daily exercise or sports)' },
];

const CHECKUP_OPTIONS = [
  { value: '0', label: 'Within the last year' },
  { value: '1', label: '1–2 years ago' },
  { value: '3', label: '3–5 years ago' },
  { value: '5', label: 'More than 5 years ago' },
  { value: 'never', label: "I've never had a full health check" },
];

const statusConfig = {
  unchecked: {
    icon: CircleDashed,
    label: 'Not screened',
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-800',
  },
  partial: {
    icon: AlertCircle,
    label: 'Partial coverage',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
  },
  'likely-covered': {
    icon: CheckCircle2,
    label: 'Likely covered',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-800',
  },
};

const urgencyColor = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-green-100 text-green-800',
};

function GapCard({ gap }: { gap: HealthGap }) {
  const [expanded, setExpanded] = useState(gap.status !== 'likely-covered' && gap.urgency === 'high');
  const cfg = statusConfig[gap.status];
  const StatusIcon = cfg.icon;

  const hasTests = gap.recommendedTests?.length > 0;

  return (
    <Card className={`border ${cfg.bg} transition-all duration-200`}>
      <button
        className="w-full text-left p-4 flex items-center gap-3"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <StatusIcon className={`h-5 w-5 flex-shrink-0 ${cfg.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{gap.category}</span>
            <Badge className={`text-xs ${cfg.badge}`}>{cfg.label}</Badge>
            {gap.status !== 'likely-covered' && (
              <Badge className={`text-xs ${urgencyColor[gap.urgency]}`}>
                {gap.urgency} priority
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{gap.explanation}</p>
        </div>
        <div className="flex-shrink-0 ml-2">
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-inherit mt-0 pt-4">
          <p className="text-sm text-foreground mb-4">{gap.explanation}</p>

          {hasTests && gap.status !== 'likely-covered' && (
            <>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Recommended tests to fill this gap
              </h4>
              <div className="space-y-2">
                {gap.recommendedTests.map((test, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-white rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{test.testName}</p>
                      <p className="text-xs text-muted-foreground">{test.provider}</p>
                      <p className="text-xs text-foreground mt-1">{test.reason}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-primary">
                        {test.price ? `£${test.price}` : 'Price TBC'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {gap.status === 'likely-covered' && (
            <p className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Based on your profile, this area appears to be reasonably covered. Keep up your regular check-ups.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

function CoverageScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? 'text-green-600' : score >= 40 ? 'text-amber-500' : 'text-red-600';
  const label = score >= 70 ? 'Good Coverage' : score >= 40 ? 'Moderate Coverage' : 'Low Coverage';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-5xl font-bold ${color}`}>{score}%</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <Progress value={score} className="w-32 h-2" />
    </div>
  );
}

const HiddenGapDetector = () => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GapAnalysisResult | null>(null);

  // Form state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [lastCheckup, setLastCheckup] = useState('');
  const [existingConditions, setExistingConditions] = useState('');

  const [filter, setFilter] = useState<'all' | 'gaps-only'>('gaps-only');

  const runAnalysis = async () => {
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      toast.error('Please enter a valid age between 18 and 120');
      return;
    }
    if (!gender) {
      toast.error('Please select your gender');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('hidden-gap-detector', {
        body: {
          age: ageNum,
          gender,
          lifestyle: lifestyle || null,
          lastCheckupYears: lastCheckup || null,
          existingConditions: existingConditions || null,
          userId: session?.user?.id ?? null,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      setStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      logger.error('Gap detector error:', err);
      toast.error('Unable to run gap analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('form');
    setResult(null);
    setFilter('gaps-only');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (step === 'results' && result) {
    const gaps = result.gaps ?? [];
    const uncheckedCount = gaps.filter(g => g.status === 'unchecked').length;
    const partialCount = gaps.filter(g => g.status === 'partial').length;
    const highPriorityCount = gaps.filter(g => g.urgency === 'high' && g.status !== 'likely-covered').length;

    const displayedGaps = filter === 'gaps-only'
      ? gaps.filter(g => g.status !== 'likely-covered')
      : gaps;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">Your Gap Analysis</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your profile — not medical advice
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetForm}>
            <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
            New Analysis
          </Button>
        </div>

        {/* Medical disclaimer */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm">
            <strong>Important:</strong> {result.medicalDisclaimer}
          </AlertDescription>
        </Alert>

        {/* Coverage overview */}
        <Card className="p-6 border-2">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <CoverageScoreRing score={result.coverageScore} />
            <Separator orientation="vertical" className="hidden sm:block h-24" />
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <p className="text-sm text-foreground">{result.overallSummary}</p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <span>{uncheckedCount} not screened</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span>{partialCount} partial</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <span>{gaps.length - uncheckedCount - partialCount} covered</span>
                </div>
              </div>
              {result.topPriority && (
                <p className="text-sm font-medium text-brand-navy flex items-center gap-1.5 justify-center sm:justify-start">
                  <TrendingUp className="h-4 w-4 text-brand-pink" />
                  Top priority: <span className="text-brand-pink">{result.topPriority}</span>
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* High priority alert */}
        {highPriorityCount > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">
              <strong>{highPriorityCount} high-priority gap{highPriorityCount > 1 ? 's' : ''} detected.</strong>{' '}
              We recommend addressing these with a healthcare professional soon.
            </AlertDescription>
          </Alert>
        )}

        {/* General advice */}
        {result.generalAdvice && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Stethoscope className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">{result.generalAdvice}</p>
            </div>
          </Card>
        )}

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Show:</span>
          <Button
            variant={filter === 'gaps-only' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('gaps-only')}
          >
            Gaps only ({uncheckedCount + partialCount})
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All categories ({gaps.length})
          </Button>
        </div>

        {/* Gap cards */}
        <div className="space-y-3">
          {displayedGaps.length === 0 ? (
            <Card className="p-6 text-center bg-green-50 border-green-200">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-green-800">Great news — no major gaps detected!</p>
              <p className="text-sm text-green-700 mt-1">Your profile suggests reasonable preventive health coverage. Keep up the good work.</p>
            </Card>
          ) : (
            displayedGaps
              .sort((a, b) => {
                const urgencyOrder = { high: 0, medium: 1, low: 2 };
                const statusOrder = { unchecked: 0, partial: 1, 'likely-covered': 2 };
                if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
                return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
              })
              .map((gap, idx) => <GapCard key={idx} gap={gap} />)
          )}
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-xs">
            {result.medicalDisclaimer}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-12 bg-brand-pink/10 rounded-2xl flex items-center justify-center">
            <Search className="h-6 w-6 text-brand-pink" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">Hidden Gap Detector</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Discover which preventive health screenings you may be missing — based on your age, gender, and lifestyle — before problems become symptoms.
        </p>
      </div>

      {/* Medical disclaimer */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>Wellness tool only.</strong> This tool provides general preventive health information, not medical advice. Always consult your GP or healthcare professional regarding health concerns.
        </AlertDescription>
      </Alert>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: Activity, label: 'Enter your profile', desc: 'Age, gender & lifestyle' },
          { icon: Sparkles, label: 'AI analyses gaps', desc: 'Against NHS guidelines' },
          { icon: Target, label: 'Get test suggestions', desc: 'From trusted UK providers' },
        ].map(({ icon: Icon, label, desc }, i) => (
          <div key={i} className="p-3 rounded-xl bg-muted/50 space-y-1">
            <Icon className="h-5 w-5 text-primary mx-auto" />
            <p className="text-xs font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <Card className="p-6 border-2">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Your Health Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-5">
          {/* Age & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Age <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 35"
                min={18}
                max={120}
                value={age}
                onChange={e => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Lifestyle */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Lifestyle
            </label>
            <select
              className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
              value={lifestyle}
              onChange={e => setLifestyle(e.target.value)}
            >
              <option value="">Select lifestyle (optional)</option>
              {LIFESTYLE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Last checkup */}
          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              When did you last have a full health check?
            </label>
            <select
              className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
              value={lastCheckup}
              onChange={e => setLastCheckup(e.target.value)}
            >
              <option value="">Select (optional)</option>
              {CHECKUP_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Existing conditions */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Known health conditions or concerns (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border rounded-md h-20 resize-none bg-background"
              placeholder="e.g. family history of heart disease, diabetes risk, anxiety... (optional)"
              value={existingConditions}
              onChange={e => setExistingConditions(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">Max 200 characters — do not include personal identifiable medical records.</p>
          </div>

          <Button
            className="w-full bg-brand-pink hover:bg-brand-pink/90"
            size="lg"
            onClick={runAnalysis}
            disabled={isLoading || !age || !gender}
          >
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Detecting hidden gaps…
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Detect My Health Gaps
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Trust signals */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Analysis based on NHS and NICE preventive screening guidelines
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> No data stored without consent</span>
          <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Not medical advice</span>
        </div>
      </div>
    </div>
  );
};

export default HiddenGapDetector;
