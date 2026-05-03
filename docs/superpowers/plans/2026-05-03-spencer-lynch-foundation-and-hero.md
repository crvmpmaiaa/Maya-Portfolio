# Spencer Lynch — Foundation & Hero Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a Vercel-deployable Next.js site at `/spencer-lynch/` that ships the full Card Maker's Library design system, a working Vimeo cinema-frame hero showreel (with reduced-motion fallback), top nav, footer (three-option contact + WhatsApp widget + LFC residency stamp), a `/book` page, and a serverless enquiry-form endpoint that emails Spencer.

**Architecture:** Next.js 15 App Router with TypeScript + Tailwind + shadcn/ui. Design tokens locked in `tailwind.config.ts` and `globals.css`. Components colocated by responsibility — `cinema-frame` and `showreel` are independent units; nav/footer/contact share primitives via shadcn. Form submission uses react-hook-form + zod + a serverless `/api/enquiry` route that delivers email via Resend (chosen for free tier + Vercel-native integration). Reduced-motion handled via a single `useReducedMotion` hook that gates the Vimeo iframe.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 3.x · shadcn/ui · framer-motion · react-hook-form · zod · Resend (transactional email) · Google Fonts (Playfair Display, Inter, JetBrains Mono) via `next/font` · ffmpeg (poster extraction, dev-side only)

**Spec:** [`docs/superpowers/specs/2026-05-03-spencer-lynch-site-design.md`](../specs/2026-05-03-spencer-lynch-site-design.md)

**Work directory:** `/Users/admin/Desktop/3D website/spencer-lynch/` (NEW — sibling of existing `native-nature/`, `proposals/`)

**Raw assets (read-only during this plan):**
- `assets/spencer-lynch/video/Spencer Lynch Memorable Magic Copy.mp4` — fallback MP4 + poster source
- `assets/spencer-lynch/logo/SL_Logo_Color_FINAL_JPG Copy.jpg` — colour logo
- `assets/spencer-lynch/logo/SL_Logo_BW_FINAL_JPG Copy.jpg` — B/W logo
- `assets/spencer-lynch/logo/SL_LOGO_WITHOUT_PIPS2 Copy.jpg` — no-pips logo (nav)

---

## Roadmap (where this plan sits)

This is **Plan 1 of an expected 7**. Each subsequent plan will be written when its turn comes, incorporating learnings.

| # | Plan | Output |
|---|------|--------|
| **1** | **Foundation & Hero Shell (this plan)** | **Deployable single-page site: nav + hero showreel + footer + working /book form** |
| 2 | Credentials Sections (§ 01–§ 05) | InfiniteSlider + ProgressiveBlur components, all five credentials sections rendered on homepage |
| 3 | Trick Framework + 3 Tricks at Launch | TrickModal shell, three working tricks (hero pick-a-card + two random pool), `/the-vault` Easter-egg with localStorage persistence |
| 4 | Animated Spencer System (B host + C fallback + A reveals) | Character system using illustration host (or Shadow-Play fallback), photoreal reserved for big trick reveals |
| 5 | Other Pages (about, showreel, tech-illusions, work + work/[slug], hidden routes) | Remaining routes wired up, case-study schema |
| 6 | Testimonials Carousel + Social Viral Strip | DMC pattern testimonials + Instagram/TikTok embed strip |
| 7 | Polish & Launch | Lighthouse ≥ 90 perf / ≥ 95 a11y, mobile parity audit, domain swap, Vercel deploy |

**This plan is intentionally scoped to a publishable v0.1.** Once it deploys, every future plan adds layers without disrupting what's live.

---

## File Structure (created by this plan)

```
spencer-lynch/
├── .env.local.example                          # RESEND_API_KEY + ENQUIRY_TO_EMAIL placeholders
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── components.json                             # shadcn config
├── app/
│   ├── layout.tsx                              # root layout with fonts + Tailwind
│   ├── page.tsx                                # homepage (hero only in this plan)
│   ├── book/
│   │   └── page.tsx                            # /book page (mirrors footer contact, full-width)
│   ├── globals.css                             # Tailwind base + design system tokens + film-grain texture
│   └── api/
│       └── enquiry/
│           └── route.ts                        # POST /api/enquiry → Resend
├── components/
│   ├── ui/                                     # shadcn primitives (button, input, textarea, label, form)
│   ├── nav/
│   │   └── top-nav.tsx                         # Top nav with no-pips logo + nav links + Try-a-Trick pill
│   ├── footer/
│   │   ├── site-footer.tsx                     # Footer with 3-option contact + LFC stamp + socials
│   │   └── whatsapp-widget.tsx                 # Floating WA button (every page)
│   ├── showreel/
│   │   ├── cinema-frame.tsx                    # Reusable framed container w/ corner brackets + slate rows
│   │   └── hero-showreel.tsx                   # Vimeo iframe + reduced-motion swap + affordances
│   ├── contact/
│   │   ├── enquiry-form.tsx                    # zod + react-hook-form
│   │   └── enquiry-schema.ts                   # zod schema (shared client + server)
│   └── brand/
│       ├── lfc-stamp.tsx                       # "Resident Magician · Liverpool FC · Since 2006" badge
│       └── sl-logo.tsx                         # <img> wrapper with three variant props (color/bw/no-pips)
├── lib/
│   ├── hooks/
│   │   └── use-reduced-motion.ts               # SSR-safe matchMedia hook
│   └── env.ts                                  # zod-validated env vars
├── public/
│   ├── brand/
│   │   ├── logo-color.jpg                      # copied from assets/spencer-lynch/logo/
│   │   ├── logo-bw.jpg
│   │   └── logo-no-pips.jpg
│   ├── img/
│   │   └── showreel-poster.jpg                 # ffmpeg-extracted from local MP4
│   └── video/
│       └── showreel-fallback.mp4               # the local 1024×576 MP4
└── tests/
    ├── unit/
    │   ├── enquiry-schema.test.ts              # zod schema tests
    │   └── use-reduced-motion.test.tsx         # hook test
    └── e2e/
        └── homepage-smoke.spec.ts              # Playwright smoke test
```

---

## Design Tokens Reference

All tokens belong in `tailwind.config.ts` (`theme.extend`) and `app/globals.css` (`@layer base`). Defined once, used via Tailwind classes everywhere.

| Token | Tailwind class | Hex | Use |
|---|---|---|---|
| `ink` | `bg-ink`, `text-ink` | `#070504` | Page bg |
| `ink-warm` | `bg-ink-warm` | `#0A0807` | Card/panel bg |
| `ink-tinted` | — (used in gradients) | `#1A1308` | Hero gradient inner |
| `cream` | `text-cream`, `bg-cream` | `#F5E6C8` | Body text on dark |
| `cream/70` | opacity utility | `rgba(245,230,200,0.7)` | Secondary text |
| `gold` | `text-gold`, `border-gold` | `#D4AF37` | Primary accent |
| `gold-deep` | `text-gold-deep` | `#7A5A18` | Secondary accent |
| `red-logo` | `text-red-logo` | `#C8102E` | Logo flourish only — not UI |
| `font-serif-display` | `font-display` | Playfair Display 700 italic | Hero, § headlines |
| `font-sans` | `font-sans` (default) | Inter | Body, labels, nav |
| `font-mono` | `font-mono` | JetBrains Mono | Tech detail strips |
| `tracking-eyebrow` | `tracking-[0.4em]` | letter-spacing 0.4em | Section labels |
| `motion-luxe` | custom ease | `cubic-bezier(0.16, 1, 0.3, 1)` | Default ease-out |

---

# Phase 0 — Bootstrap

## Task 0.1: Initialize Next.js project

**Files:**
- Create: `/Users/admin/Desktop/3D website/spencer-lynch/` (entire project tree)

- [ ] **Step 1: Verify no spencer-lynch directory exists yet**

```bash
ls "/Users/admin/Desktop/3D website/spencer-lynch" 2>&1
```
Expected: "No such file or directory"

- [ ] **Step 2: Bootstrap with create-next-app**

```bash
cd "/Users/admin/Desktop/3D website" && \
npx --yes create-next-app@latest spencer-lynch \
  --typescript --tailwind --eslint --app \
  --src-dir=false --import-alias="@/*" \
  --turbopack=false \
  --use-npm --skip-install
```
Expected: Generates `spencer-lynch/` with `package.json`, `app/`, `tailwind.config.ts`, etc. No node_modules yet.

- [ ] **Step 3: Install dependencies**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && npm install
```

- [ ] **Step 4: Verify dev server boots**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && npm run dev
```
Open `http://localhost:3000`. Expected: default Next.js welcome page renders. Stop the server (Ctrl+C) before continuing.

- [ ] **Step 5: Initial commit**

```bash
cd "/Users/admin/Desktop/3D website" && \
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): bootstrap Next.js + Tailwind + TypeScript project"
```

## Task 0.2: Install runtime dependencies

**Files:** Modify `spencer-lynch/package.json`

- [ ] **Step 1: Install runtime deps**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && \
npm install framer-motion react-use-measure motion react-hook-form @hookform/resolvers zod resend
```

- [ ] **Step 2: Install dev deps (testing)**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && \
npm install --save-dev @playwright/test vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Install Playwright browsers**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && \
npx playwright install chromium
```

- [ ] **Step 4: Commit**

```bash
git add spencer-lynch/package.json spencer-lynch/package-lock.json && \
git commit -m "feat(spencer-lynch): add framer-motion, zod/react-hook-form, resend, vitest, playwright"
```

## Task 0.3: Initialize shadcn/ui

**Files:** Create `spencer-lynch/components.json`, `spencer-lynch/components/ui/*.tsx` (button, input, textarea, label, form)

- [ ] **Step 1: Initialize shadcn**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && \
npx --yes shadcn@latest init -y -d
```

- [ ] **Step 2: Add the primitives we need**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && \
npx --yes shadcn@latest add button input textarea label form select
```
Expected: creates `components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `form.tsx`, `select.tsx`.

- [ ] **Step 3: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): initialize shadcn/ui with button, input, textarea, label, form, select"
```

## Task 0.4: Configure vitest and Playwright

**Files:**
- Create: `spencer-lynch/vitest.config.ts`, `spencer-lynch/playwright.config.ts`, `spencer-lynch/tests/setup.ts`
- Modify: `spencer-lynch/package.json` (scripts)
- Modify: `spencer-lynch/tsconfig.json` (add tests to includes)

- [ ] **Step 1: Create `vitest.config.ts`**

```typescript
// spencer-lynch/vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 2: Create `tests/setup.ts`**

```typescript
// spencer-lynch/tests/setup.ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Create `playwright.config.ts`**

```typescript
// spencer-lynch/playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 4: Add test scripts to `package.json`**

In `spencer-lynch/package.json`, the `scripts` block becomes:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 5: Verify scripts work**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && npm run test
```
Expected: "No test files found, exiting with code 0" (no tests yet — that's fine).

- [ ] **Step 6: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): configure vitest + Playwright with example scripts"
```

---

# Phase 1 — Design System

## Task 1.1: Lock palette + fonts in Tailwind

**Files:**
- Modify: `spencer-lynch/tailwind.config.ts`
- Modify: `spencer-lynch/app/layout.tsx` (font loading)

- [ ] **Step 1: Replace the entire content of `tailwind.config.ts`**

```typescript
// spencer-lynch/tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070504",
        "ink-warm": "#0A0807",
        "ink-tinted": "#1A1308",
        cream: "#F5E6C8",
        gold: "#D4AF37",
        "gold-deep": "#7A5A18",
        "red-logo": "#C8102E",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      letterSpacing: {
        eyebrow: "0.4em",
        eyebrowWide: "0.55em",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 2: Configure `next/font` in root layout**

Replace `spencer-lynch/app/layout.tsx` with:

```tsx
// spencer-lynch/app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spencer Lynch — Memorable Magic",
  description:
    "The only magician to hold simultaneous resident positions at two Premier League clubs. Twenty years of close-up. One card, up close.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="bg-ink text-cream font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Replace `app/globals.css` with our base layer**

```css
/* spencer-lynch/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --gold-hairline: linear-gradient(
      90deg,
      transparent,
      rgba(212, 175, 55, 0.3) 50%,
      transparent
    );
  }
  body {
    background-color: #070504;
    color: #F5E6C8;
  }
  /* subtle 45° pinstripe overlay used on hero sections */
  .pinstripe {
    background-image: repeating-linear-gradient(
      45deg,
      transparent 0 28px,
      rgba(212, 175, 55, 0.025) 28px 29px
    );
  }
}
```

- [ ] **Step 4: Verify it renders**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && npm run dev
```
Open `http://localhost:3000`. Expected: dark page (#070504), Inter font on the welcome text, no errors. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): lock design tokens — palette, fonts, motion easing, hairline utility"
```

## Task 1.2: Copy logo assets and extract showreel poster

**Files:**
- Create: `spencer-lynch/public/brand/logo-color.jpg`, `logo-bw.jpg`, `logo-no-pips.jpg`
- Create: `spencer-lynch/public/img/showreel-poster.jpg`
- Create: `spencer-lynch/public/video/showreel-fallback.mp4`

- [ ] **Step 1: Copy logo files**

```bash
cd "/Users/admin/Desktop/3D website" && \
mkdir -p spencer-lynch/public/brand spencer-lynch/public/img spencer-lynch/public/video && \
cp "assets/spencer-lynch/logo/SL_Logo_Color_FINAL_JPG Copy.jpg" spencer-lynch/public/brand/logo-color.jpg && \
cp "assets/spencer-lynch/logo/SL_Logo_BW_FINAL_JPG Copy.jpg" spencer-lynch/public/brand/logo-bw.jpg && \
cp "assets/spencer-lynch/logo/SL_LOGO_WITHOUT_PIPS2 Copy.jpg" spencer-lynch/public/brand/logo-no-pips.jpg && \
cp "assets/spencer-lynch/video/Spencer Lynch Memorable Magic Copy.mp4" spencer-lynch/public/video/showreel-fallback.mp4
```

- [ ] **Step 2: Extract showreel poster at the strongest visual moment**

Pick a frame ~10 seconds in (he's typically in close-up by then; review and adjust if needed):

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && \
ffmpeg -y -ss 10 -i public/video/showreel-fallback.mp4 -frames:v 1 -q:v 2 public/img/showreel-poster.jpg
```

Verify the poster renders:
```bash
ls -la public/img/showreel-poster.jpg
```
Expected: file ~50–200 KB.

- [ ] **Step 3: Open it visually**

```bash
open spencer-lynch/public/img/showreel-poster.jpg
```
If the frame is uninspiring (dark, mid-blink, no card visible), repeat Step 2 with a different `-ss` value (try 25, 45, 70 seconds).

- [ ] **Step 4: Commit**

```bash
git add spencer-lynch/public && \
git commit -m "feat(spencer-lynch): copy logo variants + showreel fallback MP4 + poster image"
```

## Task 1.3: Build `<SLLogo>` component with three variants

**Files:**
- Create: `spencer-lynch/components/brand/sl-logo.tsx`

- [ ] **Step 1: Write a unit test for the component's variant prop**

Create `spencer-lynch/tests/unit/sl-logo.test.tsx`:

```tsx
// spencer-lynch/tests/unit/sl-logo.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SLLogo } from "@/components/brand/sl-logo";

describe("SLLogo", () => {
  it("renders the colour variant by default", () => {
    render(<SLLogo />);
    const img = screen.getByRole("img", { name: /spencer lynch/i });
    expect(img).toHaveAttribute("src", expect.stringContaining("logo-color.jpg"));
  });

  it("renders the no-pips variant when requested", () => {
    render(<SLLogo variant="no-pips" />);
    const img = screen.getByRole("img", { name: /spencer lynch/i });
    expect(img).toHaveAttribute("src", expect.stringContaining("logo-no-pips.jpg"));
  });

  it("renders the bw variant when requested", () => {
    render(<SLLogo variant="bw" />);
    const img = screen.getByRole("img", { name: /spencer lynch/i });
    expect(img).toHaveAttribute("src", expect.stringContaining("logo-bw.jpg"));
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && npm test
```
Expected: FAIL — "Cannot find module '@/components/brand/sl-logo'".

- [ ] **Step 3: Implement the component**

Create `spencer-lynch/components/brand/sl-logo.tsx`:

```tsx
// spencer-lynch/components/brand/sl-logo.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

const SOURCES = {
  color: "/brand/logo-color.jpg",
  bw: "/brand/logo-bw.jpg",
  "no-pips": "/brand/logo-no-pips.jpg",
} as const;

export type SLLogoVariant = keyof typeof SOURCES;

export function SLLogo({
  variant = "color",
  className,
  invertOnDark = false,
  width = 320,
  height = 100,
  priority = false,
}: {
  variant?: SLLogoVariant;
  className?: string;
  invertOnDark?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={SOURCES[variant]}
      alt="Spencer Lynch — Memorable Magic"
      width={width}
      height={height}
      priority={priority}
      className={cn(
        "h-auto w-auto",
        invertOnDark && "invert mix-blend-screen brightness-110",
        className,
      )}
    />
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

```bash
npm test
```
Expected: 3 passing tests.

- [ ] **Step 5: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): SLLogo component with color/bw/no-pips variants and invertOnDark prop"
```

## Task 1.4: Build `<LFCStamp>` credibility badge

**Files:**
- Create: `spencer-lynch/components/brand/lfc-stamp.tsx`

- [ ] **Step 1: Implement (UI-only, no test value)**

Create `spencer-lynch/components/brand/lfc-stamp.tsx`:

```tsx
// spencer-lynch/components/brand/lfc-stamp.tsx
import { cn } from "@/lib/utils";

export function LFCStamp({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-1 border border-gold/50 px-5 py-3 text-center",
        className,
      )}
      aria-label="Resident Magician at Liverpool Football Club since 2006"
    >
      <span className="font-mono text-[9px] uppercase tracking-eyebrowWide text-gold">
        — Resident Magician —
      </span>
      <span className="font-display text-base italic text-cream">
        Liverpool FC
      </span>
      <span className="font-mono text-[9px] uppercase tracking-eyebrow text-gold/70">
        Since 2006
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Visually verify** by rendering it on the homepage temporarily — open `app/page.tsx`, replace its body with:

```tsx
// spencer-lynch/app/page.tsx (TEMPORARY — will be replaced in Phase 5)
import { LFCStamp } from "@/components/brand/lfc-stamp";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink">
      <LFCStamp />
    </main>
  );
}
```

```bash
npm run dev
```
Open `http://localhost:3000`. Expected: the gold-bordered stamp renders centred on a dark page. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): LFCStamp badge component"
```

## Task 1.5: Build `useReducedMotion` hook

**Files:**
- Create: `spencer-lynch/lib/hooks/use-reduced-motion.ts`
- Create: `spencer-lynch/tests/unit/use-reduced-motion.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
// spencer-lynch/tests/unit/use-reduced-motion.test.tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

let listeners: Array<(e: MediaQueryListEvent) => void> = [];
let currentMatch = false;

beforeEach(() => {
  listeners = [];
  currentMatch = false;
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: currentMatch,
    media: query,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.push(cb);
    },
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners = listeners.filter((l) => l !== cb);
    },
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
  }));
});

describe("useReducedMotion", () => {
  it("returns false by default when the OS does not prefer reduced motion", () => {
    currentMatch = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when the OS prefers reduced motion", () => {
    currentMatch = true;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when the OS preference changes", () => {
    currentMatch = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    act(() => {
      currentMatch = true;
      listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));
    });
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 2: Run test, expect failure**

```bash
npm test
```
Expected: FAIL — "Cannot find module '@/lib/hooks/use-reduced-motion'".

- [ ] **Step 3: Implement the hook**

```typescript
// spencer-lynch/lib/hooks/use-reduced-motion.ts
"use client";
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  // SSR-safe: server render returns false (no autoplay block on server)
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(QUERY);
    setPrefers(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefers;
}
```

- [ ] **Step 4: Run test, expect pass**

```bash
npm test
```
Expected: 3 passing in `use-reduced-motion.test.tsx`.

- [ ] **Step 5: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): SSR-safe useReducedMotion hook with tests"
```

---

# Phase 2 — Cinema-Frame & Hero Showreel

## Task 2.1: Build the reusable `<CinemaFrame>` component

**Files:**
- Create: `spencer-lynch/components/showreel/cinema-frame.tsx`

The CinemaFrame is a presentational shell — gold corner brackets, slate header/footer rows, gradient background, gold border. Used by hero showreel + (later) by case-study video moments.

- [ ] **Step 1: Implement**

```tsx
// spencer-lynch/components/showreel/cinema-frame.tsx
import { cn } from "@/lib/utils";

export function CinemaFrame({
  children,
  slateTop,
  slateBottom,
  className,
}: {
  children: React.ReactNode;
  slateTop?: { left: string; right: string };
  slateBottom?: { left: string; right: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative inline-block w-full max-w-[760px] border border-gold/40 p-[22px]",
        "bg-gradient-to-b from-ink-tinted to-ink-warm",
        "shadow-[0_32px_80px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(212,175,55,0.12)]",
        className,
      )}
    >
      {/* corner brackets */}
      <span className="pointer-events-none absolute left-2 top-2 h-[18px] w-[18px] border-l border-t border-gold" />
      <span className="pointer-events-none absolute right-2 top-2 h-[18px] w-[18px] border-r border-t border-gold" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-[18px] w-[18px] border-b border-l border-gold" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-[18px] w-[18px] border-b border-r border-gold" />

      {slateTop && (
        <div className="mb-[10px] flex items-center justify-between px-1 font-mono text-[9px] uppercase tracking-eyebrow text-gold/85">
          <span>{slateTop.left}</span>
          <span>{slateTop.right}</span>
        </div>
      )}

      <div className="relative aspect-video overflow-hidden bg-black">{children}</div>

      {slateBottom && (
        <div className="mt-[10px] flex items-center justify-between px-1 font-mono text-[9px] uppercase tracking-eyebrow text-gold/60">
          <span>{slateBottom.left}</span>
          <span>{slateBottom.right}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Visually sanity-check by temporarily putting it on the homepage**

Replace `app/page.tsx` with:

```tsx
// app/page.tsx (TEMPORARY)
import { CinemaFrame } from "@/components/showreel/cinema-frame";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink p-10">
      <CinemaFrame
        slateTop={{ left: "SL · Reel · 2026", right: "● Live · 1080p" }}
        slateBottom={{ left: "Memorable Magic", right: "02:07" }}
      >
        <div className="grid h-full place-items-center text-cream/40">[ video slot ]</div>
      </CinemaFrame>
    </main>
  );
}
```

```bash
npm run dev
```
Open `http://localhost:3000`. Expected: framed empty box with gold corner brackets + slate rows. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): CinemaFrame component with gold brackets and slate rows"
```

## Task 2.2: Build `<HeroShowreel>` with Vimeo + reduced-motion swap

**Files:**
- Create: `spencer-lynch/components/showreel/hero-showreel.tsx`

This component:
- Default: Vimeo iframe in `background=1` mode (autoplay, muted, loop, no chrome)
- `prefers-reduced-motion: reduce` → poster image + "Watch on Vimeo" link
- Hover: 🔊 unmute and ⤢ expand affordances overlaid (external links to Vimeo page)

- [ ] **Step 1: Implement**

```tsx
// spencer-lynch/components/showreel/hero-showreel.tsx
"use client";
import Image from "next/image";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const VIMEO_ID = "214361408";
const VIMEO_PAGE = `https://vimeo.com/${VIMEO_ID}`;
const VIMEO_EMBED = `https://player.vimeo.com/video/${VIMEO_ID}?background=1&autoplay=1&loop=1&muted=1&dnt=1`;

/**
 * Poster always renders behind the iframe — paints immediately so
 * visitors don't see a blank black box during the brief Vimeo bootstrap.
 * Reduced-motion branch suppresses the iframe entirely and surfaces a
 * "Watch on Vimeo" link in its place.
 */
export function HeroShowreel() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="group relative h-full w-full">
      {/* poster — always behind */}
      <Image
        src="/img/showreel-poster.jpg"
        alt="Spencer Lynch performing close-up magic"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 760px"
        className="object-cover"
      />

      {!reducedMotion && (
        <iframe
          src={VIMEO_EMBED}
          title="Spencer Lynch Showreel — Memorable Magic"
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}

      {reducedMotion ? (
        <a
          href={VIMEO_PAGE}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-0 bottom-4 z-10 mx-auto flex w-fit items-center gap-2 border border-gold/55 bg-ink-warm/80 px-4 py-2 font-mono text-[11px] uppercase tracking-eyebrow text-cream backdrop-blur transition-colors hover:bg-gold/15"
        >
          ▶ Watch on Vimeo
        </a>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-end gap-2 bg-gradient-to-t from-black/45 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <a
            href={VIMEO_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch with sound on Vimeo"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center border border-gold/55 bg-ink-warm/75 text-cream backdrop-blur transition-colors hover:bg-gold/15"
          >
            🔊
          </a>
          <a
            href={VIMEO_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open showreel fullscreen on Vimeo"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center border border-gold/55 bg-ink-warm/75 text-cream backdrop-blur transition-colors hover:bg-gold/15"
          >
            ⤢
          </a>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Visually verify**

Update `app/page.tsx`:

```tsx
import { CinemaFrame } from "@/components/showreel/cinema-frame";
import { HeroShowreel } from "@/components/showreel/hero-showreel";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink p-10">
      <CinemaFrame
        slateTop={{ left: "SL · Reel · 2026", right: "● Live · 1080p" }}
        slateBottom={{ left: "Memorable Magic", right: "02:07" }}
      >
        <HeroShowreel />
      </CinemaFrame>
    </main>
  );
}
```

```bash
npm run dev
```
Open `http://localhost:3000`. Expected: Vimeo video autoplays muted in the cinema frame. Hover reveals 🔊 and ⤢ buttons.

- [ ] **Step 3: Test reduced-motion**

Open Chrome DevTools → Cmd+Shift+P → "Emulate CSS prefers-reduced-motion: reduce". Refresh.
Expected: poster image + "▶ Watch on Vimeo" link replaces the iframe.

Reset the emulation. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): HeroShowreel with Vimeo background mode and reduced-motion poster swap"
```

---

# Phase 3 — Nav, Footer, WhatsApp Widget

## Task 3.1: Build `<TopNav>`

**Files:**
- Create: `spencer-lynch/components/nav/top-nav.tsx`

- [ ] **Step 1: Implement**

```tsx
// spencer-lynch/components/nav/top-nav.tsx
import Link from "next/link";
import { SLLogo } from "@/components/brand/sl-logo";

const links = [
  { href: "/work", label: "The Work" },
  { href: "/tech-illusions", label: "Tech Illusions" },
  { href: "/showreel", label: "Showreel" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Book" },
];

export function TopNav() {
  return (
    <header className="relative z-30 px-10 pt-7">
      <div className="flex items-center justify-between gap-6">
        <Link href="/" aria-label="Spencer Lynch — home" className="flex items-center">
          <SLLogo variant="no-pips" invertOnDark width={140} height={32} />
        </Link>

        <nav className="hidden items-center gap-8 font-sans text-[11px] uppercase tracking-eyebrow text-cream/70 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            className="border border-gold/60 bg-ink-warm px-4 py-2 font-mono text-[10px] tracking-eyebrow text-gold transition-colors hover:bg-gold/10"
            aria-label="Open a random magic trick"
          >
            ⌕ Try a Trick
          </button>
        </nav>
      </div>

      <div className="mt-5 h-px w-full bg-[var(--gold-hairline)]" />
    </header>
  );
}
```

The `Try a Trick` button is non-functional in this plan — Plan 3 wires it up.

- [ ] **Step 2: Add it to the homepage temporarily and verify visually**

```tsx
// app/page.tsx
import { TopNav } from "@/components/nav/top-nav";
import { CinemaFrame } from "@/components/showreel/cinema-frame";
import { HeroShowreel } from "@/components/showreel/hero-showreel";

export default function Home() {
  return (
    <>
      <TopNav />
      <main className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-ink p-10">
        <CinemaFrame
          slateTop={{ left: "SL · Reel · 2026", right: "● Live · 1080p" }}
          slateBottom={{ left: "Memorable Magic", right: "02:07" }}
        >
          <HeroShowreel />
        </CinemaFrame>
      </main>
    </>
  );
}
```

`npm run dev` → verify nav renders cleanly across desktop widths. Mobile (Cmd+Shift+M in DevTools) should hide nav links via `hidden md:flex`. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): TopNav with logo + 5 links + Try-a-Trick pill (handler stub)"
```

## Task 3.2: Build `<WhatsAppWidget>` floating button

**Files:**
- Create: `spencer-lynch/components/footer/whatsapp-widget.tsx`

- [ ] **Step 1: Implement**

```tsx
// spencer-lynch/components/footer/whatsapp-widget.tsx
"use client";
import Link from "next/link";

export function WhatsAppWidget({
  phoneE164,
  defaultMessage = "Hi Spencer — I'd like to chat about a possible booking.",
}: {
  phoneE164: string; // e.g. "447xxxxxxxxx" — no plus, no spaces
  defaultMessage?: string;
}) {
  const url = `https://wa.me/${phoneE164}?text=${encodeURIComponent(defaultMessage)}`;
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Spencer on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.057 21.785h-.005c-1.95 0-3.86-.524-5.526-1.514l-.396-.235-4.105 1.077 1.097-4.005-.258-.41a9.83 9.83 0 0 1-1.51-5.236c.002-5.444 4.43-9.872 9.876-9.872 2.638 0 5.118 1.029 6.985 2.898 1.866 1.869 2.893 4.351 2.892 6.989-.003 5.444-4.431 9.872-9.876 9.872m8.413-18.298A11.815 11.815 0 0 0 12.057 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.69 1.448h.005c6.554 0 11.89-5.335 11.893-11.892a11.821 11.821 0 0 0-3.48-8.413"/>
      </svg>
    </Link>
  );
}
```

- [ ] **Step 2: Mount it once at the layout level**

Modify `app/layout.tsx` — add WhatsAppWidget mount inside `<body>`:

```tsx
// inside <body className="...">
{children}
<WhatsAppWidget phoneE164={process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? "447000000000"} />
```

Add the import at the top:
```tsx
import { WhatsAppWidget } from "@/components/footer/whatsapp-widget";
```

- [ ] **Step 3: Add the env var placeholder**

Create `spencer-lynch/.env.local.example`:

```
# Resend transactional email
RESEND_API_KEY=
ENQUIRY_TO_EMAIL=spencer@example.com

# WhatsApp (E.164 format, no plus, no spaces)
NEXT_PUBLIC_WHATSAPP_E164=447000000000
```

Then create a working `.env.local` from it (will not be committed):

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && \
cp .env.local.example .env.local
```

Verify `.env.local` is gitignored (it should be by default from create-next-app).

- [ ] **Step 4: Visually verify**

`npm run dev` → bottom-right of every page should show the green WhatsApp circle. Click → opens `wa.me/447000000000` in a new tab. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): WhatsApp floating widget mounted in root layout via NEXT_PUBLIC_WHATSAPP_E164"
```

## Task 3.3: Build `<SiteFooter>` with three-option contact + LFC stamp

**Files:**
- Create: `spencer-lynch/components/footer/site-footer.tsx`

- [ ] **Step 1: Implement**

```tsx
// spencer-lynch/components/footer/site-footer.tsx
import Link from "next/link";
import { LFCStamp } from "@/components/brand/lfc-stamp";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "TikTok", href: "https://tiktok.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Facebook", href: "https://facebook.com/" },
];

export function SiteFooter({
  phoneTel,
  emailMailto,
}: {
  phoneTel: string; // e.g. "+447000000000"
  emailMailto: string; // e.g. "spencer@example.com"
}) {
  return (
    <footer className="border-t border-gold/30 bg-ink-warm px-10 pb-12 pt-16 text-cream">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-[auto_1fr_auto] md:items-start">
        <div className="flex justify-center md:justify-start">
          <LFCStamp />
        </div>

        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <p className="font-mono text-[10px] uppercase tracking-eyebrowWide text-gold">— Bookings —</p>
          <h2 className="mt-3 font-display text-3xl italic text-cream">It all starts with a chat.</h2>
          <div className="mt-8 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={`tel:${phoneTel}`}
              className="border border-gold/50 bg-ink py-3 text-center font-mono text-[10px] uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold/10"
            >
              Click to Call
            </a>
            <a
              href={`mailto:${emailMailto}`}
              className="border border-gold/50 bg-ink py-3 text-center font-mono text-[10px] uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold/10"
            >
              Click to Email
            </a>
            <Link
              href="/book"
              className="border border-gold bg-gold/15 py-3 text-center font-mono text-[10px] uppercase tracking-eyebrow text-gold transition-colors hover:bg-gold/25"
            >
              Use Enquiry Form
            </Link>
          </div>
        </div>

        <ul className="flex flex-row gap-4 md:flex-col md:gap-3">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-eyebrow text-cream/70 transition-colors hover:text-gold"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 flex flex-col items-center gap-2 border-t border-gold/15 pt-6 text-center font-mono text-[9px] uppercase tracking-eyebrow text-cream/40">
        <span>Spencer Lynch · Memorable Magic · Liverpool</span>
        <span>© {new Date().getFullYear()} · All rights reserved</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Mount the footer below the hero on the homepage**

```tsx
// app/page.tsx
import { TopNav } from "@/components/nav/top-nav";
import { CinemaFrame } from "@/components/showreel/cinema-frame";
import { HeroShowreel } from "@/components/showreel/hero-showreel";
import { SiteFooter } from "@/components/footer/site-footer";

export default function Home() {
  return (
    <>
      <TopNav />
      <main className="flex min-h-[80vh] items-center justify-center bg-ink p-10">
        <CinemaFrame
          slateTop={{ left: "SL · Reel · 2026", right: "● Live · 1080p" }}
          slateBottom={{ left: "Memorable Magic", right: "02:07" }}
        >
          <HeroShowreel />
        </CinemaFrame>
      </main>
      <SiteFooter
        phoneTel="+447000000000"
        emailMailto="spencer@example.com"
      />
    </>
  );
}
```

`npm run dev` → footer renders with LFC stamp on the left, three buttons centred, social links on the right. Mobile: stacks vertically, social links go horizontal. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): SiteFooter with LFC stamp, 3-option contact, and socials"
```

---

# Phase 4 — Enquiry Form + Serverless Email

## Task 4.1: Define enquiry zod schema (shared)

**Files:**
- Create: `spencer-lynch/components/contact/enquiry-schema.ts`
- Create: `spencer-lynch/tests/unit/enquiry-schema.test.ts`

- [ ] **Step 1: Write the test**

```typescript
// spencer-lynch/tests/unit/enquiry-schema.test.ts
import { describe, it, expect } from "vitest";
import { enquirySchema } from "@/components/contact/enquiry-schema";

describe("enquirySchema", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    eventDate: "2026-07-15",
    eventType: "Wedding" as const,
    location: "Liverpool",
    message: "Looking for close-up at our reception, ~80 guests.",
  };

  it("accepts a valid enquiry", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const r = enquirySchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects an unknown eventType", () => {
    const r = enquirySchema.safeParse({ ...valid, eventType: "Funeral" });
    expect(r.success).toBe(false);
  });

  it("rejects an empty name", () => {
    const r = enquirySchema.safeParse({ ...valid, name: "" });
    expect(r.success).toBe(false);
  });

  it("requires message of at least 10 characters", () => {
    const r = enquirySchema.safeParse({ ...valid, message: "hey" });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect failure**

```bash
npm test
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```typescript
// spencer-lynch/components/contact/enquiry-schema.ts
import { z } from "zod";

export const EVENT_TYPES = [
  "Wedding",
  "Corporate",
  "Hospitality",
  "Private",
  "Other",
] as const;

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name"),
  email: z.string().trim().email("Please enter a valid email"),
  eventDate: z.string().min(1, "Please choose a date"), // ISO YYYY-MM-DD; client uses <input type="date">
  eventType: z.enum(EVENT_TYPES),
  location: z.string().trim().min(1, "Please tell us where"),
  message: z.string().trim().min(10, "A few more words help Spencer reply usefully"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
```

- [ ] **Step 4: Run, expect pass**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): enquiry zod schema with shared client/server validation"
```

## Task 4.2: Build the `/api/enquiry` serverless route

**Files:**
- Create: `spencer-lynch/app/api/enquiry/route.ts`
- Create: `spencer-lynch/lib/env.ts`

- [ ] **Step 1: Create env validator**

```typescript
// spencer-lynch/lib/env.ts
import { z } from "zod";

const schema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  ENQUIRY_TO_EMAIL: z.string().email("ENQUIRY_TO_EMAIL must be a valid email"),
});

export const env = schema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  ENQUIRY_TO_EMAIL: process.env.ENQUIRY_TO_EMAIL,
});
```

- [ ] **Step 2: Create the route**

```typescript
// spencer-lynch/app/api/enquiry/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { enquirySchema } from "@/components/contact/enquiry-schema";
import { env } from "@/lib/env";

export const runtime = "nodejs"; // Resend SDK uses Node APIs

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.format() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const subject = `[Spencer Lynch] New enquiry — ${data.eventType} · ${data.eventDate}`;
  const html = `
    <h2>New enquiry from spencerlynch.co.uk</h2>
    <p><strong>${escapeHtml(data.name)}</strong> &lt;${escapeHtml(data.email)}&gt;</p>
    <ul>
      <li><strong>Event type:</strong> ${escapeHtml(data.eventType)}</li>
      <li><strong>Date:</strong> ${escapeHtml(data.eventDate)}</li>
      <li><strong>Location:</strong> ${escapeHtml(data.location)}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
  `;

  // Use Resend's pre-verified test domain until our own domain is verified.
  // Swap to e.g. "Spencer Lynch <bookings@spencerlynch.co.uk>" once Resend
  // domain verification is set up (Plan 7 / production deploy).
  const FROM = "Spencer Lynch Site <onboarding@resend.dev>";

  try {
    await resend.emails.send({
      from: FROM,
      to: env.ENQUIRY_TO_EMAIL,
      replyTo: data.email,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend send failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not deliver enquiry" },
      { status: 502 },
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

- [ ] **Step 3: Verify it builds**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && npm run build
```
Expected: build succeeds. (At runtime the route will fail-open if `.env.local` lacks a real Resend key — that's fine for now; an integration test in Task 4.4 covers the wired path.)

- [ ] **Step 4: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): /api/enquiry serverless route with zod validation + Resend email"
```

## Task 4.3: Build `<EnquiryForm>` (client)

**Files:**
- Create: `spencer-lynch/components/contact/enquiry-form.tsx`

- [ ] **Step 1: Implement**

```tsx
// spencer-lynch/components/contact/enquiry-form.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  enquirySchema,
  EVENT_TYPES,
  type EnquiryInput,
} from "@/components/contact/enquiry-schema";

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState<string>("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { eventType: "Wedding" },
  });

  const onSubmit = async (data: EnquiryInput) => {
    setStatus("submitting");
    setErrMsg("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      setStatus("success");
      reset();
    } catch (e) {
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : "Unknown error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-gold/40 bg-ink-warm p-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-eyebrowWide text-gold">— Thank you —</p>
        <p className="mt-4 font-display text-2xl italic text-cream">
          Spencer will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <Input
            {...register("name")}
            className="border-gold/30 bg-ink text-cream placeholder:text-cream/30"
            placeholder="Your name"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input
            type="email"
            {...register("email")}
            className="border-gold/30 bg-ink text-cream placeholder:text-cream/30"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Event date" error={errors.eventDate?.message}>
          <Input
            type="date"
            {...register("eventDate")}
            className="border-gold/30 bg-ink text-cream"
          />
        </Field>
        <Field label="Event type" error={errors.eventType?.message}>
          <Select
            onValueChange={(v) => setValue("eventType", v as EnquiryInput["eventType"])}
            defaultValue={watch("eventType")}
          >
            <SelectTrigger className="border-gold/30 bg-ink text-cream">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Location" error={errors.location?.message} className="md:col-span-2">
          <Input
            {...register("location")}
            className="border-gold/30 bg-ink text-cream placeholder:text-cream/30"
            placeholder="City / venue"
          />
        </Field>
        <Field label="Message" error={errors.message?.message} className="md:col-span-2">
          <Textarea
            rows={6}
            {...register("message")}
            className="border-gold/30 bg-ink text-cream placeholder:text-cream/30"
            placeholder="Tell Spencer about the event…"
          />
        </Field>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-cream/40">
          {status === "error" && <span className="text-red-logo">Could not send: {errMsg}</span>}
        </p>
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="border border-gold bg-gold/15 px-8 py-3 font-mono text-[11px] uppercase tracking-eyebrow text-gold hover:bg-gold/25"
        >
          {status === "submitting" ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="font-mono text-[10px] uppercase tracking-eyebrow text-cream/70">
        {label}
      </Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-logo">{error}</p> : null}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): EnquiryForm client component with zod validation and Resend submission"
```

## Task 4.4: Add a smoke test that verifies the route validates payloads

**Files:**
- Create: `spencer-lynch/tests/unit/api-enquiry.test.ts`

This is a logic test, not an integration test — we don't actually call Resend. We mock the Resend module and assert the route's input handling.

- [ ] **Step 1: Write the test**

```typescript
// spencer-lynch/tests/unit/api-enquiry.test.ts
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";

// Mock the Resend module BEFORE the route module loads.
// vi.mock is hoisted by Vitest so this works regardless of import order below.
const sendMock = vi.fn().mockResolvedValue({ id: "test_id" });
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

const validBody = {
  name: "Jane Doe",
  email: "jane@example.com",
  eventDate: "2026-07-15",
  eventType: "Wedding",
  location: "Liverpool",
  message: "Looking for close-up at our reception, ~80 guests.",
};

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Lazy-bound POST handler — imported AFTER env is stubbed.
let POST: (req: Request) => Promise<Response>;

beforeAll(async () => {
  // env.ts calls schema.parse() at module load — set the env vars before importing.
  vi.stubEnv("RESEND_API_KEY", "test_key");
  vi.stubEnv("ENQUIRY_TO_EMAIL", "spencer@example.com");
  const mod = await import("@/app/api/enquiry/route");
  POST = mod.POST;
});

beforeEach(() => sendMock.mockClear());

describe("POST /api/enquiry", () => {
  it("returns 400 on invalid payload", async () => {
    const res = await POST(makeRequest({ ...validBody, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 on non-JSON body", async () => {
    const req = new Request("http://localhost/api/enquiry", {
      method: "POST",
      body: "this is not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("calls Resend and returns 200 on valid payload", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock.mock.calls[0][0].to).toBe("spencer@example.com");
    expect(sendMock.mock.calls[0][0].replyTo).toBe(validBody.email);
  });
});
```

- [ ] **Step 2: Run, expect pass**

```bash
npm test
```
Expected: 3 passing in `api-enquiry.test.ts`. The `await import()` inside `beforeAll` ensures `lib/env.ts`'s top-level `schema.parse()` sees the stubbed env, avoiding the hoisting gotcha that would crash a top-level import of the route.

- [ ] **Step 3: Commit**

```bash
git add spencer-lynch && \
git commit -m "test(spencer-lynch): unit test /api/enquiry route validates and dispatches via mocked Resend"
```

---

# Phase 5 — Wire Up the Homepage and `/book` Page

## Task 5.1: Build the homepage hero section properly

**Files:**
- Modify: `spencer-lynch/app/page.tsx`

This composes everything we've built into the actual homepage hero — eyebrow, headline, supporting copy, the showreel below.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
// spencer-lynch/app/page.tsx
import { TopNav } from "@/components/nav/top-nav";
import { CinemaFrame } from "@/components/showreel/cinema-frame";
import { HeroShowreel } from "@/components/showreel/hero-showreel";
import { SiteFooter } from "@/components/footer/site-footer";

const PHONE_TEL = "+447000000000";       // TODO: Spencer's real number from env when supplied
const EMAIL = "spencer@example.com";     // TODO: Spencer's real email when supplied

export default function Home() {
  return (
    <>
      <TopNav />

      <main className="pinstripe relative bg-ink">
        <section className="px-6 pb-24 pt-12 md:px-10">
          <div className="mx-auto max-w-[1100px] text-center">
            <p className="font-mono text-[10px] uppercase tracking-eyebrowWide text-gold/85">
              — Established 2006 · Liverpool —
            </p>
            <h1 className="mt-5 font-display text-5xl italic leading-[0.96] text-cream md:text-7xl lg:text-[88px]">
              How did<br />he do <span className="text-gold">that</span>.
            </h1>
            <p className="mx-auto mt-7 max-w-[520px] text-[15px] leading-relaxed text-cream/85">
              The only magician to hold simultaneous resident positions at two Premier League clubs. Twenty years of close-up. One card, up close.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-eyebrow text-cream/55">
              Liverpool · Everton · Wrexham · &amp; the room you're in
            </p>
          </div>

          <div className="mx-auto mt-14 flex max-w-[760px] justify-center">
            <CinemaFrame
              slateTop={{ left: "SL · Reel · 2026", right: "● Live · 1080p" }}
              slateBottom={{ left: "Memorable Magic", right: "Hover for sound · 02:07" }}
            >
              <HeroShowreel />
            </CinemaFrame>
          </div>
        </section>
      </main>

      <SiteFooter phoneTel={PHONE_TEL} emailMailto={EMAIL} />
    </>
  );
}
```

- [ ] **Step 2: Visually verify**

`npm run dev` → homepage shows: nav at top, eyebrow + headline + supporting copy centred, cinema-framed showreel below it, footer with stamp + contact buttons + socials, WhatsApp widget bottom-right. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): wire up homepage with hero copy, cinema-framed showreel, and footer"
```

## Task 5.2: Build the `/book` page

**Files:**
- Create: `spencer-lynch/app/book/page.tsx`

- [ ] **Step 1: Implement**

```tsx
// spencer-lynch/app/book/page.tsx
import type { Metadata } from "next";
import { TopNav } from "@/components/nav/top-nav";
import { SiteFooter } from "@/components/footer/site-footer";
import { LFCStamp } from "@/components/brand/lfc-stamp";
import { EnquiryForm } from "@/components/contact/enquiry-form";

const PHONE_TEL = "+447000000000";
const EMAIL = "spencer@example.com";

export const metadata: Metadata = {
  title: "Book Spencer Lynch · Memorable Magic",
  description:
    "Booking enquiries for close-up, tech illusion, and big-event magic by Spencer Lynch — resident magician at Liverpool FC since 2006.",
};

export default function BookPage() {
  return (
    <>
      <TopNav />

      <main className="pinstripe relative bg-ink">
        <section className="px-6 py-24 md:px-10">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
            <aside className="flex flex-col gap-8">
              <p className="font-mono text-[10px] uppercase tracking-eyebrowWide text-gold/85">
                — Bookings —
              </p>
              <h1 className="font-display text-4xl italic leading-tight text-cream md:text-5xl">
                It all starts<br />with a chat.
              </h1>
              <p className="text-[14px] leading-relaxed text-cream/75">
                Tell Spencer about your event. Most replies come within a working day.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:max-w-[280px]">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="border border-gold/50 bg-ink-warm py-3 text-center font-mono text-[10px] uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold/10"
                >
                  Click to Call
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="border border-gold/50 bg-ink-warm py-3 text-center font-mono text-[10px] uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold/10"
                >
                  Click to Email
                </a>
              </div>
              <div className="pt-4">
                <LFCStamp />
              </div>
            </aside>

            <section>
              <EnquiryForm />
            </section>
          </div>
        </section>
      </main>

      <SiteFooter phoneTel={PHONE_TEL} emailMailto={EMAIL} />
    </>
  );
}
```

- [ ] **Step 2: Visually verify**

`npm run dev` → navigate to `http://localhost:3000/book`. Expected: two-column layout (eyebrow + headline + call/email + stamp on left, full enquiry form on right). Mobile: stacks. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add spencer-lynch && \
git commit -m "feat(spencer-lynch): /book page with two-column layout and EnquiryForm"
```

## Task 5.3: Smoke-test the homepage and /book page (Playwright)

**Files:**
- Create: `spencer-lynch/tests/e2e/homepage-smoke.spec.ts`

- [ ] **Step 1: Write the test**

```typescript
// spencer-lynch/tests/e2e/homepage-smoke.spec.ts
import { test, expect } from "@playwright/test";

test("homepage renders hero copy + cinema frame + footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /how did he do that/i,
  );
  // Cinema frame iframe is present (or poster fallback if reduced motion)
  const hasIframe = await page.locator("iframe[src*='player.vimeo.com']").count();
  const hasPoster = await page.getByRole("link", { name: /watch on vimeo/i }).count();
  expect(hasIframe + hasPoster).toBeGreaterThan(0);
  // Footer LFC stamp present
  await expect(page.getByLabel(/liverpool football club since 2006/i)).toBeVisible();
});

test("/book page renders enquiry form with all fields", async ({ page }) => {
  await page.goto("/book");
  await expect(page.getByLabel(/name/i)).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/event date/i)).toBeVisible();
  await expect(page.getByLabel(/event type/i)).toBeVisible();
  await expect(page.getByLabel(/location/i)).toBeVisible();
  await expect(page.getByLabel(/message/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /send enquiry/i })).toBeVisible();
});

test("client validation blocks an empty enquiry submission", async ({ page }) => {
  await page.goto("/book");
  // Attach the request listener BEFORE clicking — otherwise a synchronous
  // request would fire before the listener attaches and we'd miss it.
  let requestedEnquiry = false;
  page.on("request", (r) => {
    if (r.url().includes("/api/enquiry")) requestedEnquiry = true;
  });
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await page.waitForTimeout(500);
  expect(requestedEnquiry).toBe(false);
});
```

- [ ] **Step 2: Run the e2e tests**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && npm run test:e2e
```
Expected: 3 passing. If any fail, read the report at the URL Playwright prints and iterate.

- [ ] **Step 3: Commit**

```bash
git add spencer-lynch && \
git commit -m "test(spencer-lynch): Playwright smoke tests for homepage and /book"
```

---

# Phase 6 — Accessibility, Performance, Lighthouse

## Task 6.1: Run Lighthouse and address obvious issues

**Files:** No source changes anticipated; this is a verification + targeted-fix pass.

- [ ] **Step 1: Build and serve the production bundle**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && \
npm run build && npm run start
```
Open `http://localhost:3000`.

- [ ] **Step 2: Run Lighthouse from Chrome DevTools**

DevTools → Lighthouse → Mobile preset → Performance + Accessibility + Best Practices + SEO → Analyse page.

- [ ] **Step 3: Capture scores**

Record the four scores. Targets per spec:
- Performance ≥ 90 (mobile)
- Accessibility ≥ 95
- Best Practices ≥ 90
- SEO ≥ 90

- [ ] **Step 4: If Performance < 90**, the most likely culprits and fixes:

1. **LCP** — the hero showreel is the LCP element. Do **not** lazy-load the iframe (that would *worsen* perceived load). Instead, the LCP candidate should be the **poster `<Image priority>` already rendered behind the iframe** — confirm in DevTools Performance panel that LCP fires on the poster, not the iframe. If LCP is still slow, ensure the poster JPG is well-compressed (~50–100 KB) and uses `sizes` correctly.
2. **Logo `<Image>` not optimised** — confirm `next/image` is used everywhere and `priority` is set only on above-the-fold instances.
3. **Font flash** — `next/font` with `display: swap` is already configured.
4. **Below-fold WhatsApp / footer SVG** — minor; these load late anyway.

- [ ] **Step 5: If Accessibility < 95**, common items:

1. Confirm every interactive element has an accessible name (already done for affordances, WhatsApp widget, LFC stamp)
2. Confirm colour contrast: `text-cream/70` on `bg-ink` is at least 4.5:1 — verify via Lighthouse contrast audit
3. Confirm form labels are associated (we use `<Label>` from shadcn — they wrap the inputs)

- [ ] **Step 6: Apply any necessary fixes, re-run Lighthouse, capture final scores in the commit message**

- [ ] **Step 7: Commit**

```bash
git add spencer-lynch && \
git commit -m "perf(spencer-lynch): Lighthouse pass — perf X / a11y Y / bp Z / seo W [insert actuals]"
```

---

# Phase 7 — Deploy

## Task 7.1: Connect to Vercel

**Files:** None (deployment config only).

- [ ] **Step 1: Confirm Vercel ownership**

Per spec Open Question #7 — confirm whether Spencer or the user owns the Vercel account. If unresolved, proceed with the user's account for v0.1.

- [ ] **Step 2: Install Vercel CLI and link project**

```bash
cd "/Users/admin/Desktop/3D website/spencer-lynch" && \
npx --yes vercel link
```
Follow prompts — choose the appropriate scope, accept project name `spencer-lynch`, no overrides for build settings (Next.js auto-detected).

- [ ] **Step 3: Add production env vars on Vercel**

```bash
npx vercel env add RESEND_API_KEY production
# paste real Resend key when prompted
npx vercel env add ENQUIRY_TO_EMAIL production
# paste Spencer's real enquiry email when prompted
npx vercel env add NEXT_PUBLIC_WHATSAPP_E164 production
# paste Spencer's WhatsApp number in E.164 (no plus, no spaces) when prompted
```

- [ ] **Step 4: First deploy**

```bash
npx vercel --prod
```
Note the URL Vercel returns (e.g. `spencer-lynch.vercel.app`).

- [ ] **Step 5: Verify the live deployment**

Open the URL. Smoke-check:
- Homepage loads, hero copy visible
- Vimeo showreel autoplays
- Footer + WhatsApp widget present
- `/book` form renders
- Submit a test enquiry; confirm Spencer receives the email

- [ ] **Step 6: Commit deployment notes**

Create `spencer-lynch/DEPLOY.md` with:
- Vercel project name
- Production URL
- Required env vars
- Domain mapping plan (deferred to Plan 7 / production launch)

```bash
git add spencer-lynch/DEPLOY.md && \
git commit -m "docs(spencer-lynch): record Vercel deployment URL and env-var checklist"
```

---

## Plan 1 Acceptance Criteria

The plan is complete when **all** of these are true:

- [ ] `https://spencer-lynch.vercel.app` (or equivalent) is live
- [ ] Homepage hero renders the eyebrow + Playfair-italic headline + supporting copy + cinema-framed Vimeo showreel
- [ ] Showreel autoplays muted, loops, no native controls visible, gold corner brackets visible
- [ ] Hover reveals 🔊 and ⤢ affordances; both link to the Vimeo page
- [ ] Reduced-motion replaces the iframe with the poster + "Watch on Vimeo" link
- [ ] Top nav renders with no-pips logo, 5 links, and the (stub) "⌕ Try a Trick" pill
- [ ] Footer renders LFC stamp + three-option contact + 4 social links + © line
- [ ] WhatsApp widget visible bottom-right on every page
- [ ] `/book` renders the two-column page with the full enquiry form
- [ ] Submitting a valid enquiry on `/book` delivers an email to `ENQUIRY_TO_EMAIL` via Resend
- [ ] Submitting an invalid enquiry shows per-field validation feedback and does NOT call the API
- [ ] All unit tests pass (`npm test`)
- [ ] All Playwright smoke tests pass (`npm run test:e2e`)
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90

## What's NOT in this plan (covered by future plans)

- Credentials sections § 01–§ 05 (Plan 2)
- Logo cloud / InfiniteSlider (Plan 2)
- Trick framework + working tricks (Plan 3)
- Animated Spencer character system (Plan 4)
- Other pages: about, showreel, tech-illusions, work, work/[slug] (Plan 5)
- Hidden Easter-egg routes with localStorage persistence (Plan 5)
- Testimonials carousel + social viral strip (Plan 6)
- Production domain swap (Plan 7)
- 2026 reel refresh — content task, not engineering (parallel; tracked in spec Open Q #8)
