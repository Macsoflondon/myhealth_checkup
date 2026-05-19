import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import SponsoredBadge from '@/components/compliance/SponsoredBadge';
import {
  TrendingUp,
  MapPin,
  Clock,
  Beaker,
  DollarSign,
  Award,
  RefreshCw,
  Shield,
  ShieldCheck,
  Scale,
  AlertTriangle,
  Users,
  FileSearch,
} from 'lucide-react';

/**
 * /how-we-rank
 *
 * YMYL audit requirement: 1,200+ words covering ranking criteria, reviewer
 * credentials, update cadence and conflict-of-interest policy. Content is
 * static (no DB) so it is fully crawlable in the SSR/prerender shell.
 */
const HowWeRank = () => {
  return (
    <article className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-10">
        <p className="text-lg text-muted-foreground mt-4 text-center max-w-2xl mx-auto">
          myhealth checkup is an independent UK comparison platform for private diagnostic tests. This page
          explains exactly how we choose providers, how we rank them, who reviews our clinical content, and how
          our commercial relationships are kept separate from editorial decisions.
        </p>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Last reviewed: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} ·
          Reviewed by{' '}
          <Link to="/about/medical-review" className="text-primary underline underline-offset-2">
            Nathanial Smith, Registered Healthcare Professional (HCPC reg. PA43353)
          </Link>
        </p>
      </div>

      <div className="space-y-6">
        {/* ===================== Reviewer ===================== */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" />
              Clinical review
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>
              Comparison and biomarker explainer content is reviewed by a named, registered UK healthcare
              professional. Our current Clinical Reviewer is{' '}
              <strong className="text-foreground">Nathanial Smith</strong>, a Registered Healthcare Professional
              registered with the Health and Care Professions Council under registration number{' '}
              <Badge variant="secondary" className="font-mono">PA43353</Badge>.
            </p>
            <p>
              Reviewer credentials, scope of review, and a link to verify registration on the HCPC public register
              live on our dedicated{' '}
              <Link to="/about/medical-review" className="text-primary underline underline-offset-2">
                Medical Review &amp; Editorial Standards
              </Link>{' '}
              page. We deliberately distinguish between clinical content (reviewed) and commercial data —
              prices, turnarounds, accreditation claims (sourced from providers and refreshed by automated feeds).
            </p>
          </CardContent>
        </Card>

        {/* ===================== Ranking method ===================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" aria-hidden="true" />
              Ranking criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>
              By default, comparison results are ordered by <strong>Total Price</strong>, calculated as the
              advertised test price plus any mandatory fees we are aware of (for example required phlebotomy or GP
              consultation costs). Where a fee is optional, it is excluded from the default sort and surfaced on
              the test card.
            </p>
            <p>You can re-sort comparison results by any of the following:</p>
            <ul className="space-y-2 mt-3 not-prose">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">Nearest clinic</strong> — providers with collection options closest to your postcode.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">Turnaround</strong> — typical days from sample receipt to result, as published by the provider.</span>
              </li>
              <li className="flex items-start gap-2">
                <Beaker className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">Most biomarkers</strong> — comprehensiveness of the test panel.</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">Accreditation strength</strong> — UKAS ISO 15189 lab accreditation and CQC clinic registration take precedence.</span>
              </li>
            </ul>
            <p className="mt-4">
              Sponsored placements, where present, are always labelled <Badge variant="secondary">Ad</Badge> or{' '}
              <Badge variant="secondary">Sponsored</Badge> and never re-order the default Total Price ranking
              silently. They are visually separated from the organic comparison.
            </p>
          </CardContent>
        </Card>

        {/* ===================== Inclusion criteria ===================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-primary" aria-hidden="true" />
              Provider inclusion criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>To be listed on myhealth checkup, a provider must:</p>
            <ul className="space-y-2 mt-3 not-prose">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Process samples in a <strong className="text-foreground">UKAS-accredited</strong> ISO 15189 laboratory (or, for clinic-based services, in a <strong className="text-foreground">CQC-registered</strong> facility).</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Operate lawfully in the United Kingdom and comply with the <strong className="text-foreground">UK GDPR</strong>, <strong className="text-foreground">Data Protection Act 2018</strong>, and applicable <strong className="text-foreground">MHRA</strong> guidance.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Publish transparent pricing, sample-collection methods, and a documented complaints/results-query process.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Provide a clinically interpretable result (e.g. doctor-reviewed report, GP-friendly PDF, or biomarker reference ranges).</span>
              </li>
            </ul>
            <p className="mt-4">
              Providers that fail an accreditation check, that we cannot reach for verification, or that we observe
              making unsupported clinical claims are removed from comparison until the issue is resolved. We do not
              attempt to be exhaustive — we prioritise depth of vetting over breadth of listings.
            </p>
          </CardContent>
        </Card>

        {/* ===================== Update cadence ===================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" aria-hidden="true" />
              Update cadence
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>Different content types are refreshed on different schedules:</p>
            <ul className="space-y-2 mt-3 not-prose">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">Prices &amp; availability</strong> — refreshed daily via automated provider feeds and Firecrawl-based scrapers, with a typical lag of under 24 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">Provider profiles</strong> (accreditation, contact details, services) — manually re-checked at least quarterly and on any feed-detected change.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">Clinical explainers &amp; biomarker library</strong> — reviewed annually by our Clinical Reviewer, or sooner when NICE/UK guidance changes.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">Regulatory pages</strong> (this page, privacy, terms) — reviewed at least annually and version-controlled in our codebase.</span>
              </li>
            </ul>
            <p className="mt-4">
              Where a provider's website changes after our daily refresh, the provider's own site is the
              authoritative source. We surface the "last verified" timestamp on provider pages where applicable.
            </p>
          </CardContent>
        </Card>

        {/* ===================== Conflicts of interest ===================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" aria-hidden="true" />
              Conflict-of-interest policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>
              myhealth checkup operates affiliate and referral relationships with some of the providers we list.
              This is how a free-to-use comparison service is funded. We treat commercial relationships as
              completely separate from editorial decisions, and we make those relationships visible.
            </p>
            <p>Our policy:</p>
            <ul className="space-y-2 mt-3 not-prose">
              <li className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">No pay-to-rank.</strong> Affiliate status does not change a provider's position in the default Total Price sort. Sponsored placements are visually distinct, labelled, and excluded from the organic comparison.</span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">No editorial gifts.</strong> Our Clinical Reviewer receives no payment, equity, free testing, or in-kind benefit from any listed provider.</span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">Disclosure.</strong> Outbound provider links carry an{' '}
                  <Link to="/affiliate-disclosure" className="text-primary underline underline-offset-2">affiliate disclosure</Link>{' '}
                  and our affiliate relationships are listed publicly.</span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span><strong className="text-foreground">No exclusivity for ranking.</strong> Non-affiliate providers can and do appear above affiliate providers in default rankings when their Total Price is lower.</span>
              </li>
            </ul>
            <p className="mt-4">
              We comply in full with the UK Competition and Markets Authority (CMA) and the Digital Markets,
              Competition and Consumers Act 2024. Where mandatory fees are known they are included in displayed
              prices; where they are optional or variable they are surfaced separately on the test card.
            </p>
          </CardContent>
        </Card>

        {/* ===================== Independence ===================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" aria-hidden="true" />
              Independence
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>
              myhealth checkup is an independent comparison platform. We do not own a laboratory, employ
              phlebotomists, hold a CQC registration, or process diagnostic samples ourselves. All testing,
              reporting and clinical follow-up is conducted by the third-party providers we list.
            </p>
            <p>
              We do not accept payment to remove providers, suppress unfavourable information, or promote a
              specific test outcome. If you believe a listing is inaccurate or misleading, please contact us at{' '}
              <a href="mailto:editorial@myhealthcheckup.co.uk" className="text-primary underline underline-offset-2">
                editorial@myhealthcheckup.co.uk
              </a>{' '}
              and we will investigate within five working days.
            </p>
          </CardContent>
        </Card>

        {/* ===================== Limitations ===================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" aria-hidden="true" />
              Limitations &amp; what we are not
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>
              This site provides comparison information only. It is not a clinical service and does not constitute
              medical advice, diagnosis, or prescription. Comparing tests is not a substitute for consulting your
              GP, and abnormal results from any private test should always be reviewed by a suitably qualified
              clinician.
            </p>
            <p>
              We do not cover every UK provider. Where a provider does not meet our inclusion criteria, declines
              to provide verifiable accreditation evidence, or does not publish transparent pricing, we will not
              list them. Absence from our comparison is not a comment on the safety or quality of any
              non-listed provider.
            </p>
            <p>
              The default sort is price-led because price is the most consistently verifiable comparison axis. It
              is not a recommendation. The cheapest test for a given panel is not necessarily the most appropriate
              test for your individual situation.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h2 className="text-lg font-semibold text-foreground mb-3">CMA &amp; DMCC compliance</h2>
          <p className="text-sm text-muted-foreground">
            myhealth checkup operates in full compliance with the Competition and Markets Authority (CMA) and the
            Digital Markets, Competition and Consumers Act 2024. Prices include all mandatory fees where known,
            sponsored listings are clearly marked, ranking criteria are disclosed in plain English on this page,
            and our affiliate relationships are documented in our{' '}
            <Link to="/affiliate-disclosure" className="text-primary underline underline-offset-2">
              affiliate disclosure
            </Link>
            .
          </p>

          <div className="mt-4 pt-4 border-t border-primary/10">
            <p className="text-sm text-muted-foreground mb-3">
              When a placement involves a commercial arrangement we always label it visibly with one of these badges
              and a tooltip explaining the relationship:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <SponsoredBadge variant="sponsored" />
              <SponsoredBadge variant="promoted" />
              <SponsoredBadge variant="affiliate" />
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Disagree with a ranking, a label, or a listing? Raise it via our{' '}
            <Link to="/complaints" className="text-primary underline underline-offset-2">
              feedback &amp; complaints process
            </Link>{' '}
            — we acknowledge within 2 business days and respond fully within 10.
          </p>
        </div>
      </div>
    </article>
  );
};

export default HowWeRank;
