import { useCallback, useEffect, useState } from "react";
import { ExternalLink, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  healthDataApi,
  type BiomarkerReading,
  type HealthScore,
  type LegacyTestResult,
  type UploadedTestResult,
  type UserHealthData,
} from "@/api/supabase/healthData.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

type StoredRecordKind =
  "upload" | "legacy-result" | "reading" | "health-data" | "health-score";

interface StoredRecord {
  id: string;
  kind: StoredRecordKind;
  title: string;
  date: string | null;
  fileUrl?: string;
  details: Array<{ label: string; value: string }>;
}

const dateValue = (value: string | null): string => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
};

const uploadedRecord = (result: UploadedTestResult): StoredRecord => ({
  id: result.id,
  kind: "upload",
  title: result.test_name,
  date: result.test_date,
  ...(result.file_url ? { fileUrl: result.file_url } : {}),
  details: [
    { label: "Record type", value: "Uploaded test result" },
    { label: "Test date", value: dateValue(result.test_date) },
    { label: "Provider", value: result.provider_id || "Not stated" },
    { label: "Notes", value: result.notes || "None" },
  ],
});

const legacyRecord = (result: LegacyTestResult): StoredRecord => ({
  id: result.id,
  kind: "legacy-result",
  title: "Provider test result",
  date: result.result_date,
  ...(result.pdf_url ? { fileUrl: result.pdf_url } : {}),
  details: [
    { label: "Record type", value: "Provider test result" },
    { label: "Result date", value: dateValue(result.result_date) },
    { label: "Provider", value: result.provider_id || "Not stated" },
  ],
});

const readingRecord = (reading: BiomarkerReading): StoredRecord => ({
  id: reading.id,
  kind: "reading",
  title: reading.biomarker_name,
  date: reading.recorded_at,
  details: [
    { label: "Record type", value: "Biomarker reading" },
    { label: "Value", value: `${reading.value} ${reading.unit || ""}`.trim() },
    { label: "Recorded", value: dateValue(reading.recorded_at) },
    { label: "Status", value: reading.status || "Not stated" },
  ],
});

const healthDataRecord = (data: UserHealthData): StoredRecord => ({
  id: data.id,
  kind: "health-data",
  title: data.metric_type,
  date: data.recorded_at,
  details: [
    { label: "Record type", value: "Health data entry" },
    { label: "Value", value: `${data.value} ${data.unit || ""}`.trim() },
    { label: "Recorded", value: dateValue(data.recorded_at) },
    { label: "Source", value: data.data_source },
  ],
});

const healthScoreRecord = (score: HealthScore): StoredRecord => ({
  id: score.id,
  kind: "health-score",
  title: "Stored health score",
  date: score.calculated_at,
  details: [
    { label: "Record type", value: "Health score" },
    { label: "Calculated", value: dateValue(score.calculated_at) },
    {
      label: "Overall score",
      value: String(score.overall_score ?? "Not stated"),
    },
  ],
});

export const StageOneHealthRecords = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [records, setRecords] = useState<StoredRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<StoredRecord | null>(
    null,
  );

  const loadRecords = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const [uploads, legacy, readings, healthData, scores] = await Promise.all([
      healthDataApi.getUploadedTestResults(userId),
      healthDataApi.getLegacyTestResults(userId),
      healthDataApi.getBiomarkerReadings(userId),
      healthDataApi.getUserHealthData(userId),
      healthDataApi.getHealthScoreHistory(userId),
    ]);

    if (
      [uploads, legacy, readings, healthData, scores].some(
        (response) => response.error,
      )
    ) {
      toast.error("Some previously stored records could not be loaded");
    }

    setRecords([
      ...(uploads.data || []).map(uploadedRecord),
      ...(legacy.data || []).map(legacyRecord),
      ...(readings.data || []).map(readingRecord),
      ...(healthData.data || []).map(healthDataRecord),
      ...(scores.data || []).map(healthScoreRecord),
    ]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const handleDelete = async (record: StoredRecord) => {
    if (!window.confirm("Are you sure you want to delete this stored record?"))
      return;
    setDeletingId(record.id);

    const response =
      record.kind === "upload"
        ? await healthDataApi.deleteTestResult(record.id)
        : record.kind === "legacy-result"
          ? await healthDataApi.deleteLegacyTestResult(record.id)
          : record.kind === "reading"
            ? await healthDataApi.deleteBiomarkerReading(record.id)
            : record.kind === "health-data"
              ? await healthDataApi.deleteHealthData(record.id)
              : await healthDataApi.deleteHealthScore(record.id);

    if (response.error) {
      toast.error("Failed to delete the stored record");
    } else {
      setRecords((current) => current.filter((item) => item.id !== record.id));
      setSelectedRecord(null);
      toast.success("Stored record deleted");
    }
    setDeletingId(null);
  };

  return (
    <section aria-label="Stored test results" className="space-y-4">
      <p className="text-muted-foreground">
        Your account does not store test results yet.
      </p>
      {loading && (
        <p className="text-sm text-muted-foreground">
          Checking for previously stored records…
        </p>
      )}
      {!loading && records.length > 0 && (
        <div className="space-y-3">
          <h2 className="type-card-title text-brand-navy">
            Previously stored records
          </h2>
          {records.map((record) => (
            <Card key={`${record.kind}-${record.id}`} className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-brand-navy break-words">
                    {record.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {dateValue(record.date)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {record.fileUrl ? (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={record.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1 h-4 w-4" />
                        View
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      View
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={deletingId === record.id}
                    onClick={() => void handleDelete(record)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    {deletingId === record.id ? "Deleting…" : "Delete"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={selectedRecord !== null}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRecord?.title || "Stored record"}
            </DialogTitle>
            <DialogDescription>
              This existing record can be viewed or deleted.
            </DialogDescription>
          </DialogHeader>
          <dl className="space-y-3">
            {selectedRecord?.details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-sm font-medium text-brand-navy">
                  {detail.label}
                </dt>
                <dd className="text-sm text-muted-foreground break-words">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </DialogContent>
      </Dialog>
    </section>
  );
};
