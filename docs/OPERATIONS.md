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

## Tests
```bash
cd /root/dev/symmetry_backend && .venv/bin/pytest -q
```
The tests run against the separate `symmetry_test` database, never `symmetry`. It was created once with `sudo -u postgres psql -f db/create_test_db.sql`.

## Health checks
```bash
curl -s https://169-58-13-62.sslip.io/api/health          # {"status":"ok","db":"ok","migration":"0002",...}
curl -sI https://169-58-13-62.sslip.io/ | head -1          # HTTP/2 200
sudo -u postgres psql -d symmetry -Atc "select count(*) from products"   # 20
```
