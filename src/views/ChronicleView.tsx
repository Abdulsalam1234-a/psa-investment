import React, { useState } from 'react';
import {
  Newspaper,
  Calendar,
  Clock,
  Search,
  Download,
  Filter,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles,
  Archive
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ChronicleReader } from '../components/ChronicleReader';
import { ChronicleEdition } from '../types';

interface ChronicleViewProps {
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const ChronicleView: React.FC<ChronicleViewProps> = ({ onOpenAuthModal }) => {
  const { chronicles, logChronicleDownload, getPublicDownloads } = useData();
  const [selectedChronicleId, setSelectedChronicleId] = useState<string>(
    chronicles[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  const currentChronicle =
    chronicles.find(c => c.id === selectedChronicleId) || chronicles[0];

  const handleDownloadDocx = (chron: ChronicleEdition) => {
    logChronicleDownload(chron.id);
    const targetUrl =
      chron.docxUrl || '/transcripts/PSA-Financial-Chronicle-VOL-XXIX.docx';
    const targetName =
      chron.docxFileName ||
      `PSA_Financial_Transcript_${(chron.volume || 'VOL').replace(/[^a-zA-Z0-9]+/g, '_')}.docx`;

    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = targetName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredChronicles = chronicles.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.headline.toLowerCase().includes(q) ||
      c.volume.toLowerCase().includes(q) ||
      c.editionDate.toLowerCase().includes(q) ||
      c.bellwethers.some(b => b.ticker.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white pt-16 pb-16 border-b border-[#C9A84C]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#C9A84C]/30 text-white text-xs font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            <span>07:00 AM WAT Daily Automation Ingestion Desk</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="font-serif font-black text-3xl sm:text-5xl text-white tracking-tight">
                The PSA Transcripts & Financial Chronicle
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Published every morning at <strong className="text-[#C9A84C]">07:00 AM WAT</strong>.
                Our automated intelligence desk captures the official NGX close, floor turnover,
                blue-chip bellwethers, and broker tactical playbooks into formatted Word documents (.docx) and archival broadsheets.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  if (currentChronicle) {
                    handleDownloadDocx(currentChronicle);
                  }
                }}
                className="px-6 py-3.5 rounded-xl bg-[#2B579A] hover:bg-[#1E3E6D] text-white font-bold text-xs shadow-xl shadow-blue-950/40 transition-all flex items-center gap-2.5 cursor-pointer hover:scale-102"
              >
                <FileText className="w-4 h-4 text-[#C9A84C]" />
                <span>Download Word Document (.docx)</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">
                  DOCX
                </span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C9A84C]" />
              <span>Published 07:00 WAT Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C9A84C]" />
              <span>Word (.docx) Formatted</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
              <span>NGX & CSCS Verified Logs</span>
            </div>
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-[#C9A84C]" />
              <span>Public Historical Archive</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Archive Selector & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Archive className="w-5 h-5 text-[#0A1F44]" />
            <div>
              <div className="text-xs font-bold text-[#0A1F44] uppercase tracking-wide">
                Archive Selector
              </div>
              <div className="text-[11px] text-slate-500">
                Switch between published editions or search past issues
              </div>
            </div>
          </div>

          {/* Edition Select pills / dropdown */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {chronicles.slice(0, 4).map(chron => (
              <button
                key={chron.id}
                onClick={() => setSelectedChronicleId(chron.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentChronicle?.id === chron.id
                    ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{chron.volume}</span>
                <span className="text-[10px] font-normal opacity-80 hidden sm:inline">
                  ({chron.editionDate.split(',')[1]?.trim() || chron.editionDate})
                </span>
              </button>
            ))}
          </div>

          {/* Search by ticker or text */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticker or edition..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#C9A84C] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Selected Broadsheet Reader */}
        {currentChronicle ? (
          <ChronicleReader chronicle={currentChronicle} onOpenAuthModal={onOpenAuthModal} />
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 text-sm">
            No editions found in the archive matching your query.
          </div>
        )}

        {/* Complete Historical Archive Table */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                Permanent Record
              </div>
              <h3 className="font-serif font-black text-2xl text-[#0A1F44]">
                The PSA Financial Chronicle Archive
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {filteredChronicles.length} Edition(s) Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0A1F44] text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Edition Date</th>
                  <th className="py-3 px-4">Pre-Market Lead Headline</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-center">Downloads</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredChronicles.map((chron, idx) => (
                  <tr
                    key={chron.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      currentChronicle?.id === chron.id ? 'bg-[#C9A84C]/5 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0A1F44]">
                      {chron.volume}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {chron.editionDate}
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-serif font-bold text-slate-900 line-clamp-1">
                        {chron.headline}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {chron.subheadline}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-slate-100 text-slate-700">
                        {chron.source === 'gemini_automation' ? 'Gemini 7AM' : 'Admin'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                      {getPublicDownloads(chron.downloadCount)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedChronicleId(chron.id);
                            window.scrollTo({ top: 350, behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0A1F44] font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Read Broadsheet
                        </button>
                        <button
                          onClick={() => {
                            logChronicleDownload(chron.id);
                            window.print();
                          }}
                          className="p-1.5 rounded-lg bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] transition-colors cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Member Circle Callout */}
        <section className="bg-[#0A1F44] bg-gradient-to-r from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C9A84C]/30">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              Institutional Circle Access
            </span>
            <h3 className="font-serif font-black text-2xl text-white">
              Want the 06:30 AM Raw Terminal Data & Valuation Spreadsheets?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Analyst Circle members receive our live financial DCF models, earnings surprises, and
              direct WhatsApp pre-market audio voice notes before floor trading commences.
            </p>
          </div>
          <button
            onClick={() => onOpenAuthModal('signup')}
            className="px-7 py-3.5 bg-gradient-to-r from-[#C9A84C] to-[#B8973D] hover:from-[#B8973D] hover:to-[#A7862C] text-[#0A1F44] font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all hover:scale-102 shrink-0 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Join Analyst Circle</span>
          </button>
        </section>
      </div>
    </div>
  );
};
