# Operations: Running Things on the Server

_Last updated: 2026-10-10._ Server: Ubuntu 24.04, IP `169.58.13.62`. Docker is installed. PostgreSQL 16 runs as a system service.

## Addresses
| What | URL |
|---|---|
| Website | https://169-58-13-62.sslip.io |
| Admin | https://169-58-13-62.sslip.io/admin/login |
| API health | https://169-58-13-62.sslip.io/api/health |
| Old addresses | `http://169.58.13.62` and `http://169.58.13.62:8080` redirect to the HTTPS site |

`169-58-13-62.sslip.io` is a free hostname that points to the server IP, so HTTPS works without a domain. When a domain is bought, change the hostname in `symmetry_react/Caddyfile` (2 places) and `PUBLIC_ORIGIN` in the backend `.env`.

## What's running
| Service | Where it's defined | Listens on |
|---|---|---|
| `web`: Caddy (TLS, React build, `/api` proxy) | `symmetry_react/docker-compose.yml` + `Caddyfile` | `:80`, `:443`, `:8080` (redirect only) |
| `api`: FastAPI (uvicorn, 2 workers) | `symmetry_backend/docker-compose.yml` | `127.0.0.1:8000` (not reachable from outside) |
| PostgreSQL 16 | systemd `postgresql@16-main` | `127.0.0.1:5432` (local only) |

Both containers use **host networking**. They talk to each other and to Postgres over `127.0.0.1`.

## Deploy / restart
| Task | Command |
|---|---|
| Deploy frontend changes | `cd /root/dev/symmetry_react && docker compose up -d --build` |
| Deploy backend changes | `cd /root/dev/symmetry_backend && docker compose up -d --build` |
| Apply new DB migrations (before deploying the backend) | `cd /root/dev/symmetry_backend && .venv/bin/alembic upgrade head` |
| Logs | `docker compose logs -f` (in either folder) |
| Status | `docker ps` (the API shows `(healthy)`) |

Migrations are **never** run automatically on container start.

**Admin orders / inventory (2026-10-17, deployed 2026-10-18):** migration **0007** (product availability + stock count; order delivery and invoice columns, statuses shipped / out_for_delivery). Deploy together with 0006 below: `.venv/bin/alembic upgrade head`, rebuild the API, check `/api/health` shows `"migration":"0007"`, then deploy the frontend. Afterwards fill **Page Content → Company → GSTIN / GST state** and Publish (printed on invoices). Downgrade of 0007 turns shipped / out-for-delivery orders back into `processing`.

**Shop payments: Razorpay + Cash on Delivery (2026-10-17, code deployed 2026-10-18; Razorpay keys not set yet).** Deploy in this order:
1. Backend: `.venv/bin/alembic upgrade head` (migration **0006**: `orders.payment_status`, `razorpay_order_id`, `razorpay_payment_id`, `paid_at`; additive, existing orders become `unpaid`), then `docker compose up -d --build`. Check `/api/health` shows `"migration":"0006"`.
2. Deploy the frontend. Until Razorpay keys are set, online methods place the order as **unpaid** and checkout tells the shopper a payment link will follow; Cash on Delivery works.
3. Turn on online payment: in the Razorpay dashboard (KYC done) create API keys, then add to `symmetry_backend/.env`: `RAZORPAY_KEY_ID=rzp_live_…`, `RAZORPAY_KEY_SECRET=…` (use `rzp_test_…` keys first to try it), and rebuild the API. Never put the secret in the frontend or docs.
4. Webhook (marks orders paid even if the shopper closes the page): Razorpay dashboard → Webhooks → URL `https://<host>/api/public/payments/razorpay-webhook`, events `payment.captured`, `order.paid`, `payment.failed`, a secret → `RAZORPAY_WEBHOOK_SECRET=…` in `.env`.
5. Optional: `COD_ENABLED=false` turns Cash on Delivery off; `COD_MAX_TOTAL=200000` limits it to orders up to ₹2,00,000 (incl. GST).

**Careers form with file uploads (2026-10-17, deployed 2026-10-18).** Deploy in this order:
1. Backend: `.venv/bin/pip install -e .` (adds `python-multipart`), then `.venv/bin/alembic upgrade head` (migration **0005**: file and consent columns, additive), then `docker compose up -d --build`. This creates the `application_files` Docker volume, mounted at `/data/uploads`.
2. Check: `curl -s https://169-58-13-62.sslip.io/api/health` shows `"migration":"0005"`.
3. Then deploy the frontend. The old JSON endpoint `/api/public/applications` still works, so the order only matters for the new page.
4. Fill in Admin → Page Content → Company & Contact → *Careers page* (careers email, HR phone), then Publish.

**Applicant files** (resumes, portfolios) live in the `application_files` volume (`/data/uploads/applications/<id>/`). They are personal data; the nightly backup includes them (see § Backups). Files left behind by a failed request are removed with `docker compose exec api python -m app.cli application-files-cleanup` (add `--dry-run` to list them first). Uploads are limited to 5 MB (resume) and 15 MB (portfolio) by the API.

## Local development
```bash
# Terminal 1: API with auto-reload (docs at http://127.0.0.1:8000/api/docs)
cd /root/dev/symmetry_backend && .venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2: frontend dev server; /api is proxied to 127.0.0.1:8000 (vite.config.js)
cd /root/dev/symmetry_react && npm run dev
```
Stop the `api` container first (`docker compose stop api`) if it is using port 8000.

To view the API docs from your own computer:
1. Run the API in dev mode as above.
2. Run `ssh -N -L 8000:localhost:8000 root@169.58.13.62`.
3. Open http://localhost:8000/api/docs.

## TLS certificates
- Issued by Let's Encrypt and renewed automatically by Caddy (current certificate valid until 2027-01-08).
- Stored in the Docker volume `symmetry_react_caddy_data`. **Never delete this volume.** Re-issuing on every deploy would hit Let's Encrypt rate limits.
- Issuance needs inbound ports 80 and 443 open at the hosting provider. They are open now.

## Database (`/root/dev/symmetry_backend`)
| Task | Command |
|---|---|
| Apply migrations | `.venv/bin/alembic upgrade head` |
| Check models vs DB | `.venv/bin/alembic check` |
| Re-seed sample content | `.venv/bin/python -m app.cli seed -v` |
| Add an admin | `.venv/bin/python -m app.cli create-admin --email … --role editor` |
| Open psql as superuser | `sudo -u postgres psql -d symmetry` |
| From your computer (DB tool) | SSH tunnel; see below |

**DB tool over SSH**:
1. Run `ssh -N -L 5433:localhost:5432 root@169.58.13.62`.
2. Connect your DB tool to host `localhost`, port `5433`, database `symmetry`.
3. Log in as user `symmetry_app` (data) or `symmetry_owner` (schema). The password is in the backend `.env`.

You can also use your DB tool's built-in SSH Tunnel option instead: SSH `root@169.58.13.62`, DB host `127.0.0.1:5432`.

## Git
| Repo | Branch | Remote |
|---|---|---|
| `symmetry_react` | `develop` (work), `main` (stable) | GitHub `origin`; `develop` not pushed yet |
| `symmetry_backend` | `main` | none yet |

## Secrets: where they are (never in git, never in chat)
| Secret | Location |
|---|---|
| DB passwords (`symmetry_owner`, `symmetry_app`) | `symmetry_backend/.env` (chmod 600) |
| Owner admin password (`admin@symmetryinteriors.com`) | Only with the person who created it. Reset by deleting the row and re-running `create-admin`. |
| Cloudinary key/secret (later) | `symmetry_backend/.env` |

## Accounts
| Account | Purpose |
|---|---|
| `admin@symmetryinteriors.com` (owner) | The only admin. Signs in at `/admin/login` |
| `admin@symmetry.com` / `admin123` | **Removed.** The demo login no longer works |

## Admin login and sessions
- An admin is signed out after **2 hours of inactivity**, and always **12 hours** after signing in.
- **5 wrong passwords** for one email, or **20** from one IP, within 15 minutes block sign-in for that email or IP until the oldest failure is 15 minutes old.

| Task (run in `/root/dev/symmetry_backend`) | Command |
|---|---|
| Forgot password: new one, printed once, signs out all devices | `.venv/bin/python -m app.cli reset-password --email admin@symmetryinteriors.com` |
| Sign an admin out everywhere (lost laptop) | `.venv/bin/python -m app.cli revoke-sessions --email …` |
| Add an editor | `.venv/bin/python -m app.cli create-admin --email … --role editor --full-name "…"` |
| Clean up old sessions and login attempts | `.venv/bin/python -m app.cli prune` |
| Unblock a rate-limited email now | `sudo -u postgres psql -d symmetry -c "delete from login_attempts where email='…'"` |

## Editing content (admin)
- **Edit** in the admin screens (Products, Categories, Collections, Projects, Journal, Banners, Testimonials, Team, Job Openings), then **Save**. The website is not changed yet.
- The header shows **Unpublished changes**. Click **Publish** to update the website; visitors see it on their next page load.
- **Archive** hides an item (after Publish). Find it under **Archived** and **Restore** it; it comes back as a **Draft**, so set it to Published and Publish again.
- **Images:** paste an image URL, or pick from the **Media Library**. Uploading files directly arrives with Cloudinary (Part E).
- If two people edit the same item, the second save shows "changed by someone else". Close the editor and reopen it to get the latest version.

## Inbox (admin)
- **Contact Enquiries:** messages from the Contact page. Set the status (unread / read / replied / archived) and add notes. **View newsletter subscribers** has an **Export CSV** button.
- **Applications:** candidates from Careers (new / shortlisted / interview / hired / rejected).
- **Customer Orders:** order requests from Checkout, with the price taken from the catalogue at the time of ordering. There is no online payment yet, so follow up with the customer.
- The sidebar badges count unread enquiries, new applications and pending orders.
- **Delete** in the inbox is permanent, for when someone asks for their details to be removed.

## Page text and contact details
- **Admin → Page Content:** Company & Contact (phones, WhatsApp, emails, addresses, hours, socials), Home, About, Contact page, Footer.
- Save each tab, then **Publish**. The phone, email and WhatsApp change everywhere: header menu, footer, Contact page and WhatsApp buttons.

## ⚠️ Never re-run the seed on live data
`python -m app.cli seed` overwrites products, projects, page text and the rest with the original sample content. It also relinks the imported photos back to local files, **undoing the Cloudinary import**. It is only for a fresh or test database. **Do not run it on the live database.**

## Cloudinary (images)
- **Account:** cloud `pft7pzaf`, Free plan (25 credits a month; **max 10 MB and 25 MP per image**). Keys are in `symmetry_backend/.env`.
- **Usage:** check it at cloudinary.com, or with `python -m app.cli cloudinary-setup`, which also prints credits used.

| Task (in `/root/dev/symmetry_backend`) | Command |
|---|---|
| Create or update the upload preset (after changing settings) | `.venv/bin/python -m app.cli cloudinary-setup` |
| Bulk-import a folder of photos (safe to re-run) | `.venv/bin/python -m app.cli cloudinary-import --dir <folder> --folder products` |
| Remove abandoned uploads (older than 24 h, not in the library) | `.venv/bin/python -m app.cli cloudinary-cleanup` (`--dry-run` to preview) |
| Merge duplicate image records (repair) | `.venv/bin/python -m app.cli media-dedupe` |

**Nightly cleanup** (optional): add to root's crontab with `crontab -e`:
```
30 3 * * * cd /root/dev/symmetry_backend && .venv/bin/python -m app.cli cloudinary-cleanup >> /var/log/symmetry-cloudinary-cleanup.log 2>&1
```

## Publishing content
- The public site shows the **latest published snapshot** of the database, not live rows.
- After changing content directly in the DB, run:
  ```bash
  cd /root/dev/symmetry_backend && .venv/bin/python -m app.cli publish
  ```
  It prints `published new snapshot` or `unchanged`. Visitors see the change on their next page load.
- From Part D, the admin **Publish** button does the same.
- **Site shows old content?** Run `publish`. If the API was just restarted, wait a few seconds: pages show a Retry button while the API is starting.
- After a fresh deploy, the first request creates a snapshot automatically if none exists.

## Preview (check new work before it goes live)
Since 2026-10-18: **https://preview.169-58-13-62.sslip.io** (admin: `/admin/login`). Not indexed by Google (`X-Robots-Tag`).
- Containers `symmetry-preview-web` (Caddy on 127.0.0.1:4190 with a host-agnostic site `http://:4190` so the forwarded preview hostname matches; serves `/root/preview/dist`) and `symmetry-preview-api` (127.0.0.1:8002, image `symmetry-preview-api`, settings `/root/preview/api.env`). The live Caddy forwards the preview hostname to 4190.
- Database `symmetry_preview`: copy of the live content and admin accounts, **without** orders, enquiries, applications or subscribers. Orders and accounts made there never reach the live site.
- Refresh the preview with new code (run migrations on `symmetry_preview` first if any):
  - Backend: `docker restart` keeps the **old** image, so recreate the container: `cd /root/dev/symmetry_backend && docker build -t symmetry-preview-api . && docker rm -f symmetry-preview-api && docker run -d --name symmetry-preview-api --network host --restart unless-stopped --env-file /root/preview/api.env symmetry-preview-api uvicorn app.main:app --host 127.0.0.1 --port 8002 --workers 2 --proxy-headers --forwarded-allow-ips 127.0.0.1`.
  - Frontend: build (Node runs in Docker: `docker run --rm -v "$PWD":/app -v symmetry_nm:/app/node_modules -w /app node:22 npx vite build --outDir <dir>`), then copy the files **into** `/root/preview/dist` (empty it first; don't rename or replace the folder, the web container mounts it). Then recreate the preview API as above so it picks up the new `index.html`.
- Emails from the preview use the same SMTP settings as live; re-copy them into `/root/preview/api.env` after running `ops/setup-alert-email.sh`.

## Backups (nightly, on this server)
Set up 2026-10-18. Scripts are in `symmetry_backend/ops/`; root's crontab runs them:

| When | What |
|---|---|
| Every night 02:15 | `ops/backup.sh`: database (`pg_dump`, checked after writing), applicant files (resumes/portfolios volume), row counts |
| 1st of each month 03:45 | `ops/restore-test.sh`: restores the newest backup into the scratch database `symmetry_restore_test`, compares row counts, then empties it again |

- Files: `/root/backups/nightly/` (root-only): `symmetry-YYYY-MM-DD.dump`, `.counts`, `application-files-YYYY-MM-DD.tgz`. About 1 MB per night.
- Kept: every night for 14 days, Sundays for 8 weeks, the 1st of each month for a year.
- Log: `/root/backups/nightly/backup.log` (every run says `ok` or `FAILED`); `last-success` holds the time of the last good backup.
- Check by hand: `tail /root/backups/nightly/backup.log`; run now: `/root/dev/symmetry_backend/ops/backup.sh`; test a restore: `ops/restore-test.sh` (optionally with a dump path).
- **Not yet off the server:** the copies protect against mistakes and bad updates, not against losing the server. Adding an encrypted off-server copy (Backblaze B2, Google Drive, …) is a short follow-up.

### Restoring the live database (emergency only)
1. Stop the API so nothing writes meanwhile: `cd /root/dev/symmetry_backend && docker compose stop api`.
2. Take a copy of the current state first: `ops/backup.sh` (it is dated today; rename it if today's backup must be kept).
3. Restore the chosen night (this replaces everything in the live database):
   `pg_restore --clean --if-exists --no-owner --dbname="$(grep '^MIGRATIONS_DATABASE_URL=' .env | cut -d= -f2- | sed 's#+psycopg##')" /root/backups/nightly/symmetry-YYYY-MM-DD.dump`
4. If the backup is from before a migration, the code and database must match: check `.venv/bin/alembic current`, then `docker compose up -d --build api` and `curl -s https://169-58-13-62.sslip.io/api/health`.
5. Applicant files: `docker run --rm -v symmetry_backend_application_files:/d -v /root/backups/nightly:/b alpine:3.20 sh -c 'cd /d && tar xzf /b/application-files-YYYY-MM-DD.tgz'`.
6. In the admin, click **Publish** so the website shows the restored content.

## Tests
```bash
cd /root/dev/symmetry_backend && .venv/bin/pytest -q
```
The tests run against the separate `symmetry_test` database, never `symmetry`. It was created once with `sudo -u postgres psql -f db/create_test_db.sql`.

## Health checks
**Automatic (every 5 minutes, since 2026-10-18):** `symmetry_backend/ops/healthcheck.sh` from root's crontab checks the pages (`/`, `/shop`, `/sitemap.xml`), the API and database, both containers, the last nightly backup (< 26 h), disk (< 85 %) and the HTTPS certificate (> 14 days). It emails `ALERT_EMAIL` when a problem starts, every 6 hours while it lasts, and when it is fixed. Log: `/root/backups/monitor/health.log`; current state: `/root/backups/monitor/state`.
- **Email setup (once):** `/root/dev/symmetry_backend/ops/setup-alert-email.sh`. It asks for a Gmail address and an app password (https://myaccount.google.com/apppasswords), stores `SMTP_*` and `ALERT_EMAIL` in `symmetry_backend/.env` and sends a test email. Until then, problems are only logged.
- Limit: if the whole server is down, it cannot send anything. An outside service (Healthchecks.io, Better Stack) would cover that.

By hand:
```bash
/root/dev/symmetry_backend/ops/healthcheck.sh && cat /root/backups/monitor/state   # ok / problem
curl -s https://169-58-13-62.sslip.io/api/health          # {"status":"ok","db":"ok","migration":"0007",...}
curl -sI https://169-58-13-62.sslip.io/ | head -1          # HTTP/2 200
sudo -u postgres psql -d symmetry -Atc "select count(*) from products"   # 20
```
