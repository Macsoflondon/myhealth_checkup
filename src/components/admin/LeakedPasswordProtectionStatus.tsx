import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, ShieldAlert, ShieldQuestion, RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Status = "enabled" | "disabled" | "unknown";

interface ProbeResult {
  status: Status;
  detail: string;
  checked_at: string;
}

const SUPABASE_AUTH_SETTINGS_URL =
  "https://supabase.com/dashboard/project/clvuioagsgfadynuvodj/auth/providers";

export const LeakedPasswordProtectionStatus = () => {
  const { toast } = useToast();
  const [result, setResult] = useState<ProbeResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runCheck = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke<ProbeResult>(
        "check-leaked-password-protection",
      );
      if (error) throw error;
      if (!data) throw new Error("Empty response");
      setResult(data);

      toast({
        title: "Check complete",
        description: data.detail,
        variant: data.status === "enabled" ? "default" : "destructive",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        title: "Check failed",
        description: message,
        variant: "destructive",
      });
      setResult({
        status: "unknown",
        detail: message,
        checked_at: new Date().toISOString(),
      });
    } finally {
      setIsChecking(false);
    }
  };

  const renderBadge = () => {
    if (!result) {
      return <Badge variant="outline">Not checked</Badge>;
    }
    switch (result.status) {
      case "enabled":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <ShieldCheck className="h-3 w-3 mr-1" /> Enabled
          </Badge>
        );
      case "disabled":
        return (
          <Badge variant="destructive">
            <ShieldAlert className="h-3 w-3 mr-1" /> Disabled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <ShieldQuestion className="h-3 w-3 mr-1" /> Unknown
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <ShieldCheck className="h-5 w-5" />
              Leaked Password Protection
            </CardTitle>
            <CardDescription className="mt-1">
              Cyber Essentials Plus requires Supabase Auth to reject passwords
              found in known data breaches (HIBP).
            </CardDescription>
          </div>
          {renderBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {result && (
          <Alert variant={result.status === "disabled" ? "destructive" : "default"}>
            <AlertDescription className="text-sm">
              {result.detail}
              <div className="text-xs text-muted-foreground mt-1">
                Last checked: {new Date(result.checked_at).toLocaleString("en-GB")}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={runCheck} disabled={isChecking} size="sm">
            {isChecking ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {result ? "Re-check status" : "Check status"}
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={SUPABASE_AUTH_SETTINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Supabase setting
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          The probe attempts a sign-up with a well-known pwned password against
          a throwaway address. If Supabase blocks it, protection is on. The
          ephemeral user is deleted automatically.
        </p>
      </CardContent>
    </Card>
  );
};
