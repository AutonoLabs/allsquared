import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, ChevronLeft, ChevronRight, Eye, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type ContractStatus = "draft" | "pending_signature" | "active" | "completed" | "disputed" | "cancelled";

const statusColors: Record<ContractStatus, string> = {
  draft: "bg-gray-500",
  pending_signature: "bg-yellow-500",
  active: "bg-blue-500",
  completed: "bg-green-500",
  disputed: "bg-red-500",
  cancelled: "bg-gray-400",
};

export default function AdminContracts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | undefined>();
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.contracts.list.useQuery({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter,
  });

  const { data: contractDetail, isLoading: loadingDetail } = trpc.admin.contracts.get.useQuery(
    { id: selectedContract! },
    { enabled: !!selectedContract }
  );

  const cancelMutation = trpc.admin.contracts.cancel.useMutation({
    onSuccess: () => {
      toast.success("Contract cancelled");
      setShowCancelDialog(false);
      setCancelReason("");
      setSelectedContract(null);
      utils.admin.contracts.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateStatusMutation = trpc.admin.contracts.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Contract status updated");
      utils.admin.contracts.list.invalidate();
      utils.admin.contracts.get.invalidate({ id: selectedContract! });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contracts</h1>
        <p className="text-muted-foreground">Manage all platform contracts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter || "all"}
              onValueChange={(v) => {
                setStatusFilter(v === "all" ? undefined : (v as ContractStatus));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
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

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.contracts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No contracts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.contracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">
                            {contract.title}
                            <span className="block text-xs text-muted-foreground truncate max-w-[200px]">
                              {contract.description}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {contract.category.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[contract.status as ContractStatus]}>
                              {contract.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            £{(parseInt(contract.totalAmount || "0") / 100).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {contract.createdAt
                              ? new Date(contract.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedContract(contract.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {contract.status !== "cancelled" && contract.status !== "completed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedContract(contract.id);
                                    setShowCancelDialog(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data?.total || 0)} of{" "}
                  {data?.total || 0} contracts
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {data?.totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= (data?.totalPages || 1)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Contract Detail Dialog */}
      <Dialog open={!!selectedContract && !showCancelDialog} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : contractDetail ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{contractDetail.contract.title}</h3>
                <p className="text-muted-foreground">{contractDetail.contract.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Select
                    value={contractDetail.contract.status}
                    onValueChange={(value: ContractStatus) => {
                      updateStatusMutation.mutate({
                        id: contractDetail.contract.id,
                        status: value,
                      });
                    }}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending_signature">Pending Signature</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="font-medium">
                    £{(parseInt(contractDetail.contract.totalAmount || "0") / 100).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{contractDetail.client?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{contractDetail.client?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-medium">{contractDetail.provider?.name || "Not assigned"}</p>
                  <p className="text-xs text-muted-foreground">{contractDetail.provider?.email}</p>
                </div>
              </div>

              {contractDetail.disputes.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Disputes</p>
                  {contractDetail.disputes.map((dispute) => (
                    <div key={dispute.id} className="p-3 border rounded-md">
                      <Badge
                        variant={dispute.status === "resolved" ? "default" : "destructive"}
                        className="mb-2"
                      >
                        {dispute.status}
                      </Badge>
                      <p className="text-sm">{dispute.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedContract(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Contract Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Contract</DialogTitle>
            <DialogDescription>
              This will permanently cancel the contract. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium">Cancellation Reason</label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter the reason for cancellation..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedContract && cancelReason) {
                  cancelMutation.mutate({ id: selectedContract, reason: cancelReason });
                }
              }}
              disabled={!cancelReason || cancelMutation.isPending}
            >
              Cancel Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
