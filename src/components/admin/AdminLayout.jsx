import React, { useState } from 'react';
import {
  Menu,
  Database,
  DatabaseZap,
  RefreshCw
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import ThemeToggle from '../ThemeToggle';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminLayout = ({ children, title = 'Dashboard', subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminUser, isSupabaseConfigured } = useAdminAuth();
  const { refreshSiteContent, loading } = useSiteContent();

  return (
    <div className="min-h-screen bg-adm-bg text-adm-fg flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 adm-glass border-b border-adm-border px-4 lg:px-10 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-adm-muted hover:text-adm-fg rounded-lg hover:bg-adm-fg/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-semibold tracking-tight text-adm-fg truncate">
                {title}
              </h1>
              {subtitle && <p className="text-xs text-adm-muted truncate">{subtitle}</p>}
            </div>
          </div>

          {/* Top Bar Actions & Badges */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Supabase Status Indicator */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium ${
                isSupabaseConfigured
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
              }`}
              title={isSupabaseConfigured ? 'Connected to live Supabase PostgreSQL DB' : 'Running in Offline Demo Mode (localStorage)'}
            >
              {isSupabaseConfigured ? (
                <>
                  <DatabaseZap className="w-3.5 h-3.5" />
                  <span>Live Database</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  <span>Demo Mode</span>
                </>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshSiteContent}
              disabled={loading}
              title="Reload all site data"
              className="p-2 rounded-full border border-adm-border text-adm-fg/70 hover:text-adm-accent hover:border-adm-accent transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-adm-accent' : ''}`} />
            </button>

            {/* Light / Dark toggle shared with the website */}
            <ThemeToggle />

            {/* Profile Pill */}
            <div className="flex items-center gap-2 pl-3 ml-1 border-l border-adm-border">
              <div className="w-8 h-8 rounded-full bg-adm-accent text-adm-on-accent flex items-center justify-center text-xs font-semibold">
                {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <p className="font-medium text-adm-fg">{adminUser?.user_metadata?.full_name || adminUser?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-[11px] text-adm-muted">{adminUser?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
