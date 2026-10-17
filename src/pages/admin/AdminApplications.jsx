import React from 'react';
import { Briefcase, Download, FileText, Link2, Mail, Phone, ShieldCheck } from 'lucide-react';
import InboxPage, { formatWhen } from '../../components/admin/InboxPage';

const fileSize = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

// Private files from the Careers form: downloaded through the signed-in admin session, never public
const FileLink = ({ item, kind, label }) =>
  item[kind] ? (
    <a
      href={`/api/admin/applications/${item.id}/files/${kind}`}
      download
      className="text-adm-accent hover:underline flex items-center gap-2"
    >
      <Download className="w-4 h-4" /> {label}: {item[kind].name} <span className="text-adm-muted">({fileSize(item[kind].size)})</span>
    </a>
  ) : null;

const Detail = ({ item }) => (
  <div className="space-y-3 min-w-0">
    <div>
      <h3 className="font-semibold text-adm-fg text-base">{item.name}</h3>
      <p className="text-adm-muted flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {item.jobTitle}</p>
      <p className="text-[11px] text-adm-muted font-mono">{item.reference} · {formatWhen(item.createdAt)}</p>
    </div>
    <a href={`mailto:${item.email}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2"><Mail className="w-4 h-4 text-adm-accent" /> {item.email}</a>
    {item.phone && <a href={`tel:${item.phone}`} className="text-adm-fg/80 hover:text-adm-accent flex items-center gap-2"><Phone className="w-4 h-4 text-adm-accent" /> {item.phone}</a>}
    {item.experienceYears && <p className="text-adm-muted">Experience: {item.experienceYears}</p>}
    <FileLink item={item} kind="resume" label="Resume" />
    <FileLink item={item} kind="portfolio" label="Portfolio" />
    {item.resumeUrl && <a href={item.resumeUrl} target="_blank" rel="noreferrer" className="text-adm-accent hover:underline flex items-center gap-2"><FileText className="w-4 h-4" /> View résumé ↗</a>}
    {item.portfolioUrl && <a href={item.portfolioUrl} target="_blank" rel="noreferrer" className="text-adm-accent hover:underline flex items-center gap-2"><Link2 className="w-4 h-4" /> Portfolio link ↗</a>}
    {item.consentAt && <p className="text-adm-muted text-[12px] flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Agreed to recruitment use · {formatWhen(item.consentAt)}</p>}
    {item.message && <div className="p-3 bg-adm-surface2 rounded-xl text-adm-fg/90 whitespace-pre-wrap leading-relaxed">{item.message}</div>}
  </div>
);

const config = {
  kind: 'applications',
  title: 'Job Applications',
  subtitle: 'Candidates who applied through the Careers page',
  emptyText: 'No applications yet.',
  statusStyles: {
    new: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    shortlisted: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    interview: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    hired: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    rejected: 'bg-adm-fg/5 text-adm-muted',
  },
  row: (a) => ({ title: a.name, subtitle: a.jobTitle }),
  Detail,
};

export const AdminApplications = () => <InboxPage config={config} />;
export default AdminApplications;
