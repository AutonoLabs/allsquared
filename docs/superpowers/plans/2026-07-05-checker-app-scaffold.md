# Checker App Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a new, minimal Next.js 14 app in `checker/` — shared layout, brand-neutral
styling, and a Vercel-ready deploy config — as the foundation the notice-validity checker
and SEO guide pages build on.

**Architecture:** App Router + TypeScript + Tailwind, no database, no auth — this is a
throwaway validation tool per `allsquared-plans/for-repo/ROADMAP.md` Phase 00, not the
Phase 02+ product. Deployed as its own Vercel project (not the existing `allsquared`
project, which now serves the frozen `legacy-app/`) so it can go live without touching
production DNS.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Vitest +
@testing-library/react, pnpm.

## Global Constraints

- Node >= 20 (matches `legacy-app/vercel.json` nodeVersion).
- pnpm as package manager (repo convention — `legacy-app/pnpm-lock.yaml`).
- No new paid dependencies beyond Resend's free tier (used in the notice-validity-checker
  plan) — carries forward the "£0 paid tools" constraint from the vault's
  `validation/11-demand-validation-plan.md`.
- Domain is NOT decided yet (`allsquared-plans/for-repo/STATE.md` open question: "confirm
  chosen domain... before spend"). Do not configure a custom domain; deploy to the default
  `*.vercel.app` URL only.
- Every page must carry the disclaimer: "This is a free, automated indicator — not legal
  advice. It uses calendar days, not the full England & Wales bank-holiday calendar." (the
  full jurisdiction-aware date logic is Phase 02 / R2, not this tool).

---

### Task 1: Initialize the Next.js project

**Files:**
- Create: `checker/package.json`
- Create: `checker/tsconfig.json`
- Create: `checker/next.config.mjs`
- Create: `checker/tailwind.config.ts`
- Create: `checker/postcss.config.mjs`
- Create: `checker/.gitignore`
- Create: `checker/app/globals.css`

**Interfaces:**
- Produces: a working `pnpm dev` / `pnpm build` in `checker/` that later tasks add routes
  to.

- [ ] **Step 1: Create `checker/package.json`**

```json
{
  "name": "allsquared-checker",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "14.2.15",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "6.5.0",
    "@testing-library/react": "16.0.1",
    "@types/node": "20.16.10",
    "@types/react": "18.3.10",
    "@types/react-dom": "18.3.0",
    "autoprefixer": "10.4.20",
    "jsdom": "25.0.1",
    "postcss": "8.4.47",
    "tailwindcss": "3.4.13",
    "typescript": "5.6.2",
    "vitest": "2.1.2"
  }
}
```

- [ ] **Step 2: Create `checker/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `checker/next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 4: Create `checker/tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1b33",
        paper: "#fafaf7",
        accent: "#1f6b3f",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create `checker/postcss.config.mjs`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Create `checker/.gitignore`**

```
node_modules
.next
.vercel
*.local
.env*.local
```

- [ ] **Step 7: Create `checker/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  color: theme("colors.ink");
  background: theme("colors.paper");
}
```

- [ ] **Step 8: Install dependencies**

Run: `cd checker && pnpm install`
Expected: lockfile created (`checker/pnpm-lock.yaml`), no errors.

- [ ] **Step 9: Commit**

```bash
git add checker/package.json checker/tsconfig.json checker/next.config.mjs checker/tailwind.config.ts checker/postcss.config.mjs checker/.gitignore checker/app/globals.css checker/pnpm-lock.yaml
git commit -m "chore(checker): initialize Next.js 14 app scaffold"
```

---

### Task 2: Shared layout — Header, Footer, DisclaimerBanner

**Files:**
- Create: `checker/components/Header.tsx`
- Create: `checker/components/Footer.tsx`
- Create: `checker/components/DisclaimerBanner.tsx`
- Create: `checker/components/__tests__/DisclaimerBanner.test.tsx`
- Create: `checker/app/layout.tsx`
- Create: `checker/app/page.tsx`
- Create: `checker/vitest.config.ts`
- Create: `checker/vitest.setup.ts`

**Interfaces:**
- Consumes: nothing (first UI task)
- Produces: `<Header />`, `<Footer />`, `<DisclaimerBanner />` — no required props — imported
  by `app/layout.tsx` and reused by every route added in the other two plans (the checker
  questionnaire, the SEO guide pages).

- [ ] **Step 1: Add the Vitest React plugin dependency**

Run: `cd checker && pnpm add -D @vitejs/plugin-react@4.3.2`
Expected: added to `package.json` devDependencies, `pnpm-lock.yaml` updated.

- [ ] **Step 2: Create `checker/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3: Create `checker/vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Write the failing test for DisclaimerBanner**

```tsx
// checker/components/__tests__/DisclaimerBanner.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DisclaimerBanner } from "../DisclaimerBanner";

describe("DisclaimerBanner", () => {
  it("renders the not-legal-advice disclaimer", () => {
    render(<DisclaimerBanner />);
    expect(screen.getByText(/not legal advice/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `cd checker && pnpm test`
Expected: FAIL — "Cannot find module '../DisclaimerBanner'" (component doesn't exist yet)

- [ ] **Step 6: Implement DisclaimerBanner**

```tsx
// checker/components/DisclaimerBanner.tsx
export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900">
      This is a free, automated indicator — not legal advice. It uses calendar days, not
      the full England &amp; Wales bank-holiday calendar. For a reviewed assessment,{" "}
      <a href="/checker" className="underline font-medium">
        get the referral pack
      </a>
      .
    </div>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `cd checker && pnpm test`
Expected: PASS — 1 test passed

- [ ] **Step 8: Create Header component**

```tsx
// checker/components/Header.tsx
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
```

- [ ] **Step 9: Create Footer component**

```tsx
// checker/components/Footer.tsx
export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 px-4 py-8 text-sm text-ink/60">
      <div className="mx-auto max-w-4xl">
        <p>
          AllSquared is not a law firm. Adjudication advice, drafting, and party
          representation are unreserved activities under the Legal Services Act 2007.
          Conduct of litigation (court enforcement) is handled by a partner solicitor firm.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 10: Create `checker/app/layout.tsx` wiring the three components**

```tsx
// checker/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

export const metadata: Metadata = {
  title: {
    default: "AllSquared — UK Construction Payment Recovery",
    template: "%s | AllSquared",
  },
  description:
    "Check if your payer served a valid pay less notice, and find out what you're owed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DisclaimerBanner />
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 11: Create a minimal home page placeholder** (full content lands in the
  SEO-guide-pages plan; this task only needs the app to compile)

```tsx
// checker/app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">AllSquared</h1>
      <p className="mt-4 text-ink/70">
        UK construction payment recovery. Content lands in the SEO guide-pages plan.
      </p>
    </div>
  );
}
```

- [ ] **Step 12: Verify the app builds**

Run: `cd checker && pnpm build`
Expected: "Compiled successfully" with no type errors.

- [ ] **Step 13: Commit**

```bash
git add checker/components checker/app checker/vitest.config.ts checker/vitest.setup.ts checker/package.json checker/pnpm-lock.yaml
git commit -m "feat(checker): shared layout with Header, Footer, DisclaimerBanner"
```

---

### Task 3: Vercel deploy config

**Files:**
- Create: `checker/vercel.json`
- Create: `checker/README.md`

**Interfaces:**
- Produces: a `vercel.json` any later `vercel --cwd checker` deploy picks up automatically.

- [ ] **Step 1: Create `checker/vercel.json`**

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

- [ ] **Step 2: Create `checker/README.md`**

```markdown
# AllSquared Checker (Phase 00 validation tool)

Free notice-validity checker + SEO guide pages, built per
`allsquared-plans/for-repo/ROADMAP.md` Phase 00. Not the Phase 02+ product — no rules
engine, no bank-holiday calendar, no auth, no database. Uses calendar-day math and a
persistent disclaimer (see `components/DisclaimerBanner.tsx`).

## Develop

```bash
cd checker
pnpm install
pnpm dev
```

## Deploy

This is a separate Vercel project from the main `allsquared` project (which serves the
frozen `legacy-app/`). Create a new Vercel project rooted at `checker/` and deploy to its
default `*.vercel.app` URL — do not attach a custom domain until the domain/brand
decision in `allsquared-plans/for-repo/STATE.md` is resolved.

```bash
cd checker
vercel link   # first time only — creates a NEW project, do not link to "allsquared"
vercel deploy --prod
```
```

- [ ] **Step 3: Commit**

```bash
git add checker/vercel.json checker/README.md
git commit -m "chore(checker): add Vercel deploy config and README"
```

---

## Verification (end of plan)

1. `cd checker && pnpm install && pnpm build` succeeds with no errors.
2. `cd checker && pnpm test` passes (DisclaimerBanner test).
3. `cd checker && pnpm dev`, visit `http://localhost:3000` — see header, disclaimer banner,
   placeholder home page, footer.
4. Manual (founder task, not subagent): create a new Vercel project pointed at `checker/`,
   confirm a `*.vercel.app` preview URL loads the same page.
