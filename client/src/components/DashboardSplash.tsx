/**
 * DashboardSplash — branded loading screen for the /dashboard routes.
 *
 * Renders inside DashboardLayout (so the sidebar/header paint instantly from
 * Clerk's localStorage cache) while the data queries are still resolving.
 * Uses a pulsing Squario logo instead of the generic skeleton-bars look.
 */
import { motion } from "framer-motion";

export function DashboardSplash({ message = "Loading your dashboard…" }: { message?: string }) {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4">
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

export default DashboardSplash;