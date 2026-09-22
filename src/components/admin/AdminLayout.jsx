import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  Database, 
  DatabaseZap, 
  User, 
  Sun, 
  Moon,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminLayout = ({ children, title = 'Dashboard', subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminUser, isSupabaseConfigured } = useAdminAuth();
  const { refreshSiteContent, loading } = useSiteContent();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#07121C] text-[#F5F1E8] font-sans flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0A1622]/90 backdrop-blur-md border-b border-[#1B2E3D] px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-serif font-medium tracking-wide text-white flex items-center gap-2">
                {title}
              </h1>
              {subtitle && <p className="text-xs text-white/50">{subtitle}</p>}
            </div>
          </div>

          {/* Top Bar Actions & Badges */}
          <div className="flex items-center gap-3">
            {/* Supabase Status Indicator */}
            <div 
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium border ${
                isSupabaseConfigured 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
              title={isSupabaseConfigured ? 'Connected to live Supabase PostgreSQL DB' : 'Running in Offline Demo Mode (localStorage)'}
            >
              {isSupabaseConfigured ? (
                <>
                  <DatabaseZap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Supabase Live DB</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo Mode (Local Storage)</span>
                </>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshSiteContent}
              disabled={loading}
              title="Reload all site data"
              className="p-2 text-white/70 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#36656B]' : ''}`} />
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 pl-3 border-l border-[#1B2E3D]">
              <div className="w-8 h-8 rounded-full bg-[#36656B]/30 border border-[#36656B]/50 flex items-center justify-center text-white text-xs font-semibold">
                {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-medium text-white">{adminUser?.user_metadata?.full_name || adminUser?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-[10px] text-white/40">{adminUser?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
