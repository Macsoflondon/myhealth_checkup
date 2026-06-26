import { SectionShell, ScaffoldNotice } from "../SectionShell";

export default function AnalyticsSection() {
  return (
    <SectionShell title="Historical Analytics" description="Trend dashboards across traffic, revenue & ops." status="stub">
      <ScaffoldNotice>
        Plug in an analytics provider (e.g. PostHog or Plausible) to populate this section with traffic, conversion and revenue trends.
      </ScaffoldNotice>
    </SectionShell>
  );
}
