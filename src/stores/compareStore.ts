/**
 * Lightweight cross-page compare selection store.
 * Persisted to localStorage, subscribable via useSyncExternalStore.
 */
import { useSyncExternalStore } from "react";
import type { CompareTestData } from "@/types";

const STORAGE_KEY = "mhc:compare";

let items: CompareTestData[] = load();
const listeners = new Set<() => void>();

function load(): CompareTestData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CompareTestData[]) : [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota / private mode — ignore */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      items = load();
      listeners.forEach((l) => l());
    }
  });
}

export const compareStore = {
  getAll(): CompareTestData[] {
    return items;
  },
  has(id: string): boolean {
    return items.some((t) => t.id === id);
  },
  add(test: CompareTestData) {
    if (items.some((t) => t.id === test.id)) return;
    items = [...items, test];
    emit();
  },
  remove(id: string) {
    const next = items.filter((t) => t.id !== id);
    if (next.length === items.length) return;
    items = next;
    emit();
  },
  toggle(test: CompareTestData) {
    if (this.has(test.id)) this.remove(test.id);
    else this.add(test);
  },
  set(next: CompareTestData[]) {
    items = next;
    emit();
  },
  clear() {
    if (items.length === 0) return;
    items = [];
    emit();
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useCompareItems(): CompareTestData[] {
  return useSyncExternalStore(
    (cb) => compareStore.subscribe(cb),
    () => compareStore.getAll(),
    () => [],
  );
}
