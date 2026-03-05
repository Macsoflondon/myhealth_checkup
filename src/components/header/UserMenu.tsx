import { Link } from "react-router-dom";
import { User, LogOut, LayoutDashboard, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
interface UserMenuProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}
export const UserMenu = ({ isMobile = false, onItemClick }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const handleSignOut = async () => {
    await signOut();
    onItemClick?.();
  };
  if (isMobile) {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-1.5 text-[#e70d69] hover:text-white hover:bg-[#e70d69] border-2 border-[#e70d69] rounded-lg transition-colors flex-shrink-0"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/dashboard" className="flex items-center gap-2" onClick={onItemClick}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/health-dashboard" className="flex items-center gap-2" onClick={onItemClick}>
                <Activity className="h-4 w-4" />
                Health Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-1.5 text-[#e70d69] hover:text-white hover:bg-[#e70d69] border-2 border-[#e70d69] rounded-lg transition-colors flex-shrink-0"
        aria-label="Sign in"
        asChild
      >
        <Link to="/auth" className="flex items-center justify-center" onClick={onItemClick}>
          <User className="h-5 w-5" />
        </Link>
      </Button>
    );
  }
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-2 text-[#e70d69] hover:text-white hover:bg-[#e70d69] border border-[#e70d69] rounded-lg transition-colors"
            aria-label="User menu"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/health-dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Health Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="h-12 w-12 p-2 text-[#e70d69] hover:text-white hover:bg-[#e70d69] border border-[#e70d69] rounded-lg transition-colors"
        aria-label="Sign in"
        asChild
      >
        <Link to="/auth" className="flex items-center justify-center">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
};
