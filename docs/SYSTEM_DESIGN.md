# Symmetry Interiors: Backend & Image Delivery System Design

| | |
|---|---|
| **Status** | Draft for review |
| **Last updated** | 2026-10-10 (database built) |
| **Scope** | Backend API, database, admin authentication, image upload and delivery, hosting |

---

## 1. Goals

1. **Fast website.** Pages feel instant on mid-range phones on 4G.
2. **High-quality images with low latency.** About 1,000+ high-resolution photos (products, projects, banners, journal), with no visible loss in quality and no slow loading.
3. **Client self-service.** The client uploads and manages all images and content from the admin portal; no developer is needed.
4. **Secure admin.** Real authentication, HTTPS everywhere, and no secrets in the browser.
5. **Low running cost.** Runs on the existing VPS plus Cloudinary's free or entry plan at launch.

### Performance targets

| Metric | Target |
|---|---|
| Largest Contentful Paint (LCP), mobile 4G | < 2.0 s |
| Cumulative Layout Shift (CLS) | < 0.05 |
| Initial JavaScript (public site) | < 200 KB gzipped |
| Product grid thumbnail | 25–60 KB |
| Full-width hero image | 150–300 KB |
| Public content API response (cached) | < 50 ms server time |

---

## 2. Current state and constraints

- **Frontend:** React 19 + Vite + Tailwind SPA, currently served by nginx in Docker on the VPS at `169.58.13.62:8080` over plain HTTP.
- **Data:** the website still runs in demo mode, reading static files in `src/data/*.js` and the browser's `localStorage` via `src/services/adminDataService.js`. The PostgreSQL database is now built (section 6), but the frontend isn't connected to it yet. The Supabase code paths will be removed when the frontend switches to the FastAPI backend.
- **Admin login:** checked only in the browser, with demo credentials. It is not secure.
- **Images:** the client holds the originals and will upload them through the admin portal. They are not on the server yet.
- **No domain yet.** Only the IP address is available.

### Known issues this design resolves
- Admin edits are not shown on the public site, because public pages import static data directly.
- Product fields don't match between the storefront and admin: `images`/`inStock` vs `image`/`in_stock`.
- Forms (contact, careers, checkout) save only to the visitor's own browser.
- The site uses plain HTTP, so passwords would be sent unencrypted.

---

## 3. High-level architecture

```
                         ┌──────────────────────── VPS (Docker Compose) ────────────────────────┐
                         │                                                                       │
 Visitor / Admin ─HTTPS─▶│  Caddy :443  (auto TLS via Let's Encrypt, https://169-58-13-62.sslip.io) │
                         │    ├── /            → React build (static, long-cache hashed assets)   │
                         │    └── /api/*       → FastAPI :8000                                    │
                         │                         ├── auth, admin CRUD, upload signatures        │
                         │                         ├── public content endpoint (cached)           │
                         │                         └── PostgreSQL :5432 (internal network only)   │
                         │  backup (cron) → nightly pg_dump → off-server storage                  │
                         └───────────────────────────────────────────────────────────────────────┘

 Admin browser ──(1) request signature──▶ FastAPI
               ──(2) upload original directly──────────────▶ Cloudinary (storage + transforms + CDN)
               ──(3) send upload result──▶ FastAPI ──verify──▶ Cloudinary Admin API
                                              └──save asset──▶ PostgreSQL

 Visitor browser ──images──▶ res.cloudinary.com (global CDN; never touches the VPS)
```

### Components

| Component | Technology | Responsibility |
|---|---|---|
| Reverse proxy | **Caddy** | HTTPS certificates (automatic), serving static files, compression, proxying `/api` to FastAPI, short caching of public API responses |
| Frontend | **React + Vite** (existing) | Public website and admin portal |
| API | **FastAPI** (Python) | Authentication, admin CRUD, Cloudinary upload signatures, upload verification, publishing, public content |
| Database | **PostgreSQL 16** | All content, media metadata, enquiries, applications, orders, admin users |
| Media | **Cloudinary** | Storing originals, generating optimised variants (format, size, quality), global CDN delivery |
| Backups | cron + `pg_dump` | Nightly database backups stored off-server |

---

## 4. HTTPS without a domain

Browsers block HTTPS pages from calling plain-HTTP APIs ("mixed content"), and admin credentials must never travel over HTTP. Until a domain is bought:

- Use **`169-58-13-62.sslip.io`**. sslip.io turns any IP address into a hostname that resolves back to that IP.
- **Caddy** obtains a Let's Encrypt certificate for that hostname automatically.
- The site and API share **one origin** (`/` and `/api`), so no CORS setup is needed.

**When a domain is bought:** point its DNS at the VPS, change the hostname in the `Caddyfile`, and update `CLOUDINARY_NOTIFICATION_URL` and the allowed origin in the API config. Nothing else changes.

---

## 5. Image pipeline

> **As built (Part E):**
> - The account is on the Free plan: **max 10 MB / 25 MP per image**. The 40 MB figure below doesn't apply on this plan.
> - The admin resizes photos **in the browser** to ≤3000 px (JPEG 0.9) before upload when needed.
> - Preset `symmetry_signed`: signed, the formats `jpg, jpeg, png, webp, avif, heic`, an incoming `c_limit` cap at 3000 px, unique file names, no overwrite. **No eager transformations**, because the website requests `f_auto` and eager files would never be used.
> - The website builds `f_auto,q_auto,c_limit,w_N` srcsets via `src/lib/images.js` and `<SmartImage>`, plus a `w_32,e_blur` placeholder.
> - The 158 `public/drive_products` photos were imported to `symmetry/products/`. The 12 that were already in use were converted in place, so the same asset ids stayed linked.

### 5.1 Upload flow (client adds photos)

```
React Admin Media Library
   │  1. Admin selects one or many original photos
   ▼
FastAPI  POST /api/admin/media/sign
   │  2. Checks the admin session → returns { signature, timestamp, api_key, folder, upload_preset }
   ▼
Cloudinary (direct browser upload, original file)
   │  3. Stores the original, applies the incoming cap (3000 px), pre-generates eager variants
   ▼
FastAPI  POST /api/admin/media
   │  4. Verifies the upload (response signature + Admin API lookup) → saves a media_assets row
   ▼
Admin attaches the asset to a product / project / banner → Publish
```

**Rules:**
- Originals go **straight from the browser to Cloudinary**. Large files never pass through the VPS.
- The **Cloudinary API secret lives only in FastAPI** (environment variable) and is never sent to the browser.
- FastAPI signs **fixed values only**: `timestamp`, `folder`, `upload_preset`, and optionally `public_id`. The client cannot choose its own folder or transformations.
- Signatures expire about 1 hour after their timestamp (Cloudinary's rule).
- **Never trust the client's upload result.** FastAPI checks the response signature with the API secret, then confirms with the Cloudinary Admin API that the file exists and is in an allowed folder, before saving it.

### 5.2 Cloudinary configuration

**Folders:** `symmetry/products`, `symmetry/projects`, `symmetry/banners`, `symmetry/journal`, `symmetry/team`, `symmetry/misc`

**Upload preset `symmetry_signed`** (signed mode):

| Setting | Value | Why |
|---|---|---|
| Signed | Yes | Prevents anonymous uploads |
| Allowed formats | `jpg, jpeg, png, webp, heic, avif` | Rejects other file types |
| Max file size | 40 MB | Fits camera originals |
| Incoming transformation | `c_limit,w_3000,h_3000` | Still very high quality; roughly halves storage |
| Eager transformations | `f_auto,q_auto,c_limit,w_400`; `w_800`; `w_1600` | Common sizes are ready before the first visitor |
| Eager async | Yes | Upload returns quickly |
| Unique filename | Yes | Avoids name collisions |
| Notification URL | `https://<host>/api/webhooks/cloudinary` | Optional confirmation and moderation hook |

### 5.3 Delivery URLs

Store the **`public_id` + `version`**, never full URLs. The frontend builds URLs with a small helper:

```
https://res.cloudinary.com/<cloud_name>/image/upload/f_auto,q_auto,c_limit,w_800/v<version>/<public_id>
```

| Parameter | Effect |
|---|---|
| `f_auto` | Sends AVIF, WebP or JPEG, whichever the browser supports best |
| `q_auto` | Picks the smallest file size with no visible quality loss |
| `c_limit,w_N` | Resizes to N px wide, never enlarging |
| `v<version>` | A new version gives a new URL, so CDN caches can be kept for a long time with no stale images |

**Blur placeholder:** `f_auto,q_1,w_32,e_blur:1000`, about 300 bytes, shown instantly.

**Standard widths (srcset):** 400, 800, 1200, 1600, 2400.

### 5.4 `<SmartImage>` component (frontend)

One reusable component, used everywhere images appear: product cards, galleries, project heroes, banners, journal, team.

```jsx
<SmartImage asset={asset} sizes="(min-width: 1024px) 33vw, 100vw" priority={false} />
```

What it does:
- Builds a `srcset` from the standard widths plus the `sizes` attribute. Phones download about 50 KB; desktops get sharp images.
- Sets `width`/`height` from the asset metadata, so the layout doesn't shift while loading.
- Shows the blur placeholder as a background, then fades in the full image on load.
- Uses `loading="lazy"` and `decoding="async"` by default.
- With `priority`, uses `fetchpriority="high"` and no lazy loading (for the LCP / hero image).
- Uses `alt` from the asset's `alt_text`.

Also add to `index.html`:
```html
<link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
```

The official Cloudinary React SDK is **not** used: a small custom helper avoids about 40 KB of extra JavaScript.

### 5.5 Deletion and orphan cleanup

- Deleting an asset in admin → FastAPI checks it isn't in use → calls Cloudinary `destroy` → deletes the row.
- **Nightly orphan job:** lists Cloudinary files under `symmetry/` and deletes any older than 24 h that have no `media_assets` row. These come from uploads where the admin closed the tab before saving.

---

## 6. Data model (PostgreSQL)

**Status: built.** The schema lives in the separate backend project `../symmetry_backend`: SQLAlchemy models in `app/db/models/`, Alembic migrations `0001_initial_schema` and `0002_sessions_and_search_columns`, and a seed loaded from the frontend's sample content. Setup and commands are in `symmetry_backend/README.md`.

### Database and roles
- Database `symmetry` on the host's PostgreSQL 16 (`127.0.0.1:5432`). Extensions: `citext` and `pg_trgm`.
- **`symmetry_owner`**: owns the schema; Alembic migrations run as this role.
- **`symmetry_app`**: runtime role for FastAPI. It has data access only (SELECT/INSERT/UPDATE/DELETE) and cannot create or drop tables. Default privileges grant it every new table automatically.

### Conventions
- `id uuid` primary key (`gen_random_uuid()`), plus a readable `slug` (and `sku` for products, e.g. `sym-001`).
- `created_at` / `updated_at timestamptz`; `updated_at` is maintained by the `set_updated_at()` trigger.
- Content tables add `status` (`draft` / `published` / `archived`), `published_at`, `position` (manual order) and `extra jsonb`. `extra` holds display-only fields that have no column.
- Image links use `ON DELETE RESTRICT`, so an image in use cannot be deleted. Join tables use `ON DELETE CASCADE` from their parent.

### Tables (23)

| Area | Table | Notes |
|---|---|---|
| Auth | `admin_users` | `email citext unique`, argon2id `password_hash`, `role` owner/editor, `is_active`, `last_login_at` |
| | `admin_sessions` | Server-side login sessions: `token_hash` (SHA-256 of the cookie token, never the token itself), `csrf_token`, `ip`, `user_agent`, `expires_at`, `last_seen_at`, `revoked_at` |
| | `login_attempts` | Every login attempt (`email`, `ip`, `succeeded`) for rate limiting across API workers and audit |
| Media | `media_assets` | `provider` = `cloudinary` (needs `public_id`, `version`) or `external` (needs `external_url`; used for seeded/legacy URLs). Also `resource_type` (image/raw/video), `original_filename` (trigram-indexed, so the client can search "LC0045"), `tags[]`, `folder`, `width`, `height`, `format`, `bytes`, `alt_text`, `caption`, `uploaded_by` |
| Catalogue | `categories` | `slug`, `name`, `description`, `item_count_label`, `cover_asset_id` |
| | `collections`, `product_collections` | Named product groupings with ordering |
| | `products` | `sku`, `slug`, `name`, `category_id`, `price`, `original_price`, `rating`, `review_count`, `badge`, `featured`, `lead_time`, `in_stock`, `stock_status`, `dimensions`, `description`, `materials[]`, `finishes[]`, `default_finish`, `fabrics[]`, `default_fabric`, `colors jsonb`, `details[]`, `care_instructions[]` |
| | `product_images` | `(product_id, asset_id, position)` |
| Portfolio | `projects` | `slug`, `title`, `typology`, `location`, `completion_year`, `area_sqft`, `client`, `scope`, `summary`, `concept`, `challenge`, `solution`, `duration`, `materials_palette[]`, `stats jsonb`, `featured`, `hero_asset_id` |
| | `project_images` | `(project_id, asset_id, position)` |
| Content | `blogs`, `blog_images` | Journal posts; `content jsonb` (paragraphs), `tags[]`, `cover_asset_id`; related images with captions |
| | `banners` | Home hero slides with CTA and `active` |
| | `testimonials` | `quote`, `author`, `role`, `project_title`, `location`, `rating` 1–5, `avatar_asset_id`, `project_id` (link to the project page) |
| | `team_members` | `name`, `role`, `department`, `experience`, `credentials`, `bio`, `specialties[]`, `linkedin`, `photo_asset_id` |
| | `site_sections` | CMS page copy: one row per page (`home`, `about`, `services`, `sourcing`, `contact`, `footer`), `content jsonb` |
| | `publish_events` | Each Publish click: `published_by`, `content_hash` and `payload` (the full public-site JSON). The latest row is what `/api/public/content` serves, so it survives restarts. |
| Careers | `job_openings` | `slug`, `title`, `department`, `location`, `type`, `experience`, `summary`, `responsibilities[]`, `requirements[]`, `active`, `posted_at` |
| | `job_applications` | Candidate details and links; `status` new/shortlisted/interview/hired/rejected; `notes`; `source_page`, `ip` |
| CRM | `inquiries` | Contact form; `status` unread/read/replied/archived; `source_page`, `ip` |
| | `orders` | Catalogue **order requests** (no online payment): `order_number`, `customer_name`, `customer_email`, `customer_phone` (searchable columns), `customer jsonb` (address details), `items jsonb`, totals, `status` |
| | `newsletter_subscribers` | `email citext unique`, `source`, `unsubscribed_at` |
| Customers | `customers` | Shop accounts: `email citext unique`, `full_name`, `phone` (required at sign-up), `password_hash` (argon2, optional), `email_verified_at`, saved `address jsonb`, `is_active` (admin can switch off), `last_login_at`. Migration 0008 |
| | `customer_sessions`, `customer_codes`, `customer_login_attempts` | Sign-in sessions (token hash + CSRF), hashed 6-digit email codes, password rate limiting. Migration 0008 |
| | `customer_cart_items` | The signed-in customer's cart (same on every device): `customer_id`, `product_id`, `finish`, `fabric` ('' = none), `quantity` 1–20; unique per customer + product + finish + fabric. Prices are never stored, always read live. Migration 0009 |
| | `email_outbox` | Queued customer emails (sign-in codes, order updates), sent by the API's worker with retries. Migration 0008 |

### Indexes
- Every foreign key.
- `(status, position)` on content tables.
- Partial index on featured products.
- Trigram GIN indexes on `products.name`, `projects.title` and `media_assets.original_filename`, for admin search; a GIN index on `media_assets.tags`.
- SEO: `seo_title` / `seo_description` on products, projects and blogs.
- `login_attempts (email, created_at)` and `(ip, created_at)`; `admin_sessions (expires_at)`.
- `(status, created_at)` on `inquiries`, `job_applications` and `orders`.

### Seed snapshot (initial load)
| Table | Rows |
|---|---|
| categories | 12 |
| products | 20 |
| collections | 16 |
| projects | 12 |
| blogs | 16 |
| testimonials | 3 |
| team_members | 6 |
| job_openings | 4 |
| banners | 2 |
| site_sections | 6 |
| media_assets | 116 (external) |

The client replaces the sample images and items through the admin portal.

Marketing pages (Services, Sourcing hubs, About timeline / mission / why-choose) stay in frontend code for now and can move into the database later. `supabase_schema.sql` in the frontend repo is superseded by this schema.

---

## 7. API design (FastAPI)

Base path `/api`. JSON throughout. Admin routes need a valid session cookie.

### Public (no auth)

| Method | Path | Purpose | Caching |
|---|---|---|---|
| GET | `/public/content` | **Built.** All published site content in one response: sections, banners, categories, collections, products, projects, blogs, testimonials, team, jobs | `Cache-Control: no-cache` + `ETag` (revalidates every load and gets a 304 when unchanged) |
| GET | `/public/products/{slug}` | Single product (deep links) | Same |
| GET | `/public/projects/{slug}` | Single project | Same |
| POST | `/public/inquiries` | **Built.** Contact form; returns `reference` (INQ-XXXXXX) | 5 / 10 min / IP, honeypot |
| POST | `/public/applications` | **Built.** Careers form (`jobId` or `general`) | 5 / 10 min / IP, honeypot |
| POST | `/public/orders` | **Built.** Checkout; the server re-prices items, adds GST and shipping, returns `orderNumber` and totals | 5 / 10 min / IP, honeypot |
| POST | `/public/newsletter` | **Built.** Newsletter sign-up (always `{ok: true}`) | 5 / 10 min / IP, honeypot |

### Auth

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/login` | Email + password → sets an `httpOnly`, `Secure`, `SameSite=Strict` session cookie |
| POST | `/auth/logout` | Clears the session |
| GET | `/auth/me` | Current admin |

### Customer account (customer session cookie `__Host-symmetry_customer` + its own CSRF token)

| Method | Path | Purpose |
|---|---|---|
| POST | `/account/register` | Name, email, **phone (required)**, password → emails a code to confirm the address |
| POST | `/account/code`, `/account/code/verify` | Email a 6-digit code / sign in with it (creates the account on first use) |
| POST | `/account/login`, `/account/logout` | Password sign-in / sign out |
| GET/PATCH | `/account/me` | Profile and saved address |
| POST | `/account/password` | Set or change the password |
| GET | `/account/orders`, `/account/orders/{number}` | My orders |
| GET/POST/DELETE | `/account/cart` | The account cart (with live price and stock) / add a line (published, sellable products only; adds up to 20) / empty it |
| PATCH/DELETE | `/account/cart/{id}` | Change a line's quantity / remove it (own lines only) |
| POST | `/account/cart/merge` | On sign-in: move the cart kept in the browser (and the item they tried to add) into the account |

**Buying needs sign-in:** `POST /public/orders` answers 401 `sign_in_required` without a customer session; a placed order belongs to the account and empties its cart. Browsing (`/public/content`, `/public/live-catalog`) stays open.

### Admin (auth required)

| Method | Path | Purpose |
|---|---|---|
| POST | `/admin/media/sign` | Returns a Cloudinary upload signature for an allowed folder |
| POST | `/admin/media` | Verifies the Cloudinary upload and saves a `media_assets` row |
| GET | `/admin/media` | List/search assets (paginated) |
| PATCH | `/admin/media/{id}` | Edit alt text / caption |
| DELETE | `/admin/media/{id}` | Delete (blocked if the asset is in use) |
| CRUD | `/admin/products`, `/admin/categories`, `/admin/projects`, `/admin/banners`, `/admin/blogs`, `/admin/testimonials`, `/admin/team`, `/admin/jobs`, `/admin/sections` | Content management |
| GET/PATCH | `/admin/inquiries`, `/admin/applications`, `/admin/orders` | View and update status/notes |
| GET | `/admin/customers` | Sign-ups with order count and amount spent; search (`q`), `status=active|disabled`, counts |
| GET/PATCH | `/admin/customers/{id}` | One customer with orders and cart size / switch the account off or on (`isActive`; off signs them out everywhere) |
| POST | `/admin/publish` | Rebuilds the public content cache and records a `publish_event` |
| GET | `/admin/dashboard` | Counts and recent activity |

### Webhooks

| Method | Path | Purpose |
|---|---|---|
| POST | `/webhooks/cloudinary` | Optional: confirms eager variants are ready; signature checked with the API secret |

### Public content caching

**As built (Part C):**
1. **Building the snapshot:** `app/content/snapshot.py` builds the snapshot from rows with `status = 'published'` (plus `active` for jobs and banners), ordered by `position`.
   - Records keep the **exact shape of the original frontend objects** (`id` = SKU or slug, `images`, `heroImage`, `relatedImages`, `categoryName`, `date` as "January 04, 2025"…), so pages only changed where they get data from.
   - A test checks every record against the original seed data.
2. **Publishing:** `publish()` (`app/content/publish.py`) stores the snapshot in `publish_events.payload`, with `content_hash` = sha256 of the content (excluding `generatedAt`). Publishing unchanged content does not add a row.
   - Triggers: `POST /api/admin/publish` (needs a session and CSRF token; the button comes in Part D) or `python -m app.cli publish`.
   - **Bootstrap:** the first request after a deploy with no snapshot publishes one automatically.
3. **Serving:** `GET /api/public/content` serves the latest snapshot from a per-worker memory cache keyed by event id, so a request costs one primary-key query.
   - `ETag` is the hash. `If-None-Match` returns 304, which tolerates Caddy's `-zstd` ETag suffix and `W/`.
   - `Cache-Control: no-cache`, so a publish is visible on the next page load.
   - If the DB is down, the last cached snapshot is served; if there's nothing cached, 503.
4. **Size:** about 101 KB raw, 31 KB zstd. `index.html` preloads it in parallel with the JS bundle; one request per page load, and client-side navigation reuses it.
5. **Frontend:** `PublicContentContext` loads it once and refreshes when the tab regains focus after 5 minutes. Pages render `<ContentState>` (skeleton, or "Couldn't load, Retry") until it is ready. There is no fallback to bundled sample data.

---

## 8. Security

| Area | Measure |
|---|---|
| Transport | HTTPS only (Caddy + Let's Encrypt); HSTS header |
| Passwords | argon2id hashing; minimum length 10 |
| Sessions | **Built.** Server-side sessions (`admin_sessions`). Cookie `__Host-symmetry_session` (`HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`, no `Domain`). Only the SHA-256 of the token is stored. Signed out after 2 h idle, and always after 12 h. Revocable from the CLI. |
| Login abuse | **Built.** DB-backed (`login_attempts`): 5 failures per email or 20 per IP in 15 min gives 429 with `Retry-After`. Same error for a wrong password and an unknown email, and the same timing (dummy hash check). |
| CSRF | **Built.** `SameSite=Strict` + same-origin API, plus an `Origin`/`Referer` allow-list on every state-changing request, plus a per-session `X-CSRF-Token` header (constant-time compare). The token is returned by `/login` and `/me` and kept in memory only. |
| Roles | `owner` (everything, including users) and `editor` (content and media only) |
| Secrets | `CLOUDINARY_API_SECRET`, `DATABASE_URL`, `SESSION_SECRET` only in server environment variables / `.env` (not committed) |
| Database | Host PostgreSQL on `127.0.0.1` only; the API container uses host networking; no public DB or API port |
| Uploads | Signed preset, fixed folders, format and size limits, server-side verification |
| Public forms | Rate limiting, input validation (Pydantic), honeypot field against spam |
| Removed | **Done.** The browser-only demo login, the "any email containing admin" shortcut and the `symmetry_admin_authed` localStorage flag (deleted on load) |

---

## 9. Frontend performance plan

- **One `<SmartImage>` component everywhere** (section 5.4).
- **Hero / LCP image:** `priority` → `fetchpriority="high"`, plus `<link rel="preload" as="image" imagesrcset=…>` on the page.
- **Code splitting:** each page loads with `React.lazy`; the whole admin portal is a separate chunk that visitors never download.
- **Pre-rendering:** generate static HTML for the main public pages (Home, Shop, Projects, Services, About, Careers, Contact) at build time, for a faster first paint and so Google can read the pages.
- **Static assets:** Vite-hashed files served with `Cache-Control: public, max-age=31536000, immutable`; `index.html` with `no-cache`.
- **Compression:** Caddy serves zstd/gzip.
- **Fonts:** self-host Inter (subset, `font-display: swap`) instead of Google Fonts, removing one extra connection.
- **Data:** one `/public/content` call, held in a React context; client-side search and filtering (around 1,000 items is small).

---

## 10. Deployment

### Docker Compose services

**As built (2026-10-10):** both containers use **host networking**, and PostgreSQL is the host's system service (not a container).

```
symmetry_react/docker-compose.yml    web  (Caddy)    :80 :443 (+ :8080 redirect)  TLS, React build, /api → 127.0.0.1:8000
symmetry_backend/docker-compose.yml  api  (FastAPI)  127.0.0.1:8000 only          uvicorn ×2 workers, non-root
host systemd                         PostgreSQL 16   127.0.0.1:5432 only          database `symmetry`
planned                              backup (cron)   nightly pg_dump → compressed, kept 14 days, copied off-server
```

### Environment variables (FastAPI)

```
ENVIRONMENT=prod
DATABASE_URL=postgresql+psycopg://symmetry_app:<pw>@127.0.0.1:5432/symmetry
MIGRATIONS_DATABASE_URL=postgresql+psycopg://symmetry_owner:<pw>@127.0.0.1:5432/symmetry
SESSION_SECRET=<random 64 bytes>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
CLOUDINARY_UPLOAD_PRESET=symmetry_signed
PUBLIC_ORIGIN=https://169-58-13-62.sslip.io
```

The frontend needs only `VITE_CLOUDINARY_CLOUD_NAME` (public) and calls the API on the same origin (`/api`).

### Backups and recovery
- Nightly `pg_dump`, kept for 14 days, copied off the VPS (e.g. to Cloudinary-independent object storage or another machine).
- Cloudinary holds the image originals. Optionally enable Cloudinary's backup add-on, or run a periodic export of the originals.
- Restore test: restore a backup into a scratch database once a month.

---

## 11. Cost estimate

**Cloudinary** (one credit ≈ 1 GB storage, 1 GB bandwidth or 1,000 transformations; the free plan is about 25 credits a month; check current terms):

| Usage | Approximate credits |
|---|---|
| 1,000 images, capped at 3000 px (~2–3 GB) | ~3 / month (storage) |
| Variants (1,000 × ~5 sizes × formats) | ~5–10, mostly one-time at upload |
| Bandwidth: ~1.5 MB per visit × 5,000 visits / month | ~7–8 / month |

That fits the free plan at launch. Upgrade when traffic grows past roughly 10,000 visits a month.

**VPS:** the existing server. Postgres + FastAPI + Caddy need well under 1 GB of RAM at this scale.

**Domain (later):** about ₹800–1,200 per year.

---

## 12. Implementation phases

| Phase | Deliverables |
|---|---|
| **1. Foundation** | Caddy + sslip.io HTTPS; FastAPI skeleton; Postgres schema + migrations (Alembic); admin users, login and sessions; remove the demo login |
| **2. Media pipeline** | Cloudinary account + `symmetry_signed` preset; `/admin/media/sign` + verify endpoints; admin Media Library with multi-upload, progress and alt text; orphan cleanup job |
| **3. Content migration** | Admin CRUD on FastAPI; replace `adminDataService.js` (localStorage/Supabase) with API calls; one-off seed script that imports the current `src/data/*.js`; fix the product field mismatch |
| **4. Public site** | `/public/content` + publish flow; `<SmartImage>` everywhere; public pages read live content; contact, careers and checkout forms post to the API |
| **5. Performance** | Code splitting, pre-rendering, self-hosted fonts, preload for hero images; Lighthouse in CI; real-user metrics |
| **6. Hardening** | Rate limiting, CSRF, backups + restore test, monitoring/alerts (uptime + error logging) |

---

## 13. Open decisions

| # | Decision | Recommendation |
|---|---|---|
| 1 | Remove Supabase completely in favour of FastAPI + Postgres | Yes, one backend to maintain |
| 2 | Host everything on the current VPS behind `169-58-13-62.sslip.io` | Yes, until a domain is bought |
| 3 | Session cookie vs JWT for admin auth | Server-side session cookie (simpler to revoke) |
| 4 | Real payment gateway (Razorpay) in scope? | Separate project; checkout stays an enquiry/order request for now |
| 5 | Resume upload as a file (vs link) on Careers | Later: use Cloudinary `raw` uploads in a private folder via the same signing flow |
