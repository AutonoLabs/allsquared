import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeft, ChevronRight, Eye, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type DisputeStatus = "open" | "under_review" | "resolved" | "escalated" | "closed";

const statusColors: Record<DisputeStatus, string> = {
  open: "bg-red-500",
  under_review: "bg-yellow-500",
  resolved: "bg-green-500",
  escalated: "bg-orange-500",
  closed: "bg-gray-500",
};

export default function AdminDisputes() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | undefined>();
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");
  const [outcome, setOutcome] = useState<"resolved" | "closed">("resolved");

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.disputes.list.useQuery({
    page,
    limit: 20,
    status: statusFilter,
  });

  const { data: disputeDetail, isLoading: loadingDetail } = trpc.admin.disputes.get.useQuery(
    { id: selectedDispute! },
    { enabled: !!selectedDispute }
  );

  const resolveMutation = trpc.admin.disputes.resolve.useMutation({
    onSuccess: () => {
      toast.success("Dispute resolved");
      setSelectedDispute(null);
      setResolution("");
      utils.admin.disputes.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Disputes</h1>
        <p className="text-muted-foreground">Manage and resolve platform disputes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dispute Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Select
              value={statusFilter || "all"}
              onValueChange={(v) => {
                setStatusFilter(v === "all" ? undefined : (v as DisputeStatus));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
                      <TableHead>Dispute ID</TableHead>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.disputes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No disputes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.disputes.map((dispute) => (
                        <TableRow
                          key={dispute.id}
                          className={dispute.status === "open" ? "bg-red-50 dark:bg-red-950/20" : ""}
                        >
                          <TableCell className="font-mono text-xs">
                            {dispute.id.slice(0, 16)}...
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {dispute.contractId.slice(0, 16)}...
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[dispute.status as DisputeStatus]}>
                              {dispute.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {dispute.reason}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {dispute.createdAt
                              ? new Date(dispute.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedDispute(dispute.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {(dispute.status === "open" || dispute.status === "under_review" || dispute.status === "escalated") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedDispute(dispute.id)}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
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
                  {data?.total || 0} disputes
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

      {/* Dispute Detail Dialog */}
      <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              Review and resolve the dispute
            </DialogDescription>
          </DialogHeader>
          {loadingDetail ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : disputeDetail ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={statusColors[disputeDetail.dispute.status as DisputeStatus]}>
                  {disputeDetail.dispute.status.replace("_", " ")}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created: {disputeDetail.dispute.createdAt
                    ? new Date(disputeDetail.dispute.createdAt).toLocaleString()
                    : "-"}
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="mt-1 p-3 bg-muted rounded-md">{disputeDetail.dispute.reason}</p>
              </div>

              {disputeDetail.dispute.evidence && (
                <div>
                  <p className="text-sm text-muted-foreground">Evidence</p>
                  <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {disputeDetail.dispute.evidence}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Raised By</p>
                  <p className="font-medium">{disputeDetail.raisedByUser?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{disputeDetail.raisedByUser?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contract</p>
                  <p className="font-medium">{disputeDetail.contract?.title || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">
                    Value: £{(parseInt(disputeDetail.contract?.totalAmount || "0") / 100).toLocaleString()}
                  </p>
                </div>
              </div>

              {disputeDetail.dispute.resolution && (
                <div>
                  <p className="text-sm text-muted-foreground">Resolution</p>
                  <p className="mt-1 p-3 bg-green-50 dark:bg-green-950/20 rounded-md">
                    {disputeDetail.dispute.resolution}
                  </p>
                </div>
              )}

              {(disputeDetail.dispute.status === "open" ||
                disputeDetail.dispute.status === "under_review" ||
                disputeDetail.dispute.status === "escalated") && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Resolve Dispute</p>
                  <Textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Enter resolution details..."
                    className="mb-3"
                  />
                  <div className="flex items-center gap-4">
                    <Select
                      value={outcome}
                      onValueChange={(v: "resolved" | "closed") => setOutcome(v)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => {
                        if (selectedDispute && resolution) {
                          resolveMutation.mutate({
                            id: selectedDispute,
                            resolution,
                            outcome,
                          });
                        }
                      }}
                      disabled={!resolution || resolveMutation.isPending}
                    >
                      Submit Resolution
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDispute(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
