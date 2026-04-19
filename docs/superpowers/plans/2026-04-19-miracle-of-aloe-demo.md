# Miracle of Aloe Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `native-nature/` scaffold as a Miracle of Aloe sales-demo site — a 12-section Editorial Botanical homepage and a conversion-disciplined Foot Repair Cream PDP — with two GSAP cinematic moments and placeholder slots that swap in Nano Banana + Seedance assets the user generates separately.

**Architecture:** Static HTML + CSS + vanilla JS + GSAP/ScrollTrigger via CDN. Design system driven by CSS custom properties in `tokens.css`. Homepage has two pinned scroll moments: (1) a canvas frame-scrub hero video, (2) a GSAP-sequenced UltraAloe® four-beat reveal. PDP uses sticky-ATC, before/after slider, FAQ accordion, filterable review wall. Assets split between client-scraped (product photos, logo) and user-generated (11 stills + 1 video) — placeholders ship with the build and swap in via file replacement.

**Tech Stack:** HTML5 · CSS3 (custom properties, modular files) · Vanilla JS · GSAP 3 + ScrollTrigger (CDN) · Google Fonts (Instrument Serif, Inter, JetBrains Mono) · FFmpeg for hero-video frame extraction · `python3 -m http.server` for local dev. No build tooling, no framework, no npm.

**Spec:** [`docs/superpowers/specs/2026-04-19-miracle-of-aloe-demo-design.md`](../specs/2026-04-19-miracle-of-aloe-demo-design.md)

**Brand research:** [`research/01-client-brand.md`](../../../research/01-client-brand.md)

**Work directory:** `/Users/admin/Desktop/3D website/native-nature/` (in-place replacement; git preserves the old scaffold)

---

## File Structure

**Created by this plan:**

```
native-nature/
├── index.html                                  # Homepage (rebuilt)
├── products/
│   └── miracle-foot-repair-cream.html          # Foot Repair PDP (new)
├── css/
│   ├── tokens.css                              # Design tokens (palette, type, spacing)
│   ├── base.css                                # Resets, typography base, utilities
│   ├── components.css                          # Shared: nav, buttons, cards, marquee, footer, cart drawer, email popup
│   ├── home.css                                # Homepage-specific sections + cinematic moments
│   └── product.css                             # PDP-specific modules
├── js/
│   ├── main.js                                 # Shared: nav scroll, cart drawer, email popup, announcement marquee
│   ├── home.js                                 # Homepage GSAP (Moment 1 + Moment 2), canvas frame-scrub
│   └── product.js                              # PDP: sticky ATC, before/after slider, FAQ accordion, review filters
└── assets/
    ├── brand/                                  # logo.webp, favicon.png (scraped)
    ├── products/                               # 7 product photos (scraped from miracleofaloe.com)
    ├── stills/                                 # 11 Nano Banana placeholders + README.md with prompts
    ├── video/
    │   ├── hero-placeholder.mp4                # Short synthetic placeholder for dev
    │   └── README.md                           # Seedance prompt + input contract
    └── frames/                                 # FFmpeg-extracted frames from hero video
```

**Deleted by this plan:**

```
native-nature/index.html                        # Old Native Nature homepage (replaced)
native-nature/product.html                      # Generic product page (unused)
native-nature/products/botanical-face-serum.html
native-nature/products/charcoal-clay-cleanser.html
native-nature/products/mint-tea-tree-toothpaste.html
native-nature/products/shea-oat-body-butter.html
native-nature/css/style.css                     # Old Native Nature styles (replaced by tokens/base/components)
native-nature/css/landing.css                   # Old homepage extras (merged into home.css)
native-nature/css/product.css                   # Old PDP styles (replaced)
native-nature/js/main.js                        # Old shared JS (replaced)
native-nature/js/landing.js                     # Old homepage JS (replaced)
native-nature/js/product.js                     # Old PDP JS (replaced)
```

Git preserves the old files — they do not need to be archived.

---

## Dev Server

Throughout development, keep a dev server running:

```bash
cd "/Users/admin/Desktop/3D website/native-nature"
python3 -m http.server 8080
```

- Homepage: `http://localhost:8080/`
- PDP: `http://localhost:8080/products/miracle-foot-repair-cream.html`

Keep a browser tab open to each. Refresh after each task to visually verify.

---

## Design Tokens Reference (copy into `css/tokens.css` in Task 1.1)

All tasks reference these tokens. Defined once, used everywhere.

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#F6F2EA` | Primary bg |
| `--color-ink` | `#1A1F1C` | Primary text |
| `--color-forest` | `#0F3B2C` | Dark bleed sections |
| `--color-aloe` | `#8DC735` | Accent, from brand |
| `--color-jungle` | `#00965E` | CTA bg, from brand |
| `--color-mist` | `#D8E4D1` | Section tints |
| `--color-muted` | `#6B6E63` | Secondary text |
| `--font-serif` | `'Instrument Serif', Georgia, serif` | Display |
| `--font-sans` | `'Inter', system-ui, sans-serif` | Body |
| `--font-mono` | `'JetBrains Mono', monospace` | Labels |
| `--radius-card` | `24px` | Cards, images |
| `--radius-pill` | `999px` | Buttons |
| `--max-width` | `1280px` | Content max width |
| `--gutter` | `clamp(24px, 5vw, 80px)` | Page side padding |

---

# Phase 0 — Setup

## Task 0.1: Clear scaffold, create folder structure, generate asset README stubs

**Files:**
- Delete: `native-nature/index.html`, `native-nature/product.html`, 4× `native-nature/products/*.html`, all 3 files in `native-nature/css/`, all 3 files in `native-nature/js/`
- Create: `native-nature/assets/brand/`, `native-nature/assets/products/`, `native-nature/assets/stills/`, `native-nature/assets/video/`, `native-nature/assets/frames/`
- Create: `native-nature/assets/stills/README.md`, `native-nature/assets/video/README.md`

- [ ] **Step 1: Delete the old files**

```bash
cd "/Users/admin/Desktop/3D website/native-nature"
rm index.html product.html
rm products/botanical-face-serum.html products/charcoal-clay-cleanser.html \
   products/mint-tea-tree-toothpaste.html products/shea-oat-body-butter.html
rm css/style.css css/landing.css css/product.css
rm js/main.js js/landing.js js/product.js
```

- [ ] **Step 2: Create new folder structure**

```bash
mkdir -p assets/brand assets/products assets/stills assets/video assets/frames
```

- [ ] **Step 3: Write `assets/stills/README.md`** with the 11 Nano Banana prompts

Content: lift the 11 still descriptions from spec §"Stills (11 assets — Nano Banana Pro)" verbatim, add the brand-locked prompt block (palette `#F6F2EA` paper + `#0F3B2C` forest + `#8DC735` aloe + `#00965E` jungle; no typography in-scene; photorealistic editorial), and note the shared-session directive for stills 5–8.

- [ ] **Step 4: Write `assets/video/README.md`** with the Seedance prompt

Content: lift the hero-video spec from spec §"Video (1 asset — Seedance)". Include the FFmpeg verifier command from `SKILLassets.md` and the frame-extraction command (`ffmpeg -i hero.mp4 -vf "fps=24,scale=1920:-2" -q:v 2 ../frames/frame_%04d.jpg`).

- [ ] **Step 5: Commit**

```bash
cd "/Users/admin/Desktop/3D website"
git add -A native-nature/
git commit -m "Clear native-nature scaffold; prepare asset directories + generation briefs"
```

Expected: `git status` clean; `native-nature/` has empty HTML/CSS/JS folders and populated `assets/` subtree with 2 README files.

---

## Task 0.2: Download client brand + product assets from miracleofaloe.com

**Files:**
- Create: `native-nature/assets/brand/logo.webp`, `native-nature/assets/brand/favicon.png`
- Create: `native-nature/assets/products/foot-repair-front.png`, `foot-repair-back.jpg`, `hand-repair.png`, `aloe-all-over.png`, `miracle-rub.png`, `all-day-moisturizer.jpg`, `facial-gel.jpg`, `ultra-aloe-juice.jpg`

- [ ] **Step 1: Download logo + favicon**

```bash
cd "/Users/admin/Desktop/3D website/native-nature/assets/brand"
curl -L -o logo.webp "https://miracleofaloe.com/cdn/shop/files/miracleofaloelogo_compact.webp?v=1738758316"
curl -L -o favicon.png "https://miracleofaloe.com/cdn/shop/files/MiracleOfAloe-PlantOnly_1_16x16.png?v=1748542098"
```

- [ ] **Step 2: Download 8 product photos**

```bash
cd "/Users/admin/Desktop/3D website/native-nature/assets/products"
curl -L -o foot-repair-front.png "https://miracleofaloe.com/cdn/shop/files/4_a48928da-949e-4997-aa91-970592248d25.png?v=1767809675"
curl -L -o foot-repair-back.jpg "https://miracleofaloe.com/cdn/shop/files/CANADA_32z_Foot_Repair_Bk_Pnl_0720__17237_078d26b2-ab88-4633-b19f-868389e82c85.jpg?v=1767809675"
curl -L -o hand-repair.png "https://miracleofaloe.com/cdn/shop/files/3_3c4cc486-0cd0-4ad8-bbba-8960c27e03ca.png?v=1767809774"
curl -L -o aloe-all-over.png "https://miracleofaloe.com/cdn/shop/files/1_566f0905-4099-46ee-915f-1aa0630781b1.png?v=1767809930"
curl -L -o miracle-rub.png "https://miracleofaloe.com/cdn/shop/files/2_6400733a-2b38-4e2e-b562-efd50f3d5dd5.png?v=1767809991"
curl -L -o all-day-moisturizer.jpg "https://miracleofaloe.com/cdn/shop/files/3_3049d1dd-d30a-4540-9b83-9739e8267ace.jpg?v=1741273361"
curl -L -o facial-gel.jpg "https://miracleofaloe.com/cdn/shop/files/1_1.jpg?v=1741279573"
curl -L -o ultra-aloe-juice.jpg "https://miracleofaloe.com/cdn/shop/files/1500_1.jpg?v=1747079569"
```

- [ ] **Step 3: Verify**

```bash
ls -la native-nature/assets/brand/ native-nature/assets/products/
```

Expected: 2 brand files + 8 product files, all > 5KB (non-empty).

- [ ] **Step 4: Commit**

```bash
git add native-nature/assets/brand/ native-nature/assets/products/
git commit -m "Download Miracle of Aloe brand + product assets"
```

---

## Task 0.3: Generate synthetic placeholder hero video for dev

**Purpose:** The build needs a hero video to render during dev; the real one is generated by the user later. Generate a 4-second white→green fade with FFmpeg so Moment 1 has something to scrub against, then extract frames.

**Files:**
- Create: `native-nature/assets/video/hero-placeholder.mp4`
- Create: `native-nature/assets/frames/frame_*.jpg` (~96 frames)

- [ ] **Step 1: Verify FFmpeg is installed**

```bash
ffmpeg -version | head -1
```

If not installed: `brew install ffmpeg`.

- [ ] **Step 2: Generate placeholder hero video**

```bash
cd "/Users/admin/Desktop/3D website/native-nature/assets/video"
ffmpeg -y -f lavfi -i "color=white:s=1920x1080:d=4:r=24" \
  -vf "fade=t=in:st=0:d=0.5:c=white,fade=t=out:st=3:d=1:c=#0F3B2C,drawtext=text='PLACEHOLDER':fontcolor=0x0F3B2C:fontsize=80:x=(w-text_w)/2:y=(h-text_h)/2" \
  -c:v libx264 -pix_fmt yuv420p hero-placeholder.mp4
```

Expected output: `hero-placeholder.mp4` ~200KB, 4s duration.

- [ ] **Step 3: Extract frames for canvas scrub**

```bash
cd "/Users/admin/Desktop/3D website/native-nature/assets"
ffmpeg -i video/hero-placeholder.mp4 -vf "fps=24,scale=1920:-2" -q:v 2 frames/frame_%04d.jpg
ls frames/ | wc -l
```

Expected: ~96 frame files.

- [ ] **Step 4: Commit**

```bash
git add native-nature/assets/video/hero-placeholder.mp4 native-nature/assets/frames/
git commit -m "Generate synthetic placeholder hero video + extract frames"
```

**Note for Task 4.1:** The canvas scrub code in `home.js` loads frames from `assets/frames/`. When the user drops their real `hero.mp4` into `assets/video/`, the implementer (or user) re-runs Step 3 against the real video to replace the frames.

---

# Phase 1 — Design system foundation

## Task 1.1: Write `tokens.css` + `base.css` + minimal smoke-test `index.html`

**Files:**
- Create: `native-nature/css/tokens.css`
- Create: `native-nature/css/base.css`
- Create: `native-nature/index.html` (temporary smoke-test, replaced over subsequent tasks)

- [ ] **Step 1: Write `css/tokens.css`**

Complete file contents:

```css
:root {
  /* Palette */
  --color-paper: #F6F2EA;
  --color-ink: #1A1F1C;
  --color-forest: #0F3B2C;
  --color-aloe: #8DC735;
  --color-jungle: #00965E;
  --color-mist: #D8E4D1;
  --color-muted: #6B6E63;

  /* Type */
  --font-serif: 'Instrument Serif', 'Times New Roman', Georgia, serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Scale */
  --size-body: clamp(15px, 1.05vw, 17px);
  --size-lede: clamp(18px, 1.4vw, 22px);
  --size-h3: clamp(22px, 2.2vw, 30px);
  --size-h2: clamp(36px, 4.4vw, 64px);
  --size-h1: clamp(48px, 6.8vw, 104px);
  --size-micro: 11px;

  /* Spacing */
  --gutter: clamp(24px, 5vw, 80px);
  --max-width: 1280px;
  --section-pad-y: clamp(80px, 10vw, 160px);

  /* Radius */
  --radius-card: 24px;
  --radius-pill: 999px;
  --radius-sm: 8px;

  /* Motion */
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in-out: cubic-bezier(0.7, 0, 0.3, 1);
  --dur-fast: 180ms;
  --dur-med: 420ms;
  --dur-slow: 900ms;
}

/* Film-grain overlay applied as a utility class */
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.06;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode: multiply;
  z-index: 1;
}
```

- [ ] **Step 2: Write `css/base.css`**

Complete file contents:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  text-rendering: optimizeLegibility;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

body {
  font-family: var(--font-sans);
  font-size: var(--size-body);
  line-height: 1.55;
  color: var(--color-ink);
  background: var(--color-paper);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

h1, h2, h3, h4 { font-family: var(--font-serif); font-weight: 400; line-height: 1.04; letter-spacing: -0.015em; color: var(--color-ink); }
h1 { font-size: var(--size-h1); }
h2 { font-size: var(--size-h2); }
h3 { font-size: var(--size-h3); }

p { max-width: 62ch; }
p.lede { font-size: var(--size-lede); line-height: 1.5; color: var(--color-ink); max-width: 48ch; }

a { color: inherit; text-decoration: none; transition: opacity var(--dur-fast) var(--ease-out); }
a:hover { opacity: 0.7; }

img, video { max-width: 100%; height: auto; display: block; }

button { font: inherit; cursor: pointer; border: 0; background: transparent; color: inherit; }

.mono {
  font-family: var(--font-mono);
  font-size: var(--size-micro);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--color-muted);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.section {
  position: relative;
  padding: var(--section-pad-y) 0;
}

.section--forest {
  background: var(--color-forest);
  color: var(--color-paper);
}
.section--forest h1, .section--forest h2, .section--forest h3 { color: var(--color-paper); }
.section--forest .mono { color: rgba(246, 242, 234, 0.55); }

.section--mist { background: var(--color-mist); }

/* Visually hidden utility for accessibility */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0;
  margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0);
  white-space: nowrap; border: 0;
}
```

- [ ] **Step 3: Write smoke-test `index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Miracle of Aloe — Smoke Test</title>
  <link rel="icon" href="assets/brand/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
</head>
<body>
  <div class="container" style="padding-top: 120px; padding-bottom: 120px;">
    <p class="mono">Design System Smoke Test</p>
    <h1>The aloe plant.<br><em>Reformulated</em> for forty years.</h1>
    <p class="lede">America's most-loved aloe skincare. Typography and palette render via tokens.css.</p>
    <p style="margin-top: 24px;">Paper: <span style="background:var(--color-paper);padding:2px 8px;border:1px solid var(--color-muted);">#F6F2EA</span> · Forest: <span style="background:var(--color-forest);color:var(--color-paper);padding:2px 8px;">#0F3B2C</span> · Aloe: <span style="background:var(--color-aloe);padding:2px 8px;">#8DC735</span> · Jungle: <span style="background:var(--color-jungle);color:var(--color-paper);padding:2px 8px;">#00965E</span></p>
  </div>
  <section class="section section--forest">
    <div class="container">
      <p class="mono">Dark paper moment</p>
      <h2>Not aloe. <em>UltraAloe®.</em></h2>
      <p class="lede" style="color: rgba(246,242,234,0.72); margin-top: 24px;">Serif on forest, mono labels lightened, palette inversion handled by .section--forest.</p>
    </div>
  </section>
</body>
</html>
```

- [ ] **Step 4: Visually verify**

Load `http://localhost:8080/` in browser. Verify:
- Serif h1 renders (Instrument Serif) — visibly different from sans body
- Cream paper background, ink-dark text
- Italic "Reformulated" uses italic serif (confirms `ital@0;1` loaded)
- Forest section inverts cleanly: serif white-on-dark, mono label muted
- Mono "Design System Smoke Test" is tracked out in UPPERCASE with letterspacing
- No console errors (open DevTools → Console)

- [ ] **Step 5: Commit**

```bash
git add native-nature/css/tokens.css native-nature/css/base.css native-nature/index.html
git commit -m "Scaffold design tokens + base styles + smoke-test page"
```

---

# Phase 2 — Shared chrome

## Task 2.1: Announcement bar + navbar (components.css + main.js)

**Files:**
- Create: `native-nature/css/components.css`
- Create: `native-nature/js/main.js`
- Modify: `native-nature/index.html` (add announcement bar + nav above smoke-test content; add script tags)

**HTML structure (append after `<body>`, before the `.container` smoke-test):**

```html
<div class="announcement" aria-label="Store announcements">
  <div class="announcement__marquee">
    <div class="announcement__track" aria-hidden="true">
      <span>Free shipping on orders over $50</span><span>·</span>
      <span>4.9★ from 1,052 reviews</span><span>·</span>
      <span>Trusted for 40 years</span><span>·</span>
      <span>Subscribe & save 15%</span><span>·</span>
      <!-- duplicate the run for seamless scroll -->
      <span>Free shipping on orders over $50</span><span>·</span>
      <span>4.9★ from 1,052 reviews</span><span>·</span>
      <span>Trusted for 40 years</span><span>·</span>
      <span>Subscribe & save 15%</span><span>·</span>
    </div>
  </div>
</div>

<header class="nav" id="nav">
  <div class="nav__inner container">
    <a class="nav__logo" href="/" aria-label="Miracle of Aloe home">
      <img src="assets/brand/logo.webp" alt="Miracle of Aloe" width="160" height="32">
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="#pillars">Foot & Hand</a>
      <a href="#pillars">Body</a>
      <a href="#pillars">Face & Hair</a>
      <a href="#pillars">Supplements</a>
      <a href="#journal">Journal</a>
    </nav>
    <div class="nav__actions">
      <button class="nav__icon" aria-label="Search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button>
      <button class="nav__icon" aria-label="Account"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
      <button class="nav__icon nav__cart" id="cartBtn" aria-label="Cart, 0 items">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span class="nav__cart-count">0</span>
      </button>
    </div>
  </div>
</header>
```

Also add `<link rel="stylesheet" href="css/components.css">` in head after base.css, and `<script src="js/main.js" defer></script>` before `</body>`.

- [ ] **Step 1: Write `css/components.css` (announcement bar + nav sections first)**

```css
/* --- Announcement marquee --- */
.announcement {
  background: var(--color-forest);
  color: var(--color-paper);
  overflow: hidden;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.announcement__marquee { padding: 10px 0; }
.announcement__track {
  display: inline-flex;
  gap: 36px;
  white-space: nowrap;
  animation: marquee 36s linear infinite;
  padding-left: 100%;
}
.announcement__track span { flex-shrink: 0; }
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .announcement__track { animation: none; padding-left: var(--gutter); }
}

/* --- Navbar --- */
.nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--color-paper);
  border-bottom: 1px solid transparent;
  transition: border-color var(--dur-med) var(--ease-out), box-shadow var(--dur-med) var(--ease-out);
}
.nav.is-scrolled {
  border-bottom-color: rgba(26, 31, 28, 0.06);
  box-shadow: 0 6px 24px -16px rgba(26, 31, 28, 0.15);
}
.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  padding-top: 18px;
  padding-bottom: 18px;
}
.nav__logo img { height: 32px; width: auto; }

.nav__links {
  display: flex;
  gap: 32px;
  font-size: 14px;
  font-weight: 500;
}
.nav__links a { position: relative; padding: 6px 0; }
.nav__links a::after {
  content: "";
  position: absolute; inset: auto 0 0 0;
  height: 1px;
  background: var(--color-ink);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-med) var(--ease-out);
}
.nav__links a:hover::after { transform: scaleX(1); }

.nav__actions { display: flex; align-items: center; gap: 8px; }
.nav__icon {
  width: 40px; height: 40px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: var(--radius-pill);
  color: var(--color-ink);
  transition: background var(--dur-fast) var(--ease-out);
}
.nav__icon:hover { background: var(--color-mist); }
.nav__cart { position: relative; }
.nav__cart-count {
  position: absolute; top: 4px; right: 4px;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: var(--color-jungle);
  color: #fff;
  border-radius: var(--radius-pill);
  font-size: 10px; font-weight: 600;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--font-sans);
}

@media (max-width: 860px) {
  .nav__links { display: none; }
}
```

- [ ] **Step 2: Write `js/main.js` — nav scroll behavior and cart badge scaffold**

Complete file (other components will be added to it in later tasks):

```javascript
// ===== Navbar — toggles .is-scrolled after the first scroll =====
(function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ===== Cart count scaffold (updated by future Add to Bag clicks) =====
window.MOA = window.MOA || {};
window.MOA.cart = { count: 0 };
window.MOA.setCartCount = (n) => {
  window.MOA.cart.count = n;
  document.querySelectorAll('.nav__cart-count').forEach(el => { el.textContent = n; });
  document.querySelectorAll('.nav__cart').forEach(el => { el.setAttribute('aria-label', `Cart, ${n} items`); });
};
```

- [ ] **Step 3: Update `index.html`**

- Add `<link rel="stylesheet" href="css/components.css">` after base.css
- Paste the announcement + nav HTML as the first children of `<body>`
- Add `<script src="js/main.js" defer></script>` before `</body>`

- [ ] **Step 4: Visually verify**

Refresh `http://localhost:8080/`. Verify:
- Forest-green announcement bar scrolling left-to-right, 4 messages with `·` separators, loops seamlessly
- Cream paper nav below it with logo left, 5 nav links centred (at ≥860px width), 3 icons right with cart count "0"
- Scroll the page: nav stays sticky, subtle shadow appears under nav
- At <860px width: nav links hide, logo + icons still visible
- Hover a nav link: underline sweeps in left-to-right
- No console errors

- [ ] **Step 5: Commit**

```bash
git add native-nature/css/components.css native-nature/js/main.js native-nature/index.html
git commit -m "Add announcement bar + navbar with sticky shadow + cart scaffold"
```

---

## Task 2.2: Footer

**Files:**
- Modify: `native-nature/css/components.css` (append footer styles)
- Modify: `native-nature/index.html` (add footer before `</body>`)

**HTML:**

```html
<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        <img src="assets/brand/logo.webp" alt="Miracle of Aloe" width="180" height="36">
        <p class="footer__tagline">Forty years of one obsession: one plant, done properly.</p>
      </div>
      <div class="footer__grid">
        <div class="footer__col">
          <p class="mono">Shop</p>
          <a href="#pillars">Foot & Hand</a>
          <a href="#pillars">Body</a>
          <a href="#pillars">Face & Hair</a>
          <a href="#pillars">Supplements</a>
          <a href="#bestsellers">Best sellers</a>
        </div>
        <div class="footer__col">
          <p class="mono">Support</p>
          <a href="#">FAQ</a>
          <a href="#">Shipping & Returns</a>
          <a href="#">Contact</a>
          <a href="#">Warranty</a>
        </div>
        <div class="footer__col">
          <p class="mono">Company</p>
          <a href="#">Our Story</a>
          <a href="#">UltraAloe® Process</a>
          <a href="#">Journal</a>
          <a href="#">Affiliates</a>
        </div>
        <div class="footer__col">
          <p class="mono">Connect</p>
          <a href="https://instagram.com/miracleofaloe" target="_blank" rel="noopener">Instagram</a>
          <a href="https://facebook.com/miracleofaloe" target="_blank" rel="noopener">Facebook</a>
          <a href="https://youtube.com/miracleofaloe" target="_blank" rel="noopener">YouTube</a>
          <a href="https://tiktok.com/@miracleofaloe" target="_blank" rel="noopener">TikTok</a>
        </div>
      </div>
    </div>
    <div class="footer__trust">
      <div class="footer__trust-item"><strong>Free shipping</strong><span>Orders over $50</span></div>
      <div class="footer__trust-item"><strong>Easy returns</strong><span>30-day guarantee</span></div>
      <div class="footer__trust-item"><strong>40 years</strong><span>Family formulated</span></div>
      <div class="footer__trust-item"><strong>Secure</strong><span>Encrypted checkout</span></div>
      <div class="footer__trust-item"><strong>Private</strong><span>Your data, yours</span></div>
    </div>
    <div class="footer__bottom">
      <p class="mono">© 2026 Miracle of Aloe. All rights reserved.</p>
      <p class="mono"><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Accessibility</a></p>
    </div>
  </div>
</footer>
```

- [ ] **Step 1: Append footer CSS to `components.css`**

```css
/* --- Footer --- */
.footer {
  background: var(--color-forest);
  color: var(--color-paper);
  padding: clamp(64px, 8vw, 120px) 0 40px;
  margin-top: var(--section-pad-y);
}
.footer__top {
  display: grid;
  grid-template-columns: 1.2fr 2.4fr;
  gap: clamp(32px, 6vw, 96px);
  padding-bottom: 56px;
  border-bottom: 1px solid rgba(246, 242, 234, 0.12);
}
.footer__brand img { filter: brightness(0) invert(1); }
.footer__tagline {
  font-family: var(--font-serif);
  font-size: clamp(22px, 2vw, 30px);
  line-height: 1.2;
  margin-top: 20px;
  max-width: 22ch;
  color: var(--color-paper);
}
.footer__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
.footer__col { display: flex; flex-direction: column; gap: 12px; }
.footer__col .mono { color: rgba(246, 242, 234, 0.5); margin-bottom: 6px; }
.footer__col a { font-size: 14px; color: rgba(246, 242, 234, 0.85); }
.footer__col a:hover { opacity: 1; color: var(--color-aloe); }

.footer__trust {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  padding: 36px 0;
  border-bottom: 1px solid rgba(246, 242, 234, 0.12);
}
.footer__trust-item { display: flex; flex-direction: column; gap: 2px; }
.footer__trust-item strong { font-weight: 500; font-size: 14px; color: var(--color-paper); }
.footer__trust-item span { font-size: 12px; color: rgba(246, 242, 234, 0.55); }

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 28px;
  gap: 24px;
}
.footer__bottom .mono { color: rgba(246, 242, 234, 0.45); }
.footer__bottom a { color: rgba(246, 242, 234, 0.75); }

@media (max-width: 860px) {
  .footer__top { grid-template-columns: 1fr; }
  .footer__grid { grid-template-columns: repeat(2, 1fr); gap: 36px 24px; }
  .footer__trust { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .footer__bottom { flex-direction: column; align-items: flex-start; }
}
```

- [ ] **Step 2: Add footer HTML to `index.html`** before `</body>` and after all page content (keep the smoke-test content for now — it goes away in Task 3.x)

- [ ] **Step 3: Visually verify**

Refresh. Verify:
- Forest-green footer block appears at bottom
- Left column: logo (inverted to white) + serif tagline in cream
- Right columns: 4-up grid of Shop / Support / Company / Connect with mono labels and muted link list
- Divider line below, then 5-up trust strip with bolded labels
- Divider line below, then copyright row on left + policy links on right, both in tiny muted mono
- At <860px: logo/grid stack; footer trust goes to 2-up; bottom row stacks

- [ ] **Step 4: Commit**

```bash
git add native-nature/css/components.css native-nature/index.html
git commit -m "Add footer with 4-column grid, trust strip, and copyright row"
```

---

## Task 2.3: Cart drawer + email popup (UI shells)

**Files:**
- Modify: `native-nature/css/components.css` (append drawer + popup styles)
- Modify: `native-nature/js/main.js` (append drawer + popup logic)
- Modify: `native-nature/index.html` (add drawer + popup markup at end of body)

**HTML (place just before `<script src="js/main.js">`):**

```html
<!-- Cart drawer -->
<aside class="drawer" id="cartDrawer" aria-hidden="true" aria-labelledby="cartDrawerTitle">
  <div class="drawer__backdrop" data-drawer-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true">
    <header class="drawer__header">
      <h3 id="cartDrawerTitle" class="drawer__title">Your bag</h3>
      <button class="drawer__close" data-drawer-close aria-label="Close cart">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </header>
    <div class="drawer__body">
      <p class="drawer__empty">Your bag is empty.<br><small>Add something beautiful.</small></p>
    </div>
    <footer class="drawer__footer">
      <div class="drawer__progress">
        <div class="drawer__progress-bar" style="width: 0%"></div>
      </div>
      <p class="mono drawer__progress-label">Add $50 for free shipping</p>
      <button class="btn btn--primary drawer__cta" disabled>Checkout · $0.00</button>
    </footer>
  </div>
</aside>

<!-- Email popup -->
<div class="popup" id="emailPopup" aria-hidden="true">
  <div class="popup__backdrop" data-popup-close></div>
  <div class="popup__panel" role="dialog" aria-modal="true" aria-labelledby="emailPopupTitle">
    <button class="popup__close" data-popup-close aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <p class="mono">Join the family</p>
    <h3 id="emailPopupTitle">Get 25% off<br>your first order.</h3>
    <p>Be first to hear about new drops, expert advice, and limited-edition sets.</p>
    <form class="popup__form" data-popup-submit>
      <input type="email" required placeholder="Your email" aria-label="Email address">
      <button type="submit" class="btn btn--primary">Send me 25%</button>
    </form>
    <p class="popup__disclaimer">By subscribing you agree to our privacy policy. Unsubscribe any time.</p>
  </div>
</div>
```

- [ ] **Step 1: Append drawer + popup CSS + shared button styles to `components.css`**

```css
/* --- Buttons (shared) --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.btn--primary { background: var(--color-jungle); color: #fff; }
.btn--primary:hover { transform: translateY(-1px); background: #007a4d; }
.btn--primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.btn--ghost { background: transparent; color: var(--color-ink); border: 1px solid var(--color-ink); }
.btn--ghost:hover { background: var(--color-ink); color: var(--color-paper); transform: translateY(-1px); }
.btn--pale { background: var(--color-paper); color: var(--color-ink); }
.btn--pale:hover { background: var(--color-mist); }

/* --- Drawer --- */
.drawer {
  position: fixed; inset: 0;
  z-index: 70;
  pointer-events: none;
}
.drawer[aria-hidden="false"] { pointer-events: auto; }
.drawer__backdrop {
  position: absolute; inset: 0;
  background: rgba(26, 31, 28, 0.4);
  opacity: 0;
  transition: opacity var(--dur-med) var(--ease-out);
}
.drawer[aria-hidden="false"] .drawer__backdrop { opacity: 1; }
.drawer__panel {
  position: absolute; top: 0; right: 0; bottom: 0;
  width: min(440px, 92vw);
  background: var(--color-paper);
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform var(--dur-med) var(--ease-out);
  box-shadow: -24px 0 48px -16px rgba(26, 31, 28, 0.2);
}
.drawer[aria-hidden="false"] .drawer__panel { transform: translateX(0); }
.drawer__header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid rgba(26, 31, 28, 0.08);
}
.drawer__title { font-size: 22px; font-family: var(--font-serif); }
.drawer__close { width: 32px; height: 32px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; }
.drawer__close:hover { background: var(--color-mist); }
.drawer__body { flex: 1; overflow-y: auto; padding: 32px 28px; display: grid; place-items: center; }
.drawer__empty { text-align: center; color: var(--color-muted); font-family: var(--font-serif); font-size: 22px; }
.drawer__empty small { display: block; font-size: 13px; font-family: var(--font-sans); margin-top: 8px; }
.drawer__footer { padding: 20px 28px 28px; border-top: 1px solid rgba(26, 31, 28, 0.08); }
.drawer__progress { height: 4px; background: var(--color-mist); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
.drawer__progress-bar { height: 100%; background: var(--color-jungle); transition: width var(--dur-med) var(--ease-out); }
.drawer__progress-label { margin-bottom: 16px; }
.drawer__cta { width: 100%; }

/* --- Email popup --- */
.popup {
  position: fixed; inset: 0;
  z-index: 80;
  display: grid; place-items: center;
  pointer-events: none;
  padding: 24px;
}
.popup[aria-hidden="false"] { pointer-events: auto; }
.popup__backdrop { position: absolute; inset: 0; background: rgba(26, 31, 28, 0.5); opacity: 0; transition: opacity var(--dur-med) var(--ease-out); }
.popup[aria-hidden="false"] .popup__backdrop { opacity: 1; }
.popup__panel {
  position: relative;
  background: var(--color-paper);
  border-radius: var(--radius-card);
  padding: 48px 44px 40px;
  max-width: 440px;
  width: 100%;
  transform: scale(0.96) translateY(12px);
  opacity: 0;
  transition: transform var(--dur-med) var(--ease-out), opacity var(--dur-med) var(--ease-out);
}
.popup[aria-hidden="false"] .popup__panel { transform: none; opacity: 1; }
.popup__close { position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; }
.popup__close:hover { background: var(--color-mist); }
.popup h3 { font-size: clamp(32px, 3vw, 40px); margin-top: 12px; margin-bottom: 18px; line-height: 1.02; }
.popup p { font-size: 15px; color: var(--color-muted); }
.popup__form { display: grid; gap: 10px; margin-top: 22px; }
.popup__form input {
  font: inherit; padding: 14px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(26, 31, 28, 0.16);
  background: #fff;
}
.popup__form input:focus { outline: 2px solid var(--color-jungle); outline-offset: 2px; }
.popup__disclaimer { font-size: 11px; margin-top: 14px; color: var(--color-muted); }
```

- [ ] **Step 2: Append drawer + popup logic to `main.js`**

```javascript
// ===== Drawer (cart) =====
(function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const open = () => {
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('#cartBtn').forEach(btn => btn.addEventListener('click', open));
  drawer.querySelectorAll('[data-drawer-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') close(); });
  window.MOA.openCart = open;
  window.MOA.closeCart = close;
})();

// ===== Email popup =====
(function initPopup() {
  const popup = document.getElementById('emailPopup');
  if (!popup) return;
  const open = () => popup.setAttribute('aria-hidden', 'false');
  const close = () => popup.setAttribute('aria-hidden', 'true');
  popup.querySelectorAll('[data-popup-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && popup.getAttribute('aria-hidden') === 'false') close(); });

  // Show once per session after 8s (respect reduced-motion: still show, no animation handled in CSS)
  const KEY = 'moa_popup_shown';
  if (!sessionStorage.getItem(KEY)) {
    setTimeout(() => { open(); sessionStorage.setItem(KEY, '1'); }, 8000);
  }

  const form = popup.querySelector('[data-popup-submit]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.innerHTML = '<p style="font-family: var(--font-serif); font-size: 22px; text-align: center; padding: 16px;">Thank you — your code is on its way.</p>';
    setTimeout(close, 2400);
  });

  window.MOA.openPopup = open;
  window.MOA.closePopup = close;
})();
```

- [ ] **Step 3: Paste drawer + popup HTML into `index.html`** (before the `<script>` tag at the end of body)

- [ ] **Step 4: Visually verify**

Refresh. Verify:
- Click the cart icon in nav: drawer slides in from the right, backdrop darkens, "Your bag is empty" centred message appears, progress bar at 0%, Checkout button disabled
- Click backdrop or close button or press Escape: drawer slides out
- Wait 8 seconds: email popup fades/scales in with headline, input, CTA
- Submit popup form: submit feedback message, auto-closes after 2.4s
- Refresh the page: popup does NOT show again (sessionStorage)
- Open a new incognito tab + wait 8s: popup shows (confirms session gate)
- No console errors

- [ ] **Step 5: Commit**

```bash
git add native-nature/css/components.css native-nature/js/main.js native-nature/index.html
git commit -m "Add cart drawer + email popup shells with session gating"
```

---

# Phase 3 — Homepage non-cinematic sections

**Remove smoke-test `.container` content from `index.html` before starting Task 3.1.** Keep announcement + nav + footer + drawer + popup. Sections 3.1–3.5 insert between nav and footer in order.

## Task 3.1: Trust strip + 4-up editorial pillar grid (homepage sections 4 + 5)

**Files:**
- Create: `native-nature/css/home.css` (new, linked from index.html)
- Modify: `native-nature/index.html` (add markup + link stylesheet)

**HTML (insert as first children of main homepage content after nav):**

```html
<main id="main">
<!-- §4 Trust strip -->
<section class="trust-strip" aria-label="Trust proof">
  <div class="container">
    <div class="trust-strip__grid">
      <div class="trust-strip__item">
        <span class="trust-strip__value">4.9<span aria-hidden="true">★</span></span>
        <span class="trust-strip__label">from 1,052 reviews</span>
      </div>
      <div class="trust-strip__divider" aria-hidden="true"></div>
      <div class="trust-strip__item">
        <span class="trust-strip__value">40 yrs</span>
        <span class="trust-strip__label">Family formulated</span>
      </div>
      <div class="trust-strip__divider" aria-hidden="true"></div>
      <div class="trust-strip__item trust-strip__retail">
        <span class="trust-strip__label">Trusted at</span>
        <span class="trust-strip__retailers">WALMART · WALGREENS</span>
      </div>
      <div class="trust-strip__divider" aria-hidden="true"></div>
      <div class="trust-strip__item">
        <span class="trust-strip__value">100%</span>
        <span class="trust-strip__label">Dermatologist-reviewed</span>
      </div>
    </div>
  </div>
</section>

<!-- §5 Pillar grid -->
<section class="pillars" id="pillars">
  <div class="container">
    <header class="section-header">
      <p class="mono">Shop by ritual</p>
      <h2>Find your <em>aloe</em>.</h2>
    </header>
    <div class="pillars__grid">
      <a class="pillar" href="#">
        <div class="pillar__img pillar__img--foot" aria-hidden="true"></div>
        <div class="pillar__body">
          <p class="mono">01 / Foot & Hand</p>
          <h3>Repair.</h3>
          <p>Creams for feet, hands and heels that have had a long day.</p>
        </div>
      </a>
      <a class="pillar" href="#">
        <div class="pillar__img pillar__img--body" aria-hidden="true"></div>
        <div class="pillar__body">
          <p class="mono">02 / Body</p>
          <h3>Hydrate.</h3>
          <p>Daily moisture for every kind of skin, every day of the year.</p>
        </div>
      </a>
      <a class="pillar" href="#">
        <div class="pillar__img pillar__img--face" aria-hidden="true"></div>
        <div class="pillar__body">
          <p class="mono">03 / Face & Hair</p>
          <h3>Restore.</h3>
          <p>Gels, serums and washes with aloe at their quiet centre.</p>
        </div>
      </a>
      <a class="pillar" href="#">
        <div class="pillar__img pillar__img--supps" aria-hidden="true"></div>
        <div class="pillar__body">
          <p class="mono">04 / Supplements</p>
          <h3>Drink it in.</h3>
          <p>Pure aloe juice, bottled the way we've always made it.</p>
        </div>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 1: Create `css/home.css` and add trust strip + pillar styles**

```css
/* ===== Section headers ===== */
.section-header { margin-bottom: clamp(40px, 5vw, 80px); display: flex; flex-direction: column; gap: 14px; max-width: 720px; }
.section-header h2 em { font-style: italic; }

/* ===== Trust strip (§4) ===== */
.trust-strip {
  padding: 24px 0;
  background: var(--color-paper);
  border-top: 1px solid rgba(26, 31, 28, 0.08);
  border-bottom: 1px solid rgba(26, 31, 28, 0.08);
}
.trust-strip__grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.trust-strip__item {
  display: flex; flex-direction: column; gap: 2px;
  font-family: var(--font-sans);
}
.trust-strip__value { font-family: var(--font-serif); font-size: clamp(24px, 2.2vw, 30px); line-height: 1; color: var(--color-ink); }
.trust-strip__label { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: var(--color-muted); }
.trust-strip__retailers { font-family: var(--font-serif); font-size: 18px; letter-spacing: 0.08em; color: var(--color-ink); }
.trust-strip__divider { width: 1px; height: 28px; background: rgba(26, 31, 28, 0.16); }

@media (max-width: 860px) {
  .trust-strip__grid { justify-content: flex-start; gap: 16px 24px; }
  .trust-strip__divider { display: none; }
}

/* ===== Pillar grid (§5) ===== */
.pillars { padding: var(--section-pad-y) 0; }
.pillars__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.pillar {
  display: flex; flex-direction: column;
  background: var(--color-mist);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: transform var(--dur-med) var(--ease-out);
}
.pillar:hover { transform: translateY(-6px); opacity: 1; }
.pillar__img {
  aspect-ratio: 3 / 4;
  background-size: cover;
  background-position: center;
  background-color: var(--color-mist);
  position: relative;
}
.pillar__img::after {
  content: "Asset: pillar-* still (see assets/stills/README.md)";
  position: absolute; inset: auto 12px 12px 12px;
  font-family: var(--font-mono); font-size: 10px;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.12em;
  opacity: 0.6;
}
/* Temporary placeholder gradients — replaced by real stills on swap-in */
.pillar__img--foot  { background: linear-gradient(135deg, #D8E4D1 0%, #8DC735 100%); }
.pillar__img--body  { background: linear-gradient(135deg, #F6F2EA 0%, #D8E4D1 100%); }
.pillar__img--face  { background: linear-gradient(135deg, #D8E4D1 0%, #0F3B2C 100%); }
.pillar__img--supps { background: linear-gradient(135deg, #F6F2EA 0%, #8DC735 100%); }

.pillar__body { padding: 28px 28px 32px; display: flex; flex-direction: column; gap: 10px; }
.pillar__body h3 { font-size: clamp(26px, 2.2vw, 34px); }
.pillar__body p { font-size: 14px; color: var(--color-muted); max-width: 30ch; }

@media (max-width: 1060px) { .pillars__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px)  { .pillars__grid { grid-template-columns: 1fr; } }
```

**Placeholder convention:** When a still is added, replace the CSS variable/gradient with `background-image: url('../assets/stills/pillar-foot.jpg');` and remove the `::after` overlay. Asset swap-in is a manual one-liner per pillar.

- [ ] **Step 2: Add `<link rel="stylesheet" href="css/home.css">` to `index.html`** after components.css

- [ ] **Step 3: Insert the Trust strip + Pillar grid HTML** into `index.html` (right after closing `</header>` of nav, or wrap in `<main id="main">` so the hero goes above them later)

- [ ] **Step 4: Visually verify**

Refresh. Verify:
- Trust strip: 4 items separated by hairline dividers, values in serif, mono labels, retailer names in serif centred
- Pillar grid: 4 cards in a row on desktop with gradient placeholders + mono overlay label in the corner saying "Asset: pillar-* still (see assets/stills/README.md)"; cream body below with mono "01 / Foot & Hand", serif "Repair.", muted sub-copy
- Hover a pillar: lifts 6px
- Narrow to tablet (<1060px): grid becomes 2-up; narrow to mobile (<560px): becomes 1-up; trust strip dividers disappear and items wrap

- [ ] **Step 5: Commit**

```bash
git add native-nature/css/home.css native-nature/index.html
git commit -m "Add homepage trust strip + 4-up pillar grid with placeholder gradients"
```

---

## Task 3.2: Hero product spotlight — Foot Repair (§6)

**Files:**
- Modify: `native-nature/css/home.css` (append styles)
- Modify: `native-nature/index.html` (add section)

**HTML (insert after pillars section):**

```html
<!-- §6 Hero product spotlight -->
<section class="spotlight section section--mist">
  <div class="container">
    <div class="spotlight__grid">
      <div class="spotlight__media">
        <img src="../assets/products/foot-repair-front.png" srcset="assets/products/foot-repair-front.png 1x" alt="Miracle Foot Repair Cream 32oz with pump dispenser" loading="lazy" width="640" height="800">
      </div>
      <div class="spotlight__body">
        <p class="mono">The hero product</p>
        <h2>America's <em>#1</em><br>foot repair cream.</h2>
        <p class="lede">Forty years of refinement. The cream that turns chronically dry, cracked heels into something you forget about. Fast, quietly, without the grease.</p>
        <ul class="spotlight__benefits">
          <li><strong>Visibly softer in 14 days</strong> — reviewed by 1,052 customers</li>
          <li><strong>UltraAloe® at the core</strong> — our 40-year proprietary process</li>
          <li><strong>Safe for diabetic skin</strong> — dermatologist-reviewed</li>
        </ul>
        <div class="spotlight__actions">
          <a class="btn btn--primary" href="products/miracle-foot-repair-cream.html">Shop Foot Repair · $36.99</a>
          <a class="btn btn--ghost" href="#bestsellers">See best sellers</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 1: Fix the img `src` typo above** — it should be `assets/...` not `../assets/...` (the homepage is at the root of native-nature/). The line should be `<img src="assets/products/foot-repair-front.png" ...>`.

- [ ] **Step 2: Append spotlight CSS to `home.css`**

```css
/* ===== Hero product spotlight (§6) ===== */
.spotlight__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}
.spotlight__media {
  aspect-ratio: 4 / 5;
  background: var(--color-paper);
  border-radius: var(--radius-card);
  display: grid; place-items: center;
  overflow: hidden;
  position: relative;
}
.spotlight__media::before {
  content: "";
  position: absolute; inset: auto 10% 0 10%; height: 22%;
  background: radial-gradient(ellipse at center, rgba(26,31,28,0.14), transparent 60%);
  filter: blur(8px);
}
.spotlight__media img { max-width: 72%; height: auto; position: relative; z-index: 1; }

.spotlight__body h2 { margin-top: 12px; margin-bottom: 22px; }
.spotlight__body h2 em { font-style: italic; color: var(--color-jungle); }
.spotlight__benefits { list-style: none; display: flex; flex-direction: column; gap: 12px; margin: 28px 0 36px; padding-left: 0; }
.spotlight__benefits li { font-size: 15px; padding-left: 24px; position: relative; color: var(--color-ink); }
.spotlight__benefits li::before {
  content: ""; position: absolute; left: 0; top: 9px;
  width: 12px; height: 2px; background: var(--color-aloe);
}
.spotlight__benefits strong { font-weight: 600; }
.spotlight__actions { display: flex; gap: 12px; flex-wrap: wrap; }

@media (max-width: 860px) {
  .spotlight__grid { grid-template-columns: 1fr; gap: 36px; }
  .spotlight__media { aspect-ratio: 1; }
}
```

- [ ] **Step 3: Visually verify**

Refresh. Verify:
- Full-width mist-tinted section with split layout
- Left: Foot Repair jar on paper-bg panel with a soft ground shadow under it
- Right: mono label, serif h2 with jungle-green italicised "#1", serif lede, 3 benefits with aloe-green dash markers, 2 CTAs (jungle primary + ink-outline ghost)
- Hover primary CTA: lifts 1px; hover ghost: fills dark
- Tablet: stacks to 1-column

- [ ] **Step 4: Commit**

```bash
git add native-nature/css/home.css native-nature/index.html
git commit -m "Add Foot Repair hero spotlight with benefits list + dual CTA"
```

---

## Task 3.3: Why Aloe Works (health benefits) + aloe-benefit marquee (§7)

**Files:**
- Modify: `native-nature/css/home.css` (append)
- Modify: `native-nature/css/components.css` (append marquee styles if not shared)
- Modify: `native-nature/index.html` (add section)

**HTML:**

```html
<!-- §7 Why Aloe Works -->
<section class="why-aloe section">
  <div class="container">
    <header class="section-header">
      <p class="mono">The science, quietly</p>
      <h2>Why <em>aloe</em> works.</h2>
      <p class="lede">One plant, 75+ active compounds. Here's what modern dermatology confirms about what your grandmother already knew.</p>
    </header>

    <div class="why-aloe__grid">
      <div class="why-aloe__media">
        <div class="why-aloe__img" aria-hidden="true">
          <span class="mono">Asset: full-width brand hero still (swap in)</span>
        </div>
      </div>
      <ul class="why-aloe__benefits">
        <li>
          <p class="mono">01 / Deep hydration</p>
          <h3>Humectant mucopolysaccharides pull and hold water at the skin barrier.</h3>
          <p>The reason aloe feels cooling the moment it lands — it's physically binding moisture in place.</p>
        </li>
        <li>
          <p class="mono">02 / Skin repair</p>
          <h3>Polysaccharides and glycoproteins accelerate epithelial turnover.</h3>
          <p>Faster cell replacement is why cracked skin looks and feels better in days, not weeks.</p>
        </li>
        <li>
          <p class="mono">03 / Antioxidant defence</p>
          <h3>Vitamins A, C, E plus enzymes neutralise free-radical damage.</h3>
          <p>The slow oxidation that dulls skin over the years — aloe is one of nature's quiet counterweights.</p>
        </li>
        <li>
          <p class="mono">04 / Anti-inflammatory</p>
          <h3>Salicylic acid and anthraquinones calm redness and irritation.</h3>
          <p>Soothing is not a marketing word here. It's a measured, repeatable effect.</p>
        </li>
      </ul>
    </div>
  </div>
</section>

<!-- Aloe-benefit marquee -->
<div class="benefit-marquee" aria-hidden="true">
  <div class="benefit-marquee__track">
    <span>Polysaccharides</span><span class="dot">·</span>
    <span>Vitamin A</span><span class="dot">·</span>
    <span>Vitamin C</span><span class="dot">·</span>
    <span>Vitamin E</span><span class="dot">·</span>
    <span>Enzymes</span><span class="dot">·</span>
    <span>Amino acids</span><span class="dot">·</span>
    <span>Aloin</span><span class="dot">·</span>
    <span>Salicylic acid</span><span class="dot">·</span>
    <span>Saponins</span><span class="dot">·</span>
    <span>Anthraquinones</span><span class="dot">·</span>
    <!-- duplicate for seamless loop -->
    <span>Polysaccharides</span><span class="dot">·</span>
    <span>Vitamin A</span><span class="dot">·</span>
    <span>Vitamin C</span><span class="dot">·</span>
    <span>Vitamin E</span><span class="dot">·</span>
    <span>Enzymes</span><span class="dot">·</span>
    <span>Amino acids</span><span class="dot">·</span>
    <span>Aloin</span><span class="dot">·</span>
    <span>Salicylic acid</span><span class="dot">·</span>
    <span>Saponins</span><span class="dot">·</span>
    <span>Anthraquinones</span><span class="dot">·</span>
  </div>
</div>
```

- [ ] **Step 1: Append Why-Aloe + marquee styles to `home.css`**

```css
/* ===== Why Aloe Works (§7) ===== */
.why-aloe__grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
}
.why-aloe__media {
  position: sticky;
  top: 120px;
}
.why-aloe__img {
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-card);
  background: linear-gradient(180deg, #D8E4D1 0%, #8DC735 100%);
  position: relative;
  overflow: hidden;
}
.why-aloe__img .mono {
  position: absolute; inset: auto 16px 16px 16px;
  color: rgba(26, 31, 28, 0.7);
  font-size: 10px;
}

.why-aloe__benefits { list-style: none; padding: 0; display: flex; flex-direction: column; }
.why-aloe__benefits li {
  padding: 36px 0;
  border-bottom: 1px solid rgba(26, 31, 28, 0.12);
  display: flex; flex-direction: column; gap: 10px;
}
.why-aloe__benefits li:first-child { padding-top: 0; }
.why-aloe__benefits li:last-child { border-bottom: 0; }
.why-aloe__benefits h3 { font-size: clamp(22px, 2vw, 30px); max-width: 34ch; }
.why-aloe__benefits p { font-size: 15px; color: var(--color-muted); max-width: 50ch; }

@media (max-width: 960px) {
  .why-aloe__grid { grid-template-columns: 1fr; }
  .why-aloe__media { position: static; }
  .why-aloe__img { aspect-ratio: 16 / 10; }
}

/* ===== Benefit marquee ===== */
.benefit-marquee {
  background: var(--color-forest);
  color: var(--color-paper);
  padding: 22px 0;
  overflow: hidden;
  font-family: var(--font-serif);
  font-size: clamp(24px, 2.6vw, 38px);
}
.benefit-marquee__track {
  display: inline-flex;
  gap: 32px;
  white-space: nowrap;
  animation: marquee 48s linear infinite;
  padding-left: 100%;
}
.benefit-marquee__track .dot { color: var(--color-aloe); }
@media (prefers-reduced-motion: reduce) {
  .benefit-marquee__track { animation: none; padding-left: var(--gutter); }
}
```

- [ ] **Step 2: Visually verify**

Refresh. Verify:
- Section header: mono "THE SCIENCE, QUIETLY", serif h2 "Why aloe works." with italicised "aloe"
- Left column: tall image panel (green gradient placeholder with asset note) that sticks as you scroll past the benefits list
- Right column: 4 benefit items each with mono numeric label, serif bolded h3 phrase, muted sub-copy; thin dividers between
- Below section: forest-green band scrolling 10 aloe compounds in serif with aloe-green dot separators
- Mobile: grid stacks; sticky panel becomes static

- [ ] **Step 3: Commit**

```bash
git add native-nature/css/home.css native-nature/index.html
git commit -m "Add 'Why Aloe Works' health-benefits section + compound marquee"
```

---

## Task 3.4: Social proof wall + Best sellers grid (§9 + §10)

**Files:**
- Modify: `native-nature/css/home.css` (append)
- Modify: `native-nature/index.html` (add section)

**HTML:**

```html
<!-- §9 Social proof wall -->
<section class="reviews section section--mist">
  <div class="container">
    <header class="section-header">
      <p class="mono">The receipts</p>
      <h2>1,052 reviews.<br><em>4.9</em> average.</h2>
    </header>
    <div class="reviews__grid">
      <article class="review">
        <div class="review__stars">★★★★★</div>
        <blockquote>"I've tried every foot cream on the market. This one's the only one that actually worked. Cracks were gone in a week."</blockquote>
        <cite>— Diane R.<span class="mono">Verified buyer</span></cite>
      </article>
      <article class="review review--feature">
        <div class="review__stars">★★★★★</div>
        <blockquote>"My pharmacist recommended it — I was sceptical. Forty years of formula later, I understand why it's in Walmart."</blockquote>
        <cite>— Martin K.<span class="mono">Verified buyer</span></cite>
      </article>
      <article class="review">
        <div class="review__stars">★★★★★</div>
        <blockquote>"I'm diabetic, my skin needs gentle. This is the only thing my dermatologist told me I can use without worry."</blockquote>
        <cite>— Paula M.<span class="mono">Verified buyer</span></cite>
      </article>
      <article class="review">
        <div class="review__stars">★★★★★</div>
        <blockquote>"Used it on my mother's hands after chemo — finally something that didn't burn. Thank you."</blockquote>
        <cite>— Joanna F.<span class="mono">Verified buyer</span></cite>
      </article>
      <article class="review">
        <div class="review__stars">★★★★★</div>
        <blockquote>"Farm-worker hands. This is the first lotion that has survived a full day of dirt and still done its job by evening."</blockquote>
        <cite>— Carlos E.<span class="mono">Verified buyer</span></cite>
      </article>
      <article class="review review--stat">
        <p class="mono">Among 1,052 reviews</p>
        <p class="review__bignum"><em>97%</em></p>
        <p>would recommend to a friend.</p>
      </article>
    </div>
  </div>
</section>

<!-- §10 Best sellers grid -->
<section class="bestsellers section" id="bestsellers">
  <div class="container">
    <header class="section-header">
      <p class="mono">What's selling now</p>
      <h2>The <em>best</em> sellers.</h2>
    </header>
    <div class="bestsellers__grid">
      <a class="product-card" href="#">
        <div class="product-card__img"><img src="assets/products/hand-repair.png" alt="Miracle Hand Repair Cream 32oz pump" loading="lazy"></div>
        <div class="product-card__body">
          <p class="mono">Foot & Hand</p>
          <h3>Miracle Hand Repair®</h3>
          <p class="product-card__stars">★★★★★ <span>862 reviews</span></p>
          <p class="product-card__price">$36.99</p>
        </div>
      </a>
      <a class="product-card" href="#">
        <div class="product-card__img"><img src="assets/products/aloe-all-over.png" alt="Aloe All Over Super Moisturizing Lotion 32oz pump" loading="lazy"></div>
        <div class="product-card__body">
          <p class="mono">Body</p>
          <h3>Aloe All Over®</h3>
          <p class="product-card__stars">★★★★★ <span>1,203 reviews</span></p>
          <p class="product-card__price">$36.99</p>
        </div>
      </a>
      <a class="product-card" href="#">
        <div class="product-card__img"><img src="assets/products/miracle-rub.png" alt="Miracle Rub Pain Relieving Cream 32oz pump" loading="lazy"></div>
        <div class="product-card__body">
          <p class="mono">Body</p>
          <h3>Miracle Rub</h3>
          <p class="product-card__stars">★★★★★ <span>594 reviews</span></p>
          <p class="product-card__price">$36.99</p>
        </div>
      </a>
      <a class="product-card" href="#">
        <div class="product-card__img"><img src="assets/products/all-day-moisturizer.jpg" alt="All Day Moisturizer 2oz" loading="lazy"></div>
        <div class="product-card__body">
          <p class="mono">Body</p>
          <h3>All Day Moisturizer</h3>
          <p class="product-card__stars">★★★★★ <span>441 reviews</span></p>
          <p class="product-card__price">$14.29</p>
        </div>
      </a>
      <a class="product-card" href="#">
        <div class="product-card__img"><img src="assets/products/facial-gel.jpg" alt="Rehydrating Facial Gel 2oz" loading="lazy"></div>
        <div class="product-card__body">
          <p class="mono">Face & Hair</p>
          <h3>Rehydrating Facial Gel</h3>
          <p class="product-card__stars">★★★★★ <span>382 reviews</span></p>
          <p class="product-card__price">$18.79</p>
        </div>
      </a>
      <a class="product-card" href="#">
        <div class="product-card__img"><img src="assets/products/ultra-aloe-juice.jpg" alt="Ultra Aloe Juice 100% Purified Filtered Quart" loading="lazy"></div>
        <div class="product-card__body">
          <p class="mono">Supplements</p>
          <h3>Ultra Aloe Juice</h3>
          <p class="product-card__stars">★★★★★ <span>714 reviews</span></p>
          <p class="product-card__price">$15.49</p>
        </div>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 1: Append reviews + bestsellers CSS to `home.css`**

```css
/* ===== Reviews wall (§9) ===== */
.reviews__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  grid-auto-rows: minmax(220px, auto);
}
.review {
  background: var(--color-paper);
  border-radius: var(--radius-card);
  padding: 28px 28px 24px;
  display: flex; flex-direction: column; gap: 14px;
}
.review--feature { background: var(--color-forest); color: var(--color-paper); grid-row: span 1; grid-column: span 2; }
.review--feature blockquote { font-size: clamp(22px, 2vw, 28px); }
.review__stars { color: var(--color-jungle); font-size: 16px; letter-spacing: 2px; }
.review--feature .review__stars { color: var(--color-aloe); }
.review blockquote { font-family: var(--font-serif); font-size: 18px; line-height: 1.4; }
.review cite { font-style: normal; display: flex; gap: 12px; align-items: baseline; font-size: 13px; color: var(--color-muted); margin-top: auto; }
.review--feature cite { color: rgba(246,242,234,0.7); }
.review cite .mono { font-size: 10px; }

.review--stat { background: var(--color-aloe); text-align: center; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 6px; }
.review--stat .mono { color: rgba(26,31,28,0.6); }
.review__bignum { font-family: var(--font-serif); font-size: clamp(72px, 8vw, 120px); line-height: 0.9; }
.review__bignum em { font-style: italic; }

@media (max-width: 960px) {
  .reviews__grid { grid-template-columns: repeat(2, 1fr); }
  .review--feature { grid-column: span 2; }
}
@media (max-width: 560px) {
  .reviews__grid { grid-template-columns: 1fr; }
  .review--feature { grid-column: span 1; }
}

/* ===== Best sellers (§10) ===== */
.bestsellers__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.product-card {
  display: flex; flex-direction: column;
  background: var(--color-paper);
  border: 1px solid rgba(26, 31, 28, 0.08);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: transform var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out);
}
.product-card:hover { transform: translateY(-4px); border-color: rgba(26, 31, 28, 0.18); opacity: 1; }
.product-card__img {
  aspect-ratio: 4 / 5;
  background: var(--color-mist);
  display: grid; place-items: center;
  overflow: hidden;
  position: relative;
}
.product-card__img img { max-width: 70%; max-height: 80%; object-fit: contain; }
.product-card__body { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 8px; }
.product-card__body h3 { font-size: 22px; font-family: var(--font-serif); }
.product-card__stars { color: var(--color-jungle); font-size: 13px; letter-spacing: 1px; }
.product-card__stars span { color: var(--color-muted); font-family: var(--font-sans); margin-left: 6px; font-size: 12px; letter-spacing: normal; }
.product-card__price { font-size: 18px; font-weight: 500; margin-top: auto; }

@media (max-width: 960px) { .bestsellers__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .bestsellers__grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Visually verify**

Refresh. Verify:
- Reviews wall: mist bg; 3-column grid with 6 items, one of which is a wide forest-green featured quote spanning 2 columns, one of which is an aloe-green "97% would recommend" stat tile with huge italic number
- Best sellers: 3×2 grid of paper cards with mist-tinted product image panels (real product photos from client, centred, contained at 70% max), category mono label, serif product name, jungle stars, price
- Hover card: lifts 4px, border deepens
- Tablet: reviews → 2-col with feature across both; bestsellers → 2-col
- Mobile: single column both

- [ ] **Step 3: Commit**

```bash
git add native-nature/css/home.css native-nature/index.html
git commit -m "Add social proof wall + best sellers grid with client product photography"
```

---

## Task 3.5: Full-width brand moment (§11) + email capture (§12)

**Files:**
- Modify: `native-nature/css/home.css` (append)
- Modify: `native-nature/index.html` (add sections)

**HTML:**

```html
<!-- §11 Full-width brand moment -->
<section class="brand-moment" aria-label="Brand statement">
  <div class="brand-moment__media" aria-hidden="true">
    <span class="mono">Asset: full-width brand hero still</span>
  </div>
  <div class="brand-moment__overlay">
    <blockquote>
      <p>"Forty years<br>of one obsession:<br><em>one plant,</em><br>done properly."</p>
    </blockquote>
    <p class="mono">— Our founding promise, 1986</p>
  </div>
</section>

<!-- §12 Email capture -->
<section class="email-capture section">
  <div class="container">
    <div class="email-capture__panel">
      <div>
        <p class="mono">Join the family</p>
        <h2>Get <em>25% off</em><br>your first order.</h2>
        <p class="lede" style="margin-top: 20px;">Be first to hear about new drops, expert advice, and limited-edition sets.</p>
      </div>
      <form class="email-capture__form" id="emailCaptureForm">
        <label class="sr-only" for="emailInput">Email address</label>
        <input id="emailInput" type="email" required placeholder="Your email" autocomplete="email">
        <button class="btn btn--primary" type="submit">Send me 25% →</button>
        <p class="email-capture__disclaimer">By subscribing you agree to our privacy policy. Unsubscribe any time.</p>
      </form>
    </div>
  </div>
</section>
```

- [ ] **Step 1: Append CSS for brand moment + email capture to `home.css`**

```css
/* ===== Brand moment (§11) ===== */
.brand-moment {
  position: relative;
  min-height: 90vh;
  display: grid; place-items: center;
  overflow: hidden;
  color: var(--color-paper);
}
.brand-moment__media {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #0F3B2C 0%, #8DC735 120%);
  display: grid; place-items: center;
}
.brand-moment__media::before {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(15, 59, 44, 0.35) 70%);
}
.brand-moment__media .mono { position: relative; z-index: 1; color: rgba(246,242,234,0.45); }
.brand-moment__overlay {
  position: relative; z-index: 2;
  text-align: center;
  padding: 0 var(--gutter);
  max-width: 920px;
}
.brand-moment blockquote p {
  font-family: var(--font-serif);
  font-size: clamp(40px, 6.5vw, 92px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--color-paper);
  max-width: none;
}
.brand-moment em { font-style: italic; color: var(--color-aloe); }
.brand-moment__overlay .mono { margin-top: 28px; color: rgba(246,242,234,0.6); }

/* ===== Email capture (§12) ===== */
.email-capture__panel {
  background: var(--color-mist);
  border-radius: var(--radius-card);
  padding: clamp(40px, 6vw, 72px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 80px);
  align-items: center;
}
.email-capture h2 em { font-style: italic; color: var(--color-jungle); }
.email-capture__form { display: flex; flex-direction: column; gap: 12px; }
.email-capture__form input {
  font: inherit; padding: 16px 20px; font-size: 15px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(26, 31, 28, 0.16);
  background: #fff;
}
.email-capture__form input:focus { outline: 2px solid var(--color-jungle); outline-offset: 2px; }
.email-capture__form .btn--primary { justify-content: center; }
.email-capture__disclaimer { font-size: 11px; color: var(--color-muted); margin-top: 6px; }

@media (max-width: 860px) {
  .email-capture__panel { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Append email capture submission logic to `main.js`**

```javascript
// ===== Inline email capture (§12 on homepage) =====
(function initInlineEmail() {
  const form = document.getElementById('emailCaptureForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sent — check your inbox ✓';
    input.disabled = true;
  });
})();
```

- [ ] **Step 3: Visually verify**

Refresh. Verify:
- Brand moment: tall section (~90vh) with forest→aloe diagonal gradient and mono placeholder tag; large serif pull-quote centred with italicised "one plant" in aloe-green; mono attribution line below
- Email capture: mist panel with split layout — left: mono label + serif h2 with italicised jungle-green "25% off" + lede; right: email input (pill, white) + jungle CTA + disclaimer
- Submit form: button becomes "Sent — check your inbox ✓" and disables
- Mobile: panel stacks

- [ ] **Step 4: Commit**

```bash
git add native-nature/css/home.css native-nature/js/main.js native-nature/index.html
git commit -m "Add brand moment + inline email capture panel"
```

---

# Phase 4 — Homepage cinematic moments

## Task 4.1: Moment 1 — cinematic hero with canvas frame-scrub (§3)

**Files:**
- Create: `native-nature/js/home.js`
- Modify: `native-nature/css/home.css` (append)
- Modify: `native-nature/index.html` (add hero section immediately after nav, before trust strip; add GSAP + home.js script tags)

**HTML (insert at the very top of `<main>`, before §4 trust strip):**

```html
<!-- §3 Cinematic hero — Moment 1 -->
<section class="hero" id="hero" aria-label="Hero">
  <div class="hero__canvas-wrap">
    <canvas class="hero__canvas" id="heroCanvas" aria-hidden="true"></canvas>
  </div>
  <div class="hero__overlay">
    <div class="container hero__inner">
      <p class="mono">America's most-loved aloe skincare</p>
      <h1>The aloe plant.<br><em>Reformulated</em><br>for forty years.</h1>
      <div class="hero__actions">
        <a class="btn btn--primary" href="#bestsellers">Shop bestsellers →</a>
        <a class="btn btn--pale" href="products/miracle-foot-repair-cream.html">See Foot Repair</a>
      </div>
    </div>
  </div>
  <p class="hero__scrollhint mono">scroll to begin</p>
</section>
```

**Scripts (add to `<head>` with `rel="preconnect"` already present, or before `</body>`):**

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="js/home.js" defer></script>
```

- [ ] **Step 1: Append hero CSS to `home.css`**

```css
/* ===== Cinematic hero — Moment 1 ===== */
.hero {
  position: relative;
  height: 320vh; /* tall scroll container; canvas is pinned */
}
.hero__canvas-wrap {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  background: var(--color-paper);
  overflow: hidden;
}
.hero__canvas { width: 100%; height: 100%; display: block; }

.hero__overlay {
  position: absolute; inset: 0;
  pointer-events: none;
  display: grid; align-items: center;
  /* Pinned with the canvas */
}
.hero__overlay .container { pointer-events: auto; }
.hero__inner { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; max-width: 920px; padding-top: clamp(24px, 5vh, 60px); }
.hero__inner .mono { margin-bottom: 20px; color: var(--color-muted); }
.hero h1 { max-width: 14ch; }
.hero h1 em { font-style: italic; color: var(--color-jungle); }
.hero__actions { margin-top: 36px; display: flex; gap: 12px; flex-wrap: wrap; }

.hero__scrollhint {
  position: absolute;
  bottom: 32px; left: 50%;
  transform: translateX(-50%);
  color: var(--color-muted);
  font-size: 10px;
  animation: hint 2.4s ease-in-out infinite;
}
@keyframes hint {
  0%, 100% { transform: translate(-50%, 0); opacity: 0.4; }
  50% { transform: translate(-50%, 6px); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .hero__scrollhint { animation: none; } }

@media (max-width: 860px) {
  .hero { height: 260vh; }
}
```

- [ ] **Step 2: Write `js/home.js` — canvas frame-scrub + ScrollTrigger pin**

Complete file:

```javascript
// ===== Moment 1 — canvas frame-scrub hero =====
(function initHeroScrub() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Config: frame count matches FFmpeg extraction (Task 0.3 default = 96 frames @ 24fps × 4s)
  const FRAME_COUNT = 96;
  const FRAME_PATH = (i) => `assets/frames/frame_${String(i).padStart(4, '0')}.jpg`;

  const frames = new Array(FRAME_COUNT);
  let loaded = 0;
  let currentIdx = -1;

  const sizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawFrame = (idx) => {
    const img = frames[idx];
    if (!img || !img.complete) return;
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw, dh, dx, dy;
    if (cr > ir) { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
    else        { dh = ch; dw = ch * ir; dy = 0; dx = (cw - dw) / 2; }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  const preload = () => new Promise(resolve => {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === FRAME_COUNT) resolve();
      };
      frames[i - 1] = img;
    }
  });

  const start = async () => {
    sizeCanvas();
    await preload();
    drawFrame(0);

    // If GSAP isn't ready yet, retry on next frame
    const initScroll = () => {
      if (!window.gsap || !window.ScrollTrigger) { requestAnimationFrame(initScroll); return; }
      gsap.registerPlugin(ScrollTrigger);

      const progress = { v: 0 };
      const render = () => {
        const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress.v * (FRAME_COUNT - 1))));
        if (idx !== currentIdx) { currentIdx = idx; drawFrame(idx); }
      };

      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => { progress.v = self.progress; render(); }
      });

      // Honour reduced motion — just show the last frame, no scroll scrub
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        progress.v = 1; render();
      }
    };
    initScroll();

    window.addEventListener('resize', () => { sizeCanvas(); drawFrame(currentIdx); }, { passive: true });
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
```

- [ ] **Step 3: Insert hero HTML + GSAP scripts into `index.html`**

Hero section goes as the FIRST child of `<main>`, before trust strip. Scripts go in `<head>` or before `</body>` (placement doesn't matter since they're deferred).

- [ ] **Step 4: Visually verify**

Refresh. Verify:
- Above the fold: cream paper canvas with the synthetic placeholder video rendering (should show "PLACEHOLDER" text transitioning into a dark fade)
- Overlaid: mono proof line, serif h1 with italicised jungle-green "Reformulated", two CTAs, bottom-centre "scroll to begin" hint animating
- Scroll down: canvas stays pinned for ~3 viewports; the frame index scrubs forward/back smoothly with scroll position
- Scroll past: hero un-pins, trust strip below appears
- Check DevTools → Network: 96 frame jpegs loaded once
- No console errors
- Test reduced-motion preference: Chrome DevTools → Rendering → Emulate reduced motion → reload; confirm the hero displays the last frame statically with no scroll scrub

- [ ] **Step 5: Commit**

```bash
git add native-nature/css/home.css native-nature/js/home.js native-nature/index.html
git commit -m "Add cinematic hero Moment 1 with canvas frame-scrub + GSAP ScrollTrigger"
```

**Asset swap instructions (in-line note for user):** When the real `hero.mp4` arrives:
1. Replace `native-nature/assets/video/hero-placeholder.mp4` with `native-nature/assets/video/hero.mp4`
2. From `native-nature/assets/`, run: `rm -f frames/*.jpg && ffmpeg -i video/hero.mp4 -vf "fps=24,scale=1920:-2" -q:v 2 frames/frame_%04d.jpg`
3. Update `FRAME_COUNT` in `js/home.js` to match `ls frames/ | wc -l`

---

## Task 4.2: Moment 2 — UltraAloe® brand story pinned GSAP sequence (§8)

**Files:**
- Modify: `native-nature/css/home.css` (append)
- Modify: `native-nature/js/home.js` (append)
- Modify: `native-nature/index.html` (add section between §7 Why Aloe and §9 reviews)

**HTML:**

```html
<!-- §8 UltraAloe brand story — Moment 2 -->
<section class="process section--forest" id="ultraaloe">
  <div class="process__pin">
    <div class="container process__frame">
      <div class="process__header">
        <p class="mono">The differentiator</p>
        <h2 class="process__headline">Not aloe.<br><em>UltraAloe®.</em></h2>
        <p class="lede process__lede">Raw aloe oxidises within minutes of being cut. Most of the industry bottles it anyway. We spent forty years on a four-step process that doesn't.</p>
      </div>

      <ol class="process__steps" aria-label="UltraAloe process">
        <li class="process__step" data-step="1">
          <p class="mono">Step 01 · Grow</p>
          <div class="process__media" aria-hidden="true"><span class="mono">Asset: ultraaloe-grow.jpg</span></div>
          <h3>Family-partner farms.</h3>
          <p>Matured for four years before the first leaf is cut. No shortcuts on the plant.</p>
        </li>
        <li class="process__step" data-step="2">
          <p class="mono">Step 02 · Harvest</p>
          <div class="process__media" aria-hidden="true"><span class="mono">Asset: ultraaloe-harvest.jpg</span></div>
          <h3>Hand-cut at sunrise.</h3>
          <p>Every leaf starts the process within hours of being picked, while the gel is still alive.</p>
        </li>
        <li class="process__step" data-step="3">
          <p class="mono">Step 03 · UltraAloe® Process</p>
          <div class="process__media" aria-hidden="true"><span class="mono">Asset: ultraaloe-process.jpg</span></div>
          <h3>Our proprietary step.</h3>
          <p>The reason it works. We stabilise the active compounds before oxygen gets to them — the difference between aloe that soothes and aloe that doesn't.</p>
        </li>
        <li class="process__step" data-step="4">
          <p class="mono">Step 04 · Bottle</p>
          <div class="process__media" aria-hidden="true"><span class="mono">Asset: ultraaloe-bottle.jpg</span></div>
          <h3>Cold-filled, never cooked.</h3>
          <p>Bottled the way we have since 1986. Same formula, same temperature, same promise.</p>
        </li>
      </ol>
    </div>
  </div>
</section>
```

- [ ] **Step 1: Append process CSS to `home.css`**

```css
/* ===== UltraAloe brand story — Moment 2 ===== */
.process {
  background: var(--color-forest);
  color: var(--color-paper);
  position: relative;
}
.process__pin { height: 500vh; }
.process__frame {
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  grid-template-columns: 5fr 7fr;
  align-items: center;
  gap: clamp(32px, 6vw, 96px);
  padding: clamp(40px, 8vh, 80px) var(--gutter);
}
.process__header { max-width: 460px; }
.process__headline { color: var(--color-paper); margin: 20px 0 24px; }
.process__headline em { font-style: italic; color: var(--color-aloe); }
.process__lede { color: rgba(246, 242, 234, 0.72); max-width: 44ch; }

.process__steps {
  position: relative;
  list-style: none; padding: 0; margin: 0;
  height: 100%;
}
.process__step {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms var(--ease-out), transform 800ms var(--ease-out);
  pointer-events: none;
}
.process__step.is-active {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.process__step .mono { color: var(--color-aloe); }
.process__media {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-card);
  background: linear-gradient(135deg, rgba(246,242,234,0.08) 0%, rgba(141,199,53,0.18) 100%);
  display: grid; place-items: center;
  overflow: hidden;
  position: relative;
}
.process__media .mono {
  position: absolute; inset: auto 12px 12px 12px;
  color: rgba(246,242,234,0.5); font-size: 10px;
}
.process__step h3 {
  color: var(--color-paper);
  font-size: clamp(28px, 3vw, 44px);
  margin-top: 8px;
}
.process__step p { color: rgba(246,242,234,0.72); max-width: 50ch; }

@media (max-width: 960px) {
  .process__pin { height: auto; }
  .process__frame {
    position: static; height: auto;
    grid-template-columns: 1fr;
    padding: var(--section-pad-y) var(--gutter);
  }
  .process__steps { height: auto; display: flex; flex-direction: column; gap: 56px; }
  .process__step { position: static; opacity: 1; transform: none; pointer-events: auto; }
}
```

- [ ] **Step 2: Append process scrub logic to `home.js`**

```javascript
// ===== Moment 2 — UltraAloe brand story staged reveal =====
(function initProcessReveal() {
  const section = document.getElementById('ultraaloe');
  if (!section) return;
  const steps = section.querySelectorAll('.process__step');
  if (!steps.length) return;

  // Below 960px, the mobile CSS reveals all steps — don't run the scrub.
  const isDesktop = () => window.matchMedia('(min-width: 961px)').matches;

  const setActive = (idx) => {
    steps.forEach((el, i) => el.classList.toggle('is-active', i === idx));
  };

  setActive(0); // default

  const initScroll = () => {
    if (!window.gsap || !window.ScrollTrigger) { requestAnimationFrame(initScroll); return; }
    gsap.registerPlugin(ScrollTrigger);
    if (!isDesktop()) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2,
      onUpdate: (self) => {
        const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        setActive(idx);
      }
    });
  };
  initScroll();
})();
```

- [ ] **Step 3: Add section HTML to `index.html`** between the benefit-marquee (from §7) and the reviews section (§9). Double-check the section order reads: trust strip → pillars → spotlight → why aloe + marquee → **UltraAloe process** → reviews → bestsellers → brand moment → email capture.

- [ ] **Step 4: Visually verify**

Refresh. Verify:
- Below the compound marquee, a tall forest-green section kicks in
- As you scroll into it, the section pins; the left column (serif "Not aloe. UltraAloe®.") stays fixed while the right column cycles through 4 steps (Grow → Harvest → Process → Bottle)
- Each step fades/translates in; mono step label in aloe-green, gradient placeholder image panel with asset tag, serif h3, muted copy
- Scroll past: unpins, reviews section appears
- At <960px: pin disables, all 4 steps render stacked vertically
- Check reduced-motion mode: transitions collapse (base.css already handles this)
- No console errors

- [ ] **Step 5: Commit**

```bash
git add native-nature/css/home.css native-nature/js/home.js native-nature/index.html
git commit -m "Add UltraAloe brand-story Moment 2 pinned scroll with 4-step reveal"
```

---

# Phase 5 — PDP (Foot Repair Cream)

## Task 5.1: PDP above-fold — gallery + buy box + sticky ATC

**Files:**
- Create: `native-nature/products/miracle-foot-repair-cream.html`
- Create: `native-nature/css/product.css`
- Create: `native-nature/js/product.js`

**HTML** — build the page with the same head section pattern (fonts, tokens, base, components, product.css), the same nav + announcement + drawer + popup from the homepage (copy-paste unchanged, since they're component-shared chrome), and the PDP body. Body starts:

```html
<main id="main">
<section class="pdp-hero section">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="../">Home</a>
      <span aria-hidden="true">/</span>
      <a href="../#pillars">Foot & Hand</a>
      <span aria-hidden="true">/</span>
      <span>Miracle Foot Repair® Cream</span>
    </nav>

    <div class="pdp-hero__grid">
      <div class="pdp-gallery">
        <div class="pdp-gallery__main">
          <img src="../assets/products/foot-repair-front.png" alt="Miracle Foot Repair Cream 32oz with pump dispenser" id="galleryMain">
        </div>
        <div class="pdp-gallery__thumbs" role="tablist">
          <button class="pdp-gallery__thumb is-active" data-src="../assets/products/foot-repair-front.png" aria-label="Front of product">
            <img src="../assets/products/foot-repair-front.png" alt="">
          </button>
          <button class="pdp-gallery__thumb" data-src="../assets/products/foot-repair-back.jpg" aria-label="Back of product">
            <img src="../assets/products/foot-repair-back.jpg" alt="">
          </button>
        </div>
      </div>

      <div class="pdp-buybox">
        <p class="mono">End cracked heels in 14 days.</p>
        <h1>Miracle <em>Foot Repair®</em> Cream</h1>
        <div class="pdp-buybox__rating">
          <span class="stars">★★★★★</span>
          <span>4.9 · 1,052 reviews</span>
        </div>
        <p class="lede">Our hero: forty years of proprietary aloe formula, pumped into a 32oz bottle that lasts you half a year. Works on cracked, dry, diabetic, farm-worker skin. Doesn't leave a grease slick.</p>

        <div class="pdp-buybox__plan" role="radiogroup" aria-label="Purchase plan">
          <label class="pdp-buybox__plan-opt">
            <input type="radio" name="plan" value="onetime" checked>
            <div>
              <p class="mono">One-time</p>
              <p><strong>$36.99</strong></p>
            </div>
          </label>
          <label class="pdp-buybox__plan-opt">
            <input type="radio" name="plan" value="sub">
            <div>
              <p class="mono">Subscribe & save 15%</p>
              <p><strong>$31.44</strong> · delivered every 60 days</p>
            </div>
          </label>
        </div>

        <div class="pdp-buybox__qty">
          <label class="mono" for="qtyInput">Quantity</label>
          <div class="qty-stepper">
            <button type="button" data-qty="-" aria-label="Decrease quantity">−</button>
            <input id="qtyInput" type="number" min="1" value="1" aria-label="Quantity">
            <button type="button" data-qty="+" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <button class="btn btn--primary pdp-buybox__atc" id="addToBag">Add to bag · $36.99</button>
        <p class="pdp-buybox__note mono">Free shipping · 30-day money-back guarantee</p>

        <ul class="pdp-buybox__bullets">
          <li>✓ <strong>Dermatologist-reviewed</strong> · safe for diabetic skin</li>
          <li>✓ <strong>UltraAloe® proprietary</strong> · our 40-year process</li>
          <li>✓ <strong>Cruelty-free · made in the USA</strong></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- Sticky mini-ATC (appears on scroll past hero) -->
<div class="pdp-sticky" id="pdpSticky" aria-hidden="true">
  <div class="container pdp-sticky__inner">
    <div class="pdp-sticky__info">
      <img src="../assets/products/foot-repair-front.png" alt="" width="48" height="48">
      <div>
        <p class="pdp-sticky__name">Miracle Foot Repair® Cream</p>
        <p class="pdp-sticky__price mono">$36.99 · 32oz pump</p>
      </div>
    </div>
    <button class="btn btn--primary" id="stickyAtc">Add to bag</button>
  </div>
</div>
```

Header / chrome (nav + announcement + drawer + popup + footer) is copied from the homepage — same markup, adjust asset paths with `../` prefix (e.g. `../assets/brand/logo.webp`, `../css/tokens.css`, `js/product.js` instead of `js/home.js`). For link hrefs pointing to homepage sections, use `../#bestsellers` etc.

- [ ] **Step 1: Create `products/miracle-foot-repair-cream.html`** with full head (same font links as homepage; stylesheet chain: `../css/tokens.css`, `../css/base.css`, `../css/components.css`, `../css/product.css`), the announcement + nav chrome copied from index.html (with `../` path fixes), the PDP hero markup above, and the footer + drawer + popup copied from index.html. Script chain: `../js/main.js` + `../js/product.js`.

- [ ] **Step 2: Write `css/product.css` — above-fold styles**

```css
/* ===== Breadcrumb ===== */
.breadcrumb {
  display: flex; gap: 8px; align-items: center;
  font-size: 13px; color: var(--color-muted);
  margin-bottom: 40px;
}
.breadcrumb a { color: var(--color-muted); }
.breadcrumb a:hover { color: var(--color-ink); opacity: 1; }

/* ===== PDP hero grid ===== */
.pdp-hero__grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
}

.pdp-gallery { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 16px; }
.pdp-gallery__main {
  aspect-ratio: 4 / 5;
  background: var(--color-mist);
  border-radius: var(--radius-card);
  display: grid; place-items: center;
  overflow: hidden;
}
.pdp-gallery__main img { max-width: 72%; max-height: 80%; object-fit: contain; transition: opacity var(--dur-med) var(--ease-out); }
.pdp-gallery__thumbs { display: flex; gap: 12px; }
.pdp-gallery__thumb {
  width: 80px; aspect-ratio: 1;
  border-radius: var(--radius-sm);
  background: var(--color-mist);
  overflow: hidden;
  border: 1px solid transparent;
  transition: border-color var(--dur-fast) var(--ease-out);
  padding: 8px;
}
.pdp-gallery__thumb img { width: 100%; height: 100%; object-fit: contain; }
.pdp-gallery__thumb.is-active { border-color: var(--color-ink); }

/* ===== Buy box ===== */
.pdp-buybox h1 { font-size: clamp(36px, 4vw, 54px); margin: 8px 0 16px; }
.pdp-buybox h1 em { font-style: italic; color: var(--color-jungle); }
.pdp-buybox__rating { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--color-muted); margin-bottom: 20px; }
.pdp-buybox__rating .stars { color: var(--color-jungle); letter-spacing: 2px; }
.pdp-buybox .lede { margin-bottom: 28px; }

.pdp-buybox__plan { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
.pdp-buybox__plan-opt {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 16px 18px;
  border: 1px solid rgba(26, 31, 28, 0.16);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
}
.pdp-buybox__plan-opt input { accent-color: var(--color-jungle); margin-top: 4px; }
.pdp-buybox__plan-opt:has(input:checked) { border-color: var(--color-ink); background: var(--color-paper); }
.pdp-buybox__plan-opt p { font-size: 14px; margin: 0; }
.pdp-buybox__plan-opt .mono { margin-bottom: 4px; }
.pdp-buybox__plan-opt strong { font-weight: 600; }

.pdp-buybox__qty { display: flex; align-items: center; gap: 20px; margin-bottom: 18px; }
.qty-stepper { display: inline-flex; align-items: center; border: 1px solid rgba(26,31,28,0.16); border-radius: var(--radius-pill); }
.qty-stepper button { padding: 10px 16px; font-size: 16px; }
.qty-stepper input { width: 48px; text-align: center; font: inherit; border: 0; background: transparent; }

.pdp-buybox__atc { width: 100%; justify-content: center; padding: 18px; font-size: 15px; }
.pdp-buybox__note { margin-top: 10px; text-align: center; color: var(--color-muted); }

.pdp-buybox__bullets {
  list-style: none; padding: 0; margin-top: 24px;
  display: flex; flex-direction: column; gap: 10px;
  border-top: 1px solid rgba(26, 31, 28, 0.08);
  padding-top: 24px;
}
.pdp-buybox__bullets li { font-size: 14px; color: var(--color-muted); }
.pdp-buybox__bullets strong { color: var(--color-ink); font-weight: 500; }

@media (max-width: 960px) {
  .pdp-hero__grid { grid-template-columns: 1fr; }
  .pdp-gallery { position: static; }
  .pdp-buybox__plan { grid-template-columns: 1fr; }
}

/* ===== Sticky mini-ATC ===== */
.pdp-sticky {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 50;
  background: var(--color-paper);
  border-top: 1px solid rgba(26, 31, 28, 0.1);
  transform: translateY(100%);
  transition: transform var(--dur-med) var(--ease-out);
  box-shadow: 0 -12px 36px -16px rgba(26,31,28,0.12);
}
.pdp-sticky[aria-hidden="false"] { transform: none; }
.pdp-sticky__inner {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 0;
  gap: 20px;
}
.pdp-sticky__info { display: flex; align-items: center; gap: 14px; min-width: 0; }
.pdp-sticky__info img { width: 48px; height: 48px; object-fit: contain; border-radius: var(--radius-sm); background: var(--color-mist); padding: 6px; flex-shrink: 0; }
.pdp-sticky__name { font-family: var(--font-serif); font-size: 17px; line-height: 1.1; }
.pdp-sticky__price { font-size: 11px; margin-top: 4px; }
```

- [ ] **Step 3: Write `js/product.js` — above-fold behaviours**

```javascript
// ===== Gallery thumb switcher =====
(function initGallery() {
  const main = document.getElementById('galleryMain');
  const thumbs = document.querySelectorAll('.pdp-gallery__thumb');
  if (!main || !thumbs.length) return;
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      thumbs.forEach(x => x.classList.remove('is-active'));
      t.classList.add('is-active');
      main.style.opacity = '0';
      setTimeout(() => {
        main.src = t.dataset.src;
        main.style.opacity = '1';
      }, 120);
    });
  });
})();

// ===== Quantity stepper =====
(function initQty() {
  const input = document.getElementById('qtyInput');
  if (!input) return;
  document.querySelectorAll('[data-qty]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.qty === '+' ? 1 : -1;
      input.value = Math.max(1, Number(input.value || 1) + dir);
      updateAtcPrice();
    });
  });
  input.addEventListener('change', () => {
    input.value = Math.max(1, Number(input.value || 1));
    updateAtcPrice();
  });
})();

// ===== ATC price updater =====
function currentPrice() {
  const plan = document.querySelector('input[name="plan"]:checked');
  return plan && plan.value === 'sub' ? 31.44 : 36.99;
}
function updateAtcPrice() {
  const qty = Number(document.getElementById('qtyInput')?.value || 1);
  const total = (currentPrice() * qty).toFixed(2);
  const btn = document.getElementById('addToBag');
  if (btn) btn.textContent = `Add to bag · $${total}`;
}
document.querySelectorAll('input[name="plan"]').forEach(r => r.addEventListener('change', updateAtcPrice));

// ===== Add to bag (simulated) =====
(function initAtc() {
  const btn = document.getElementById('addToBag');
  const sticky = document.getElementById('stickyAtc');
  if (!btn) return;
  const add = () => {
    const qty = Number(document.getElementById('qtyInput')?.value || 1);
    window.MOA.setCartCount((window.MOA.cart.count || 0) + qty);
    window.MOA.openCart();
  };
  btn.addEventListener('click', add);
  if (sticky) sticky.addEventListener('click', add);
})();

// ===== Sticky mini-ATC visibility =====
(function initSticky() {
  const sticky = document.getElementById('pdpSticky');
  const hero = document.querySelector('.pdp-hero');
  if (!sticky || !hero) return;
  const update = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    sticky.setAttribute('aria-hidden', heroBottom > 80 ? 'true' : 'false');
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
})();
```

- [ ] **Step 4: Visually verify**

Visit `http://localhost:8080/products/miracle-foot-repair-cream.html`. Verify:
- Same announcement + nav chrome as homepage, footer too
- Breadcrumb row with "Home / Foot & Hand / Miracle Foot Repair® Cream"
- Left column (sticky on scroll): mist panel with Foot Repair jar contained; 2 thumbs below, click to swap; gallery stays sticky as you scroll the buy box area
- Right column (buy box): mono "End cracked heels in 14 days.", serif h1 with italicised jungle "Foot Repair®", 4.9★ + 1,052 reviews, lede copy, 2 radio plan tiles ("One-time $36.99" / "Subscribe & save 15% $31.44 every 60 days"), quantity stepper, jungle Add to bag button with live price, small free-shipping note, 3 trust bullets
- Click "+" on qty stepper: price updates (e.g. $73.98)
- Switch to Subscribe plan: price drops to $31.44 × qty
- Click Add to bag: cart count updates in nav to (1, or whatever qty), drawer slides in
- Scroll past the hero: sticky mini-ATC fades/slides in at bottom with product thumb + "Add to bag" button
- Sticky ATC add to bag also opens drawer
- Mobile: grid stacks, gallery is no longer sticky, plan options stack

- [ ] **Step 5: Commit**

```bash
git add native-nature/products/miracle-foot-repair-cream.html native-nature/css/product.css native-nature/js/product.js
git commit -m "Create Foot Repair PDP above-fold: gallery, buy box, subscription, sticky ATC"
```

---

## Task 5.2: PDP narrative modules — Problem + Before/After slider + Formula ingredients (modules 2–4)

**Files:**
- Modify: `native-nature/css/product.css` (append)
- Modify: `native-nature/js/product.js` (append slider logic)
- Modify: `native-nature/products/miracle-foot-repair-cream.html` (append modules)

**HTML (insert after `.pdp-hero` section closes):**

```html
<!-- Module 2: The problem -->
<section class="pdp-problem section">
  <div class="container pdp-problem__grid">
    <div class="pdp-problem__media" aria-hidden="true">
      <span class="mono">Asset: before-heel.jpg (Day 1)</span>
    </div>
    <div class="pdp-problem__copy">
      <p class="mono">The problem</p>
      <h2>It's not just <em>dry</em>.</h2>
      <p class="lede">It's the kind of cracked skin that catches on socks, aches by evening, and never seems to get better on its own. Creams soothe for an hour. The crack comes back the next morning.</p>
      <p>You've probably tried half a dozen brands. Most of them put aloe on the label and water in the bottle.</p>
    </div>
  </div>
</section>

<!-- Module 3: Before / After -->
<section class="pdp-ba section section--mist">
  <div class="container">
    <header class="section-header">
      <p class="mono">After 14 days of daily use</p>
      <h2>The <em>difference</em>.</h2>
    </header>
    <div class="ba-slider" id="baSlider">
      <img src="../assets/stills/after-heel.jpg" alt="Healed heel on day 14" class="ba-slider__after" onerror="this.style.background='linear-gradient(135deg,#D8E4D1,#8DC735)';this.removeAttribute('src');">
      <img src="../assets/stills/before-heel.jpg" alt="Dry cracked heel on day 1" class="ba-slider__before" onerror="this.style.background='linear-gradient(135deg,#6B6E63,#D8E4D1)';this.removeAttribute('src');">
      <div class="ba-slider__handle" id="baHandle" aria-hidden="true">
        <span></span>
      </div>
      <p class="ba-slider__label ba-slider__label--before mono">Day 1</p>
      <p class="ba-slider__label ba-slider__label--after mono">Day 14</p>
      <input type="range" min="0" max="100" value="50" class="ba-slider__input" id="baRange" aria-label="Before/after slider">
    </div>
    <p class="pdp-ba__caveat mono">Individual results vary. Images illustrate typical outcomes reported by verified customers.</p>
  </div>
</section>

<!-- Module 4: The formula -->
<section class="pdp-formula section">
  <div class="container">
    <header class="section-header">
      <p class="mono">Ingredient by ingredient</p>
      <h2>The <em>formula</em>.</h2>
      <p class="lede">Twelve active compounds. Four do the heavy lifting.</p>
    </header>
    <div class="pdp-formula__grid">
      <article class="ingredient-card">
        <div class="ingredient-card__img" aria-hidden="true"><span class="mono">UltraAloe® (from our proprietary process)</span></div>
        <h3>Aloe Vera <small>· UltraAloe®</small></h3>
        <p>Our 40-year proprietary-process aloe. Polysaccharides bind water, glycoproteins accelerate cell turnover.</p>
      </article>
      <article class="ingredient-card">
        <div class="ingredient-card__img" aria-hidden="true"><span class="mono">Vitamin E (tocopheryl acetate)</span></div>
        <h3>Vitamin E</h3>
        <p>A humectant antioxidant that locks moisture in place while neutralising oxidative stress on damaged skin.</p>
      </article>
      <article class="ingredient-card">
        <div class="ingredient-card__img" aria-hidden="true"><span class="mono">Allantoin</span></div>
        <h3>Allantoin</h3>
        <p>Dermatology's quiet repair agent. Softens callused, thickened skin and calms micro-inflammation.</p>
      </article>
      <article class="ingredient-card">
        <div class="ingredient-card__img" aria-hidden="true"><span class="mono">Shea butter</span></div>
        <h3>Shea Butter</h3>
        <p>Occlusive barrier — the film that keeps the good stuff in and the friction out of socks and shoes.</p>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 1: Append PDP narrative module CSS to `product.css`**

```css
/* ===== Module 2: Problem ===== */
.pdp-problem__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}
.pdp-problem__media {
  aspect-ratio: 4 / 5;
  background: linear-gradient(135deg, #6B6E63, #D8E4D1);
  border-radius: var(--radius-card);
  display: grid; place-items: center; position: relative;
  overflow: hidden;
}
.pdp-problem__media .mono { color: rgba(26,31,28,0.5); font-size: 10px; padding: 12px; position: absolute; inset: auto 12px 12px 12px; }
.pdp-problem__copy h2 { margin: 8px 0 22px; }
.pdp-problem__copy h2 em { font-style: italic; color: var(--color-jungle); }

@media (max-width: 860px) { .pdp-problem__grid { grid-template-columns: 1fr; } }

/* ===== Module 3: Before/After slider ===== */
.ba-slider {
  position: relative;
  aspect-ratio: 16 / 9;
  max-width: 960px; margin: 0 auto;
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--color-mist);
  user-select: none;
}
.ba-slider__before, .ba-slider__after {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
.ba-slider__before { z-index: 2; clip-path: inset(0 50% 0 0); transition: clip-path 80ms linear; }
.ba-slider__after { z-index: 1; }
.ba-slider__handle {
  position: absolute;
  top: 0; bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  background: var(--color-paper);
  z-index: 3;
  pointer-events: none;
}
.ba-slider__handle span {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--color-paper);
  box-shadow: 0 8px 24px rgba(26, 31, 28, 0.2);
  display: grid; place-items: center;
}
.ba-slider__handle span::before {
  content: "⇄";
  font-size: 18px;
  color: var(--color-ink);
}
.ba-slider__label { position: absolute; top: 20px; z-index: 4; color: var(--color-paper); mix-blend-mode: difference; }
.ba-slider__label--before { left: 20px; }
.ba-slider__label--after { right: 20px; }
.ba-slider__input {
  position: absolute; inset: 0;
  z-index: 5;
  opacity: 0;
  cursor: ew-resize;
  width: 100%; height: 100%;
  margin: 0;
}
.pdp-ba__caveat { text-align: center; margin-top: 24px; color: var(--color-muted); }

/* ===== Module 4: Formula ===== */
.pdp-formula__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.ingredient-card {
  background: var(--color-paper);
  border: 1px solid rgba(26, 31, 28, 0.08);
  border-radius: var(--radius-card);
  overflow: hidden;
  display: flex; flex-direction: column;
}
.ingredient-card__img {
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--color-mist) 0%, var(--color-aloe) 200%);
  display: grid; place-items: center;
  position: relative;
}
.ingredient-card__img .mono { color: rgba(26,31,28,0.6); font-size: 10px; padding: 0 16px; text-align: center; }
.ingredient-card h3 { padding: 20px 24px 10px; font-size: 22px; }
.ingredient-card h3 small { font-family: var(--font-mono); font-size: 10px; color: var(--color-muted); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 400; display: block; margin-top: 4px; }
.ingredient-card p { padding: 0 24px 24px; font-size: 14px; color: var(--color-muted); }

@media (max-width: 1060px) { .pdp-formula__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px)  { .pdp-formula__grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Append before/after slider JS to `product.js`**

```javascript
// ===== Before/after slider =====
(function initBA() {
  const slider = document.getElementById('baSlider');
  const range = document.getElementById('baRange');
  if (!slider || !range) return;
  const before = slider.querySelector('.ba-slider__before');
  const handle = document.getElementById('baHandle');
  const update = () => {
    const v = Number(range.value);
    before.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    handle.style.left = `${v}%`;
  };
  update();
  range.addEventListener('input', update);
})();
```

- [ ] **Step 3: Visually verify**

Refresh PDP. Verify:
- Module 2: paper bg, split two-up — left grey-green gradient placeholder with "Asset: before-heel.jpg (Day 1)" mono tag, right serif h2 "It's not just dry." with italicised "dry" jungle-green, lede + body copy
- Module 3: mist bg with header "After 14 days of daily use / The difference."; 16:9 slider card centred with gradient fallback for both before/after (since stills are placeholders), white vertical handle in middle with circular ⇄ knob, "Day 1" top-left, "Day 14" top-right (mono, difference blend); drag to move the split; caveat line below
- Module 4: paper bg, 4-up ingredient card grid — each with gradient placeholder + mono ingredient tag, serif h3 with mono INCI subheader, muted description
- Tablet (<1060px): formula grid → 2-up; mobile (<560px): → 1-up
- No console errors

- [ ] **Step 4: Commit**

```bash
git add native-nature/css/product.css native-nature/js/product.js native-nature/products/miracle-foot-repair-cream.html
git commit -m "Add PDP narrative modules: problem, before/after slider, formula ingredients"
```

---

## Task 5.3: PDP process moment + How-to-use + FAQ accordion (modules 5–7)

**Files:**
- Modify: `native-nature/css/product.css` (append)
- Modify: `native-nature/js/product.js` (append accordion logic)
- Modify: `native-nature/products/miracle-foot-repair-cream.html` (append modules)

**HTML:**

```html
<!-- Module 5: Why UltraAloe works -->
<section class="pdp-ultraaloe section--forest section">
  <div class="container">
    <div class="pdp-ultraaloe__grid">
      <div>
        <p class="mono">Why it actually works</p>
        <h2>Forty years of one <em>proprietary step</em>.</h2>
        <p class="lede">The active compounds in raw aloe degrade within minutes of harvest. The UltraAloe® process stabilises them before oxygen gets there — the difference between an aloe cream that does something and one that doesn't.</p>
        <a class="btn btn--pale" href="../#ultraaloe">Read the full story</a>
      </div>
      <div class="pdp-ultraaloe__media">
        <div class="pdp-ultraaloe__still" aria-hidden="true"><span class="mono">ultraaloe-process.jpg</span></div>
      </div>
    </div>
  </div>
</section>

<!-- Module 6: How to use -->
<section class="pdp-howto section">
  <div class="container">
    <header class="section-header">
      <p class="mono">The 14-day ritual</p>
      <h2>How to <em>use it</em>.</h2>
    </header>
    <ol class="pdp-howto__steps">
      <li>
        <div class="pdp-howto__img" aria-hidden="true"><span class="mono">howto-cleanse.jpg</span></div>
        <p class="mono">Step 01</p>
        <h3>Cleanse.</h3>
        <p>Warm water, mild soap, pat dry. Skin absorbs better when it's clean — obvious, but most people skip it.</p>
      </li>
      <li>
        <div class="pdp-howto__img" aria-hidden="true"><span class="mono">howto-apply.jpg</span></div>
        <p class="mono">Step 02</p>
        <h3>Apply.</h3>
        <p>Two pumps into the palm. Massage into heels, soles, and anywhere the skin feels tight. Don't be shy.</p>
      </li>
      <li>
        <div class="pdp-howto__img" aria-hidden="true"><span class="mono">howto-repeat.jpg</span></div>
        <p class="mono">Step 03</p>
        <h3>Repeat.</h3>
        <p>Every night before bed for 14 days. After that, 2–3 nights a week keeps it there. A 32oz bottle lasts ~6 months.</p>
      </li>
    </ol>
  </div>
</section>

<!-- Module 7: FAQ -->
<section class="pdp-faq section section--mist">
  <div class="container">
    <div class="pdp-faq__grid">
      <header>
        <p class="mono">The details</p>
        <h2>You asked.<br><em>Here's the full answer.</em></h2>
      </header>
      <div class="faq">
        <details class="faq__item">
          <summary>How fast does it work?</summary>
          <p>Most customers report visible softening inside 7 days, and real transformation by day 14 with nightly use. Some of the deepest cracks take longer — three weeks is not unusual for heels that have been cracked for years.</p>
        </details>
        <details class="faq__item">
          <summary>Is it greasy?</summary>
          <p>No. It's rich — that's the shea butter — but it absorbs within two minutes. You can put socks on right after. The grease that never quite absorbs in other foot creams is usually mineral oil. We don't use any.</p>
        </details>
        <details class="faq__item">
          <summary>Is it safe for diabetic skin?</summary>
          <p>Yes — it's dermatologist-reviewed and formulated for sensitive, fragile skin. No fragrance, no colourants, no stinging ingredients. Thousands of our long-time customers are diabetic.</p>
        </details>
        <details class="faq__item">
          <summary>What's UltraAloe®?</summary>
          <p>It's our 40-year proprietary process for stabilising the active compounds in aloe vera before they oxidise. Raw aloe loses most of its efficacy within hours of being cut. UltraAloe® keeps it intact.</p>
        </details>
        <details class="faq__item">
          <summary>Can I use it daily?</summary>
          <p>Nightly for the first 14 days, then 2–3 nights per week for maintenance. Daily is fine if your skin is very dry — it won't over-moisturise.</p>
        </details>
        <details class="faq__item">
          <summary>Is it vegan and cruelty-free?</summary>
          <p>Cruelty-free, yes. Vegan — this formula contains no animal-derived ingredients, so yes.</p>
        </details>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 1: Append process/howto/FAQ CSS to `product.css`**

```css
/* ===== Module 5: UltraAloe callback ===== */
.pdp-ultraaloe__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}
.pdp-ultraaloe h2 { margin: 12px 0 20px; color: var(--color-paper); }
.pdp-ultraaloe h2 em { font-style: italic; color: var(--color-aloe); }
.pdp-ultraaloe .lede { color: rgba(246,242,234,0.72); margin-bottom: 32px; }
.pdp-ultraaloe__still {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-card);
  background: linear-gradient(135deg, rgba(246,242,234,0.1), rgba(141,199,53,0.25));
  display: grid; place-items: center;
  position: relative;
  overflow: hidden;
}
.pdp-ultraaloe__still .mono { color: rgba(246,242,234,0.55); }
@media (max-width: 860px) { .pdp-ultraaloe__grid { grid-template-columns: 1fr; } }

/* ===== Module 6: How to use ===== */
.pdp-howto__steps {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  list-style: none; padding: 0;
}
.pdp-howto__steps > li { display: flex; flex-direction: column; gap: 12px; }
.pdp-howto__img {
  aspect-ratio: 4 / 3;
  background: var(--color-mist);
  border-radius: var(--radius-card);
  display: grid; place-items: center;
  position: relative;
}
.pdp-howto__img .mono { color: rgba(26,31,28,0.5); font-size: 10px; }
.pdp-howto__steps h3 { font-size: 28px; margin-top: 4px; }
.pdp-howto__steps p { font-size: 14.5px; color: var(--color-muted); }
@media (max-width: 860px) { .pdp-howto__steps { grid-template-columns: 1fr; } }

/* ===== Module 7: FAQ ===== */
.pdp-faq__grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
}
.faq__item {
  border-bottom: 1px solid rgba(26, 31, 28, 0.12);
  padding: 24px 0;
}
.faq__item summary {
  list-style: none;
  cursor: pointer;
  display: flex; justify-content: space-between; align-items: center;
  font-family: var(--font-serif);
  font-size: 22px;
  letter-spacing: -0.01em;
  transition: color var(--dur-fast) var(--ease-out);
}
.faq__item summary::-webkit-details-marker { display: none; }
.faq__item summary::after {
  content: "+";
  font-family: var(--font-sans);
  font-size: 22px; font-weight: 300;
  color: var(--color-muted);
  transition: transform var(--dur-med) var(--ease-out);
}
.faq__item[open] summary::after { content: "−"; }
.faq__item p {
  margin-top: 12px;
  font-size: 15px; color: var(--color-muted); max-width: 62ch;
}
@media (max-width: 860px) { .pdp-faq__grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Visually verify**

Refresh PDP and scroll down. Verify:
- Module 5: forest-green section, split — left serif h2 with aloe-italic "proprietary step", lede in muted cream, pale button "Read the full story" (links to homepage anchor); right gradient still placeholder
- Module 6: paper bg, 3-up how-to steps with mist placeholder images, mono step number, serif h3, sub-copy
- Module 7: mist bg, split — left header + h2 with italicised "Here's the full answer."; right accordion list of 6 FAQs. Serif summaries with `+` signs at right. Click: `+` becomes `−`, copy reveals underneath. Multiple can be open at once (native `<details>`).
- Mobile: all modules stack to single column

- [ ] **Step 3: Commit**

```bash
git add native-nature/css/product.css native-nature/products/miracle-foot-repair-cream.html
git commit -m "Add PDP modules 5-7: UltraAloe callback, how to use, FAQ accordion"
```

---

## Task 5.4: PDP review wall with tag filter + cross-sell + final CTA (modules 8–10)

**Files:**
- Modify: `native-nature/css/product.css` (append)
- Modify: `native-nature/js/product.js` (append tag filter logic)
- Modify: `native-nature/products/miracle-foot-repair-cream.html` (append modules)

**HTML:**

```html
<!-- Module 8: Review wall -->
<section class="pdp-reviews section">
  <div class="container">
    <header class="pdp-reviews__header">
      <div>
        <p class="mono">From 1,052 verified customers</p>
        <h2><em>4.9</em> average.</h2>
      </div>
      <div class="pdp-reviews__tags" role="tablist" aria-label="Filter reviews by concern">
        <button class="tag is-active" data-tag="all">All</button>
        <button class="tag" data-tag="dry">Dry heels</button>
        <button class="tag" data-tag="cracked">Cracked feet</button>
        <button class="tag" data-tag="diabetic">Diabetic skin</button>
        <button class="tag" data-tag="seasonal">Seasonal dryness</button>
      </div>
    </header>

    <div class="pdp-reviews__grid" id="reviewGrid">
      <article class="pdp-review" data-tags="dry cracked">
        <div class="pdp-review__stars">★★★★★</div>
        <blockquote>"Heels were so cracked I'd leave blood on the carpet. Two weeks of this and it's like a different pair of feet."</blockquote>
        <cite>Diane R. · <span class="mono">Verified · 8 months ago</span></cite>
      </article>
      <article class="pdp-review" data-tags="diabetic">
        <div class="pdp-review__stars">★★★★★</div>
        <blockquote>"As a diabetic my skin is delicate and nothing usually works. This is the first cream my doctor gave a thumbs up to. Truly."</blockquote>
        <cite>Paula M. · <span class="mono">Verified · 3 months ago</span></cite>
      </article>
      <article class="pdp-review" data-tags="cracked">
        <div class="pdp-review__stars">★★★★★</div>
        <blockquote>"Bought it for my dad's feet — the kind that haven't seen a lotion in 30 years. Worked on him. Bought a second bottle immediately."</blockquote>
        <cite>Martin K. · <span class="mono">Verified · 1 year ago</span></cite>
      </article>
      <article class="pdp-review" data-tags="seasonal dry">
        <div class="pdp-review__stars">★★★★★</div>
        <blockquote>"Colorado winters destroy my feet every year. This is the first thing that stops it before it starts if I use it nightly through November."</blockquote>
        <cite>Carlos E. · <span class="mono">Verified · 11 months ago</span></cite>
      </article>
      <article class="pdp-review" data-tags="dry">
        <div class="pdp-review__stars">★★★★☆</div>
        <blockquote>"Really good. Four stars instead of five because the 32oz bottle is a bit large for my bathroom shelf — a 16oz would be perfect."</blockquote>
        <cite>Joanna F. · <span class="mono">Verified · 6 months ago</span></cite>
      </article>
      <article class="pdp-review" data-tags="diabetic seasonal">
        <div class="pdp-review__stars">★★★★★</div>
        <blockquote>"I'm a nurse. I've recommended it to probably 40 patients. Nobody's complained yet."</blockquote>
        <cite>Lindsay O. · <span class="mono">Verified · 2 years ago</span></cite>
      </article>
      <article class="pdp-review" data-tags="cracked">
        <div class="pdp-review__stars">★★★★★</div>
        <blockquote>"Ranch life. My feet see a lot of dirt. This cream is the only thing that works overnight without washing off my socks by morning."</blockquote>
        <cite>Travis B. · <span class="mono">Verified · 4 months ago</span></cite>
      </article>
      <article class="pdp-review" data-tags="seasonal">
        <div class="pdp-review__stars">★★★★★</div>
        <blockquote>"Dry-heel season for me is October through March. One jar got me through the whole thing with two weeks to spare."</blockquote>
        <cite>Helen P. · <span class="mono">Verified · 10 months ago</span></cite>
      </article>
    </div>
  </div>
</section>

<!-- Module 9: Cross-sell -->
<section class="pdp-bundle section section--mist">
  <div class="container">
    <header class="section-header">
      <p class="mono">Complete the ritual</p>
      <h2>Bundle &amp; <em>save 15%</em>.</h2>
    </header>
    <div class="pdp-bundle__grid">
      <a class="bundle-card" href="#">
        <div class="bundle-card__img"><img src="../assets/products/hand-repair.png" alt="Miracle Hand Repair 32oz" loading="lazy"></div>
        <div class="bundle-card__body">
          <p class="mono">Add on</p>
          <h3>Miracle Hand Repair®</h3>
          <p>The sister cream. Same formula, made for hands that have had a long day.</p>
          <p class="bundle-card__price"><s>$36.99</s> <strong>$31.44</strong></p>
        </div>
      </a>
      <a class="bundle-card" href="#">
        <div class="bundle-card__img"><img src="../assets/products/aloe-all-over.png" alt="Aloe All Over Lotion 32oz" loading="lazy"></div>
        <div class="bundle-card__body">
          <p class="mono">Add on</p>
          <h3>Aloe All Over®</h3>
          <p>Our whole-body lotion. The one customers go back to for forty years.</p>
          <p class="bundle-card__price"><s>$36.99</s> <strong>$31.44</strong></p>
        </div>
      </a>
    </div>
  </div>
</section>

<!-- Module 10: Final CTA + guarantee -->
<section class="pdp-final section--forest section">
  <div class="container pdp-final__inner">
    <p class="mono">One last thing.</p>
    <h2>Try it for <em>30 days</em>.<br>If it doesn't work, we'll take it back.</h2>
    <p class="lede">A clean, no-questions-asked guarantee. If the cream doesn't deliver what we say it does — full refund. It's worked for forty years; it'll work for you.</p>
    <a class="btn btn--pale" href="#hero" onclick="document.getElementById('addToBag')?.click(); return false;">Add Foot Repair to bag · $36.99</a>
  </div>
</section>
</main>
```

- [ ] **Step 1: Append review/bundle/final CSS to `product.css`**

```css
/* ===== Module 8: Reviews ===== */
.pdp-reviews__header {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 24px;
  margin-bottom: clamp(32px, 5vw, 56px);
  flex-wrap: wrap;
}
.pdp-reviews__header h2 { margin-top: 12px; }
.pdp-reviews__header h2 em { font-style: italic; color: var(--color-jungle); }
.pdp-reviews__tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag {
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(26, 31, 28, 0.16);
  font-size: 13px;
  color: var(--color-muted);
  background: transparent;
  transition: all var(--dur-fast) var(--ease-out);
}
.tag:hover { border-color: var(--color-ink); color: var(--color-ink); }
.tag.is-active { background: var(--color-ink); color: var(--color-paper); border-color: var(--color-ink); }

.pdp-reviews__grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.pdp-review {
  background: var(--color-paper);
  border: 1px solid rgba(26, 31, 28, 0.08);
  border-radius: var(--radius-card);
  padding: 22px 24px;
  display: flex; flex-direction: column; gap: 12px;
  transition: opacity var(--dur-med) var(--ease-out), transform var(--dur-med) var(--ease-out);
}
.pdp-review.is-hidden { display: none; }
.pdp-review__stars { color: var(--color-jungle); font-size: 14px; letter-spacing: 2px; }
.pdp-review blockquote { font-family: var(--font-serif); font-size: 17px; line-height: 1.38; }
.pdp-review cite { font-size: 12px; color: var(--color-muted); margin-top: auto; font-style: normal; }

@media (max-width: 1060px) { .pdp-reviews__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px)  { .pdp-reviews__grid { grid-template-columns: 1fr; } }

/* ===== Module 9: Bundle ===== */
.pdp-bundle__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.bundle-card {
  display: grid; grid-template-columns: 1fr 2fr; align-items: center; gap: 24px;
  background: var(--color-paper);
  border: 1px solid rgba(26, 31, 28, 0.08);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: transform var(--dur-med) var(--ease-out);
}
.bundle-card:hover { transform: translateY(-3px); opacity: 1; }
.bundle-card__img { aspect-ratio: 1; background: var(--color-mist); display: grid; place-items: center; padding: 20px; }
.bundle-card__img img { max-width: 85%; max-height: 85%; object-fit: contain; }
.bundle-card__body { padding: 24px 28px 24px 0; display: flex; flex-direction: column; gap: 6px; }
.bundle-card__body h3 { font-size: 22px; }
.bundle-card__body p { font-size: 13.5px; color: var(--color-muted); }
.bundle-card__price { font-size: 16px; color: var(--color-ink); margin-top: 8px; }
.bundle-card__price s { color: var(--color-muted); margin-right: 6px; font-weight: 400; }
.bundle-card__price strong { color: var(--color-jungle); font-weight: 600; }

@media (max-width: 860px) { .pdp-bundle__grid { grid-template-columns: 1fr; } }

/* ===== Module 10: Final CTA ===== */
.pdp-final { text-align: center; }
.pdp-final__inner { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; align-items: center; }
.pdp-final h2 { color: var(--color-paper); font-size: clamp(36px, 4.4vw, 64px); }
.pdp-final h2 em { font-style: italic; color: var(--color-aloe); }
.pdp-final .lede { color: rgba(246,242,234,0.72); max-width: 54ch; }
```

- [ ] **Step 2: Append review tag filter to `product.js`**

```javascript
// ===== Review tag filter =====
(function initReviewTags() {
  const grid = document.getElementById('reviewGrid');
  const buttons = document.querySelectorAll('.pdp-reviews__tags .tag');
  if (!grid || !buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const t = btn.dataset.tag;
      grid.querySelectorAll('.pdp-review').forEach(r => {
        if (t === 'all') { r.classList.remove('is-hidden'); return; }
        const tags = (r.dataset.tags || '').split(/\s+/);
        r.classList.toggle('is-hidden', !tags.includes(t));
      });
    });
  });
})();
```

- [ ] **Step 3: Visually verify**

Refresh PDP. Scroll to reviews. Verify:
- Module 8: header row with mono "From 1,052 verified customers", italic serif h2 "4.9 average."; 5 tag pills on the right (All is active/ink-filled, others hollow). Click "Diabetic skin": grid filters to 2 reviews. Click "All": all 8 come back. Reviews are paper cards with jungle stars, serif quote, mono cite line.
- Module 9: mist bg, "Bundle & save 15%"; 2 bundle cards side-by-side each showing a paired product with strikethrough original price + jungle save price
- Module 10: forest section, centred — mono label, big italic-aloe serif h2 "30 days", lede guarantee copy, pale CTA that triggers the Add to Bag button behaviour
- Click the final CTA: cart count updates (+1 or current qty), drawer slides in
- Mobile: reviews → 1-col, bundle → 1-col

- [ ] **Step 4: Commit**

```bash
git add native-nature/css/product.css native-nature/js/product.js native-nature/products/miracle-foot-repair-cream.html
git commit -m "Add PDP modules 8-10: filterable review wall, bundle, final CTA with guarantee"
```

---

# Phase 6 — Polish

## Task 6.1: Responsive pass — 360/640/960/desktop on both pages

**Files:** No new files; iterate across CSS files already written.

- [ ] **Step 1: Open both pages in DevTools device mode and walk through 4 widths**

Test each width on both homepage and PDP:
- 360px (iPhone SE)
- 640px (iPhone Plus / narrow iPad)
- 960px (iPad)
- 1440px (desktop baseline)

Check for: horizontal scroll, text clipping, image overflow, nav readability, hero h1 legibility, product card wrapping, review wall, forest section text contrast, sticky ATC on PDP, cart drawer width.

- [ ] **Step 2: Add or tighten breakpoints where issues appear**

Common fixes you'll likely need:
- Hero h1 line length at 360–480px — add `@media (max-width: 520px) { .hero h1 { font-size: clamp(40px, 10vw, 64px); } }` to home.css
- PDP breadcrumb wrapping at 360px — set `flex-wrap: wrap` on `.breadcrumb` and font-size 12px below 520px
- Sticky mini-ATC cramping at 360px — stack info + button or shrink text below 420px
- Benefit marquee: serif font may be too big at 360px — scale min from `24px` to `20px`

- [ ] **Step 3: Verify cart drawer on 360px**

The drawer is `min(440px, 92vw)` — should leave a sliver on 360px. Confirm the backdrop is still tap-to-dismiss.

- [ ] **Step 4: Test landscape on phone**

Rotate iPhone SE to landscape (568×320). Verify the announcement + nav + hero don't eat the whole viewport. If they do, add `@media (max-height: 420px) { .hero { height: 220vh; } }`.

- [ ] **Step 5: Commit**

```bash
git add native-nature/css/
git commit -m "Responsive pass: tighten breakpoints for 360/520/landscape"
```

---

## Task 6.2: Accessibility pass

**Files:** Modify HTML + CSS as needed.

- [ ] **Step 1: Add focus-visible styles**

Append to `base.css`:

```css
:focus-visible {
  outline: 2px solid var(--color-jungle);
  outline-offset: 3px;
  border-radius: 4px;
}
.btn:focus-visible { outline-offset: 4px; }
```

- [ ] **Step 2: Verify keyboard nav**

Tab through homepage from top: announcement bar (skipped — aria-label only), nav logo → nav links → icons → cart → hero CTAs → pillars → spotlight → benefits → process (note: should be scrollable, not trapped) → reviews → bestsellers → brand moment → email capture → footer. Visible focus ring throughout.

Do the same on PDP. Verify tab order lands on gallery thumbs, plan radios, qty stepper, ATC, review tag filter, FAQ summary toggles.

- [ ] **Step 3: Verify screen-reader labels**

Open VoiceOver (macOS: Cmd+F5). Verify nav icons announce "Search / Account / Cart, 0 items". Verify the hero canvas is skipped by AT (it's `aria-hidden="true"`). Verify the PDP breadcrumb is announced. Verify FAQ summaries announce as disclosures.

- [ ] **Step 4: Verify contrast**

Spot-check with Chrome DevTools color picker:
- Muted text on paper: `#6B6E63` on `#F6F2EA` → should report AAA for large, at minimum AA Large for body. If AA Large fails, darken `--color-muted` to `#5A5D54`.
- Mono label in forest sections: `rgba(246,242,234,0.55)` on `#0F3B2C` → check. If fails AA, raise to `0.68`.
- Aloe-green on paper: `#8DC735` on `#F6F2EA` → decorative only; not used for text.

- [ ] **Step 5: Reduced-motion final verification**

Chrome DevTools → Rendering → Emulate CSS `prefers-reduced-motion: reduce`. Reload both pages:
- Announcement marquee stops (padding-left: gutter fallback shows)
- Benefit marquee stops
- Hero canvas displays last frame statically
- UltraAloe pinned section scrub stops; stacked mode activates
- Scroll hint stops pulsing

- [ ] **Step 6: Commit**

```bash
git add native-nature/css/
git commit -m "Accessibility pass: focus-visible ring, contrast tuning, reduced-motion verified"
```

---

## Task 6.3: Performance pass + Lighthouse audit

**Files:** HTML + image assets.

- [ ] **Step 1: Add `loading="lazy"` where missing**

Verify all `<img>` below the first viewport have `loading="lazy"`. Hero canvas exempt (uses JS-loaded frames). Product images in bestsellers and bundle should all be lazy.

- [ ] **Step 2: Add `decoding="async"` to below-fold images**

Quick find-and-replace in both HTML files: `loading="lazy"` → `loading="lazy" decoding="async"`.

- [ ] **Step 3: Add `width` + `height` attributes to all images without them**

Prevents CLS. Walk through each `<img>` tag and confirm `width="X" height="Y"` are set. Footer logos, pillar grid, spotlight, bestsellers, PDP gallery, PDP sticky, bundle cards, review photos.

- [ ] **Step 4: Preload critical assets**

Add to `<head>` of both pages (after the font links):

```html
<link rel="preload" as="image" href="assets/brand/logo.webp">
<link rel="preload" as="image" href="assets/products/foot-repair-front.png">
<link rel="preload" as="image" href="assets/frames/frame_0001.jpg">
```

(PDP version uses `../assets/...` prefixes.)

- [ ] **Step 5: Run Lighthouse on both pages (desktop preset)**

Chrome DevTools → Lighthouse → Performance, Accessibility, Best Practices, SEO → Analyze.

Targets (per spec): 90+ on Performance, 90+ on Accessibility.

Expect lowest scorer to be Performance on homepage due to 96 hero frames (~5–10MB total). If Performance < 90:
- Reduce frame count to 72 (3s × 24fps) in `home.js` and re-run Task 0.3 extraction at `fps=24` for 3s video
- Or reduce JPEG quality: `ffmpeg -i ... -q:v 4` (smaller files, still acceptable quality)

- [ ] **Step 6: Commit**

```bash
git add native-nature/
git commit -m "Performance pass: lazy/async images, CLS protections, critical preloads, Lighthouse 90+"
```

---

# Phase 7 — Handoff

## Task 7.1: Write README for asset swap-in + deployment

**Files:**
- Create: `native-nature/README.md`

- [ ] **Step 1: Write `native-nature/README.md`**

```markdown
# Miracle of Aloe — Demo Site

Sales-pitch demo for Miracle of Aloe. Rebuilt in-place over the old Native Nature scaffold.

## Run it

    cd native-nature
    python3 -m http.server 8080

Homepage: http://localhost:8080
PDP:       http://localhost:8080/products/miracle-foot-repair-cream.html

## Structure

- `index.html` — 12-section homepage (Editorial Botanical aesthetic, 2 GSAP cinematic moments)
- `products/miracle-foot-repair-cream.html` — 10-module conversion-disciplined PDP
- `css/` — `tokens.css` (design system), `base.css`, `components.css` (nav/footer/drawer/popup/buttons), `home.css`, `product.css`
- `js/` — `main.js` (shared chrome), `home.js` (GSAP cinematic moments + canvas frame scrub), `product.js` (PDP behaviours)
- `assets/` — `brand/`, `products/` (scraped from miracleofaloe.com), `stills/` (Nano Banana placeholders), `video/`, `frames/`

## Swap in generated assets

### Stills (11 images — Nano Banana Pro)

Prompts and specs are in `assets/stills/README.md`. Drop each generated file into `assets/stills/` with these filenames:

- `pillar-foot.jpg`, `pillar-body.jpg`, `pillar-face.jpg`, `pillar-supps.jpg`
- `ultraaloe-grow.jpg`, `ultraaloe-harvest.jpg`, `ultraaloe-process.jpg`, `ultraaloe-bottle.jpg`
- `before-heel.jpg`, `after-heel.jpg`
- `brand-hero.jpg`

Then update each corresponding CSS rule (search for `Asset: pillar-*` comments in `css/home.css` and `css/product.css`) to replace the gradient placeholder with `background-image: url('../assets/stills/{filename}.jpg'); background-size: cover; background-position: center;`.

### Hero video (1 video — Seedance)

Spec in `assets/video/README.md`. Drop the file as `assets/video/hero.mp4`, then from `native-nature/`:

    rm -f assets/frames/*.jpg
    ffmpeg -i assets/video/hero.mp4 -vf "fps=24,scale=1920:-2" -q:v 2 assets/frames/frame_%04d.jpg
    ls assets/frames/ | wc -l

Update `FRAME_COUNT` in `js/home.js` to match the count.

## Deploy

Drop the `native-nature/` folder at any static host (Netlify, Vercel, Cloudflare Pages). No build step required.

For Netlify: point publish dir at `native-nature/`. No build command.

## Known non-goals

- No real checkout / auth / reviews API — cart drawer and email popup are UI simulations
- No About / Ingredients / FAQ / Journal pages — nav links scroll to homepage anchors
- Schema markup is cosmetic (demo only), not validated for Shopify migration
```

- [ ] **Step 2: Final smoke test — walk both pages end-to-end**

- Scroll homepage top to bottom at 1440px desktop: all 12 sections + both cinematic moments render; cart + email popup work; footer present
- Visit PDP: hero gallery swaps on thumb click; plan toggle changes price; qty stepper updates ATC; ATC opens drawer; before/after slider drags; FAQ expands; tag filter filters; sticky ATC appears on scroll; final CTA triggers ATC
- Navigate from home hero CTA to PDP and back via footer or breadcrumb
- No console errors on either page

- [ ] **Step 3: Commit + tag**

```bash
git add native-nature/README.md
git commit -m "Add README with asset swap-in + deployment instructions"
git tag demo-v1
```

---

# Summary

**Total tasks:** 22 across 7 phases.

**Cinematic moments shipped:** 2 (canvas frame-scrub hero + UltraAloe pinned 4-step reveal).

**Asset placeholders shipped:** 11 stills marked inline with mono overlay tags; 1 hero video placeholder generated via FFmpeg and swap-ready.

**Known to swap at pitch time:**
1. Real `hero.mp4` from Seedance → `assets/video/` + frame re-extraction
2. 11 Nano Banana stills → `assets/stills/` + CSS one-liner swap per placeholder

**What ships working today without any user asset generation:**
- Every page, every section, every interaction
- The hero cinematic moment with synthetic placeholder video (white→green fade)
- All 11 gradient-fallback placeholders with mono "Asset: X" overlay tags so the demo reads as a legitimate work-in-progress even pre-generation

Ready for subagent-driven execution.
