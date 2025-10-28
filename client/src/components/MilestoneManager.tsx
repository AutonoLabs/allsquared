import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Clock, Upload, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface MilestoneManagerProps {
  contractId: string;
  userRole: "client" | "provider";
}

export default function MilestoneManager({ contractId, userRole }: MilestoneManagerProps) {
  const { data: milestones = [], refetch } = trpc.milestones.list.useQuery({ contractId });
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");

  const submitMutation = trpc.milestones.submit.useMutation({
    onSuccess: () => {
      toast.success("Milestone submitted for review");
      setSubmitDialogOpen(false);
      setSubmissionNotes("");
      refetch();
    },
  });

  const approveMutation = trpc.milestones.approve.useMutation({
    onSuccess: () => {
      toast.success("Milestone approved and payment released");
      refetch();
    },
  });

  const rejectMutation = trpc.milestones.reject.useMutation({
    onSuccess: () => {
      toast.success("Milestone rejected");
      refetch();
    },
  });

  const handleSubmit = () => {
    if (!selectedMilestone) return;
    submitMutation.mutate({
      id: selectedMilestone,
      notes: submissionNotes,
    });
  };

  const handleApprove = (id: string) => {
    approveMutation.mutate({ id });
  };

  const handleReject = (id: string, reason: string) => {
    rejectMutation.mutate({ id, reason });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "in_progress":
        return <Badge variant="default"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "submitted":
        return <Badge variant="outline" className="border-blue-500 text-blue-500"><Upload className="h-3 w-3 mr-1" />Submitted</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const completedMilestones = milestones.filter((m: any) => m.status === "approved").length;
  const totalMilestones = milestones.length;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Milestone Progress</CardTitle>
          <CardDescription>
            {completedMilestones} of {totalMilestones} milestones completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{Math.round(progressPercentage)}% Complete</span>
              <span>£{milestones.reduce((sum: number, m: any) => m.status === "approved" ? sum + parseFloat(m.amount) : sum, 0).toLocaleString()} released</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestone List */}
      <div className="space-y-4">
        {milestones.map((milestone: any, index: number) => (
          <Card key={milestone.id} className={milestone.status === "submitted" ? "border-blue-500" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    Milestone {index + 1}: {milestone.title}
                  </CardTitle>
                  <CardDescription>{milestone.description}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(milestone.status)}
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <DollarSign className="h-4 w-4" />
                    £{parseFloat(milestone.amount).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Submission Info */}
              {milestone.submittedAt && (
                <div className="bg-muted p-3 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Submission Details</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted {formatDistanceToNow(new Date(milestone.submittedAt), { addSuffix: true })}
                  </p>
                  {milestone.submissionNotes && (
                    <p className="text-sm">{milestone.submissionNotes}</p>
                  )}
                </div>
              )}

              {/* Rejection Info */}
              {milestone.status === "rejected" && milestone.rejectionReason && (
                <div className="bg-destructive/10 p-3 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-destructive">Rejection Reason</p>
                  <p className="text-sm">{milestone.rejectionReason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {/* Provider Actions */}
                {userRole === "provider" && milestone.status === "pending" && (
                  <Dialog open={submitDialogOpen && selectedMilestone === milestone.id} onOpenChange={setSubmitDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedMilestone(milestone.id)}
                        className="flex-1"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Submit for Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Milestone</DialogTitle>
                        <DialogDescription>
                          Add notes about the completed work for client review
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="notes">Submission Notes</Label>
                          <Textarea
                            id="notes"
                            value={submissionNotes}
                            onChange={(e) => setSubmissionNotes(e.target.value)}
                            placeholder="Describe the work completed for this milestone..."
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
                          Submit Milestone
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Client Actions */}
                {userRole === "client" && milestone.status === "submitted" && (
                  <>
                    <Button
                      onClick={() => handleApprove(milestone.id)}
                      disabled={approveMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve & Release Payment
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="flex-1">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Milestone</DialogTitle>
                          <DialogDescription>
                            Provide a reason for rejecting this milestone
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            id="rejection-reason"
                            placeholder="Explain why this milestone doesn't meet requirements..."
                            rows={4}
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              const reason = (document.getElementById("rejection-reason") as HTMLTextAreaElement)?.value;
                              handleReject(milestone.id, reason);
                            }}
                            disabled={rejectMutation.isPending}
                          >
                            Reject Milestone
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

