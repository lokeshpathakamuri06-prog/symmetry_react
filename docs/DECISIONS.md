# Decision Log

Newest first. Each entry records what was decided, and why. If a decision changes, add a new entry rather than editing the old one.

| Date | Decision | Why | Alternatives considered |
|---|---|---|---|
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
