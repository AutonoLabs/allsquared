import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { itemVariants } from "@/lib/motion";
import { safeJsonParse } from "@/lib/utils";
import MilestoneManager from "@/components/MilestoneManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSplash } from "@/components/DashboardSplash";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Gavel,
  Send,
  Edit,
  Trash2,
  Tag,
  Banknote,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type ContractSignature = {
  userId?: string;
  name: string;
  signedAt: string;
};

type ContractContent = {
  content?: string;
  variables?: unknown[];
  signatures?: ContractSignature[];
};

export default function ContractDetail() {
  const [, params] = useRoute("/dashboard/contracts/:id");
  const [, setLocation] = useLocation();
  const reduceMotion = useReducedMotion();
  const contractId = params?.id || "";
  const [signatureName, setSignatureName] = useState("");
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeEvidence, setDisputeEvidence] = useState("");

  const utils = trpc.useUtils();
  const { data: currentUser } = trpc.auth.me.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  const { data: contract, isLoading } = trpc.contracts.get.useQuery(
    { id: contractId },
    { staleTime: 30_000, refetchOnWindowFocus: false }
  );

  const signMutation = trpc.contracts.sign.useMutation({
    onSuccess: () => {
      toast.success("Contract signed successfully!");
      utils.contracts.get.invalidate({ id: contractId });
      setIsSignDialogOpen(false);
      setSignatureName("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign contract");
    },
  });

  const sendForSignatureMutation = trpc.contracts.sendForSignature.useMutation({
    onSuccess: () => {
      toast.success("Contract sent for signature!");
      utils.contracts.get.invalidate({ id: contractId });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send contract");
    },
  });

  const deleteMutation = trpc.contracts.delete.useMutation({
    onSuccess: () => {
      toast.success("Contract deleted");
      setLocation("/dashboard/contracts");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete contract");
    },
  });
  const fileDisputeMutation = trpc.disputes.file.useMutation({
    onSuccess: (data) => {
      toast.success("Dispute filed. The other party has been notified.");
      utils.contracts.get.invalidate({ id: contractId });
      setIsDisputeDialogOpen(false);
      setDisputeReason("");
      setDisputeEvidence("");
      setLocation(`/dashboard/disputes/${data.disputeId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to file dispute");
    },
  });


  if (isLoading) {
    return <DashboardSplash message="Loading contract…" />;
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Contract Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">This contract doesn't exist or you don't have access to it.</p>
        <Button onClick={() => setLocation("/dashboard/contracts")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
      </div>
    );
  }

  const contractContent: ContractContent = (() => {
    if (!contract.contractContent) return {};
    const raw = contract.contractContent as string;
    return safeJsonParse<ContractContent>(raw, { content: raw, variables: [] });
  })();
  const signatures = contractContent.signatures || [];

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard/contracts")} className="mb-4 -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{contract.title}</h1>
              <StatusBadge status={contract.status} />
            </div>
            <p className="text-muted-foreground">{contract.description}</p>
          </div>
          {contract.status === "draft" && (
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setLocation(`/dashboard/contracts/${contractId}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this contract?")) {
                    deleteMutation.mutate({ id: contractId });
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contract Details */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Tag className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Category</p>
                    <p className="font-semibold capitalize">{contract.category.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Banknote className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Value</p>
                    <p className="font-semibold text-lg">
                      £{(parseInt(contract.totalAmount || "0") / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                {contract.startDate && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Start Date</p>
                      <p className="font-semibold">{new Date(contract.startDate).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                )}
                {contract.endDate && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">End Date</p>
                      <p className="font-semibold">{new Date(contract.endDate).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <MilestoneManager
            contractId={contractId}
            userRole={currentUser && contract.clientId === currentUser.id ? "client" : "provider"}
          />

          {/* Signatures */}
          {signatures.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Signatures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {signatures.map((sig) => (
                    <div key={sig.userId || sig.name} className="flex items-center gap-3 p-3 rounded-lg border bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-medium">{sig.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Signed on {new Date(sig.signedAt).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <motion.div
            variants={itemVariants}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
              {contract.status === "draft" && (
                <Button
                  className="w-full"
                  onClick={() => sendForSignatureMutation.mutate({ id: contractId })}
                  disabled={sendForSignatureMutation.isPending}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send for Signature
                </Button>
              )}
              {(contract.status === "pending_signature" || contract.status === "active") && (
                <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Sign Contract
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sign Contract</DialogTitle>
                      <DialogDescription>
                        By signing, you agree to the terms and conditions of this contract.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="signatureName">Your Full Name</Label>
                        <Input
                          id="signatureName"
                          placeholder="Enter your full name"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setIsSignDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => signMutation.mutate({ id: contractId, signatureName })}
                        disabled={!signatureName || signMutation.isPending}
                      >
                        Sign Contract
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {contract.status !== "draft" && contract.status !== "cancelled" && contract.status !== "completed" && (
                <Dialog open={isDisputeDialogOpen} onOpenChange={setIsDisputeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Gavel className="mr-2 h-4 w-4" />
                      File a Dispute
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>File a dispute</DialogTitle>
                      <DialogDescription>
                        Explain the issue clearly. AllSquared will open an evidence-exchange and mediation flow.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="disputeReason">What happened?</Label>
                        <Textarea
                          id="disputeReason"
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                          placeholder="Describe the breach, non-payment, delivery issue, or milestone disagreement..."
                          className="min-h-28"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="disputeEvidence">Evidence links or notes</Label>
                        <Textarea
                          id="disputeEvidence"
                          value={disputeEvidence}
                          onChange={(e) => setDisputeEvidence(e.target.value)}
                          placeholder="One item per line: invoice links, screenshots, email summaries, delivery proofs..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setIsDisputeDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => fileDisputeMutation.mutate({
                          contractId,
                          reason: disputeReason,
                          evidence: disputeEvidence.split("\n").map((line) => line.trim()).filter(Boolean),
                        })}
                        disabled={disputeReason.trim().length < 10 || fileDisputeMutation.isPending}
                      >
                        {fileDisputeMutation.isPending ? "Filing..." : "Open Dispute"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {contract.status !== "draft" && contract.status !== "pending_signature" && contract.status !== "active" && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No actions available for this contract status.
                </p>
              )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Parties */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground font-medium mb-1">Client</p>
                <p className="font-medium text-sm">{contract.clientId}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground font-medium mb-1">Service Provider</p>
                <p className="font-medium text-sm">{contract.providerId || "Not assigned"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", dot: "bg-gray-400" },
    pending_signature: { label: "Pending Signature", className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200", dot: "bg-amber-500" },
    active: { label: "Active", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200", dot: "bg-emerald-500" },
    completed: { label: "Completed", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200", dot: "bg-blue-500" },
    disputed: { label: "Disputed", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200", dot: "bg-red-500" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400", dot: "bg-gray-400" },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
