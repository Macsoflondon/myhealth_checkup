import { UniversalTestCard } from "@/components/cards/UniversalTestCard";
import { fromMedichecksTest } from "@/lib/universalTestAdapter";

export interface MedichecksTestCardProps {
  id: string;
  testName: string;
  description: string | null;
  tagline?: string | null;
  isNew?: boolean;
  turnaroundDays?: number | null;
  biomarkerCount: number | null;
  rating?: number;
  reviewCount?: number;
  price: number | null;
  sampleType: string | null;
  slug: string;
}

/**
 * MedichecksTestCard — wrapper that renders the universal test card.
 * Prop API preserved for existing callers.
 */
const MedichecksTestCard = (props: MedichecksTestCardProps) => {
  const data = fromMedichecksTest(props);
  return <UniversalTestCard test={data} />;
};

export default MedichecksTestCard;
