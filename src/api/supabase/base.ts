import { PostgrestError } from "@supabase/supabase-js";

export interface ApiResponse<T> {
  data: T | null;
  error: PostgrestError | Error | null;
  count?: number | null;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface FilterParams {
  [key: string]: any;
}
