import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { KeyRound, Loader2 } from "lucide-react";

type IssueResponse = {
  success?: boolean;
  error?: string;
  token?: string;
  expiresInMinutes?: number;
};

const readError = async (error: unknown): Promise<string> => {
  const response = (error as { context?: unknown })?.context;
  if (response instanceof Response) {
    try {
      const body = (await response.clone().json()) as { error?: string };
      if (typeof body?.error === "string") return body.error;
    } catch {
      /* fall through to generic message */
    }
  }
  return (
    (error as { message?: string })?.message ||
    "Could not issue a recovery token."
  );
};

/**
 * Lets a signed-in administrator mint a short-lived, single-use recovery token
 * for another existing administrator who has lost access to their account.
 * The token replaces the previous long-lived shared recovery secret.
 */
export const AdminRecoveryTokenPanel = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const [expiresInMinutes, setExpiresInMinutes] = useState<number | null>(null);

  const handleIssue = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setIssuedToken(null);
    try {
      const { data, error } = await supabase.functions.invoke<IssueResponse>(
        "admin-recovery",
        {
          body: { action: "issue", email },
        },
      );
      if (error) {
        toast.error(await readError(error));
        return;
      }
      if (data?.success) {
        setIssuedToken(email);
        setExpiresInMinutes(data.expiresInMinutes ?? 15);
        toast.success("Recovery token emailed to the administrator.");
      } else {
        toast.error(data?.error || "Could not issue a recovery token.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <KeyRound className="h-4 w-4" />
          Issue admin recovery token
        </CardTitle>
        <CardDescription>
          Emails a single-use token to the administrator's registered address
          so they can regain access. Tokens expire quickly and never grant new
          privileges.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleIssue} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="recovery-target-email">Administrator email</Label>
            <Input
              id="recovery-target-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@myhealthcheckup.co.uk"
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <Button type="submit" disabled={loading || !email}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Issuing…
              </>
            ) : (
              "Email token"
            )}
          </Button>
        </form>

        {issuedToken && (
          <Alert>
            <AlertDescription className="text-sm">
              A token was sent to {issuedToken}. It expires in{" "}
              {expiresInMinutes} minutes and works a single time.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
