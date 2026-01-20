import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Mail, Phone, Building, Calendar, Shield, Ban } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.users.get.useQuery({ id: id! });

  const updateRoleMutation = trpc.admin.users.updateRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated");
      utils.admin.users.get.invalidate({ id: id! });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verifyMutation = trpc.admin.users.verify.useMutation({
    onSuccess: () => {
      toast.success("User verification updated");
      utils.admin.users.get.invalidate({ id: id! });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const banMutation = trpc.admin.users.ban.useMutation({
    onSuccess: () => {
      toast.success("User has been banned");
      utils.admin.users.get.invalidate({ id: id! });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            User not found
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, contracts, subscription, kyc } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{user.name || "Unnamed User"}</h1>
            <p className="text-muted-foreground">User Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
            {user.role}
          </Badge>
          <Badge
            variant={user.verified === "yes" ? "default" : "outline"}
            className={user.verified === "yes" ? "bg-green-500" : ""}
          >
            {user.verified === "yes" ? "Verified" : "Not Verified"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Business Name</p>
                <p className="font-medium">{user.businessName || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>
            {user.address && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{user.address}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">User Type</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {user.userType || "unset"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Change Role</p>
              <Select
                value={user.role}
                onValueChange={(value: "user" | "admin") => {
                  updateRoleMutation.mutate({ id: user.id, role: value });
                }}
                disabled={updateRoleMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Verification Status</p>
              <div className="flex gap-2">
                <Button
                  variant={user.verified === "yes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => verifyMutation.mutate({ id: user.id, verified: "yes" })}
                  disabled={verifyMutation.isPending || user.verified === "yes"}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Verify
                </Button>
                <Button
                  variant={user.verified === "no" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => verifyMutation.mutate({ id: user.id, verified: "no" })}
                  disabled={verifyMutation.isPending || user.verified === "no"}
                >
                  Unverify
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Ban className="h-4 w-4 mr-2" />
                    Ban User
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ban this user?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will suspend the user's account. They will no longer be able to
                      access the platform. This action can be reversed by verifying the user again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => banMutation.mutate({ id: user.id })}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Ban User
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="capitalize">
                {subscription.tier}
              </Badge>
              <Badge
                variant={subscription.status === "active" ? "default" : "secondary"}
                className={subscription.status === "active" ? "bg-green-500" : ""}
              >
                {subscription.status}
              </Badge>
              {subscription.currentPeriodEnd && (
                <span className="text-sm text-muted-foreground">
                  Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {kyc && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">KYC Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge
                variant={kyc.status === "verified" ? "default" : "secondary"}
                className={kyc.status === "verified" ? "bg-green-500" : ""}
              >
                {kyc.status}
              </Badge>
              <span className="text-sm text-muted-foreground capitalize">
                Provider: {kyc.provider.replace("_", " ")}
              </span>
              {kyc.verifiedAt && (
                <span className="text-sm text-muted-foreground">
                  Verified: {new Date(kyc.verifiedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <p className="text-muted-foreground">No contracts</p>
          ) : (
            <div className="space-y-3">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded"
                  onClick={() => setLocation(`/admin/contracts?search=${contract.id}`)}
                >
                  <div>
                    <p className="font-medium">{contract.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {contract.status.replace("_", " ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      £{(parseInt(contract.totalAmount || "0") / 100).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contract.createdAt
                        ? new Date(contract.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
