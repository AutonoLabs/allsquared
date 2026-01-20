import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, TrendingUp, CheckSquare, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = trpc.admin.analytics.overview.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Platform statistics and metrics</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      description: "All registered users",
      color: "text-blue-500",
    },
    {
      title: "Total Contracts",
      value: analytics?.totalContracts || 0,
      icon: FileText,
      description: "All contracts created",
      color: "text-indigo-500",
    },
    {
      title: "Active Contracts",
      value: analytics?.activeContracts || 0,
      icon: Clock,
      description: "Currently in progress",
      color: "text-green-500",
    },
    {
      title: "Total Disputes",
      value: analytics?.totalDisputes || 0,
      icon: AlertTriangle,
      description: `${analytics?.openDisputes || 0} currently open`,
      color: "text-orange-500",
    },
    {
      title: "Pending KYC",
      value: analytics?.pendingKyc || 0,
      icon: CheckSquare,
      description: "Awaiting review",
      color: "text-yellow-500",
    },
    {
      title: "Total Revenue",
      value: `£${((analytics?.totalRevenue || 0) / 100).toLocaleString()}`,
      icon: TrendingUp,
      description: "Total processed payments",
      color: "text-emerald-500",
    },
  ];

  // Calculate some derived metrics
  const userGrowthRate = analytics?.totalUsers
    ? ((analytics.recentUsers.length / analytics.totalUsers) * 100).toFixed(1)
    : "0";

  const contractCompletionRate = analytics?.totalContracts
    ? (((analytics.totalContracts - analytics.activeContracts) / analytics.totalContracts) * 100).toFixed(1)
    : "0";

  const disputeRate = analytics?.totalContracts
    ? ((analytics.totalDisputes / analytics.totalContracts) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Platform statistics and metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Contract Completion Rate</span>
              <span className="font-semibold">{contractCompletionRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${contractCompletionRate}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">Dispute Rate</span>
              <span className="font-semibold">{disputeRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(parseFloat(disputeRate), 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">Open Disputes</span>
              <span className="font-semibold">
                {analytics?.openDisputes || 0} / {analytics?.totalDisputes || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <span className="font-semibold">{analytics?.totalUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recent Signups (shown)</span>
              <span className="font-semibold">{analytics?.recentUsers.length || 0}</span>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Recent Activity</p>
              {analytics?.recentUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between py-1">
                  <span className="text-sm truncate max-w-[150px]">
                    {user.name || user.email || "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contract Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="font-semibold text-green-500">{analytics?.activeContracts || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="font-semibold">
                {(analytics?.totalContracts || 0) - (analytics?.activeContracts || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="font-semibold">
                £{((analytics?.totalRevenue || 0) / 100).toLocaleString()}
              </span>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Recent Contracts</p>
              {analytics?.recentContracts.slice(0, 3).map((contract) => (
                <div key={contract.id} className="flex items-center justify-between py-1">
                  <span className="text-sm truncate max-w-[120px]">{contract.title}</span>
                  <span className="text-xs">
                    £{(parseInt(contract.totalAmount || "0") / 100).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-500">
                {analytics?.openDisputes === 0 ? "Healthy" : analytics?.openDisputes || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                {analytics?.openDisputes === 0 ? "No Open Disputes" : "Open Disputes"}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-yellow-500">{analytics?.pendingKyc || 0}</p>
              <p className="text-sm text-muted-foreground">Pending KYC</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-blue-500">{analytics?.activeContracts || 0}</p>
              <p className="text-sm text-muted-foreground">Active Contracts</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-purple-500">{analytics?.totalUsers || 0}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
