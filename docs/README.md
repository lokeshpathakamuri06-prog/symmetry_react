# Symmetry Interiors: Project Documentation

This folder is the single place to understand the project: what it is, what has been done, what is decided, and what comes next. Keep it up to date as work happens.

## The project in one paragraph
A website for **Symmetry Interiors & Building Solutions Pvt. Ltd.** (Ameerpet, Hyderabad). It combines a luxury interiors portfolio and a furniture catalogue, plus an **admin portal** where the client manages all content and images. The frontend is React; the backend is FastAPI + PostgreSQL; images will be stored and delivered by Cloudinary.

## Documents
| File | Read it when you want to know… |
|---|---|
| [ADMIN_GUIDE.md](ADMIN_GUIDE.md) | How to run the website day to day: Save and Publish, editing, images, page text, inbox (for the client's team) |
| [API.md](API.md) | Every backend endpoint, its rules and responses (for developers) |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | What has been built so far, and the current state of each part |
| [NEXT_STEPS.md](NEXT_STEPS.md) | What we do next, in order, with what "done" means for each step |
| [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) | The target architecture: backend, database, image pipeline, API, security |
| [MOTION_PLAN.md](MOTION_PLAN.md) | The plan for Apple-style scrolling, animations and polish on every public page |
| [DECISIONS.md](DECISIONS.md) | Why things are the way they are (decision log) |
| [ASSETS.md](ASSETS.md) | Every image, logo, document and placeholder, and what must be replaced |
| [OPERATIONS.md](OPERATIONS.md) | How to run, rebuild and check everything on the server |

## Where the code lives
| Folder | What |
|---|---|
| `/root/dev/symmetry_react` | Frontend: public website + admin portal (React 19, Vite, Tailwind) and the Caddy web server. Git repo, work on `develop`. |
| `/root/dev/symmetry_backend` | Backend: FastAPI app, database schema, migrations, seed. Git repo (no remote yet). |

## Current live address
- Website: https://169-58-13-62.sslip.io
- Admin: https://169-58-13-62.sslip.io/admin/login (real accounts only; see ADMIN_GUIDE)
- API health: https://169-58-13-62.sslip.io/api/health
