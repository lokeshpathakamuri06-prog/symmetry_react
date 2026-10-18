# Symmetry Interiors: Admin Guide

This guide explains how to manage the website from the admin portal. You don't need any technical knowledge.

**Admin address:** https://169-58-13-62.sslip.io/admin/login

---

## 1. Signing in
1. Open the admin address and enter your email and password.
2. If you forget your password, ask your developer to reset it. They run a command on the server and give you a new one.
3. You are signed out automatically after **2 hours without activity**, and always **12 hours after signing in**.
4. After **5 wrong passwords** in a row, sign-in is blocked for about 15 minutes.

Always click **Sign Out** (bottom of the left menu) on a shared computer.

---

## 2. How changes go live: Save, then Publish
Changes reach the website in two steps:

| Step | What happens |
|---|---|
| **Save** (in an editor) | Your change is stored safely, but **the website does not change yet**. |
| **Publish** (top-right button) | Everything you saved goes live together. Visitors see it on their next page load. |

The top bar always shows the state:
- 🟠 **Unpublished changes**: you've saved something that isn't live yet. Click **Publish** when you're ready.
- 🟢 **Website up to date**: the website shows exactly what's saved.

This lets you prepare several changes (for example a new product, its photos and a price update) and check them before publishing them together.

---

## 3. The left menu at a glance
| Section | What you manage |
|---|---|
| **Dashboard** | Counts of live items, recent edits, quick links |
| **Page Content** | Headlines, texts and company contact details |
| **Products, Categories, Collections** | The shop catalogue |
| **Customer Orders** | Order requests from the shop |
| **Hero Banners, Interior Projects, Journal Articles, Testimonials, Team Profiles** | Website content |
| **Job Openings, Applications** | Careers page and candidates |
| **Contact Enquiries** | Messages from the Contact page, plus newsletter subscribers |
| **Media Library** | Every image used on the website |
| **Settings & Database** | System status (read only) |

Numbers next to **Customer Orders**, **Applications** and **Contact Enquiries** show new items waiting for you.

### Home page slideshow and collections carousel
- **Slideshow photos:** Hero Banners. Each active, published banner is one photo; the order of the list is the slide order. Use landscape photos at least 2400 px wide. The headline and buttons over the photos are in **Page Content → Home**.
- **"Designs That Inspire Living" carousel:** Collections marked **Featured** that have a cover image, in list order. Each card shows the **Carousel label** (e.g. "Living"), title and subtitle; **Card link** is where "View Product" goes (e.g. `/shop?category=luxury-sofas`). Portrait cover photos work best.
- As always: Save, then **Publish**.

---

## 4. Editing content (products, projects, journal and more)
All content screens work the same way.

### Find an item
- Use the tabs: **All**, **Published**, **Draft**, **Archived**.
- Type in **Search** to filter by name.

### Edit an item
1. Click the ✏️ **Edit** icon on the item.
2. Change the fields. Required fields are marked with **\***.
3. Click **Save**.
4. Click **Publish** at the top when you want the change on the website.

### Create a new item
1. Click **New …** (for example **New Product**).
2. Choose **Published** (goes live on the next Publish) or **Draft** (saved but never shown).
3. Fill in the fields and click **Save**.

### Draft vs Published
- **Published:** shown on the website, after Publish.
- **Draft:** kept in the admin only. Use it for items you're still preparing.

### Archive, restore and delete
- Click the 🗄 **Archive** icon. The item disappears from the website after you Publish.
- Archived items are kept under the **Archived** tab. Click **Restore** to bring one back. It returns as a **Draft**, so set it to Published and Publish again.
- To remove an item for good, archive it first, then click the 🗑 **Delete permanently** icon on the **Archived** tab. This cannot be undone. Its photos stay in the Media Library, where unused photos can be deleted.
- A **category** can't be archived while it still has products, and can't be deleted while any product (even an archived one) uses it. Move or delete those products first.

### Change the order
On the **All** tab (with an empty search), use the ↑ ↓ arrows to move items. The website uses the same order.

### If two people edit the same item
If someone else saved the item while you had it open, you'll see *"changed by someone else"*. Close the editor and open it again to see the latest version, then repeat your change.

### Mistakes and messages
If something is wrong (for example an empty name or a negative price), the field turns red and shows a message. Fix it and Save again.

---

## 5. Products: field by field
| Field | Notes |
|---|---|
| **Visibility** | Published or Draft |
| **Name, Category** \* | Category comes from the Categories screen |
| **Collection** | Optional grouping (e.g. "Milanese Monolith") |
| **Product photos** \* | At least one. **The first photo is the main one**; use the arrows to reorder |
| **Price (₹)** \* | Selling price |
| **Original price (₹)** | Optional; shown struck through to indicate a discount |
| **Badge** | Small label, e.g. "Bestseller" |
| **Lead time, Stock label, In stock** | E.g. "3 to 4 Weeks", "In Stock" |
| **Featured** | Highlights the product in the shop |
| **Rating, Review count** | Shown on the product page |
| **Dimensions, Materials, Finishes, Fabrics, Colours** | One item per line; colours have a name and a swatch |
| **Details, Care instructions** | One item per line |
| **SEO title / description** | Optional text for Google search results |

The product's web address uses its ID (e.g. `/shop/sym-001`). IDs are created automatically and never change.

---

## 6. Images
### Uploading photos
1. Go to **Media Library** and click **Upload photos**.
2. Choose the folder (Products, Projects, Banners, Journal, Team, Categories or Other).
3. Drag photos onto the box, or click **Choose photos**. You can select many at once.
4. Each photo shows a progress bar. ✅ means it's uploaded, and it appears at the top of the library.

**Good to know:**
- **Formats:** JPG, PNG, WebP, AVIF and HEIC (iPhone).
- **Large photos are resized automatically** to 3000 px on the long side before uploading. That's still more than any screen needs, and the file stays under the 10 MB limit.
- **HEIC larger than 10 MB:** some browsers can't resize these. You'll be asked to export the photo as JPEG first.
- **Failed uploads:** if one fails (for example the connection dropped), click ↻ to retry it.

### Adding photos to a product, project and so on
In an editor, under **Images**:
- Click **Library** to choose an existing photo. Use the **Upload new** tab to upload one without leaving the editor; it then appears first in the Library.
- Or paste an image link (`https://…`) and click **Add**.
- Use the arrows to reorder and the bin icon to remove. **The first product photo is the main one.**

Save, then **Publish**.

### Media Library
- **Usage:** each image shows **where it's used** ("Used in 3").
- **Search** by file name (e.g. `LC0045`), alt text or tag.
- **Alt text:** type a short description under an image, for accessibility and Google. It saves when you click elsewhere.
- **Deleting:** **Unused only** shows images not used anywhere, and only unused images can be deleted. Deleting removes the photo from the image service too.

The website automatically sends each visitor a version sized for their screen, in a modern format. You never need to make smaller copies yourself.

## 7. Page Content: texts and contact details
**Page Content** has one tab per page:

| Tab | What it changes |
|---|---|
| **Company & Contact** | Company name, phones, **WhatsApp number**, emails, addresses, hours, map, social links. Used **everywhere**: header menu, footer, Contact page, and all WhatsApp buttons |
| **Home** | Hero headline (the gold part is a separate field), subtitle and buttons; "Our story"; all section headings |
| **About** | Hero headline and "Our story" paragraphs |
| **Contact page** | Hero headline and subtitle |
| **Footer** | Tagline and description |

1. Edit the fields on a tab.
2. Click **Save [tab name]**. Each tab is saved separately; **Undo changes** discards what you haven't saved.
3. Click **Publish**.
4. Use **Open page** to check the result on the website.

> **Please check the phone numbers first.** The site currently shows **+91 98765 43210** as the main phone (likely a placeholder) and **+91 99634 99635** for WhatsApp. Enter the real numbers in **Company & Contact**, Save, and Publish.

---

## 8. Inbox: enquiries, applications, orders
All three screens work the same way: click an item on the left to see the details on the right.

| Screen | Statuses |
|---|---|
| **Contact Enquiries** | unread → read → replied → archived |
| **Applications** | new → shortlisted → interview → hired / rejected |
| **Customer Orders** | pending → confirmed → processing → delivered / cancelled |

- Click a **status** to change it. Add **internal notes** (only admins see them) and click **Save notes**.
- Click the email or phone to contact the person.
- The 🗑 **Delete** button removes an item **permanently**. Use it only when someone asks for their details to be removed.

### Orders
- The website does **not** take online payments yet. Each order is a **request**: contact the customer to confirm and arrange payment.
- Prices are always taken from the catalogue when the customer places the order, with 18% GST and shipping (free above ₹1,50,000, otherwise ₹3,500).

### Newsletter subscribers
On **Contact Enquiries**, click **View newsletter subscribers**. **Export CSV** downloads the list for your email tool.

---

## 9. Careers
- **Job Openings:** create roles, set **Open** (accepting applications) and Published. Closed or draft roles disappear from the Careers page after Publish.
- **Applications:** candidates who applied. Applications from the Careers form carry an uploaded **resume** (PDF or Word) and sometimes a **portfolio PDF**: click **Resume** / **Portfolio** to download them. These files are private: only signed-in admins can download them. Older applications have links instead; click to open them. Each application shows when the candidate agreed to their details being used for recruitment.
- Deleting an application also deletes its files.
- **Careers email and HR phone:** Page Content → Company & Contact → *Careers page*. Until you fill them in, the Careers page shows no email or phone for HR (only the office address and a link to the Contact page). Fill them in, Save, then Publish.
- **Team Voices** on the Careers page shows three **sample** quotes, marked as samples. Send real, approved quotes from team members to your developer to replace them.

---

## 10. Google and link previews (SEO)
The website tells Google (and WhatsApp, Facebook, LinkedIn link previews) each page's title, description and main photo. Everything has a sensible default; you only change what you want to improve.

| What | Where to change it |
|---|---|
| Title and description of Home, About, Services, Projects, Global Sourcing, Shop, Journal, Contact, Careers | **Page Content → SEO**. Leave a field empty to keep the default shown in grey. The box under each page shows how Google will display it. |
| Title and description of one product, project or journal article | That item's editor → **Search engines** (*SEO title*, *SEO description*). Empty = its name and description. |
| Photo used when a page link is shared | The page's own photo; for pages without one, **Page Content → SEO → Default share photo** (1200 × 630 px is best). |
| Photo descriptions (alt text) | **Media Library**: type a short description under each photo. Tick **Missing alt text** to see the photos that still need one. |

**Tips**
- Titles: about 50–60 characters, most important words first, e.g. *Luxury Interior Designers in Hyderabad*. The brand name is added automatically.
- Descriptions: one or two sentences (up to about 155 characters) that make people want to click.
- Alt text: describe what is in the photo, e.g. *Curved cream bouclé sofa in a living room with marble floor*. Not "image1".
- As always, **Publish** after saving.

**Automatic (nothing to do):** product addresses use the product name (e.g. `/shop/aurelia-curved-boucle-sofa`; old addresses still work); the sitemap at `/sitemap.xml` lists every published page and updates when you Publish; cart, checkout and admin pages are hidden from Google; products show their price and stock to Google, and the business details (name, phone, address from Page Content → Company) are included on Home and Contact.

---

## 11. Quick answers
| Question | Answer |
|---|---|
| I saved, but the website hasn't changed | Click **Publish** (top right), then reload the website |
| I deleted (archived) something by mistake | Open the **Archived** tab, click **Restore**, set it to Published, then Publish |
| The website says "We couldn't load this page" | The server is restarting; wait a few seconds and click **Retry** |
| A photo won't add | Uploads: use JPG, PNG, WebP, AVIF or HEIC (HEIC over 10 MB: export as JPEG). Links must start with `https://` |
| I can't delete an image | It's still used somewhere; remove it from that product or project first |
| Who changed something? | The Dashboard shows **Recent edits**; the top bar shows who published last |
