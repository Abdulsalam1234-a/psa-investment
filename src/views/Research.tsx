import React, { useState } from 'react';
import {
  Search,
  Filter,
  TrendingUp,
  Building,
  Calendar,
  User,
  ShieldCheck,
  ArrowRight,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { NgxSector, ConvictionRating } from '../types';

interface ResearchProps {
  onSelectReport?: (reportId: string) => void;
  onNavigate?: (tab: string, slug?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const Research: React.FC<ResearchProps> = ({
  onSelectReport,
  onNavigate,
  onOpenAuthModal
}) => {
  const { equityDossiers, reports } = useData();

  // Always sort dossiers descending: newest publication first
  const sortedDossiers = React.useMemo(() => {
    return [...equityDossiers].sort(
      (a, b) => new Date(b.publishedAt || b.updatedAt).getTime() - new Date(a.publishedAt || a.updatedAt).getTime()
    );
  }, [equityDossiers]);

  const latestDossier = sortedDossiers[0];

  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [isArchiveCollapsed, setIsArchiveCollapsed] = useState<boolean>(false);

  const sectors: (string | NgxSector)[] = [
    'All',
    'Banking',
    'Oil & Gas',
    'Consumer Goods',
    'Industrial Goods',
    'Telecoms',
    'Agriculture'
  ];

  const ratings: (string | ConvictionRating)[] = [
    'All',
    'BUY',
    'ACCUMULATE',
    'HOLD',
    'WATCHLIST'
  ];

  const filteredDossiers = sortedDossiers.filter(d => {
    const matchesSector = selectedSector === 'All' || d.sector === selectedSector;
    const matchesRating = selectedRating === 'All' || d.convictionRating === selectedRating;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.companyName.toLowerCase().includes(search.toLowerCase()) ||
      d.ticker.toLowerCase().includes(search.toLowerCase()) ||
      d.executiveSummary.toLowerCase().includes(search.toLowerCase());

    return matchesSector && matchesRating && matchesSearch;
  });

  const handleOpenDossier = (slug: string) => {
    if (onNavigate) {
      onNavigate('research', slug);
    } else {
      window.location.href = `/research/${slug}`;
    }
  };

  const getRatingBadgeStyle = (rating: string) => {
    switch (rating) {
      case 'BUY':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'ACCUMULATE':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'HOLD':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-12 pb-24 bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#0A1F44] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>PSAI Institutional Intelligence Portal</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#0A1F44] tracking-tight max-w-3xl mx-auto">
            Nigerian Exchange (NGX) Equity Research & Valuation Dossiers
          </h1>

          <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Rigorous fundamental valuation models, discounted cash flow (DCF) frameworks, and recapitalization diagnostics direct from Chief Analyst Salami Abdullahi A.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by company, ticker (e.g. GTCO, SEPLAT, MTNN), or thesis..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs sm:text-sm text-slate-800 outline-none focus:border-[#C9A84C] transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Latest Upload (Shown at Top) */}
      {latestDossier && !search && selectedSector === 'All' && selectedRating === 'All' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A1F44] rounded-3xl p-6 sm:p-8 text-white border border-[#C9A84C]/40 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C] text-[#0A1F44] text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Latest Published Equity Research
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getRatingBadgeStyle(latestDossier.convictionRating)} bg-white`}>
                    {latestDossier.convictionRating}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    {latestDossier.sector} • {new Date(latestDossier.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h2 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight">
                    {latestDossier.companyName} ({latestDossier.ticker})
                  </h2>
                  <p className="text-[#C9A84C] font-semibold text-sm sm:text-base mt-1">
                    {latestDossier.title}
                  </p>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {latestDossier.executiveSummary}
                </p>

                {/* Valuation Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <div className="text-[10px] text-slate-300 uppercase">Current Price</div>
                    <div className="font-mono font-bold text-white text-sm">{latestDossier.currentPrice}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <div className="text-[10px] text-slate-300 uppercase">Target Fair Value</div>
                    <div className="font-mono font-bold text-[#C9A84C] text-sm">{latestDossier.targetPrice}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <div className="text-[10px] text-slate-300 uppercase">Upside Potential</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm">{latestDossier.upsidePercent}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <div className="text-[10px] text-slate-300 uppercase">Forward P/E</div>
                    <div className="font-mono font-bold text-white text-sm">{latestDossier.multiples.pe}</div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full lg:w-auto">
                <button
                  onClick={() => handleOpenDossier(latestDossier.slug)}
                  className="w-full lg:w-auto px-6 py-4 rounded-2xl bg-[#C9A84C] hover:bg-[#d8b556] text-[#0A1F44] font-black text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                >
                  <span>Open Full Valuation Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sector & Rating Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* NGX Sector Filter Pills */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A1F44]">
              <Layers className="w-4 h-4 text-[#C9A84C]" />
              <span>Filter by NGX Sector:</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-mono">
                Showing {filteredDossiers.length} institutional dossiers
              </span>
              <button
                onClick={() => setIsArchiveCollapsed(prev => !prev)}
                className="text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] cursor-pointer"
              >
                {isArchiveCollapsed ? 'Show Archive ▼' : 'Collapse Archive ▲'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {sectors.map(sec => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedSector === sec
                    ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Conviction Rating Pills */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Conviction Rating:</span>
            </div>
            {ratings.map(rat => (
              <button
                key={rat}
                onClick={() => setSelectedRating(rat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedRating === rat
                    ? 'bg-[#C9A84C] text-[#0A1F44] shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                }`}
              >
                {rat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Equity Research Dossiers Grid */}
      {!isArchiveCollapsed && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDossiers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700">No equity dossiers matched your filter criteria.</h4>
            <p className="text-xs">Try selecting 'All' sectors or clearing the search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDossiers.map(dossier => (
              <article
                key={dossier.id}
                onClick={() => handleOpenDossier(dossier.slug)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Cover Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#0A1F44]">
                    <img
                      src={dossier.coverImage || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80'}
                      alt={`${dossier.companyName} (${dossier.ticker})`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/40 to-transparent" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${getRatingBadgeStyle(dossier.convictionRating)} bg-white`}>
                        {dossier.convictionRating}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#0A1F44]/80 text-[#C9A84C] border border-[#C9A84C]/40">
                        {dossier.ticker}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                      <span className="text-[11px] font-semibold text-slate-300">{dossier.sector}</span>
                      <span className="text-[10px] text-slate-300">
                        {new Date(dossier.publishedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="font-serif font-black text-lg text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors line-clamp-2 leading-snug">
                        {dossier.title}
                      </h2>
                      <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {dossier.executiveSummary}
                      </p>
                    </div>

                    {/* Valuation Multiples Preview Grid */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Current</span>
                        <span className="font-mono font-bold text-slate-800">{dossier.currentPrice}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Target</span>
                        <span className="font-mono font-bold text-[#0A1F44]">{dossier.targetPrice}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Upside</span>
                        <span className="font-mono font-black text-emerald-600">{dossier.upsidePercent}</span>
                      </div>
                    </div>

                    {/* Secondary Multiples */}
                    <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-mono text-slate-600 pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[9px]">P/E</span>
                        <span className="font-bold">{dossier.multiples.pe}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">P/B</span>
                        <span className="font-bold">{dossier.multiples.pb}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Div Yld</span>
                        <span className="font-bold text-[#C9A84C]">{dossier.multiples.dividendYield}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">ROE</span>
                        <span className="font-bold text-slate-800">{dossier.multiples.roe}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 px-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <User className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>{dossier.author}</span>
                  </div>

                  <span className="font-bold text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors flex items-center gap-1">
                    <span>Read Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      )}
    </div>
  );
};
