import { PasswordStrength } from "@/lib/passwordValidation";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  password: string;
}

export const PasswordStrengthIndicator = ({ strength, password }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return "bg-destructive";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-orange-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  const getStrengthText = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-2 flex-1 rounded-sm transition-colors",
              strength.score >= level ? getStrengthColor(strength.score) : "bg-muted"
            )}
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className={cn(
          "font-medium",
          strength.score <= 1 ? "text-destructive" :
          strength.score === 2 ? "text-yellow-600" :
          strength.score === 3 ? "text-orange-600" :
          "text-green-600"
        )}>
          {getStrengthText(strength.score)}
        </span>
        {!strength.isValid && strength.feedback.length > 0 && (
          <span className="text-muted-foreground text-xs">
            {strength.feedback[0]}
          </span>
        )}
      </div>
    </div>
  );
};