import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import logoImg from '../../assets/logo.png';
import logoDarkImg from '../../assets/logo-dark.png';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@symmetry.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginAdmin } = useAdminAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError('An unexpected login error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@symmetry.com');
    setPassword('admin123');
  };

  return (
    <div className="admin-theme min-h-screen bg-adm-bg text-adm-fg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft ambient gradient */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-adm-accent/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-adm-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[400px] adm-card p-8 sm:p-10 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <img
            src={isDark ? logoDarkImg : logoImg}
            alt="Symmetry Interiors"
            className="h-12 w-auto object-contain mx-auto mb-5"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-adm-fg">Sign in to Admin</h1>
          <p className="text-[13px] text-adm-muted mt-1.5">Manage your website content, store and careers</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-adm-fg mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-adm-fg/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@symmetry.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm adm-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-adm-fg mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-adm-fg/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm adm-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-6 rounded-xl bg-adm-accent text-adm-on-accent font-semibold text-sm hover:bg-adm-accent-hover active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Helper Box */}
        <div className="mt-8 pt-6 border-t border-adm-border text-center">
          <p className="text-[11px] text-adm-fg/50 mb-3 flex items-center justify-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Default Demo Admin Account:
          </p>
          <div className="p-3 bg-adm-fg/5 rounded-xl border border-adm-fg/10 text-[11px] font-mono text-adm-fg/80 flex items-center justify-between">
            <span>admin@symmetry.com / admin123</span>
            <button
              onClick={fillDemoCredentials}
              type="button"
              className="px-2.5 py-1 rounded-full bg-adm-accent/10 text-adm-accent hover:bg-adm-accent hover:text-adm-on-accent transition-colors text-[11px] font-sans font-medium"
            >
              Fill Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
