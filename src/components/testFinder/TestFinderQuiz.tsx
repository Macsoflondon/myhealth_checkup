import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, ChevronLeft, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RecommendationResults, type AIAnalysisResult } from "@/components/ai/RecommendationEngine";

import { trackFunnelEvent } from "@/lib/funnelTracking";

// ─── Decision Tree (Medichecks V13 Logic Map) ───────────────────────────────────────

interface DecisionAnswer {
  label: string;
  next_node: string;
  products: string[];
  is_terminal: boolean;
}

interface DecisionNode {
  id: string;
  question: string;
  description: string;
  type: "question" | "terminal" | "terminal_results" | "contact_form";
  answers: DecisionAnswer[];
}

const DECISION_TREE: Record<string, DecisionNode> = {
  gender: {
    id: "gender",
    question: "How would you describe your gender?",
    description: "Your answer will help us find the right test for you.",
    type: "question",
    answers: [
      { label: "Male", next_node: "m_2", products: [], is_terminal: false },
      { label: "Female", next_node: "f_2", products: [], is_terminal: false },
      { label: "Neither", next_node: "o_2", products: [], is_terminal: false },
      { label: "Prefer not to say", next_node: "o_2", products: [], is_terminal: false },
    ],
  },
  m_2: {
    id: "m_2",
    question: "Do you have any health concerns or areas of interest?",
    description: "",
    type: "question",
    answers: [
      { label: "General health check", next_node: "juno_results", products: ["optimal-health-blood-test", "well-man-advanced-blood-test", "health-and-lifestyle-check-blood-test", "core-health-blood-test"], is_terminal: true },
      { label: "Hormones", next_node: "m_hormones_symptoms", products: [], is_terminal: false },
    ],
  },
};
