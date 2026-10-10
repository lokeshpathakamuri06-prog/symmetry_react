# Operations: Running Things on the Server

_Last updated: 2026-10-10._ Server: Ubuntu 24.04, IP `169.58.13.62`. Docker is installed. PostgreSQL 16 runs as a system service.

## What's running
| Service | How | Address |
|---|---|---|
| Website + admin (frontend) | Docker Compose in `symmetry_react` (nginx container `symmetry_react-web-1`) | http://169.58.13.62:8080 |
| PostgreSQL 16 | systemd `postgresql@16-main` | `127.0.0.1:5432` (local only) |
| FastAPI | Not yet | n/a |

## Frontend (`/root/dev/symmetry_react`)
| Task | Command |
|---|---|
| Rebuild and restart after code changes | `docker compose up -d --build` |
| Logs | `docker compose logs -f` |
| Stop | `docker compose down` |
| Status | `docker compose ps` |

The build bakes in the `VITE_*` env vars. There are none needed right now.

## Database (`/root/dev/symmetry_backend`)
| Task | Command |
|---|---|
| Apply migrations | `.venv/bin/alembic upgrade head` |
| Check models vs DB | `.venv/bin/alembic check` |
| Re-seed sample content | `.venv/bin/python -m app.cli seed -v` |
| Add an admin | `.venv/bin/python -m app.cli create-admin --email … --role editor` |
| Open psql as superuser | `sudo -u postgres psql -d symmetry` |
| Postgres status | `systemctl status postgresql@16-main` |

Full setup steps are in `symmetry_backend/README.md`.

## Secrets: where they are (never in git, never in chat)
| Secret | Location |
|---|---|
| DB passwords (`symmetry_owner`, `symmetry_app`) | `symmetry_backend/.env` (chmod 600) |
| Owner admin password (`admin@symmetryinteriors.com`) | Only with the person who created it. Reset by deleting the row and re-running `create-admin`. |
| Cloudinary key/secret (later) | `symmetry_backend/.env` |

## Accounts
| Account | Purpose |
|---|---|
| `admin@symmetryinteriors.com` (owner) | Real admin in the DB; works once FastAPI login is built |
| `admin@symmetry.com` / `admin123` | **Demo** login in the current frontend; removed in Step 4 |

## Health checks
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/          # website → 200
sudo -u postgres psql -d symmetry -Atc "select count(*) from products"   # → 20
```
