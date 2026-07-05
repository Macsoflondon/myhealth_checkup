import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Download, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export function FhirExportPanel() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("fhir-export/consent", { method: "GET" });
        if (error) throw error;
        setConsented(!!(data as { active?: boolean })?.active);
      } catch (e) {
        logger.error("consent status fetch failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleConsent = async (grant: boolean) => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("fhir-export/consent", {
        method: "POST",
        body: { grant },
      });
      if (error) throw error;
      const active = !!(data as { active?: boolean })?.active;
      setConsented(active);
      toast.success(active ? "FHIR export consent granted" : "Consent withdrawn");
    } catch (e) {
      logger.error("consent toggle failed", e);
      toast.error("Could not update consent");
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    setBusy(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not signed in");
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fhir-export`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || body?.error || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const dispo = res.headers.get("content-disposition") ?? "";
      const match = /filename="([^"]+)"/.exec(dispo);
      const filename = match?.[1] ?? `myhealthcheckup-fhir-${Date.now()}.json`;
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success("FHIR bundle downloaded");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Export failed";
      logger.error("fhir export failed", e);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const asyncExport = async () => {
    setBusy(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not signed in");
      const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fhir-export`;
      const kickoff = await fetch(`${base}/$export`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "respond-async" },
        body: JSON.stringify({}),
      });
      if (kickoff.status !== 202) throw new Error(`kickoff failed (${kickoff.status})`);
      const statusUrl = kickoff.headers.get("content-location");
      if (!statusUrl) throw new Error("no Content-Location header");
      toast.info("Export queued — polling for completion…");
      // Poll up to 30s
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        const s = await fetch(statusUrl, { headers: { Authorization: `Bearer ${token}` } });
        if (s.status === 200) {
          const manifest = await s.json();
          const outputUrl = manifest?.output?.[0]?.url;
          if (!outputUrl) throw new Error("manifest missing output");
          const dl = await fetch(outputUrl, { headers: { Authorization: `Bearer ${token}` } });
          const blob = await dl.blob();
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = objectUrl;
          a.download = `myhealthcheckup-fhir-async-${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(objectUrl);
          toast.success("Async FHIR export complete");
          return;
        }
        if (s.status !== 202) {
          const body = await s.json().catch(() => ({}));
          throw new Error(body?.error || `status ${s.status}`);
        }
      }
      throw new Error("Timed out waiting for export");
    } catch (e) {
      logger.error("async fhir export failed", e);
      toast.error(e instanceof Error ? e.message : "Async export failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <ShieldCheck className="h-6 w-6" />
        FHIR data export
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Download your uploaded blood-test results as a FHIR R4 Bundle — Patient, DiagnosticReport
        and Observation resources you can share with a clinician or another platform. Consent is
        required (GDPR Art. 20 data portability) and every export is audit-logged.
      </p>
      <div className="flex items-center justify-between border rounded-lg p-4 mb-4">
        <div>
          <p className="font-medium">Consent to FHIR export</p>
          <p className="text-xs text-muted-foreground">
            You can withdraw this at any time.
          </p>
        </div>
        <Switch checked={consented} disabled={loading || busy} onCheckedChange={toggleConsent} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={download} disabled={!consented || busy} className="gap-2">
          <Download className="h-4 w-4" />
          Download FHIR bundle
        </Button>
        <Button onClick={asyncExport} disabled={!consented || busy} variant="outline" className="gap-2">
          <Zap className="h-4 w-4" />
          Async $export (bulk data)
        </Button>
        <a
          className="inline-flex items-center text-xs text-muted-foreground underline self-center ml-1"
          href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fhir-export/metadata`}
          target="_blank"
          rel="noreferrer"
        >
          View CapabilityStatement
        </a>
      </div>
    </Card>
  );
}
