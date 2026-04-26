import { useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { healthDataApi } from "@/api/supabase/healthData.api";
import { supabase } from "@/integrations/supabase/client";

interface TestResultUploaderProps {
  onUploadComplete?: () => void;
}

export const TestResultUploader = ({ onUploadComplete }: TestResultUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState("");
  const [provider, setProvider] = useState("");
  const [notes, setNotes] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!testName || !testDate) {
      toast.error("Please fill in test name and date");
      return;
    }

    setUploading(true);

    try {
      let fileUrl = null;

      // Upload file to Supabase Storage if selected
      if (selectedFile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('test-results')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        // Store file path (not URL) - signed URLs are generated on retrieval
        fileUrl = fileName;
      }

      // Save test result to database
      const { error } = await healthDataApi.uploadTestResult({
        test_name: testName,
        test_date: testDate,
        provider_id: provider || undefined,
        file_url: fileUrl || undefined,
        notes: notes || undefined,
      });

      if (error) throw error;

      toast.success("Test result uploaded successfully");
      
      // Reset form
      setTestName("");
      setTestDate("");
      setProvider("");
      setNotes("");
      setSelectedFile(null);
      
      if (onUploadComplete) onUploadComplete();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload test result");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 border-2">
      <h3 className="text-xl font-semibold mb-4 text-[#081129]">Upload Test Result</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="testName">Test Name *</Label>
          <Input
            id="testName"
            placeholder="e.g. Full Blood Count"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="testDate">Test Date *</Label>
          <Input
            id="testDate"
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="provider">Provider (Optional)</Label>
          <Input
            id="provider"
            placeholder="e.g. Medichecks, Goodbody"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label>Upload PDF or Image (Optional)</Label>
          <div className="mt-2">
            {!selectedFile ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, PNG, JPG (Max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 border-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={uploading || !testName || !testDate}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Test Result
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
