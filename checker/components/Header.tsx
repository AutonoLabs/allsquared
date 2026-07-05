import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold text-ink">
          AllSquared — Adjudication
        </Link>
        <Link
          href="/checker"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          Check your notice
        </Link>
      </div>
    </header>
  );
}
