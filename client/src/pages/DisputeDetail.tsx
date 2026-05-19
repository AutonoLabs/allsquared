import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bot, CheckCircle2, FileText, Gavel, MessageSquare, Send, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

type DisputeStatus = "open" | "under_review" | "resolved" | "escalated" | "closed";

const statusClasses: Record<DisputeStatus, string> = {
  open: "bg-red-100 text-red-700",
  under_review: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  escalated: "bg-orange-100 text-orange-700",
  closed: "bg-slate-100 text-slate-700",
};

function parseEvidence(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Fall through to raw text display.
  }
  return [raw];
}

export default function DisputeDetail() {
  const [, params] = useRoute("/dashboard/disputes/:id");
  const [, setLocation] = useLocation();
  const disputeId = params?.id || "";
  const [message, setMessage] = useState("");
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.disputes.get.useQuery({ id: disputeId }, { enabled: !!disputeId });
  const mediateMutation = trpc.disputes.mediate.useMutation({
    onSuccess: () => {
      toast.success("Response submitted");
      setMessage("");
      utils.disputes.get.invalidate({ id: disputeId });
    },
    onError: (error) => toast.error(error.message || "Failed to submit response"),
  });
  const acceptMutation = trpc.disputes.acceptSettlement.useMutation({
    onSuccess: () => {
      toast.success("Settlement response recorded");
      utils.disputes.get.invalidate({ id: disputeId });
    },
    onError: (error) => toast.error(error.message || "Failed to accept settlement"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <ShieldAlert className="h-10 w-10 text-muted-foreground" />
        <div className="text-center">
          <h1 className="text-xl font-semibold">Dispute not found</h1>
          <p className="text-sm text-muted-foreground">You may not have access to this dispute.</p>
        </div>
        <Button onClick={() => setLocation("/dashboard/contracts")}>Back to contracts</Button>
      </div>
    );
  }

  const latestAnalysis = data.analyses?.[0];
  const evidence = parseEvidence(data.dispute.evidence);

  return (
    <div className="space-y-6 p-2">
      <Button variant="ghost" size="sm" onClick={() => setLocation(`/dashboard/contracts/${data.contract.id}`)} className="-ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to contract
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dispute resolution</h1>
            <Badge className={statusClasses[data.dispute.status as DisputeStatus] || statusClasses.open}>
              {data.dispute.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{data.contract.title}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Gavel className="h-5 w-5" /> Claim and evidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reason</p>
                <p className="mt-2 rounded-lg bg-muted p-4 text-sm leading-relaxed">{data.dispute.reason}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Evidence exchange</p>
                {evidence.length ? (
                  <div className="mt-2 space-y-2">
                    {evidence.map((item, index) => (
                      <div key={`${item}-${index}`} className="flex gap-2 rounded-lg border bg-background p-3 text-sm">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="break-words">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No evidence submitted yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Mediation thread</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.mediation?.length ? (
                <div className="space-y-3">
                  {data.mediation.map((entry) => (
                    <div key={entry.id} className="rounded-xl border p-4">
                      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium capitalize">Round {entry.round} · {entry.role}</span>
                        <span>{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ""}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{entry.message}</p>
                      {entry.aiSuggestion && (
                        <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
                          <div className="mb-1 flex items-center gap-1 font-semibold"><Bot className="h-3.5 w-3.5" /> AI next-step suggestion</div>
                          {entry.aiSuggestion}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No mediation messages yet. Be the first to respond.</p>
              )}

              {(data.dispute.status === "open" || data.dispute.status === "under_review") && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Respond with your position, requested outcome, and any additional evidence references..."
                      className="min-h-28"
                    />
                    <Button
                      onClick={() => mediateMutation.mutate({ disputeId, message })}
                      disabled={message.trim().length === 0 || mediateMutation.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit response
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> AI assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {latestAnalysis ? (
                <>
                  <div>
                    <p className="font-medium text-muted-foreground">Recommended action</p>
                    <p className="capitalize">{latestAnalysis.recommendedAction}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Confidence</p>
                    <p className="capitalize">{latestAnalysis.confidence}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Summary</p>
                    <p className="leading-relaxed">{latestAnalysis.contractSummary}</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">AI assessment pending.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Settlement options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.settlements?.length ? data.settlements.map((settlement) => (
                <div key={settlement.id} className="rounded-xl border p-3 text-sm">
                  <p className="font-medium">{settlement.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground capitalize">Status: {settlement.status}</p>
                  {settlement.status === "proposed" && (
                    <Button size="sm" className="mt-3 w-full" onClick={() => acceptMutation.mutate({ settlementId: settlement.id })} disabled={acceptMutation.isPending}>
                      Accept settlement
                    </Button>
                  )}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No settlement option proposed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
