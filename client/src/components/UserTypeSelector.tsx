import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, User, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface UserTypeSelectorProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function UserTypeSelector({ open, onClose, onComplete }: UserTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<"provider" | "client" | "both" | null>(null);
  const { refetch } = trpc.auth.me.useQuery();

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("User type updated successfully");
      refetch();
      onComplete?.();
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update user type: ${error.message}`);
    },
  });

  const handleContinue = () => {
    if (!selectedType) {
      toast.error("Please select a user type");
      return;
    }

    updateProfileMutation.mutate({ userType: selectedType });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose Your Account Type</DialogTitle>
          <DialogDescription>
            Select how you'll be using AllSquared. You can change this later in your profile settings.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card
            className={`cursor-pointer transition-all ${
              selectedType === "provider"
                ? "ring-2 ring-primary shadow-md"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedType("provider")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Service Provider</CardTitle>
                  <CardDescription>
                    I provide services (freelancer, contractor, tradesperson)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create and send contracts to clients</li>
                <li>• Receive secure payments through escrow</li>
                <li>• Track milestones and deliverables</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedType === "client"
                ? "ring-2 ring-primary shadow-md"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedType("client")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Client</CardTitle>
                  <CardDescription>
                    I hire service providers for projects
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Find and hire service providers</li>
                <li>• Securely fund projects with escrow</li>
                <li>• Approve work and release payments</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedType === "both"
                ? "ring-2 ring-primary shadow-md"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedType("both")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Both</CardTitle>
                  <CardDescription>
                    I provide services and hire service providers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full access to all platform features</li>
                <li>• Manage both client and provider contracts</li>
                <li>• Flexible account for any project</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={updateProfileMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!selectedType || updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? "Saving..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
