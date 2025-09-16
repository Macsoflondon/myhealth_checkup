import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { validatePassword, validateEmail } from "@/lib/passwordValidation";
import { AlertCircle } from "lucide-react";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const passwordStrength = validatePassword(password);
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (isSignUp && !passwordStrength.isValid) {
      setPasswordError("Password does not meet security requirements");
      isValid = false;
    } else if (!isSignUp && password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    // Full name validation for sign up
    if (isSignUp && !fullName.trim()) {
      toast.error("Full name is required");
      isValid = false;
    }

    return isValid;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) {
          // Handle specific auth errors
          if (error.message.includes('User already registered')) {
            toast.error("An account with this email already exists. Try signing in instead.");
          } else if (error.message.includes('Password should be at least')) {
            toast.error("Password must be at least 6 characters long");
          } else if (error.message.includes('Invalid email')) {
            toast.error("Please enter a valid email address");
          } else {
            toast.error(error.message || "Sign up failed");
          }
          return;
        }
        
        toast.success("Sign up successful! Please check your email for verification.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          // Handle specific auth errors
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid email or password. Please check your credentials.");
          } else if (error.message.includes('Email not confirmed')) {
            toast.error("Please confirm your email address before signing in.");
          } else {
            toast.error(error.message || "Sign in failed");
          }
          return;
        }
        
        toast.success("Logged in successfully!");
        navigate("/compare");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#22c0d4]">
            {isSignUp ? "Create an Account" : "Sign In"}
          </h2>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" required={isSignUp} />
              </div>}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="Enter your email" 
                required 
                disabled={loading}
                className={emailError ? "border-destructive" : ""}
              />
              {emailError && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{emailError}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password {isSignUp && <span className="text-xs text-muted-foreground">(minimum 8 characters)</span>}</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                required 
                disabled={loading}
                className={passwordError ? "border-destructive" : ""}
                minLength={isSignUp ? 8 : 6}
              />
              {isSignUp && password && (
                <PasswordStrengthIndicator 
                  strength={passwordStrength} 
                  password={password}
                />
              )}
              {passwordError && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{passwordError}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <div className="text-center mt-4">
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="hover:underline text-center font-normal text-base text-[#22c0d4]">
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>;
};
export default Auth;