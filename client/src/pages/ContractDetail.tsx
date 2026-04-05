import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { safeJsonParse } from "@/lib/utils";
import MilestoneManager from "@/components/MilestoneManager";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Send,
  Edit,
  Trash2,
  Tag,
  Banknote,
} from "lucide-react";

export default function ContractDetail() {
  const [, params] = useRoute("/dashboard/contracts/:id");
  const [, setLocation] = useLocation();
  const contractId = params?.id || "";
  const [signatureName, setSignatureName] = useState("");
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

  const utils = trpc.useUtils();
  const { data: currentUser } = trpc.auth.me.useQuery();
  const { data: contract, isLoading } = trpc.contracts.get.useQuery({ id: contractId });

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

  if (isLoading) {
    return (
      <div className="space-y-6 p-2">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-96" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
              <CardContent><Skeleton className="h-32" /></CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
              <CardContent><Skeleton className="h-48" /></CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-10 w-full" /></CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
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

  const contractContent = (() => {
    if (!contract.contractContent) return {};
    const raw = contract.contractContent as string;
    return safeJsonParse(raw, { content: raw, variables: [] });
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
                    <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-purple-600" />
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
                  {signatures.map((sig: { userId?: string; name: string; signedAt: string }) => (
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
              {contract.status !== "draft" && contract.status !== "pending_signature" && contract.status !== "active" && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No actions available for this contract status.
                </p>
              )}
            </CardContent>
          </Card>

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


