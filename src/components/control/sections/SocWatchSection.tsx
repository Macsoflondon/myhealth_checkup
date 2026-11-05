import { SocWatchDashboard } from "@/components/admin/soc-watch-dashboard";
import { SectionShell } from "../SectionShell";

export default function SocWatchSection() {
  return (
    <SectionShell title="SOC watch">
      <SocWatchDashboard embedded />
    </SectionShell>
  );
}
