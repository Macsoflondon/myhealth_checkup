import { Link } from "@/lib/router-compat";
import { ShieldAlert, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminAccessDenialReason = "signed-out" | "no-role" | "error";

/**
 * Explicit access state for admin-only surfaces.
 *
 * Silently redirecting to the homepage made a permissions problem
 * indistinguishable from a broken route, so every denial is now stated plainly.
 */
export const AdminAccessNotice = ({ reason }: { reason: AdminAccessDenialReason }) => {
  const returnTo =
    typeof window === "undefined" ? "/" : window.location.pathname + window.location.search;

  const copy = {
    "signed-out": {
      title: "Sign in to continue",
      body: "This area is restricted to administrators. Sign in and you will be returned to this page.",
    },
    "no-role": {
      title: "You do not have access to this area",
      body: "Your account is signed in but does not hold the administrator role. If you believe this is incorrect, contact the platform owner.",
    },
    error: {
      title: "We could not verify your access",
      body: "Something went wrong while checking your permissions. Try again in a moment.",
    },
  }[reason];

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#081129] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "rgba(34,192,212,0.12)" }}
        >
          {reason === "signed-out" ? (
            <LogIn className="h-6 w-6" style={{ color: "#22c0d4" }} aria-hidden="true" />
          ) : (
            <ShieldAlert className="h-6 w-6" style={{ color: "#e70d69" }} aria-hidden="true" />
          )}
        </div>

        <h1 className="font-heading text-xl font-bold text-brand-navy">{copy.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{copy.body}</p>

        <div className="mt-6 flex flex-col gap-3">
          {reason === "signed-out" && (
            <Button asChild className="rounded-full bg-brand-navy text-white hover:bg-brand-navy/90">
              <Link to={`/admin/login?redirect=${encodeURIComponent(returnTo)}`}>Sign in</Link>
            </Button>
          )}
          {reason === "error" && (
            <Button
              className="rounded-full bg-brand-navy text-white hover:bg-brand-navy/90"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          )}
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/">Return to homepage</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};
