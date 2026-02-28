import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import MilestoneManager from "@/components/MilestoneManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  Edit,
  Trash2,
} from "lucide-react";

export default function ContractDetail() {
  const [, params] = useRoute("/dashboard/contracts/:id");
  const [, setLocation] = useLocation();
  const contractId = params?.id || "";
  const [signatureName, setSignatureName] = useState("");
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

  const utils = trpc.useUtils();
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
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container mx-auto py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Contract Not Found</h2>
        <p className="text-muted-foreground mt-2">This contract doesn't exist or you don't have access to it.</p>
        <Button className="mt-6" onClick={() => setLocation("/dashboard/contracts")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
      </div>
    );
  }

  const contractContent = contract.contractContent ? JSON.parse(contract.contractContent as string) : {};
  const signatures = contractContent.signatures || [];

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => setLocation("/dashboard/contracts")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{contract.title}</h1>
              <StatusBadge status={contract.status} />
            </div>
            <p className="text-muted-foreground">{contract.description}</p>
          </div>
          {contract.status === "draft" && (
            <div className="flex gap-2">
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
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{contract.category.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="font-semibold text-lg">
                      £{(parseInt(contract.totalAmount || "0") / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                {contract.startDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(contract.startDate).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                )}
                {contract.endDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">{new Date(contract.endDate).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <MilestoneManager
            contractId={contractId}
            userRole={contract.clientId === "current-user-id" ? "client" : "provider"}
          />

          {/* Signatures */}
          {signatures.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Signatures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {signatures.map((sig: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
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
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
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
            </CardContent>
          </Card>

          {/* Parties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{contract.clientId}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Service Provider</p>
                <p className="font-medium">{contract.providerId || "Not assigned"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
    pending_signature: { label: "Pending Signature", className: "bg-yellow-100 text-yellow-800" },
    active: { label: "Active", className: "bg-green-100 text-green-800" },
    completed: { label: "Completed", className: "bg-blue-100 text-blue-800" },
    disputed: { label: "Disputed", className: "bg-red-100 text-red-800" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600" },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return <Badge className={config.className}>{config.label}</Badge>;
}



