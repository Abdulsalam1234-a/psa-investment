import React, { useState, useRef } from 'react';
import {
  Image,
  Upload,
  Sparkles,
  Globe,
  Sliders,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Save,
  Eye,
  Type,
  Search,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Laptop,
  Smartphone
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { SiteSettings } from '../types';

export const AdminBrandingDesk: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useData();

  const [formData, setFormData] = useState<SiteSettings>({ ...siteSettings });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(siteSettings.logoUrl || '');
  const [faviconPreview, setFaviconPreview] = useState<string>(siteSettings.faviconUrl || '');

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Convert uploaded image file to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Selected file exceeds 2MB limit. Please upload an optimized web image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (target === 'logo') {
        setLogoPreview(base64String);
        setFormData(prev => ({ ...prev, logoUrl: base64String }));
      } else {
        setFaviconPreview(base64String);
        setFormData(prev => ({ ...prev, faviconUrl: base64String }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(formData);
    showToast('Platform branding, official logo, and page rendering settings updated!');
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset platform branding and rendering configurations to default settings?')) {
      const defaults: Partial<SiteSettings> = {
        siteTitle: 'PSA Investment',
        tagline: 'Independent Equity Research & Capital Advisory',
        logoUrl: '',
        faviconUrl: '',
        heroHeadline: 'Building Wealth Through Intelligent Investments',
        heroSubheadline: 'Institutional-grade Nigerian equity research, valuation models, and capital advisory directed by Chief Analyst Salami Abdullahi.',
        officialEmail: 'psainvestment.ng@gmail.com',
        ceoEmail: 'salamiabdullahi257@gmail.com',
        officialPhone: '+234 706 837 1292',
        announcementTickerText: 'Vol. LIII Nigerian Capital Markets Daily Intelligence & Nov 28 FMVA Masterclass Registration Active',
        showTicker: true,
        showDailyChronicleHighlight: true,
        showAdsenseOnHome: true
      };
      setFormData(prev => ({ ...prev, ...defaults }));
      setLogoPreview('');
      setFaviconPreview('');
      await updateSiteSettings(defaults);
      showToast('Restored default branding and layout settings.');
    }
  };

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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A84C]/20 text-[#0A1F44]">
              Platform Architecture
            </span>
            <span className="text-xs text-slate-400">• Official Logo, SEO & Rendering Controls</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-[#0A1F44] mt-1">
            Site Branding & Page Rendering Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload and update the official logo, customize browser title tabs, manage SEO tags, and toggle dynamic rendering features.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* LIVE BROWSER TAB SIMULATOR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C9A84C]" />
            <h3 className="font-serif font-bold text-sm text-[#0A1F44]">
              Live Browser Title Tab Preview
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Real-Time DOM Synchronization</span>
        </div>

        {/* Browser Mock Tab */}
        <div className="bg-slate-100 p-2.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 max-w-sm bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-4 h-4 rounded overflow-hidden flex items-center justify-center shrink-0">
              {faviconPreview || logoPreview ? (
                <img src={faviconPreview || logoPreview} alt="Favicon" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-[9px] text-[#C9A84C] bg-[#0A1F44] w-full h-full flex items-center justify-center rounded">P</span>
              )}
            </div>
            <div className="font-sans text-xs font-semibold text-slate-800 truncate">
              {formData.siteTitle || 'PSA Investment'} | {formData.tagline || 'Independent Equity Research'}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONFIGURATION FORM */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: LOGO & FAVICON UPLOAD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
              1. Official Platform Logo & Browser Favicon
            </h3>
            <span className="text-xs text-slate-400">High-Resolution Branding</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Box */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#0A1F44]">Official Platform Logo</h4>
                  <p className="text-[11px] text-slate-500">Rendered in the Navbar, mobile header, and footer.</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#0A1F44] border border-[#C9A84C]/40 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif font-bold text-sm text-[#C9A84C]">PSA</span>
                  )}
                </div>
              </div>

              <input
                type="file"
                ref={logoFileInputRef}
                accept="image/*"
                onChange={e => handleFileChange(e, 'logo')}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo File (PNG/SVG)</span>
                </button>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview('');
                      setFormData(prev => ({ ...prev, logoUrl: '' }));
                    }}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Remove Custom Logo
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Or Paste External Logo URL:
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl || ''}
                  onChange={e => {
                    setFormData({ ...formData, logoUrl: e.target.value });
                    setLogoPreview(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            {/* Favicon Box */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#0A1F44]">Browser Tab Favicon</h4>
                  <p className="text-[11px] text-slate-500">Square icon displayed in the browser tab and bookmarks.</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  {faviconPreview || logoPreview ? (
                    <img src={faviconPreview || logoPreview} alt="Favicon Preview" className="w-6 h-6 object-cover" />
                  ) : (
                    <span className="font-serif font-black text-xs text-[#0A1F44]">P</span>
                  )}
                </div>
              </div>

              <input
                type="file"
                ref={faviconFileInputRef}
                accept="image/*"
                onChange={e => handleFileChange(e, 'favicon')}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => faviconFileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Favicon (.ico / .svg)</span>
                </button>
                {faviconPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setFaviconPreview('');
                      setFormData(prev => ({ ...prev, faviconUrl: '' }));
                    }}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Clear Favicon
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Or Paste External Favicon URL:
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/favicon.png"
                  value={formData.faviconUrl || ''}
                  onChange={e => {
                    setFormData({ ...formData, faviconUrl: e.target.value });
                    setFaviconPreview(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: IDENTITY & BROWSER TAB TITLE */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
              2. Site Identity & Browser Title Tabs
            </h3>
            <span className="text-xs text-slate-400">Head Title & Brand Text</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Brand / Site Name *
              </label>
              <input
                type="text"
                required
                value={formData.siteTitle}
                onChange={e => setFormData({ ...formData, siteTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Tagline / Subtitle *
              </label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: EDITABLE PAGE RENDERING FEATURES */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
              3. Flexible Page Rendering & Content Controls
            </h3>
            <span className="text-xs text-slate-400">Dynamic UI Blocks</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Home Hero Headline *
              </label>
              <input
                type="text"
                required
                value={formData.heroHeadline}
                onChange={e => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Home Hero Subheadline *
              </label>
              <textarea
                required
                rows={2}
                value={formData.heroSubheadline}
                onChange={e => setFormData({ ...formData, heroSubheadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Breaking Intelligence / Top Announcement Ticker Text
              </label>
              <input
                type="text"
                value={formData.announcementTickerText}
                onChange={e => setFormData({ ...formData, announcementTickerText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C]"
              />
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-800">Show Top Ticker</span>
                <input
                  type="checkbox"
                  checked={formData.showTicker}
                  onChange={e => setFormData({ ...formData, showTicker: e.target.checked })}
                  className="rounded text-[#0A1F44] focus:ring-[#C9A84C] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-800">Daily Chronicle Card</span>
                <input
                  type="checkbox"
                  checked={formData.showDailyChronicleHighlight}
                  onChange={e => setFormData({ ...formData, showDailyChronicleHighlight: e.target.checked })}
                  className="rounded text-[#0A1F44] focus:ring-[#C9A84C] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-800">Home AdSense Banner</span>
                <input
                  type="checkbox"
                  checked={formData.showAdsenseOnHome}
                  onChange={e => setFormData({ ...formData, showAdsenseOnHome: e.target.checked })}
                  className="rounded text-[#0A1F44] focus:ring-[#C9A84C] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 4: CORPORATE CONTACTS & CHANNELS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
              4. Official Advisory Contacts & Communication Lines
            </h3>
            <span className="text-xs text-slate-400">Footer & Direct Contacts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Phone Line (WhatsApp) *
              </label>
              <input
                type="text"
                required
                value={formData.officialPhone}
                onChange={e => setFormData({ ...formData, officialPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Desk Email *
              </label>
              <input
                type="email"
                required
                value={formData.officialEmail}
                onChange={e => setFormData({ ...formData, officialEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CEO & Chief Analyst Email *
              </label>
              <input
                type="email"
                required
                value={formData.ceoEmail}
                onChange={e => setFormData({ ...formData, ceoEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Medium Publication / Blog URL
              </label>
              <input
                type="url"
                value={formData.mediumBlogUrl || ''}
                onChange={e => setFormData({ ...formData, mediumBlogUrl: e.target.value })}
                placeholder="https://medium.com/@salamiabdullahi257"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: SOCIAL PROOF METRICS MULTIPLIER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
                5. Social Proof Multipliers (Public Readership Telemetry)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Elevates public readership & download counters to build brand prestige and community intrigue, while maintaining 100% accurate raw logs in your Admin Desk.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableSocialProofMultiplier}
                onChange={e => setFormData({ ...formData, enableSocialProofMultiplier: e.target.checked })}
                className="rounded text-[#0A1F44] focus:ring-[#C9A84C] w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-bold text-[#0A1F44]">Enable Multiplier</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Public Multiplier Factor (e.g. 14x)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.publicMetricMultiplier || 14}
                onChange={e => setFormData({ ...formData, publicMetricMultiplier: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
              />
              <span className="text-[10px] text-slate-400">Multiplies each verified download/view for public visitor cards.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Psychological Engagement Offset (e.g. +165)
              </label>
              <input
                type="number"
                min={0}
                max={5000}
                value={formData.publicMetricOffset || 165}
                onChange={e => setFormData({ ...formData, publicMetricOffset: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-[#C9A84C]"
              />
              <span className="text-[10px] text-slate-400">Baseline seed count ensuring new publications immediately look authoritative.</span>
            </div>
          </div>
        </div>

        {/* SECTION 6: ABOUT US, PILLARS & MANAGEMENT CUSTOMIZER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
                6. About Us Page, Mission, Vision & Pillars Customizer
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize institutional narrative statements and guiding pillars displayed on the About page.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Mission Statement *
              </label>
              <textarea
                rows={2}
                value={formData.missionStatement}
                onChange={e => setFormData({ ...formData, missionStatement: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Vision Statement *
              </label>
              <textarea
                rows={2}
                value={formData.visionStatement}
                onChange={e => setFormData({ ...formData, visionStatement: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-[#0A1F44]">
                Three Unyielding Pillars (Guiding Creed)
              </label>
              {formData.pillars.map((pillar, idx) => (
                <div key={pillar.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#0A1F44] text-[#C9A84C] text-xs font-bold font-mono flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={e => {
                        const updated = [...formData.pillars];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, pillars: updated });
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#0A1F44]"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={e => {
                      const updated = [...formData.pillars];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, pillars: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 7: COMPLETE SEO META TAGS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
              5. Search Engine Optimization (SEO) & Social Meta
            </h3>
            <span className="text-xs text-slate-400">Google, X, LinkedIn Crawlers</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meta Description (Search Snippet) *
              </label>
              <textarea
                required
                rows={3}
                value={formData.metaDescription}
                onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] resize-none"
              />
              <span className="text-[10px] text-slate-400">Recommended 140 - 160 characters for optimal Google search ranking.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SEO Keywords (Comma Separated) *
              </label>
              <input
                type="text"
                required
                value={formData.metaKeywords}
                onChange={e => setFormData({ ...formData, metaKeywords: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transition-all hover:scale-102 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Apply & Save Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
