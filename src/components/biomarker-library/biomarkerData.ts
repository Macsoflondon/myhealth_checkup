// biomarkerData.ts — aggregator for the Biomarker Library
// Add further chunks as they arrive and spread them into the biomarkers array.

import { biomarkersChunk1 } from "./biomarkersChunk1";
import { biomarkersChunk2 } from "./biomarkersChunk2";
import { biomarkersChunk3 } from "./biomarkersChunk3";
import { biomarkersChunk4 } from "./biomarkersChunk4";
import { biomarkersChunk5 } from "./biomarkersChunk5";


export const COLORS = {
  navy: "#081129",
  accent: "#22c0d4",
  accentLight: "#e6f9fc",
  pink: "#e70d69",
  text: "#1f2937",
  muted: "#64748b",
  border: "#e2e8f0",
  lightBg: "#f6f8fb",
  low: "#2563eb",
  lowBg: "#dbeafe",
  normal: "#059669",
  normalBg: "#d1fae5",
  warn: "#d97706",
  warnBg: "#fef3c7",
  high: "#dc2626",
  highBg: "#fee2e2",
};

export const biomarkers: any[] = [
  ...biomarkersChunk1,
  ...biomarkersChunk2,
  ...biomarkersChunk3,
  ...biomarkersChunk4,
];


export const categoryIcons: Record<string, string> = {
  All: "🧬",
  "Full Blood Count": "🩸",
  "Liver Function": "🫁",
  "Kidney Function": "🩺",
  "Thyroid": "🦋",
  "Hormones": "⚡",
  "Vitamins & Minerals": "💊",
  "Cardiovascular": "❤️",
  "Diabetes & Metabolic": "🍬",
  "Inflammation": "🔥",
  "Cancer Markers": "🎗️",
  "Nutrition": "🥗",
  "Immunity": "🛡️",
};

const derivedCategories = Array.from(new Set(biomarkers.map((b: any) => b.category))).sort();
export const categories: string[] = ["All", ...derivedCategories];
