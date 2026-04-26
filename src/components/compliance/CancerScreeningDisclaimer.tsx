import { AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CancerScreeningDisclaimerProps {
  variant?: 'full' | 'compact' | 'banner';
}

export function CancerScreeningDisclaimer({ variant = 'full' }: CancerScreeningDisclaimerProps) {
  if (variant === 'banner') {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
        <div className="container mx-auto flex items-center gap-3 text-sm text-amber-800 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <p>
            Cancer screening tests are not diagnostic. Results should be discussed with a qualified healthcare professional.
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
          Screening tests are not diagnostic. Always consult a healthcare professional about your results.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 dark:text-amber-200 font-semibold">
        Important Information About Cancer Screening
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2 space-y-2">
        <p>
          Cancer screening tests measure biomarkers that may be elevated in certain cancers. However, these tests are 
          <strong> not diagnostic</strong> and should not be used as a substitute for professional medical advice.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Elevated markers may be caused by non-cancerous conditions</li>
          <li>Normal results do not guarantee the absence of cancer</li>
          <li>Results should always be discussed with a qualified healthcare professional</li>
          <li>Further investigation may be required based on results</li>
        </ul>
        <div className="flex items-center gap-2 pt-2 text-sm">
          <Info className="h-4 w-4" />
          <a 
            href="https://www.nhs.uk/conditions/cancer/symptoms/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Learn more about cancer symptoms on NHS.uk
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </AlertDescription>
    </Alert>
  );
}
