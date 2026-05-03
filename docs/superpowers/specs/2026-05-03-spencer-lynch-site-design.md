# Spencer Lynch — "Memorable Magic" Personal Site Design Spec

**Date:** 2026-05-03
**Author:** maiaa.ai (via brainstorming session)
**Status:** Draft — pending review
**Project codename:** `spencer-lynch`

---

## Context

Spencer Lynch is a Liverpool-based close-up magician with twenty years of premium event and hospitality work behind him. His credentials wall is genuinely uncommon:

- **Official magician for Liverpool FC since 2006**
- **First-ever resident magician at Everton FC**
- The **only magician** to hold simultaneous resident positions at two Premier League clubs
- Active matchday work at Anfield and Wrexham, plus UEFA fixtures
- Brand work for Google, Marks & Spencer, Santander, Morrisons, Specsavers, Five Guys, Aon
- Financial-services hospitality for Edward Jones, Pension Insurance Corporation, GBG plc, Holloway Friendly
- Community / charity work for LFC Foundation, Liverpool DSA, Down Syndrome Liverpool, Owen McVeigh Foundation, Countess of Chester Hospital
- Press / broadcast: Sky Sports, ITV, Liverpool Echo
- Private events for Premier League legends (Carragher, Rooney — handled editorially, not as logos)

Beyond traditional close-up, he performs **technology-driven illusions** (phone-based effects, including a working trick currently embedded in his old site) and is launching a **viral street-magic content engine** across socials with international ambitions.

His current site (howdidhedothat.co.uk) is dated and undersells him by a wide margin. The new build is the digital flagship that should match the calibre of the credentials wall.

## Goals

1. **Separate him from every other UK magician.** The site itself performs — interactive magic tricks live on the homepage and as Easter eggs throughout. Visitors leave saying "wait, how did the *website* just do that to me?"
2. **Be a credibility flagship first, conversion engine second.** The dual-residency claim is the headline. Booking enquiries are the inevitable downstream effect of looking like the most respected close-up magician in the country.
3. **Act as a hub for his viral content engine.** The site is where the social-media audience lands. It captures, sells, and converts that traffic.
4. **Showcase ingenuity.** The tech-illusion side of his work gets dedicated treatment — this is a meaningful differentiator from every other "card magician with a wedding page."
5. **Match a watchmaker's craft, not a kids'-party entertainer's.** Visual ceiling is set at Theory11 / DMC / David Penn / A. Lange & Söhne. The aesthetic restraint is the point.

## Non-Goals

- **No e-commerce.** He sells himself, not products.
- **No member-only / login areas, no streaming / teaching platform.** Public-facing only.
- **No fully autonomous booking calendar with payment.** Enquiry form + WhatsApp is enough — he manages bookings personally.
- **No third-party CMS in v1.** Content is dev-driven on launch; a lightweight headless CMS is a v2 consideration.
- **No multi-language.** English only.
- **No blog / journal in v1.** Defer.
- **No newsletter capture in v1.** Could be added in a small v1.1 once the social engine is proven.
- **No carousel of staged trick photography.** Counter-references (grantmitchell.co.uk, edwardcrawford.co.uk) over-rely on stills; we are video-first.

## Locked Decisions (from brainstorming)

| Decision | Locked value |
|---|---|
| **Site primary purpose** | Credibility flagship + audience hub. Bookings are downstream. |
| **Tagline / brand line** | "Memorable Magic" (already on logo); headline copy steals "How did he do that." from existing domain |
| **Aesthetic direction** | "The Card Maker's Library" — black, cream, foiled gold. Watchmaker-grade restraint. Cinematic full-bleed video moments allowed. |
| **Animated Spencer character** | Hybrid: **B (Editorial Illustration)** as everyday host, **A (Photoreal Cinematic via Kling)** reserved for rare big trick reveals, **C (Shadow Play)** used only for the residency case-study section |
| **Showreel pattern** | David Penn pattern — autoplay, muted, looping, no native controls, hover reveals 🔊 unmute + ⤢ expand affordances. Frame is a film-slate cinema window with gold corner brackets. |
| **Showreel size** | Max ~720px wide on desktop (16:9). Source serves 1080p adaptively (Vimeo). |
| **Showreel source** | Vimeo embed `vimeo.com/214361408` ("Spencer Lynch Showreel - Memorable Magic", 2017 upload) in `background=1` chromeless mode with `dnt=1`. Local 1024×576 MP4 retained as fallback only. |
| **Three category clip tiles** | Close-Up · Tech Illusions · Big Events (David Penn pattern) |
| **Credentials structure** | Five sections — § 01 Stadium Years (typographic), § 02 Boardrooms (InfiniteSlider grayscale logo cloud), § 03 The Quiet Money (financial services), § 04 The Work That Matters (charity, gold-accent panel), § 05 As Seen On (broadcasters) |
| **Logo cloud component** | shadcn-style `InfiniteSlider` + `ProgressiveBlur` (the React component supplied during brainstorming) — grayscale logos, hover-slowdown |
| **Carragher / Rooney handling** | Editorial mention only ("performed at private events for Premier League legends"); never on a logo wall; subject to Spencer confirming permissions |
| **Testimonials pattern** | DMC carousel — branded imagery + short punchy quote |
| **Contact pattern** | Lee Smith three-option footer (CLICK TO CALL / CLICK TO EMAIL / USE ENQUIRY FORM) + WhatsApp widget; LFC residency stamp replaces Magic Circle badge as the credibility anchor |
| **Tech stack** | React / Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + framer-motion |
| **Project location** | New sibling directory at repo root: `/spencer-lynch/` (separate Node project, not a subdirectory of the existing portfolio site) |
| **"The site is the trick" feature** | At least one interactive trick on the homepage hero; "⌕ Try a Trick" nav slot opens a random hidden trick; 1-2 hidden routes unlocked by trick interactions |
| **Domain** | Decision deferred (current howdidhedothat.co.uk vs new — see Open Questions) |

## Design System

### Palette

| Role | Hex | Use |
|---|---|---|
| Ink (background) | `#070504` | Page background, base dark |
| Ink-warm | `#0A0807` | Slightly warmer black for cards / panels |
| Ink-tinted | `#1A1308` | Hero gradient inner colour, warm shadow tone |
| Cream | `#F5E6C8` | Body text on dark, hero copy, the warm "paper" colour |
| Gold | `#D4AF37` | Primary accent — section labels, hairlines, brackets, corner details, "⌕ Try a Trick" callouts |
| Gold-deep | `#7A5A18` | Secondary accent for low-energy gold moments |
| Red (logo) | `#C8102E` | Reserved for the SL flourish in the colour logo only — not used as a UI accent (avoids "vaudeville" tonal drift) |
| Cream-muted | `rgba(245,230,200,0.7)` | Secondary text on dark |

### Typography

- **Display serif:** **Playfair Display** (Google Fonts) italic 700 — used for hero copy and § headlines. Italic weight is core to the feel.
- **Body / labels:** **Inter** (Google Fonts) — neutral workhorse. Used at small letter-spaced uppercase for section labels (`font-size: 10-11px`, `letter-spacing: 0.4-0.55em`, `text-transform: uppercase`).
- **Mono detail:** **JetBrains Mono** — used sparingly on technical details (video metadata strips, trick-status indicators).

Spacing for display type: capped at ~14 words per line; italic Playfair tracks tight (`letter-spacing: -0.02em`).

### Material / Texture

- Subtle 45° diagonal pinstripe overlay at ~2-3% opacity on hero / dark sections — adds richness without being noticeable
- Gold corner brackets (1px, 14-18px arms) on framed elements (showreel, trick zone, key call-outs) — borrowed from film-slate / camera-finder vocabulary
- Gold hairlines as section dividers (linear-gradient: transparent → gold@0.3 → transparent across full width)
- No drop shadows except where used for "lifted card" trick animations
- Generous whitespace; sections breathe

### Motion principles

- **Default duration:** 600-900ms; ease curves favour `cubic-bezier(0.16, 1, 0.3, 1)` (luxe ease-out)
- **Reveal pattern:** scroll-triggered fade + 12px upward translate. No big distance moves.
- **Magic vocabulary:** card flips, deck shuffles, smoke-puff masks. Used sparingly on trick reveals; never decorative.
- **Reduced motion:** all motion respects `prefers-reduced-motion` — fades replace transforms, autoplay pauses.

## Logo System

Three variants supplied (currently JPG; vector source still pending):

| File | Use |
|---|---|
| `SL_Logo_Color_FINAL_JPG Copy.jpg` | Hero, footer, splash. Inverted on dark via `filter: invert() hue-rotate(180deg)` until inverted SVG exists. |
| `SL_Logo_BW_FINAL_JPG Copy.jpg` | Section transitions, photographic overlays where colour would clash |
| `SL_LOGO_WITHOUT_PIPS2 Copy.jpg` | Nav bar — pips don't read at small sizes |
| Extracted SL monogram (TBD) | Favicon, app icon, social-share icon, animated-Spencer avatar |

Once vector source arrives (or we re-trace), the JPG variants are replaced 1:1; placement plan does not change.

## Site Architecture

### Pages

1. **Home (`/`)** — the showcase (full architecture below)
2. **About (`/about`)** — Spencer's story, how he got here, the dual-residency narrative in long-form
3. **Showreel (`/showreel`)** — full 2:07 reel (and any longer cuts) with sound, with a card-style index of past performances
4. **Tech Illusions (`/tech-illusions`)** — dedicated showcase of the phone-driven / app-driven work; includes the live in-site trick(s)
5. **The Work (`/work`)** — case studies index; each case study at `/work/[slug]` (e.g. `/work/anfield-hospitality`, `/work/wrexham-matchday`, `/work/everton-residency`)
6. **Bookings (`/book`)** — three-option contact + WhatsApp widget + LFC stamp
7. **Hidden routes** — at least one Easter-egg page (e.g. `/the-vault`) unlocked by completing a trick. Not in nav. Discoverable only by performance.

### Homepage section architecture (12 sections)

1. **Top nav** — paper-on-dark; left: SL wordmark (no-pips); centre: The Work / Tech Illusions / Showreel / About / Book; right: **⌕ Try a Trick** pill (gold), animated SL favicon
2. **Hero** — autoplay-muted-loop showreel (~720px wide) in film-slate frame; eyebrow "— Established 2006 · Liverpool —"; headline "How did he do that." (Playfair italic, gold "that"); supporting line "The only magician to hold simultaneous resident positions at two Premier League clubs."; secondary "Liverpool · Everton · Wrexham · & the room you're in"
3. **Three category clip tiles** — Close-Up · Tech Illusions · Big Events. 9:16 aspect, dark cards with eyebrow numerals + Playfair italic title. Hover plays muted preview clip.
4. **Interactive trick zone** — pick-a-card → reveal in modal; first trick on the site, 5 seconds in. Animated Spencer (illustration style B) appears bottom-left during this section.
5. **§ 01 The Stadium Years** — typographic, eyebrow "— § 01 · The Stadium Years —", display "Twenty seasons. Two clubs. One magician.", four colour football crests (Liverpool / Everton / UEFA / Chester Racecourse, with Wrexham added if available) as outlined chips, not a marquee
6. **§ 02 Boardrooms & Brand Activations** — eyebrow + display "From global tech to the high street.", `InfiniteSlider` of grayscale corporate logos with hover-slowdown and `ProgressiveBlur` left/right edges. Each logo is a link to a case study where one exists.
7. **§ 03 The Quiet Money** — eyebrow + display "Where the suits like a card trick most.", inline list of financial-services clients separated by gold dot delimiters
8. **§ 04 The Work That Matters** — gold-accent panel (`border-left: 2px solid gold`, `background: rgba(245,230,200,0.04)`), eyebrow "— § 04 · The Work That Matters —", display "Twenty years of giving the trick away.", inline list of causes
9. **§ 05 As Seen On** — eyebrow + three Playfair-italic broadcaster names (Sky Sports · ITV · Liverpool Echo) — minimal, no logos required
10. **Testimonials carousel** — DMC pattern; 3-5 testimonials, each pairing branded imagery + short punchy quote + small-italic attribution
11. **Social viral strip** — embedded recent Instagram / TikTok clips of his street magic; horizontal scroll; "Follow @[handle]" CTA per platform
12. **Footer** — three-option contact (CLICK TO CALL / CLICK TO EMAIL / USE ENQUIRY FORM) + WhatsApp widget bottom-right + LFC residency stamp + social icons (Instagram · TikTok · LinkedIn · Facebook) + small print

## The Trick System

The differentiator. Three categories of in-site tricks:

### Hero trick (homepage, section 4)

A **pick-a-card** style trick visible above the fold. Three cards rendered. Visitor picks one, then a modal reveal sequence runs. Effect: visitor's card is "found" by Spencer in an impossible way (specific mechanism designed during implementation; should reuse a known web-magic pattern).

Acceptance: a first-time visitor sees a working magic trick within 5 seconds of page load.

### "⌕ Try a Trick" nav

A persistent nav pill that, when clicked, opens a random hidden trick in a modal. Pool of 3-5 distinct tricks at launch. Each trick is implemented as a self-contained module (`<TrickX />` component) with a shared `<TrickModal />` shell.

### Hidden routes

At least one secret route (e.g. `/the-vault`) only revealed when the visitor performs correctly during a specific trick interaction. On unlock, the URL surfaces in a "well done" reveal screen *and* is persisted to `localStorage` under a known key — once unlocked, the route stays accessible to that visitor on subsequent visits without re-performing the trick. The URL itself is also copy-able from the reveal screen for sharing.

### Trick implementation principles

- Every trick must work on mobile and desktop (touch + click)
- Every trick must respect `prefers-reduced-motion`
- Every trick must work without JavaScript fatal-fail (graceful "couldn't run trick" message)
- Every trick must be re-playable; the impossibility holds up to re-attempts
- Tricks are dev-built, not Spencer-content-managed

The actual trick mechanisms (pick-a-card variants, mind-reading frames, phone-based effects) are a design exercise during implementation. The spec commits to **N≥3 tricks at launch** with a framework that supports adding more without code surgery.

## Animated Spencer Character System

**Hybrid model.**

| Style | Source | Used for |
|---|---|---|
| **B. Editorial Illustration** | Hand-drawn line-art portrait by an illustrator, then animated by Kling | Site-wide host. Bottom-left "host" bubble on hero. Idle blink, occasional flourish. Trick intro/outro frames. Error-page presence. |
| **A. Photoreal Cinematic** | Kling image-to-video from real studio photos of Spencer | Big trick reveals only. The pick-a-card hero reveal. Maybe one moment in the showreel intro. Sparing use — earns its impact. |
| **C. Shadow Play** | Vector silhouette + light-on-card animations, possibly Kling-rendered | The Work case-study section transitions only. Stadium-mood moments. Theatre vocabulary. |

Production:

- **B** requires hiring an illustrator first; budget for 3-5 frames (idle, smile, card-fan, point, surprise) — Kling animates between them
- **A** requires a proper studio photo session with Spencer (or a single high-quality existing portrait)
- **C** can be developer-built (SVG silhouette + animated card overlays); does not strictly require Kling

**Launch fallback:** if the illustrator pipeline (B) is not delivered in time for launch, ship with **C (Shadow Play) as the everyday host** instead. C is dev-buildable and already aligned with the locked aesthetic; using it as the host until B arrives is a one-line component swap. A still ships in its reserved role regardless.

## Showreel Treatment

### Hero (homepage)

- **Source: Vimeo embed** — `https://player.vimeo.com/video/214361408?background=1&autoplay=1&loop=1&muted=1&dnt=1`
- `background=1` is Vimeo's chromeless mode: no controls, no Vimeo logo overlay, no end card, autoplay, muted, looped — exactly the cinematic ambient feel we want
- `dnt=1` suppresses Vimeo's tracking cookies (privacy posture, Lighthouse-friendly)
- Vimeo serves up to 1080p adaptively based on bandwidth — quality is significantly better than the local 1024×576 fallback
- Frame: film-slate container with gold corner brackets and gilded slate header/footer (e.g. "SL · Reel · 2026" / "Memorable Magic · 02:07")
- Max width: 720px on desktop, full-width on mobile, 16:9 aspect-ratio container
- Hover reveals 🔊 (open Vimeo with sound) and ⤢ (open Vimeo fullscreen) affordances as external links to the Vimeo page in a new tab — Vimeo's player JS isn't directly controllable from `background=1`, so local toggles aren't an option without abandoning background mode
- A static **poster image** (a single still extracted from a strong frame of the local MP4 via `ffmpeg`, written as `/spencer-lynch/public/img/showreel-poster.jpg` during build) renders behind the iframe so visitors don't see a blank black box during the brief Vimeo bootstrap. The poster is also used as the reduced-motion replacement (see below).

### Reduced motion

Vimeo's `background=1` autoplays unconditionally and ignores `prefers-reduced-motion`. To honour Success Criterion #7, when `prefers-reduced-motion: reduce` is detected client-side, the Vimeo iframe is **not rendered** — the poster image is shown in its place inside the cinema frame, with a discreet "▶ Watch on Vimeo" link beneath that opens the Vimeo page in a new tab. Same affordance, no autoplay.

### Local MP4 fallback

The local file at `assets/spencer-lynch/video/Spencer Lynch Memorable Magic Copy.mp4` (1024×576, ~27.5 MB) is retained as a fallback for: (a) Vimeo outage / network reachability issues, (b) offline preview environments, (c) if a future privacy review requires removing the third-party iframe entirely. The build copies this file to `/spencer-lynch/public/video/showreel-fallback.mp4` and uses it via a feature flag, not by default.

### Dedicated `/showreel` page

Long-form home for the reel with sound + native Vimeo controls (so visitors can scrub). Embedded with default Vimeo params (no `background=1`), maximum-quality preset, full chrome.

### Note on the source video

The reel currently on Vimeo was uploaded **2017-04-23**. None of Spencer's recent (2017+) Anfield, Wrexham, or major-brand work is featured. The site can ship with this reel as-is, but commissioning a 2026-current reel is a strong v1.x candidate. Tracked in Open Questions.

## Credentials — Five-Section Treatment

(Already detailed in homepage architecture sections § 01-05. Restated here for spec completeness.)

| Section | Treatment | Names |
|---|---|---|
| § 01 Stadium Years | Typographic, four colour crests | Liverpool FC, Everton FC, UEFA, Chester Racecourse (+ Wrexham AFC if logo available) |
| § 02 Boardrooms | Grayscale InfiniteSlider with progressive-blur edges | Google, Marks & Spencer, Santander, Morrisons, Specsavers, Five Guys, Aon, NEC, Chester Zoo, Worldwide Hospitality |
| § 03 The Quiet Money | Inline list with gold dot separators | Edward Jones, Pension Insurance Corporation, GBG plc, Holloway Friendly |
| § 04 The Work That Matters | Gold-accent panel, inline list | LFC Foundation, Liverpool Disabled Supporters Association, Owen McVeigh Foundation, Down Syndrome Liverpool, Countess of Chester Hospital, Wirral Met College |
| § 05 As Seen On | Three Playfair italic broadcaster names | Sky Sports, ITV, Liverpool Echo |

Carragher and Rooney never appear in these sections; they are a single editorial line on the About page (subject to permissions confirmation).

## Contact / Booking

Single-page `/book` and replicated in homepage footer. Three options + WhatsApp:

1. **CLICK TO CALL** — `tel:` link, Spencer's number
2. **CLICK TO EMAIL** — `mailto:` link
3. **USE ENQUIRY FORM** — modal or `/book#enquiry` with fields: name, email, event date, event type (Wedding / Corporate / Hospitality / Private / Other), location, brief message
4. **WhatsApp widget** — bottom-right floating button on every page, opens WA chat with Spencer's number

Trust signals adjacent: **LFC residency stamp** (custom badge — "Resident Magician · Liverpool FC · Since 2006") and Spencer's full company / VAT registration in small print.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) 15+ |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui (initialized in `/components/ui`) |
| Animation | framer-motion (+ `motion` runtime as required by ProgressiveBlur) |
| Slider deps | `react-use-measure` (used by InfiniteSlider) |
| Fonts | Google Fonts via `next/font` — Playfair Display, Inter, JetBrains Mono |
| Video | Vimeo iframe embed (`background=1` mode) for the hero showreel + the `/showreel` page; native HTML5 `<video>` for category clips and the local MP4 fallback |
| Forms | shadcn `Form` + react-hook-form + zod validation; submission to a serverless `/api/enquiry` POST that emails Spencer |
| Hosting | Vercel (recommended; supports Next.js App Router and serverless API routes natively) |
| Analytics | Vercel Analytics or Plausible (privacy-respecting); deferred to v1.1 if not blocking |

Component sourcing: `LogoCloud`, `InfiniteSlider`, `ProgressiveBlur` come in via the user-provided shadcn-style copy-paste; not from npm.

## Project Structure

```
/spencer-lynch/                       # NEW sibling directory at repo root
├── app/
│   ├── (marketing)/                  # public pages
│   │   ├── page.tsx                  # homepage
│   │   ├── about/page.tsx
│   │   ├── showreel/page.tsx
│   │   ├── tech-illusions/page.tsx
│   │   ├── work/page.tsx
│   │   ├── work/[slug]/page.tsx
│   │   └── book/page.tsx
│   ├── (hidden)/                     # Easter-egg routes
│   │   └── the-vault/page.tsx
│   └── api/
│       └── enquiry/route.ts
├── components/
│   ├── ui/                           # shadcn primitives + InfiniteSlider, ProgressiveBlur, LogoCloud
│   ├── tricks/                       # one component per trick + shared TrickModal
│   ├── showreel/
│   ├── credentials/                  # § 01-05
│   ├── animated-spencer/             # the host character system
│   └── nav/
├── public/
│   ├── video/                        # showreel + clip cuts
│   ├── img/                          # photos, posters
│   ├── logos/                        # client logos (svg/png)
│   └── brand/                        # SL logo variants
├── lib/
└── styles/
```

Raw assets live at `/Users/admin/Desktop/3D website/assets/spencer-lynch/` during the brainstorm phase; production assets get copied/optimized into `/spencer-lynch/public/` during the build.

## Asset Inventory

### Delivered

| Asset | Path / URL | Notes |
|---|---|---|
| Showreel (primary, 1080p) | `https://vimeo.com/214361408` | "Spencer Lynch Showreel - Memorable Magic" — 2:07, uploaded 2017-04-23, embedded via `background=1` |
| Showreel (local fallback) | `assets/spencer-lynch/video/Spencer Lynch Memorable Magic Copy.mp4` | 1024×576, 25fps, 2:07, ~27.5 MB — same content, lower res; kept as offline / failover only |
| Logo (colour) | `assets/spencer-lynch/logo/SL_Logo_Color_FINAL_JPG Copy.jpg` | JPG; vector source pending |
| Logo (B/W) | `assets/spencer-lynch/logo/SL_Logo_BW_FINAL_JPG Copy.jpg` | JPG; vector source pending |
| Logo (no pips) | `assets/spencer-lynch/logo/SL_LOGO_WITHOUT_PIPS2 Copy.jpg` | JPG; vector source pending |

### Required from Spencer

| Asset | Priority | Notes |
|---|---|---|
| Confirm Vimeo background-mode loop is seamless | High (verify during build) | Vimeo's `background=1` typically loops cleanly server-side. If the loop point on the 2017 reel feels jarring, fall back to a 20-30s hero loop cut hosted as a separate Vimeo upload |
| 2026-current showreel | Medium | Existing reel is from 2017; commission a refresh that includes recent Anfield / Wrexham / major-brand work. Could ship post-launch — see Open Questions |
| Vector logo source (AI/EPS/SVG) | High | If unavailable, dev re-trace during build |
| Studio portrait for animated Spencer A | Medium | High-quality, well-lit, 3:4 portrait — feeds Kling for photoreal clips |
| Performance photos | Medium | Anfield, Wrexham, weddings, corporate; ideally with strong reaction faces |
| Three category clips | Medium | Short loops for the homepage tile grid (Close-Up / Tech / Big Events) |
| Social handles | Low | Instagram, TikTok, LinkedIn, Facebook — for footer + viral strip |
| Phone number, email, company/VAT details | High (before launch) | For contact section + footer legal |

### Required from third-party

| Asset | Source plan |
|---|---|
| Football crests | Brand portals where available; otherwise re-create in SVG (acceptable given Spencer's resident status) |
| Corporate client logos | svgl.app where listed (Google), brand-asset pages where public, otherwise re-trace from public sources |
| Charity logos | Each charity's website / brand kit |
| Illustrator-drawn Spencer (style B) | Commission a freelance illustrator; brief includes 3-5 expression frames |

## Open Questions

These need answers before or during early implementation; they do not block writing the implementation plan but they may shape it:

1. **Domain.** Keep `howdidhedothat.co.uk`? Buy `memorablemagic.com`? Buy `spencerlynchmagic.com`? Recommend keeping the existing domain (it's already a great line, has SEO equity, and it's *in* the headline copy) and adding a new vanity redirect.
2. **Carragher / Rooney editorial line.** Confirm with Spencer that displaying the wording "performed at private events for Premier League legends" is permitted. Without confirmation, omit entirely.
3. **Sky Sports / ITV nature.** Were these on-screen appearances (warrants embedded clips on `/about`) or press mentions (warrants pull-quotes)?
4. **Booking calendar.** Day-one is enquiry-form-only. v1.1 candidate: Calendly or similar to qualify availability before he replies. Defer.
5. **Newsletter / audience capture.** Worth adding a single email-capture moment once social engine is producing? Defer to v1.1.
6. **Number of tricks at launch.** Spec commits to N≥3. Decide whether to budget for 3 (lean) or 5 (impressive). Recommend 3 at launch with framework supporting more.
7. **Deployment / domain handover.** Who owns the Vercel account and DNS? Spencer or maiaa.ai?
8. **2026 showreel refresh.** Existing 2017 reel ships v1; commission a new reel covering recent work (Anfield post-2017, Wrexham, big-brand activations) for a v1.1 swap-in. Timing decision: pre-launch or post-launch?
9. **Vimeo account upgrade.** Spencer's Vimeo is "basic" — no direct MP4 download from Vimeo, limited analytics. If we want self-hosted MP4 control going forward, or richer playback data, recommend a Plus/Pro upgrade. Not strictly required for v1: `background=1` works on basic accounts, and the existing local 1024×576 MP4 is the canonical fallback regardless of Vimeo plan.

## Phasing

The v1 launch covers the entire homepage + supporting pages + N≥3 tricks. Out-of-scope items above are explicit v1.1 candidates.

## Success Criteria

The site is ready to ship when:

1. A first-time visitor experiences a working magic trick within 5 seconds of page load
2. The dual-residency credential is the dominant headline message above the fold
3. The five credentials sections each render with their distinct visual treatment
4. The showreel autoplays (muted, looped) without controls, with hover-revealed unmute + expand affordances (linking to the Vimeo page in a new tab)
5. At least three working in-site tricks exist, with at least one hidden Easter-egg route
6. The site passes Lighthouse performance ≥ 90, accessibility ≥ 95
7. All motion respects `prefers-reduced-motion`
8. Mobile parity: every interaction (including tricks) works on touch
9. The contact form delivers an enquiry to Spencer's email reliably
10. Animated Spencer (style B) appears as host on the homepage and at least one secondary page
