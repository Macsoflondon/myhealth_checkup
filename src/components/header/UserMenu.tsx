import { useNavigate, Link } from "react-router-dom";
import { User, LogOut, LayoutDashboard } from "lucide-react";
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
  const navigate = useNavigate();
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
              className="h-10 px-3 text-[#dc27a0] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border-[3px] border-[#e70d69]/20 hover:border-[#22c0d4]"
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
        className="h-10 px-3 text-[#dc27a0] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border-[3px] border-[#dc27a0]/20 hover:border-[#22c0d4]"
        asChild
      >
        <Link to="/auth" className="flex items-center gap-2" onClick={onItemClick}>
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
            className="h-10 px-3 text-[#dc27a0] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border-[3px] border-[#dc27a0]/20 hover:border-[#22c0d4]"
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
        className="h-10 px-3 text-[#dc27a0] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border-[3px] border-[#e70d69]/20 hover:border-[#22c0d4]"
        asChild
      >
        <Link to="/auth" className="flex items-center gap-2">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
};
