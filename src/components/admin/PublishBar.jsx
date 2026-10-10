import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, CloudUpload, Loader2 } from 'lucide-react';
import { CONTENT_CHANGED_EVENT, publishing } from '../../services/adminApi';

const timeAgo = (iso) => {
  if (!iso) return 'never';
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(iso).toLocaleDateString();
};

// Saves go to the database right away; the website changes only when someone clicks Publish
export const PublishBar = () => {
  const [status, setStatus] = useState(null);
  const [publishing_, setPublishing] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    publishing.status().then(setStatus).catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => document.visibilityState === 'visible' && refresh();
    window.addEventListener(CONTENT_CHANGED_EVENT, refresh);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener(CONTENT_CHANGED_EVENT, refresh);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refresh]);

  const handlePublish = async () => {
    if (!window.confirm('Publish all saved changes to the live website now?')) return;
    setPublishing(true);
    setError('');
    try {
      await publishing.publish();
    } catch (err) {
      setError(err.message || 'Publish failed');
    } finally {
      setPublishing(false);
      refresh();
    }
  };

  if (!status) return null;
  const pending = status.hasUnpublishedChanges;
  const lastLine = `Last published ${timeAgo(status.lastPublishedAt)}${status.lastPublishedBy ? ` by ${status.lastPublishedBy}` : ''}`;

  return (
    <div className="flex items-center gap-2" title={error || lastLine}>
      {pending ? (
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Unpublished changes
        </span>
      ) : (
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Website up to date
        </span>
      )}
      <button
        type="button"
        onClick={handlePublish}
        disabled={!pending || publishing_}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold bg-adm-accent text-adm-on-accent hover:bg-adm-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {publishing_ ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
        Publish
      </button>
      {error && <span className="text-[11px] text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
};

export default PublishBar;
