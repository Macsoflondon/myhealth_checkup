/** Every node in the test-finder decision tree. The quiz types its tree
 * against this list, so the server can validate node IDs without importing
 * the quiz component. */
export const QUIZ_NODE_IDS = [
  "gender",
  "m_2",
  "f_2",
  "o_2",
  "m_hormones_symptoms",
  "m_thyroid_diagnosis",
  "m_thyroid_condition_yes",
  "m_thyroid_condition_no",
  "m_fertility",
  "m_nutrition_diet",
  "m_fitness_exercise_type",
  "m_fitness_endurance",
  "m_fitness_strength",
  "m_fitness_mixture",
  "f_hormones_symptoms",
  "f_hormones_symptoms_2",
  "f_thyroid_diagnosis",
  "f_thyroid_condition_yes",
  "f_thyroid_condition_no",
  "f_fertility",
  "f_hormones_menopause",
  "f_hormones_curious",
  "f_nutrition_diet",
  "f_fitness_exercise_type",
  "f_fitness_endurance",
  "f_fitness_strength",
  "f_fitness_mixture",
] as const;

export type QuizNodeId = (typeof QUIZ_NODE_IDS)[number];

export function isQuizNodeId(v: unknown): v is QuizNodeId {
  return typeof v === "string" && (QUIZ_NODE_IDS as readonly string[]).includes(v);
}
