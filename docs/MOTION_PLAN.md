# Apple-style Motion & Polish Plan (public website)

_Written: 2026-10-17. Status: **Phases 0–1 done (2026-10-17)**; decisions below approved with the recommendations. Frontend only; backend, API, database and admin are not touched._

## Goal
Make every public page feel like apple.com: calm, spacious, and smooth to scroll, with motion that is **consistent, quick and purposeful**. Animation should help the eye follow the story and stay out of the way. It must never slow down the page or make people feel sick.

## Where we start (audit, 2026-10-17)
The Apple-style **visual theme is already done** (2026-10-14, in preview, not deployed or committed; see PROJECT_STATUS). The gaps are in **motion and scrolling**:

| Area | Today | Problem |
|---|---|---|
| Smooth scroll | Lenis in `SmoothScroll.jsx` (`duration 1.1`) | Also smooths touch scrolling, which feels heavy on phones; it ignores reduced motion. |
| Scroll to top / anchors | `ScrollToTop.jsx` **and** `SmoothScroll.jsx` both handle route and hash changes | Two scroll owners fight each other (`window.scrollTo` and `scrollIntoView` against Lenis). The back button always jumps to the top. |
| Modals and drawers | Mobile menu, Search, Filter drawer, Quick view and Gallery lock `body` | Lenis keeps running underneath, and their inner lists have no `data-lenis-prevent` (only admin has it). |
| Reveal animations | 60 separate `whileInView` blocks | 21 different durations, 4 easing curves and offsets from 10 to 40 px, so pages feel slightly different from each other. |
| Reduced motion | Handled in 3 components only | Everything else still animates. |
| Page changes | Instant swap | No transition between pages. |
| Progress bar | 3 px teal-to-gold gradient with a glow | Not Apple-like; it competes with the glass header. |
| Bundle | Full `framer-motion` import everywhere | `LazyMotion` could save roughly 25 KB on first load. |
| Colours | 179 hard-coded `#hex` values remain in public pages/components | Mostly text on photos (intended); needs a check. |

## Motion principles (the rules every page follows)
1. **Only animate `transform` and `opacity`.** Never animate layout, blur or shadows on large areas.
2. **Two curves** (`src/lib/motion.js`): `ease.out = [0.16, 1, 0.3, 1]` for things entering, and `ease.apple = [0.28, 0.11, 0.32, 1]` (Apple's own) for things already on screen that move or resize. Springs are for touch feedback only.
3. **Three durations:** `fast 0.2s` (hover, press), `base 0.5s` (reveals, modals), `slow 0.9s` (hero, large images). Stagger between items: 0.06s.
4. **Short distances:** reveals move 24 px. Images scale from 1.04 to 1. Nothing flies in from the side.
5. **Each element animates once.** Reveals do not replay when you scroll back up.
6. **The first view is never hidden.** The hero headline and image are visible on first paint (needed for LCP and SEO). Motion in the hero is added on top.
7. **Reduced motion:** reveals become plain fades, with no parallax, no pinning and no smooth scrolling.

## Baseline (Phase 0, 2026-10-17)
Lighthouse mobile (simulated 4× slower CPU), production build served locally:

| Page | Perf | LCP | CLS | TBT |
|---|---|---|---|---|
| Home | 46–49 | 4.7–4.9 s | 0.00 | 1.8–2.8 s |
| Shop | 47–53 | 5.1–5.2 s | 0.00 | 1.0–1.6 s |
| Projects | 46–56 | 5.2 s | 0.00 | 0.9–1.6 s |
| ProjectDetail | 52–69 | 3.6–4.8 s | 0.00 | 0.6–1.2 s |

**What really slows the first view** (found while doing Phase 1): every file has arrived by about 1.7 s, but the main thread then spends about **4.9 s on style and layout** and has a **1.6 s rendering task** (with the CPU slowed 4×). Animation was not the bottleneck; after Phase 1, LCP is about the same. This moves to Phase 7: find which CSS and layout work is so expensive (blur effects, `transition-all`, constantly running animations, size of the Home render), and pre-render the main pages (NEXT_STEPS Step 6). **The "performance ≥ 90" target depends on that work**, not on motion.

## Phases

### Phase 0: Lock in what exists (≈0.5 day): ✅ done 2026-10-17
- Commit the 2026-10-14 redesign on `develop`.
- Baseline: Lighthouse mobile scores for Home, Shop, Projects and ProjectDetail, plus screenshots of all 14 pages (light/dark, 1440/390).

**Done when:** the redesign is committed and the baseline numbers are written in PROJECT_STATUS.

### Phase 1: Motion foundation (≈1 day): ✅ done 2026-10-17
- `src/lib/motion.js`: easing, duration and stagger tokens, plus shared variants (`fadeUp`, `fadeIn`, `scaleIn`, `imageReveal`, `stagger`).
- Matching CSS variables (`--ease-out`, `--dur-fast/base/slow`) and Tailwind names, so CSS hovers use the same timing.
- Components: `<Reveal>` (fade up once on entering the screen), `<Stagger>` (children in sequence), `<RevealImage>` (clip and scale reveal for photos), `<CountUp>` (stats).
- Wrap the site in `<MotionConfig reducedMotion="user">` and `<LazyMotion features={domAnimation}>`, and switch `motion.*` to `m.*`.
- Replace the 60 separate `whileInView` blocks with `<Reveal>` and `<Stagger>`.

**Done when:** `grep whileInView src/pages` returns nothing; there is one source of timing; reduced motion turns off movement on every page.

### Phase 2: Scrolling that feels native (≈1 day)
- **Lenis is the only scroll owner.** Remove the scroll logic from `ScrollToTop.jsx` (keep its button) and route everything through one `useScrollTo()` hook.
- **Tuning:** smooth the mouse wheel only (`lerp: 0.1`); phones and trackpads keep native scrolling, as on apple.com. Turn Lenis off for reduced motion.
- **Back and forward** restore the previous scroll position; new pages start at the top.
- **Modals:** `lenis.stop()` and `start()` in Mobile menu, Search, Filter drawer, Quick view and Gallery, with `data-lenis-prevent` on their scrolling panels.
- Anchor offset comes from the real header height instead of the fixed `-90`.
- **Progress bar:** remove it, or replace it with a 2 px solid accent line on Journal articles only (see decisions).

**Done when:** wheel, trackpad, touch, keyboard (Space, PgDn, Home) and anchor links all scroll correctly; modals never scroll the page behind them; Back returns to the same place.

### Phase 3: Page transitions (≈0.5 day)
- Route crossfade: the old page fades out in 0.15 s and the new one fades in and rises 12 px in 0.35 s (`AnimatePresence mode="wait"` keyed on the path).
- Replace the Suspense spinner with a quiet blank canvas, so lazy pages don't flash a loader.
- _Stretch:_ View Transitions API morph from a card image to the detail hero (Projects → ProjectDetail, Shop → ProductDetail), where the browser supports it.

**Done when:** every page change fades smoothly, with no flash or jump and no layout shift.

### Phase 4: Signature scroll moments, page by page (≈3–4 days)
Each page gets **one or two** "Apple moments". The rest uses plain `<Reveal>`.

| Page | Signature moment(s) |
|---|---|
| **Home** | Hero: slow 1.06→1 zoom on each slide and a line-by-line headline reveal. **Zoom-out section:** a full-bleed interior photo that shrinks into a rounded card as you scroll. **Pinned process story:** tidy `DynamicScrollShowcase` so the text changes while the image stays pinned. Stats count up. |
| **About** | Big statement text that brightens word by word as you scroll; team grid in sequence; milestones with a sticky year. |
| **Services** | Sticky left headline with a scrolling service list on the right; the 6-step process as a pinned horizontal track on desktop (vertical on phones). |
| **Projects** | Filter changes animate the grid (`layout`), so cards glide instead of jumping. Card hover: the image scales to 1.03 and the caption lifts. |
| **ProjectDetail** | Full-bleed hero with gentle parallax; gallery photos revealed with a clip mask; a large "Next project" link at the bottom. |
| **Sourcing** | Smoother coverflow (drag with momentum); country/region cards in sequence. |
| **Shop** | Animated grid on filter changes; hover swaps to the second photo; the cart badge pops when you add an item. |
| **ProductDetail** | Sticky info column beside the scrolling gallery; tap-to-zoom image; "Added to cart" confirmation. |
| **Journal / JournalDetail** | Large type header; article reading-progress line; images revealed as you read. |
| **Contact / Careers** | Accordions with smooth height; animated success tick after sending; job filter animation. |
| **Cart / Checkout / OrderSuccess** | Kept calm: items slide out when removed, the step indicator moves, and a tick draws on success. |
| **NotFound** | One calm fade-in. |

**Done when:** every page in the table has its moments, and each runs at 60 fps on a mid-range Android phone (Chrome performance trace).

### Phase 5: Micro-interactions and shared parts (≈1 day)
- **Header:** hides when you scroll down and comes back when you scroll up (see decisions); the mega-menu opens with height and fade; the active link has a sliding underline.
- **Mobile menu:** links come in one after another; it closes with a fast fade.
- **Buttons:** shrink to 0.97 when pressed; arrow icons nudge on hover.
- **Cards:** one hover style for Product, Project, Blog and Service cards (`card-apple`): lift 2 px, image 1.03, 0.5 s.
- **Modals** (Search, Quick view, Gallery): scale 0.96→1 with a fading backdrop; Esc and swipe-down close them.
- **Forms:** clear focus ring, inline error shake (reduced motion turns it off), loading state on submit.
- Floating action pill and scroll-to-top button use the same timing.

### Phase 6: Visual polish pass (≈1 day)
- **Spacing:** one vertical rhythm for sections (for example `py-24 md:py-32`) and the same container widths on every page.
- **Type:** display headings with tight tracking, body text 17 px with 1.5 line height, and no more than 3 text sizes in each section.
- **Images:** the same corner radius and aspect ratio in each grid, and no stretched photos.
- **Colour check:** review the 179 remaining hard-coded `#hex` values; anything not on a photo moves to the theme tokens, so dark mode is complete.
- Fewer borders and lines, more white space.

### Phase 7: Performance and accessibility guardrails (≈0.5 day)
- Lighthouse mobile: **performance ≥ 90; LCP < 2.0 s; CLS < 0.05** on Home, Shop, Projects and ProjectDetail. It must not get worse than the Phase 0 baseline.
- Keep first-load JS at or below today's 188 KB (LazyMotion should bring it down).
- Scroll effects use `useScroll` and `useTransform` (no `scroll` listeners that cause re-renders); `will-change` only while something is moving.
- Keyboard: focus is always visible; pinned sections can be skipped with Tab; animation never hides focusable content.
- Reduced motion tested on every page.

### Phase 8: QA and launch (≈1 day)
- Headless screenshots and short scroll recordings of all pages: light/dark, 1440/390.
- Real devices: iPhone Safari, Android Chrome, a Mac trackpad, a Windows mouse wheel.
- Publish to the `/preview/` URL for the client to review, then deploy (respect the page-banner deploy order in PROJECT_STATUS).

**Total: about 9–11 working days**, which can ship in stages: Phases 1–3 first (the whole site feels smoother at once), then Phase 4 page by page.

## Decisions to make (recommendation first)
| # | Question | Recommendation |
|---|---|---|
| 1 | Smooth scrolling on phones? | **No.** Keep native touch scrolling, as Apple does; smooth only the mouse wheel. |
| 2 | Scroll progress bar | **Remove it** site-wide; keep a thin bar on Journal articles only. |
| 3 | Header hides on scroll down? | **Yes**, on all pages except Home's transparent hero. |
| 4 | Page transitions | **Simple crossfade**; the image-morph transition only as a stretch goal. |
| 5 | Pinned scroll sections | **Desktop only**; phones get plain vertical reveals. |

## Files expected to change
`src/lib/motion.js` (new), `src/components/motion/*` (new: Reveal, Stagger, RevealImage, CountUp, PageTransition), `SmoothScroll.jsx`, `ScrollToTop.jsx`, `ScrollProgressBar.jsx`, `App.jsx`, `Header.jsx`, `MobileMenu.jsx`, `SearchModal.jsx`, `FilterDrawer.jsx`, `QuickViewModal.jsx`, `FullscreenGalleryModal.jsx`, `DynamicScrollShowcase.jsx`, `Hero.jsx`, `PageHero.jsx`, the card components, all 16 files in `src/pages/` (public), `src/index.css`, `tailwind.config.js`.
