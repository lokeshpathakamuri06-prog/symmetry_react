# Project Status

_Last updated: 2026-10-11 (Step 6a: faster website)_

## Summary
| Area | State |
|---|---|
| Public website | ✅ All content and page text from PostgreSQL; forms save to the database |
| Admin portal UI | ✅ Built; Apple-style light/dark theme; **real server-side login** (content still in browser storage until Parts C/D) |
| Careers (site + admin) | ✅ Jobs and applications in the database |
| Hosting | ✅ Caddy (frontend repo) + FastAPI (backend repo), Docker host networking |
| System design | ✅ Written ([SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)) |
| PostgreSQL database | ✅ 23 tables, migrations 0001–0002, seed, first admin user |
| FastAPI backend | 🟡 Live: `/api/health` and admin auth (`/api/auth/*`); content endpoints next |
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
| 14 | Home's intro animation delays the headline by about 2–3 s on phones (the main remaining LCP cost) | Client decision: keep, shorten, or show it only on the first visit |
