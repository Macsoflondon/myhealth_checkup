import { Helmet } from "react-helmet-async";
import { SeoStatusDashboard } from "@/components/admin/SeoStatusDashboard";

export default function AdminSeoStatusPage() {
  return (
    <>
      <Helmet>
        <title>SEO Status — myhealth checkup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <SeoStatusDashboard />
    </>
  );
}
