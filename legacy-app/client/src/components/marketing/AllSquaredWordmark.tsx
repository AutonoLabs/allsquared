import { cn } from "@/lib/utils";
import { Link } from "wouter";

type AllSquaredWordmarkProps = {
  className?: string;
  dark?: boolean;
};

export function AllSquaredWordmark({ className, dark = false }: AllSquaredWordmarkProps) {
  return (
    <Link
      href="/"
      aria-label="AllSquared"
      className={cn("group inline-flex items-center gap-3 no-underline", className)}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 36 36"
        className="h-[34px] w-[34px] shrink-0"
      >
        <path
          data-part="frame"
          fill={dark ? "#ffffff" : "#0b1b33"}
          fillRule="evenodd"
          d="M4 3h28a1 1 0 0 1 1 1v28a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 4v22h22V7H7Zm3 3h6v6h-6v-6Zm10 0h6v6h-6v-6Zm-10 10h6v6h-6v-6Z"
          clipRule="evenodd"
        />
        <path
          data-part="verification"
          fill={dark ? "#8fd1aa" : "#1f6b3f"}
          d="m18.2 23.8 3.1 3.1L31 17.2l2.8 2.8-12.5 12.5-5.9-5.9 2.8-2.8Z"
        />
      </svg>
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
