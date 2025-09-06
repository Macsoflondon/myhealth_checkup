
import { useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface UserMenuProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const UserMenu = ({ isMobile = false, onItemClick }: UserMenuProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <div className="pt-4 border-t border-gray-200 space-y-3">
        <Link
          to="/auth"
          className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={onItemClick}
        >
          <User className="h-5 w-5" />
          <span>Sign In</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="sm" className="h-10 px-3" asChild>
        <Link to="/auth" className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600" />
        </Link>
      </Button>
    </div>
  );
};
