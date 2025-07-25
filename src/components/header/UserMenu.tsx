
import { useNavigate } from "react-router-dom";
import { Heart, LogOut, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

interface UserMenuProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const UserMenu = ({ isMobile = false, onItemClick }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("You have been signed out");
    navigate("/");
    if (onItemClick) onItemClick();
  };

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100 mt-2">
        {user ? (
          <>
            <Link 
              to="/dashboard?tab=favorites"
              className="flex items-center gap-2 text-gray-600 hover:text-health-600 py-2"
              onClick={onItemClick}
            >
              <Heart className="h-4 w-4" /> My Favorites
            </Link>
            <Link 
              to="/dashboard?tab=orders"
              className="flex items-center gap-2 text-gray-600 hover:text-health-600 py-2"
              onClick={onItemClick}
            >
              <ShoppingBag className="h-4 w-4" /> My Orders
            </Link>
            <Button 
              variant="outline" 
              className="w-full border-red-500 text-red-600 hover:bg-red-50 mt-2"
              onClick={() => {
                handleSignOut();
                if (onItemClick) onItemClick();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="w-full border-health-500 text-health-600 hover:bg-health-50"
              onClick={() => {
                navigate("/auth");
                if (onItemClick) onItemClick();
              }}
            >
              Sign In
            </Button>
            <Button 
              className="w-full bg-health-600 hover:bg-health-700"
              onClick={() => {
                navigate("/find-test");
                if (onItemClick) onItemClick();
              }}
            >
              Get Started
            </Button>
          </>
        )}
      </div>
    );
  }

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-health-500 text-health-600 hover:bg-health-50">
          <User className="h-4 w-4 mr-2" /> Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate("/dashboard?tab=favorites")}>
          <Heart className="h-4 w-4 mr-2" /> My Favorites
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/dashboard?tab=orders")}>
          <ShoppingBag className="h-4 w-4 mr-2" /> My Orders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <Button 
        variant="outline" 
        className="border-health-500 text-health-600 hover:bg-health-50"
        onClick={() => navigate("/auth")}
      >
        Sign In
      </Button>
      <Button 
        className="bg-health-600 hover:bg-health-700"
        onClick={() => navigate("/find-test")}
      >
        Get Started
      </Button>
    </>
  );
};

// Fix missing Link import
import { Link } from "react-router-dom";
