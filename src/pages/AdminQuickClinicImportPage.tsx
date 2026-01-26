import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, CheckCircle2, AlertCircle, Database } from "lucide-react";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";

const AdminQuickClinicImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useUserRole();
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number; message: string } | null>(null);

  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  const handleQuickImport = async () => {
    setImporting(true);
    setResult(null);

    try {
      toast.info('Loading pre-collected clinic data...');

      // Fetch the pre-existing clinic data file
      const response = await fetch('/clinics_import_data.json');
      if (!response.ok) {
        throw new Error('Failed to load clinic data file');
      }

      const clinics = await response.json();
      
      if (!Array.isArray(clinics) || clinics.length === 0) {
        throw new Error('Invalid or empty clinic data');
      }

      toast.info(`Uploading ${clinics.length} clinics...`);

      // Use the bulk-add-clinics edge function
      const { data, error } = await supabase.functions.invoke('bulk-add-clinics', {
        body: { clinics }
      });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(error.message || 'Failed to upload clinics');
      }

      const successCount = data?.successCount || 0;
      const skippedCount = data?.skippedCount || 0;

      setResult({
        success: true,
        count: successCount,
        message: `Successfully imported ${successCount} clinics${skippedCount > 0 ? ` (${skippedCount} duplicates skipped)` : ''}`
      });

      toast.success(`Import complete! ${successCount} clinics added.`);

    } catch (error: any) {
      console.error('Import error:', error);
      setResult({
        success: false,
        count: 0,
        message: error.message || 'Import failed'
      });
      toast.error('Failed to import clinics. Check console for details.');
    } finally {
      setImporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Quick Clinic Import</h1>
          <p className="text-muted-foreground">
            Day 2 Sprint Solution: Import pre-collected clinic data to reach 150+ clinic target
          </p>
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Pre-Collected Clinic Data
              </CardTitle>
              <CardDescription>
                Import from clinics_import_data.json (190+ clinics from Medichecks and partner locations)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will import pre-collected clinic data that includes:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Medichecks partner clinics nationwide</li>
                    <li>Randox Health clinic locations</li>
                    <li>Additional verified clinic partners</li>
                  </ul>
                  Clinics will be automatically geocoded. Duplicates will be skipped. Estimated time: 5-10 minutes.
                </AlertDescription>
              </Alert>

              {result && (
                <Card className={result.success ? 'border-green-500' : 'border-red-500'}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      )}
                      <div>
                        <div className="font-semibold">{result.message}</div>
                        {result.success && (
                          <Badge variant="default" className="mt-2">
                            {result.count} clinics imported
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleQuickImport}
                disabled={importing}
                size="lg"
                className="w-full"
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Pre-Collected Clinic Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> This is a one-time import of existing data. For ongoing clinic data collection, use the Clinic Scraper Manager at /admin/clinic-scraper.
            </AlertDescription>
          </Alert>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminQuickClinicImportPage;
