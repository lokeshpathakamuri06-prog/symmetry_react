# Requirement check and implementation plan

Checked on **2026-10-22** against *SYMMETRY INTERIORS WEBSITE REQUIREMENT DOCUMENT.pdf* (13 sections).
Every point was checked in the code and tested in a real browser on the **preview site**
(https://preview.169-58-13-62.sslip.io) at **phone (390 px), tablet (820 px) and desktop (1440 px)**.

**Status:** ✅ done and tested · 🟡 done, but needs your input or is only partly done · ❌ not built yet · ⏳ left for you (payment)

## Summary

| | Points |
|---|---|
| Requirement points (bullets) in the PDF | 194 |
| ✅ Done and tested | 171 |
| 🟡 Partly done / needs your input | 6 (Instagram feed ×2, loading speed ×3, backup copy) |
| ❌ Not built yet | 3 (Google Analytics, Google Search Console, Meta Pixel) |
| ⏳ Payment gateway, left for you | 7 (UPI, cards, net banking, wallets, Razorpay ×3) |
| Kept by your decision | 7 (5 colours, 2 fonts) |

**Tests run:** 391 browser checks of the website, shop and admin (3 screen sizes); shopping flow (sign-up → cart → checkout → admin) at 3 screen sizes; backend test suite (see "Test results" at the end).

**Update 2026-10-22 evening:** everything above is now **live** on https://169-58-13-62.sslip.io (Phase 3 done, except email). Until email (SMTP, Plan 2.1) is set up, new customers cannot finish creating an account, so they cannot buy yet.

---

## 1. Project overview — ✅
Brand, premium responsive website, enquiries, online purchase: all in place.

## 2. Design requirements

| Point | Status | Notes |
|---|---|---|
| Luxury, elegant, modern, minimal, premium | ✅ | |
| Colour palette (beige, white, black, warm grey, gold) | Kept by decision | Site uses navy/teal with gold accents, light and dark mode. You decided on 2026-10-22 to keep it. |
| Typography (serif headings, sans-serif body) | Kept by decision | Site uses Inter for headings and text. Kept on 2026-10-22. |
| Smooth scrolling | ✅ | |
| Fade-in sections | ✅ | |
| Hover effects | ✅ | |
| Subtle page transitions | ✅ | New page fades in and rises |

## 3. Website pages

### Home — ✅ (Netlify design, 2026-10-22)
| Section | Status |
|---|---|
| Hero banner (image/video, from Admin → Home Banners) | ✅ full first screen |
| About Symmetry Interiors | ✅ |
| Featured furniture collections | ✅ |
| Shop by category | ✅ |
| Featured products | ✅ |
| Featured projects (with filter) | ✅ |
| Global sourcing expertise | ✅ |
| Why choose us | ✅ |
| Client testimonials | ✅ |
| Blog highlights | ✅ |
| Instagram feed | 🟡 Photo grid with a link to your Instagram; not a live feed (see Plan 1.2) |
| Call to action | ✅ |
| Contact information | ✅ phone / email in the call-to-action and footer |

### About Us — ✅
Company story, legacy & experience, 25+ years of global sourcing, mission & vision, our team, why choose Symmetry.

### Services — ✅
Residential, commercial, hospitality, turnkey, customized furniture, furniture sourcing, lighting & decor.

### Shop — ✅
| Point | Status | Notes |
|---|---|---|
| 12 product categories | ✅ | All 12 from the PDF, managed in Admin → Categories |
| Category filters | ✅ | |
| Search bar | ✅ | |
| Sorting: price, latest, popular | ✅ | "Newest First" and "Most Popular" added 2026-10-22 |
| Product grid | ✅ | |
| Pagination | ✅ | |

### Product details — ✅
Multiple images, image zoom, description, dimensions, materials, finishes, colours, care instructions, price, stock status (in stock / made to order / only N left / sold out), quantity selector, add to cart, buy now, request customization, related products.

### Projects — ✅
Residential / commercial / hospitality filter; each project page has a gallery, description, scope of work and materials.

### Global Sourcing — ✅
Italy, China, Malaysia, Vietnam, Bali, each with images, description and products sourced.

### Blog — ✅
Interior design, furniture trends, buying guides, material guides, project highlights.

### Contact — ✅
Contact form (saved to Admin → Enquiries), phone, email, office address, Google Map, WhatsApp button, social media links.

## 4. E-commerce features

| Point | Status | Notes |
|---|---|---|
| Cart: add, update quantity, remove, order summary | ✅ | Customers sign in to add to cart; the cart is saved to their account |
| Checkout: name, email, phone, shipping address | ✅ | |
| Cash on delivery | ✅ | Tested: order placed and shown in admin |
| UPI, cards, net banking, wallets (Razorpay) | ⏳ | Code is built and tested with a simulated Razorpay window; needs your Razorpay keys and a real payment test (Phase 4) |
| Order management: view, update status, invoice, deliveries, export | ✅ | Tax invoice with GST, deliveries board, CSV export |
| Inventory: add/edit/delete products, categories, multiple images, stock, prices, in/out of stock | ✅ | |
| Customer accounts and order emails | ✅ | Extra (not in the PDF). Emails need SMTP set up (Plan 2.1) |

## 5. Common website features — ✅
Fully responsive, sticky header (hides while scrolling down, comes back when scrolling up), search, WhatsApp floating button, social media links, newsletter subscription, image gallery, product search, related products.

## 6. Admin panel (CMS) — ✅
Home banners, products, categories, collections, projects, blogs, testimonials, team members, enquiries, orders, media library. Also: page banners, page content, SEO, inventory, deliveries, customers, careers, applications, settings. All 20 admin screens open without errors on phone, tablet and desktop.

## 7. SEO — ✅ (on preview), one point 🟡
Editable meta titles and descriptions (Admin → Page Content → SEO), SEO-friendly URLs (`/shop/<product-name>`), image alt text (Media Library), XML sitemap, robots.txt, schema markup (business, product, project, article, breadcrumbs), breadcrumb navigation. 🟡 Fast-loading pages: see Performance below.

## 8. Performance

| Point | Status | Notes |
|---|---|---|
| Mobile responsive | ✅ | Checked 320 px to 1920 px |
| Cross-browser | ✅ | Chromium, Firefox, Safari engine (2026-10-18) |
| Optimized images (WebP/AVIF) | ✅ | |
| Lazy loading | ✅ | |
| Fast loading speed | 🟡 | Desktop fast. Phone on slow 4G: main photo after about 4 s (Plan 1.3) |
| Optimized Core Web Vitals | 🟡 | Layout shift good everywhere; phone loading (LCP) about 4 s, target under 2.5 s (Plan 1.3) |

## 9. Security

| Point | Status | Notes |
|---|---|---|
| SSL certificate | ✅ | HTTPS, renews automatically |
| Secure admin login | ✅ | Server-side sign-in, rate limits, wrong password refused |
| Spam protection for forms | ✅ | Hidden bot trap + limit per visitor |
| Regular website backup | 🟡 | Nightly backups + monthly restore test on the server. No copy outside the server yet (Plan 2.5) |

## 10. Third-party integrations

| Point | Status | Notes |
|---|---|---|
| Google Analytics | ❌ | Plan 1.1, needs your Measurement ID (G-…) |
| Google Search Console | ❌ | Plan 1.1, needs verification code (or DNS) |
| Meta Pixel | ❌ | Plan 1.1, needs your Pixel ID |
| Razorpay | ⏳ | Phase 4 (you) |
| Google Maps | ✅ | Contact page |
| WhatsApp chat | ✅ | Floating button + contact page |
| Instagram feed | 🟡 | Plan 1.2 |

## 11. Footer — ✅
Company information, quick links, product categories, services, contact details, social media links, newsletter subscription, copyright.

## 12. Deliverables

| Point | Status | Notes |
|---|---|---|
| Responsive website, CMS, e-commerce | ✅ | |
| Payment gateway integration | ⏳ | Phase 4 |
| Source code | ✅ | On GitHub (pushed 2026-10-22) |
| Website deployment | ✅ | Live since 2026-10-22 |
| Basic SEO, performance, cross-browser testing | ✅ | |
| Documentation | ✅ | `docs/ADMIN_GUIDE.md` (admin how-to), `docs/OPERATIONS.md` (server) |

## 13. Notes — ✅
Premium identity, high-quality visuals, "Request Customization" on products, everything added through the admin without a developer.

---

## Implementation plan

Do the phases in order. Payment stays last, for you.

### Phase 1: Remaining development (developer)
| # | Task | Needs from you | Size |
|---|---|---|---|
| 1.1 | **Google Analytics, Search Console, Meta Pixel:** fields in Admin → Settings; tracking loads only after the visitor accepts cookies | GA Measurement ID, Search Console code, Pixel ID | Small |
| 1.2 | **Live Instagram feed:** latest posts loaded from Instagram by the server (refreshed hourly), falls back to the current photo grid | Instagram Business/Creator account linked to a Facebook page + access token | Medium |
| 1.3 | **Faster phone loading (Core Web Vitals):** pre-render the main pages so the first photo and text show before the JavaScript loads; target phone LCP under 2.5 s | — | Medium |

### Phase 2: Your input (client)
| # | Task | Where |
|---|---|---|
| 2.1 | **Set up email sending (SMTP)**: needed for customer sign-in codes and order emails | Run `ops/setup-alert-email.sh` on the server (Gmail address + app password) |
| 2.2 | Replace the 61 sample photos and sample prices with real ones | Admin → Products / Media Library |
| 2.3 | Confirm phone and WhatsApp numbers | Admin → Page Content → Company & Contact |
| 2.4 | GSTIN and GST state (for invoices); careers email and HR phone | Admin → Page Content → Company, then Publish |
| 2.5 | Decide on an off-server backup copy (e.g. cloud storage) | Optional |
| 2.6 | Change the admin password to a strong one | Admin → Settings |

### Phase 3: Go live ✅ done 2026-10-22 (email still to set up)
1. Backup of the live database.
2. Migrations 0008 and 0009 (customer accounts, account cart).
3. Rebuild the API and the website; check every page on phone, tablet and desktop.
4. Commit and push both repositories to GitHub.

### Phase 4: Payment gateway (you) ⏳
1. Create a Razorpay account and complete KYC.
   - The website pages Razorpay asks for are ready (2026-10-22): Privacy Policy `/privacy-policy`, Terms & Conditions `/terms-and-conditions`, Cancellation & Refunds `/refund-policy`, Shipping & Delivery `/shipping-policy`, Contact `/contact`, About `/about`, all linked in the footer. Check their wording and the phone number first.
2. Enter the Key ID and Key Secret (and webhook secret) in the server settings (`docs/OPERATIONS.md`, Payments).
3. Turn on UPI / cards / net banking / wallets in Admin → Settings.
4. Test with Razorpay test keys, then one small real payment and refund.

---

## Fixed during this check (2026-10-22)
- **Sign-in then cart sometimes failed:** the server saved changes just *after* answering, so an action right after sign-in could arrive before the sign-in was saved. Now every change is saved before the answer is sent (`Depends(get_db, scope="function")`), with a test that keeps it that way.
- **Shop sorting:** "Newest First" and "Most Popular" added (phone filter panel too).
- **Home:** hero fills the first screen; About no longer peeks in.
- **Phone header:** menu button was cut off on every page since the account icon was added; now fits from 320 px up.

## Test results
| Test | Result |
|---|---|
| Browser check of every requirement: 14 public pages, shop, product, contact, footer, search, SEO files, 20 admin screens, at phone / tablet / desktop | 391 checks: 376 passed. The 15 failures: 9 were the test itself (the screens and buttons are there), 3 were "sort by latest" (fixed afterwards), 3 are the missing Google Analytics / Search Console / Meta Pixel |
| Shopping flow: browse signed out → add to cart → sign up with email code → cart on a second device → quantity → Cash-on-Delivery order → Buy now → old browser cart merged → admin Customers → switch account off | 31/31 at 390, 820 and 1440 px after the sign-in fix (a second 390 px run also 31/31) |
| Backend (API and database) test suite | 188 passed, 1 skipped |
| Build and code check | Build passes; lint 0 errors |
| Test data | Test accounts, orders and the temporary admin deleted from the preview database afterwards |

Note: orders and forms are limited to 5 per visitor per time window (spam protection); repeated automatic tests from one server reach this, real customers do not.
