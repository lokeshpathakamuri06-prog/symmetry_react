import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('symmetry_admin_authed') === 'true';
  });
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('symmetry_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSupabaseAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setIsAdminAuthenticated(true);
            setAdminUser(session.user);
            localStorage.setItem('symmetry_admin_authed', 'true');
            localStorage.setItem('symmetry_admin_user', JSON.stringify(session.user));
          }
        } catch (e) {
          console.warn('Supabase auth check fallback to local storage:', e);
        }
      }
      setLoading(false);
    };

    checkSupabaseAuth();
  }, []);

  const loginAdmin = async (email, password) => {
    // 1. Try Supabase Auth first if configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        setIsAdminAuthenticated(true);
        setAdminUser(data.user);
        localStorage.setItem('symmetry_admin_authed', 'true');
        localStorage.setItem('symmetry_admin_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
    }

    // 2. Demo Credential Fallback (Accept admin@symmetry.com / admin123 OR any password if testing)
    if (email.toLowerCase() === 'admin@symmetry.com' && password === 'admin123') {
      const demoUser = {
        id: 'admin-demo-id',
        email: 'admin@symmetry.com',
        role: 'Super Administrator',
        user_metadata: { full_name: 'Symmetry Admin' }
      };
      setIsAdminAuthenticated(true);
      setAdminUser(demoUser);
      localStorage.setItem('symmetry_admin_authed', 'true');
      localStorage.setItem('symmetry_admin_user', JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    // Allow flexible login for local dev if email contains 'admin'
    if (email.toLowerCase().includes('admin') && password.length >= 4) {
      const devUser = {
        id: `admin-${Date.now()}`,
        email,
        role: 'Administrator',
        user_metadata: { full_name: email.split('@')[0] }
      };
      setIsAdminAuthenticated(true);
      setAdminUser(devUser);
      localStorage.setItem('symmetry_admin_authed', 'true');
      localStorage.setItem('symmetry_admin_user', JSON.stringify(devUser));
      return { success: true, user: devUser };
    }

    return { success: false, error: 'Invalid credentials. Use admin@symmetry.com / admin123' };
  };

  const logoutAdmin = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('symmetry_admin_authed');
    localStorage.removeItem('symmetry_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        loading,
        loginAdmin,
        logoutAdmin,
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
