import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import PublishBar from './PublishBar';
import ThemeToggle from '../ThemeToggle';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLayout = ({ children, title = 'Dashboard', subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminUser } = useAdminAuth();

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
            {/* Unpublished changes + Publish */}
            <PublishBar />

            {/* Light / Dark toggle shared with the website */}
            <ThemeToggle />

            {/* Profile Pill */}
            <div className="flex items-center gap-2 pl-3 ml-1 border-l border-adm-border">
              <div className="w-8 h-8 rounded-full bg-adm-accent text-adm-on-accent flex items-center justify-center text-xs font-semibold">
                {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <p className="font-medium text-adm-fg">{adminUser?.fullName || adminUser?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-[11px] text-adm-muted capitalize">{adminUser?.role || 'Administrator'}</p>
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
