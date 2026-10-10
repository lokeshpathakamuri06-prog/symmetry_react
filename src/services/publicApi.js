// Public website forms (FastAPI /api/public/*). The `website` field is a honeypot left empty by people.
import api from '../lib/api';

const page = () => window.location.pathname;

export const submitInquiry = (data) => api('/public/inquiries', { method: 'POST', body: { ...data, sourcePage: page() } });
export const submitApplication = (data) => api('/public/applications', { method: 'POST', body: { ...data, sourcePage: page() } });
export const submitOrder = (data) => api('/public/orders', { method: 'POST', body: { ...data, sourcePage: page() } });
export const subscribeNewsletter = (email, website = '') =>
  api('/public/newsletter', { method: 'POST', body: { email, website, sourcePage: page() } });

// A message suitable for showing next to a form
export const formErrorMessage = (err) => {
  if (err.status === 429) return 'Too many submissions. Please wait a few minutes and try again.';
  if (err.status === 0) return 'Cannot reach the server. Please check your connection and try again.';
  return err.message || 'Something went wrong. Please try again.';
};
