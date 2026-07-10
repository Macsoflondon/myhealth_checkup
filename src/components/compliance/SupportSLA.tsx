import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, ShieldCheck } from 'lucide-react';

type Props = {
  variant?: 'default' | 'complaints' | 'accessibility';
  className?: string;
};

const targets = {
  default: [
    { label: 'Acknowledgement', time: 'Within 1 business day' },
    { label: 'Substantive response', time: 'Within 3 business days' },
    { label: 'Complex matters resolved', time: 'Within 10 business days' },
  ],
  complaints: [
    { label: 'Acknowledgement of complaint', time: 'Within 1 business day' },
    { label: 'Initial assessment', time: 'Within 5 business days' },
    { label: 'Full written outcome', time: 'Within 20 business days' },
  ],
  accessibility: [
    { label: 'Acknowledgement', time: 'Within 1 business day' },
    { label: 'Initial response with options', time: 'Within 2 business days' },
    { label: 'Remediation plan where required', time: 'Within 15 business days' },
  ],
};

const SupportSLA: React.FC<Props> = ({ variant = 'default', className }) => {
  const items = targets[variant];
  return (
    <Card className={className} aria-label="Support response SLA">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Support Response SLA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          For any enquiry, complaint, accessibility request, or compliance matter, contact us at{' '}
          <a href="mailto:support@myhealthcheckup.co.uk" className="underline font-medium text-foreground">
            support@myhealthcheckup.co.uk
          </a>
          . We monitor this inbox Monday to Friday, 09:00–17:30 UK time, excluding public holidays.
        </p>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.label} className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>
                <strong>{i.label}:</strong> {i.time}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
          <Mail className="h-3.5 w-3.5" />
          <span>
            Targets are commitments, not guarantees. Aligned with our CMA, DMCC Act 2024, GDPR, and
            Equality Act obligations for fair, timely consumer response handling.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportSLA;
