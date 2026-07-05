import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardSplash } from "@/components/DashboardSplash";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Plus, Search, FileText, ArrowRight, Calendar, Banknote, Tag } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const statusTabs = [
  { label: "All", value: undefined },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending_signature" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Disputed", value: "disputed" },
  { label: "Cancelled", value: "cancelled" },
] as const;

export default function Contracts() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const reduceMotion = useReducedMotion();

  const { data, isLoading } = trpc.contracts.list.useQuery(
    {
      status: statusFilter as any,
      page: 1,
      limit: 50,
    },
    { staleTime: 30_000, refetchOnWindowFocus: false }
  );

  const contracts = data?.contracts || [];

  const filteredContracts = contracts.filter((contract) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contract.title.toLowerCase().includes(query) ||
      contract.description?.toLowerCase().includes(query) ||
      contract.category.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return <DashboardSplash message="Loading your contracts…" />;
  }

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your service agreements
          </p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button size="lg" className="shadow-sm">
            <Plus className="mr-2 h-5 w-5" />
            New Contract
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-1 overflow-x-auto border-b border-border">
              {statusTabs.map((tab) => {
                const active = statusFilter === tab.value;

                return (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setStatusFilter(tab.value)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                    {active && !reduceMotion ? (
                      <motion.span
                        layoutId="contracts-filter-underline"
                        className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
                        transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                      />
                    ) : active ? (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      {filteredContracts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <FileText className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold">
                {searchQuery || statusFilter ? "No contracts found" : "No contracts yet"}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                {searchQuery || statusFilter
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first contract to manage your freelance work"}
              </p>
              {!searchQuery && !statusFilter && (
                <Link href="/dashboard/contracts/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Contract
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredContracts.map((contract) => (
            <Link key={contract.id} href={`/dashboard/contracts/${contract.id}`}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -2, boxShadow: "0 14px 30px -18px rgba(15, 23, 42, 0.45)" }}
                transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              >
                <Card className="border-0 shadow-sm transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-base font-semibold truncate">{contract.title}</h3>
                        <StatusBadge status={contract.status} />
                      </div>
                      {contract.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                          {contract.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5" />
                          <span className="capitalize">{contract.category.replace(/_/g, " ")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Banknote className="h-3.5 w-3.5" />
                          <span className="font-medium text-foreground">
                            £{(parseInt(contract.totalAmount || "0") / 100).toLocaleString("en-GB", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        {contract.createdAt && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(contract.createdAt).toLocaleDateString("en-GB")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-2" />
                  </div>
                </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination info */}
      {filteredContracts.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredContracts.length} of {contracts.length} contracts
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", dot: "bg-gray-400" },
    pending_signature: {
      label: "Pending Signature",
      className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
      dot: "bg-amber-500",
    },
    active: { label: "Active", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200", dot: "bg-emerald-500" },
    completed: { label: "Completed", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200", dot: "bg-blue-500" },
    disputed: { label: "Disputed", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200", dot: "bg-red-500" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400", dot: "bg-gray-400" },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
