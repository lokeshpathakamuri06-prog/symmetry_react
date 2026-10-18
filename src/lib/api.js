// Same-origin client for the FastAPI backend (/api, proxied by Caddy in production and Vite in dev).
// The session lives in an httpOnly cookie; the CSRF token is kept in memory only.

export const AUTH_EXPIRED_EVENT = 'symmetry:auth-expired';

let csrfToken = null;

export const setCsrfToken = (token) => {
  csrfToken = token || null;
};

export class ApiError extends Error {
  constructor(status, { code, message, retryAfterSeconds, field } = {}) {
    super(message || `Request failed (${status})`);
    this.name = 'ApiError';
    this.status = status;
    this.code = code || `http_${status}`;
    this.retryAfter = retryAfterSeconds ?? null;
    this.field = field || null; // which input the server rejected, if any
  }
}

// csrf: the token to send instead of the admin's (customer account requests carry their own)
export const api = async (path, { method = 'GET', body, signal, csrf } = {}) => {
  const headers = { Accept: 'application/json' };
  // FormData (file uploads) goes as multipart: the browser sets the Content-Type and boundary
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  const token = csrf !== undefined ? csrf : csrfToken;
  if (method !== 'GET' && token) headers['X-CSRF-Token'] = token;

  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined || isForm ? body : JSON.stringify(body),
      credentials: 'same-origin',
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError(0, { code: 'network_error', message: 'Cannot reach the server. Check your connection.' });
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    // An expired or revoked session anywhere in the admin signs the user out
    // (customer account requests never sign an admin out)
    if (response.status === 401 && path !== '/auth/login' && !path.startsWith('/account')) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    const error = new ApiError(response.status, data?.error);
    if (response.status === 429 && error.retryAfter == null) {
      error.retryAfter = Number(response.headers.get('Retry-After')) || null;
    }
    throw error;
  }
  return data;
};

export default api;
