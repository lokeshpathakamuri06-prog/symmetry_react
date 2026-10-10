import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import api, { AUTH_EXPIRED_EVENT, setCsrfToken } from '../lib/api';

const AdminAuthContext = createContext();

// Flags from the old browser-only demo login; removed so they can never grant access
const LEGACY_KEYS = ['symmetry_admin_authed', 'symmetry_admin_user'];

const formatRetry = (seconds) => {
  const minutes = Math.ceil((seconds || 60) / 60);
  return minutes <= 1 ? 'a minute' : `${minutes} minutes`;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setCsrfToken(null);
    setAdminUser(null);
  }, []);

  useEffect(() => {
    try {
      LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {
      // storage may be unavailable (private mode); nothing to clean
    }

    // Restore an existing session from the httpOnly cookie
    const controller = new AbortController();
    api('/auth/me', { signal: controller.signal })
      .then(({ user, csrfToken }) => {
        setCsrfToken(csrfToken);
        setAdminUser(user);
      })
      .catch(() => clearSession())
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    window.addEventListener(AUTH_EXPIRED_EVENT, clearSession);
    return () => {
      controller.abort();
      window.removeEventListener(AUTH_EXPIRED_EVENT, clearSession);
    };
  }, [clearSession]);

  const loginAdmin = async (email, password) => {
    try {
      const { user, csrfToken } = await api('/auth/login', { method: 'POST', body: { email, password } });
      setCsrfToken(csrfToken);
      setAdminUser(user);
      return { success: true, user };
    } catch (err) {
      if (err.status === 429) {
        return {
          success: false,
          retryAfter: err.retryAfter,
          error: `Too many sign-in attempts. Try again in ${formatRetry(err.retryAfter)}.`,
        };
      }
      if (err.status === 401) return { success: false, error: 'Invalid email or password.' };
      return { success: false, error: err.message || 'Sign-in failed. Please try again.' };
    }
  };

  const logoutAdmin = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      // Even if the server call fails, the user is signed out locally
    } finally {
      clearSession();
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated: Boolean(adminUser),
        adminUser,
        loading,
        loginAdmin,
        logoutAdmin,
        // Still false; the Supabase badges are removed with the rest of the Supabase code in Part D
        isSupabaseConfigured
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
