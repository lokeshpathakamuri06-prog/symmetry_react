# Project Status

_Last updated: 2026-10-18 (admin end-to-end check, permanent delete); 2026-10-17 (Careers page rebuild with file uploads; Motion plan Phases 0–3, Phase 4 Home)_

## Summary
| Area | State |
|---|---|
| Public website | ✅ All content and page text from PostgreSQL; forms save to the database |
| Admin portal UI | ✅ Built; Apple-style light/dark theme; **real server-side login** (content still in browser storage until Parts C/D) |
| Careers (site + admin) | ✅ Jobs and applications in the database |
| Hosting | ✅ Caddy (frontend repo) + FastAPI (backend repo), Docker host networking |
| System design | ✅ Written ([SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)) |
| PostgreSQL database | ✅ 23 tables, migrations 0001–0002, seed, first admin user |
| FastAPI backend | ✅ Live on migration 0007: content, forms, orders, deliveries, invoices, inventory, payments (2026-10-18) |
| Cloudinary image pipeline | ✅ Uploads from admin, CDN delivery with responsive sizes; 158 client photos imported |
| Frontend connected to backend | ✅ Everything uses the API. Browser storage now holds only cart, wishlist, theme and the last order confirmation |
| HTTPS | ✅ https://169-58-13-62.sslip.io (Let's Encrypt, auto-renewing) |

## Work log

### 2026-10-07: Review and first deployment
- Reviewed the codebase: React 19 + Vite 8 + Tailwind SPA, with an admin CMS on `localStorage` and an optional Supabase.
- Added Docker hosting to the frontend repo:
  - `Dockerfile`: Node build, then nginx.
  - `nginx.conf`: SPA fallback and asset caching.
  - `docker-compose.yml`: port 8080.
  - `.dockerignore`.
- Installed Docker on the server. The site is live at http://169.58.13.62:8080.

### 2026-10-07: Admin redesign and Careers
- **Admin theme:** Apple-style look with **light and dark modes**, using the website's toggle.
  - All colours come from theme tokens (`--adm-*` in `src/index.css`, `adm` colours in `tailwind.config.js`).
  - All 15 admin pages were converted.
  - New sidebar with the logo, a frosted-glass header and a redesigned login page.
- **Careers page** `/careers`: hero, "Why Symmetry", department filters, expandable job cards and an application form.
- **Admin screens:**
  - **Job Openings:** create, edit, open/close, delete.
  - **Applications:** status pipeline, notes, and a badge counting new applications.
- **Careers links** in the header, mobile menu, footer and an About page call-to-action.
- **Fixes along the way:**
  - The header menu overflowed at 1024–1366 px wide (it already did before Careers was added). The full menu now shows from 1440 px; smaller screens use the menu button.
  - The site's intro animation no longer plays on admin pages.
- Verified with headless-browser screenshots in both themes, plus an end-to-end apply flow.

### 2026-10-10: Backend design
- Wrote [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md): FastAPI + PostgreSQL + Cloudinary, Caddy with HTTPS via sslip.io (no domain needed), the image pipeline, API, security, deployment and cost.

### 2026-10-10: Database built (`/root/dev/symmetry_backend`)
- **Database:** `symmetry` on the server's existing PostgreSQL 16, with two roles:
  - `symmetry_owner` runs migrations.
  - `symmetry_app` is the runtime role; it has data access only and cannot create or drop tables.
- **Schema:** 21 tables (see SYSTEM_DESIGN §6), SQLAlchemy 2 models and Alembic migration `0001_initial_schema`.
- **Seed:** imports the website's current sample content.
  - 20 products, 12 categories, 16 collections, 12 projects, 16 journal posts, 3 testimonials, 6 team members, 4 jobs, 2 banners, 6 pages of text.
  - 116 image records (current placeholder URLs).
  - Idempotent: safe to re-run.
- **First owner admin:** `admin@symmetryinteriors.com`. The password was shown once and is not stored anywhere readable.
- **Frontend refactor:** default banners, collections and page copy moved to `src/data/siteDefaults.js`, so the seed can read them. Behaviour is unchanged.
- **Verified:**
  - The migration round-trips cleanly and there is no drift between models and database.
  - Constraints reject bad data.
  - Role permissions work as intended.
  - The seed is idempotent.
  - The site still builds.

### 2026-10-10: Schema audit and migration 0002
- **Audit:** compared the DB against every field the frontend uses and against the system design. All displayed content had a column, but 3 pieces needed for FastAPI were missing.
- **Migration `0002_sessions_and_search_columns`** (additive only, round-trip tested):
  - New tables `admin_sessions` and `login_attempts`.
  - `publish_events.payload` (stored public-site snapshot).
  - Media: `original_filename` (trigram search), `tags` and `resource_type`.
  - Orders: `customer_name`, `customer_email` and `customer_phone` as real columns.
  - `projects.duration`; SEO fields on products, projects and blogs.
  - `testimonials.project_id`; `source_page` and `ip` on inquiries and applications.
  - `newsletter_subscribers.unsubscribed_at`.
- **Seed:**
  - All 116 images have a filename (searching "LC0001" finds them).
  - 3 projects have a duration taken from their stats.
  - All 3 testimonials are linked to their projects.
- **Database password:** set to the requested password for both DB roles (stored in `symmetry_backend/.env`).
- **Category links fixed:** the footer, home showcase and the unused FlippingCollections component used non-existent slugs (`living`, `dining`…). They now use the database category slugs, and the footer labels use the database category names. Browser-tested: all 22 category links on the home page show products.

### 2026-10-10: Groundwork (Part A)
- **Git:**
  - Frontend committed on a new `develop` branch (`683f1b4`).
  - Backend initialised as its own repo, first commit `bf2dbb4`.
  - Nothing pushed; no secrets committed.
- **FastAPI skeleton** (`symmetry_backend/app/main.py`):
  - Routes under `/api`.
  - `GET /api/health` reports DB status and migration version, and returns 503 when the DB is down.
  - JSON error format `{"error": {code, message}}`.
  - Request logging.
  - API docs at `/api/docs` in dev only.
  - `CamelModel` base class, so API JSON is camelCase like the frontend.
- **API container:** Dockerfile and compose in the backend repo.
  - Host networking; uvicorn with 2 workers, non-root.
  - Bound to `127.0.0.1:8000`, so it can't be reached from outside.
  - Docker healthcheck.
- **Caddy replaces nginx** (frontend repo `Caddyfile`):
  - Automatic HTTPS for `169-58-13-62.sslip.io` (Let's Encrypt, valid to 2027-01-08, auto-renews).
  - `/api/*` → FastAPI; the React build is served with an SPA fallback.
  - zstd/gzip: the main JS bundle goes from 1.1 MB to 299 KB.
  - Assets cached for a year, pages revalidated.
  - Security headers: HSTS for 1 day while on the temporary hostname, nosniff, frame, referrer.
  - `http://IP`, `http://IP:8080` and `http://` all redirect to HTTPS.
- **Dev proxy:** `vite.config.js` proxies `/api` to `127.0.0.1:8000`.
- **Verified:**
  - Valid TLS over HTTP/2; all redirects; headers; SPA deep links.
  - API through Caddy, and a 502 while the API is stopped, recovering afterwards.
  - The certificate survives container rebuilds and restarts.
  - A headless browser over HTTPS (home, careers apply, admin login, same-origin `/api` fetch) shows no mixed-content or console errors.

### 2026-10-10: Part B, real admin login
- **Backend** (`app/auth/`, `app/api/auth.py`):
  - `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`.
  - Server-side sessions: `__Host-` cookie with `HttpOnly`/`Secure`/`SameSite=Strict`; only a token hash is stored. Signed out after 2 h idle, always after 12 h.
  - Origin check and CSRF token header on state-changing requests.
  - DB-backed rate limit: 5 failures per email or 20 per IP in 15 min gives 429.
  - Generic errors, with constant-time checks for unknown emails.
  - `Cache-Control: no-store` on auth responses.
- **CLI:** `reset-password`, `revoke-sessions` and `prune`.
- **Tests:** 14 pytest cases against a separate `symmetry_test` database (`db/create_test_db.sql`), all passing.
- **Frontend:**
  - New `src/lib/api.js` (same-origin fetch, CSRF header, `ApiError`, a global auth-expired event).
  - `AdminAuthContext` rewritten to use the API. **The demo login is removed**, along with the "email contains admin" shortcut, Supabase auth and the localStorage flags.
  - The login page has empty fields, password-manager hints and a rate-limit message, and no demo box.
  - The header shows the real name and role.
- **Verified:**
  - curl over HTTPS: cookie flags, CSRF 403/204, evil origin 403, 429 with `Retry-After`, the real client IP recorded via Caddy.
  - 18/18 headless-browser checks: demo and fake logins rejected; the localStorage flag no longer grants access; deep link → login → back; reload keeps the session; a server-side revoke signs you out; Sign Out and the Back button behave; the cookie isn't readable by JavaScript; the public site is unaffected.
  - The temporary QA admin and the test login attempts were deleted afterwards.

### 2026-10-10: Part C, public site reads the database
- **Backend:**
  - `app/content/snapshot.py` builds a published-content snapshot in the original frontend shapes.
  - `app/content/publish.py` stores it in `publish_events`, with dedupe by hash.
  - `GET /api/public/content`: per-worker cache, ETag/304 that works behind Caddy's compression, `no-cache`, bootstrap on first request, last-good snapshot if the DB is down.
  - `POST /api/admin/publish` (session + CSRF) and `python -m app.cli publish`.
- **Tests:** 21 pass, including an exact-match check of every product, project, blog, testimonial, team member, category, job and page section against the original data.
- **Frontend:**
  - `PublicContentContext` and `ContentState` (skeleton plus a Retry state); content preloaded in `index.html`.
  - Home, Shop, ProductDetail, Projects, ProjectDetail, Journal and JournalDetail are wrapped: the wrapper loads content and the original page body becomes the view.
  - SearchModal, TestimonialCarousel, CategoryCircleMarquee, About (team) and Careers (jobs) use the content hooks.
- **Verified:**
  - All 14 baseline pages and searches have identical text after the switch. The only difference was a hero slideshow frame captured at a different moment.
  - One content request per page load; client-side navigation reuses it.
  - A product renamed in the DB, then published, shows on Shop, the product page and search, then reverts.
  - With the API stopped, pages show Retry; after a restart, Retry loads the content without a page reload.
- **Changes from the plan:**
  - Caching changed from `max-age=60, stale-while-revalidate=300` to `no-cache` with ETag. Testing showed publishes would take up to 6 minutes to appear.
  - Blogs keep their seeded order (`position`) rather than newest-first, so the Journal page looks the same.
- **Bug fixed along the way:** "Buy Now" on every product page crashed the page (`total` undefined in `RazorpayModalPlaceholder`, present since the initial commit). Now defined as subtotal + GST and browser-verified.

### 2026-10-10: Part D1, admin content saves to the database, with Publish
- **Backend:**
  - `app/content/records.py`: one codec per resource, in the same record shapes as the public snapshot.
  - `app/api/admin_content.py`: CRUD for products, categories, collections, projects, journal, banners, testimonials, team and jobs.
    - List with status filter and search.
    - Get, create (auto SKU `sym-0NN`, unique slugs), update with an `updatedAt` conflict check (409), archive, restore (back to draft), reorder.
  - Validation errors name the field (422).
  - A category with products can't be archived (409).
  - `GET /api/admin/publish/status`, `GET /api/admin/dashboard`, and the media library (list with usage counts, add by URL, alt text/tags, delete only when unused).
  - The URL→image and slug helpers moved to `app/content/media.py`, shared with the seed.
- **Tests:** 55 pass. The key one re-saves **every** seeded record unchanged and confirms it comes back identical with nothing to publish.
- **Frontend:**
  - `ResourceManager`: one list and editor for every content type, with a field kit (images with reorder and library picker, lists, colours, stats, paragraphs, related images).
  - The 9 content screens are now short configs.
  - The header `PublishBar` ("Unpublished changes" / "Website up to date" + Publish) replaces the Demo Mode badge.
  - New Dashboard and Media Library on the API.
- **Verified in the browser** with a temporary QA admin:
  - A price edit stays off the site until Publish, then shows on the product page.
  - Archive hides a product after Publish; Restore brings it back as a draft.
  - A new project with images goes live.
  - Two tabs editing at once get a conflict message.
  - The category archive guard, native and server field validation, and all 20 product thumbnails load with correct stock labels.
  - The test data was removed afterwards, and the live content hash is identical to before the test.
- **Bugs caught by the tests and fixed:**
  - Re-saving a testimonial overwrote its wording with the project title.
  - Creating a product failed because the database received the half-filled row too early (autoflush).

### 2026-10-10: Part D2, forms, inbox, page text, cleanup
- **Migration 0003:** `ip` on orders and newsletter subscribers, for rate limiting.
- **Public forms** (`app/api/public_forms.py`): enquiries, job applications, order requests, newsletter.
  - Each has an Origin check, a honeypot, a limit of 5 submissions per 10 min per IP, and field-level errors.
  - **Orders are re-priced on the server** from published products, with GST at 18% and shipping free above ₹1.5L (otherwise ₹3,500). Card and UPI details are never accepted.
  - All 422 errors now name the field.
- **Admin inbox** (`app/api/admin_inbox.py`): lists with status filters and search, status and notes, permanent delete, badge counts, newsletter list with CSV export.
- **Page text** (`app/content/sections.py`): 5 sections, 50 fields: `home`, `about`, `contact`, `company` (shared contact details) and `footer`. Values were copied word for word from the pages; editing is validated per field.
- **Frontend wiring:**
  - Contact, Careers, Newsletter and Checkout post to the API.
  - New Enquiries, Applications (with Newsletter list) and Orders screens; sidebar badges come from the API.
  - The Page Content editor was rebuilt around the real fields.
  - The Home hero, story and section headings, About, Contact, Footer, mobile menu, WhatsApp buttons and Instagram links all read page text. **No hard-coded phone or email numbers remain.**
- **Cleanup:**
  - Deleted the old data service, `SiteContentContext`, the Supabase client and dependency, `supabase_schema.sql`, the fake preview canvas and 6 sample-data files.
  - Old content keys are removed from browser storage on load.
  - Settings is now a System page.
  - Category cards show **real product counts**.
  - Main JS bundle: **1,146 KB → 989 KB** raw (299 → 264 KB compressed).
- **Bugs found and fixed:**
  - After a successful order the browser went to /shop instead of the confirmation page (the empty-cart redirect won).
  - Every public page made a pointless `/api/auth/me` request (a 401 plus a console error); the session is now only checked on admin pages.
  - The mobile menu showed the old Jubilee Hills address.
- **Verified:**
  - 78 backend tests pass.
  - Page text is identical to the Part C baseline apart from the category counts.
  - In the browser: the Contact, Careers, Newsletter and Checkout forms (including a tampered ₹1 cart price, ignored) all reach the admin inbox with matching references and badges.
  - Changing the phone, WhatsApp number and hero title in Page Content, then Publishing, updates the Footer, Contact page, all 3 WhatsApp links, the mobile menu and the Home hero.
  - Test data was removed afterwards and the content hash is restored.

### 2026-10-10: Part E, Cloudinary uploads and fast images
- **Account checked:** cloud `pft7pzaf`, Free plan, 10 MB / 25 MP per image limit. The admin therefore resizes large photos in the browser (≤3000 px, JPEG 0.9) before uploading.
- **Backend:**
  - `app/media/cloudinary.py`: signed uploads, verification (response signature plus an Admin API re-read; must be under `symmetry/`), destroy with CDN invalidation, preset setup.
  - `POST /api/admin/media/sign` and `/media/cloudinary`; Cloudinary-aware delete (502 keeps the record if the remote delete fails).
  - **CLI:** `cloudinary-setup`, `cloudinary-import`, `cloudinary-cleanup`, `media-dedupe`.
  - **Preset:** signed, formats, 3000 px cap. Eager versions were dropped after testing showed Cloudinary strips `f_auto` from them, so they'd only waste credits.
- **Import:** 158 photos from `public/drive_products` uploaded in 3 min. 12 existing records were converted in place (15 product photo slots switched with no relinking) and 146 added to the library. A re-run skips all 158.
- **Frontend:**
  - `src/lib/images.js` and `<SmartImage>` (srcset, sizes, blur placeholder, lazy loading, priority images, `onError` fallbacks that still work) on 27 content images in 20 files.
  - Preconnect to `res.cloudinary.com`.
  - `ImageUploader` (drag and drop, folders, 3 uploads in parallel, progress, retry) in the Media Library, and an **Upload new** tab in the editors' Library picker.
  - Admin thumbnails use small Cloudinary versions.
- **Verified:**
  - 90 tests pass, with Cloudinary mocked.
  - Delivery: a w_800 request returns an 800×936 WebP of 15 KB, against the 111 KB original; blur placeholders average 67 B.
  - In a real admin browser test: a 5000 px PNG was resized to 3000×1800, a text file was rejected, uploads went straight to Cloudinary, and a photo attached from the editor Library went live after Publish.
  - Deleting through the API removes the photo from Cloudinary.
  - Credits used: 0.29 of 25.
- **Bug found and fixed:**
  - Saving a product whose photos are on Cloudinary created duplicate "external" image records pointing at the Cloudinary URL.
  - The URL→image lookup now recognises our own Cloudinary URLs.
  - `media-dedupe` repaired the 3 duplicates the test had created.
  - Two regression tests were added.

### 2026-10-11: Step 6a, faster website
- **Code loads per page** (`src/App.jsx`):
  - Home is in the main bundle; the other 15 public pages and all 17 admin pages load on demand (`React.lazy` + `Suspense` with the existing skeleton).
  - Shared libraries are grouped into `react`, `motion` and `icons` files (Rolldown `codeSplitting`). Without that, lucide would have produced one file per icon: 370 → 47 files.
  - Other public pages are prefetched after the visitor's first interaction (or 6 s). **Visitors never download admin code.**
- **Banners:** `scripts/optimize-images.mjs` (sharp) made WebP copies at 1280 and 2048 px for the 12 banners in use; `src/lib/staticImages.js` adds them as `srcset`. On phones the home slide is 53 KB instead of 275 KB; the JPEGs stay as a fallback.
- **Lazy loading** for 19 static images below the fold (showcase sections, coverflow, About, Sourcing).
- **Font:** Inter is self-hosted (`@fontsource-variable/inter`); Google Fonts and its two preconnects are removed.
- **Page titles** no longer repeat the brand (`SeoMeta`).
- **Deleted unused files:** 6 hero JPEGs, the CTA PNGs, `hero.png`, React/Vite template icons, `icons.svg` and `favicon.svg` (5.4 MB).
- **Measured** with Lighthouse mobile (simulated mid-range phone on 4G; median of 3 runs after):

  | Page | Score | LCP | Downloaded | First-load JS |
  |---|---|---|---|---|
  | Home | 37 → **43** | 6.8 → **5.1 s** | 2,597 → **897 KB** | 261 → **188 KB** |
  | Shop | 39 → **56** | 7.2 → **4.1 s** | 1,093 → **642 KB** | 261 → **194 KB** |

- **Verified:**
  - Visitors never request admin chunks; no Google Fonts requests.
  - Phones get the 1280 WebP banners, desktops the 2048 ones; no duplicated titles.
  - Page text is identical to the previous baseline (the only differences were the admin edits made on 2026-10-10: sym-015 set to draft and jobs reordered).
  - Screenshots on desktop and phone look right; the admin loads lazily; no console errors.
- **What still limits Home:** the intro animation ("Welcome to SYMMETRY", about 2–3 s before the headline shows) and framer-motion's start-up work (blocking time 1.4–3.6 s, varying with this shared CPU). Changing the intro is a design decision for the client.

### 2026-10-13: Step 7a, Home slideshow and collections carousel read the admin
**Why:** the admin had **Hero Banners** and **Collections** screens, but the Home page ignored them: the slideshow used 3 fixed photos and the "Designs That Inspire Living" carousel used 6 fixed cards. Editing those screens changed nothing on the site.
- **Slideshow** (`components/Hero.jsx`): shows the photos of active, published Hero Banners in admin order. The headline and buttons stay in Page Content → Home, because the design has one headline over all photos. If no banner has a photo, the 3 local photos are used.
  - Cloudinary photos get a `srcset` (800–2560 px); local `/images/...` paths keep their WebP copies.
- **Collections carousel** (`components/CoverflowCollections.jsx`): shows Featured collections that have a cover image, in admin order, and hides itself if there are none. Card number comes from the order; the small label and the link are new fields.
- **Backend:** migration **0004** adds `collections.label` and `collections.link` (applied; API redeployed); records, snapshot and a new test (91 tests).
- **Admin forms:** Hero Banners shows only what the slideshow uses (photo, photo description, active). Collections gets "Carousel label" and "Card link", and Featured now says "Show in the Home page carousel".
- **Data** (`cloudinary-import`): the 3 slideshow photos are uploaded to Cloudinary (`symmetry/banners/hero-haj-slide-1..3`).
- **Data** (saved through the admin API, then published): 3 Hero Banners (`ban-1..3`) with the 3 slideshow photos (the 2 old banners reused; their stock photo replaced), and 6 Featured collections matching the old cards (Luna Sofa … Pavilion Teak, still stock photos). Data first, then the frontend deploy, so the site never showed the old banners.
- **Verified** (headless browser, desktop 1440 px and phone 390 px): slideshow photos load from Cloudinary (1600 px desktop, 800 px phone), 3 dots, same headline; carousel shows "01 — LIVING" … "06 — OUTDOOR" with the same links; screenshots match the previous look; no console errors.
- **Problem found and fixed:** the first deploy crashed Home (`useBanners()` returns `{ items }`, not a list). Found by the browser check within minutes and fixed.

### 2026-10-14: Website redesign (frontend only)
**Why:** requested a modern interior-design website with an Apple feel, the same theme on every page. Backend, API and database untouched.
- **Theme tokens:** `src/index.css` defines the palette once (light: warm gallery white, charcoal text, brand teal; dark: near-black, sand gold). Tailwind names: `canvas`, `surface`, `sunken`, `fg`, `muted`, `subtle`, `line`, `accent`, `accent-hover`, `on-accent`. A script converted ~1,500 hard-coded `[#hex] dark:[#hex]` pairs; only pairs that already had a dark value were converted, so text on photos keeps its fixed colour.
- **Design system** (`src/index.css`, `tailwind.config.js`): `site-container`, `eyebrow`, `glass`, `card-apple`, `btn-primary` / `btn-dark` / `btn-secondary` / `btn-light` / `btn-glass`, `link-apple`, `field`; fluid `text-display-xl/lg/md`; softer shadows; restrained letter-spacing; `font-mono` now renders Inter with tabular figures.
- **New/rewritten components:** Header (glass bar, sentence-case links, Services mega-menu, "Book a consultation"), MobileMenu (full-screen), Footer + Newsletter, `PageHero` (new), SectionHeading, Button, ThemeToggle, Home Hero, ProductCard, ProjectCard, BlogCard, AppleCardWrapper (no 3D tilt), FloatingActionStack (one glass pill; folds into one button on phones), Breadcrumb.
- **Pages:** About, Services, Projects, Sourcing, Shop, Journal, Contact and Careers now open with `PageHero` (same headline, photo and stats). All-caps buttons became sentence-case pills (script, ~30 buttons); form fields use 15 px text; decorative dashes beside labels removed; navy overlays and the dark showcase recoloured to neutral black.
- **Fixed:** the China photo on Sourcing was a dead Unsplash link (404 before this work); replaced with a working image already used on Home.
- **Verified** (dev server against the live API, headless Chromium): 14 pages in light and dark at 1440 px and 390 px, plus search, quick view, mobile menu and mega-menu: no console errors, no horizontal scroll. Every sentence, stat and image of the live pages is still present (text compared page by page). Build passes; lint shows no new warnings (56 existing). Admin login unchanged.
- **Not deployed yet**; not committed.
- **Preview:** https://169-58-13-62.sslip.io/preview/ (path on the live hostname, added because some networks did not open the new subdomain; built with `vite build --base=/preview/`, `BrowserRouter` now reads `BASE_URL`, which is `/` for the normal build) and https://preview.169-58-13-62.sslip.io (Caddy site block and `/srv-preview` copied into the running web container only; it disappears on the next `docker compose up -d --build`). `noindex`. Forms on it write to the real database.

### 2026-10-14: Shorter intro, simpler wording, editable page banners (frontend only)
- **Intro** (`SiteOpener.jsx`): once per browser session (`sessionStorage`), ~1.5 s instead of ~2.9 s, fades instead of sliding, skipped with reduced motion; the wrong "Road No. 36, Jubilee Hills" line removed.
- **Wording:** ~200 formal phrases in code text rewritten in plain English (atelier, commission, monograph, telemetry, pavilion, "Architectural…"), including all buttons, form labels, cart/checkout/order screens, the 6-step process on Services and the Sourcing/About labels. "Jubilee Hills Pavilion" references now say "our Hyderabad studio" (the office is in Ameerpet). Database content is unchanged.
- **Page Banners** (Admin → Content & Portfolio → Page Banners): one banner per page (About, Services, Projects, Global Sourcing, Shop, Journal, Contact, Careers) with headline, highlighted words, text and photo. Stored as `banners` records with the page key in `badge`; Hero Banners now lists only banners without a page; the Home slideshow ignores page banners. A page without a published banner keeps its standard opening.
- **⚠ Deploy order:** do not publish a page banner before this frontend is live: the old live code shows every banner in the Home slideshow.
- **Verified:** with simulated API responses (no database writes): About uses a banner's headline, text and photo; Services keeps its standard opening; the Home slideshow still has 3 slides; both admin screens list the right banners; the page dropdown offers the 8 pages; the intro plays once (~1.8 s measured, including test polling). All pages on the preview: no errors in light/desktop and dark/phone. Build passes; no new lint warnings.

### 2026-10-14: Home hero overlay
- The flat dark film over the slideshow made the bright interiors look grey, and white text sat on light walls. Now: shade only where the text is (from the left on desktop, from the bottom on phones) plus a light shade under the navigation; soft text shadows on the copy.
- On Home, the navigation bar is transparent with white text and the light logo while it sits on the photo; it turns into the frosted bar on scroll or when the Services menu opens.
- Verified on the dev server (light, dark, phone, all 3 slides, scrolled) and on the refreshed preview; no errors, no new lint warnings.

### 2026-10-17: Motion plan, Phases 0–1 (frontend only)
**Why:** requested: Apple-style smooth scrolling and animations on every page. Plan: [MOTION_PLAN.md](MOTION_PLAN.md) (NEXT_STEPS Step 8).
- **Phase 0:** the 2026-10-14 redesign is committed (`d17b7e0`). Baseline Lighthouse numbers are in MOTION_PLAN.
- **Motion tokens** `src/lib/motion.js`: curves (`ease.out`, `ease.apple`), speeds (0.2 / 0.5 / 0.9 s), 0.06 s stagger, 24 px distance, plus `reveal()` (on scroll) and `enter()` (on load). Matching CSS variables and Tailwind names: `ease-out-expo`, `ease-apple`, `duration-fast/base/slow`.
- **New components:** `components/motion/Reveal.jsx` and `CountUp.jsx`. PageHero stats now count up ("25+", "100%"; text without a number is unchanged).
- **All 60 scroll reveals** now use `reveal()`, converted by script. Sideways slide-ins became fade-ups, delays became sequence numbers, and local helpers in Services, Sourcing and SectionHeading were removed. ScribbleUnderline uses the tokens.
- **Lighter engine:** `motion.*` → `m.*` in 45 files. `<LazyMotion strict>` loads the animation engine after first paint, and the forced `motion` chunk was removed from `vite.config.js`. **First-load JS: 175 → 158 KB gzip.**
- **Reduced motion everywhere:** `<MotionConfig reducedMotion="user">` keeps fades and drops all movement.
- **Hero:** page headlines (PageHero, Home) and the first Home slide show on first paint, and the text around them fades in. Later slides cross-fade with a slow 6 s settle.
- **Verified** with a production build served locally and the live API, in headless Chromium: 15 pages, with normal and with reduced motion. No console errors. No content left invisible after scrolling (only the card hover-glare layers, which are meant to be hidden). Screenshots match the baseline. Build passes; lint unchanged (56 warnings).
- **Finding:** LCP did not improve (it is about 4.8 s on Home). The cause is about 4.9 s of style and layout work, not animation; this moved to Phase 7 (details in MOTION_PLAN § Baseline).
- Not deployed; the preview has not been refreshed yet.

### 2026-10-17: Motion plan, Phase 2: scrolling (frontend only)
- **`src/lib/scroll.js`:** `scrollToTarget(el | '#id' | px)` glides under the header, or uses the element's own `scroll-mt-*`, and corrects itself if photos above load mid-glide. `useScrollLock(open)` is counted, so stacked popups work, and it stops Lenis.
- **`SmoothScroll.jsx` rewritten:**
  - Lenis smooths the mouse wheel only (`lerp: 0.1`); touch scrolling stays native, and Lenis is off for reduced motion.
  - A new page starts at the top. Back/Forward and reload return to the saved position, waiting until lazy pages and API content are tall enough.
  - Links to `#anchors` glide, on the same page or from another page.
  - A Shop filter change (same page, new query) keeps the position.
- **Popups:** Mobile menu, Search, Filter drawer, Quick view, Fullscreen gallery, Project lightbox, Catalogue popups (2), Payment placeholder and Customisation request now lock the page behind them. They carry `data-lenis-prevent`, so their own lists still scroll. The intro uses the same lock.
- **Removed:** the duplicate scroll logic in `ScrollToTop` (it keeps its button), the Header's extra Lenis listener, eight direct `scrollIntoView` / `window.scrollTo` calls, and `scroll-smooth` on `<html>`.
- **Progress bar:** removed site-wide. Journal articles show a 2 px accent reading line.
- **Verified** (production build, headless Chromium, 16 checks, all passing with normal and with reduced motion):
  - mouse wheel after the intro; keyboard PageDown, End and Home;
  - new page at the top; Back and Forward restore, including Back to the first page of a visit; a fresh visit starts at the top; reload keeps the position;
  - a cross-page `#anchor` lands below the header;
  - Search and the mobile menu (phone, touch) lock the page, and scrolling resumes after closing;
  - the reading line appears on articles only.
- **Also checked:** all 15 pages at 1440 and 390 px: no errors, nothing left hidden. Lint: 53 warnings (was 56).

### 2026-10-17: Motion plan, Phase 3: page transitions (frontend only)
- `components/motion/PageTransition.jsx`: the page area (not the header) fades in and rises 12 px on every page change (~0.35 s). The page a visit starts on is not animated, so first paint is not delayed, and a query-only change (Shop filters) does not replay it.
- Lazy page code: a blank canvas instead of a spinner; the spinner shows only if loading takes longer than 0.5 s (`RouteFallback`).
- **Verified:** first load has no animation; after a click the opacity goes 0.6 → 0.92 → 1 over about 0.3 s, then settles with no leftover transform; Search opened right after a transition covers the full window. The 16 scroll checks still pass, and all 15 pages have no errors. Lint: 53 warnings.

### 2026-10-17: Motion plan, Phase 4: Home (frontend only)
- **Zoom-out moment** (`components/motion/ZoomOutPhoto.jsx`): before the "Why Symmetry" cards, a full-screen interior photo stays pinned and closes in to a rounded card, and the Why heading and text (Page Content, editable) fade in over it. This is desktop only; phones and reduced motion get a still rounded photo with the same text.
- **Featured projects filter:** cards that stay glide to their new place, and the others fade out or in (`layout` + `AnimatePresence popLayout`). Before, the whole grid faded out and back in.
- **Pinned gallery** (`DynamicScrollShowcase`): the spring on top of Lenis is removed, since it lagged behind the scroll. The 700 px `blur-[140px]` glow is replaced by a radial gradient that is cheap to paint and looks the same.
- **Bug fixed, new helper `useScrollRange()`:** Framer Motion runs simple scroll-linked ranges on the browser's scroll timeline, where values outside the range drift back to the base value. The Why heading faded out again, and removing the spring would have done the same to the gallery's button. All 27 scroll-linked ranges now use the helper.
- **Verified:** zoom-out values measured at 0, 30, 55, 90 and 100 % of the section (heading opacity 0 → 0.83 → 1 → 1); gallery button visible at 95 %; phone and reduced-motion still version; filter glide screenshots. The 16 scroll checks pass in both modes; Home has no errors at 1440 and 390 px. Lint: 53 warnings.
- 7 other large blur effects remain on other pages; they are for Phase 7.

### 2026-10-17: Careers page rebuilt, with resume uploads (frontend + backend)
**Why:** requested: a Careers page for students, freshers and interns, with 10 given sections and an application form with resume and portfolio uploads, a review step and honest success messages. The screenshots mentioned in the request did not arrive; the written spec was followed.
- **Page** (`pages/Careers.jsx`, content in `data/careers.js`), in the requested order: Hero (Explore opportunities / Apply now), Areas of Opportunity (6 cards, each with Apply that preselects the position), What You Can Expect, Programme Structure, Hiring Process (vertical timeline on phones, 5 columns on desktop), Apply (admin job openings kept above the form), General Application (subject-line suggestion with copy; email only if configured), Team Voices (**sample** quotes, labelled), Equal Opportunity & HR contact, final call to action.
- **Form** (`components/careers/ApplicationForm.jsx`):
  - Fields: name, email, +91 phone, position (6 areas + General + current openings), experience level, portfolio link, resume (PDF/DOC/DOCX ≤ 5 MB, required), portfolio PDF (≤ 15 MB), about you, consent (required).
  - Step 1 checks every field, highlights the problems, moves focus to the first one, and keeps what was typed.
  - Step 2 shows a summary, with Edit or Submit. Success, with a reference number, appears only after the server confirms. A server-side field error returns to the form with the message.
- **Backend** (`symmetry_backend`, not deployed):
  - `POST /api/public/career-applications` (multipart, `python-multipart`): origin check, honeypot and per-IP limit, as on the other forms.
  - Files are checked by content and stored under random names with owner-only permissions in `UPLOAD_DIR` (Docker volume `application_files`).
  - Admin download: `GET /api/admin/applications/{id}/files/{kind}`. Deleting an application deletes its files.
  - Migration **0005** (file and consent columns), new optional Page Content fields `careersEmail` and `hrPhone`, and CLI `application-files-cleanup`.
- **Admin:** Applications shows Resume / Portfolio download links and the consent time. Page Content has a *Careers page* group for the careers email and HR phone.
- `lib/api.js` now sends `FormData` as multipart.
- **Verified:**
  - Backend: 109 tests pass (18 new). They cover file storage and permissions, download headers, auth required, deleting files with the application, renamed HTML / fake DOCX / empty / too-large / wrong-type rejection, every field rule, closed jobs, the honeypot and foreign origins.
  - Browser, against a second backend on the **test** database (no live data touched), 14 checks pass: section order; hero and card buttons scroll and preselect; empty submit flags 7 fields and focuses the first; a wrong file type is rejected; a bad email keeps the data; the summary shows the details; Edit keeps values and files; a simulated server outage shows an error and no false success; a real submission returned APP-FFD37A, and the row and both files (mode 600) were found.
  - The download URL without login returns 401. Phone layout has no horizontal scroll. Dark mode checked. Lint: 53 warnings (unchanged); build passes.
- **Not done / needed before publishing:** deploy (OPERATIONS § Deploy, migration 0005 first); fill in the careers email and HR phone; replace the sample Team Voices; there is **no email notification** for new applications (no email service in the backend; needs SMTP or an email-provider account); add the `application_files` volume to backups.

### 2026-10-17: New Apple-style website design (frontend only, in preview)
**Why:** requested: a new modern Apple-theme look for the whole public site, with new animations, new hero images on every page and no overlay on the Home slides, without changing the content. Choices made with the client: free stock photos for now, Home slides as photos only, full new look plus motion, preview URL.
- **Design system** (`index.css`, `tailwind.config.js`): Apple palette (light grey page `#f5f5f7`, white tiles, near-black text; black in dark mode), bands `.band-white` / `.band-dark`, one section rhythm (`.section`), 28 px borderless tiles (`.card-apple`, `.tile-media` photo zoom), Apple pill buttons and "Learn more >" links, segmented filter control, bigger display type. A class-name script moved ~400 old one-off classes (all-caps tracked labels, outlined cards with shadows, light weights) onto the system across all public pages.
- **Header:** thin 48 px frosted bar with small centred links; slides away when scrolling down, returns on scroll up; Services opens a full-width flyout that blurs the page. Cart count pops when it changes.
- **Page bar** (`LocalNav`): every inner page has a sticky bar with the page name and one action (Book a consultation; Careers: Apply now; Contact: Schedule a Consultation; Shop: View bag). It moves up when the header hides.
- **Page hero** (`PageHero`): big centred headline, then a clean photo with no overlay that starts as a rounded inset and widens to full screen as you scroll; figures count up.
- **Home:** full-screen photo slideshow with no overlay or text, with dots and a pause button (6 s per photo). The headline and buttons moved to the section below, where the words rise in one after another. The About paragraph brightens word by word as you scroll. The collection and sourcing coverflows and the category marquee are now swipeable Apple-style galleries (`CardGallery`); testimonials are a gallery of cards; the closing call to action is a black band.
- **Cards:** product (Apple Store style: badge as coloured text, Details button + Quick view link), project, journal, team, testimonial and service cards are borderless tiles without photo overlays. The 3D tilt / glare wrapper became plain CSS.
- **Footer:** Apple-style small type, newsletter in a white band above it.
- **New hero photos** (Unsplash licence): About, Services, Projects, Sourcing, Shop, Journal, Contact, Careers and the Careers call to action (`public/images/hero/stock-*`). The Home slideshow still uses the client's HAJ photos from Admin → Hero Banners.
- **Fixed on the way:** `no-scrollbar` was used but never defined (added); the "Furniture & Objects" heading showed a literal `&amp;`; `heroImage()` ignored the build base path, so local photos were missing on the `/preview/` build.
- **Removed:** `CoverflowCollections`, `CoverflowSourcing`, `CategoryCircleMarquee` (replaced by galleries).
- **Verified:** build passes; lint 50 warnings, 0 errors (was 53). Headless Chromium on the local build and on the preview: 14 pages at 1440 px (light and dark) and 390 px, no console errors, no horizontal scroll; every hero photo loads on the preview.
- **Preview:** https://169-58-13-62.sslip.io/preview/ (forms there write to the real database). Not committed and not deployed.
- **Still to check:** real devices (iPhone Safari, Android, Mac trackpad); the client's view on brand teal vs Apple blue; whether to replace the Home slideshow photos (they are the client's own project photos in Admin → Hero Banners).

### 2026-10-17: New Apple-style look for the whole public site (frontend only)
**Why:** requested: a new, modern Apple-theme website without changing the content, new animations, new hero images on every page, and no overlay on the Home hero slides. Choices made with the user: free stock photos for now, Home slides as photos only, full new look plus motion, preview on the `/preview/` URL.
- **Theme:** Apple palette (light grey page `#F5F5F7`, white tiles, near-black text; black in dark mode); sections alternate grey / white (`.band-white`) / black (`.band-dark`) bands; one rhythm (`.section`); larger semibold headlines; 17 px body text; 28 px tile corners with no borders; pill buttons (filled + outlined); segmented filters. Brand teal (light) and sand gold (dark) kept as the accent.
- **Header:** thin 48 px frosted bar with small centred links; hides when you scroll down, returns when you scroll up; Services flyout blurs the page behind it; cart badge pops.
- **Page bar** (`LocalNav`): every main inner page has a sticky bar with the page name and one action (Book a consultation; Apply now on Careers; Schedule a Consultation on Contact; View bag on Shop).
- **Page heroes:** big centred headline, then a clean photo (no overlay) that starts as a rounded card and widens to the full screen as you scroll; figures count up.
- **New hero photos** (free Unsplash licence, placeholders like the other stock images): `public/images/hero/stock-{about,services,projects,sourcing,shop,journal,contact,careers,careers-cta}.jpeg` + WebP copies. The old page photos are kept in the folder but no longer used.
- **Home:** full-screen slideshow photos with no text and no overlay, plus a pause/play control; the headline and buttons moved to the section below (words rise in one by one); the story paragraph brightens word by word as you scroll; coverflow carousels and the category marquee replaced by swipeable Apple-style galleries (`CardGallery`: collections, categories, sourcing, testimonials); closing call to action is a black band.
- **Cards:** product, project, journal, team, testimonial and service cards redrawn (photo first, words below, no overlays or badge clutter; same information and actions). The 3D tilt/glare card wrapper is now pure CSS.
- **Footer:** Apple-style small-print footer with the newsletter in a white band above; all company details and links kept.
- **All other page sections** moved onto the same system by a class-name pass (no all-caps tracked labels, no light/serif type, no outlined/shadowed panels, one container width).
- Removed: `CoverflowCollections`, `CoverflowSourcing`, `CategoryCircleMarquee` (replaced). Fixed: `no-scrollbar` was never defined; "Furniture &amp; Objects" showed a literal `&amp;`.
- **Verified:** build passes; lint 0 errors, 50 warnings (was 53); headless Chromium on the preview: 14 pages at 1440 and 390 px, no console errors, no horizontal scroll; screenshots checked in light and dark.
- **Preview:** https://169-58-13-62.sslip.io/preview/ (copied into the running web container; forms there write to the real database). **Not deployed, not committed.**
- The Home slideshow still shows the client's own HAJ project photos from Admin → Hero Banners (now without the dark overlay); swap them there if other photos are wanted.

### 2026-10-17: Home section order, contact section, video hero; test + deploy attempt (frontend only)
**Why:** requested: Home must follow the client's order (Hero, About, Featured Collections, Shop by Category, Featured Products, Featured Projects, Global Sourcing, Why Choose Us, Testimonials, Blog, Instagram, Call-to-Action, Contact Information), with an image *or video* hero.
- **Order:** removed the pinned "one home, from the inside" showcase (`DynamicScrollShowcase`, between Projects and Sourcing) from Home; the component file is kept but now unused. The hero's headline and two buttons stay right under the photos as part of the hero block.
- **New `HomeContact`** (last section, after the black call to action): four tiles (studio address + directions, phones, emails, WhatsApp) and visiting hours, all from Page Content → Company & Contact; email addresses only wrap before the @.
- **Video hero:** a Hero Banner whose URL is a video (`.mp4` / `.webm` / `.mov`, or a Cloudinary `/video/upload/` URL) plays muted and inline. Alone it loops; in a slideshow it moves on when the clip ends (photos still 6 s). The pause button also pauses the video and shows even for a single video. Reduced-motion visitors start paused. No backend change (banner URLs accept any https URL); the admin thumbnail for a video URL will look broken.
- **Verified:** lint 0 errors (no new warnings; 53 total includes 3 from the in-progress shop files); build passes. Headless Chromium on a fresh dev server: section order matches the brief; no errors or horizontal scroll at 1440 / 390 px, light and dark; a generated test video plays, pauses, loops when alone, and hands over to the next photo when it ends.
- **Deploy (same day):** the committed redesign (HEAD `1b7c4d9`) was tested from a clean export: backend 109 tests pass; frontend image `symmetry_react-web:candidate` built; 42 headless page checks pass. The deploy itself (DB backup, migration 0005, image swap) was **blocked by the agent permission system**; commands are in the session notes / OPERATIONS § Deploy. Nothing deployed.
- **Note:** the shared dev server in `sym-dev` (port 5173) serves a 500 for `index.css` (`rounded-tile` missing): it started before the Tailwind config changed. Restart it (`docker restart sym-dev`) when nobody is using it.
- **Not committed:** `src/pages/Home.jsx`, `src/components/Hero.jsx`, `src/components/HomeContact.jsx`. Uncommitted shop work (`ProductCard.jsx`, `components/shop/`, `lib/shop.js`) belongs to another session.

### 2026-10-17: Words on the hero photos, bigger header, shorter heroes, Home polish (frontend only)
**Why:** requested: headline and description *on* the hero photo on every page (Home included, chosen by the client over the clean-photo look), a larger header, smaller hero images, and a more beautiful Home.
- **Inner pages (`PageHero`):** full-width photo right under the page bar; eyebrow, headline (accent part in light gold `#E3CF9F`) and description sit on it over a dark fade at the bottom (plus a light dim on phones). Height about 60% of the screen (440–640 px), growing only when the words need more room. The photo drifts slower than the page and the words fade as you scroll. Buttons (Contact, Careers) and figures stay under the photo. Without a photo the old centred headline is used.
- **Home (`Hero`):** headline, description and the two buttons (white + glass) on the slides; the separate headline band under the slides is gone. Height about 80% of the screen (580–820 px, grows with the words). The dots became slim progress bars that fill over each slide (6 s; a video's own length) and can be clicked; pause freezes the bar and the slide together.
- **Header:** 64 px on phones, 72 px on desktop (`--gnav-h`, used by the page bar and the mobile menu); logo 32–36 px, wordmark 14–15 px, links 14–15 px with a small accent line under the current page, 20 px icons; aligned to the page width (`site-container`).
- **Home polish:** About ends with four figures that count up (25+ years, 25,000 sq.ft. workshop, 100% bespoke, 10-year warranty; all already stated in "Why Symmetry"); Featured Projects alternate wide and narrow cards (7/5, then 5/7) on large screens.
- **Verified:** lint 0 errors (53 warnings, none new); build passes. Headless Chromium: every page's headline is on its photo and inside it, clear of the header and page bar, at 1440×900, 1280×720, 768×1024, 390×844 and 360×640; no horizontal scroll or errors; header/page-bar hand-over on scroll checked; light and dark checked.
- **Not committed, not deployed.**

### 2026-10-17: Phone layout pass (two cards per row), new footer, clear header on Home (frontend only)
**Why:** requested: check the whole site on phones and make it look good, image cards two per row on phones, then update the header and footer.
- **Two per row on phones** (grid-cols-2 below lg, compact type, long text hidden or clamped below sm): Home collections and sourcing galleries (cards 44vw), featured projects, Why Choose Us, journal, contact tiles (address and email tiles full width); About countries, team (`TeamCard`), Why Choose Us; Services process steps, sourcing locations, image triptych; Projects grid and related projects (`ProjectCard`); Sourcing pipeline phases; Journal grid and related articles (`BlogCard`); Shop grid and related products (grid only; `ProductCard` is the other session's work and was not touched); project gallery (`ImageGallery`, first photo wide); journal photo plates.
- **Phone fixes:** smaller About statement (21 px), page-hero figures no longer break ("End-to-End"), Services stat boxes no longer clipped. Pages are about 30–40% shorter on phones (Home 21,700 → 16,000 px; Projects 10,200 → 6,600 px).
- **Footer:** now a black band (under the white newsletter band) with larger type (14–15 px): brand, tagline, description, *Book a consultation* / *Explore our work*, social buttons (Instagram, LinkedIn, Pinterest, WhatsApp from Page Content); link columns (two per row on phones) and a *Visit the studio* block (both addresses, phones, email, Instagram); legal line with CIN. All previous content kept.
- **Header:** on Home, until you scroll 40 px, the bar is clear with white type (white logo, light theme toggle) over the hero, with a darker fade at the top of the photo; then the frosted bar returns. A header *Book a consultation* button was tried and removed: it does not fit next to nine links in the 1200 px container (the page bar on inner pages and the Home hero already carry that action).
- **Verified:** lint 0 errors (53 warnings, none new); build passes. Headless Chromium on 13 pages at 390 px: no horizontal scroll or errors; hero fit at 5 sizes and headline-on-photo at 1440/390 still pass; header fits with no overlapping links at 1024/1280/1440/1600/390 in light and dark, and switches clear → frosted on scroll.
- **Not committed, not deployed.**

### 2026-10-17: Calmer hero text, website chat assistant (frontend only)
**Why:** requested: on the heroes the headlines outshone the photos; and a simple chatbot for "login" (visitor details) and small questions and answers. Choices made with the client: ask name + phone first, ready-made answers (no AI service), button next to the WhatsApp pill.
- **Heroes (all pages):** new `.hero-title` (30 / 40 / 52 px, was the 44–96 px display size), `.hero-lede` (15 / 17 px) and `.hero-eyebrow` (soft white) in `index.css`; text block narrower and lower; the dark fade is lighter (bottom 70% → clear by 40% height) and the phone dim is 10%. Page-hero figures 30 / 40 / 48 px so "End-to-End" fits.
- **Chat (`ChatBot.jsx` + `lib/chatAnswers.js`):** "Ask us" button left of the floating WhatsApp pill (round icon on phones). Step 1: name, phone, email (+ honeypot) → saved through the existing `POST /api/public/inquiries` as service **"Website chat"** (shows in Admin → Inquiries; same origin check and rate limit as the Contact form). Step 2: questions matched by keywords to 18 topics (services, consultation, prices, hours, address, contact, shop, delivery & GST, projects, sourcing, bespoke, timeline, warranty, about, careers, team sign-in, greeting, thanks); answers use Page Content company details and site data, with link buttons and suggestion chips. Unknown questions → WhatsApp (pre-filled with the question) and call buttons. Chat kept for the browser tab (sessionStorage), so no second sign-in; Escape closes. No backend change.
- Delivery/GST answer matches the cart (`CartContext`: 18% GST on prices stored without GST; free delivery above ₹1,50,000, else ₹3,500).
- **Verified:** lint 0 errors (53 warnings, none new); build passes. Headless Chromium at 1440 and 390 px (enquiry request intercepted, nothing written to the database): launcher beside the pill without overlap; empty-form errors; nothing sent while invalid; a refused submission (429) shows an error; payload correct; 7 sample questions get the right topics; unknown question hands over to WhatsApp; link opens the page and closes the chat; chat remembered across pages; one enquiry per chat. Hero checks at 5 sizes pass.
- **Preview updated:** https://169-58-13-62.sslip.io/preview/ (a chat sign-in there creates a real enquiry). Not committed, not deployed.

### 2026-10-17: Bigger logo and header
**Why:** requested: increase the logo size and the header size.
- **Header height** (`--gnav-h` in `index.css`): 64 → 76 px on phones/tablets, 72 → 88 px from 1024 px. Hero padding, page bars and sticky offsets read this variable, so they follow automatically.
- **Logo** (`Header.jsx`): 32/36 px → 44 px (phones), 48 px (1024 px), 56 px (1280 px+). **Wordmark** "SYMMETRY": 14/15 px → 16 px, 18 px from 1280 px; gap 10 → 12 px. Mobile menu top bar matches (44 px logo, 16 px wordmark).
- The largest sizes start at 1280 px, not 1024 px, because nine links already fill the bar at 1024 px.
- **Verified:** lint 0 errors (53 warnings, none new); build passes. **Not checked in a browser** (no headless Chromium on the host this session). Check the header at 1024 px for crowded links. Not committed, not deployed.

### 2026-10-17: "At a glance" page cards on Home
**Why:** requested: below the Home hero, small cards showing what every page holds, so a visitor understands the site without opening each page.
- **New `SiteOverview.jsx`**, placed on Home right after the hero (before About). One card per page: About, Services, Shop, Projects, Sourcing, Journal, Careers, Contact. Each card has an icon, a count where one exists (services, pieces, projects, countries, articles, openings), a one-line summary, up to four chips and an "Open …" link. The whole card links to its page.
- Chips come from live data: service titles (`data/services`), product categories, project typologies, sourcing countries, journal categories, job openings (Admin → Job Openings; falls back to "Internships / Fresher roles"), and phone and hours from Page Content → Company. New products, projects or posts update the cards automatically.
- Layout: 1 column on phones, 2 on tablets, 4 from 1024 px (two rows of four).
- **Verified:** lint 0 errors (53 warnings, none new); build passes; live content gives 19 products / 12 categories, 12 projects, 16 articles, 4 openings. **Not checked in a browser** (no headless Chromium on the host this session).
- **Preview updated** with this and the bigger logo/header: https://169-58-13-62.sslip.io/preview/ and https://preview.169-58-13-62.sslip.io (both builds copied into the running web container). Not committed, not deployed.

### 2026-10-17: Navy dark theme, new Collections and Shop-by-Category styles
**Why:** requested: a different style for the Home collection and category sections, and a navy dark theme instead of black, with type colours that suit navy.
- **Dark theme** (`.dark` in `index.css`): midnight navy page `rgb(10 20 38)`, tiles `18 32 56`, sunken `27 44 74`, lines `40 58 90`; ivory text `241 237 228`, cool grey-blue secondary text `168 180 201`; champagne-gold accent `214 188 136` with navy text on gold buttons. `.band-white` in dark is `14 27 49`. `.band-dark` (black bands, e.g. the footer) is now deep navy `7 15 30` **in both themes**. `index.html` `<body>` dark colours now use the tokens (it had its own `#07121C`). Leftover `dark:*-stone-*` and `dark:bg-black/*` classes on public pages were changed to theme tokens; the Careers panel and the intro screen use navy in dark mode. Light theme unchanged.
- **Featured collections** (`CollectionsGallery.jsx`): side-scrolling row → photo mosaic with the words on the photo (navy fade). Desktop: 4 columns, first collection a 2×2 feature, next four single tiles, later ones two wide, a lone last one a full-width banner. Phones: 2 columns, first and lone-last full width. Numbered badge, gold label, hover arrow, "Shop all collections" link.
- **Shop by category** (`CategoryGallery.jsx`): side-scrolling square tiles → all categories at once as round photos (3 / 4 / 6 per row) with a gold piece-count badge; centred heading and a "Browse the full shop" link. Descriptions are no longer shown in this section.
- **Verified:** lint 0 errors (53 warnings, none new); build passes. Headless Chromium (Playwright, installed in the `sym-dev` container at `/tmp/shot`) on the preview at 1440, 1024 and 390 px, light and dark: no page errors, no horizontal scroll, header links don't overlap at 1024 px (logo ends 221 px, first link 237 px), dark page background measures navy, all 6 collection tiles render, category photos are true circles (150 px / 109 px). Screenshots checked.
- **Preview updated:** https://169-58-13-62.sslip.io/preview/ and https://preview.169-58-13-62.sslip.io. Not committed, not deployed.

### 2026-10-17: Shop cart and checkout like Flipkart / Amazon, real payments (Razorpay) + Cash on Delivery
**Why:** requested: cart (add, update quantity, remove, order summary) and checkout (name, email, phone, shipping address; UPI, cards, net banking, wallets, optional COD) working like Amazon / Flipkart. Most screens existed but payment was simulated ("Developer Notice"), the checkout asked for card numbers in our own form, Buy Now opened a fake payment popup, and the cart's discount code only changed the cart's own total (checkout charged full price).
- **Backend:** migration **0006** (order payment columns). `GET /api/public/checkout-config` (online on/off, public key id, COD on/off and limit). `POST /api/public/orders` still prices everything from the database; for UPI/card/net banking/wallet with Razorpay keys set it creates a Razorpay order for the server total (paise) and returns it; gateway down → 503 and nothing saved. `POST /api/public/orders/{number}/payment` marks paid only with a valid HMAC signature for that order's Razorpay id. `POST /api/public/payments/razorpay-webhook` (signed) marks paid / failed. COD: `COD_ENABLED`, `COD_MAX_TOTAL`. New `app/payments.py` (no new dependency). Admin → Orders shows payment status, Razorpay payment id and paid time. 8 new tests (`tests/test_payments.py`); **118 passed**.
- **Cart** (`Cart.jsx`): steps bar (Bag → Address → Payment → Done), items with M.R.P., % off, stock / lead time, quantity stepper (1–20, the API limit), Save for later (moves to the wishlist, listed under the cart with Move to cart), Remove with Undo, Flipkart-style Price details (`PriceDetails.jsx`: price at M.R.P., discount, GST, delivery, total, "You will save"), Place order; on phones a fixed bottom bar with the total. Removed: the browser-only discount codes and the untrue lines "Items are held for 60 minutes" and "Free delivery across India".
- **Add to cart:** "Added to cart" card with Go to cart / Checkout (`CartToast.jsx`) from shop cards and quick view. **Buy Now** adds the piece and opens checkout; the fake payment popup (`RazorpayModalPlaceholder.jsx`) is deleted.
- **Checkout** (`Checkout.jsx`, rewritten 820 → ~400 lines): contact, delivery address (Indian states list, India fixed, PIN/mobile validation, "save on this device" prefill), payment method list (UPI, card, net banking, wallets, COD). No card/UPI fields: details are typed in Razorpay's own window (`lib/razorpay.js`). If the window is closed, the order stays saved and the button becomes "Pay ₹…" to retry the same order. Without keys, checkout says a secure payment link will be sent.
- **Order page** (`OrderSuccess.jsx`): shows the real payment state (paid / COD / confirming / payment link coming). Removed the made-up sample order shown on direct visits and the untrue "signed proforma has been transmitted" line.
- On cart and checkout (phones) the floating WhatsApp / chat buttons move above the bottom bar (`useBuyBar`, `.float-btn`).
- **Verified:** build passes; lint 0 errors, 45 warnings (was 53). Headless Chromium on the preview with order/payment requests intercepted (nothing written to the database), 1440 px light and 390 px dark: add to cart → card; quantity +; save for later; remove + undo; empty checkout shows 6 field errors and sends nothing; COD order placed; UPI with a simulated Razorpay window → signature sent to the confirm endpoint → "Payment received"; no card/UPI data in the request; address saved; cart emptied; no page errors, no horizontal scroll. **Real Razorpay not tested** (no keys).
- **Preview updated** (frontend only; the live API is unchanged, so on the preview online methods behave as "payment link to follow" and checkout-config falls back to defaults). Backend not deployed; migration 0006 not applied to the live database. Not committed.

### 2026-10-17: Admin panel: orders, deliveries, invoices, export, inventory; navy admin theme
**Why:** requested: admin in the site's navy theme, and admins able to view orders, update status, generate invoices, manage deliveries, export orders; manage inventory (products, categories, multiple images, stock, prices, in/out of stock); and manage banners, products, categories, collections, projects, blogs, testimonials, team, enquiries, orders and media. Most content screens already existed; this adds the sales and inventory tools.
- **Backend (migration 0007):** products `availability` (in_stock / made_to_order / out_of_stock, from the old `in_stock`) and `stock_quantity` (empty = not counted). Orders: statuses `shipped`, `out_for_delivery`; courier, tracking number/link, expected delivery, shipped/delivered times, invoice number/date, `stock_reserved`. New `app/inventory.py`: placing an order takes pieces from the count (refuses sold-out / "only N left"), cancelling gives them back, reopening takes them again; at 0 an in-stock product is out of stock. New `app/api/admin_orders.py`: `PATCH /admin/orders/{id}` (status with stock rules and delivery dates; COD becomes paid on delivery; payment status; delivery fields; notes), `GET /admin/orders/{id}`, `POST /admin/orders/{id}/invoice` (INV/2026-27/0001, per financial year, numbered once), `GET /admin/orders-export` (CSV, same filters, Excel-friendly), `GET/PATCH /admin/inventory` (+ bulk availability). `GET /api/public/live-catalog`: price and stock straight from the database, merged into the shop, so price/stock edits are live without Publish and the shop shows what checkout charges. Dashboard API adds sales figures. Page Content → Company gains **GSTIN** and **GST state** (for invoices). 8 new tests (`tests/test_admin_orders.py`); **126 passed**.
- **Admin screens:** Dashboard (received this month / all time, orders, to confirm, to ship, out of stock, enquiries; recent orders; low stock; content counts; quick actions; recent edits). **Orders** (status tabs with counts, search, date range, Export CSV; table; panel with progress bar and one-click next step, status, payment status, delivery details, customer, items, invoice, notes, delete; `?open=id` links). **Deliveries** board (To pack → Shipped → Out for delivery → Delivered; late deliveries flagged; one-click next step). **Inventory** (availability, pieces, price, M.R.P. edited in place and saved instantly; filters incl. low stock; bulk mark in stock / made to order / out of stock). **Tax invoice** page (seller with GSTIN/CIN, buyer, place of supply, CGST + SGST for same-state or IGST, amount in words, print / save as PDF). Products form: availability select + pieces. Sidebar regrouped: Sales, Catalogue, Website, Careers, System.
- **Theme:** navy sidebar in both modes (SYMMETRY wordmark, gold "Admin", gold active item); light mode uses navy accents; dark mode uses the site's navy/ivory/gold tokens (`.admin-theme` in `index.css`).
- **Shop:** out-of-stock products can't be added (cards, product page, quick view, Buy Now); "Only N left" when 1–3 remain; cart flags pieces that sold out and blocks Place order until they're removed.
- **Verified:** build passes; lint 0 errors, 45 warnings (none new). Backend 126 tests pass. Headless Chromium against a copy of the API on the throwaway `symmetry_test` database (demo admin + 5 sample orders; nothing touched the real database), light/dark 1440 px and 390 px: login, dashboard, orders + panel, deliveries, inventory edit saved, CSV download, invoice, products; no page errors, no horizontal scroll on phone. Shop: sold-out product page button disabled, "only 1 left" shown; checkout regression flow still passes. Fixed after screenshots: order numbers wrapping, filter bar cramped, long dashboard title on phones.
- **Preview updated** (frontend only). Backend + migrations 0006/0007 **not deployed**; on the preview the admin's new order/inventory screens need the new API. Not committed.

### 2026-10-18: Admin check against the three requested lists; permanent delete; full browser test
**Why:** requested again: every admin feature for orders (view, status, invoice, deliveries, export), inventory (products add/edit/delete, categories, multiple images, stock, prices, in/out of stock) and content (banners, products, categories, collections, projects, blogs, testimonials, team, enquiries, orders, media) working against the backend and database, admin in the website's theme, and every test passing. Most of this was built on 2026-10-17 (entry above); this session checked it end to end and filled the one gap.
- **Gap fixed: Delete.** Content could only be archived. New `DELETE /api/admin/<resource>/{id}` (all 9 content types) works only on **archived** items (409 otherwise), so nothing is lost with one click. A category can't be deleted while any product, archived ones included, uses it. Admin: a **Delete permanently** icon (with confirmation) next to Restore on the Archived tab. 11 new backend tests.
- **Verified:** backend **136 passed, 1 skipped**; lint 0 errors (45 warnings, none new); build passes. A Playwright run of the real admin UI against the new API on the throwaway `symmetry_test` database: **88/88 checks pass**. It covers sign-in (wrong password refused), all 19 admin screens, orders (one-click next step, status, payment, delivery details, invoice number + tax invoice page, status filter, CSV export of every order), the deliveries board, inventory (price live on the shop without Publish, 0 pieces = can't be sold, bulk out of stock), products (create with 3 photos, edit, validation, archive, delete), categories (create/delete, protected while in use), banners, collections, projects, journal, testimonials and team (edit/archive/restore/delete), Publish reaching the public content, the Contact form reaching Enquiries (reply status, notes, delete), Media Library, light/dark and 390 px phone (no sideways scroll), sign-out, and no JS errors. Each step is checked against the database through the API.
- **Deployed 2026-10-18** (the client ran the commands; the agent's own deploy was blocked by its permission system). Backups first: `/root/backups/symmetry-before-deploy-2026-10-18-0753.dump` and `application_files-2026-10-18.tgz`. Migrations 0005–0007 applied, API and web containers rebuilt; `/api/health` shows `"migration":"0007"`. Live check: 11 pages at 1440 and 390 px with no errors or sideways scroll, admin pages need sign-in, new admin code served. This also put the 2026-10-17 redesign, checkout (Razorpay + COD) and Careers uploads live. Committed (`8d31e49` backend, `e22eea1` frontend) and pushed to GitHub.
- **To do in the admin:** Page Content → Company → GSTIN / GST state (for invoices) and Careers email/HR phone, then Publish. Online payment stays off until Razorpay keys are added (OPERATIONS).

### 2026-10-18: SEO and performance (frontend + backend, not deployed)
**Why:** requested: editable meta titles/descriptions, SEO-friendly URLs, image alt text, XML sitemap, robots.txt, schema markup, breadcrumbs, fast pages; responsive, cross-browser, WebP, lazy loading, Core Web Vitals.
- **Page heads from the API** (`app/seo.py`, `app/api/seo.py`): Caddy sends every page request to `GET /api/public/page` (path in `X-Page-Path`), which fills the `<!--seo-->` block of index.html with title, description, robots, canonical, Open Graph/Twitter tags, JSON-LD and preloads. Plain index.html if the API fails (Caddy `handle_response` / `handle_errors`). Index and Vite manifest fetched from a localhost-only Caddy site (`127.0.0.1:8090`, `FRONTEND_INDEX_URL`).
- **Schema:** business (HomeAndConstructionBusiness, from Page Content → Company) on Home/About/Contact, WebSite, Product (live DB price, INR, availability; no review stars), CreativeWork for projects, BlogPosting, BreadcrumbList on every inner page.
- **Editable meta:** new Page Content → **SEO** tab (9 fixed pages + default share photo, Google preview with length hints, `site_sections` page `seo`, no migration); product/project/journal SEO fields now used. Defaults in `app/seo.py` STATIC_PAGES = `src/lib/seoDefaults.js`.
- **URLs:** products at `/shop/<slug>`; `/shop/<sku>` → 301; trailing slash → 301; unknown pages 404 + noindex; cart/checkout/admin noindex.
- **Sitemap / robots:** `/sitemap.xml` (every published page, rebuilt on Publish) and `/robots.txt` from the API.
- **Alt text:** published content carries Media Library alt text by URL (`imageAlt`); `SmartImage` uses it. Media Library: **Missing alt text** filter with count (`?noalt=true`, `missingAlt`). Decorative background marked `aria-hidden`.
- **Performance:** main photo + page code preloaded from the head (LCP load delay 2.5–3.2 s → 0); Unsplash photos now resized + AVIF/WebP with srcset like Cloudinary (`sizedUrl`, mirrored in `app/seo_images.py`); 828 px WebP copies of design photos for phones; chat and search code load after first paint; intro only when a visit starts on Home; layout shift fixed (`main` flow-root + min height: Projects CLS 1.0 → 0.001); image cache headers.
- **Accessibility:** light-theme greys darkened to 4.5:1+; heading order fixed (Shop, product page, testimonials).
- **Verified:** backend 156 passed, 1 skipped (20 new SEO tests); lint 0 errors; build passes. Local copy of production (new Caddyfile → API → `symmetry_test`): 44/44 SEO and cross-browser checks (Chromium, Firefox, WebKit at 390 and 1440 px), 88/88 admin checks, page fallback with the API stopped. Lighthouse mobile (slow-4G simulation), before → after: SEO 92 → 100; accessibility 91–96 → 96–100; product page LCP 5.4–6.0 s → 4.1 s; Shop LCP 4.7–5.9 s → 4.2–4.6 s; CLS ≤ 0.1 everywhere. Performance score still ~50–65: the remaining time is JavaScript start-up (React + animation library) before the first photo can be drawn; pre-rendering is the next step for 90+.
- Not deployed (needs API rebuild + web rebuild; no migration).

### 2026-10-18: Nightly backups and monthly restore test (server)
**Why:** no automatic backups existed (only two manual copies); the live database now holds real orders.
- `symmetry_backend/ops/backup.sh` (cron 02:15): `pg_dump` custom format (checked with `pg_restore --list`), applicant-files volume archive, row counts; root-only files in `/root/backups/nightly/`; keeps 14 daily / 8 weekly / 12 monthly; log + `last-success`.
- `ops/restore-test.sh` (cron 1st of month 03:45): restores into the new scratch database `symmetry_restore_test` (created once by the postgres admin, owned by symmetry_owner), compares row counts, empties it afterwards (also on failure).
- **Verified:** first backup + restore OK (24 tables, migration 0007, counts match); a truncated backup is reported as FAILED; thinning keeps the right days (tested with fake dates); both scripts run in cron's minimal environment.
- **Off-server copy:** not set up; the client chose server-only for now.

### 2026-10-18: Health checks with email alerts (server)
- `symmetry_backend/ops/healthcheck.sh` (cron every 5 min): pages, API + DB, containers, backup age, disk, certificate expiry; one retry for page checks; emails on problem start, every 6 h while it lasts, and on recovery (`ops/send_alert.py`, SMTP settings in `.env`). State and log in `/root/backups/monitor/`.
- `ops/setup-alert-email.sh`: the client enters a Gmail address + app password in the terminal (never in chat); sends a test email. **Pending: client to run it.**
- **Verified:** live checks pass; simulated outage + stale backup gives one alert, no repeat on the next run, then a recovery message; works in cron's environment. The client chose server email over an outside service, so a fully down server cannot alert.

## Known issues (open)
| # | Issue | Fixed by |
|---|---|---|
| 1 | ~~Admin edits don't reach the public site~~ | ✅ Fixed 2026-10-10 (Parts C, D1, D2) |
| 2 | ~~Admin Products page shows broken thumbnails and "Out of Stock"~~ | ✅ Fixed 2026-10-10 (Part D1) |
| 3 | ~~Demo admin login in the browser~~ | ✅ Fixed 2026-10-10: server-side login (Part B) |
| 4 | ~~Forms save only to the visitor's browser~~ | ✅ Fixed 2026-10-10 (Part D2) |
| 5 | ~~Site is plain HTTP on a public IP~~ | ✅ Fixed 2026-10-10: HTTPS via Caddy |
| 6 | 61 placeholder Unsplash images and sample prices | Client uploads via Cloudinary (see [ASSETS.md](ASSETS.md)) |
| 7 | ~~`supabase_schema.sql` has open write policies~~ | ✅ Deleted with all Supabase code (Part D2) |
| 8 | ~~Changes not committed; backend not in git~~ | ✅ Fixed 2026-10-10: committed locally; not pushed yet |
| 9 | ~~Category count labels were fixed marketing text~~ | ✅ Fixed 2026-10-10: real product counts (Part D2) |
| 10 | ~~Page titles repeat the brand~~ | ✅ Fixed 2026-10-11 (Step 6a) |
| 13 | **Phone numbers need confirming:** the site used +91 98765 43210 (a common placeholder) in most places and +91 99634 99635 in the mobile menu and floating WhatsApp. Now: phone = 98765…, WhatsApp = 99634… | Client sets the real numbers in Admin → Page Content → Company & Contact |
| 12 | `FlippingCollections` (unused component) calls an undefined `setUserInteracted`; it would crash if used | Delete the component or fix it when it's needed |
| 11 | ~~One large JS bundle for every page~~ | ✅ Fixed 2026-10-11: per-page loading, first-load JS 188 KB, no admin code for visitors |
| 14 | ~~Home's intro animation delays the headline by about 2–3 s~~ | ✅ 2026-10-14: ~1.5 s, once per session (in preview; deploy pending) |
