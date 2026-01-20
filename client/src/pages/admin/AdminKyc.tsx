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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type KycStatus = "pending" | "processing" | "verified" | "failed" | "expired" | "requires_input";

const statusColors: Record<KycStatus, string> = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  verified: "bg-green-500",
  failed: "bg-red-500",
  expired: "bg-gray-500",
  requires_input: "bg-orange-500",
};

export default function AdminKyc() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<KycStatus | undefined>();
  const [selectedKyc, setSelectedKyc] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.kyc.list.useQuery({
    page,
    limit: 20,
    status: statusFilter,
  });

  const approveMutation = trpc.admin.kyc.approve.useMutation({
    onSuccess: () => {
      toast.success("KYC approved");
      utils.admin.kyc.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = trpc.admin.kyc.reject.useMutation({
    onSuccess: () => {
      toast.success("KYC rejected");
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedKyc(null);
      utils.admin.kyc.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">KYC Review</h1>
        <p className="text-muted-foreground">Manage identity verifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verification Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Select
              value={statusFilter || "all"}
              onValueChange={(v) => {
                setStatusFilter(v === "all" ? undefined : (v as KycStatus));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="requires_input">Requires Input</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
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
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.verifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No verifications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.verifications.map((kyc) => (
                        <TableRow
                          key={kyc.id}
                          className={kyc.status === "pending" ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}
                        >
                          <TableCell className="font-mono text-xs">
                            {kyc.userId.slice(0, 16)}...
                          </TableCell>
                          <TableCell>
                            {kyc.firstName && kyc.lastName
                              ? `${kyc.firstName} ${kyc.lastName}`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {kyc.verificationType}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">
                            {kyc.provider.replace("_", " ")}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[kyc.status as KycStatus]}>
                              {kyc.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {kyc.createdAt
                              ? new Date(kyc.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {(kyc.status === "pending" || kyc.status === "processing" || kyc.status === "requires_input") && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => approveMutation.mutate({ id: kyc.id })}
                                    disabled={approveMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedKyc(kyc.id);
                                      setShowRejectDialog(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </>
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
                  {data?.total || 0} verifications
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

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject KYC Verification</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this verification. The user will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowRejectDialog(false);
              setRejectReason("");
              setSelectedKyc(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedKyc && rejectReason) {
                  rejectMutation.mutate({ id: selectedKyc, reason: rejectReason });
                }
              }}
              disabled={!rejectReason || rejectMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
