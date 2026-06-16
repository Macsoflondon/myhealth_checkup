/**
 * Assisted Test Finder store — profile, quiz-derived filters, live filters,
 * recommendations, and selected test ids for the comparison surface.
 *
 * Mirrors the lightweight pattern in `compareStore` (no zustand dep).
 */
import { useSyncExternalStore } from "react";
import type { FilterState, TestRecord, UserProfile } from "@/types/testFinder";
import { EMPTY_FILTERS } from "@/types/testFinder";

const STORAGE_KEY = "mhc:testFinder";

interface State {
  profile: UserProfile | null;
  quizFilters: FilterState | null;
  filters: FilterState;
  recommendations: TestRecord[];
  selectedTestIds: string[];
}

const empty: State = {
  profile: null,
  quizFilters: null,
  filters: { ...EMPTY_FILTERS },
  recommendations: [],
  selectedTestIds: [],
};

let state: State = load();
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...(JSON.parse(raw) as State) };
  } catch {
    return empty;
  }
}

function persist() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function update(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

export const testFinderStore = {
  getState(): State {
    return state;
  },
  setProfile(profile: UserProfile, quizFilters: FilterState) {
    update({ profile, quizFilters, filters: { ...quizFilters } });
  },
  setRecommendations(recs: TestRecord[]) {
    update({ recommendations: recs });
  },
  setFilters(filters: FilterState) {
    update({ filters });
  },
  resetFiltersToQuiz() {
    if (state.quizFilters) update({ filters: { ...state.quizFilters } });
  },
  clearFilters() {
    update({ filters: { ...EMPTY_FILTERS } });
  },
  setSelected(ids: string[]) {
    update({ selectedTestIds: ids });
  },
  toggleSelected(id: string) {
    const next = state.selectedTestIds.includes(id)
      ? state.selectedTestIds.filter((x) => x !== id)
      : [...state.selectedTestIds, id];
    update({ selectedTestIds: next });
  },
  reset() {
    state = { ...empty };
    emit();
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useTestFinder<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => testFinderStore.subscribe(cb),
    () => selector(state),
    () => selector(empty),
  );
}
