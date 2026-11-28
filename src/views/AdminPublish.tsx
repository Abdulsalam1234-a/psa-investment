import React, { useState } from 'react';
import {
  Upload,
  Send,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  FileText,
  TrendingUp,
  Building,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Lock,
  Layers,
  Calendar,
  Clock,
  Eye
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { computeSha256, SUPERADMIN_PIN_HASH } from '../utils/security';
import { NgxSector, ConvictionRating, EquityDossier, MarketBriefing } from '../types';

interface AdminPublishProps {
  onNavigate: (tab: string, slug?: string) => void;
}

export const AdminPublish: React.FC<AdminPublishProps> = ({ onNavigate }) => {
  const { isAdmin, currentUser, memberProfile } = useAuth();
  const { saveEquityDossier, saveMarketBriefing } = useData();

  // Mode: Daily Briefing or Equity Dossier
  const [publishMode, setPublishMode] = useState<'briefing' | 'dossier'>('briefing');

  // Security gate PIN state if accessed directly
  const [securityPin, setSecurityPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(isAdmin);

  // Daily Briefing Form State
  const [briefingDate, setBriefingDate] = useState(new Date().toISOString().split('T')[0]);
  const [briefingVolume, setBriefingVolume] = useState('VOL. LVIII');
  const [briefingTitle, setBriefingTitle] = useState('');
  const [briefingAsi, setBriefingAsi] = useState('');
  const [briefingChange, setBriefingChange] = useState('');
  const [briefingCap, setBriefingCap] = useState('');
  const [briefingVolumeTraded, setBriefingVolumeTraded] = useState('');
  const [briefingValueTraded, setBriefingValueTraded] = useState('');
  const [briefingBreadth, setBriefingBreadth] = useState('Positive (1.3x)');
  const [briefingLeadArticle, setBriefingLeadArticle] = useState('');
  const [briefingGainersText, setBriefingGainersText] = useState('');
  const [briefingLosersText, setBriefingLosersText] = useState('');
  const [briefingYoutubeUrl, setBriefingYoutubeUrl] = useState('');

  // Equity Dossier Form State (Zero pre-population)
  const [dossierCompany, setDossierCompany] = useState('');
  const [dossierTicker, setDossierTicker] = useState('');
  const [dossierSector, setDossierSector] = useState<NgxSector>('Banking');
  const [dossierRating, setDossierRating] = useState<ConvictionRating>('BUY');
  const [dossierCurrentPrice, setDossierCurrentPrice] = useState('');
  const [dossierTargetPrice, setDossierTargetPrice] = useState('');
  const [dossierUpside, setDossierUpside] = useState('');
  const [dossierPe, setDossierPe] = useState('');
  const [dossierPb, setDossierPb] = useState('');
  const [dossierDivYield, setDossierDivYield] = useState('');
  const [dossierRoe, setDossierRoe] = useState('');
  const [dossierMarketCap, setDossierMarketCap] = useState('');
  const [dossierSummary, setDossierSummary] = useState('');
  const [dossierThesis, setDossierThesis] = useState('');
  const [dossierAnalysisMarkdown, setDossierAnalysisMarkdown] = useState('');
  const [dossierTearSheetUrl, setDossierTearSheetUrl] = useState('');

  // Result & WhatsApp Teaser State
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [generatedTeaser, setGeneratedTeaser] = useState<string | null>(null);
  const [copiedTeaser, setCopiedTeaser] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUnlockPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityPin.trim()) {
      showToast('Please enter the security PIN.');
      return;
    }
    const pinHash = await computeSha256(securityPin.trim());
    if (pinHash === SUPERADMIN_PIN_HASH) {
      setIsUnlocked(true);
      showToast('Admin Command Access Unlocked.');
    } else {
      showToast('Invalid Security PIN. Access denied.');
    }
  };

  // Publish Daily Briefing
  const handlePublishBriefing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefingTitle.trim() || !briefingLeadArticle.trim()) {
      showToast('Please provide a title and opening bell article.');
      return;
    }

    // Parse gainers and losers from textarea
    const topGainers = briefingGainersText
      .split('\n')
      .filter(l => l.trim().length > 0)
      .map(line => {
        const parts = line.split(/[(),]/).map(s => s.trim()).filter(Boolean);
        return {
          ticker: parts[0] || 'NGX',
          name: parts[0] || 'Counter',
          close: parts[1] || '₦0.00',
          change: parts[2] || '+0.00%'
        };
      });

    const topLosers = briefingLosersText
      .split('\n')
      .filter(l => l.trim().length > 0)
      .map(line => {
        const parts = line.split(/[(),]/).map(s => s.trim()).filter(Boolean);
        return {
          ticker: parts[0] || 'NGX',
          name: parts[0] || 'Counter',
          close: parts[1] || '₦0.00',
          change: parts[2] || '-0.00%'
        };
      });

    const slug = `ngx-pre-market-briefing-${briefingDate}`;
    const shareUrl = `https://psainvestment.com.ng/market-briefings/${slug}?utm_source=whatsapp&utm_medium=social`;

    const whatsappTeaser = `*PSA INVESTMENT • DAILY NGX PRE-MARKET INTELLIGENCE*\n📅 *${new Date(briefingDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} | ${briefingVolume}*\n• *ASI Snapshot:* ${briefingAsi} (${briefingChange}) | Cap: ${briefingCap}\n• *Turnover:* ${briefingValueTraded} across ${briefingVolumeTraded}\n• *Lead Story:* ${briefingTitle}\n🔗 Read Full Briefing: ${shareUrl}`;

    const newBriefing = await saveMarketBriefing({
      slug,
      title: briefingTitle.trim(),
      date: briefingDate,
      volume: briefingVolume.trim(),
      asiSnapshot: {
        asi: briefingAsi.trim(),
        dayChange: briefingChange.trim(),
        marketCap: briefingCap.trim(),
        volume: briefingVolumeTraded.trim(),
        value: briefingValueTraded.trim(),
        deals: '25,400 deals',
        breadth: briefingBreadth.trim()
      },
      topGainers: topGainers.length > 0 ? topGainers : [{ ticker: 'NGX', name: 'Market', close: '₦0.00', change: '+0.0%' }],
      topLosers: topLosers.length > 0 ? topLosers : [{ ticker: 'NGX', name: 'Market', close: '₦0.00', change: '-0.0%' }],
      corporateDisclosures: [
        {
          entity: 'NGX Regulation (NGX RegCo)',
          event: 'Pre-Market Regulatory Notice',
          details: 'Official trading opens at 09:30 WAT under continuous order book matching.',
          timeline: 'Today 07:00 WAT'
        }
      ],
      macroDrivers: [
        {
          indicator: 'Monetary Policy Rate (MPR)',
          level: '23.00%',
          variance: 'CBN Corridor',
          source: 'Central Bank of Nigeria'
        }
      ],
      tacticalPlaybook: [
        '1. Monitor opening block crosses in tier-1 banking bellwethers.',
        '2. Accumulate oversold dividend growth equities with confirmed dividend qualifications.'
      ],
      youtubeUrl: briefingYoutubeUrl.trim() || undefined,
      leadArticle: briefingLeadArticle.trim(),
      whatsappTeaser,
      publishedAt: new Date().toISOString()
    });

    setPublishedSlug(newBriefing.slug);
    setGeneratedTeaser(whatsappTeaser);
    showToast(`Published Daily Briefing (${briefingVolume}) successfully!`);
  };

  // Publish Equity Dossier
  const handlePublishDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dossierCompany.trim() || !dossierTicker.trim() || !dossierSummary.trim()) {
      showToast('Please provide company name, ticker, and executive summary.');
      return;
    }

    const slug = `${dossierTicker.toLowerCase().trim()}-valuation-equity-dossier-${new Date().getFullYear()}`;
    const shareUrl = `https://psainvestment.com.ng/research/${slug}?utm_source=whatsapp&utm_medium=social`;

    const whatsappTeaser = `*PSA INVESTMENT • INSTITUTIONAL EQUITY DOSSIER*\n📊 *${dossierCompany.trim()} (NGX: ${dossierTicker.toUpperCase().trim()})*\n• Rating: *${dossierRating}* | Target Price: *${dossierTargetPrice}* (${dossierUpside} Upside)\n• Multiples: P/E ${dossierPe} | P/B ${dossierPb} | Div Yield ${dossierDivYield} | ROE ${dossierRoe}\n• Summary: ${dossierSummary.trim().slice(0, 140)}...\n🔗 Full Dossier & Model: ${shareUrl}`;

    const newDossier = await saveEquityDossier({
      slug,
      title: `${dossierCompany.trim()}: Institutional Valuation & Dividend Dossier`,
      companyName: dossierCompany.trim(),
      ticker: dossierTicker.toUpperCase().trim(),
      sector: dossierSector,
      convictionRating: dossierRating,
      currentPrice: dossierCurrentPrice.trim(),
      targetPrice: dossierTargetPrice.trim(),
      upsidePercent: dossierUpside.trim(),
      multiples: {
        pe: dossierPe.trim(),
        pb: dossierPb.trim(),
        dividendYield: dossierDivYield.trim(),
        roe: dossierRoe.trim(),
        marketCap: dossierMarketCap.trim()
      },
      valuationTable: [
        {
          metric: 'Current Share Price (NGX)',
          currentFigure: dossierCurrentPrice.trim(),
          sectorPeerAverage: '₦68.40',
          analystAssessment: 'Fair market entry window.'
        },
        {
          metric: 'Trailing P/E Ratio',
          currentFigure: dossierPe.trim(),
          sectorPeerAverage: '6.5x',
          analystAssessment: 'Attractive multiple relative to sustainable earnings.'
        },
        {
          metric: 'Price-to-Book (P/B)',
          currentFigure: dossierPb.trim(),
          sectorPeerAverage: '1.10x',
          analystAssessment: 'Asset backing supported by tangible equity reserves.'
        },
        {
          metric: 'Dividend Yield (%)',
          currentFigure: dossierDivYield.trim(),
          sectorPeerAverage: '7.8%',
          analystAssessment: 'Sustained free cash flow dividend distribution.'
        },
        {
          metric: 'Return on Equity (ROE)',
          currentFigure: dossierRoe.trim(),
          sectorPeerAverage: '22.0%',
          analystAssessment: 'Solid operating efficiency and capital allocation.'
        },
        {
          metric: 'Market Capitalization',
          currentFigure: dossierMarketCap.trim(),
          sectorPeerAverage: '₦2.00 Trillion',
          analystAssessment: 'High-liquidity blue-chip counter on the Nigerian Exchange.'
        }
      ],
      executiveSummary: dossierSummary.trim(),
      investmentThesis: dossierThesis.trim() || dossierSummary.trim(),
      businessOverview: dossierAnalysisMarkdown.trim() || `Operational overview for ${dossierCompany}.`,
      financialDiagnostics: `Detailed balance sheet and earnings diagnostics for ${dossierTicker}.`,
      catalystsAndRisks: `Key regulatory, macroeconomic, and operational catalysts for ${dossierCompany}.`,
      valuationAndPriceTarget: `Discounted cash flow model with an equity hurdle rate derived from the Nigerian sovereign yield curve.`,
      tearSheetPdfUrl: dossierTearSheetUrl.trim(),
      whatsappTeaser,
      metaTitle: `${dossierTicker} Valuation & Dividend Analysis | PSA Investment`,
      metaDescription: dossierSummary.trim().slice(0, 160),
      author: 'Salami Abdullahi A.',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setPublishedSlug(newDossier.slug);
    setGeneratedTeaser(whatsappTeaser);
    showToast(`Published Equity Dossier (${dossierTicker}) successfully!`);
  };

  const handleCopyGeneratedTeaser = () => {
    if (!generatedTeaser) return;
    navigator.clipboard.writeText(generatedTeaser);
    setCopiedTeaser(true);
    setTimeout(() => setCopiedTeaser(false), 2500);
  };

  if (!isUnlocked && !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center mx-auto shadow-xl">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif font-black text-2xl text-[#0A1F44]">
            Protected Fast-Publishing CMS
          </h2>
          <p className="text-xs text-slate-600">
            Enter Chief Analyst Master PIN to access the 07:45 AM Publish-First distribution desk.
          </p>
        </div>

        <form onSubmit={handleUnlockPin} className="space-y-4">
          <input
            type="password"
            autoFocus
            placeholder="Enter Executive Master PIN..."
            value={securityPin}
            onChange={e => setSecurityPin(e.target.value)}
            className="w-full p-3 text-center bg-white border border-slate-200 rounded-2xl text-sm font-mono tracking-widest outline-none focus:border-[#C9A84C]"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
          >
            Authenticate Publisher Desk
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1F44] text-[#C9A84C] px-5 py-3 rounded-2xl shadow-2xl border border-[#C9A84C]/50 text-xs font-bold animate-in slide-in-from-bottom duration-200">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header className="bg-gradient-to-r from-[#0A1F44] to-[#07152E] text-white py-10 px-4 sm:px-8 border-b border-[#C9A84C]/40 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C9A84C]">
              Institutional Command Publisher
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-white">
              07:45 AM "Publish-First, WhatsApp-Second" Desk
            </h1>
            <p className="text-xs text-slate-300">
              Publish briefings and equity dossiers to raw SSR/ISR HTML, update sitemaps, and generate WhatsApp teasers in 1 click.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white/10 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                setPublishMode('briefing');
                setPublishedSlug(null);
                setGeneratedTeaser(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                publishMode === 'briefing'
                  ? 'bg-[#C9A84C] text-[#0A1F44] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Daily Briefing
            </button>
            <button
              onClick={() => {
                setPublishMode('dossier');
                setPublishedSlug(null);
                setGeneratedTeaser(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                publishMode === 'dossier'
                  ? 'bg-[#C9A84C] text-[#0A1F44] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Equity Dossier
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Success Banner & Generated WhatsApp Teaser Card */}
        {generatedTeaser && publishedSlug && (
          <div className="bg-gradient-to-br from-emerald-950 via-[#0A1F44] to-[#07152E] rounded-3xl p-6 sm:p-8 border border-emerald-500/50 text-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-serif font-black text-lg text-white">Successfully Published Live!</h3>
                  <p className="text-xs text-slate-300">
                    Live URL: <code className="text-[#C9A84C]">https://psainvestment.com.ng/{publishMode === 'briefing' ? 'market-briefings' : 'research'}/{publishedSlug}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate(publishMode === 'briefing' ? 'market-briefings' : 'research', publishedSlug)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0A1F44] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Live Page</span>
                </button>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generatedTeaser)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Broadcast to WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Ready-to-Copy WhatsApp Teaser Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#C9A84C]">
                <span>Generated WhatsApp Broadcast Teaser (Ready to Paste):</span>
                <button
                  onClick={handleCopyGeneratedTeaser}
                  className="text-white hover:text-[#C9A84C] flex items-center gap-1 cursor-pointer"
                >
                  {copiedTeaser ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTeaser ? 'Copied to Clipboard!' : 'Copy Teaser'}</span>
                </button>
              </div>

              <pre className="p-4 bg-black/40 rounded-2xl border border-white/10 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed select-all">
                {generatedTeaser}
              </pre>
            </div>
          </div>
        )}

        {/* 1. Daily Briefing Form */}
        {publishMode === 'briefing' && (
          <form onSubmit={handlePublishBriefing} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#C9A84C]">Morning Dispatch</span>
                <h2 className="font-serif font-black text-xl text-[#0A1F44]">Fast Daily Pre-Market Briefing Publisher</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Workflow Target: 07:45 AM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Briefing Date *</label>
                <input
                  type="date"
                  required
                  value={briefingDate}
                  onChange={e => setBriefingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Volume Tag *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VOL. LVIII"
                  value={briefingVolume}
                  onChange={e => setBriefingVolume(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">YouTube Video Link (Optional)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={briefingYoutubeUrl}
                  onChange={e => setBriefingYoutubeUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Main Headline / Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. NGX Rebounds ₦328B as ASI Reclaims 253,000 Milestone on Banking Volume Surge"
                value={briefingTitle}
                onChange={e => setBriefingTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C] font-serif font-bold text-[#0A1F44]"
              />
            </div>

            {/* ASI Barometer Row */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1F44]">Session Barometer Snapshot</span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block">ASI Close</label>
                  <input
                    type="text"
                    value={briefingAsi}
                    onChange={e => setBriefingAsi(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Day Change</label>
                  <input
                    type="text"
                    value={briefingChange}
                    onChange={e => setBriefingChange(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Market Cap</label>
                  <input
                    type="text"
                    value={briefingCap}
                    onChange={e => setBriefingCap(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Traded Volume</label>
                  <input
                    type="text"
                    value={briefingVolumeTraded}
                    onChange={e => setBriefingVolumeTraded(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Traded Value</label>
                  <input
                    type="text"
                    value={briefingValueTraded}
                    onChange={e => setBriefingValueTraded(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs font-bold text-[#0A1F44]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Breadth</label>
                  <input
                    type="text"
                    value={briefingBreadth}
                    onChange={e => setBriefingBreadth(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Top Gainers & Losers Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Top Gainers (1 per line: TICKER, PRICE, CHANGE)
                </label>
                <textarea
                  rows={4}
                  value={briefingGainersText}
                  onChange={e => setBriefingGainersText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Top Losers (1 per line: TICKER, PRICE, CHANGE)
                </label>
                <textarea
                  rows={4}
                  value={briefingLosersText}
                  onChange={e => setBriefingLosersText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Opening Bell Analysis Markdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Opening Bell Article / Markdown Text *
              </label>
              <textarea
                rows={8}
                required
                placeholder="Paste the daily market recap, floor clearance analysis, block crosses, and tactical setups..."
                value={briefingLeadArticle}
                onChange={e => setBriefingLeadArticle(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-[#C9A84C] font-mono leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <Send className="w-4 h-4" />
                <span>Publish Daily Briefing & Generate WhatsApp Teaser</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. Equity Dossier Form */}
        {publishMode === 'dossier' && (
          <form onSubmit={handlePublishDossier} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#C9A84C]">Dossier Architect</span>
                <h2 className="font-serif font-black text-xl text-[#0A1F44]">Fast Equity Research Dossier Publisher</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Monthly / Company Valuation Note</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guaranty Trust Holding Co"
                  value={dossierCompany}
                  onChange={e => setDossierCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NGX Ticker Symbol *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GTCO"
                  value={dossierTicker}
                  onChange={e => setDossierTicker(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NGX Sector *</label>
                <select
                  value={dossierSector}
                  onChange={e => setDossierSector(e.target.value as NgxSector)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                >
                  <option value="Banking">Banking</option>
                  <option value="Oil & Gas">Oil & Gas</option>
                  <option value="Consumer Goods">Consumer Goods</option>
                  <option value="Industrial Goods">Industrial Goods</option>
                  <option value="Telecoms">Telecoms</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Conviction Stance *</label>
                <select
                  value={dossierRating}
                  onChange={e => setDossierRating(e.target.value as ConvictionRating)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#C9A84C]"
                >
                  <option value="BUY">BUY</option>
                  <option value="ACCUMULATE">ACCUMULATE</option>
                  <option value="HOLD">HOLD</option>
                  <option value="WATCHLIST">WATCHLIST</option>
                </select>
              </div>
            </div>

            {/* Target Price & Upside */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Share Price (NGX) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₦119.20"
                  value={dossierCurrentPrice}
                  onChange={e => setDossierCurrentPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">12-Month Target Price *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₦158.00"
                  value={dossierTargetPrice}
                  onChange={e => setDossierTargetPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-[#0A1F44] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Projected Upside % *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +32.6%"
                  value={dossierUpside}
                  onChange={e => setDossierUpside(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-black text-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* 5 Valuation Multiples Mandatory Inputs */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1F44]">
                Mandatory Valuation Multiples Matrix (Rendered as Semantic HTML &lt;table&gt;)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block">Trailing P/E *</label>
                  <input
                    type="text"
                    required
                    value={dossierPe}
                    onChange={e => setDossierPe(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block">Price-to-Book (P/B) *</label>
                  <input
                    type="text"
                    required
                    value={dossierPb}
                    onChange={e => setDossierPb(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block">Dividend Yield (%) *</label>
                  <input
                    type="text"
                    required
                    value={dossierDivYield}
                    onChange={e => setDossierDivYield(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs text-[#C9A84C] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block">Return on Equity (ROE) *</label>
                  <input
                    type="text"
                    required
                    value={dossierRoe}
                    onChange={e => setDossierRoe(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] text-slate-500 font-semibold block">Market Cap *</label>
                  <input
                    type="text"
                    required
                    value={dossierMarketCap}
                    onChange={e => setDossierMarketCap(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Executive Summary & Investment Thesis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Executive Summary *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Summary of operational moat, deposit base, or earnings drivers..."
                  value={dossierSummary}
                  onChange={e => setDossierSummary(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Investment Thesis & Catalysts *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Core investment justification, DCF upside catalysts, and margin drivers..."
                  value={dossierThesis}
                  onChange={e => setDossierThesis(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            {/* Structured Analysis Markdown Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Structured Research Body (Markdown: Business Overview, Diagnostics, Risks, Valuation)
              </label>
              <textarea
                rows={8}
                placeholder="Paste Markdown sections for Business Overview, Financial Diagnostics, Catalysts & Risks, and DCF Valuation..."
                value={dossierAnalysisMarkdown}
                onChange={e => setDossierAnalysisMarkdown(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-[#C9A84C] font-mono"
              />
            </div>

            {/* PDF Tear-Sheet Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attach 1-Page PDF Tear-Sheet Download Link
              </label>
              <input
                type="text"
                value={dossierTearSheetUrl}
                onChange={e => setDossierTearSheetUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <Send className="w-4 h-4" />
                <span>Publish Equity Dossier & Generate WhatsApp Teaser</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
