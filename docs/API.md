# API Reference

FastAPI backend in `/root/dev/symmetry_backend`, served by Caddy at `https://169-58-13-62.sslip.io/api`.

Interactive docs: `/api/docs`, **dev mode only**. Run the API locally with `ENVIRONMENT=dev`; see [OPERATIONS.md](OPERATIONS.md).

## Conventions
| Topic | Rule |
|---|---|
| Base path | Every route is under `/api` |
| JSON keys | **camelCase** (schemas extend `app.api.schemas.CamelModel`); the DB is snake_case |
| Errors | `{"error": {"code": "...", "message": "...", "field": "<optional field>"}}` |
| Validation | **422**, with `field` naming the input that failed (camelCase) |
| Conflicts | **409**: duplicate id, edited by someone else, or a guarded delete/archive |
| Rate limits | **429** with a `Retry-After` header |
| Auth | Session cookie `__Host-symmetry_session` (HttpOnly, Secure, SameSite=Strict). Sessions end after 2 h idle and always after 12 h |
| CSRF | Every non-GET admin request needs header `X-CSRF-Token` (from `/auth/login` or `/auth/me`) **and** an allowed `Origin` |
| Public writes | Allowed `Origin` required; per-IP limits; a honeypot field `website` |

Frontend clients: `src/lib/api.js` (fetch wrapper), `src/services/adminApi.js` (admin) and `src/services/publicApi.js` (forms).

---

## Health
| Method | Path | Response |
|---|---|---|
| GET | `/health` | `{status, db, migration, version}`; **503** if the DB is down |

## Auth (`app/api/auth.py`)
| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/login` | `{email, password}` | `{user: {id, email, fullName, role}, csrfToken}` and sets the cookie. 401 on bad credentials; 429 after 5 failures per email or 20 per IP in 15 min |
| GET | `/auth/me` | — | Same shape as login; 401 if not signed in |
| POST | `/auth/logout` | — | 204; revokes the session (needs CSRF) |

## Public content (`app/api/public.py`)
| Method | Path | Notes |
|---|---|---|
| GET | `/public/content` | The latest **published snapshot**. Keys: `categories` (with `productCount`), `collections`, `products`, `projects`, `blogs`, `testimonials`, `team`, `jobs`, `banners`, `siteSections` (`home`, `about`, `contact`, `company`, `footer`), `version`, `generatedAt` |

- **Caching:** `ETag` = content hash. `If-None-Match` returns **304** (tolerates Caddy's `-zstd` suffix and `W/`). `Cache-Control: no-cache`.
- **Bootstrap:** creates the first snapshot automatically if none exists.
- **DB down:** serves the last cached snapshot.
- **Record shapes** match the original frontend objects:
  - products: `id` = SKU, `images[]`, `categoryName`, `inStock`…
  - projects: `heroImage`, `galleryImages[]`, `stats[]`…
  - blogs: `date` as "January 04, 2025", `relatedImages[{url, caption}]`…

## Public forms (`app/api/public_forms.py`)
All forms: allowed Origin, honeypot `website` (if filled, the API answers success but saves nothing), **5 per 10 minutes per IP**, optional `sourcePage`.

| Method | Path | Body (camelCase) | Response |
|---|---|---|---|
| POST | `/public/inquiries` | `name`, `email`, `phone`, `message` (≥10 chars), `service?`, `budget?` | 201 `{reference: "INQ-XXXXXX"}` |
| POST | `/public/applications` | `name`, `email`, `phone`, `jobId?` (a job slug or `general`), `experienceYears?`, `portfolioUrl?`, `resumeUrl?`, `message?` | 201 `{reference, jobTitle}`; 422 `jobId` if the job is closed |
| POST | `/public/orders` | `customer{fullName, email, phone, address, city, state, country, pincode, accessNotes?}`, `items[{id, quantity 1–20, selectedFinish?, selectedFabric?}]`, `paymentMethod` (`upi\|card\|netbanking\|wallet\|cod`) | 201 `{orderNumber, items, subtotal, tax, shipping, totalAmount, customer, paymentMethod, createdAt}` |
| POST | `/public/newsletter` | `email` | `{ok: true}` (the same answer whether new or existing) |

**Order rules:**
- Prices come from **published** products in the DB; client prices are ignored.
- GST is 18%, rounded to the rupee.
- Shipping is ₹0 above a ₹1,50,000 subtotal, otherwise ₹3,500.
- Card and UPI details are never accepted or stored.

---

## Admin: content (`app/api/admin_content.py`, codecs in `app/content/records.py`)
**Resources:** `products` (id = SKU), `categories`, `collections`, `projects`, `blogs`, `banners`, `testimonials`, `team`, `jobs` (id = slug).

| Method | Path | Notes |
|---|---|---|
| GET | `/admin/{resource}?status=active\|published\|draft\|archived\|all&q=` | `{items, counts}`. `active` (default) excludes archived |
| GET | `/admin/{resource}/{id}` | One record |
| POST | `/admin/{resource}` | Create. The `id` is optional: products get the next `sym-0NN`, others a unique slug from the title or name. 409 if the id exists. Defaults to `draft` |
| PUT | `/admin/{resource}/{id}` | Full update. Send `updatedAt` from the last read: **409** if the row changed since. The `status` may be `draft` or `published` |
| POST | `/admin/{resource}/{id}/archive` | Sets `archived`. Categories with products give 409 |
| POST | `/admin/{resource}/{id}/restore` | Archived becomes `draft` |
| PUT | `/admin/{resource}-order` | `{ids: [...]}` sets the display order |

- **Records** are the public snapshot shape plus `status` and `updatedAt`. Testimonials also include `projectId` (the linked project's slug).
- **Images** are URLs. Our own Cloudinary URLs resolve to their existing asset (by `public_id`); other known URLs reuse their asset; an unknown URL creates an `external` asset.
- **Validation** (422 with `field`): required fields, price ≥ 0, rating 0–5, image URL format, ≥1 product image, colour hex `#RRGGBB`, known category/collection/project, ≥1 blog paragraph.

## Admin: publishing, dashboard, page text (`app/api/admin.py`)
| Method | Path | Notes |
|---|---|---|
| POST | `/admin/publish` | Builds and stores a snapshot. `{contentHash, created, publishedAt}`. `created: false` if nothing changed |
| GET | `/admin/publish/status` | `{hasUnpublishedChanges, lastPublishedAt, lastPublishedBy}` |
| GET | `/admin/dashboard` | Counts by status, `openJobs`, `media`, `recentEdits[]` |
| GET | `/admin/sections` | `{pages: {page: {field: value}}, optional: {page: [fields]}}` (saved, not necessarily published) |
| PUT | `/admin/sections/{page}` | Replace a page's text. Only known fields; required fields can't be empty; length limits; email and social link formats. Field list: `app/content/sections.py` |

## Admin: media
| Method | Path | Notes |
|---|---|---|
| GET | `/admin/media?q=&unused=true` | `{items: [{id, url, provider, filename, folder, altText, tags, width, height, usedIn, createdAt}]}` |
| POST | `/admin/media` | `{url, altText?}`, add by URL |
| POST | `/admin/media/sign` | `{folder}` (one of `products, projects, banners, journal, team, categories, misc`) → `{cloudName, apiKey, uploadUrl, timestamp, folder, uploadPreset, signature}`. The browser then POSTs the file to `uploadUrl` with exactly these fields. 503 if Cloudinary is not configured |
| POST | `/admin/media/cloudinary` | `{publicId, version, signature, originalFilename?, altText?}`, the Cloudinary upload result. Verified with the API secret **and** re-read from the Admin API; it must be under `symmetry/`. 201 with the media record; 403 if invalid; idempotent per `publicId` |
| PATCH | `/admin/media/{id}` | `{altText?, tags?}` (tags are lower-cased and de-duplicated) |
| DELETE | `/admin/media/{id}` | 204; **409** if used anywhere. Cloudinary images are also destroyed remotely (CDN invalidated); a remote failure gives 502 and keeps the record |

## Admin: inbox (`app/api/admin_inbox.py`)
| Method | Path | Notes |
|---|---|---|
| GET | `/admin/{inquiries\|applications\|orders}?status=&q=` | `{items, counts, statuses}` (newest first, max 500) |
| PATCH | `/admin/{kind}/{id}` | `{status?, notes?}`; 422 on an unknown status |
| DELETE | `/admin/{kind}/{id}` | 204, **permanent** |
| GET | `/admin/inbox/counts` | `{unreadInquiries, newApplications, pendingOrders, subscribers}` |
| GET | `/admin/newsletter?format=json\|csv` | List, or a CSV download |
| POST | `/admin/newsletter/{id}/unsubscribe` | Marks unsubscribed |

Statuses: inquiries `unread, read, replied, archived` · applications `new, shortlisted, interview, hired, rejected` · orders `pending, confirmed, processing, delivered, cancelled`.

---

## Example: edit and publish with curl
```bash
H=https://169-58-13-62.sslip.io
curl -s -c jar -H "Origin: $H" -H 'Content-Type: application/json' \
  -d '{"email":"admin@symmetryinteriors.com","password":"…"}' $H/api/auth/login   # note csrfToken
CSRF=…
curl -s -b jar $H/api/admin/products/sym-001 > p.json                              # edit p.json (keep updatedAt)
curl -s -b jar -X PUT -H "Origin: $H" -H "X-CSRF-Token: $CSRF" -H 'Content-Type: application/json' \
  --data @p.json $H/api/admin/products/sym-001
curl -s -b jar -X POST -H "Origin: $H" -H "X-CSRF-Token: $CSRF" $H/api/admin/publish
```

## Tests
- 78 pytest cases in `symmetry_backend/tests/`, run against the separate `symmetry_test` database: `.venv/bin/pytest -q`.
- Key guarantees:
  - The snapshot matches the original data exactly.
  - Re-saving every record unchanged is lossless.
  - Auth and CSRF are required on every admin write.
