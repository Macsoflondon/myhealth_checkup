import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AppleSignInButtonProps {
  mode: "signin" | "signup";
  disabled?: boolean;
  onLoading?: (loading: boolean) => void;
}

export const AppleSignInButton = ({
  mode,
  disabled = false,
  onLoading,
}: AppleSignInButtonProps) => {
  const handleAppleSignIn = async () => {
    try {
      onLoading?.(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        toast.error(error.message || "Failed to sign in with Apple");
        onLoading?.(false);
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred with Apple sign-in");
      onLoading?.(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleAppleSignIn}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 bg-[#081129] text-white text-base rounded drop-shadow-md font-medium hover:bg-white hover:text-[#081129]"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      {mode === "signup" ? "Sign up with Apple" : "Sign in with Apple"}
    </Button>
  );
};
