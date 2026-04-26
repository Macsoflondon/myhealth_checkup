/**
 * Formats biomarker count with proper singular/plural grammar
 * @param count - Number of biomarkers (can be null/undefined)
 * @returns Formatted string like "1 biomarker" or "5 biomarkers"
 */
export const formatBiomarkerCount = (count: number | null | undefined): string => {
  const biomarkerCount = count || 0;
  return `${biomarkerCount} ${biomarkerCount === 1 ? 'biomarker' : 'biomarkers'}`;
};
