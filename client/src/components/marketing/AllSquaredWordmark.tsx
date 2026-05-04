import { cn } from "@/lib/utils";
import { Link } from "wouter";

type AllSquaredWordmarkProps = {
  className?: string;
  dark?: boolean;
};

export function AllSquaredWordmark({ className, dark = false }: AllSquaredWordmarkProps) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3 no-underline", className)}>
      <span
        className={cn(
          "relative inline-grid h-[34px] w-[34px] place-items-center rounded-[4px] border-[1.5px] text-[11px] font-semibold tracking-[-0.02em]",
          dark ? "border-white/55 text-white" : "border-[#0b1b33] text-[#0b1b33]",
        )}
        aria-hidden="true"
      >
        <span className="as25-font-body">AS</span>
        <span
          className={cn(
            "as25-font-display absolute right-[3px] top-[1px] text-[10px] italic leading-none",
            dark ? "text-[#8fd1aa]" : "text-[#1f6b3f]",
          )}
        >
          2
        </span>
      </span>
      <span className="as25-font-display inline-flex items-baseline text-[23px] leading-none tracking-[-0.02em]">
        <span className={cn("italic", dark ? "text-white/65" : "text-[#6b7e9e]")}>All</span>
        <span
          className={cn(
            "relative font-semibold after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-px after:origin-left after:scale-x-[0.35] after:content-[''] after:transition-transform after:duration-500 group-hover:after:scale-x-100",
            dark ? "text-white after:bg-[#8fd1aa]" : "text-[#0b1b33] after:bg-[#1f6b3f]",
          )}
        >
          Squared
        </span>
      </span>
    </Link>
  );
}
