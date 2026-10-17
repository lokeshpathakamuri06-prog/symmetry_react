// Public website forms (FastAPI /api/public/*). The `website` field is a honeypot left empty by people.
import api from '../lib/api';

const page = () => window.location.pathname;

export const submitInquiry = (data) => api('/public/inquiries', { method: 'POST', body: { ...data, sourcePage: page() } });
export const submitApplication = (data) => api('/public/applications', { method: 'POST', body: { ...data, sourcePage: page() } });
// Careers page form with files: resume (PDF/DOC/DOCX, required), portfolio (PDF, optional)
export const submitCareerApplication = ({ resume, portfolio, ...fields }) => {
  const form = new FormData();
  Object.entries({ ...fields, sourcePage: page() }).forEach(([key, value]) => form.append(key, value ?? ''));
  if (resume) form.append('resume', resume);
  if (portfolio) form.append('portfolio', portfolio);
  return api('/public/career-applications', { method: 'POST', body: form });
};
export const submitOrder = (data) => api('/public/orders', { method: 'POST', body: { ...data, sourcePage: page() } });
export const subscribeNewsletter = (email, website = '') =>
  api('/public/newsletter', { method: 'POST', body: { email, website, sourcePage: page() } });

// A message suitable for showing next to a form
export const formErrorMessage = (err) => {
  if (err.status === 429) return 'Too many submissions. Please wait a few minutes and try again.';
  if (err.status === 0) return 'Cannot reach the server. Please check your connection and try again.';
  return err.message || 'Something went wrong. Please try again.';
};
