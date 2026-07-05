import { useAuth } from "@/hooks/useAuth";
import { hasClerkPublishableKey, SignIn, SignUp } from "@/lib/clerk";
import { trpc } from "@/lib/trpc";
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
import { AllSquaredWordmark } from "@/components/marketing/AllSquaredWordmark";
import { APP_TITLE } from "@/const";
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

  // Prefetch the dashboard payload as soon as the layout mounts and the user
  // is authenticated. This way Dashboard.tsx usually finds the data already
  // cached in React Query and can render the real UI on the first frame,
  // skipping the splash entirely on warm navigations.
  const utils = trpc.useUtils();
  useEffect(() => {
    if (isAuthenticated && !loading) {
      utils.contracts.dashboard.prefetch(undefined, { staleTime: 30_000 });
    }
  }, [isAuthenticated, loading, utils]);

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
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r border-[#c7d0e0] bg-[#f2f1eb]"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-20 justify-center border-b border-[#c7d0e0] px-3">
            <div className="flex items-center gap-3 pl-2 group-data-[collapsible=icon]:px-0 transition-all w-full">
              {isCollapsed ? (
                <div className="relative h-8 w-8 shrink-0 group">
                  <div className="grid h-8 w-8 place-items-center rounded-[4px] border border-[#0b1b33] bg-[#fafaf7] text-[10px] font-semibold text-[#0b1b33]">
                    AS
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="absolute inset-0 flex items-center justify-center rounded-[4px] border border-[#c7d0e0] bg-white opacity-0 transition-opacity hover:bg-[#fafaf7] group-hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6b3f]"
                  >
                    <PanelLeft className="h-4 w-4 text-[#0b1b33]" />
                  </button>
                </div>
              ) : (
                <>
                  <AllSquaredWordmark className="min-w-0" />
                  <button
                    onClick={toggleSidebar}
                    className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[#2d466f] transition-colors hover:bg-white hover:text-[#0b1b33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6b3f]"
                  >
                    <PanelLeft className="h-4 w-4" />
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
                      className={`h-11 rounded-[8px] font-normal transition-all ${
                        isActive
                          ? "bg-[#0b1b33] text-white"
                          : "text-[#2d466f] hover:bg-white hover:text-[#0b1b33]"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${isActive ? "text-white" : "text-[#6b7e9e]"}`}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            {user?.role === 'admin' && (
              <>
                <SidebarSeparator className="my-3 bg-[#c7d0e0]" />
                <SidebarGroup>
                  <SidebarGroupLabel className="as25-font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#6b7e9e]">
                    Admin
                  </SidebarGroupLabel>
                  <SidebarMenu className="px-3">
                    {adminMenuItems.map(item => {
                      const isActive = location === item.path || location.startsWith(item.path + '/');
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            isActive={isActive}
                            onClick={() => setLocation(item.path)}
                            tooltip={item.label}
                            className={`h-11 rounded-[8px] font-normal transition-all ${
                              isActive
                                ? "bg-[#0b1b33] text-white"
                                : "text-[#2d466f] hover:bg-white hover:text-[#0b1b33]"
                            }`}
                          >
                            <item.icon
                              className={`h-5 w-5 ${isActive ? "text-white" : "text-[#6b7e9e]"}`}
                            />
                            <span className="text-sm font-medium">{item.label}</span>
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
                <button className="flex w-full items-center gap-3 rounded-[8px] px-2 py-2 text-left transition-colors hover:bg-white group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6b3f]">
                  <Avatar className="h-9 w-9 shrink-0 border border-[#c7d0e0]">
                    <AvatarFallback className="bg-[#e5f1ea] text-xs font-medium text-[#1f6b3f]">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-medium leading-none text-[#0b1b33]">
                      {user?.name || "-"}
                    </p>
                    <p className="mt-1.5 truncate text-xs text-[#6b7e9e]">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-[8px] border-[#c7d0e0] bg-white">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-[#a8392b] focus:text-[#a8392b]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors hover:bg-[#1f6b3f]/20 ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset className="bg-[#fafaf7]">
        {isMobile && (
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[#c7d0e0] bg-[#fafaf7]/95 px-4 backdrop-blur-xl">
            <SidebarTrigger className="rounded-[8px] text-[#0b1b33] hover:bg-white">
              <Menu className="size-5" />
            </SidebarTrigger>
            <div className="truncate text-sm font-semibold text-[#0b1b33]">
              {activeMenuItem?.label ?? APP_TITLE}
            </div>
          </header>
        )}

        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">{children}</main>

        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#c7d0e0] bg-[#fafaf7]/95 px-2 py-2 backdrop-blur-xl">
            <div className="grid grid-cols-4 gap-1">
              {mobileNavItems.map((item) => {
                const isActive = location === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setLocation(item.value)}
                    className={`flex h-12 flex-col items-center justify-center rounded-[8px] text-[10px] font-medium ${
                      isActive ? "bg-[#0b1b33] text-white" : "text-[#2d466f] hover:bg-white"
                    }`}
                  >
                    {item.icon}
                    <span className="mt-0.5">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </SidebarInset>
    </>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-up");
  const isSignUp = mode === "sign-up";

  return (
    <div className="as25-hero-bg flex min-h-screen items-center justify-center bg-[#fafaf7]">
      <div className="flex w-full max-w-md flex-col items-center gap-8 p-8">
        <div className="flex flex-col items-center gap-6">
          <AllSquaredWordmark />
          <div className="text-center space-y-2">
            <h1 className="as25-font-display text-3xl font-normal text-[#0b1b33]">{APP_TITLE}</h1>
            <p className="text-sm text-[#2d466f]">
              {isSignUp ? "Create your account to get started" : "Sign in to continue"}
            </p>
          </div>
        </div>
        {/* Clerk disclosure — required because AllSquared uses a third-party
            identity provider for account creation and login. Without this,
            users see a Clerk-hosted UI and have no idea who is handling
            their credentials or why. */}
        <div className="w-full rounded-[10px] border border-[#c7d0e0] bg-[#fafaf7]/70 p-3 text-xs leading-5 text-[#2d466f]">
          <p>
            <span className="font-semibold text-[#0b1b33]">Account & sign-in:</span>{" "}
            managed by{" "}
            <a
              href="https://clerk.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-[#1f6b3f] underline underline-offset-2 hover:text-[#0b1b33]"
            >
              Clerk
            </a>
            , a SOC 2 / GDPR-compliant identity provider. AllSquared never sees
            your password.
          </p>
        </div>
        <div className="flex w-full rounded-[10px] border border-[#c7d0e0] bg-white p-1">
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`flex-1 rounded-[8px] px-3 py-2 text-sm font-semibold ${
              isSignUp ? "bg-[#1f6b3f] text-white" : "text-[#2d466f] hover:bg-[#fafaf7]"
            }`}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`flex-1 rounded-[8px] px-3 py-2 text-sm font-semibold ${
              !isSignUp ? "bg-[#1f6b3f] text-white" : "text-[#2d466f] hover:bg-[#fafaf7]"
            }`}
          >
            Sign in
          </button>
        </div>
        {!hasClerkPublishableKey ? (
          <div className="w-full rounded-[18px] border border-[#d7b46a] bg-white p-5 text-left">
            <p className="as25-font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#b45309]">
              Auth configuration missing
            </p>
            <p className="mt-3 text-sm leading-6 text-[#2d466f]">
              Set `VITE_CLERK_PUBLISHABLE_KEY` for this environment. The app cannot sign users in or create accounts without Clerk.
            </p>
          </div>
        ) : isSignUp ? (
          <SignUp
            routing="hash"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard/contracts/new"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                socialButtonsBlockButton__github: { display: "none" },
                socialButtonsIconButton__github: { display: "none" },
              },
            }}
          />
        ) : (
          <SignIn
            routing="hash"
            signUpUrl="/sign-up?redirect=%2Fdashboard%2Fcontracts%2Fnew"
            fallbackRedirectUrl="/dashboard/contracts/new"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                socialButtonsBlockButton__github: { display: "none" },
                socialButtonsIconButton__github: { display: "none" },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
