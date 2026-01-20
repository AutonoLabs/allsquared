import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, ExternalLink, Loader2, Wallet, Shield, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PaymentSettings() {
  const { data: connectStatus, isLoading } = trpc.payments.getConnectStatus.useQuery();

  const createAccountMutation = trpc.payments.createConnectedAccount.useMutation({
    onSuccess: (data) => {
      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl;
      }
    },
    onError: (error) => {
      toast.error(`Failed to create account: ${error.message}`);
    },
  });

  const getOnboardingStatus = () => {
    if (!connectStatus?.hasAccount) {
      return {
        status: "not_started",
        label: "Not Started",
        variant: "secondary" as const,
        description: "Set up your account to receive payments from clients.",
      };
    }
    if (!connectStatus.chargesEnabled || !connectStatus.payoutsEnabled) {
      return {
        status: "incomplete",
        label: "Incomplete",
        variant: "outline" as const,
        description: "Complete your Stripe onboarding to start receiving payments.",
      };
    }
    return {
      status: "complete",
      label: "Active",
      variant: "default" as const,
      description: "Your account is set up and ready to receive payments.",
    };
  };

  const status = getOnboardingStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Settings</h1>
        <p className="text-muted-foreground mt-2">
          Set up your account to receive payments from clients through escrow.
        </p>
      </div>

      {/* Connect Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Account
              </CardTitle>
              <CardDescription>{status.description}</CardDescription>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {status.status === "complete" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Account Verified
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You can receive escrow payments from clients.
                  </p>
                </div>
              </div>

              {connectStatus?.accountId && (
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">Stripe Account</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {connectStatus.accountId.slice(0, 12)}...
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://dashboard.stripe.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Stripe Dashboard
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      connectStatus?.hasAccount
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {connectStatus?.hasAccount ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Create Account</p>
                    <p className="text-sm text-muted-foreground">
                      Connect your bank account through Stripe
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      connectStatus?.chargesEnabled
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {connectStatus?.chargesEnabled ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Verify Identity</p>
                    <p className="text-sm text-muted-foreground">
                      Complete identity verification for compliance
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      connectStatus?.payoutsEnabled
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {connectStatus?.payoutsEnabled ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Enable Payouts</p>
                    <p className="text-sm text-muted-foreground">
                      Add bank details to receive payments
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => createAccountMutation.mutate()}
                disabled={createAccountMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createAccountMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                {connectStatus?.hasAccount
                  ? "Continue Setup"
                  : "Set Up Payment Account"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How Escrow Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            How Escrow Payments Work
          </CardTitle>
          <CardDescription>
            Understanding the payment flow for protected transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                1
              </div>
              <h3 className="font-semibold">Client Deposits</h3>
              <p className="text-sm text-muted-foreground">
                When a contract is signed, the client deposits funds into our
                FCA-regulated escrow.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                2
              </div>
              <h3 className="font-semibold">Work Completed</h3>
              <p className="text-sm text-muted-foreground">
                You complete milestones and submit deliverables. The client
                reviews and approves.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                3
              </div>
              <h3 className="font-semibold">Funds Released</h3>
              <p className="text-sm text-muted-foreground">
                Once approved, funds are automatically transferred to your
                connected bank account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">FCA Regulated</p>
                <p className="text-sm text-muted-foreground">
                  Escrow services provided by Transpact Ltd (FCA Ref: 546279)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Stripe Processing</p>
                <p className="text-sm text-muted-foreground">
                  All payments processed securely through Stripe
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50">
        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Important</p>
          <p>
            Your payment account is managed by Stripe. AllSquared does not store your
            bank details. You can manage your account settings directly in the Stripe
            dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
