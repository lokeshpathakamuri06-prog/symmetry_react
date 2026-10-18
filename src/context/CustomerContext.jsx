import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../lib/api';

// Shop customer account (symmetry_backend app/api/account.py). The session is an httpOnly cookie;
// its CSRF token lives here in memory, separate from the admin's.
const CustomerContext = createContext(null);

// Set once a visitor has signed in on this browser, so pages only ask the server when it can matter
const HINT_KEY = 'symmetry_customer';
const readHint = () => {
  try {
    return localStorage.getItem(HINT_KEY) === '1';
  } catch {
    return false;
  }
};
const writeHint = (on) => {
  try {
    if (on) localStorage.setItem(HINT_KEY, '1');
    else localStorage.removeItem(HINT_KEY);
  } catch {
    /* storage blocked: the server cookie still decides */
  }
};

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [status, setStatus] = useState(readHint() ? 'checking' : 'guest'); // checking | signedIn | guest
  const csrf = useRef(null);

  const accept = useCallback(({ customer: c, csrfToken }) => {
    if (csrfToken) csrf.current = csrfToken;
    setCustomer(c);
    setStatus('signedIn');
    writeHint(true);
    return c;
  }, []);

  const forget = useCallback(() => {
    csrf.current = null;
    setCustomer(null);
    setStatus('guest');
    writeHint(false);
  }, []);

  const refresh = useCallback(() => api('/account/me').then(accept).catch(() => forget()), [accept, forget]);

  useEffect(() => {
    if (readHint()) refresh();
  }, [refresh]);

  // Requests that change something send the customer's CSRF token
  const call = useCallback(async (path, options = {}) => {
    try {
      return await api(path, { ...options, csrf: csrf.current });
    } catch (err) {
      if (err.status === 401) forget();
      throw err;
    }
  }, [forget]);

  const value = useMemo(() => ({
    customer,
    status,
    signedIn: status === 'signedIn',
    requestCode: (email) => api('/account/code', { method: 'POST', body: { email } }),
    verifyCode: (email, code, fullName) =>
      api('/account/code/verify', { method: 'POST', body: { email, code, fullName } }).then(accept),
    login: (email, password) => api('/account/login', { method: 'POST', body: { email, password } }).then(accept),
    register: (details) => api('/account/register', { method: 'POST', body: details }),
    logout: () => call('/account/logout', { method: 'POST' }).catch(() => {}).finally(forget),
    updateProfile: (changes) => call('/account/me', { method: 'PATCH', body: changes }).then((r) => accept(r)),
    changePassword: (body) => call('/account/password', { method: 'POST', body }).then((r) => accept(r)),
    orders: () => call('/account/orders'),
    order: (number) => call(`/account/orders/${encodeURIComponent(number)}`),
    refresh,
  }), [customer, status, accept, call, forget, refresh]);

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};

export const useCustomer = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used within a CustomerProvider');
  return ctx;
};

export default CustomerContext;
