# Assets Inventory

_Last updated: 2026-10-13._ Paths are relative to `symmetry_react/`. Everything here will eventually move to Cloudinary, except logos, icons and the PDF, which stay with the site.

## Summary
| Asset group | Location | Count / size | Status |
|---|---|---|---|
| Product photos (client, LC series) | Cloudinary `symmetry/products/LC00xx(-n)` (originals also still in `public/drive_products/`) | 158 files, 21 MB | ✅ All 158 in the Media Library; 7 products use them. Delete the local folder once the client confirms |
| Page hero images | `public/images/hero/*.jpeg` + WebP copies (`-1280.webp`, `-2048.webp`) | 11 banners (unused ones deleted 2026-10-11) | ✅ Used; served as WebP |
| Home about image | `public/images/home/home-about.jpeg` + WebP copies | 1 | ✅ Used; served as WebP |
| Placeholder stock photos | Unsplash URLs in code | **61 unique** URLs | ❌ Must be replaced with client photos |
| Product catalogue | `public/Symmetry-Interiors-Catalog.pdf` | 4.6 MB | ✅ Download link in header/footer |
| Logos | `src/assets/logo.png` (light), `src/assets/logo-dark.png` (dark), `public/logo-emblem.svg` (favicon) | 3 | ✅ Used |
| Unused files | CTA PNGs, `hero.png`, template icons, 6 unused hero JPEGs | 5.4 MB | 🗑️ Deleted 2026-10-11 |

## Still in code (not editable in admin)
Checked 2026-10-13. Products, projects, journal, categories, team, jobs and testimonials all come from the admin; so do the Home slideshow and collections carousel (Step 7a).

| Where | What is fixed | Images |
|---|---|---|
| Page banners: About, Services, Projects, Sourcing, Shop, Journal, Contact, Careers | Photo | 8 local (`public/images/hero/`) |
| Home "About" block | Photo | 1 local (`public/images/home/`) |
| Home "Sourcing" carousel (`CoverflowSourcing`) | Photos and text | 5 Unsplash |
| Home scroll showcase (`DynamicScrollShowcase`) | Photos and text | 14 Unsplash |
| Home Instagram grid (`InstagramMosaic`) | Photos | 6 local (`/drive_products/`) |
| About page | Timeline, mission/vision, philosophy, why-choose, comparison, stats (`data/aboutData.js`) and 2 photos | 14 Unsplash |
| Services page | 6 services and process steps (`data/services.js`); also the header/mobile menu service list | 18 Unsplash |
| Sourcing page | Countries, process, stats (`data/sourcing.js`) | 20 Unsplash |
| Careers page | Perks list (`data/careers.js`) | none |
| Shop, Projects, Journal, Careers | Page headings | none |
| Catalogue pop-up and floating button | Cover picture | 1 Unsplash |
| Order Success page | Example order shown without a real order | 1 Unsplash |
| Logos, favicon, catalogue PDF | Meant to stay in code | 4 local |

Also in code, on purpose: the fallback photo shown when a product or category image is missing (product card, category card, quick view, cart).

**Editable, but still stock photos** (client replaces them by uploading; live counts 2026-10-13): products 21 of 33 photos, projects 30/30, journal 36/36, categories 11/12, team 5/6, testimonials 3/3.

## Where placeholders appear
Unsplash URLs are used in:
- **Data:** `src/data/` products, projects, blogs, categories, testimonials, aboutData (team), services, sourcing, siteDefaults (banners/collections).
- **Components:** product cards, quick view, the collection/sourcing carousels, the scroll showcase, category marquee, and the floating catalogue widget.
- **Pages:** About, Cart, Order Success; and admin page defaults (Products, Team, Banners, Testimonials, Media).

**In the database:** the seed stored every current image as a `media_assets` row with `provider = 'external'`. That is 116 rows, including Unsplash URLs and `/drive_products` paths. When the client uploads to Cloudinary, they replace these through the admin portal.

## What the client needs to provide
| Item | For | Notes |
|---|---|---|
| ~1,000 high-resolution photos | Products (3+ each), projects (hero + 4–5 gallery), journal covers, banners | Originals; any size up to 40 MB. Cloudinary creates the web sizes. |
| Team photos | About page (6 members) | Square or portrait, good light |
| Real product prices | 20 sample products | Current prices are samples (see `Symmetry_Content_Images_Pricing_Audit.md`) |
| Real project details | 12 sample projects | Names, locations and stats are illustrative |
| Real testimonials | 3 samples | With client permission |
| Alt text / captions | All images | Can be added in the Media Library |

## Replacing images (before Cloudinary uploads, by link)
1. Put the image somewhere public: a URL starting with `https://`, or a file under `public/` such as `/drive_products/LC0045.jpeg`.
2. In the admin editor (product, project and so on) paste the URL under **Images**, or click **Library** to reuse one already in the Media Library.
3. Reorder with the arrows. The first product photo is the main one.
4. Save, then **Publish**.

The Media Library shows where each image is used and only lets you delete unused ones. Direct uploads are now available: see ADMIN_GUIDE §6.

## Adding or replacing a page banner
1. Put the JPEG in `public/images/hero/` (about 2048 px wide is plenty).
2. Make the WebP copies:
   ```bash
   cd /root/dev/symmetry_react
   docker run --rm -v "$PWD":/app -v /tmp/sharp:/tools -w /tools node:22 sh -c "npm init -y >/dev/null && npm i --silent sharp; cd /app && NODE_PATH=/tools/node_modules node scripts/optimize-images.mjs"
   ```
3. Use it in the page with `{...heroImage('/images/hero/<name>.jpeg')}` (from `src/lib/staticImages.js`), then rebuild.

## Rules for images going forward
- Upload originals only through the admin Media Library, which goes to Cloudinary. Don't put new photos in `public/`.
- Never use full URLs in content; reference the media asset.
- Folders in Cloudinary:
  - `symmetry/products`, `symmetry/projects`, `symmetry/banners`
  - `symmetry/journal`, `symmetry/team`, `symmetry/categories`, `symmetry/misc`
