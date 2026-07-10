import { X, RotateCcw } from "lucide-react";
import type {
  ClinicalReviewType,
  CollectionMethod,
  FilterState,
  GoalTag,
  SampleType,
} from "@/types/testFinder";
import {
  COLLECTION_METHOD_LABEL,
  GOAL_LABEL,
  SAMPLE_TYPE_LABEL,
} from "@/lib/testFinder/labels";
import { countActiveFilters, filtersDifferFrom } from "@/lib/testFinder/filters";

interface Props {
  filters: FilterState;
  quizFilters: FilterState | null;
  onChange: (f: FilterState) => void;
  onClear: () => void;
  onResetToQuiz: () => void;
}

const GOALS: GoalTag[] = [
  "preventative",
  "longevity",
  "performance",
  "weight_management",
  "symptom_investigation",
  "condition_monitoring",
];

const SAMPLE_TYPES: SampleType[] = [
  "finger_prick",
  "venous",
  "saliva",
  "urine",
  "stool",
];

const COLLECTION_METHODS: CollectionMethod[] = [
  "home_kit",
  "clinic_appointment",
  "home_visit",
  "mobile_phlebotomy",
  "third_party_phlebotomy",
];

const CLINICAL_REVIEW: ClinicalReviewType[] = ["included", "optional", "not_included"];
const CLINICAL_REVIEW_LABEL: Record<ClinicalReviewType, string> = {
  included: "Included",
  optional: "Optional",
  not_included: "Not included",
  not_available: "Not available",
};

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-turquoise">
      {title}
    </div>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

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
    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
      active
        ? "bg-brand-turquoise text-[#081129] border-brand-turquoise font-semibold"
        : "bg-white/5 text-white/80 border-white/10 hover:border-brand-turquoise/60"
    }`}
  >
    {children}
  </button>
);

export const FiltersPanel = ({
  filters,
  quizFilters,
  onChange,
  onClear,
  onResetToQuiz,
}: Props) => {
  const active = countActiveFilters(filters);
  const diverged = !!quizFilters && filtersDifferFrom(filters, quizFilters);

  return (
    <div className="bg-[#0F2238] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-white font-semibold text-sm">
          Filters{" "}
          <span className="text-white/50 font-normal">({active} active)</span>
        </div>
        {active > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-white/60 hover:text-brand-pink flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {diverged && (
        <div className="flex items-center justify-between text-xs bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-lg px-3 py-2">
          <span>Adjusted from your quiz answers</span>
          <button
            type="button"
            onClick={onResetToQuiz}
            className="flex items-center gap-1 text-amber-100 hover:text-white"
          >
            <RotateCcw className="w-3 h-3" /> Reset to quiz
          </button>
        </div>
      )}

      <Group title="Health goals">
        {GOALS.map((g) => (
          <Chip
            key={g}
            active={filters.goals.includes(g)}
            onClick={() => onChange({ ...filters, goals: toggle(filters.goals, g) })}
          >
            {GOAL_LABEL[g]}
          </Chip>
        ))}
      </Group>

      <Group title="Sample type">
        {SAMPLE_TYPES.map((s) => (
          <Chip
            key={s}
            active={filters.sample_types.includes(s)}
            onClick={() =>
              onChange({ ...filters, sample_types: toggle(filters.sample_types, s) })
            }
          >
            {SAMPLE_TYPE_LABEL[s]}
          </Chip>
        ))}
      </Group>

      <Group title="Collection method">
        {COLLECTION_METHODS.map((m) => (
          <Chip
            key={m}
            active={filters.collection_methods.includes(m)}
            onClick={() =>
              onChange({
                ...filters,
                collection_methods: toggle(filters.collection_methods, m),
              })
            }
          >
            {COLLECTION_METHOD_LABEL[m]}
          </Chip>
        ))}
      </Group>

      <Group title="Additional fees">
        <Chip
          active={filters.no_additional_fees}
          onClick={() =>
            onChange({ ...filters, no_additional_fees: !filters.no_additional_fees })
          }
        >
          No additional fees
        </Chip>
      </Group>

      <Group title="Clinical review">
        {CLINICAL_REVIEW.map((c) => (
          <Chip
            key={c}
            active={filters.clinical_review.includes(c)}
            onClick={() =>
              onChange({
                ...filters,
                clinical_review: toggle(filters.clinical_review, c),
              })
            }
          >
            {CLINICAL_REVIEW_LABEL[c]}
          </Chip>
        ))}
        <Chip
          active={filters.clinical_review_included}
          onClick={() =>
            onChange({
              ...filters,
              clinical_review_included: !filters.clinical_review_included,
            })
          }
        >
          Clinical review included only
        </Chip>
      </Group>
    </div>
  );
};
