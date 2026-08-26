import { Link } from "@/lib/router-compat";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MobileAccountLinksProps {
  onNavigate?: () => void;
}

const rowClass =
  "rounded-xl bg-white border-[1.5px] border-[#081129]/10 flex items-center gap-3 px-3 py-2.5 no-underline w-full text-left";

/**
 * Session-aware account block for the mobile navigation drawer.
 * Signed out: a single clear "Sign in" entry. Signed in: dashboard + sign out.
 */
export const MobileAccountLinks = ({ onNavigate }: MobileAccountLinksProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigate?.();
  };

  if (!user) {
    return (
      <Link to="/auth" onClick={onNavigate} className={rowClass}>
        <span
          className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0"
          style={{ background: "#e70d691a" }}
        >
          <LogIn className="w-4 h-4" style={{ color: "#e70d69" }} strokeWidth={2} />
        </span>
        <span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">
          Sign in to your account
        </span>
      </Link>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      <Link to="/health-dashboard" onClick={onNavigate} className={rowClass}>
        <span
          className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0"
          style={{ background: "#22c0d41a" }}
        >
          <LayoutDashboard className="w-4 h-4" style={{ color: "#22c0d4" }} strokeWidth={2} />
        </span>
        <span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">
          My dashboard
        </span>
      </Link>
      <button type="button" onClick={handleSignOut} className={rowClass}>
        <span
          className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0"
          style={{ background: "#0811291a" }}
        >
          <LogOut className="w-4 h-4" style={{ color: "#081129" }} strokeWidth={2} />
        </span>
        <span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">
          Sign out
        </span>
      </button>
    </div>
  );
};
