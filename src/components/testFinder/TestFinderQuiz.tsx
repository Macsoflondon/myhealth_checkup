import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, ChevronLeft, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RecommendationResults, type AIAnalysisResult } from "@/components/ai/RecommendationEngine";

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
      { label: "Thyroid", next_node: "m_thyroid_diagnosis", products: [], is_terminal: false },
      { label: "Fertility", next_node: "m_fertility", products: [], is_terminal: false },
      { label: "Nutrition", next_node: "m_nutrition_diet", products: [], is_terminal: false },
      { label: "Fitness", next_node: "m_fitness_exercise_type", products: [], is_terminal: false },
      { label: "Bowel", next_node: "juno_results", products: ["qfit-bowel-cancer-test"], is_terminal: true },
      { label: "Prostate", next_node: "juno_results", products: ["psa-prostate-specific-antigen-blood-test"], is_terminal: true },
      { label: "Skin", next_node: "juno_results", products: ["skin-iq-blood-test"], is_terminal: true },
      { label: "Weight Management", next_node: "juno_results", products: ["weight-loss-injection-glp-1-monitoring-blood-test"], is_terminal: true },
    ],
  },
  f_2: {
    id: "f_2",
    question: "Do you have any health concerns or areas of interest?",
    description: "",
    type: "question",
    answers: [
      { label: "General health check", next_node: "juno_results", products: ["optimal-health-blood-test", "well-woman-advanced-blood-test", "health-and-lifestyle-check-blood-test", "core-health-blood-test"], is_terminal: true },
      { label: "Hormones", next_node: "f_hormones_symptoms", products: [], is_terminal: false },
      { label: "Thyroid", next_node: "f_thyroid_diagnosis", products: [], is_terminal: false },
      { label: "Fertility", next_node: "f_fertility", products: [], is_terminal: false },
      { label: "Nutrition", next_node: "f_nutrition_diet", products: [], is_terminal: false },
      { label: "Fitness", next_node: "f_fitness_exercise_type", products: [], is_terminal: false },
      { label: "Bowel", next_node: "juno_results", products: ["qfit-bowel-cancer-test"], is_terminal: true },
      { label: "Skin", next_node: "juno_results", products: ["skin-iq-blood-test"], is_terminal: true },
      { label: "Weight Management", next_node: "juno_results", products: ["weight-loss-injection-glp-1-monitoring-blood-test"], is_terminal: true },
    ],
  },
  o_2: {
    id: "o_2",
    question: "Contact form",
    description: "contact_form",
    type: "terminal",
    answers: [],
  },
  m_hormones_symptoms: {
    id: "m_hormones_symptoms",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I am experiencing low libido and/or lack of muscle", next_node: "juno_results", products: ["male-hormone-check-blood-test", "testosterone-blood-test"], is_terminal: true },
      { label: "I am experiencing lack of energy and/or low mood", next_node: "juno_results", products: ["well-man-advanced-blood-test"], is_terminal: true },
      { label: "I struggle to maintain an erection", next_node: "juno_results", products: ["erectile-dysfunction-ed-blood-test"], is_terminal: true },
      { label: "I take testosterone supplements (TRT)", next_node: "juno_results", products: ["trt-check-plus-testosterone-replacement-therapy-blood-test", "male-hormone-check-blood-test", "testosterone-blood-test"], is_terminal: true },
      { label: "I am experiencing male pattern baldness", next_node: "juno_results", products: ["male-hormone-check-blood-test"], is_terminal: true },
      { label: "None apply to me, I just want a hormone MOT", next_node: "juno_results", products: ["ultimate-performance-blood-test", "male-hormone-check-blood-test", "testosterone-blood-test"], is_terminal: true },
    ],
  },
  m_thyroid_diagnosis: {
    id: "m_thyroid_diagnosis",
    question: "Have you been diagnosed with a thyroid condition?",
    description: "",
    type: "question",
    answers: [
      { label: "Yes", next_node: "m_thyroid_condition_yes", products: [], is_terminal: false },
      { label: "No", next_node: "m_thyroid_condition_no", products: [], is_terminal: false },
    ],
  },
  m_thyroid_condition_yes: {
    id: "m_thyroid_condition_yes",
    question: "What do you want to monitor?",
    description: "",
    type: "question",
    answers: [
      { label: "Thyroid function", next_node: "juno_results", products: ["thyroid-function-blood-test", "thyroid-function-antibodies-blood-test"], is_terminal: true },
      { label: "Thyroid function and nutrition", next_node: "juno_results", products: ["advanced-thyroid-function-blood-test"], is_terminal: true },
    ],
  },
  m_thyroid_condition_no: {
    id: "m_thyroid_condition_no",
    question: "Are you experiencing any of the following symptoms?",
    description: "",
    type: "question",
    answers: [
      { label: "Weight gain, fatigue, low mood, sensitivity to cold", next_node: "juno_results", products: ["advanced-thyroid-function-blood-test", "thyroid-function-blood-test", "thyroid-function-antibodies-blood-test"], is_terminal: true },
      { label: "Weight loss, agitation and sensitivity to heat", next_node: "juno_results", products: ["advanced-thyroid-function-blood-test", "thyroid-function-blood-test", "thyroid-function-antibodies-blood-test"], is_terminal: true },
      { label: "No, but have a family history of thyroid disorders", next_node: "juno_results", products: ["thyroid-function-antibodies-blood-test", "thyroid-function-blood-test"], is_terminal: true },
      { label: "None of these apply / just curious", next_node: "juno_results", products: ["well-man-advanced-blood-test", "advanced-thyroid-function-blood-test", "thyroid-function-blood-test"], is_terminal: true },
    ],
  },
  m_fertility: {
    id: "m_fertility",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I'm worried about my testosterone levels", next_node: "juno_results", products: ["testosterone-blood-test", "male-hormone-check-blood-test"], is_terminal: true },
      { label: "I have a low libido", next_node: "juno_results", products: ["well-man-advanced-blood-test", "male-hormone-check-blood-test", "testosterone-blood-test"], is_terminal: true },
      { label: "I'm about to start IVF", next_node: "juno_results", products: ["ivf-fertility-viral-screen"], is_terminal: true },
      { label: "I'm thinking about having children in the future", next_node: "juno_results", products: ["male-fertility-hormones-blood-test"], is_terminal: true },
      { label: "None of these apply / just curious", next_node: "juno_results", products: ["male-fertility-hormones-blood-test"], is_terminal: true },
    ],
  },
  m_nutrition_diet: {
    id: "m_nutrition_diet",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I eat a plant-based diet", next_node: "juno_results", products: ["vitamin-b12-active-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "I think my diet could be healthier", next_node: "juno_results", products: ["health-and-lifestyle-check-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "I want to monitor my vitamin and nutrient levels", next_node: "juno_results", products: ["health-and-lifestyle-check-blood-test", "vitamin-d-25-oh-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "I eat a keto/paleo/low carb diet", next_node: "juno_results", products: ["ultimate-performance-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "My health condition affects my diet and nutrition", next_node: "juno_results", products: ["well-man-advanced-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "I'm experiencing symptoms such as low energy", next_node: "juno_results", products: ["well-man-advanced-blood-test", "vitamin-d-25-oh-blood-test", "tiredness-and-fatigue-check-blood-test"], is_terminal: true },
      { label: "None of the above", next_node: "juno_results", products: ["well-man-advanced-blood-test"], is_terminal: true },
    ],
  },
  m_fitness_exercise_type: {
    id: "m_fitness_exercise_type",
    question: "What kind of exercise do you do?",
    description: "",
    type: "question",
    answers: [
      { label: "Endurance sports", next_node: "m_fitness_endurance", products: [], is_terminal: false },
      { label: "Strength training", next_node: "m_fitness_strength", products: [], is_terminal: false },
      { label: "A mix of strength and endurance", next_node: "m_fitness_mixture", products: [], is_terminal: false },
      { label: "Gym / exercise classes", next_node: "juno_results", products: ["ultimate-performance-blood-test", "baseline-fitness-blood-test", "advanced-fitness-blood-test"], is_terminal: true },
      { label: "None of these / I want to transform my fitness", next_node: "juno_results", products: ["well-man-advanced-blood-test", "ultimate-performance-blood-test", "baseline-fitness-blood-test"], is_terminal: true },
    ],
  },
  m_fitness_endurance: {
    id: "m_fitness_endurance",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I want to be in the best shape for my training", next_node: "juno_results", products: ["ultimate-performance-blood-test", "baseline-fitness-blood-test"], is_terminal: true },
      { label: "I have concerns about my performance", next_node: "juno_results", products: ["ultimate-performance-blood-test"], is_terminal: true },
    ],
  },
  m_fitness_strength: {
    id: "m_fitness_strength",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I want to be in the best shape for my training", next_node: "juno_results", products: ["ultimate-performance-blood-test", "baseline-fitness-blood-test", "advanced-fitness-blood-test"], is_terminal: true },
      { label: "I have concerns about my performance", next_node: "juno_results", products: ["ultimate-performance-blood-test", "sports-hormone-check-blood-test"], is_terminal: true },
      { label: "I take testosterone supplements", next_node: "juno_results", products: ["trt-check-plus-testosterone-replacement-therapy-blood-test", "male-hormone-check-blood-test", "ultimate-performance-blood-test", "sports-hormone-check-blood-test"], is_terminal: true },
      { label: "I want to optimise my physique", next_node: "juno_results", products: ["ultimate-performance-blood-test", "male-hormone-check-blood-test", "testosterone-blood-test"], is_terminal: true },
    ],
  },
  m_fitness_mixture: {
    id: "m_fitness_mixture",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I want to be in the best shape for my training", next_node: "juno_results", products: ["ultimate-performance-blood-test", "baseline-fitness-blood-test", "advanced-fitness-blood-test"], is_terminal: true },
      { label: "I have concerns about my performance", next_node: "juno_results", products: ["ultimate-performance-blood-test", "sports-hormone-check-blood-test"], is_terminal: true },
      { label: "I take testosterone supplements", next_node: "juno_results", products: ["trt-check-plus-testosterone-replacement-therapy-blood-test", "ultimate-performance-blood-test", "male-hormone-check-blood-test", "sports-hormone-check-blood-test"], is_terminal: true },
      { label: "I want to optimise my physique", next_node: "juno_results", products: ["ultimate-performance-blood-test", "male-hormone-check-blood-test", "testosterone-blood-test"], is_terminal: true },
    ],
  },
  f_hormones_symptoms: {
    id: "f_hormones_symptoms",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I have symptoms that may be hormone-related", next_node: "f_hormones_symptoms_2", products: [], is_terminal: false },
      { label: "I am interested in my fertility", next_node: "f_fertility", products: [], is_terminal: false },
      { label: "I am going through or have been through menopause", next_node: "f_hormones_menopause", products: [], is_terminal: false },
      { label: "I am just curious about my hormones", next_node: "f_hormones_curious", products: [], is_terminal: false },
    ],
  },
  f_hormones_symptoms_2: {
    id: "f_hormones_symptoms_2",
    question: "Are you experiencing any of the following?",
    description: "",
    type: "question",
    answers: [
      { label: "Hot flushes, night sweats and mood swings", next_node: "juno_results", products: ["female-hormone-check-blood-test", "menopause-check-blood-test"], is_terminal: true },
      { label: "Changes to my menstrual cycle such as heavier or irregular periods", next_node: "juno_results", products: ["female-hormone-check-blood-test", "thyroid-function-blood-test", "polycystic-ovary-syndrome-check-blood-test"], is_terminal: true },
      { label: "Irregular periods, acne, oily skin and increased body hair", next_node: "juno_results", products: ["polycystic-ovary-syndrome-check-blood-test"], is_terminal: true },
      { label: "Weight gain, low mood, low energy and sensitivity to cold", next_node: "juno_results", products: ["advanced-thyroid-function-blood-test", "thyroid-function-blood-test", "thyroid-function-antibodies-blood-test"], is_terminal: true },
    ],
  },
  f_thyroid_diagnosis: {
    id: "f_thyroid_diagnosis",
    question: "Have you been diagnosed with a thyroid condition?",
    description: "",
    type: "question",
    answers: [
      { label: "Yes", next_node: "f_thyroid_condition_yes", products: [], is_terminal: false },
      { label: "No", next_node: "f_thyroid_condition_no", products: [], is_terminal: false },
    ],
  },
  f_thyroid_condition_yes: {
    id: "f_thyroid_condition_yes",
    question: "What do you want to monitor?",
    description: "",
    type: "question",
    answers: [
      { label: "Thyroid function", next_node: "juno_results", products: ["thyroid-function-blood-test", "thyroid-function-antibodies-blood-test"], is_terminal: true },
      { label: "Thyroid function and nutrition", next_node: "juno_results", products: ["advanced-thyroid-function-blood-test"], is_terminal: true },
    ],
  },
  f_thyroid_condition_no: {
    id: "f_thyroid_condition_no",
    question: "Are you experiencing any of the following symptoms?",
    description: "",
    type: "question",
    answers: [
      { label: "Weight gain, fatigue, low mood, sensitivity to cold", next_node: "juno_results", products: ["advanced-thyroid-function-blood-test", "thyroid-function-blood-test", "thyroid-function-antibodies-blood-test"], is_terminal: true },
      { label: "Weight loss, agitation and sensitivity to heat", next_node: "juno_results", products: ["advanced-thyroid-function-blood-test", "thyroid-function-blood-test", "thyroid-function-antibodies-blood-test"], is_terminal: true },
      { label: "No, but have a family history of thyroid disorders", next_node: "juno_results", products: ["thyroid-function-antibodies-blood-test", "thyroid-function-blood-test"], is_terminal: true },
      { label: "None of these apply / just curious", next_node: "juno_results", products: ["well-woman-advanced-blood-test", "advanced-thyroid-function-blood-test", "thyroid-function-blood-test"], is_terminal: true },
    ],
  },
  f_fertility: {
    id: "f_fertility",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I want to check if I am pregnant", next_node: "juno_results", products: ["pregnancy-blood-test"], is_terminal: true },
      { label: "I'm planning to get pregnant / thinking about children in the future", next_node: "juno_results", products: ["well-woman-advanced-blood-test", "advanced-female-fertility-blood-test"], is_terminal: true },
      { label: "I am planning to start IVF", next_node: "juno_results", products: ["anti-mullerian-hormone-amh-blood-test", "ivf-fertility-viral-screen", "advanced-female-fertility-blood-test"], is_terminal: true },
      { label: "I am currently pregnant", next_node: "juno_results", products: ["pregnancy-progress-blood-test"], is_terminal: true },
      { label: "I've recently had a baby", next_node: "juno_results", products: ["well-woman-advanced-blood-test"], is_terminal: true },
    ],
  },
  f_hormones_menopause: {
    id: "f_hormones_menopause",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I am taking HRT", next_node: "juno_results", products: ["hrt-check-blood-test"], is_terminal: true },
      { label: "I am experiencing symptoms such as hot flushes, night sweats and mood swings", next_node: "juno_results", products: ["menopause-check-blood-test"], is_terminal: true },
    ],
  },
  f_hormones_curious: {
    id: "f_hormones_curious",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I want to monitor my hormone levels over time", next_node: "juno_results", products: ["female-hormone-check-blood-test", "female-hormone-check-advanced-blood-test"], is_terminal: true },
      { label: "I want reassurance that my hormone levels are right for me", next_node: "juno_results", products: ["female-hormone-check-blood-test", "female-hormone-check-advanced-blood-test"], is_terminal: true },
    ],
  },
  f_nutrition_diet: {
    id: "f_nutrition_diet",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I eat a plant-based diet", next_node: "juno_results", products: ["vitamin-b12-active-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "I think my diet could be healthier", next_node: "juno_results", products: ["health-and-lifestyle-check-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "I want to monitor my vitamin and nutrient levels", next_node: "juno_results", products: ["vitamin-d-25-oh-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "I eat a keto/paleo/low carb diet", next_node: "juno_results", products: ["ultimate-performance-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "My condition means I eat a restrictive diet", next_node: "juno_results", products: ["well-woman-advanced-blood-test", "nutrition-check-blood-test"], is_terminal: true },
      { label: "I'm experiencing symptoms such as low energy", next_node: "juno_results", products: ["well-woman-advanced-blood-test", "iron-deficiency-check-blood-test", "tiredness-and-fatigue-check-blood-test"], is_terminal: true },
      { label: "None of the above", next_node: "juno_results", products: ["well-woman-advanced-blood-test"], is_terminal: true },
    ],
  },
  f_fitness_exercise_type: {
    id: "f_fitness_exercise_type",
    question: "What kind of exercise do you do?",
    description: "",
    type: "question",
    answers: [
      { label: "Endurance sport", next_node: "f_fitness_endurance", products: [], is_terminal: false },
      { label: "Strength training", next_node: "f_fitness_strength", products: [], is_terminal: false },
      { label: "A mixture of strength and endurance", next_node: "f_fitness_mixture", products: [], is_terminal: false },
      { label: "Gym / exercise classes", next_node: "juno_results", products: ["baseline-fitness-blood-test", "advanced-fitness-blood-test"], is_terminal: true },
      { label: "None of these / I want to transform my fitness", next_node: "juno_results", products: ["well-woman-advanced-blood-test", "baseline-fitness-blood-test", "advanced-fitness-blood-test"], is_terminal: true },
    ],
  },
  f_fitness_endurance: {
    id: "f_fitness_endurance",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I want to be in the best shape for my training", next_node: "juno_results", products: ["baseline-fitness-blood-test"], is_terminal: true },
      { label: "I have concerns about my performance", next_node: "juno_results", products: ["ultimate-performance-blood-test"], is_terminal: true },
    ],
  },
  f_fitness_strength: {
    id: "f_fitness_strength",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I want to be in the best shape for my training", next_node: "juno_results", products: ["ultimate-performance-blood-test", "baseline-fitness-blood-test", "advanced-fitness-blood-test"], is_terminal: true },
      { label: "I have concerns about my performance", next_node: "juno_results", products: ["ultimate-performance-blood-test", "advanced-fitness-blood-test"], is_terminal: true },
      { label: "I want to optimise my physique", next_node: "juno_results", products: ["ultimate-performance-blood-test"], is_terminal: true },
    ],
  },
  f_fitness_mixture: {
    id: "f_fitness_mixture",
    question: "Which of these most applies to you?",
    description: "",
    type: "question",
    answers: [
      { label: "I want to be in the best shape for my training", next_node: "juno_results", products: ["ultimate-performance-blood-test", "baseline-fitness-blood-test", "advanced-fitness-blood-test"], is_terminal: true },
      { label: "I have concerns about my progress", next_node: "juno_results", products: ["ultimate-performance-blood-test", "advanced-fitness-blood-test"], is_terminal: true },
    ],
  },
};

// ─── Types ──────────────────────────────────────────────────────────────────────

interface HistoryEntry {
  nodeId: string;
  answerLabel: string;
}

// ─── Analysing State ────────────────────────────────────────────────────────────

const AnalysingState = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-6"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#22c0d4] to-[#0a2540] animate-pulse flex items-center justify-center">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-[#22c0d4]/30 animate-ping" />
      </div>
      <div>
        <h3
          className="text-xl font-bold text-[#081129] mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Clinically analysing your results{".".repeat(dots)}
        </h3>
        <p className="text-[#081129]/60 text-sm max-w-sm mx-auto">
          Cross-referencing your profile with our accredited provider database to find your optimal wellness panel.
        </p>
      </div>
      <div className="w-64 h-1.5 bg-[#081129]/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#22c0d4] to-[#0a2540] rounded-full"
          animate={{ width: ["20%", "80%", "20%"], marginLeft: ["0%", "10%", "0%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

// ─── Contact Form Fallback ──────────────────────────────────────────────────────

const ContactFallback = ({ onRestart }: { onRestart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12 px-6 space-y-4"
  >
    <h3
      className="text-xl font-bold text-[#081129]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      To make sure we direct you to the correct test
    </h3>
    <p className="text-[#081129]/60 text-sm max-w-md mx-auto">
      We recommend contacting our customer care team — we're always happy to help.
    </p>
    <div className="pt-4">
      <a
        href="mailto:support@myhealthcheckup.co.uk"
        className="inline-flex items-center gap-2 bg-[#22c0d4] hover:bg-[#1aa8bb] text-[#081129] font-semibold text-sm px-6 py-3 rounded-full transition-colors"
      >
        Contact us
      </a>
    </div>
    <button
      type="button"
      onClick={onRestart}
      className="text-sm text-[#081129]/50 hover:text-[#081129] underline mt-4 block mx-auto"
    >
      Start over
    </button>
  </motion.div>
);

// ─── Additional Context Step ────────────────────────────────────────────────────

interface AdditionalContextProps {
  userContext: string;
  onContextChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const AdditionalContextStep = ({ userContext, onContextChange, onSubmit, onBack }: AdditionalContextProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white border border-[#081129]/10 rounded-2xl p-5 sm:p-8 space-y-6"
  >
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-5 w-5 text-[#22c0d4]" />
        <h2
          className="text-xl sm:text-2xl font-bold text-[#081129]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Additional Context
        </h2>
      </div>
      <p className="text-[#081129]/60 text-sm max-w-md mx-auto">
        Help our AI provide more personalised recommendations
      </p>
    </div>

    <div className="space-y-3">
      <label
        htmlFor="specific-concerns"
        className="block text-sm font-medium text-[#081129]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Any specific concerns or details about your lifestyle you would like the AI to assess? (e.g., symptoms, diet, or specific goals)
      </label>
      <textarea
        id="specific-concerns"
        value={userContext}
        onChange={(e) => onContextChange(e.target.value)}
        placeholder="E.g. I've been feeling fatigued for the past 3 months, I follow a vegan diet, I'm training for a marathon..."
        className="w-full min-h-[160px] p-4 rounded-xl border-2 border-[#081129]/12 bg-white text-[#081129] text-sm placeholder:text-[#081129]/40 focus:border-[#22c0d4] focus:ring-2 focus:ring-[#22c0d4]/20 outline-none transition-all resize-y"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      />
    </div>

    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
      <button
        type="button"
        onClick={onSubmit}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#22c0d4] to-[#0a2540] hover:from-[#1aa8bb] hover:to-[#081129] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Brain className="w-4 h-4" />
        See Results
      </button>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[#081129]/60 hover:text-[#081129] text-sm transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  </motion.div>
);

// ─── Main Quiz Component ────────────────────────────────────────────────────────

export const TestFinderQuiz = () => {
  const [currentNodeId, setCurrentNodeId] = useState("gender");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [direction, setDirection] = useState(1);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [showContextStep, setShowContextStep] = useState(false);
  const [userContext, setUserContext] = useState("");
  const [pendingPathLabels, setPendingPathLabels] = useState<string[]>([]);
  const [pendingGender, setPendingGender] = useState<string | null>(null);

  const currentNode = DECISION_TREE[currentNodeId];
  const stepCount = history.length + 1;
  const progress = Math.min(19 + history.length * 10, 100);

  const genderFromHistory = (): string | null => {
    const genderEntry = history.find((h) => h.nodeId === "gender");
    if (!genderEntry) return null;
    const label = genderEntry.answerLabel.toLowerCase();
    if (label === "male") return "male";
    if (label === "female") return "female";
    return null;
  };

  const buildPathLabels = (finalAnswer: string): string[] => {
    return [...history.map((h) => h.answerLabel), finalAnswer];
  };

  const submitToAI = async (pathLabels: string[], gender: string | null, context: string) => {
    setIsAnalysing(true);

    const pathString = pathLabels.join(" \u2192 ");
    const queryText = context.trim()
      ? `Path: ${pathString} | User Context: ${context.trim()}`
      : `Path: ${pathString}`;

    try {
      const { data, error } = await supabase.functions.invoke("ai-human-context", {
        body: {
          query_text: queryText,
          gender: gender,
          age: null,
          method_preference: null,
        },
      });

      if (error) throw error;
      setAiResult(data as AIAnalysisResult);
    } catch {
      toast.error("Unable to generate recommendations. Please try again.");
      setIsAnalysing(false);
    }
  };

  const handleAnswer = (answer: DecisionAnswer) => {
    if (answer.is_terminal) {
      const pathLabels = buildPathLabels(answer.label);
      const gender = genderFromHistory() ?? (history.length === 0 && answer.label.toLowerCase() === "male" ? "male" : answer.label.toLowerCase() === "female" ? "female" : null);

      setHistory((prev) => [...prev, { nodeId: currentNodeId, answerLabel: answer.label }]);
      setPendingPathLabels(pathLabels);
      setPendingGender(gender);
      setShowContextStep(true);
    } else if (answer.next_node === "o_2") {
      setHistory((prev) => [...prev, { nodeId: currentNodeId, answerLabel: answer.label }]);
      setDirection(1);
      setCurrentNodeId("o_2");
    } else {
      setHistory((prev) => [...prev, { nodeId: currentNodeId, answerLabel: answer.label }]);
      setDirection(1);
      setCurrentNodeId(answer.next_node);
    }
  };

  const handleContextSubmit = () => {
    setShowContextStep(false);
    submitToAI(pendingPathLabels, pendingGender, userContext);
  };

  const handleContextBack = () => {
    setShowContextStep(false);
    setPendingPathLabels([]);
    setPendingGender(null);
    // Pop the last history entry (the terminal answer) and go back
    const prev = [...history];
    const last = prev.pop()!;
    setHistory(prev);
    setDirection(-1);
    setCurrentNodeId(last.nodeId);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prev = [...history];
    const last = prev.pop()!;
    setHistory(prev);
    setDirection(-1);
    setCurrentNodeId(last.nodeId);
  };

  const handleRestart = () => {
    setHistory([]);
    setCurrentNodeId("gender");
    setDirection(1);
    setIsAnalysing(false);
    setAiResult(null);
    setShowContextStep(false);
    setUserContext("");
    setPendingPathLabels([]);
    setPendingGender(null);
  };

  // ─── Additional Context step ───
  if (showContextStep) {
    return (
      <AdditionalContextStep
        userContext={userContext}
        onContextChange={setUserContext}
        onSubmit={handleContextSubmit}
        onBack={handleContextBack}
      />
    );
  }

  // ─── Loading state ───
  if (isAnalysing && !aiResult) {
    return (
      <div className="bg-white border border-[#081129]/10 rounded-2xl overflow-hidden">
        <AnalysingState />
      </div>
    );
  }

  // ─── Results ───
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
            onClick={handleRestart}
            className="inline-flex items-center gap-2 text-sm text-[#081129]/60 hover:text-[#081129] underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake quiz
          </button>
        </div>
      </div>
    );
  }

  // ─── Contact form ───
  if (currentNode?.type === "terminal" || currentNode?.type === "contact_form") {
    return (
      <div className="bg-white border border-[#081129]/10 rounded-2xl overflow-hidden">
        <ContactFallback onRestart={handleRestart} />
      </div>
    );
  }

  // ─── Quiz question ───
  return (
    <div className="bg-white border border-[#081129]/10 rounded-2xl p-5 sm:p-8 space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[11px] uppercase tracking-wide text-[#081129]/50 mb-2">
          <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Step {stepCount}
          </span>
          <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {progress}%
          </span>
        </div>
        <div className="h-1.5 bg-[#081129]/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#22c0d4] to-[#0a2540] rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question with slide animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentNodeId}
          custom={direction}
          initial={{ x: direction * 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="space-y-4"
        >
          <div>
            <h2
              className="text-[#081129] text-xl sm:text-2xl font-bold"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {currentNode?.question}
            </h2>
            {currentNode?.description && (
              <p className="text-[#081129]/60 text-sm mt-2">
                {currentNode.description}
              </p>
            )}
          </div>

          {/* Answer chips */}
          <div className="flex flex-wrap gap-3 pt-2">
            {currentNode?.answers.map((answer) => (
              <button
                key={answer.label}
                type="button"
                onClick={() => handleAnswer(answer)}
                className="text-sm sm:text-base px-5 py-3 rounded-full border-2 border-[#081129]/12 bg-white text-[#081129] hover:border-[#22c0d4] hover:bg-[#22c0d4]/5 active:scale-95 transition-all duration-150 min-h-[48px] font-medium shadow-sm hover:shadow-md"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {answer.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Back button */}
      {history.length > 0 && (
        <div className="pt-4 border-t border-[#081129]/10">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-[#081129]/60 hover:text-[#081129] text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      )}
    </div>
  );
};
