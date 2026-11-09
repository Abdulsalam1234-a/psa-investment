import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Lock,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  Clock,
  User,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface ResearchProps {
  onSelectReport: (reportId: string) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const Research: React.FC<ResearchProps> = ({ onSelectReport, onOpenAuthModal }) => {
  const { reports } = useData();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Market Report',
    'Equity Valuation',
    'Industry Analysis',
    'SME Guide',
    'Solar Energy',
    'Investment Memo'
  ];

  const filteredReports = reports.filter(rep => {
    const matchesCategory = selectedCategory === 'All' || rep.category === selectedCategory;
    const matchesSearch =
      rep.title.toLowerCase().includes(search.toLowerCase()) ||
      rep.summary.toLowerCase().includes(search.toLowerCase()) ||
      (rep.ticker && rep.ticker.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Equity Research & Valuation Notes
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#0A1F44] tracking-tight max-w-3xl mx-auto">
            Independent Intelligence on NGX Securities
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Data-backed valuation models, recapitalization trackers, and macroeconomic forecasts
            free from sell-side broker biases.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by ticker (e.g. SEPLAT, BANKING), report title, or theme..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm text-slate-800 outline-none focus:border-[#C9A84C] transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Reports Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700">No reports matched your criteria.</h4>
            <p className="text-xs">Try selecting 'All' or clearing your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReports.map(rep => (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep.id)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={rep.coverImage}
                      alt={rep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#0A1F44]">
                        {rep.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {rep.access === 'premium' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C9A84C] text-[#0A1F44] shadow-xs">
                          <Lock className="w-3 h-3" />
                          Circle Only
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-xs">
                          Public
                        </span>
                      )}
                    </div>

                    {rep.ticker && (
                      <div className="absolute bottom-3 left-3 text-xs font-mono font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded">
                        {rep.ticker}
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      {rep.targetPrice ? (
                        <span className="font-semibold text-slate-700">
                          Target: <strong className="text-[#0A1F44]">{rep.targetPrice}</strong>
                        </span>
                      ) : (
                        <span className="text-slate-400">Institutional Review</span>
                      )}

                      {rep.recommendation && (
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            rep.recommendation.includes('Buy')
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {rep.recommendation}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-black text-lg text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                      {rep.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {rep.summary}
                    </p>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{rep.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>{rep.downloadCount} Downloads</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Analyst Circle Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1F44] bg-gradient-to-r from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif font-black text-2xl text-white">
              Looking for Complete Financial Models in Excel?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Circle members receive downloadable raw DCF valuation spreadsheets with dynamic
              debt-service schedules, dividend sustainability models, and live sensitivity matrices.
            </p>
          </div>

          <button
            onClick={() => onOpenAuthModal('signup')}
            className="px-6 py-3 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-102 shrink-0 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Apply to Join Circle
          </button>
        </div>
      </section>
    </div>
  );
};
