import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, Scale, FileText } from 'lucide-react';
import PageHeading from '@/components/ui/page-heading';

const FairTradingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <PageHeading 
          title="Fair Trading &" 
          accent="Consumer Transparency Policy" 
        />
        <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground mt-4 justify-center">
          <p><strong>Effective Date:</strong> 14 October 2025</p>
          <span className="hidden sm:inline">•</span>
          <p><strong>Review Date:</strong> 14 October 2026</p>
        </div>
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm"><strong>Company:</strong> MyHealthCheckup Ltd (Company No. 16589056)</p>
          <p className="text-sm"><strong>Trading Name:</strong> myhealth checkup</p>
          <p className="text-sm"><strong>Registered Office:</strong> Clapham, London, United Kingdom</p>
          <p className="text-sm"><strong>Telephone:</strong> 07776330508</p>
          <p className="text-sm"><strong>Website:</strong> <a href="https://myhealthcheckup.co.uk" className="text-primary hover:underline">https://myhealthcheckup.co.uk</a></p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              1. Our Commitment
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              At myhealth checkup, we are dedicated to upholding the highest standards of transparency, 
              honesty, and fairness in full alignment with the <strong>Consumer Protection from Unfair Trading 
              Regulations 2008 (CPRs)</strong> and the <strong>Digital Markets, Competition and Consumers Act 2024 
              (DMCC)</strong>. Our purpose is to empower individuals to make informed health decisions with clarity 
              and confidence. We are committed to accurate, impartial, and responsible presentation of all 
              information displayed on our platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              2. Scope
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              This policy governs: the operation of our comparison platform, including how we display, rank, 
              and compare providers; all commercial and affiliate relationships with partner laboratories or 
              health testing providers; and our consumer communications, advertising, and digital marketing 
              activity. It applies across the United Kingdom, including England, Scotland, Wales, and 
              Northern Ireland.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              3. Compliance with the Consumer Protection from Unfair Trading Regulations 2008 (CPRs)
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We ensure that all information displayed on our platform is accurate, transparent, and not 
              misleading. Mandatory fees, commercial relationships, and coverage limitations are disclosed 
              clearly. Reviews and endorsements are authentic and verifiable, and our marketing complies 
              with Advertising Standards Authority (ASA) and CMA requirements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              4. Compliance with the Digital Markets, Competition and Consumers Act 2024 (DMCC)
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We provide total price transparency, avoid manipulative design practices, and ensure fair 
              competition. Our provider data is refreshed regularly, and we prohibit parity clauses or MFN 
              terms. Subscription and membership features will include full pre-contract information, clear 
              cancellation processes, and renewal reminders.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Consumer Rights and Complaints</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Consumers may contact our Compliance Team via{' '}
              <a href="mailto:compliance@myhealthcheckup.co.uk" className="text-primary hover:underline">
                compliance@myhealthcheckup.co.uk
              </a>{' '}
              or write to Compliance Department, MyHealthCheckup Ltd, Clapham, London, United Kingdom. 
              Complaints are acknowledged within 10 working days and investigated thoroughly. If 
              unresolved, consumers may refer the matter to the Competition and Markets Authority (CMA) 
              or Trading Standards.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Ongoing Review</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              This policy is reviewed annually or whenever legislation or CMA guidance changes. We work 
              with legal and regulatory advisers to ensure continuous compliance with UK consumer 
              protection and competition law.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Contact</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>For any queries regarding this policy:</p>
            <ul className="list-none space-y-1 pl-0">
              <li><strong>Email:</strong> <a href="mailto:legal@myhealthcheckup.co.uk" className="text-primary hover:underline">legal@myhealthcheckup.co.uk</a></li>
              <li><strong>Telephone:</strong> 07776330508</li>
              <li><strong>Registered Office:</strong> Clapham, London, United Kingdom</li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20 text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            Your health. Your choice. One trusted platform.
          </p>
          <p className="text-sm text-muted-foreground italic">
            At myhealth checkup, transparency isn't a feature — it's our foundation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FairTradingPolicy;
