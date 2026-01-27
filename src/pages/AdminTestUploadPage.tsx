import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { medichecksTests } from "@/data/medichecksTests";
import { londonLaboratoryTests } from "@/data/londonLaboratoryTests";

const AdminTestUploadPage: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    inserted: number;
    errors: number;
  } | null>(null);

  const handleUploadTests = async () => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      let insertedCount = 0;
      let errorCount = 0;

      // Prepare all tests
      const allTests = [
        ...medichecksTests.map(test => ({
          provider_id: 'medichecks',
          test_name: test.name,
          price: test.price,
          url: test.url,
          category: test.category,
          description: test.description,
          is_active: true
        })),
        ...londonLaboratoryTests.map(test => ({
          provider_id: 'london-medical-laboratory',
          test_name: test.name,
          price: test.price,
          url: test.url,
          category: test.category,
          description: test.description,
          is_active: true
        }))
      ];

      // Insert tests one by one
      for (const test of allTests) {
        // Check if test already exists
        const { data: existing } = await supabase
          .from('provider_tests')
          .select('id')
          .eq('provider_id', test.provider_id)
          .eq('test_name', test.test_name)
          .maybeSingle();

        if (existing) {
          // Update existing test
          const { error } = await supabase
            .from('provider_tests')
            .update({
              price: test.price,
              url: test.url,
              category: test.category,
              description: test.description,
              is_active: test.is_active
            })
            .eq('id', existing.id);

          if (error) {
            console.error('Error updating test:', error);
            errorCount++;
          } else {
            insertedCount++;
          }
        } else {
          // Insert new test
          const { error } = await supabase
            .from('provider_tests')
            .insert(test);

          if (error) {
            console.error('Error inserting test:', error);
            errorCount++;
          } else {
            insertedCount++;
          }
        }
      }

      setUploadResult({
        success: errorCount === 0,
        message: `Successfully processed ${insertedCount} tests${errorCount > 0 ? ` with ${errorCount} errors` : ''}`,
        inserted: insertedCount,
        errors: errorCount
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: 'Failed to upload tests',
        inserted: 0,
        errors: 1
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Upload Provider Tests</CardTitle>
              <CardDescription>
                Upload Medichecks and London Laboratory tests to the database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Upload className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Tests to Upload:</p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• 18 Medichecks tests</li>
                      <li>• 8 London Medical Laboratory tests</li>
                      <li>• Total: 26 tests</li>
                    </ul>
                  </div>
                </div>

                {uploadResult && (
                  <Alert variant={uploadResult.success ? "default" : "destructive"}>
                    {uploadResult.success ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      <p className="font-medium">{uploadResult.message}</p>
                      <ul className="mt-2 text-sm space-y-1">
                        <li>Processed: {uploadResult.inserted}</li>
                        {uploadResult.errors > 0 && <li>Errors: {uploadResult.errors}</li>}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleUploadTests}
                  disabled={isUploading}
                  className="w-full"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading Tests...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Tests to Database
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AdminTestUploadPage;
