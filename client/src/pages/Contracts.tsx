import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import { Plus, Search, FileText, ArrowRight, Calendar, Banknote, Tag, AlertCircle } from "lucide-react";

export default function Contracts() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = trpc.contracts.list.useQuery({
    status: statusFilter,
    page: 1,
    limit: 50,
  });

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
    return (
      <div className="space-y-6 p-2">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64 mt-2" />
          </div>
          <Skeleton className="h-11 w-40" />
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-48" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/20 mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold">Failed to load contracts</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                {error.message || "An unexpected error occurred. Please try again."}
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_signature">Pending Signature</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
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
              <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
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


