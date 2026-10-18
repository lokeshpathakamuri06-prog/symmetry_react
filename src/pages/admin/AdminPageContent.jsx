import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FormField } from '../../components/admin/form/fields';
import api from '../../lib/api';
import { CONTENT_CHANGED_EVENT } from '../../services/adminApi';
import { SEO_DEFAULTS } from '../../lib/seoDefaults';

// Exactly the texts the website shows. Saving updates the database; Publish puts it live.
const PAGES = [
  {
    id: 'company', label: 'Company & Contact', link: '/contact',
    help: 'Used everywhere: header, mobile menu, footer, Contact page and WhatsApp buttons.',
    groups: [
      { title: 'Company', fields: [
        ['companyName', 'Legal name'], ['shortName', 'Short name (copyright line)'], ['cin', 'CIN', 'half'],
        ['hours', 'Opening hours', 'half'],
        ['gstin', 'GSTIN', 'half', 'printed on invoices'], ['gstState', 'GST state', 'half', 'e.g. Telangana; same-state orders get CGST + SGST'],
      ] },
      { title: 'Phone & email', fields: [
        ['phonePrimary', 'Main phone', 'half'], ['phoneSecondary', 'Second phone', 'half'],
        ['whatsappNumber', 'WhatsApp number', 'half', 'used by all WhatsApp buttons'], ['email', 'Main email', 'half'],
        ['emailProjects', 'Projects email', 'half'],
      ] },
      { title: 'Careers page', fields: [
        ['careersEmail', 'Careers email', 'half', 'shown on Careers only once filled in'],
        ['hrPhone', 'HR phone', 'half', 'shown on Careers only once filled in'],
      ] },
      { title: 'Addresses & map', fields: [
        ['officeAddress', 'Office address', 'full', null, 'textarea'], ['registeredOffice', 'Registered office', 'full', null, 'textarea'],
        ['mapQuery', 'Map search text', 'full', 'what Google Maps should find'],
      ] },
      { title: 'Social links', fields: [['instagram', 'Instagram URL'], ['linkedin', 'LinkedIn URL'], ['pinterest', 'Pinterest URL']] },
    ],
  },
  {
    id: 'home', label: 'Home', link: '/',
    groups: [
      { title: 'Hero', fields: [
        ['heroTitle', 'Headline', 'half'], ['heroTitleHighlight', 'Headline (gold part)', 'half'],
        ['heroSubtitle', 'Subtitle', 'full', null, 'textarea'],
        ['heroPrimaryCta', 'First button', 'half'], ['heroSecondaryCta', 'Second button', 'half'],
      ] },
      { title: 'Our story', fields: [
        ['storyKicker', 'Small heading'], ['storyTitle', 'Title'],
        ['storyParagraph1', 'Paragraph 1', 'full', null, 'textarea'], ['storyParagraph2', 'Paragraph 2', 'full', null, 'textarea'],
        ['storyBadgeTitle', 'Badge title', 'half'], ['storyBadgeText', 'Badge text', 'half'],
      ] },
      { title: 'Section headings', fields: [
        ['categoriesTitle', 'Categories title', 'half'], ['categoriesSubtitle', 'Categories subtitle', 'half'],
        ['productsTitle', 'Products title', 'half'], ['productsSubtitle', 'Products subtitle', 'half'],
        ['projectsTitle', 'Projects title', 'half'], ['projectsSubtitle', 'Projects subtitle', 'half'],
        ['whyTitle', 'Why choose us title', 'half'], ['whySubtitle', 'Why choose us subtitle', 'half'],
        ['testimonialsTitle', 'Testimonials title', 'half'], ['testimonialsSubtitle', 'Testimonials subtitle', 'half'],
        ['journalTitle', 'Journal title', 'half'], ['journalSubtitle', 'Journal subtitle', 'half'],
      ] },
    ],
  },
  {
    id: 'about', label: 'About', link: '/about',
    groups: [
      { title: 'Hero', fields: [['heroTitle', 'Headline', 'half'], ['heroTitleHighlight', 'Headline (gold part)', 'half']] },
      { title: 'Our story', fields: [
        ['storyTitle', 'Title'], ['storyParagraph1', 'Paragraph 1', 'full', null, 'textarea'],
        ['storyParagraph2', 'Paragraph 2', 'full', null, 'textarea'], ['storyParagraph3', 'Paragraph 3', 'full', null, 'textarea'],
      ] },
    ],
  },
  {
    id: 'contact', label: 'Contact page', link: '/contact',
    groups: [{ title: 'Hero', fields: [
      ['heroTitle', 'Headline', 'half'], ['heroTitleHighlight', 'Headline (gold part)', 'half'],
      ['heroSubtitle', 'Subtitle', 'full', null, 'textarea'],
    ] }],
  },
  {
    id: 'footer', label: 'Footer', link: '/',
    groups: [{ title: 'Footer', fields: [
      ['tagline', 'Tagline'], ['subTagline', 'Line under the tagline'], ['description', 'Description', 'full', null, 'textarea'],
    ] }],
  },
];

// Page Content → SEO: search-result title and description of each fixed page (products, projects and
// journal posts have their own SEO fields). Empty = the default shown greyed out.
PAGES.push({
  id: 'seo', label: 'SEO', link: '/sitemap.xml', linkLabel: 'Open sitemap',
  help: 'How each page appears in Google and in WhatsApp / Facebook link previews. Leave a field empty to keep the text shown in grey. Products, projects and journal posts have their own SEO fields in their editors.',
  groups: [
    { title: 'Link preview photo', fields: [
      ['shareImage', 'Default share photo', 'full', 'shown when a page link is shared and the page has no photo of its own; 1200 × 630 px works best. Paste a Media Library URL', 'text', 'https://…'],
    ] },
    ...Object.entries(SEO_DEFAULTS).map(([key, d]) => ({
      title: `${d.label} page (${d.path})`, seoPreview: key,
      fields: [
        [`${key}Title`, 'Title', 'full', 'up to about 60 characters; the brand is added if missing', 'text', d.title],
        [`${key}Description`, 'Description', 'full', 'up to about 155 characters', 'textarea', d.description],
      ],
    })),
  ],
});

const toField = ([key, label, span = 'full', help = null, type = 'text', placeholder], optional) => ({
  key, label, help, type, placeholder, rows: 3, span: span === 'half' ? 'half' : undefined, required: !optional.includes(key),
});

// What Google will show, from the current (unsaved) text or the default
const SearchPreview = ({ pageKey, values }) => {
  const d = SEO_DEFAULTS[pageKey];
  const rawTitle = (values[`${pageKey}Title`] || d.title).trim();
  const title = /symmetry/i.test(rawTitle) ? rawTitle : `${rawTitle} | Symmetry Interiors`;
  const description = (values[`${pageKey}Description`] || d.description).trim();
  const long = (text, max) => text.length > max;
  return (
    <div className="rounded-xl border border-adm-border p-3 bg-adm-surface">
      <p className="text-[11px] text-adm-muted">Google preview · {window.location.host}{d.path === '/' ? '' : d.path}</p>
      <p className="text-[16px] leading-snug text-[#1a0dab] dark:text-[#8ab4f8] truncate">{title}</p>
      <p className="text-[12.5px] text-adm-fg/80 line-clamp-2">{description}</p>
      <p className={`mt-1 text-[11px] ${long(title, 60) || long(description, 160) ? 'text-amber-600 dark:text-amber-400' : 'text-adm-muted'}`}>
        Title {title.length} characters{long(title, 60) ? ' (Google may cut it short)' : ''} · description {description.length}{long(description, 160) ? ' (may be cut short)' : ''}
      </p>
    </div>
  );
};

export const AdminPageContent = () => {
  const [active, setActive] = useState('company');
  const [saved, setSaved] = useState(null); // {pages, optional}
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [fieldError, setFieldError] = useState({});

  useEffect(() => {
    api('/admin/sections')
      .then((r) => { setSaved(r); setDraft(r.pages); })
      .catch((err) => setMessage({ kind: 'error', text: err.message }));
  }, []);

  const page = PAGES.find((p) => p.id === active);
  const values = draft[active] || {};
  const dirty = saved && JSON.stringify(values) !== JSON.stringify(saved.pages[active]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    setFieldError({});
    try {
      const r = await api(`/admin/sections/${active}`, { method: 'PUT', body: values });
      setSaved((s) => ({ ...s, pages: { ...s.pages, [active]: r.content } }));
      setDraft((d) => ({ ...d, [active]: r.content }));
      window.dispatchEvent(new Event(CONTENT_CHANGED_EVENT));
      setMessage({ kind: 'ok', text: 'Saved. Click Publish to update the website.' });
    } catch (err) {
      if (err.field) setFieldError({ [err.field]: err.message });
      setMessage({ kind: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Page Content" subtitle="Headlines, texts and company details shown on the website">
      <div className="space-y-5">
        <div className="inline-flex p-1 rounded-xl bg-adm-fg/5 overflow-x-auto max-w-full">
          {PAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => { setActive(p.id); setMessage(null); setFieldError({}); }}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all ${active === p.id ? 'bg-adm-surface text-adm-fg shadow-sm' : 'text-adm-muted hover:text-adm-fg'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {message && (
          <div role={message.kind === 'error' ? 'alert' : 'status'} className={`p-3 rounded-xl text-[13px] ${message.kind === 'error' ? 'bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>
            {message.text}
          </div>
        )}

        {!saved ? (
          <p className="text-center text-adm-muted text-[13px] py-12">Loading…</p>
        ) : (
          <div className="adm-card p-6 space-y-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-adm-fg">{page.label}</h2>
                {page.help && <p className="text-[12px] text-adm-muted mt-0.5">{page.help}</p>}
              </div>
              <a href={page.link} target="_blank" rel="noreferrer" className="text-[12px] text-adm-accent inline-flex items-center gap-1 shrink-0">
                {page.linkLabel || 'Open page'} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            {page.groups.map((group) => (
              <section key={group.title} className="space-y-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-adm-muted">{group.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  {group.fields.map((spec) => {
                    const field = toField(spec, saved.optional[active] || []);
                    return (
                      <FormField
                        key={`${active}-${field.key}`}
                        field={field}
                        value={values[field.key]}
                        error={fieldError[field.key]}
                        onChange={(v) => {
                          setDraft((d) => ({ ...d, [active]: { ...d[active], [field.key]: v } }));
                          setFieldError((e) => ({ ...e, [field.key]: undefined }));
                        }}
                      />
                    );
                  })}
                </div>
                {group.seoPreview && <SearchPreview pageKey={group.seoPreview} values={values} />}
              </section>
            ))}
            <div className="pt-4 border-t border-adm-border flex items-center justify-between gap-3">
              <p className="text-[11px] text-adm-muted">{dirty ? 'You have unsaved changes on this page.' : 'Saved changes go live when you click Publish.'}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!dirty}
                  onClick={() => setDraft((d) => ({ ...d, [active]: saved.pages[active] }))}
                  className="px-4 py-2 bg-adm-fg/5 hover:bg-adm-fg/10 rounded-xl text-[13px] text-adm-fg disabled:opacity-40"
                >
                  Undo changes
                </button>
                <button
                  type="button"
                  disabled={!dirty || saving}
                  onClick={save}
                  className="px-5 py-2 bg-adm-accent hover:bg-adm-accent-hover rounded-xl text-[13px] text-adm-on-accent font-medium inline-flex items-center gap-2 disabled:opacity-40"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save {page.label}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPageContent;
