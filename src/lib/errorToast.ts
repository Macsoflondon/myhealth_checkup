import { toast } from "sonner";

export const errorToast = {
  network: () => {
    toast.error("Connection issue", {
      description: "Please check your internet connection and try again.",
    });
  },

  auth: () => {
    toast.error("Session expired", {
      description: "Please sign in again to continue.",
      action: {
        label: "Sign in",
        onClick: () => {
          window.location.href = "/auth";
        },
      },
    });
  },

  server: () => {
    toast.error("Server error", {
      description: "Something went wrong on our end. Please try again later.",
    });
  },

  rateLimit: () => {
    toast.warning("Slow down", {
      description: "Too many requests. Please wait a moment and try again.",
    });
  },

  generic: (action?: string) => {
    const message = action ? `Failed to ${action}` : "Something went wrong";
    toast.error(message, {
      description: "Please try again.",
    });
  },

  withRetry: (message: string, onRetry: () => void) => {
    toast.error(message, {
      action: {
        label: "Retry",
        onClick: onRetry,
      },
    });
  },

  offline: () => {
    toast.warning("You're offline", {
      description: "Some features may not be available.",
      duration: Infinity,
      id: "offline-toast",
    });
  },

  online: () => {
    toast.dismiss("offline-toast");
    toast.success("Back online", {
      description: "Your connection has been restored.",
    });
  },
};

export default errorToast;
