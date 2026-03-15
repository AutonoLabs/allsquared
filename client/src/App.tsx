import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { lazy, Suspense, useEffect, useState, useRef, ComponentType } from "react";

// Retry wrapper for lazy imports — handles stale chunk hashes after deploys
function lazyRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch(() => {
      // Chunk failed to load — likely stale hash after deploy. Reload once.
      const key = "chunk-reload";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
      }
      sessionStorage.removeItem(key);
      return factory(); // try once more after reload flag set
    })
  );
}
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ThemeProvider } from "./contexts/ThemeContext";

// Lazy-loaded page components
const Home = lazyRetry(() => import("./pages/Home"));
const HowItWorks = lazyRetry(() => import("./pages/HowItWorks"));
const Features = lazyRetry(() => import("./pages/Features"));
const Pricing = lazyRetry(() => import("./pages/Pricing"));
const About = lazyRetry(() => import("./pages/About"));
const Contact = lazyRetry(() => import("./pages/Contact"));
const Terms = lazyRetry(() => import("./pages/Terms"));
const Privacy = lazyRetry(() => import("./pages/Privacy"));
const Freelancers = lazyRetry(() => import("./pages/Freelancers"));
const Clients = lazyRetry(() => import("./pages/Clients"));
const LegalServices = lazyRetry(() => import("./pages/LegalServices"));

const Dashboard = lazyRetry(() => import("./pages/Dashboard"));
const Contracts = lazyRetry(() => import("./pages/Contracts"));
const NewContractTypeform = lazyRetry(() => import("./pages/NewContractTypeform"));
const ContractDetail = lazyRetry(() => import("./pages/ContractDetail"));
const Templates = lazyRetry(() => import("./pages/Templates"));
const TemplateEditor = lazyRetry(() => import("./pages/TemplateEditor"));
const Profile = lazyRetry(() => import("./pages/Profile"));
const Billing = lazyRetry(() => import("./pages/Billing"));
const PaymentSettings = lazyRetry(() => import("./pages/PaymentSettings"));

const DashboardLayout = lazyRetry(() => import("./components/DashboardLayout"));
const AdminLayout = lazyRetry(() => import("./components/AdminLayout"));
const AdminDashboard = lazyRetry(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazyRetry(() => import("./pages/admin/AdminUsers"));
const AdminUserDetail = lazyRetry(() => import("./pages/admin/AdminUserDetail"));
const AdminContracts = lazyRetry(() => import("./pages/admin/AdminContracts"));
const AdminDisputes = lazyRetry(() => import("./pages/admin/AdminDisputes"));
const AdminKyc = lazyRetry(() => import("./pages/admin/AdminKyc"));
const AdminAnalytics = lazyRetry(() => import("./pages/admin/AdminAnalytics"));
const AdminAuditLogs = lazyRetry(() => import("./pages/admin/AdminAuditLogs"));

function PageSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

function NavigationLoadingBar() {
  const [location] = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevLocation = useRef(location);

  useEffect(() => {
    if (prevLocation.current !== location) {
      prevLocation.current = location;
      setLoading(true);
      setProgress(30);
      const t1 = setTimeout(() => setProgress(70), 100);
      const t2 = setTimeout(() => setProgress(100), 300);
      const t3 = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [location]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5">
      <div
        className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<PageSpinner />}>
      <Switch>
        {/* Dashboard routes - protected */}
        <Route path="/dashboard">
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </Route>
        <Route path="/dashboard/contracts">
          <DashboardLayout>
            <Contracts />
          </DashboardLayout>
        </Route>
        <Route path="/dashboard/contracts/new">
          <DashboardLayout>
            <NewContractTypeform />
          </DashboardLayout>
        </Route>
        <Route path="/dashboard/contracts/:id">
          <DashboardLayout>
            <ContractDetail />
          </DashboardLayout>
        </Route>
        <Route path="/dashboard/templates">
          <DashboardLayout>
            <Templates />
          </DashboardLayout>
        </Route>
        <Route path="/dashboard/templates/:id">
          <DashboardLayout>
            <TemplateEditor />
          </DashboardLayout>
        </Route>
        <Route path="/dashboard/profile">
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </Route>
        <Route path="/dashboard/settings/billing">
          <DashboardLayout>
            <Billing />
          </DashboardLayout>
        </Route>
        <Route path="/dashboard/settings/payments">
          <DashboardLayout>
            <PaymentSettings />
          </DashboardLayout>
        </Route>

        {/* Admin routes - protected for admins only */}
        <Route path="/admin">
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </Route>
        <Route path="/admin/users">
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        </Route>
        <Route path="/admin/users/:id">
          <AdminLayout>
            <AdminUserDetail />
          </AdminLayout>
        </Route>
        <Route path="/admin/contracts">
          <AdminLayout>
            <AdminContracts />
          </AdminLayout>
        </Route>
        <Route path="/admin/disputes">
          <AdminLayout>
            <AdminDisputes />
          </AdminLayout>
        </Route>
        <Route path="/admin/kyc">
          <AdminLayout>
            <AdminKyc />
          </AdminLayout>
        </Route>
        <Route path="/admin/analytics">
          <AdminLayout>
            <AdminAnalytics />
          </AdminLayout>
        </Route>
        <Route path="/admin/audit-logs">
          <AdminLayout>
            <AdminAuditLogs />
          </AdminLayout>
        </Route>

        {/* Marketing pages - public */}
        <Route path="*">
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Suspense fallback={<PageSpinner />}>
                <Switch>
                  <Route path={"/"} component={Home} />
                  <Route path={"/how-it-works"} component={HowItWorks} />
                  <Route path={"/features"} component={Features} />
                  <Route path={"/pricing"} component={Pricing} />
                  <Route path={"/about"} component={About} />
                  <Route path={"/contact"} component={Contact} />
                  <Route path={"/terms"} component={Terms} />
                  <Route path={"/privacy"} component={Privacy} />
                  <Route path={"/freelancers"} component={Freelancers} />
                  <Route path={"/clients"} component={Clients} />
                  <Route path={"/legal-services"} component={LegalServices} />
                  <Route path={"/404"} component={NotFound} />
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Route>
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <NavigationLoadingBar />
          <Router />
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
