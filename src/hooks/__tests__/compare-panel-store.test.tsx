import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { CompareTestData } from "@/types";

const listed: CompareTestData = {
  id: "real-1",
  name: "Full blood count",
  provider: "Medichecks",
  providerLogo: "",
  price: 59,
  category: "Full Blood Count",
  description: "",
  available: true,
  features: { turnaround: "", collection: "" },
};
const placeholder: CompareTestData = {
  ...listed,
  id: "unlisted-randox",
  name: "Not listed by this provider",
  provider: "Randox Health",
  price: 0,
  available: false,
};

vi.mock("@/lib/router-compat", () => ({
  useSearchParams: () => [new URLSearchParams("panel=full-blood-count"), vi.fn()],
}));
vi.mock("@/services/CompareService", () => ({
  CompareService: {
    getPanelTests: vi.fn(async () => [listed, placeholder]),
    getTestsByIds: vi.fn(async () => []),
  },
}));

import { compareStore } from "@/stores/compareStore";
import { useCompareUrlSync } from "@/hooks/useCompareUrlSync";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe("compare panel view", () => {
  beforeEach(() => compareStore.clear());

  it("renders panel rows without writing them to the compare store", async () => {
    const setSpy = vi.spyOn(compareStore, "set");
    const addSpy = vi.spyOn(compareStore, "add");
    const { result } = renderHook(() => useCompareUrlSync(), { wrapper });
    await waitFor(() => expect(result.current.selected).toHaveLength(2));
    expect(setSpy).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalled();
    expect(compareStore.getAll()).toHaveLength(0);
  });

  it("store rejects placeholder rows", () => {
    compareStore.add(placeholder);
    compareStore.add({ ...listed, id: "unlisted-x" });
    expect(compareStore.getAll()).toHaveLength(0);
    compareStore.set([listed, placeholder]);
    expect(compareStore.getAll().map((t) => t.id)).toEqual(["real-1"]);
  });
});
