# Project Status

_Last updated: 2026-10-10 (Part B: real admin login)_

## Summary
| Area | State |
|---|---|
| Public website | ✅ Built and running (demo data) |
| Admin portal UI | ✅ Built; Apple-style light/dark theme; **real server-side login** (content still in browser storage until Parts C/D) |
| Careers (site + admin) | ✅ Built (stores in browser only until the API exists) |
| Hosting | ✅ Caddy (frontend repo) + FastAPI (backend repo), Docker host networking |
| System design | ✅ Written ([SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)) |
| PostgreSQL database | ✅ 23 tables, migrations 0001–0002, seed, first admin user |
| FastAPI backend | 🟡 Live: `/api/health` and admin auth (`/api/auth/*`); content endpoints next |
| Cloudinary image pipeline | ⏳ After FastAPI |
| Frontend connected to backend | ⏳ Not yet; site still uses `src/data` + `localStorage` |
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

## Known issues (open)
| # | Issue | Fixed by |
|---|---|---|
| 1 | Admin edits don't reach the public site (public pages import `src/data` directly) | Step 4: connect frontend to API |
| 2 | Admin Products page shows broken thumbnails and "Out of Stock" (field mismatch: `images`/`inStock` vs `image`/`in_stock`) | Step 4 |
| 3 | ~~Demo admin login in the browser~~ | ✅ Fixed 2026-10-10: server-side login (Part B) |
| 4 | Forms (contact, careers, checkout, newsletter) save only to the visitor's browser | Step 4 |
| 5 | ~~Site is plain HTTP on a public IP~~ | ✅ Fixed 2026-10-10: HTTPS via Caddy |
| 6 | 61 placeholder Unsplash images and sample prices | Client uploads via Cloudinary (see [ASSETS.md](ASSETS.md)) |
| 7 | `supabase_schema.sql` has open write policies | Superseded; delete when Supabase code is removed |
| 8 | ~~Changes not committed; backend not in git~~ | ✅ Fixed 2026-10-10: committed locally; not pushed yet |
| 9 | Category `item_count_label` texts ("6 Models", "5 Designs") are marketing copy, not real counts (most categories have 1–2 sample products) | Show real counts from the API in Step 4, or the client edits the labels |
| 10 | Page titles repeat the brand (e.g. "… \| Symmetry Interiors \| Symmetry Interiors & Building Solutions"): pages pass the brand and `SeoMeta` appends it again | Step 6 SEO pass |
| 11 | Main JS bundle is 299 KB compressed (target < 200 KB): the admin portal and all pages ship in one file | Step 6: code splitting per route |
