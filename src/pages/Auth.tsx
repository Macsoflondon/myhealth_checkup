import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { validatePassword, validateEmail } from "@/lib/passwordValidation";
import { AlertCircle, Lock } from "lucide-react";
import { useAccountLockout } from "@/hooks/useAccountLockout";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const Auth = () => {
  const {
    user,
    isLoading
  } = useAuth();
  const {
    isLocked,
    remainingTimeFormatted,
    attemptsRemaining,
    recordFailedAttempt,
    recordSuccessfulLogin,
    canAttemptLogin,
  } = useAccountLockout();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const passwordStrength = validatePassword(password);

  // Load saved email if "Remember Me" was checked previously
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message || "Failed to send reset email");
        return;
      }

      toast.success("Password reset email sent! Please check your inbox.");
      setIsForgotPassword(false);
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    
    // Check if account is locked (brute-force protection)
    if (!isSignUp && !canAttemptLogin()) {
      toast.error(`Account temporarily locked. Try again in ${remainingTimeFormatted}.`);
      return;
    }
    
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
          // Record failed attempt for brute-force protection
          const { isNowLocked, attemptsRemaining: remaining } = recordFailedAttempt();
          
          // Handle specific auth errors
          if (error.message.includes('Invalid login credentials')) {
            if (isNowLocked) {
              toast.error("Too many failed attempts. Account locked for 15 minutes.");
            } else {
              toast.error(`Invalid email or password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
            }
          } else if (error.message.includes('Email not confirmed')) {
            toast.error("Please confirm your email address before signing in.");
          } else {
            toast.error(error.message || "Sign in failed");
          }
          return;
        }
        
        // Record successful login (resets lockout counter)
        recordSuccessfulLogin();
        
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
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
  // Forgot password view
  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-lg drop-shadow-md p-8">
            <h2 className="text-2xl text-center mb-6 text-[#22c0d4] font-medium">
              Reset Password
            </h2>
            
            <p className="text-sm text-[#081129] text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#22c0d4] text-[#e70d69] text-base rounded drop-shadow-md font-medium"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="hover:underline text-center text-base text-[#081129] font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg drop-shadow-md p-8">
          <h2 className="text-2xl text-center mb-6 text-primary font-medium">
            {isSignUp ? "Create an Account" : "Sign In"}
          </h2>

          {/* Account Lockout Warning */}
          {!isSignUp && isLocked && (
            <Alert variant="destructive" className="mb-4">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Account temporarily locked due to too many failed attempts. 
                Please try again in {remainingTimeFormatted}.
              </AlertDescription>
            </Alert>
          )}

          {/* Low attempts warning */}
          {!isSignUp && !isLocked && attemptsRemaining <= 2 && attemptsRemaining > 0 && (
            <Alert className="mb-4 border-amber-500 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Warning: {attemptsRemaining} login attempt{attemptsRemaining !== 1 ? 's' : ''} remaining before temporary lockout.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter your first name" required={isSignUp} disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Enter your last name" required={isSignUp} disabled={loading} />
                </div>
              </>}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => {
              setEmail(e.target.value);
              setEmailError("");
            }} placeholder="Enter your email" required disabled={loading} className={emailError ? "border-destructive" : ""} />
              {emailError && <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{emailError}</AlertDescription>
                </Alert>}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password {isSignUp && <span className="text-xs text-muted-foreground">(minimum 8 characters)</span>}</Label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-[#22c0d4] hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input id="password" type="password" value={password} onChange={e => {
              setPassword(e.target.value);
              setPasswordError("");
            }} placeholder={isSignUp ? "Create a strong password" : "Enter your password"} required disabled={loading} className={passwordError ? "border-destructive" : ""} minLength={isSignUp ? 8 : 6} />
              {isSignUp && password && <PasswordStrengthIndicator strength={passwordStrength} password={password} />}
              {passwordError && <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{passwordError}</AlertDescription>
                </Alert>}
            </div>

            {!isSignUp && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={loading}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal text-[#081129] cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
            )}

            <Button type="submit" disabled={loading || (!isSignUp && isLocked)} className="w-full flex items-center justify-center gap-2 bg-[#22c0d4] text-[#e70d69] text-base rounded drop-shadow-md font-medium">
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <GoogleSignInButton mode={isSignUp ? "signup" : "signin"} disabled={loading || (!isSignUp && isLocked)} onLoading={setLoading} />

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