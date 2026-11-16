import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Eye,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Sliders,
  ShieldCheck,
  ExternalLink,
  Laptop,
  Smartphone,
  Save
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { GoogleAdsConfig } from '../types';
import { GoogleAdSlot } from './GoogleAdSlot';

export const AdminAdsDesk: React.FC = () => {
  const { googleAdsConfig, updateGoogleAdsConfig } = useData();

  const [enabled, setEnabled] = useState(googleAdsConfig.enabled);
  const [publisherId, setPublisherId] = useState(googleAdsConfig.publisherId || 'ca-pub-8392109482103948');
  const [testMode, setTestMode] = useState(googleAdsConfig.testMode);
  const [leaderboardSlot, setLeaderboardSlot] = useState(googleAdsConfig.leaderboardSlot || '1234567890');
  const [sidebarSlot, setSidebarSlot] = useState(googleAdsConfig.sidebarSlot || '2345678901');
  const [inFeedSlot, setInFeedSlot] = useState(googleAdsConfig.inFeedSlot || '3456789012');
  const [chronicleSlot, setChronicleSlot] = useState(googleAdsConfig.chronicleSlot || '4567890123');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoogleAdsConfig({
      enabled,
      publisherId: publisherId.trim(),
      testMode,
      leaderboardSlot: leaderboardSlot.trim(),
      sidebarSlot: sidebarSlot.trim(),
      inFeedSlot: inFeedSlot.trim(),
      chronicleSlot: chronicleSlot.trim()
    });
    setToastMessage('Google Ads configuration successfully updated and applied.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const estimatedMonthlyRev = ((googleAdsConfig.estimatedImpressions * googleAdsConfig.estimatedCpm) / 1000).toFixed(2);
  const estimatedNgnRev = (parseFloat(estimatedMonthlyRev) * 1650).toLocaleString();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono">
              Revenue Monetization
            </span>
            <span className="text-xs text-slate-400">• Google AdSense & Commercial Sponsorship</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-[#0A1F44] mt-1">
            Google Ads & Revenue Monetization Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Google AdSense publisher ID, manage responsive slot units, toggle preview testing, and project monthly platform revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              enabled
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {enabled ? '● Monetization Active' : '○ Monetization Inactive'}
          </span>
        </div>
      </div>

      {/* ESTIMATED REVENUE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Impressions</span>
          <div className="font-serif font-black text-2xl text-[#0A1F44]">
            {googleAdsConfig.estimatedImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% MoM growth</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Financial CPM</span>
          <div className="font-serif font-black text-2xl text-[#0A1F44]">
            ${googleAdsConfig.estimatedCpm.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">Tier-1 Finance / Banking niche</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Est. Monthly Revenue (USD)</span>
          <div className="font-serif font-black text-2xl text-emerald-700">
            ${estimatedMonthlyRev}
          </div>
          <div className="text-[11px] text-slate-500">Gross advertising yields</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Est. Monthly Revenue (NGN)</span>
          <div className="font-serif font-black text-2xl text-[#0A1F44]">
            ₦{estimatedNgnRev}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">Direct payout to CEO account</div>
        </div>
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
            Google AdSense Configuration
          </h3>
          <span className="text-xs text-slate-400">Production verified tags</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Master Enable Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#0A1F44]">Enable Google Ads Platform-Wide</div>
              <div className="text-[11px] text-slate-500">
                Display responsive banners and sponsored research units.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={e => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A1F44]" />
            </label>
          </div>

          {/* Test Mode Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#0A1F44]">Institutional Test / Preview Mode</div>
              <div className="text-[11px] text-slate-500">
                Displays styled sponsorship cards without triggering live Google scripts.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={testMode}
                onChange={e => setTestMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]" />
            </label>
          </div>

          {/* Publisher ID */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Google AdSense Publisher Client ID (<code className="text-[#0A1F44]">ca-pub-XXXXXXXXXXXXXXXX</code>)
            </label>
            <input
              type="text"
              required
              placeholder="ca-pub-8392109482103948"
              value={publisherId}
              onChange={e => setPublisherId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Obtain this from your Google AdSense Account console under <strong>Account &gt; Settings &gt; Publisher ID</strong>.
            </p>
          </div>

          {/* Slot IDs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Leaderboard Ad Slot ID (Header / Events)
            </label>
            <input
              type="text"
              placeholder="1234567890"
              value={leaderboardSlot}
              onChange={e => setLeaderboardSlot(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chronicle Sponsorship Slot ID (Daily 7 AM Transcript)
            </label>
            <input
              type="text"
              placeholder="4567890123"
              value={chronicleSlot}
              onChange={e => setChronicleSlot(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              In-Feed Sponsored Placement Slot ID (Research Feed)
            </label>
            <input
              type="text"
              placeholder="3456789012"
              value={inFeedSlot}
              onChange={e => setInFeedSlot(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sidebar Sticky Ad Slot ID (Article Viewers)
            </label>
            <input
              type="text"
              placeholder="2345678901"
              value={sidebarSlot}
              onChange={e => setSidebarSlot(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Changes take effect immediately across all website views and PWA app instances.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-102 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Ads Configuration</span>
          </button>
        </div>
      </form>

      {/* LIVE AD SLOT PREVIEW CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#C9A84C]" />
            <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
              Live Ad Placement Preview
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Format: Leaderboard Responsive</span>
        </div>

        <p className="text-xs text-slate-500">
          Below is the exact rendering that visitors and mobile app users see on the website:
        </p>

        <div className="border border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50">
          <GoogleAdSlot slotType="leaderboard" />
        </div>
      </div>
    </div>
  );
};
