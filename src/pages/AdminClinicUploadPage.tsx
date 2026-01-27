import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ClinicData {
  name: string;
  fullAddress: string;
  postalCode: string;
  appointmentRequired: boolean;
}

interface UploadResult {
  name: string;
  status: 'success' | 'error';
  error?: string;
}

const BATCH_SIZE = 30;

const AdminClinicUploadPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [stats, setStats] = useState({ success: 0, error: 0, total: 0 });

  const loadClinicsFromFile = async (): Promise<ClinicData[]> => {
    try {
      const response = await fetch('/medichecks_clinics_data.json');
      if (!response.ok) throw new Error('Failed to load clinics data');
      return await response.json();
    } catch (error) {
      console.error('Error loading clinics:', error);
      toast.error('Failed to load clinics data file');
      return [];
    }
  };

  const uploadBatch = async (batch: ClinicData[]): Promise<UploadResult[]> => {
    const { data, error } = await supabase.functions.invoke('bulk-add-clinics', {
      body: { clinics: batch }
    });

    if (error) {
      console.error('Batch upload error:', error);
      throw error;
    }

    return data.results || [];
  };

  const handleUploadAll = async () => {
    setUploading(true);
    setProgress(0);
    setResults([]);
    setStats({ success: 0, error: 0, total: 0 });

    try {
      const allClinics = await loadClinicsFromFile();
      
      if (allClinics.length === 0) {
        toast.error('No clinics to upload');
        setUploading(false);
        return;
      }

      // Split into batches
      const batches: ClinicData[][] = [];
      for (let i = 0; i < allClinics.length; i += BATCH_SIZE) {
        batches.push(allClinics.slice(i, i + BATCH_SIZE));
      }

      setTotalBatches(batches.length);
      setStats({ success: 0, error: 0, total: allClinics.length });

      let allResults: UploadResult[] = [];
      let successCount = 0;
      let errorCount = 0;

      // Process each batch
      for (let i = 0; i < batches.length; i++) {
        setCurrentBatch(i + 1);
        
        toast.info(`Processing batch ${i + 1} of ${batches.length}...`);
        
        const batchResults = await uploadBatch(batches[i]);
        allResults = [...allResults, ...batchResults];
        
        // Update stats
        batchResults.forEach(result => {
          if (result.status === 'success') successCount++;
          else errorCount++;
        });

        setStats({ success: successCount, error: errorCount, total: allClinics.length });
        setResults(allResults);
        setProgress(((i + 1) / batches.length) * 100);

        // Wait a bit between batches to avoid overwhelming the system
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      toast.success(`Upload complete! ${successCount} succeeded, ${errorCount} failed`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Clinic Upload Manager</h1>
          <p className="text-muted-foreground">
            Bulk upload clinics from the Medichecks locations data file
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Clinics</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Batch Upload
                </CardTitle>
                <CardDescription>
                  Upload all clinics from medichecks_clinics_data.json in batches of {BATCH_SIZE}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!uploading && results.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This will upload clinics in batches. Each batch takes approximately 30-60 seconds.
                      The process includes geocoding each address, so please be patient.
                    </AlertDescription>
                  </Alert>
                )}

                {uploading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Processing batch {currentBatch} of {totalBatches}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <div className="text-2xl font-bold text-primary">{stats.total}</div>
                          <div className="text-sm text-muted-foreground">Total</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                          <div className="text-sm text-muted-foreground">Success</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <div className="text-2xl font-bold text-red-600">{stats.error}</div>
                          <div className="text-sm text-muted-foreground">Failed</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {!uploading && results.length > 0 && (
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Upload completed! {stats.success} clinics added successfully, {stats.error} failed.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleUploadAll}
                  disabled={uploading}
                  size="lg"
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Start Upload
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {results.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No results yet. Start an upload to see results here.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Results</CardTitle>
                  <CardDescription>
                    Showing {results.length} results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        {result.status === 'success' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{result.name}</div>
                          {result.error && (
                            <div className="text-sm text-red-600 mt-1">{result.error}</div>
                          )}
                        </div>
                        <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminClinicUploadPage;
