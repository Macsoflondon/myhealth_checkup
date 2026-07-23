import React, { useState } from "react";
import {
  Clock, Home, FlaskConical, CheckCircle, Plus, X, Syringe, Scale, Star, Building2,
} from "lucide-react";
import { getProviderMeta } from "@/constants/providerMeta";
import { getProviderLogo } from "@/constants/providers";
import { getProviderRating } from "@/constants/providerRatings";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import type { CompareTestData } from "@/types";

// Design tokens
export const UTC_NAVY = "#081129";
export const UTC_TURQUOISE = "#22c0d4";
export const UTC_PINK = "#e70d69";
export const UTC_TINT = "#f0f4fa";

export interface UniversalTestData {
  id: string;
  provider_id: string;
  test_name: string;
  category?: string | null;
  description?: string | null;
  price?: number | null;
  total_expected_cost?: number | null;
  collection_fee_amount?: number | null;
  turnaround_days_text?: string | null;
  sample_type?: string | null;
  biomarker_count?: number | null;
  biomarkers_list?: { value: string }[] | string[] | null;
  symptoms?: string[] | null;
  who_should_test?: string | null;
  url?: string | null;
  is_popular?: boolean;
  home_kit_available?: boolean;
  clinic_visit_available?: boolean;
  collection_options?: unknown;
  is_addon?: boolean;
  purchase_notes?: string | null;
}