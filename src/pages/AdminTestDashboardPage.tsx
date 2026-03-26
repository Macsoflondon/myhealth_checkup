import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminRoute } from "@/components/auth/AdminRoute";
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
  is_active: boolean;
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
    <div className="min-h-screen bg-[#081129]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#081129]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard className="w-6 h-6 text-brand-pink" />
            <h1 className="text-2xl font-bold text-white font-montserrat">
              Test Catalogue Dashboard
            </h1>
          </div>
          <p className="text-white/60 text-sm">
            Master catalogue with provider pricing — {combinedRows.length} master tests, {providerTests?.length ?? 0} provider listings
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Master Tests", value: masterTests?.length ?? 0, icon: Database },
            { label: "Categories", value: categories.length, icon: Filter },
            { label: "Providers", value: providers.length, icon: LayoutDashboard },
            { label: "Provider Listings", value: providerTests?.length ?? 0, icon: Database },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-brand-turquoise" />
                <span className="text-white/60 text-xs">{stat.label}</span>
              </div>
              <span className="text-xl font-bold text-white">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search tests, categories, providers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={providerFilter} onValueChange={(v) => { setProviderFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map((p) => (
                <SelectItem key={p} value={p}>{providerLabel(p)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={exportCSV}
            className="border-white/10 text-white hover:bg-white/10 shrink-0"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-sm">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {search || categoryFilter !== "all" || providerFilter !== "all" ? " (filtered)" : ""}
          </span>
          <span className="text-white/50 text-sm">
            Page {page + 1} of {totalPages || 1}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  {([
                    ["test_name", "Test Name"],
                    ["category", "Category"],
                    ["sample_type", "Sample"],
                  ] as [SortField, string][]).map(([field, label]) => (
                    <TableHead
                      key={field}
                      className="text-white/70 cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort(field)}
                    >
                      <span className="flex items-center">
                        {label}
                        <SortIcon field={field} />
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="text-white/70 whitespace-nowrap">Biomarkers</TableHead>
                  <TableHead
                    className="text-white/70 cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleSort("provider_count")}
                  >
                    <span className="flex items-center">
                      Providers
                      <SortIcon field="provider_count" />
                    </span>
                  </TableHead>
                  <TableHead
                    className="text-white/70 cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleSort("min_price")}
                  >
                    <span className="flex items-center">
                      Min Price
                      <SortIcon field="min_price" />
                    </span>
                  </TableHead>
                  <TableHead
                    className="text-white/70 cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleSort("max_price")}
                  >
                    <span className="flex items-center">
                      Max Price
                      <SortIcon field="max_price" />
                    </span>
                  </TableHead>
                  <TableHead className="text-white/70 whitespace-nowrap">Provider Breakdown</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-white/50">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink mx-auto mb-3" />
                      Loading test data...
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-white/50">
                      No tests found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((row) => {
                    const prices = row.providers.map((p) => p.price).filter((p): p is number => p !== null);
                    const minPrice = prices.length ? Math.min(...prices) : null;
                    const maxPrice = prices.length ? Math.max(...prices) : null;

                    return (
                      <TableRow key={row.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="text-white font-medium max-w-[200px] truncate">
                          {row.test_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-brand-turquoise/20 text-brand-turquoise border-0 text-xs">
                            {row.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/70 text-sm capitalize">
                          {row.sample_type || "—"}
                        </TableCell>
                        <TableCell className="text-white/70 text-sm">
                          {getBiomarkerCount(row.biomarkers)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={row.providers.length > 0 ? "default" : "destructive"}
                            className={row.providers.length > 0
                              ? "bg-green-500/20 text-green-400 border-0"
                              : "bg-red-500/20 text-red-400 border-0"
                            }
                          >
                            {row.providers.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/70 text-sm font-mono">
                          {formatPrice(minPrice)}
                        </TableCell>
                        <TableCell className="text-white/70 text-sm font-mono">
                          {formatPrice(maxPrice)}
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="flex flex-wrap gap-1">
                            {row.providers.length === 0 ? (
                              <span className="text-white/30 text-xs">No providers</span>
                            ) : (
                              row.providers.map((p, i) => (
                                <Badge
                                  key={`${p.provider_id}-${i}`}
                                  variant="outline"
                                  className="text-[10px] border-white/20 text-white/60 whitespace-nowrap"
                                >
                                  {providerLabel(p.provider_id)}
                                  {p.price !== null ? ` £${p.price}` : ""}
                                </Badge>
                              ))
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
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="border-white/10 text-white hover:bg-white/10"
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
                  className={
                    page === pageNum
                      ? "bg-brand-pink text-white"
                      : "border-white/10 text-white hover:bg-white/10"
                  }
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
              className="border-white/10 text-white hover:bg-white/10"
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
  return (
    <AdminRoute>
      <AdminTestDashboardContent />
    </AdminRoute>
  );
}
