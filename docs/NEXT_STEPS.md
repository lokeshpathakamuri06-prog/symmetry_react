# Next Steps

_Last updated: 2026-10-10_. Work top to bottom; each step lists what "done" means. Architecture details are in [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md).

## Step 0: Save the work (do first, ~15 min)
- [ ] Commit the frontend changes in `symmetry_react` (admin theme, Careers, Docker, docs).
- [ ] `git init` in `symmetry_backend` and make the first commit (`.env` is already gitignored).
- [ ] Decide where the repos are pushed (GitHub / GitLab), and whether frontend and backend stay as two repos.

**Done when:** both folders are in git, and nothing is committed that contains secrets.

## Step 1: HTTPS (Caddy + sslip.io)
- [ ] Replace the frontend's nginx container with **Caddy**, serving `https://169-58-13-62.sslip.io`.
- [ ] Caddy serves the React build at `/` and proxies `/api/*` to FastAPI (added in Step 2).
- [ ] Open ports 80 and 443; close 8080.

**Done when:** the site loads over HTTPS with a valid certificate, and http redirects to https.

## Step 2: FastAPI foundation (in `symmetry_backend`)
- [ ] FastAPI app (`app/main.py`), settings, DB session using the existing models.
- [ ] Auth: `POST /api/auth/login` (argon2 verify against `admin_users`), `logout`, `me`. httpOnly session cookie, login rate limit.
- [ ] Public read: `GET /api/public/content` (one cached JSON with ETag).
- [ ] Docker: `fastapi` service in compose. Postgres connectivity from the container (README → "When FastAPI runs in Docker").
- [ ] Health check `GET /api/health`.

**Done when:** you can log in with `admin@symmetryinteriors.com` through the API over HTTPS, and `/api/public/content` returns the seeded data.

## Step 3: Cloudinary image pipeline
- [ ] **Needs from you:** Cloudinary **cloud name**, plus API key and secret. Put them in `symmetry_backend/.env` on the server; never paste them in chat or commit them.
- [ ] Create the signed upload preset `symmetry_signed` (formats, 40 MB limit, 3000 px cap, eager 400/800/1600).
- [ ] `POST /api/admin/media/sign` and `POST /api/admin/media` (verify, then save to `media_assets`).
- [ ] Admin Media Library: multi-upload with progress, alt text, delete (blocked if in use).
- [ ] Nightly cleanup of orphaned uploads.

**Done when:** the client can upload 20+ photos at once, and they appear in the Media Library with dimensions.

## Step 4: Connect the frontend to the backend
- [ ] Replace `src/services/adminDataService.js` (localStorage/Supabase) with API calls.
- [ ] Admin CRUD endpoints for products, categories, collections, projects, blogs, banners, testimonials, team, page text, jobs; inbox endpoints for inquiries, applications, orders.
- [ ] Public pages read `/api/public/content` instead of `src/data`, which fixes known issues 1 and 2.
- [ ] Contact, careers, checkout and newsletter forms POST to the API (known issue 4).
- [ ] Real admin login; remove the demo login (known issue 3).
- [ ] Publish button: rebuild the public content cache.
- [ ] Remove Supabase code and `supabase_schema.sql`.

**Done when:** an edit in admin, followed by Publish, shows on the public site from any device, and a form submitted on a phone appears in admin.

## Step 5: Fast images on the site
- [ ] `<SmartImage>` component: Cloudinary `f_auto,q_auto`, srcset, blur placeholder, lazy loading, priority hero.
- [ ] Use it everywhere images appear; `preconnect` to Cloudinary.
- [ ] Client replaces placeholder images and sample prices ([ASSETS.md](ASSETS.md)).

**Done when:** Lighthouse mobile LCP is under 2.0 s on Home, Shop and Project pages.

## Step 6: Performance and hardening
- [ ] Code splitting per route, so the admin bundle is separate. Pre-render the main pages. Self-host the Inter font.
- [ ] Nightly `pg_dump` backups copied off the server, plus a monthly restore test.
- [ ] Uptime monitoring and error logging.
- [ ] Security pass: CSRF, rate limits, headers.

## Later / optional
- Buy a domain, then change the hostname in the Caddyfile.
- Razorpay online payments (currently order requests only).
- Move Services, Sourcing and About content into the DB so the client can edit them.
- Resume file upload on Careers (currently a link).
