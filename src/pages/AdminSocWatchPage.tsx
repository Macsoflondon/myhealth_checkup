import { Helmet } from "react-helmet-async";
import { SocWatchDashboard } from "@/components/admin/soc-watch-dashboard";

export default function AdminSocWatchPage() {
  return (
    <>
      <Helmet>
        <title>SOC Watch — myhealth checkup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <SocWatchDashboard />
    </>
  );
}