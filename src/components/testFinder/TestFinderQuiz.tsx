import { useState } from "react";
import { ChevronLeft, ChevronRight, Brain, Sparkles } from "lucide-react";
import type {
  AgeBand,
  CollectionMethod,
  ConditionTag,
  GoalTag,
  SampleType,
  Sex,
} from "@/types/testFinder";
import {
  AGE_BAND_LABEL,
  CONDITION_LABEL,
  GOAL_LABEL,
  SAMPLE_TYPE_LABEL,
} from "@/lib/testFinder/labels";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RecommendationResults, type AIAnalysisResult } from "@/components/ai/RecommendationEngine";

const SEXES: { id: Sex; label: string }[] = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other / prefer not to say" },
];

const AGE_BANDS: AgeBand[] = ["18_29", "30_39", "40_49", "50_59", "60_plus"];

const GOALS: GoalTag[] = [
  "preventative",
  "longevity",
  "performance",
  "weight_management",
  "symptom_investigation",
  "condition_monitoring",
];

const COMMON_CONCERNS: ConditionTag[] = [
  "fatigue_low_energy",
  "cardiovascular_risk",
  "metabolic_health",
  "thyroid",
  "diabetes",
];
const MALE_CONCERNS: ConditionTag[] = ["male_hormones", "prostate_health", "fertility_male"];
const FEMALE_CONCERNS: ConditionTag[] = [
  "female_hormones",
  "menopause_hrt",
  "gynaecology",
  "fertility_female",
];

const SAMPLE_PREFS: SampleType[] = ["finger_prick", "venous", "saliva"];
const COLLECTION_PREFS: CollectionMethod[] = [
  "home_kit",
  "clinic_appointment",
  "home_visit",
];

const STEPS = ["Sex", "Age", "Goals", "Concerns", "Preferences", "Specific Concerns"] as const;

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-sm px-4 py-2 rounded-full border transition-colors min-h-[44px] ${
      active
        ? "bg-brand-turquoise text-[#081129] border-brand-turquoise font-semibold"
        : "bg-[#081129]/5 text-[#081129] border-[#081129]/15 hover:border-brand-turquoise"
    }`}
  >
    {children}
  </button>
);

/** Premium AI loading state */
const AnalyzingState = () => {
  const [dots, setDots] = useState(0);

  // Animate the dots
  useState(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(id);
  });

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#22c0d4] to-[#e70d69] animate-pulse flex items-center justify-center">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-[#22c0d4]/30 animate-ping" />
      </div>
      <div>
        <h3
          className="text-xl font-bold text-[#081129] mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Analysing 597 tests{'.'.repeat(dots)}
        </h3>
        <p className="text-[#081129]/60 text-sm max-w-sm mx-auto">
          Cross-referencing your profile with our accredited provider database to find your optimal wellness panel.
        </p>
      </div>
      <div className="w-64 h-1.5 bg-[#081129]/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#22c0d4] to-[#e70d69] rounded-full animate-[shimmer_2s_ease-in-out_infinite]"
          style={{ width: '70%', animation: 'shimmer 2s ease-in-out infinite' }}
        />
      </div>
      <style>{`
        @keyframes shimmer {
          0%, 100% { width: 20%; margin-left: 0; }
          50% { width: 80%; margin-left: 10%; }
        }
      `}</style>
    </div>
  );
};

export const TestFinderQuiz = () => {
  const [step, setStep] = useState(0);
  const [sex, setSex] = useState<Sex | null>(null);
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null);
  const [goals, setGoals] = useState<GoalTag[]>([]);
  const [concerns, setConcerns] = useState<ConditionTag[]>([]);
  const [sampleTypes, setSampleTypes] = useState<SampleType[]>([]);
  const [collection, setCollection] = useState<CollectionMethod[]>([]);
  const [avoidVenous, setAvoidVenous] = useState(false);
  const [noFees, setNoFees] = useState(false);
  const [reviewIncluded, setReviewIncluded] = useState(false);
  const [specificConcerns, setSpecificConcerns] = useState("");

  // AI relay state
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const canAdvance = (() => {
    if (step === 0) return !!sex;
    if (step === 1) return !!ageBand;
    if (step === 2) return goals.length > 0;
    return true;
  })();

  const concernOptions: ConditionTag[] = [
    ...(sex === "male" ? MALE_CONCERNS : sex === "female" ? FEMALE_CONCERNS : []),
    ...COMMON_CONCERNS,
  ];

  const buildQueryText = (): string => {
    const parts: string[] = [];
    if (goals.length > 0) {
      parts.push(`Goals: ${goals.map((g) => GOAL_LABEL[g]).join(", ")}`);
    }
    if (concerns.length > 0) {
      parts.push(`Health areas: ${concerns.map((c) => CONDITION_LABEL[c]).join(", ")}`);
    }
    if (specificConcerns.trim()) {
      parts.push(specificConcerns.trim());
    }
    return parts.join(". ") || "General wellness screening";
  };

  const ageBandToNumber = (band: AgeBand): number => {
    const midpoints: Record<AgeBand, number> = {
      "18_29": 24,
      "30_39": 35,
      "40_49": 45,
      "50_59": 55,
      "60_plus": 65,
    };
    return midpoints[band];
  };

  const submit = async () => {
    if (!sex || !ageBand) return;

    setIsAnalysing(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-human-context", {
        body: {
          query_text: buildQueryText(),
          gender: sex === "other" ? null : sex,
          age: ageBandToNumber(ageBand),
          method_preference: collection.length > 0 ? collection[0].replace("_", " ") : null,
        },
      });

      if (error) throw error;

      setAiResult(data as AIAnalysisResult);
    } catch (err) {
      toast.error("Unable to generate recommendations. Please try again.");
      setIsAnalysing(false);
    }
  };

  // Show AI loading state
  if (isAnalysing && !aiResult) {
    return (
      <div className="bg-white border border-[#081129]/10 rounded-2xl">
        <AnalyzingState />
      </div>
    );
  }

  // Show AI results
  if (aiResult) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#081129]/10 rounded-2xl p-5 sm:p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[#22c0d4]" />
              <h2
                className="text-2xl font-bold text-[#081129]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Your Personalised Results
              </h2>
            </div>
            <p className="text-[#081129]/60 text-sm">
              Based on your health quiz answers
            </p>
          </div>
          <RecommendationResults result={aiResult} />
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setAiResult(null);
              setIsAnalysing(false);
              setStep(0);
            }}
            className="text-sm text-[#081129]/60 hover:text-[#081129] underline"
          >
            Retake quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#081129]/10 rounded-2xl p-5 sm:p-8 space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-[11px] uppercase tracking-wide text-[#081129]/50 mb-2">
          <span>
            Step {step + 1} of {STEPS.length} \u00b7 {STEPS[step]}
          </span>
        </div>
        <div className="h-1 bg-[#081129]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-turquoise to-brand-pink transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-3">
          <h2 className="text-[#081129] text-xl font-semibold">How would you describe your gender?</h2>
          <p className="text-[#081129]/60 text-sm">
            Used only to tailor recommendations \u2014 never shown as a visible filter.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {SEXES.map((s) => (
              <Chip key={s.id} active={sex === s.id} onClick={() => setSex(s.id)}>
                {s.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <h2 className="text-[#081129] text-xl font-semibold">Which age band?</h2>
          <div className="flex flex-wrap gap-2 pt-2">
            {AGE_BANDS.map((a) => (
              <Chip key={a} active={ageBand === a} onClick={() => setAgeBand(a)}>
                {AGE_BAND_LABEL[a]}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h2 className="text-[#081129] text-xl font-semibold">What are your primary goals?</h2>
          <p className="text-[#081129]/60 text-sm">Pick one or more.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {GOALS.map((g) => (
              <Chip
                key={g}
                active={goals.includes(g)}
                onClick={() => setGoals(toggle(goals, g))}
              >
                {GOAL_LABEL[g]}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <h2 className="text-[#081129] text-xl font-semibold">Any specific concerns?</h2>
          <p className="text-[#081129]/60 text-sm">Optional \u2014 skip if nothing applies.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {concernOptions.map((c) => (
              <Chip
                key={c}
                active={concerns.includes(c)}
                onClick={() => setConcerns(toggle(concerns, c))}
              >
                {CONDITION_LABEL[c]}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <h2 className="text-[#081129] text-xl font-semibold">Practical preferences</h2>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-turquoise mb-2">
              Preferred sample type
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PREFS.map((s) => (
                <Chip
                  key={s}
                  active={sampleTypes.includes(s)}
                  onClick={() => setSampleTypes(toggle(sampleTypes, s))}
                >
                  {SAMPLE_TYPE_LABEL[s]}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-turquoise mb-2">
              Preferred collection
            </div>
            <div className="flex flex-wrap gap-2">
              {COLLECTION_PREFS.map((c) => (
                <Chip
                  key={c}
                  active={collection.includes(c)}
                  onClick={() => setCollection(toggle(collection, c))}
                >
                  {c.replace(/_/g, " ")}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 text-[#081129]/85 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={avoidVenous}
                onChange={(e) => setAvoidVenous(e.target.checked)}
                className="w-4 h-4 accent-brand-turquoise"
              />
              Prefer finger-prick / avoid venous draw
            </label>
            <label className="flex items-center gap-3 text-[#081129]/85 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={noFees}
                onChange={(e) => setNoFees(e.target.checked)}
                className="w-4 h-4 accent-brand-turquoise"
              />
              No additional collection fees
            </label>
            <label className="flex items-center gap-3 text-[#081129]/85 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={reviewIncluded}
                onChange={(e) => setReviewIncluded(e.target.checked)}
                className="w-4 h-4 accent-brand-turquoise"
              />
              Clinical review must be included
            </label>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3">
          <h2 className="text-[#081129] text-xl font-semibold">Anything else we should know?</h2>
          <p className="text-[#081129]/60 text-sm">
            Describe any specific symptoms, conditions, or wellness goals in your own words. This helps our AI tailor results to you.
          </p>
          <textarea
            className="w-full p-4 border border-[#081129]/15 rounded-xl h-32 resize-none text-[#081129] placeholder:text-[#081129]/40 focus:outline-none focus:ring-2 focus:ring-brand-turquoise/50 focus:border-brand-turquoise"
            placeholder="e.g. I've been feeling tired lately, want to check my iron levels and thyroid..."
            value={specificConcerns}
            onChange={(e) => setSpecificConcerns(e.target.value)}
          />
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between pt-4 border-t border-[#081129]/10">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep(Math.max(0, step - 1))}
          className="flex items-center gap-1 text-[#081129]/70 hover:text-[#081129] disabled:opacity-30 disabled:cursor-not-allowed text-sm px-3 py-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-1 bg-brand-turquoise hover:bg-[#1aa8bb] disabled:opacity-40 text-[#081129] font-semibold text-sm px-5 py-2.5 rounded-full"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="flex items-center gap-2 bg-gradient-to-r from-[#22c0d4] to-[#e70d69] hover:opacity-90 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-lg"
          >
            <Brain className="w-4 h-4" />
            Get my AI recommendations
          </button>
        )}
      </div>
    </div>
  );
};
