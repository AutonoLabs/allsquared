import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Billing() {
  const { data: subscription, isLoading } = trpc.payments.getSubscription.useQuery();

  const createCheckoutMutation = trpc.payments.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(`Failed to create checkout: ${error.message}`);
    },
  });

  const cancelMutation = trpc.payments.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription cancelled. You'll retain access until the end of your billing period.");
    },
    onError: (error) => {
      toast.error(`Failed to cancel: ${error.message}`);
    },
  });

  const reactivateMutation = trpc.payments.reactivateSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription reactivated!");
    },
    onError: (error) => {
      toast.error(`Failed to reactivate: ${error.message}`);
    },
  });

  const tiers = [
    {
      id: "free",
      name: "Free",
      price: "£0",
      period: "/month",
      description: "For occasional projects",
      features: [
        "5 contracts/month",
        "Basic AI generation",
        "Escrow protection",
        "2.5% transaction fee",
        "Email support",
      ],
    },
    {
      id: "starter",
      name: "Starter",
      price: "£15",
      period: "/month",
      description: "For regular freelancers",
      features: [
        "20 contracts/month",
        "Full AI generation",
        "Escrow protection",
        "2.0% transaction fee",
        "Priority email support",
        "Custom branding",
      ],
      highlighted: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "£35",
      period: "/month",
      description: "For busy professionals",
      features: [
        "Unlimited contracts",
        "Advanced AI generation",
        "Escrow protection",
        "1.5% transaction fee",
        "Phone support",
        "Team accounts",
        "API access",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "£99",
      period: "/month",
      description: "For teams and agencies",
      features: [
        "Unlimited everything",
        "Custom AI models",
        "1.0% transaction fee",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ],
    },
  ];

  const handleUpgrade = (tier: "starter" | "pro" | "enterprise") => {
    createCheckoutMutation.mutate({ tier });
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      cancelMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentTier = subscription?.tier || "free";
  const isCancelled = subscription && 'cancelAtPeriodEnd' in subscription && subscription.cancelAtPeriodEnd === "yes";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing information.
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are currently on the{" "}
            <span className="font-semibold capitalize">{currentTier}</span> plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={currentTier === "free" ? "secondary" : "default"}>
              {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
            </Badge>
            {subscription?.status && subscription.status !== "active" && (
              <Badge variant="outline" className="text-amber-500 border-amber-500">
                {subscription.status}
              </Badge>
            )}
            {isCancelled && (
              <Badge variant="destructive">Cancels at period end</Badge>
            )}
          </div>

          {subscription && 'currentPeriodEnd' in subscription && subscription.currentPeriodEnd && (
            <p className="text-sm text-muted-foreground">
              {isCancelled ? "Access ends" : "Renews"} on{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          {currentTier !== "free" && (
            <div className="flex gap-3">
              {isCancelled ? (
                <Button
                  variant="outline"
                  onClick={() => reactivateMutation.mutate()}
                  disabled={reactivateMutation.isPending}
                >
                  {reactivateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Reactivate Subscription
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cancel Subscription
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => {
            const isCurrentPlan = tier.id === currentTier;
            const canUpgrade =
              !isCurrentPlan &&
              tier.id !== "free" &&
              tiers.findIndex((t) => t.id === tier.id) >
                tiers.findIndex((t) => t.id === currentTier);

            return (
              <Card
                key={tier.id}
                className={
                  tier.highlighted && !isCurrentPlan
                    ? "border-primary shadow-lg relative"
                    : isCurrentPlan
                    ? "border-2 border-primary/50"
                    : ""
                }
              >
                {tier.highlighted && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </span>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {tier.name}
                    {isCurrentPlan && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground text-sm">
                      {tier.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {canUpgrade && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleUpgrade(tier.id as "starter" | "pro" | "enterprise")
                      }
                      disabled={createCheckoutMutation.isPending}
                    >
                      {createCheckoutMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Upgrade to {tier.name}
                    </Button>
                  )}
                  {isCurrentPlan && (
                    <Button className="w-full" variant="secondary" disabled>
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>
            Manage your payment method for subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Payment methods are managed through Stripe. When you upgrade, you'll be
              redirected to Stripe's secure checkout.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
