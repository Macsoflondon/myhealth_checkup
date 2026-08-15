/**
 * Two-way sync between the compare selection and the `?ids=` search param.
 *
 * URL wins on first load (so deep links and shared links always render the
 * intended side-by-side view); afterwards the store drives the URL, keeping
 * the address bar shareable as the user adds or removes tests.
 */
import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "@/lib/router-compat";
import { CompareService } from "@/services/CompareService";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import {
  COMPARE_IDS_PARAM,
  parseCompareIds,
  sameCompareIds,
  serialiseCompareIds,
} from "@/lib/compareUrl";
import type { CompareTestData } from "@/types";

interface CompareUrlSync {
  selected: CompareTestData[];
  /** True while ids from the URL are being resolved into full test rows. */
  isHydrating: boolean;
  /** Ids present in the URL that no longer resolve to a live test. */
  missingIds: string[];
}

export function useCompareUrlSync(): CompareUrlSync {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = useCompareItems();

  const urlIds = useMemo(
    () => parseCompareIds(searchParams.get(COMPARE_IDS_PARAM)),
    [searchParams],
  );
  const storeIds = useMemo(() => selected.map((t) => t.id), [selected]);

  // Ids the URL asks for that the store cannot satisfy yet.
  const unresolvedIds = useMemo(
    () => urlIds.filter((id) => !selected.some((t) => t.id === id)),
    [urlIds, selected],
  );

  const hydratedFromUrl = useRef(false);
  const shouldHydrate = !hydratedFromUrl.current && unresolvedIds.length > 0;

  const { data: fetched, isFetching } = useQuery({
    queryKey: ["compare", "byIds", unresolvedIds],
    queryFn: () => CompareService.getTestsByIds(unresolvedIds),
    enabled: shouldHydrate,
    staleTime: 5 * 60 * 1000,
  });

  // URL -> store (once, on arrival with ids).
  useEffect(() => {
    if (hydratedFromUrl.current || urlIds.length === 0) return;
    if (unresolvedIds.length > 0 && !fetched) return;

    const pool = [...selected, ...(fetched ?? [])];
    const ordered = urlIds
      .map((id) => pool.find((t) => t.id === id))
      .filter((t): t is CompareTestData => Boolean(t));

    hydratedFromUrl.current = true;
    if (ordered.length > 0 && !sameCompareIds(ordered.map((t) => t.id), storeIds)) {
      compareStore.set(ordered);
    }
  }, [urlIds, unresolvedIds, fetched, selected, storeIds]);

  // Stored rows are only a fast first paint: once the selection is settled,
  // re-fetch every id and replace the snapshot with live data so corrected
  // biomarker counts, turnaround and clinical review always win.
  const refreshedFor = useRef<string>("");
  const refreshIds = useMemo(
    () => (storeIds.length > 0 ? storeIds : []),
    [storeIds],
  );
  const refreshKey = refreshIds.join(",");

  const { data: refreshed } = useQuery({
    queryKey: ["compare", "refresh", refreshKey],
    queryFn: () => CompareService.getTestsByIds(refreshIds),
    enabled: refreshIds.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!refreshed || refreshed.length === 0) return;
    if (refreshedFor.current === refreshKey) return;
    refreshedFor.current = refreshKey;

    const byId = new Map(refreshed.map((t) => [t.id, t]));
    const merged = selected.map((t) => byId.get(t.id) ?? t);
    const changed = merged.some((t, i) => t !== selected[i]);
    if (changed) compareStore.set(merged);
  }, [refreshed, refreshKey, selected]);


  // Store -> URL (after hydration, or immediately when the URL carries no ids).
  useEffect(() => {
    if (urlIds.length > 0 && !hydratedFromUrl.current) return;
    if (sameCompareIds(storeIds, urlIds)) return;

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const serialised = serialiseCompareIds(storeIds);
        if (serialised) next.set(COMPARE_IDS_PARAM, serialised);
        else next.delete(COMPARE_IDS_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [storeIds, urlIds, setSearchParams]);

  const missingIds = useMemo(
    () =>
      hydratedFromUrl.current
        ? urlIds.filter((id) => !selected.some((t) => t.id === id))
        : [],
    [urlIds, selected],
  );

  return {
    selected,
    isHydrating: shouldHydrate && isFetching,
    missingIds,
  };
}
