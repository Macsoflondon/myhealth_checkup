import { useState, useMemo } from "react";
import { Link } from "@/lib/router-compat";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Database,
  LayoutDashboard,
  Filter,
  Download,
} from "lucide-react";
import { logger } from "@/lib/logger";

type SortField = "test_name" | "category" | "provider_count" | "min_price" | "max_price" | "sample_type";
type SortDir = "asc" | "desc";

interface MasterTestRow {
  id: string;
  test_name: string;
  category: string;
  sample_type: string | null;
  biomarkers: unknown;
  is_active: boolean | null;
  providers: ProviderPricing[];
}

interface ProviderPricing {
  provider_id: string;
  test_name: string;
  price: number | null;
  category: string | null;
  is_active: boolean;
}

const PAGE_SIZE = 25;

function AdminTestDashboardContent() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("test_name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);

  // Fetch master tests
  const { data: masterTests, isLoading: loadingMaster } = useQuery({
    queryKey: ["admin-master-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests_master")
        .select("id, test_name, category, sample_type, biomarkers, is_active")
        .order("category")
        .order("test_name");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all provider tests
  const { data: providerTests, isLoading: loadingProvider } = useQuery({
    queryKey: ["admin-provider-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("id, test_name, provider_id, price, category, is_active")
        .order("provider_id")
        .order("test_name");
      if (error) throw error;
      return data || [];
    },
  });

  const isLoading = loadingMaster || loadingProvider;

  // Build combined rows
  const combinedRows = useMemo<MasterTestRow[]>(() => {
    if (!masterTests || !providerTests) return [];

    return masterTests.map((mt) => {
      const nameLower = mt.test_name.toLowerCase();
      // Match provider tests by name similarity
      const matched = providerTests.filter((pt) => {
        const ptName = pt.test_name.toLowerCase();
        return ptName.includes(nameLower) || nameLower.includes(ptName) ||
          (nameLower.length > 8 && ptName.includes(nameLower.substring(0, Math.min(nameLower.length, 20))));
      });
      return {
        ...mt,
        providers: matched.map((pt) => ({
          provider_id: pt.provider_id,
          test_name: pt.test_name,
          price: pt.price,
          category: pt.category,
          is_active: pt.is_active,
        })),
      };
    });
  }, [masterTests, providerTests]);

  // Extract unique categories and providers
  const categories = useMemo(() => {
    const cats = new Set(combinedRows.map((r) => r.category));
    return Array.from(cats).sort();
  }, [combinedRows]);

  const providers = useMemo(() => {
    if (!providerTests) return [];
    const provs = new Set(providerTests.map((pt) => pt.provider_id));
    return Array.from(provs).sort();
  }, [providerTests]);

  // Filter
  const filtered = useMemo(() => {
    let rows = combinedRows;
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.test_name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.providers.some((p) => p.provider_id.toLowerCase().includes(q))
      );
    }
    if (categoryFilter !== "all") {
      rows = rows.filter((r) => r.category === categoryFilter);
    }
    if (providerFilter !== "all") {
      rows = rows.filter((r) =>
        r.providers.some((p) => p.provider_id === providerFilter)
      );
    }
    return rows;
  }, [combinedRows, search, categoryFilter, providerFilter]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "test_name":
          cmp = a.test_name.localeCompare(b.test_name);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "provider_count":
          cmp = a.providers.length - b.providers.length;
          break;
        case "min_price": {
          const aMin = Math.min(...a.providers.map((p) => p.price ?? Infinity));
          const bMin = Math.min(...b.providers.map((p) => p.price ?? Infinity));
          cmp = aMin - bMin;
          break;
        }
        case "max_price": {
          const aMax = Math.max(...a.providers.map((p) => p.price ?? 0));
          const bMax = Math.max(...b.providers.map((p) => p.price ?? 0));
          cmp = aMax - bMax;
          break;
        }
        case "sample_type":
          cmp = (a.sample_type || "").localeCompare(b.sample_type || "");
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-brand-pink" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-brand-pink" />
    );
  };

  const getBiomarkerCount = (biomarkers: unknown): number => {
    if (Array.isArray(biomarkers)) return biomarkers.length;
    if (typeof biomarkers === "object" && biomarkers !== null) return Object.keys(biomarkers).length;
    return 0;
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined || !isFinite(price)) return "—";
    return `£${price.toFixed(2)}`;
  };

  const exportCSV = () => {
    const headers = ["Test Name", "Category", "Sample Type", "Biomarkers", "Providers", "Min Price", "Max Price"];
    const rows = sorted.map((r) => {
      const prices = r.providers.map((p) => p.price).filter((p): p is number => p !== null);
      return [
        r.test_name,
        r.category,
        r.sample_type || "",
        getBiomarkerCount(r.biomarkers),
        r.providers.map((p) => p.provider_id).join("; "),
        prices.length ? Math.min(...prices) : "",
        prices.length ? Math.max(...prices) : "",
      ].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test_catalogue_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const providerLabel = (id: string) =>
    id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-pink/10">
                <LayoutDashboard className="w-5 h-5 text-brand-pink" />
              </span>
              <h1 className="text-2xl font-bold text-foreground font-montserrat tracking-tight">
                Test catalogue dashboard
              </h1>
            </div>
            <Link
              to="/admin/biomarker-audit"
              className="inline-flex items-center gap-2 rounded-md bg-brand-pink px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-pink/90"
            >
              Open biomarker audit →
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
            Master catalogue with provider pricing — {combinedRows.length} master tests, {providerTests?.length ?? 0} provider listings
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Master tests", value: masterTests?.length ?? 0, icon: Database },
            { label: "Categories", value: categories.length, icon: Filter },
            { label: "Providers", value: providers.length, icon: LayoutDashboard },
            { label: "Provider listings", value: providerTests?.length ?? 0, icon: Database },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-turquoise/10">
                <stat.icon className="w-5 h-5 text-brand-turquoise" />
              </span>
              <div className="min-w-0">
                <div className="text-2xl font-bold leading-tight text-foreground tabular-nums">
                  {stat.value.toLocaleString("en-GB")}
                </div>
                <div className="text-xs text-muted-foreground truncate">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-border bg-card p-3 mb-4 shadow-sm">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tests, categories, providers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={providerFilter} onValueChange={(v) => { setProviderFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All providers</SelectItem>
              {providers.map((p) => (
                <SelectItem key={p} value={p}>{providerLabel(p)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={exportCSV}
            className="shrink-0"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm">
            {filtered.length.toLocaleString("en-GB")} result{filtered.length !== 1 ? "s" : ""}
            {search || categoryFilter !== "all" || providerFilter !== "all" ? " (filtered)" : ""}
          </span>
          <span className="text-muted-foreground text-sm">
            Page {page + 1} of {totalPages || 1}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent bg-muted/50">
                  {([
                    ["test_name", "Test name"],
                    ["category", "Category"],
                    ["sample_type", "Sample"],
                  ] as [SortField, string][]).map(([field, label]) => (
                    <TableHead
                      key={field}
                      className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort(field)}
                    >
                      <span className="flex items-center">
                        {label}
                        <SortIcon field={field} />
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                    Biomarkers
                  </TableHead>
                  <TableHead
                    className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleSort("provider_count")}
                  >
                    <span className="flex items-center">
                      Providers
                      <SortIcon field="provider_count" />
                    </span>
                  </TableHead>
                  <TableHead
                    className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleSort("min_price")}
                  >
                    <span className="flex items-center justify-end">
                      Min price
                      <SortIcon field="min_price" />
                    </span>
                  </TableHead>
                  <TableHead
                    className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleSort("max_price")}
                  >
                    <span className="flex items-center justify-end">
                      Max price
                      <SortIcon field="max_price" />
                    </span>
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                    Provider breakdown
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink mx-auto mb-3" />
                      Loading test data...
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                      No tests found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((row) => {
                    const prices = row.providers.map((p) => p.price).filter((p): p is number => p !== null);
                    const minPrice = prices.length ? Math.min(...prices) : null;
                    const maxPrice = prices.length ? Math.max(...prices) : null;
                    const visibleProviders = row.providers.slice(0, 3);
                    const hiddenCount = row.providers.length - visibleProviders.length;

                    return (
                      <TableRow key={row.id} className="border-border/60 hover:bg-muted/40">
                        <TableCell className="py-2.5 text-foreground font-medium max-w-[220px] truncate">
                          {row.test_name}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="secondary" className="bg-brand-turquoise/10 text-brand-turquoise border-0 text-xs font-medium">
                            {row.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-muted-foreground text-sm capitalize">
                          {row.sample_type || "—"}
                        </TableCell>
                        <TableCell className="py-2.5 text-muted-foreground text-sm tabular-nums">
                          {getBiomarkerCount(row.biomarkers)}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span
                            className={
                              row.providers.length > 0
                                ? "inline-flex min-w-6 justify-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                                : "inline-flex min-w-6 justify-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700"
                            }
                          >
                            {row.providers.length}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-foreground text-sm font-mono tabular-nums">
                          {formatPrice(minPrice)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-foreground text-sm font-mono tabular-nums">
                          {formatPrice(maxPrice)}
                        </TableCell>
                        <TableCell className="py-2.5 max-w-[280px]">
                          <div className="flex flex-wrap items-center gap-1">
                            {row.providers.length === 0 ? (
                              <span className="text-muted-foreground text-xs">No providers</span>
                            ) : (
                              <>
                                {visibleProviders.map((p, i) => (
                                  <Badge
                                    key={`${p.provider_id}-${i}`}
                                    variant="outline"
                                    className="text-[10px] font-medium text-muted-foreground whitespace-nowrap"
                                  >
                                    {providerLabel(p.provider_id)}
                                    {p.price !== null ? ` £${p.price}` : ""}
                                  </Badge>
                                ))}
                                {hiddenCount > 0 && (
                                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    +{hiddenCount} more
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const pageNum = totalPages <= 7 ? i : Math.max(0, Math.min(page - 3, totalPages - 7)) + i;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={page === pageNum ? "bg-brand-pink text-primary-foreground hover:bg-brand-pink/90" : ""}
                >
                  {pageNum + 1}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTestDashboardPage() {
  return <AdminTestDashboardContent />;
}
