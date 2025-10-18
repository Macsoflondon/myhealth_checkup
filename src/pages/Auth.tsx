import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { validatePassword, validateEmail } from "@/lib/passwordValidation";
import { AlertCircle } from "lucide-react";
const Auth = () => {
  const {
    user,
    isLoading
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const passwordStrength = validatePassword(password);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);
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

    // Name validation for sign up
    if (isSignUp) {
      if (!firstName.trim()) {
        toast.error("First name is required");
        isValid = false;
      }
      if (!lastName.trim()) {
        toast.error("Last name is required");
        isValid = false;
      }
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
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim()
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
        const {
          error
        } = await supabase.auth.signInWithPassword({
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
        navigate("/dashboard");
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
        <div className="max-w-md w-full bg-white rounded-lg drop-shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#22c0d4]">
            {isSignUp ? "Create an Account" : "Sign In"}
          </h2>

          {/* Google Sign In */}
          <GoogleSignInButton mode={isSignUp ? "signup" : "signin"} disabled={loading || oauthLoading} onLoading={setOauthLoading} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-[#081129]">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter your first name" required={isSignUp} disabled={loading || oauthLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Enter your last name" required={isSignUp} disabled={loading || oauthLoading} />
                </div>
              </>}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => {
              setEmail(e.target.value);
              setEmailError("");
            }} placeholder="Enter your email" required disabled={loading || oauthLoading} className={emailError ? "border-destructive" : ""} />
              {emailError && <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{emailError}</AlertDescription>
                </Alert>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password {isSignUp && <span className="text-xs text-muted-foreground">(minimum 8 characters)</span>}</Label>
              <Input id="password" type="password" value={password} onChange={e => {
              setPassword(e.target.value);
              setPasswordError("");
            }} placeholder={isSignUp ? "Create a strong password" : "Enter your password"} required disabled={loading || oauthLoading} className={passwordError ? "border-destructive" : ""} minLength={isSignUp ? 8 : 6} />
              {isSignUp && password && <PasswordStrengthIndicator strength={passwordStrength} password={password} />}
              {passwordError && <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{passwordError}</AlertDescription>
                </Alert>}
            </div>

            <Button type="submit" disabled={loading || oauthLoading} className="w-full flex items-center justify-center gap-2 bg-[#22c0d4] text-[#e70d69] text-base rounded drop-shadow-md font-medium">
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <div className="text-center mt-4">
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="hover:underline text-center text-base text-[#081129] font-medium">
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