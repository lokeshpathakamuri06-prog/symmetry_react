import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@symmetry.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginAdmin } = useAdminAuth();
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
    <div className="min-h-screen bg-[#07121C] text-[#F5F1E8] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#36656B]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0A1622] border border-[#1B2E3D] rounded-3xl p-8 shadow-2xl shadow-black/80 relative z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36656B]/20 border border-[#36656B]/30 text-xs text-[#36656B] font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Management Portal
          </div>
          <h1 className="text-2xl font-serif tracking-[0.2em] font-semibold text-white">SYMMETRY</h1>
          <p className="text-xs text-white/50 mt-1">Sign in to control your website content & store</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-white/70 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@symmetry.com"
                className="w-full pl-10 pr-4 py-3 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#36656B] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-white/70 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#07121C] border border-[#1B2E3D] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#36656B] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-[#36656B] text-white font-medium text-xs tracking-wider uppercase hover:bg-[#2b5257] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#36656B]/30 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In To Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Helper Box */}
        <div className="mt-8 pt-6 border-t border-[#1B2E3D] text-center">
          <p className="text-[11px] text-white/50 mb-3 flex items-center justify-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Default Demo Admin Account:
          </p>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] font-mono text-white/80 flex items-center justify-between">
            <span>admin@symmetry.com / admin123</span>
            <button
              onClick={fillDemoCredentials}
              type="button"
              className="px-2.5 py-1 rounded bg-[#36656B]/40 text-[#54979e] hover:text-white transition-colors text-[10px] font-sans uppercase font-medium"
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
