import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, CheckSquare, TrendingUp, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: analytics, isLoading } = trpc.admin.analytics.overview.useQuery();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and quick actions</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: Users,
      description: "Registered users",
      href: "/admin/users",
    },
    {
      title: "Total Contracts",
      value: analytics?.totalContracts || 0,
      icon: FileText,
      description: `${analytics?.activeContracts || 0} active`,
      href: "/admin/contracts",
    },
    {
      title: "Open Disputes",
      value: analytics?.openDisputes || 0,
      icon: AlertTriangle,
      description: `${analytics?.totalDisputes || 0} total`,
      href: "/admin/disputes",
      alert: (analytics?.openDisputes || 0) > 0,
    },
    {
      title: "Pending KYC",
      value: analytics?.pendingKyc || 0,
      icon: CheckSquare,
      description: "Awaiting review",
      href: "/admin/kyc",
      alert: (analytics?.pendingKyc || 0) > 0,
    },
    {
      title: "Revenue",
      value: `£${((analytics?.totalRevenue || 0) / 100).toLocaleString()}`,
      icon: TrendingUp,
      description: "Total processed",
    },
    {
      title: "Active Contracts",
      value: analytics?.activeContracts || 0,
      icon: Clock,
      description: "Currently running",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and quick actions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`${stat.href ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""} ${stat.alert ? "border-orange-500" : ""}`}
            onClick={() => stat.href && setLocation(stat.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.alert ? "text-orange-500" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.recentUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users yet</p>
              ) : (
                analytics?.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{user.name || "Unnamed"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => setLocation("/admin/users")}
            >
              View All Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.recentContracts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contracts yet</p>
              ) : (
                analytics?.recentContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{contract.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {contract.status.replace("_", " ")}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      £{(parseInt(contract.totalAmount || "0") / 100).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => setLocation("/admin/contracts")}
            >
              View All Contracts
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setLocation("/admin/users")}>
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="outline" onClick={() => setLocation("/admin/disputes")}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Review Disputes
            </Button>
            <Button variant="outline" onClick={() => setLocation("/admin/kyc")}>
              <CheckSquare className="mr-2 h-4 w-4" />
              KYC Queue
            </Button>
            <Button variant="outline" onClick={() => setLocation("/admin/audit-logs")}>
              Audit Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
