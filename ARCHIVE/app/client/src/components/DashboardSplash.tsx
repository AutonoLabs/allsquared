/**
 * DashboardSplash — branded loading screen used everywhere anything loads.
 *
 * Two variants:
 *   - "page" (default): full-height, used when a route's data is loading
 *   - "compact": smaller height for inline use inside shells that have their
 *     own chrome (sidebar/header) — fills the remaining space below
 *
 * Uses pulsing Squario logo instead of generic skeleton bars.
 */
import { motion } from "framer-motion";

export type SplashVariant = "page" | "compact";

export function DashboardSplash({
  message = "Loading your dashboard…",
  variant = "page",
}: {
  message?: string;
  variant?: SplashVariant;
}) {
  const containerClass =
    variant === "page"
      ? "flex min-h-[calc(100vh-12rem)] items-center justify-center px-4"
      : "flex min-h-[60vh] items-center justify-center px-4";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center gap-5"
      >
        {/* Squario logo with breathing animation */}
        <div className="relative h-16 w-16">
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,#2a8554,#1f6b3f_55%,#002c22)] shadow-[0_8px_24px_-8px_rgba(31,107,63,0.5)]"
          />
          <img
            src="/squario.svg"
            alt=""
            aria-hidden
            className="absolute inset-0 m-auto h-10 w-10"
          />
        </div>

        {/* Title + status */}
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="as25-font-display text-base font-semibold text-[#0b1b33]">
            AllSquared
          </h2>
          <p className="as25-font-mono text-[11px] uppercase tracking-[0.18em] text-[#6b7e9e]">
            {message}
          </p>
        </div>

        {/* Sliding progress bar */}
        <div className="h-0.5 w-32 overflow-hidden rounded-full bg-[#e2e0d6]">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#1f6b3f] to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * InlineLoader — small, inline spinner for component-level loads
 * (search dropdowns, button states, file pickers, etc).
 */
export function InlineLoader({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#6b7e9e]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="h-3.5 w-3.5 rounded-full border-2 border-[#1f6b3f] border-t-transparent"
      />
      {message && <span>{message}</span>}
    </div>
  );
}

export default DashboardSplash;