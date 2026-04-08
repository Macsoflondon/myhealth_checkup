import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, MapPin, Clock, Beaker, DollarSign, Award, RefreshCw, Shield } from 'lucide-react';

const HowWeRank = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-lg text-muted-foreground mt-4 text-center">
          myhealth checkup compares diagnostic test providers across the UK to help you make 
          informed health decisions.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Ranking Method
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              By default, results are ordered by <strong>Total Price</strong> (including mandatory fees). 
              You can re-sort results by:
            </p>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Nearest Clinic</strong> – Find providers closest to your location</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Turnaround Time</strong> – Fastest results delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <Beaker className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Most Biomarkers Tested</strong> – Comprehensive testing panels</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We include leading <strong>UKAS-accredited</strong>, <strong>CQC-regulated</strong>, and{' '}
              <strong>ISO 15189-certified</strong> providers. Our comparison does not cover every provider 
              in the UK.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Commercial Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We partner with some providers through affiliate or referral agreements. These relationships{' '}
              <strong>do not influence our data accuracy or ranking</strong>. Sponsored placements are 
              labelled <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-semibold">Ad</span> or{' '}
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-semibold">Sponsored</span> and 
              explained clearly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Data Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Provider data is refreshed <strong>daily</strong> or as frequently as feeds permit. If provider 
              details change after our refresh, the provider's website will contain the most accurate information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Independence
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We operate as an <strong>impartial comparison platform</strong> and do not sell or process 
              diagnostic services ourselves. All tests are provided directly by third-party providers.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-3">CMA Transparency Statement</h3>
          <p className="text-sm text-muted-foreground">
            myhealth checkup operates in full compliance with the <strong>Competition and Markets Authority 
            (CMA)</strong> and the <strong>Digital Markets, Competition and Consumers Act 2024</strong>. 
            Prices include all mandatory fees where known, sponsored listings are clearly marked, and data 
            is refreshed daily for accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowWeRank;
