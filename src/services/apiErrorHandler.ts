import { PostgrestError } from "@supabase/supabase-js";

export type ErrorCategory = "NETWORK" | "AUTH" | "DATA" | "RATE_LIMIT" | "SERVER" | "UNKNOWN";

export interface ParsedError {
  category: ErrorCategory;
  userMessage: string;
  technicalMessage: string;
  retryable: boolean;
  statusCode?: number;
}

const ERROR_MESSAGES: Record<ErrorCategory, string> = {
  NETWORK: "We're having trouble connecting. Please check your internet connection.",
  AUTH: "Your session has expired. Please sign in again.",
  DATA: "The requested information couldn't be found.",
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
  SERVER: "Something went wrong on our end. We're working on it.",
  UNKNOWN: "An unexpected error occurred. Please try again.",
};

export function parseSupabaseError(error: PostgrestError | null): ParsedError {
  if (!error) {
    return {
      category: "UNKNOWN",
      userMessage: ERROR_MESSAGES.UNKNOWN,
      technicalMessage: "Unknown error",
      retryable: true,
    };
  }

  const code = error.code;
  const message = error.message;

  // Auth errors
  if (code === "PGRST301" || message.includes("JWT") || message.includes("auth")) {
    return {
      category: "AUTH",
      userMessage: ERROR_MESSAGES.AUTH,
      technicalMessage: message,
      retryable: false,
    };
  }

  // Not found errors
  if (code === "PGRST116" || message.includes("not found")) {
    return {
      category: "DATA",
      userMessage: ERROR_MESSAGES.DATA,
      technicalMessage: message,
      retryable: false,
    };
  }

  // Rate limiting
  if (code === "PGRST429" || message.includes("rate limit")) {
    return {
      category: "RATE_LIMIT",
      userMessage: ERROR_MESSAGES.RATE_LIMIT,
      technicalMessage: message,
      retryable: true,
    };
  }

  // Server errors
  if (code?.startsWith("5") || message.includes("server")) {
    return {
      category: "SERVER",
      userMessage: ERROR_MESSAGES.SERVER,
      technicalMessage: message,
      retryable: true,
    };
  }

  return {
    category: "UNKNOWN",
    userMessage: ERROR_MESSAGES.UNKNOWN,
    technicalMessage: message,
    retryable: true,
  };
}

export function parseHttpError(status: number, message?: string): ParsedError {
  if (status === 0 || status === undefined) {
    return {
      category: "NETWORK",
      userMessage: ERROR_MESSAGES.NETWORK,
      technicalMessage: message || "Network error",
      retryable: true,
      statusCode: status,
    };
  }

  if (status === 401 || status === 403) {
    return {
      category: "AUTH",
      userMessage: ERROR_MESSAGES.AUTH,
      technicalMessage: message || `HTTP ${status}`,
      retryable: false,
      statusCode: status,
    };
  }

  if (status === 404) {
    return {
      category: "DATA",
      userMessage: ERROR_MESSAGES.DATA,
      technicalMessage: message || "Not found",
      retryable: false,
      statusCode: status,
    };
  }

  if (status === 429) {
    return {
      category: "RATE_LIMIT",
      userMessage: ERROR_MESSAGES.RATE_LIMIT,
      technicalMessage: message || "Rate limited",
      retryable: true,
      statusCode: status,
    };
  }

  if (status >= 500) {
    return {
      category: "SERVER",
      userMessage: ERROR_MESSAGES.SERVER,
      technicalMessage: message || `HTTP ${status}`,
      retryable: true,
      statusCode: status,
    };
  }

  return {
    category: "UNKNOWN",
    userMessage: ERROR_MESSAGES.UNKNOWN,
    technicalMessage: message || `HTTP ${status}`,
    retryable: true,
    statusCode: status,
  };
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }
  if (error instanceof Error && error.message.includes("network")) {
    return true;
  }
  return false;
}

export function getUserFriendlyMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK;
  }
  
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes("auth") || error.message.includes("session")) {
      return ERROR_MESSAGES.AUTH;
    }
    if (error.message.includes("not found")) {
      return ERROR_MESSAGES.DATA;
    }
  }
  
  return ERROR_MESSAGES.UNKNOWN;
}
