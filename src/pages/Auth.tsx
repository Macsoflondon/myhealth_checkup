import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Auth = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/engine" replace />;

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate("/engine");
  };

  const signUp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/engine` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. First user is granted admin.");
    navigate("/engine");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Execution Engine</CardTitle>
          <CardDescription>Sign in to access the deterministic control layer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email-in">Email</Label>
                <Input id="email-in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw-in">Password</Label>
                <Input id="pw-in" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button onClick={signIn} disabled={busy} className="w-full">Sign in</Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email-up">Email</Label>
                <Input id="email-up" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw-up">Password</Label>
                <Input id="pw-up" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button onClick={signUp} disabled={busy} className="w-full">Create account</Button>
              <p className="text-xs text-muted-foreground">The first account created is granted admin.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default Auth;
