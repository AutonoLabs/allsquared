import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, FileText, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: string;
  createdAt: string | null;
}

export default function NotificationCenter() {
  const { isSignedIn } = useUser();
  const { data, refetch, error } = trpc.notifications.list.useQuery(undefined, {
    enabled: !!isSignedIn,
    refetchInterval: 30000, // Poll every 30 seconds
  });
  const notifications: Notification[] = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "contract_signed":
      case "contract_updated":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "milestone_submitted":
      case "milestone_approved":
      case "milestone_rejected":
        return <Check className="h-4 w-4 text-green-500" />;
      case "payment_received":
      case "payment_released":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate({ id });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} new</Badge>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mb-2" />
              <p className="text-sm text-muted-foreground">Failed to load notifications</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y" aria-live="polite">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                    notification.isRead === "no" ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => notification.isRead === "no" && handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.createdAt &&
                          formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                      </p>
                    </div>
                    {notification.isRead === "no" && (
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
