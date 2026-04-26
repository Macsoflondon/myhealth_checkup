import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SaveProviderButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  size?: "sm" | "default" | "icon";
  variant?: "ghost" | "outline" | "default";
  className?: string;
  showLabel?: boolean;
}

export function SaveProviderButton({
  isSaved,
  onToggle,
  size = "sm",
  variant = "ghost",
  className,
  showLabel = false
}: SaveProviderButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "transition-colors",
        isSaved && "text-[#e70d69]",
        className
      )}
      title={isSaved ? "Remove from saved providers" : "Save provider"}
    >
      <Heart
        className={cn(
          "h-4 w-4",
          isSaved && "fill-current"
        )}
      />
      {showLabel && (
        <span className="ml-1.5">
          {isSaved ? "Saved" : "Save"}
        </span>
      )}
    </Button>
  );
}
