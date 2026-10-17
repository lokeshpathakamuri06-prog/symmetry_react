# Decision Log

Newest first. Each entry records what was decided, and why. If a decision changes, add a new entry rather than editing the old one.

| Date | Decision | Why | Alternatives considered |
|---|---|---|---|
| 2026-10-17 | Careers resumes and portfolios are uploaded to **our own backend** and stored on the server (Docker volume `application_files`), downloadable only by signed-in admins | Personal data must not be public; no third party needs access; Cloudinary would need a public signing endpoint and serves files from a CDN | Cloudinary private uploads; links to Google Drive only (the old form) |
| 2026-10-17 | File type decided from the file's first bytes (PDF / OLE .doc / ZIP with `word/document.xml`), random stored names, owner-only permissions, size caps 5 MB / 15 MB | A renamed HTML or executable file is rejected; nothing guessable on disk | Trust the file extension or the browser's content type |
| 2026-10-17 | New endpoint `/public/career-applications` (multipart) next to the old JSON one | The live site keeps working until the new frontend is deployed | Change the old endpoint |
| 2026-10-17 | Careers email and HR phone are **new, empty** Page Content fields; the page shows them only when filled in | No confirmed careers address or HR number exists; nothing invented | Show `concierge@` / the main phone; a visible placeholder |
| 2026-10-17 | Team Voices uses the supplied sample quotes, visibly labelled as samples | Requested; they are not real employee statements yet | Hide the section until real quotes arrive |
| 2026-10-17 | Applications are saved in the inbox; no email notification yet | The backend has no email service; sending email needs an SMTP or email provider account | Add an email provider now |
| 2026-10-17 | Scroll-linked values use `useScrollRange()` (ranges padded to 0–1), not bare `useTransform` | Framer Motion runs simple ranges on the browser's native scroll timeline, where a range ending before 1 drifts back to the base value (a fade-in faded out again) | Keep a spring on the progress (adds lag on top of Lenis) |
| 2026-10-17 | Home hero headline is not split into animated lines | It is the page's LCP element and must paint immediately (Phase 1 rule) | Line-by-line reveal from the plan |
| 2026-10-17 | Page transitions are enter-only (fade + 12 px rise, ~0.35 s), not a crossfade with an exit | An exit fade keeps the old page visible while the scroll moves to the new position, and makes Back slower | `AnimatePresence mode="wait"` crossfade; View Transitions API (stretch, not done) |
| 2026-10-17 | All scrolling and scroll locks go through `src/lib/scroll.js` (`scrollToTarget`, `useScrollLock`); `SmoothScroll` owns page-change scrolling | Two scroll owners fought each other; 10 popups either let the page scroll behind them or set `body.overflow` on their own | Fix each component separately |
| 2026-10-17 | Scroll positions saved per history entry (sessionStorage), restored on Back/Forward and on reload | Apple-like: Back returns you where you were; before, every Back jumped to the top | React Router `ScrollRestoration` (needs a data router: larger change) |
| 2026-10-17 | `scroll-smooth` removed from `<html>` | It made native scrolling smooth even with reduced motion; Lenis or `scrollToTarget` handle smoothness now | Keep it |
| 2026-10-17 | Motion tokens in `src/lib/motion.js`; scroll reveals use `{...reveal()}` / `enter()` | 60 reveals had 21 durations and 4 curves; one place now sets every speed | Keep per-component values; a `<Reveal>` wrapper everywhere (it is available for new code) |
| 2026-10-17 | Two curves, not one: `ease.out` for things entering, `ease.apple` (Apple's own) for things already on screen | Entering needs a long soft landing; menus and accordions read better with Apple's curve | One curve for everything (the plan's first idea) |
| 2026-10-17 | `LazyMotion` (strict) with `domMax` loaded after first paint; no forced `motion` chunk in `vite.config.js` | First-load JS 175 → 158 KB gzip; `strict` fails loudly if a heavy `motion.*` component comes back | Keep full `motion` components |
| 2026-10-17 | Page headlines and the first hero photo are never animated in | They are what the browser measures as "loaded" (LCP) and must show on first paint | Fade everything in |
| 2026-10-17 | Motion plan decisions: native touch scrolling, progress bar removed (Journal articles only), header hides on scroll down, crossfade page transitions, pinned sections desktop-only | Approved by the client ("go") with the recommendations in MOTION_PLAN.md | See MOTION_PLAN.md § Decisions |
| 2026-10-14 | Page banners reuse the existing `banners` table: the page key goes in `badge`, the highlighted words in `cta_text` | Requested with "no backend/API/database changes"; the fields existed and were unused | Migration adding a `placement` column (cleaner; can still be done later) |
| 2026-10-14 | Intro plays once per browser session, ~1.5 s, never with reduced motion | It delayed every page load by ~3 s (known issue 14) | Remove it; keep it on every load |
| 2026-10-14 | Wording simplified only in code text; database content (products, projects, journal, Page Content) left to the client | Keeps the database untouched as requested | Rewrite database content too |
| 2026-10-14 | Website redesign: **Apple-style design system** (warm gallery white / near-black, brand teal and sand-gold accents, Inter, pill buttons, glass navigation) | Requested: modern interior-design site with an Apple feel and the same theme on every page | Keep each page's own look |
| 2026-10-14 | Colours come from **theme tokens** (`bg-canvas`, `text-fg`, `text-accent`…, values in `src/index.css`) instead of hard-coded hex pairs | One place changes the palette and dark mode for every page; about 1,500 hex classes converted by script | Keep `bg-[#F4F7F6] dark:bg-[#07121C]` pairs |
| 2026-10-14 | One shared **`PageHero`** for all inner pages: headline on a plain background, then a large rounded photo | Text on busy photos was hard to read; every page now opens the same way | Full-screen photo with text overlay on each page |
| 2026-10-14 | Desktop menu from **1280 px** (was 1440), sentence-case labels; header button = "Book a consultation" | Shorter labels fit; the old "Sign in" button linked to Contact | Keep the capitals menu at ≥1440 px |
| 2026-10-13 | Hero Banners = slideshow **photos only**; the headline stays in Page Content | The design has one headline over all photos; no visible change | Per-slide headline and button |
| 2026-10-13 | Home collections carousel = **Featured** collections with a cover image; new `label` and `link` columns | Reuses the existing Collections screen; links can point anywhere (category, search) | A separate "Home cards" screen |
| 2026-10-13 | Slideshow falls back to the 3 local photos; the carousel hides when empty | The top of Home is never blank; an empty carousel looks broken | Hide the slideshow too |
| 2026-10-11 | Home ships in the main bundle; every other page (and all admin) loads on demand | Fastest first paint for the most common landing page; visitors never download admin code | Lazy-load Home too |
| 2026-10-11 | Prefetch other public pages only after the first interaction (or 6 s) | `import()` also runs the code, which competed with the first page's rendering in tests | Prefetch on idle right after load |
| 2026-10-11 | Group react, framer-motion and lucide into 3 shared files | Otherwise lucide splits into one file per icon (370 requests) | Default splitting |
| 2026-10-11 | Static banners: WebP copies made by a script and committed (not Cloudinary) | Design images stay with the site; no extra service or credits; JPEG fallback | Upload banners to Cloudinary |
| 2026-10-11 | Self-host Inter (variable font) | Removes 2 third-party connections before text can render | Google Fonts |
| 2026-10-10 | Resize large photos **in the browser** (≤3000 px, JPEG 0.9) before upload | Free plan caps uploads at 10 MB / 25 MP; 3000 px is more than any screen needs | Paid plan; reject large files |
| 2026-10-10 | No eager transformations in the preset | Cloudinary strips `f_auto` from eager versions, so they'd never match website URLs and would only cost credits | Pre-build 400/800/1600 |
| 2026-10-10 | Imported photos convert the existing media record **in place** | Every product, category and project link keeps working with no relinking | Create new records and relink |
| 2026-10-10 | `SmartImage` only for content images (from the database) | Static design art is fixed and local; content is what the client changes | Convert every `<img>` |
| 2026-10-10 | Our own Cloudinary URLs resolve to the existing record by `public_id` | Re-saving content must never create duplicate image records | Treat every URL as external |
| 2026-10-10 | Orders are re-priced on the server; card and UPI details are never accepted | Prices can't be tampered with in the browser; no payment data to protect yet | Trust cart prices |
| 2026-10-10 | Page text rebuilt to exactly the texts the pages show, plus a shared `company` section for contact details | Every field in the editor visibly changes the site; one place to change a phone number | Keep the old ~52-field editor |
| 2026-10-10 | Forms: honeypot + 5 per 10 min per IP; a bot gets a fake success | Stops casual spam without a CAPTCHA; bots get no signal | CAPTCHA |
| 2026-10-10 | The admin session is checked only on admin pages | Public visitors make no auth requests | Check on every page load |
| 2026-10-10 | Inbox deletes are permanent (content uses Archive) | Privacy requests need real deletion | Archive inbox items too |
| 2026-10-10 | **Save, then Publish**: saves go to the DB; the site changes on Publish | Batch and review changes before they go live | Live on every save |
| 2026-10-10 | **Delete = Archive**, Restore returns an item as a draft | Protects against accidental deletes; restored items never go live by surprise | Permanent delete |
| 2026-10-10 | Admin API reads and writes the same record shapes as the public snapshot | One mapping, tested both ways (exact match + lossless re-save) | Separate admin data model |
| 2026-10-10 | One generic `ResourceManager` + field schemas for all content screens | Consistent UX; each screen is a short config | Hand-written screen per resource |
| 2026-10-10 | Optimistic concurrency via `updatedAt` (409 on conflict) | Two admins can't silently overwrite each other | Last write wins |
| 2026-10-10 | Images are URL-based until Part E (a URL creates or reuses a media asset) | Works now; Cloudinary upload slots into the same library | Wait for Cloudinary |
| 2026-10-10 | Public content: `Cache-Control: no-cache` + ETag (304) | A publish must be visible on the next page load; a 304 costs ~30 ms and no body | `max-age=60, stale-while-revalidate=300` (up to 6 min stale) |
| 2026-10-10 | Snapshot records keep the original frontend shapes | Pages switched data source with no field changes; verified by an exact-match test | Redesign the page data model now |
| 2026-10-10 | If the API is down: skeleton, then a Retry state; no bundled fallback | Never show stale sample products or prices as if real | Fall back to bundled sample data |
| 2026-10-10 | One `/api/public/content` payload, no per-item endpoints | ~31 KB compressed covers the whole site; simpler caching | Per-page or per-item endpoints |
| 2026-10-10 | Contact details move to the DB in Part D, with the Page Content editor | Do it once, when the admin can actually edit them | Move them in Part C |
| 2026-10-10 | Admin sessions: **2 h idle, 12 h max** | Balance for a shared office computer | 7-day sliding; 8 h fixed |
| 2026-10-10 | `__Host-` session cookie + Origin allow-list + per-session CSRF header | Defence in depth on top of SameSite=Strict; the token is never in localStorage | JWT in localStorage; cookie only |
| 2026-10-10 | Tests run against a separate `symmetry_test` database | Tests can wipe tables freely; they never touch real data | Mocks; transactions on the real DB |
| 2026-10-10 | `adminDataService` kept for content until Parts C/D; auth moved first | Smallest safe step: fixes who can log in without touching data flows | Move everything at once |
| 2026-10-10 | Frontend work goes on branch `develop`; `main` only via PR | Keep `main` deployable; review before merging | Commit straight to `main` |
| 2026-10-10 | API JSON is **camelCase** (`CamelModel`), the DB is snake_case | Pages already read camelCase (`images`, `inStock`…), so wiring needs minimal page changes | Change every page to snake_case |
| 2026-10-10 | **Caddy** replaces nginx; it lives in the frontend repo and serves the build + proxies `/api` | Automatic HTTPS and renewal, one config file | nginx + certbot |
| 2026-10-10 | Containers use **host networking**; API bound to `127.0.0.1:8000` | Reach the host's Postgres on localhost with no config changes; nothing new exposed | Docker bridge + Postgres listen/pg_hba changes |
| 2026-10-10 | Migrations run manually (`alembic upgrade head`), not on container start | Explicit, reviewable schema changes; no surprises on restart | Auto-migrate in the container entrypoint |
| 2026-10-10 | Database categories are the single source of category names and slugs; frontend links use the same slugs and names | Requested: "both sides same"; avoids broken filter links | Keep separate marketing labels |
| 2026-10-10 | Server-side admin sessions (`admin_sessions`, token hashed) + DB-backed login rate limiting (`login_attempts`) | Sessions can be revoked instantly; rate limits work across multiple API workers | JWT cookies; in-memory rate limit |
| 2026-10-10 | Backend in its own folder `/root/dev/symmetry_backend` | Requested; keeps frontend and backend deployable separately | `backend/` inside the frontend repo |
| 2026-10-10 | Marketing content (Services, Sourcing, About extras) stays in frontend code for now | Admin doesn't manage it today; keeps the first schema focused | Move it into the DB now |
| 2026-10-10 | UUID primary keys, plus `slug` / `sku` | Safe to expose, mergeable, readable URLs; `sym-001` kept as SKU | Keep text IDs |
| 2026-10-10 | Shop = catalogue + **order requests**, no payments | No payment gateway yet; follow-ups done by the team | Full e-commerce now; no prices |
| 2026-10-10 | Seed the DB from the current sample content | Site looks identical after switching to the DB; client replaces items | Empty DB |
| 2026-10-10 | Alembic migrations; two DB roles (owner / app) | Versioned, repeatable schema; the app cannot alter the schema | Plain SQL files; single role |
| 2026-10-10 | Use the server's existing PostgreSQL 16 | Already installed and running | Postgres in Docker |
| 2026-10-10 | HTTPS via **Caddy + `169-58-13-62.sslip.io`** until a domain exists | Browsers block HTTPS→HTTP API calls; passwords must not travel over HTTP | Netlify subdomain + separate API host |
| 2026-10-10 | **FastAPI + PostgreSQL** backend instead of Supabase | Full control; one backend to maintain | Supabase (already in the code) |
| 2026-10-10 | **Cloudinary** for image storage, resizing and CDN | Global CDN, automatic AVIF/WebP, no image worker to build | Cloudflare R2 + own `sharp` worker |
| 2026-10-07 | Careers jobs managed from admin; applications stored for admin review | Requested; the client manages hiring themselves | Jobs hard-coded; email-only applications |
| 2026-10-07 | Admin theme: Apple-style light + dark, sharing the site's toggle | Requested; matches the website's two themes | Light only; dark only |
| 2026-10-07 | Full header menu only at ≥1440 px | Menu overflowed at 1024–1366 px even before Careers | Shorter labels; smaller text |
| 2026-10-07 | Docker (nginx) for hosting on the VPS | Fastest way to get the site live | Netlify (config exists in repo) |
