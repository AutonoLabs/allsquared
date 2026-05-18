import { useState, useEffect } from "react";
import { useUser } from "@clerk/react";
import { trpc } from "@/lib/trpc";
import { containerVariants, itemVariants } from "@/lib/motion";
import { MD3Button } from "@/components/md3/Button";
import { MD3Card, MD3CardContent, MD3CardHeader } from "@/components/md3/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Banknote,
  Activity,
  Target,
  X,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const ONBOARDING_DISMISSED_KEY = "allsquared_onboarding_dismissed";

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const reduceMotion = useReducedMotion();
  const ready = isLoaded && isSignedIn;

  const { data: stats, isLoading: statsLoading } = trpc.contracts.stats.useQuery(
    undefined,
    { enabled: ready }
  );
  const { data: contractsData, isLoading: contractsLoading } = trpc.contracts.list.useQuery(
    { page: 1, limit: 5 },
    { enabled: ready }
  );

  const [onboardingDismissed, setOnboardingDismissed] = useState(() => {
    try { return localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "true"; } catch { return false; }
  });

  function dismissOnboarding() {
    setOnboardingDismissed(true);
    try { localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true"); } catch {}
  }

  if (statsLoading || contractsLoading) {
    return (
      <div className="space-y-8 p-2">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-72 mt-2" />
          </div>
          <Skeleton className="h-11 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <MD3Card key={i} variant="elevated">
              <MD3CardHeader>
                <Skeleton className="h-4 w-24" />
              </MD3CardHeader>
              <MD3CardContent>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32 mt-2" />
              </MD3CardContent>
            </MD3Card>
          ))}
        </div>
        <MD3Card variant="outlined">
          <MD3CardHeader>
            <Skeleton className="h-6 w-40" />
          </MD3CardHeader>
          <MD3CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </MD3CardContent>
        </MD3Card>
      </div>
    );
  }

  const contracts = contractsData?.contracts || [];

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="md3-headline-large text-[var(--md-sys-color-on-surface)]">Dashboard</h1>
          <p className="md3-body-large text-[var(--md-sys-color-on-surface-variant)] mt-1">
            Manage your contracts and milestones
          </p>
        </div>
        <Link href="/dashboard/contracts/new">
          <MD3Button variant="filled" size="lg" icon={<Plus />}>
            New Contract
          </MD3Button>
        </Link>
      </div>

      {/* Onboarding Banner */}
      {!onboardingDismissed && !statsLoading && (stats?.activeContracts || 0) + (stats?.completedContracts || 0) + (stats?.draftContracts || 0) === 0 && (
        <MD3Card variant="filled" className="relative overflow-hidden border-[var(--md-sys-color-primary)]/20">
          <MD3CardContent className="p-6">
            <button
              onClick={dismissOnboarding}
              className="absolute top-3 right-3 rounded-full p-1.5 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-[var(--md-sys-shape-large)] bg-[var(--md-sys-color-primary-container)] flex items-center justify-center shrink-0">
                <Sparkles className="h-6 w-6 text-[var(--md-sys-color-on-primary-container)]" />
              </div>
              <div className="flex-1">
                <h2 className="md3-title-large text-[var(--md-sys-color-on-surface)] mb-1">Welcome to AllSquared 👋</h2>
                <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)] mb-4">
                  Create your first contract in minutes with our AI-powered builder. Protect your work, get paid on time.
                </p>
                <Link href="/dashboard/contracts/new">
                  <MD3Button variant="filled" icon={<Plus />}>
                    Create Your First Contract
                  </MD3Button>
                </Link>
              </div>
            </div>
          </MD3CardContent>
        </MD3Card>
      )}

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <MD3Card variant="elevated">
          <MD3CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="md3-label-large text-[var(--md-sys-color-on-surface-variant)]">Active Contracts</span>
              <div className="h-10 w-10 rounded-[var(--md-sys-shape-large)] bg-[var(--md-sys-color-primary-container)] flex items-center justify-center">
                <FileText className="h-5 w-5 text-[var(--md-sys-color-on-primary-container)]" />
              </div>
            </div>
            <div className="md3-display-small font-bold text-[var(--md-sys-color-on-surface)]">{stats?.activeContracts || 0}</div>
            <p className="md3-body-small text-[var(--md-sys-color-on-surface-variant)] mt-1 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Currently in progress
            </p>
          </MD3CardContent>
          </MD3Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <MD3Card variant="elevated">
          <MD3CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="md3-label-large text-[var(--md-sys-color-on-surface-variant)]">Completed</span>
              <div className="h-10 w-10 rounded-[var(--md-sys-shape-large)] bg-[var(--md-sys-color-tertiary-container)] flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-[var(--md-sys-color-on-tertiary-container)]" />
              </div>
            </div>
            <div className="md3-display-small font-bold text-[var(--md-sys-color-on-surface)]">{stats?.completedContracts || 0}</div>
            <p className="md3-body-small text-[var(--md-sys-color-on-surface-variant)] mt-1 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Successfully finished
            </p>
          </MD3CardContent>
          </MD3Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <MD3Card variant="elevated">
          <MD3CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="md3-label-large text-[var(--md-sys-color-on-surface-variant)]">Draft Contracts</span>
              <div className="h-10 w-10 rounded-[var(--md-sys-shape-large)] bg-[var(--md-sys-color-secondary-container)] flex items-center justify-center">
                <Clock className="h-5 w-5 text-[var(--md-sys-color-on-secondary-container)]" />
              </div>
            </div>
            <div className="md3-display-small font-bold text-[var(--md-sys-color-on-surface)]">{stats?.draftContracts || 0}</div>
            <p className="md3-body-small text-[var(--md-sys-color-on-surface-variant)] mt-1">
              Awaiting completion
            </p>
          </MD3CardContent>
          </MD3Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <MD3Card variant="elevated">
          <MD3CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="md3-label-large text-[var(--md-sys-color-on-surface-variant)]">Total Value</span>
              <div className="h-10 w-10 rounded-[var(--md-sys-shape-large)] bg-[var(--md-sys-color-primary-container)] flex items-center justify-center">
                <Banknote className="h-5 w-5 text-[var(--md-sys-color-on-primary-container)]" />
              </div>
            </div>
            <div className="md3-display-small font-bold text-[var(--md-sys-color-on-surface)]">
              £{((stats?.totalValue || 0) / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <p className="md3-body-small text-[var(--md-sys-color-on-surface-variant)] mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Active + completed
            </p>
          </MD3CardContent>
          </MD3Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Contracts */}
        <MD3Card variant="outlined" className="lg:col-span-2">
          <MD3CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="md3-title-large text-[var(--md-sys-color-on-surface)]">Recent Contracts</h2>
                <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)] mt-1">Your latest contract activity</p>
              </div>
              <Link href="/dashboard/contracts">
                <MD3Button variant="text" size="sm">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </MD3Button>
              </Link>
            </div>
          </MD3CardHeader>
          <MD3CardContent>
            {contracts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-[var(--md-sys-shape-extra-large)] bg-[var(--md-sys-color-surface-container-highest)] mb-4">
                  <FileText className="h-8 w-8 text-[var(--md-sys-color-on-surface-variant)]" />
                </div>
                <h3 className="md3-title-large text-[var(--md-sys-color-on-surface)]">No contracts yet</h3>
                <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)] mt-2 mb-6 max-w-sm mx-auto">
                  Get started by creating your first contract to manage your freelance work
                </p>
                <Link href="/dashboard/contracts/new">
                  <MD3Button variant="filled" icon={<Plus />}>
                    Create Contract
                  </MD3Button>
                </Link>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                className="space-y-2"
              >
                <AnimatePresence initial={!reduceMotion}>
                  {contracts.map((contract) => (
                    <Link key={contract.id} href={`/dashboard/contracts/${contract.id}`}>
                      <motion.div
                        variants={itemVariants}
                        initial={reduceMotion ? false : "hidden"}
                        animate="visible"
                        exit={reduceMotion ? undefined : { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } }}
                        className="flex items-center justify-between p-4 rounded-[var(--md-sys-shape-large)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors cursor-pointer group"
                      >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-[var(--md-sys-shape-medium)] bg-[var(--md-sys-color-primary-container)] flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-[var(--md-sys-color-on-primary-container)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="md3-title-medium text-[var(--md-sys-color-on-surface)] truncate">{contract.title}</h4>
                            <StatusBadge status={contract.status} />
                          </div>
                          <div className="flex items-center gap-3 md3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                            <span className="capitalize">{contract.category.replace('_', ' ')}</span>
                            <span>·</span>
                            <span className="font-medium">
                              £{(parseInt(contract.totalAmount || '0') / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--md-sys-color-on-surface-variant)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </motion.div>
                    </Link>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </MD3CardContent>
        </MD3Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="md3-label-large text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Quick Actions</h3>

          <Link href="/dashboard/contracts/new">
            <MD3Card variant="filled" className="hover:shadow-[var(--md-sys-elevation-1)] transition-all hover:-translate-y-0.5 cursor-pointer group">
              <MD3CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-[var(--md-sys-shape-medium)] bg-[var(--md-sys-color-primary-container)] flex items-center justify-center shrink-0">
                    <Plus className="h-5 w-5 text-[var(--md-sys-color-on-primary-container)]" />
                  </div>
                  <div>
                    <h4 className="md3-title-medium text-[var(--md-sys-color-on-surface)] mb-1">Create Contract</h4>
                    <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)]">
                      Start a new service agreement with AI assistance
                    </p>
                  </div>
                </div>
              </MD3CardContent>
            </MD3Card>
          </Link>

          <Link href="/dashboard/contracts">
            <MD3Card variant="filled" className="hover:shadow-[var(--md-sys-elevation-1)] transition-all hover:-translate-y-0.5 cursor-pointer group">
              <MD3CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-[var(--md-sys-shape-medium)] bg-[var(--md-sys-color-tertiary-container)] flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-[var(--md-sys-color-on-tertiary-container)]" />
                  </div>
                  <div>
                    <h4 className="md3-title-medium text-[var(--md-sys-color-on-surface)] mb-1">View All Contracts</h4>
                    <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)]">
                      Browse and manage all your contracts
                    </p>
                  </div>
                </div>
              </MD3CardContent>
            </MD3Card>
          </Link>

          <Link href="/dashboard/templates">
            <MD3Card variant="filled" className="hover:shadow-[var(--md-sys-elevation-1)] transition-all hover:-translate-y-0.5 cursor-pointer group">
              <MD3CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-[var(--md-sys-shape-medium)] bg-[var(--md-sys-color-secondary-container)] flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5 text-[var(--md-sys-color-on-secondary-container)]" />
                  </div>
                  <div>
                    <h4 className="md3-title-medium text-[var(--md-sys-color-on-surface)] mb-1">Templates</h4>
                    <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)]">
                      Browse contract templates for common services
                    </p>
                  </div>
                </div>
              </MD3CardContent>
            </MD3Card>
          </Link>

          <Link href="/dashboard/profile">
            <MD3Card variant="filled" className="hover:shadow-[var(--md-sys-elevation-1)] transition-all hover:-translate-y-0.5 cursor-pointer group">
              <MD3CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-[var(--md-sys-shape-medium)] bg-[var(--md-sys-color-primary-container)] flex items-center justify-center shrink-0">
                    <TrendingUp className="h-5 w-5 text-[var(--md-sys-color-on-primary-container)]" />
                  </div>
                  <div>
                    <h4 className="md3-title-medium text-[var(--md-sys-color-on-surface)] mb-1">Profile Settings</h4>
                    <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)]">
                      Update your account information
                    </p>
                  </div>
                </div>
              </MD3CardContent>
            </MD3Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)]" },
    pending_signature: { label: "Pending", className: "bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]" },
    active: { label: "Active", className: "bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]" },
    completed: { label: "Completed", className: "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]" },
    disputed: { label: "Disputed", className: "bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]" },
    cancelled: { label: "Cancelled", className: "bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)]" },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--md-sys-shape-small)] text-[11px] font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
