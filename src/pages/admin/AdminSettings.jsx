import React, { useEffect, useState } from 'react';
import { CheckCircle2, Server, XCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../lib/api';
import { publishing } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';

const Row = ({ label, children }) => (
  <div className="flex items-center justify-between py-3 border-b border-adm-border last:border-0 text-[13px]">
    <span className="text-adm-muted">{label}</span>
    <span className="text-adm-fg font-medium text-right">{children}</span>
  </div>
);

const COMMANDS = [
  ['Reset an admin password', 'python -m app.cli reset-password --email …'],
  ['Add an editor', 'python -m app.cli create-admin --email … --role editor'],
  ['Sign someone out everywhere', 'python -m app.cli revoke-sessions --email …'],
  ['Publish from the server', 'python -m app.cli publish'],
];

export const AdminSettings = () => {
  const { adminUser } = useAdminAuth();
  const [health, setHealth] = useState(null);
  const [publish, setPublish] = useState(null);

  useEffect(() => {
    api('/health').then(setHealth).catch(() => setHealth({ status: 'down' }));
    publishing.status().then(setPublish).catch(() => {});
  }, []);

  const ok = health?.status === 'ok';

  return (
    <AdminLayout title="System" subtitle="Status of the website backend">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="adm-card p-6">
          <h3 className="text-[13px] font-semibold text-adm-fg mb-2 flex items-center gap-2"><Server className="w-4 h-4 text-adm-accent" /> Backend</h3>
          <Row label="API">
            {health === null ? 'Checking…' : (
              <span className={`inline-flex items-center gap-1.5 ${ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                {ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />} {ok ? 'Running' : 'Unavailable'}
              </span>
            )}
          </Row>
          <Row label="Database">{health?.db === 'ok' ? 'Connected' : health ? 'Unavailable' : '…'}</Row>
          <Row label="Database version">{health?.migration || '…'}</Row>
          <Row label="API version">{health?.version || '…'}</Row>
          <Row label="Website content">{publish ? (publish.hasUnpublishedChanges ? 'Unpublished changes waiting' : 'Up to date') : '…'}</Row>
          <Row label="Last published">{publish?.lastPublishedAt ? new Date(publish.lastPublishedAt).toLocaleString('en-IN') : '…'}</Row>
        </div>
        <div className="adm-card p-6">
          <h3 className="text-[13px] font-semibold text-adm-fg mb-2">Your account</h3>
          <Row label="Signed in as">{adminUser?.email}</Row>
          <Row label="Role"><span className="capitalize">{adminUser?.role}</span></Row>
          <Row label="Session">Signs out after 2 h idle, or 12 h after sign-in</Row>
          <h3 className="text-[13px] font-semibold text-adm-fg mt-6 mb-2">Server commands</h3>
          <p className="text-[12px] text-adm-muted mb-3">Run in <code className="font-mono">/root/dev/symmetry_backend</code> on the server (see docs/OPERATIONS.md).</p>
          <ul className="space-y-2">
            {COMMANDS.map(([label, cmd]) => (
              <li key={label} className="text-[12px]">
                <p className="text-adm-fg/80">{label}</p>
                <code className="block mt-0.5 px-3 py-2 rounded-lg bg-adm-surface2 font-mono text-[11px] text-adm-fg/90 overflow-x-auto">.venv/bin/{cmd}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
