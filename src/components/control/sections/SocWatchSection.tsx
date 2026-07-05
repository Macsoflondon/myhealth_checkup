import { SocWatchDashboard } from "@/components/admin/soc-watch-dashboard";
import { SectionShell } from "../SectionShell";

export default function SocWatchSection() {
  return (
    <SectionShell
      title="SOC Watch"
      description="Read-only security operations monitoring across existing audit, alert and function telemetry."
      status="live"
    >
      <SocWatchDashboard embedded />
    </SectionShell>
  );
}