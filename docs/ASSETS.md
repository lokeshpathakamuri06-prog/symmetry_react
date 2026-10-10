# Assets Inventory

_Last updated: 2026-10-10._ Paths are relative to `symmetry_react/`. Everything here will eventually move to Cloudinary, except logos, icons and the PDF, which stay with the site.

## Summary
| Asset group | Location | Count / size | Status |
|---|---|---|---|
| Product photos (client, LC series) | Cloudinary `symmetry/products/LC00xx(-n)` (originals also still in `public/drive_products/`) | 158 files, 21 MB | ✅ All 158 in the Media Library; 7 products use them. Delete the local folder once the client confirms |
| Page hero images | `public/images/hero/*.jpeg` | 17 files | ✅ Used as page banners |
| Home about image | `public/images/home/home-about.jpeg` | 1 | ✅ Used |
| Placeholder stock photos | Unsplash URLs in code | **61 unique** URLs | ❌ Must be replaced with client photos |
| Product catalogue | `public/Symmetry-Interiors-Catalog.pdf` | 4.6 MB | ✅ Download link in header/footer |
| Logos | `src/assets/logo.png` (light), `src/assets/logo-dark.png` (dark), `public/logo-emblem.svg` (favicon) | 3 | ✅ Used |
| CTA / hero graphics | `src/assets/cta-banner-full.png`, `cta-clean-bg.png`, `cta-interior.png`, `hero.png` | 4 (≈1.5 MB together) | ✅ Used; candidates for compression |
| Unused template files | `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg`, `public/favicon.svg` | 4 | 🗑️ Can be deleted |

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

## Rules for images going forward
- Upload originals only through the admin Media Library, which goes to Cloudinary. Don't put new photos in `public/`.
- Never use full URLs in content; reference the media asset.
- Folders in Cloudinary:
  - `symmetry/products`, `symmetry/projects`, `symmetry/banners`
  - `symmetry/journal`, `symmetry/team`, `symmetry/categories`, `symmetry/misc`
