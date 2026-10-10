// Admin API: content CRUD, publishing, dashboard and media (FastAPI /api/admin/*).
import api from '../lib/api';

// Saving content changes what Publish would put live; the publish bar listens for this
export const CONTENT_CHANGED_EVENT = 'symmetry:content-changed';
const changed = (result) => {
  window.dispatchEvent(new Event(CONTENT_CHANGED_EVENT));
  return result;
};

const enc = encodeURIComponent;

export const content = (resource) => ({
  list: ({ status = 'active', q } = {}) => {
    const params = new URLSearchParams({ status });
    if (q) params.set('q', q);
    return api(`/admin/${resource}?${params}`);
  },
  get: (id) => api(`/admin/${resource}/${enc(id)}`),
  create: (record) => api(`/admin/${resource}`, { method: 'POST', body: record }).then(changed),
  update: (id, record) => api(`/admin/${resource}/${enc(id)}`, { method: 'PUT', body: record }).then(changed),
  archive: (id) => api(`/admin/${resource}/${enc(id)}/archive`, { method: 'POST' }).then(changed),
  restore: (id) => api(`/admin/${resource}/${enc(id)}/restore`, { method: 'POST' }).then(changed),
  reorder: (ids) => api(`/admin/${resource}-order`, { method: 'PUT', body: { ids } }).then(changed),
});

export const publishing = {
  status: () => api('/admin/publish/status'),
  publish: () => api('/admin/publish', { method: 'POST' }).then(changed),
};

export const dashboard = () => api('/admin/dashboard');

export const media = {
  list: ({ q, unused } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (unused) params.set('unused', 'true');
    return api(`/admin/media?${params}`);
  },
  addByUrl: (url, altText) => api('/admin/media', { method: 'POST', body: { url, altText } }),
  sign: (folder) => api('/admin/media/sign', { method: 'POST', body: { folder } }),
  registerCloudinary: (upload) => api('/admin/media/cloudinary', { method: 'POST', body: upload }),
  update: (id, changes) => api(`/admin/media/${enc(id)}`, { method: 'PATCH', body: changes }).then(changed),
  remove: (id) => api(`/admin/media/${enc(id)}`, { method: 'DELETE' }),
};

// Inbox: inquiries, applications, orders (+ newsletter)
export const INBOX_CHANGED_EVENT = 'symmetry:inbox-changed';
const inboxChanged = (result) => {
  window.dispatchEvent(new Event(INBOX_CHANGED_EVENT));
  return result;
};

export const inbox = (kind) => ({
  list: ({ status, q } = {}) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.set('status', status);
    if (q) params.set('q', q);
    return api(`/admin/${kind}?${params}`);
  },
  update: (id, changes) => api(`/admin/${kind}/${enc(id)}`, { method: 'PATCH', body: changes }).then(inboxChanged),
  remove: (id) => api(`/admin/${kind}/${enc(id)}`, { method: 'DELETE' }).then(inboxChanged),
});

export const inboxCounts = () => api('/admin/inbox/counts');

export const newsletter = {
  list: () => api('/admin/newsletter'),
  unsubscribe: (id) => api(`/admin/newsletter/${enc(id)}/unsubscribe`, { method: 'POST' }),
  csvUrl: '/api/admin/newsletter?format=csv',
};
