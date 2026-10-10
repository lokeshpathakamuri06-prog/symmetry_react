import React, { useState } from 'react';
import { Settings, Database, DatabaseZap, Sparkles, Check, RefreshCw, AlertTriangle, Key } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminDataService from '../../services/adminDataService';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminSettings = () => {
  const { isSupabaseConfigured } = useAdminAuth();
  const { refreshSiteContent } = useSiteContent();

  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await adminDataService.seedSupabaseDatabase();
      setSeedResult(res);
      await refreshSiteContent();
    } catch (err) {
      setSeedResult({ success: false, message: err.message });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <AdminLayout title="System Settings & Database" subtitle="Supabase environment status, schema migration guide, and database seeding">
      <div className="space-y-6 max-w-4xl">
        {/* Status Card */}
        <div className="adm-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-adm-border">
            <h2 className="text-sm font-semibold text-adm-fg uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-adm-accent" /> Supabase Connection Status
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isSupabaseConfigured ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}>
              {isSupabaseConfigured ? 'Connected to Supabase' : 'Offline / Demo Mode'}
            </span>
          </div>

          <p className="text-xs text-adm-fg/70 leading-relaxed">
            {isSupabaseConfigured
              ? 'Your application is connected to a live Supabase PostgreSQL database. All product, order, content, and media modifications will persist directly in your Supabase cloud database.'
              : 'Your application is currently running in Demo Mode using local persistent storage. To connect your live Supabase database, create a `.env` file in the project root with your credentials.'}
          </p>

          <div className="p-4 bg-adm-surface2 border border-adm-border rounded-xl font-mono text-xs space-y-2">
            <p className="text-adm-accent font-sans font-semibold">Environment Setup Variables (.env):</p>
            <div className="text-adm-fg/80 space-y-1">
              <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
              <p>VITE_SUPABASE_ANON_KEY=your-anon-public-key</p>
            </div>
          </div>
        </div>

        {/* 1-Click Database Seeder Tool */}
        <div className="adm-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-adm-border">
            <div>
              <h2 className="text-sm font-semibold text-adm-fg uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Auto-Seed Database Tool
              </h2>
              <p className="text-xs text-adm-fg/40 mt-0.5">Populate all 12 Supabase PostgreSQL tables with default store & CMS data in 1 click.</p>
            </div>
            <button
              onClick={handleSeedDatabase}
              disabled={seeding || !isSupabaseConfigured}
              className="px-5 py-2.5 bg-adm-accent hover:bg-adm-accent-hover disabled:opacity-50 text-adm-on-accent rounded-xl text-xs font-medium flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Seeding Tables...' : 'Seed Supabase Database'}
            </button>
          </div>

          {seedResult && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              seedResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
            }`}>
              {seedResult.message}
            </div>
          )}

          <div className="text-xs text-adm-fg/50 space-y-1">
            <p>• Make sure you have executed `supabase_schema.sql` in your Supabase SQL Editor first.</p>
            <p>• The schema file is available at `d:\symmetry_react\supabase_schema.sql`.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
