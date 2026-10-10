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

export const api = async (path, { method = 'GET', body, signal } = {}) => {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (method !== 'GET' && csrfToken) headers['X-CSRF-Token'] = csrfToken;

  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
    if (response.status === 401 && path !== '/auth/login') {
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
