# Next Steps

_Last updated: 2026-10-17 (redesign in preview)_. Work top to bottom; each step lists what "done" means. Architecture details are in [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md).

## Step 0: Save the work (do first, ~15 min)
- [x] Commit the frontend changes in `symmetry_react` (on branch `develop`).
- [x] `git init` in `symmetry_backend` and make the first commit (`.env` is already gitignored).
- [x] Push both repos (2026-10-18, over SSH with the server's key "Symmetry server"): frontend `develop` → github.com/lokeshpathakamuri06-prog/symmetry_react, backend `main` → github.com/lokeshpathakamuri06-prog/symmetry_backend (private).
- [ ] Open a PR from `develop` to `main` in the frontend repo.

**Done when:** both folders are in git, and nothing is committed that contains secrets.

## Step 1: HTTPS (Caddy + sslip.io)
- [x] Replace the frontend's nginx container with **Caddy**, serving `https://169-58-13-62.sslip.io`.
- [x] Caddy serves the React build at `/` and proxies `/api/*` to FastAPI.
- [x] Ports 80 and 443 serve HTTPS; 8080 now only redirects to HTTPS.

**Done when:** the site loads over HTTPS with a valid certificate, and http redirects to https.

## Step 2: FastAPI foundation (in `symmetry_backend`)
- [x] FastAPI app (`app/main.py`), settings, DB session using the existing models.
- [x] Auth: `POST /api/auth/login` (argon2 verify against `admin_users`), `logout`, `me`. httpOnly session cookie, login rate limit, CSRF.
- [x] Public read: `GET /api/public/content` (one cached JSON with ETag).
- [x] Docker: `api` service in `symmetry_backend/docker-compose.yml`, host networking (no Postgres changes needed).
- [x] Health check `GET /api/health`.

**Done when:** you can log in with `admin@symmetryinteriors.com` through the API over HTTPS, and `/api/public/content` returns the seeded data.

## Step 3: Cloudinary image pipeline
- [x] Cloudinary account and keys (cloud `pft7pzaf`, Free plan).
- [x] Signed upload preset `symmetry_signed` (formats, 3000 px cap; browser resize for the 10 MB Free-plan limit).
- [x] `POST /api/admin/media/sign` and `POST /api/admin/media/cloudinary` (verify, then save to `media_assets`).
- [x] Admin Media Library: multi-upload with progress, alt text, delete (blocked if in use).
- [x] Orphaned-upload cleanup command (`cloudinary-cleanup`); add the cron line from OPERATIONS to run it nightly.

**Done when:** the client can upload 20+ photos at once, and they appear in the Media Library with dimensions.

## Step 4: Connect the frontend to the backend
- [ ] Replace `src/services/adminDataService.js` (localStorage/Supabase) with API calls.
- [x] Admin CRUD endpoints for products, categories, collections, projects, blogs, banners, testimonials, team, jobs (D1).
- [x] Page text endpoints; inbox endpoints for inquiries, applications, orders (D2).
- [x] Public pages read `/api/public/content` instead of `src/data` (Part C). Contact details follow in Part D.
- [x] Contact, careers, checkout and newsletter forms POST to the API (D2).
- [x] Real admin login; remove the demo login (known issue 3).
- [x] Publish button: rebuild the public content cache (D1).
- [x] Remove Supabase code and `supabase_schema.sql` (D2).

**Done when:** an edit in admin, followed by Publish, shows on the public site from any device, and a form submitted on a phone appears in admin.

## Step 5: Fast images on the site
- [x] `<SmartImage>` component: Cloudinary `f_auto,q_auto`, srcset, blur placeholder, lazy loading, priority hero.
- [x] Used on all content images; `preconnect` to Cloudinary.
- [ ] Client replaces placeholder images and sample prices ([ASSETS.md](ASSETS.md)).

**Done when:** Lighthouse mobile LCP is under 2.0 s on Home, Shop and Project pages.

## Step 6: Performance and hardening
- [x] Code splitting per route, so the admin bundle is separate (Step 6a).
- [x] Self-host the Inter font; WebP banners; lazy below-the-fold images (Step 6a).
- [x] Per-page SEO head from the API: titles, descriptions, canonical, link previews, schema, sitemap, robots, image/code preloads (2026-10-18).
- [ ] Pre-render the main pages' HTML (first paint; mobile performance 90+).
- [x] Nightly backups (database + applicant files) with a monthly restore test, on this server (2026-10-18; OPERATIONS § Backups).
- [ ] Encrypted off-server copy of the backups (client chose server-only for now).
- [ ] Uptime monitoring and error logging.
- [ ] Security pass: CSRF, rate limits, headers.

## Step 7: Make the remaining fixed content editable
Inventory of what is still fixed in code: [ASSETS.md § Still in code](ASSETS.md#still-in-code-not-editable-in-admin).
- [x] **7a** Home slideshow ← Hero Banners; Home collections carousel ← Featured collections (2026-10-13).
- [~] **7b** Page banners (About, Services, Projects, Sourcing, Shop, Journal, Contact, Careers) editable: done 2026-10-14 (Admin → Page Banners, in preview, deploy pending). Still to do: the other Home carousels.
- [ ] **7c** Services, Sourcing and About sections (and Careers perks, page headings) into Page Content.

**Done when:** every photo and text block a visitor sees can be changed in the admin, except logos and the catalogue PDF.

## Step 8: Apple-style motion and smooth scrolling (frontend only)
Full plan, phases and open decisions: [MOTION_PLAN.md](MOTION_PLAN.md).
- [x] Phase 0: commit the 2026-10-14 redesign; record the Lighthouse and screenshot baseline (2026-10-17)
- [x] Phase 1: motion tokens, `reveal()`/`<Reveal>`/`<CountUp>`, lazy motion engine; 60 reveals converted (2026-10-17)
- [x] Phase 2: Lenis as the only scroll owner; native touch scrolling; modal scroll lock; Back keeps the scroll position (2026-10-17)
- [x] Phase 3: page-change fade (2026-10-17)
- [~] Phase 4: signature scroll moments: Home done; all pages got the new page hero (photo widens on scroll), sticky page bar and galleries (2026-10-17, redesign)
- [x] Phase 5: micro-interactions: header hides on scroll, flyout menu, button press, card lift, gallery buttons, cart badge (2026-10-17, redesign)
- [x] Phase 6: visual polish: new Apple-style design system on every public page (2026-10-17, redesign, in preview)
- [ ] Phase 7: performance and accessibility guardrails
- [ ] Phase 8: QA on real devices; preview; deploy

**Done when:** every public page uses the shared motion system, scrolls smoothly with mouse, trackpad and touch, respects reduced motion, and Lighthouse mobile performance is at least 90.

## Later / optional
- Buy a domain, then change the hostname in the Caddyfile.
- Razorpay online payments: code done 2026-10-17 (in preview); needs the client's Razorpay account keys + webhook, see OPERATIONS. Later: admin-managed discount codes, order-status emails/SMS, shopper order tracking.
- Move Services, Sourcing and About content into the DB so the client can edit them.
- ~~Resume file upload on Careers~~ (done 2026-10-17).
