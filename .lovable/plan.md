

## Enhanced AI-Powered Assisted Test Finder

Merge the current page-based quiz flow with a more comprehensive, clinically effective questionnaire inspired by the uploaded screenshots. The existing `/assisted-test-finder` page will be upgraded in place -- not replaced -- keeping the same route and page structure but adding more steps, better clinical depth, and AI-powered recommendations using real database data.

### Current state

The existing AssistedTestFinder has only 3 steps (gender, concerns, results) and uses hardcoded mock test data. It does not query the database or use AI.

### What will change

The quiz will expand from 3 steps to 8 steps, query real tests from the `provider_tests` table (305 active tests across 6 providers), and use Lovable AI to generate personalised recommendations with clinical reasoning.

### Quiz flow (8 steps)

```text
Step 1: Welcome
  "Find the Right Health Test for You"
  Privacy notice: "Your answers are not stored"
  [Start Quiz]

Step 2: Who is this for?
  Just me / Someone else / My family

Step 3: Gender
  Male / Female / Non-binary / Prefer not to say

Step 4: Age range
  Under 30 / 30-39 / 40-49 / 50-59 / 60+

Step 5: Main health goal
  General health check / Investigate specific symptoms /
  Preventive screening / Monitor existing condition /
  Fitness and performance optimisation

Step 6: Areas of concern (multi-select)
  Fatigue or low energy / Hormonal changes /
  Heart and cholesterol / Thyroid / Fertility /
  Vitamin deficiencies / Digestive issues /
  Weight management / Sexual health /
  Cancer screening / Liver health /
  Diabetes risk / Bone and joint health /
  Allergies / None -- just a general check

Step 7: Symptoms or context (multi-select, optional)
  Unexplained tiredness / Brain fog or poor concentration /
  Hair loss or skin changes / Irregular periods (if applicable) /
  Joint pain or stiffness / Frequent infections /
  Mood changes or anxiety / Sleep problems /
  Family history of chronic disease / None of the above

Step 8: Practical preferences
  Sample method: Home kit / Clinic visit / Either
  Budget: Under 50 / 50-100 / 100-200 / 200-500 / No preference
  Speed: As fast as possible / Within a week / No rush
```

After Step 8, a loading state shows while the AI analyses answers.

### Results screen

- Top recommendation with "Best Match" badge, price, biomarker count, turnaround, provider name, and 2-3 personalised reasons why it fits
- Two alternative recommendations with tags (e.g. "Best Value", "Most Comprehensive")
- Each result card shows: test name, provider, price, biomarker count, turnaround, sample method
- "Compare These Tests" button linking to compare page with pre-selected tests
- "Change My Answers" link to restart
- Medical disclaimer: "This tool provides general guidance only. It is not a medical diagnosis. Consult your GP for personalised medical advice."

### Design approach

- Keep the existing pink gradient background and page layout
- Add a turquoise progress bar at the top (matching the reference screenshots)
- Step counter: "Step X of 7" with percentage
- Option cards: white background, rounded corners, light border, hover state with brand pink
- Selected state: brand pink background with white text
- Back and Restart buttons remain in same position
- Mobile-first: single column on mobile, 2-3 columns for option grids on desktop
- Smooth transitions between steps

### Technical details

**Modified file: `src/components/tests/AssistedTestFinder.tsx`**
- Expand Step type to include all 8 steps
- Add state for all new answer fields (who, age, goal, factors, symptoms, sampleMethod, budget, speed)
- Add progress bar component
- Replace mock data with AI-powered results
- Add loading state with spinner while AI processes
- Call the new edge function on completion

**New file: `supabase/functions/quiz-recommendations/index.ts`**
- Receives all quiz answers as JSON
- Queries `provider_tests` table for active tests from all 6 providers
- Filters by relevance (e.g. gender-specific tests, budget range, sample method)
- Sends filtered test list + quiz answers to Lovable AI (`google/gemini-3-flash-preview`)
- System prompt instructs AI to act as a UK health screening advisor, rank tests by clinical relevance to the user's profile, and return top 3 with personalised reasons
- Returns structured JSON with recommendations, reasons, and test metadata
- Handles 429/402 rate limit errors
- No authentication required (quiz is anonymous)
- No data is stored

**Modified file: `supabase/config.toml`**
- Add `[functions.quiz-recommendations]` with `verify_jwt = false`

### AI prompt strategy

The edge function prompt will instruct the AI to:
1. Consider the user's age, gender, and health goals to prioritise clinically relevant tests
2. Weight symptom selections (e.g. fatigue + hair loss suggests thyroid panel)
3. Respect budget and sample method preferences
4. Prefer tests with higher biomarker counts when concerns span multiple areas
5. Never suggest a test costs less than its actual database price
6. Provide 2-3 specific reasons per recommendation tied to the user's answers
7. Include a "why not" note for the alternatives (e.g. "More comprehensive but higher cost")
8. Maintain compliance: no diagnostic claims, no outcome promises, always recommend GP consultation for symptoms

### What stays the same

- The `/assisted-test-finder` route
- The page-level layout (not a dialog -- stays as a full page)
- The pink gradient background
- The Back/Restart navigation pattern
- The Hero button still links to `/assisted-test-finder`
