import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Play
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { MarketBriefing } from '../types';

interface MarketBriefingsProps {
  onNavigate: (tab: string, slug?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const MarketBriefings: React.FC<MarketBriefingsProps> = ({
  onNavigate,
  onOpenAuthModal
}) => {
  const { marketBriefings } = useData();
  const [search, setSearch] = useState('');
  const [copiedTeaserSlug, setCopiedTeaserSlug] = useState<string | null>(null);
  const [isArchiveCollapsed, setIsArchiveCollapsed] = useState(false);

  // Always sort briefings descending: latest publication first
  const sortedBriefings = React.useMemo(() => {
    return [...marketBriefings].sort(
      (a, b) => new Date(b.publishedAt || b.date).getTime() - new Date(a.publishedAt || a.date).getTime()
    );
  }, [marketBriefings]);

  const latestBriefing = sortedBriefings[0];

  const filteredBriefings = sortedBriefings.filter(b => {
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.volume.toLowerCase().includes(q) ||
      b.date.includes(q) ||
      b.leadArticle.toLowerCase().includes(q) ||
      b.topGainers.some(g => g.ticker.toLowerCase().includes(q) || g.name.toLowerCase().includes(q))
    );
  });

  const handleCopyTeaser = (e: React.MouseEvent, briefing: MarketBriefing) => {
    e.stopPropagation();
    navigator.clipboard.writeText(briefing.whatsappTeaser);
    setCopiedTeaserSlug(briefing.slug);
    setTimeout(() => setCopiedTeaserSlug(null), 2500);
  };

  return (
    <div className="space-y-12 pb-24 bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1F44]/10 border border-[#0A1F44]/20 text-[#0A1F44] text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>07:00 WAT Daily Pre-Market Intelligence Desk</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#0A1F44] tracking-tight max-w-3xl mx-auto">
            Daily NGX Pre-Market Briefings & Institutional Flow
          </h1>

          <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Verified opening bell intelligence, block cross flow analysis, top gainers and losers diagnostics, and corporate regulatory disclosures.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search briefings by date (YYYY-MM-DD), ticker, volume, or driver..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs sm:text-sm text-slate-800 outline-none focus:border-[#C9A84C] transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Briefings List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
          <span>Official Chronological Feed ({filteredBriefings.length} Editions)</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#0A1F44] hidden sm:inline">Daily 07:45 AM Publish-First Archive</span>
            <button
              onClick={() => setIsArchiveCollapsed(prev => !prev)}
              className="text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] cursor-pointer"
            >
              {isArchiveCollapsed ? 'Show Archive ▼' : 'Collapse Archive ▲'}
            </button>
          </div>
        </div>

        {!isArchiveCollapsed && (
          filteredBriefings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700">No briefings found matching your search.</h4>
              <p className="text-xs">Try searching by year or month (e.g. 2026-11) or clearing the field.</p>
            </div>
          ) : (
            filteredBriefings.map((briefing, index) => (
              <article
                key={briefing.id}
                onClick={() => onNavigate('market-briefings', briefing.slug)}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all cursor-pointer group space-y-5"
              >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#0A1F44] text-[#C9A84C]">
                    {briefing.volume}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(briefing.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {index === 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Latest Edition
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopyTeaser(e, briefing)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0A1F44] hover:text-[#C9A84C] text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Copy WhatsApp Channel Teaser"
                  >
                    {copiedTeaserSlug === briefing.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp Teaser</span>
                      </>
                    )}
                  </button>

                  <span className="text-xs font-bold text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors flex items-center gap-1">
                    <span>Full Briefing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Title & Lead Snippet */}
              <div className="space-y-2">
                <h2 className="font-serif font-black text-xl sm:text-2xl text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors leading-snug">
                  {briefing.title}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {briefing.leadArticle}
                </p>
              </div>

              {/* Barometer Snapshot Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">ASI Close</span>
                  <span className="font-mono font-black text-slate-900">{briefing.asiSnapshot.asi}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Session Change</span>
                  <span className="font-mono font-bold text-emerald-600">{briefing.asiSnapshot.dayChange}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Equities Cap</span>
                  <span className="font-mono font-black text-slate-900">{briefing.asiSnapshot.marketCap}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Value Traded</span>
                  <span className="font-mono font-bold text-[#0A1F44]">{briefing.asiSnapshot.value}</span>
                </div>
              </div>

              {/* Gainers & Losers Quick Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 text-[11px] font-semibold mr-1">Top Gainers:</span>
                {briefing.topGainers.slice(0, 3).map(g => (
                  <span key={g.ticker} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono font-bold text-[11px]">
                    {g.ticker} ({g.change})
                  </span>
                ))}
              </div>
            </article>
          ))
        ))}
      </section>
    </div>
  );
};
