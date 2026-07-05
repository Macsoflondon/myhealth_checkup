import { Helmet } from "react-helmet-async";
import { ClinicalSafetyDashboard } from "@/components/admin/ClinicalSafetyDashboard";

export default function AdminClinicalSafetyPage() {
  return (
    <>
      <Helmet>
        <title>Clinical Safety Monitor — myhealth checkup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <ClinicalSafetyDashboard />
    </>
  );
}
