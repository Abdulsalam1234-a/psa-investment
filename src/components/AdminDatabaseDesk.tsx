import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  Database,
  Cloud,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Save,
  ShieldCheck,
  Server,
  Zap,
  Info,
  Code,
  Copy,
  Check
} from 'lucide-react';
import {
  getCloudDbConfig,
  saveCloudDbConfig,
  testCloudConnection,
  exportCompleteDatabaseJson,
  importCompleteDatabaseJson,
  syncTableToCloud,
  CloudDbConfig
} from '../utils/cloudDatabase';
import { useData } from '../context/DataContext';

export const AdminDatabaseDesk: React.FC = () => {
  const { members, chronicles, events, refreshData } = useData();

  const [config, setConfig] = useState<CloudDbConfig>(() => getCloudDbConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testCloudConnection(config);
      setTestResult(res);
      if (res.success) {
        showToast('Database connection verified successfully!');
      }
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudDbConfig(config);
    showToast('Database configuration saved.');
    await handleTestConnection();
  };

  const handleSyncToCloud = async () => {
    setSyncing(true);
    try {
      await syncTableToCloud('psa_members', members);
      await syncTableToCloud('psa_chronicles', chronicles);
      await syncTableToCloud('psa_events', events);
      const updated = { ...config, lastSyncedAt: new Date().toISOString() };
      setConfig(updated);
      saveCloudDbConfig(updated);
      showToast('All members, chronicles, and events pushed to cloud database!');
    } catch (e) {
      alert('Cloud sync encountered an issue: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  };

  const handleExportJson = () => {
    const json = exportCompleteDatabaseJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PSA_Database_Full_Snapshot_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    showToast('Complete database snapshot exported to JSON file!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const res = importCompleteDatabaseJson(text);
        if (res.success) {
          showToast(`Successfully restored ${res.importedTables.length} data tables!`);
          await refreshData();
        } else {
          alert('Failed to parse database backup file. Ensure valid JSON format.');
        }
      } catch {
        alert('Error reading import file.');
      }
    };
    reader.readAsText(file);
  };

  const handleCopySql = () => {
    const sqlScript = `-- PSA Investment Database Schema
CREATE TABLE IF NOT EXISTS public.briefings (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  volume TEXT NOT NULL,
  briefing_date DATE NOT NULL,
  title TEXT NOT NULL,
  asi TEXT NOT NULL,
  asi_change TEXT NOT NULL,
  market_cap TEXT NOT NULL,
  lead_article TEXT NOT NULL,
  macro_highlights JSONB DEFAULT '[]'::jsonb,
  top_gainers JSONB DEFAULT '[]'::jsonb,
  top_losers JSONB DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.dossiers (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  conviction_rating TEXT NOT NULL,
  current_price TEXT NOT NULL,
  target_price TEXT NOT NULL,
  upside_percent TEXT NOT NULL,
  multiples JSONB DEFAULT '{}'::jsonb,
  executive_summary TEXT NOT NULL,
  investment_thesis TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.chronicles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  volume TEXT NOT NULL,
  chronicle_date DATE NOT NULL,
  cover_headline TEXT NOT NULL,
  market_summary TEXT NOT NULL,
  raw_text TEXT,
  formatted_html TEXT,
  docx_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role_type TEXT DEFAULT 'member',
  membership_status TEXT DEFAULT 'pending',
  applied_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL
);
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chronicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Briefings" ON public.briefings FOR SELECT USING (true);
CREATE POLICY "Public Read Dossiers" ON public.dossiers FOR SELECT USING (true);
CREATE POLICY "Public Read Chronicles" ON public.chronicles FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    showToast('PostgreSQL SQL Schema copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center shadow-md">
              <Database className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-serif font-black text-2xl text-[#0A1F44]">
                Free Cloud Database & Storage Manager
              </h2>
              <p className="text-xs text-slate-500">
                Persistent PostgreSQL database via Supabase (Perpetual Free Tier: 500MB, unlimited API queries, automated SSL).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                config.projectUrl && config.apiKey
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              {config.projectUrl && config.apiKey ? 'Cloud Database Linked' : 'Local Fail-Safe Mode Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Cloud DB Credentials Form */}
      <form onSubmit={handleSaveConfig} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
              Supabase / Cloud Database Connection Credentials
            </h3>
            <p className="text-xs text-slate-500">
              Provide your free project credentials from <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#0A1F44] underline font-bold">Supabase.com</a>.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Free Perpetual Tier
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cloud Database Provider
            </label>
            <select
              value={config.provider}
              onChange={e => setConfig({ ...config, provider: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#0A1F44] outline-none"
            >
              <option value="supabase">Supabase PostgreSQL (Recommended - 100% Free Forever)</option>
              <option value="firebase">Google Firebase Firestore (Alternative Free Tier)</option>
              <option value="local_fallback">Local Browser Fail-Safe (Zero Configuration)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project REST API URL
              </label>
              <input
                type="url"
                value={config.projectUrl}
                onChange={e => setConfig({ ...config, projectUrl: e.target.value })}
                placeholder="https://yourprojectid.supabase.co"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
              />
              <span className="text-[10px] text-slate-400">Found in Project Settings &rarr; API &rarr; Project URL</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Public Anon / Client API Key
              </label>
              <input
                type="password"
                value={config.apiKey}
                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
              />
              <span className="text-[10px] text-slate-400">Safe for frontend usage (Project Settings &rarr; API &rarr; anon public)</span>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testResult.message} ({testResult.latencyMs}ms latency)</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Server className="w-3.5 h-3.5" />
                <span>{testing ? 'Probing Cloud...' : 'Test Connection'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySql}
                className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code className="w-3.5 h-3.5 text-amber-700" />}
                <span>{copiedSql ? 'Schema Copied!' : 'Copy Supabase SQL Schema'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncToCloud}
                disabled={syncing}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Cloud className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>{syncing ? 'Syncing...' : 'Sync All Data to Cloud'}</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Snapshot Backup & Restore */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
            Zero-Data-Loss Backup & Snapshot Restoration
          </h3>
          <p className="text-xs text-slate-500">
            Download your entire system state (chronicles, member registrations, research reports, settings, and logs) in one encrypted JSON archive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-xs text-[#0A1F44] flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#C9A84C]" />
                Export Full System Snapshot
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Creates an immediate snapshot backup containing all {members.length} members, {chronicles.length} chronicle volumes, and event records.
              </p>
            </div>
            <button
              onClick={handleExportJson}
              className="w-full py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              Download JSON Database Snapshot
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-xs text-[#0A1F44] flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-600" />
                Restore System from Backup File
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Upload a previously saved `.json` snapshot to seamlessly restore all data tables without losing any history.
              </p>
            </div>
            <label className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 text-center cursor-pointer transition-colors block">
              <span>Choose Snapshot JSON to Restore</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
