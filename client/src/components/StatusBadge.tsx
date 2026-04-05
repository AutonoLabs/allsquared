/**
 * Shared StatusBadge component for contract status display.
 * Used across Dashboard, ContractDetail, and Contracts pages.
 */

interface StatusConfig {
  label: string;
  className: string;
  dot: string;
}

const statusConfig: Record<string, StatusConfig> = {
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    dot: "bg-gray-400",
  },
  pending_signature: {
    label: "Pending Signature",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    dot: "bg-blue-500",
  },
  disputed: {
    label: "Disputed",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
    dot: "bg-red-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    dot: "bg-gray-400",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export default StatusBadge;
