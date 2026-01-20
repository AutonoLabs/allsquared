import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ThemeProvider } from "./contexts/ThemeContext";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";
import Contracts from "./pages/Contracts";
import NewContractTypeform from "./pages/NewContractTypeform";
import ContractDetail from "./pages/ContractDetail";
import DashboardLayout from "./components/DashboardLayout";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminContracts from "./pages/admin/AdminContracts";
import AdminDisputes from "./pages/admin/AdminDisputes";
import AdminKyc from "./pages/admin/AdminKyc";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import Templates from "./pages/Templates";
import TemplateEditor from "./pages/TemplateEditor";
import Profile from "./pages/Profile";
import Billing from "./pages/Billing";
import PaymentSettings from "./pages/PaymentSettings";
import Freelancers from "./pages/Freelancers";
import Clients from "./pages/Clients";
import LegalServices from "./pages/LegalServices";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
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
        <NewContractTypeform />
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
        <TemplateEditor />
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
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
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
          <Router />
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
