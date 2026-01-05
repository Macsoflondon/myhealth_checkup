import { useEffect, useState } from "react";
import { FileText, Calendar, Building2, Trash2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { healthDataApi, UploadedTestResult } from "@/api/supabase/healthData.api";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

export const TestResultsTimeline = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<UploadedTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResults = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await healthDataApi.getUploadedTestResults(user.id);
    
    if (error) {
      toast.error("Failed to load test results");
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadResults();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test result?")) return;

    const { error } = await healthDataApi.deleteTestResult(id);
    
    if (error) {
      toast.error("Failed to delete test result");
    } else {
      toast.success("Test result deleted");
      loadResults();
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-2">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-6 border-2">
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No test results uploaded yet</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card key={result.id} className="p-6 border-2 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-[#081129]">
                  {result.test_name}
                </h3>
                {index === 0 && (
                  <Badge className="bg-[#e70d69] text-white">Latest</Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(result.test_date), "dd MMM yyyy")}
                </div>
                
                {result.provider_id && (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {result.provider_id}
                  </div>
                )}
              </div>

              {result.notes && (
                <p className="text-sm text-muted-foreground mb-3">
                  {result.notes}
                </p>
              )}

              <div className="flex items-center gap-2">
                {result.file_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={result.file_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View File
                    </a>
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(result.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="ml-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
