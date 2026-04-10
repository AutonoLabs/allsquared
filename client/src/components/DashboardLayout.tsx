import { useAuth } from "@/hooks/useAuth";
import { SignUp } from "@/lib/clerk";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { MD3NavigationBar } from "@/components/md3/NavigationBar";
import { MD3TopAppBar } from "@/components/md3/TopAppBar";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { LayoutDashboard, LogOut, PanelLeft, Users, FileText, FileCode, UserCircle, Shield, AlertTriangle, CheckSquare, BarChart3, ScrollText, CreditCard, Settings, Menu } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { OnboardingTour } from './OnboardingTour';

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Contracts", path: "/dashboard/contracts" },
  { icon: FileCode, label: "Templates", path: "/dashboard/templates" },
  { icon: UserCircle, label: "Profile", path: "/dashboard/profile" },
  { icon: CreditCard, label: "Billing", path: "/dashboard/settings/billing" },
  { icon: Settings, label: "Payment Settings", path: "/dashboard/settings/payments" },
];

const adminMenuItems = [
  { icon: Shield, label: "Admin", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: FileText, label: "All Contracts", path: "/admin/contracts" },
  { icon: AlertTriangle, label: "Disputes", path: "/admin/disputes" },
  { icon: CheckSquare, label: "KYC Review", path: "/admin/kyc" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: ScrollText, label: "Audit Logs", path: "/admin/audit-logs" },
];

// Mobile bottom nav items (subset)
const mobileNavItems = [
  { icon: <LayoutDashboard className="size-6" />, label: "Dashboard", value: "/dashboard" },
  { icon: <FileText className="size-6" />, label: "Contracts", value: "/dashboard/contracts" },
  { icon: <FileCode className="size-6" />, label: "Templates", value: "/dashboard/templates" },
  { icon: <UserCircle className="size-6" />, label: "Profile", value: "/dashboard/profile" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

// Max ms to show skeleton before falling through to auth screen
const AUTH_LOAD_TIMEOUT_MS = 3000;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user, isAuthenticated } = useAuth();
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  // Safety timeout: if Clerk is still loading unauthenticated after 3s, show auth screen
  useEffect(() => {
    if (!loading || isAuthenticated) {
      setAuthTimeout(false);
      return;
    }
    const t = setTimeout(() => setAuthTimeout(true), AUTH_LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [loading, isAuthenticated]);

  // Show auth screen if definitely not authenticated OR auth load timed out
  if ((!loading && !isAuthenticated) || authTimeout) {
    return <AuthScreen />;
  }

  // Show skeleton while loading and not yet authenticated
  if (loading && !isAuthenticated) {
    return <DashboardLayoutSkeleton />;
  }

  // Authenticated but user data still syncing — don't block, render with Clerk data
  // (useAuth has a 5s timeout fallback, but we shouldn't wait at all if isAuthenticated)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <OnboardingTour />
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location) ||
    adminMenuItems.find(item => item.path === location || location.startsWith(item.path + '/'));
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      {/* Desktop: MD3 Navigation Drawer (sidebar) */}
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0 bg-[var(--md-sys-color-surface-container-low)]"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 pl-2 group-data-[collapsible=icon]:px-0 transition-all w-full">
              {isCollapsed ? (
                <div className="relative h-8 w-8 shrink-0 group">
                  <img
                    src={APP_LOGO}
                    className="h-8 w-8 rounded-[var(--md-sys-shape-medium)] object-cover ring-1 ring-[var(--md-sys-color-outline-variant)]"
                    alt="Logo"
                  />
                  <button
                    onClick={toggleSidebar}
                    className="absolute inset-0 flex items-center justify-center bg-[var(--md-sys-color-secondary-container)] rounded-[var(--md-sys-shape-medium)] ring-1 ring-[var(--md-sys-color-outline-variant)] opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)]"
                  >
                    <PanelLeft className="h-4 w-4 text-[var(--md-sys-color-on-surface)]" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={APP_LOGO}
                      className="h-8 w-8 rounded-[var(--md-sys-shape-medium)] object-cover ring-1 ring-[var(--md-sys-color-outline-variant)] shrink-0"
                      alt="Logo"
                    />
                    <span className="font-semibold tracking-tight truncate text-[var(--md-sys-color-on-surface)]">
                      {APP_TITLE}
                    </span>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="ml-auto h-8 w-8 flex items-center justify-center hover:bg-[var(--md-sys-color-on-surface)]/[0.08] rounded-[var(--md-sys-shape-full)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] shrink-0"
                  >
                    <PanelLeft className="h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" />
                  </button>
                </>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            <SidebarMenu className="px-3 py-1">
              {menuItems.map(item => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      tooltip={item.label}
                      className={`h-14 transition-all font-normal rounded-[var(--md-sys-shape-full)] ${
                        isActive
                          ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                          : "hover:bg-[var(--md-sys-color-on-surface)]/[0.08]"
                      }`}
                    >
                      <item.icon
                        className={`h-6 w-6 ${isActive ? "text-[var(--md-sys-color-on-secondary-container)]" : "text-[var(--md-sys-color-on-surface-variant)]"}`}
                      />
                      <span className="text-sm font-medium tracking-[0.006em]">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            {user?.role === 'admin' && (
              <>
                <SidebarSeparator className="my-2 bg-[var(--md-sys-color-outline-variant)]" />
                <SidebarGroup>
                  <SidebarGroupLabel className="text-[var(--md-sys-color-on-surface-variant)] text-xs font-medium tracking-[0.031em] uppercase">Admin</SidebarGroupLabel>
                  <SidebarMenu className="px-3">
                    {adminMenuItems.map(item => {
                      const isActive = location === item.path || location.startsWith(item.path + '/');
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            isActive={isActive}
                            onClick={() => setLocation(item.path)}
                            tooltip={item.label}
                            className={`h-14 transition-all font-normal rounded-[var(--md-sys-shape-full)] ${
                              isActive
                                ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                                : "hover:bg-[var(--md-sys-color-on-surface)]/[0.08]"
                            }`}
                          >
                            <item.icon
                              className={`h-6 w-6 ${isActive ? "text-[var(--md-sys-color-on-secondary-container)]" : "text-[var(--md-sys-color-on-surface-variant)]"}`}
                            />
                            <span className="text-sm font-medium tracking-[0.006em]">{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroup>
              </>
            )}
          </SidebarContent>

          <SidebarFooter className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-[var(--md-sys-shape-full)] px-2 py-2 hover:bg-[var(--md-sys-color-on-surface)]/[0.08] transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)]">
                  <Avatar className="h-9 w-9 border border-[var(--md-sys-color-outline-variant)] shrink-0">
                    <AvatarFallback className="text-xs font-medium bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none text-[var(--md-sys-color-on-surface)]">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs truncate mt-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-[var(--md-sys-shape-extra-small)] bg-[var(--md-sys-color-surface-container)]">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-[var(--md-sys-color-error)] focus:text-[var(--md-sys-color-error)]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[var(--md-sys-color-primary)]/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset className="bg-[var(--md-sys-color-surface)]">
        {/* Mobile: MD3 Top App Bar */}
        {isMobile && (
          <MD3TopAppBar
            variant="small"
            title={activeMenuItem?.label ?? APP_TITLE}
            leadingIcon={<Menu className="size-6" />}
            elevated
          />
        )}

        <main className="flex-1 p-4 pb-24 md:pb-4">{children}</main>

        {/* Mobile: MD3 Bottom Navigation Bar */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <MD3NavigationBar
              items={mobileNavItems}
              value={location}
              onChange={(value) => setLocation(value)}
            />
          </div>
        )}
      </SidebarInset>
    </>
  );
}

function AuthScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--md-sys-color-surface)]">
      <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="relative">
              <img
                src={APP_LOGO}
                alt={APP_TITLE}
                className="h-20 w-20 rounded-[var(--md-sys-shape-extra-large)] object-cover shadow-[var(--md-sys-elevation-2)]"
              />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--md-sys-color-on-surface)]">{APP_TITLE}</h1>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
              Create your account to get started
            </p>
          </div>
        </div>
        <SignUp
          routing="hash"
          signInUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-0",
            },
          }}
        />
      </div>
    </div>
  );
}
