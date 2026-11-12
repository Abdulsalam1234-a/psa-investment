import React, { useState } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  Share2,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  FileText,
  FileCode,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { ChronicleEdition } from '../types';
import { useData } from '../context/DataContext';
import { ResourceComments } from './ResourceComments';

interface ChronicleReaderProps {
  chronicle: ChronicleEdition;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
}

export const ChronicleReader: React.FC<ChronicleReaderProps> = ({
  chronicle,
  onOpenAuthModal
}) => {
  const { logChronicleDownload } = useData();
  const [viewMode, setViewMode] = useState<'doc' | 'broadsheet' | 'raw'>('doc');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(chronicle.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDocx = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    logChronicleDownload(chronicle.id);

    // Target Word document URL
    const targetUrl =
      chronicle.docxUrl || '/transcripts/PSA-Financial-Chronicle-VOL-XXIX.docx';
    const targetName =
      chronicle.docxFileName ||
      `PSA_Financial_Transcript_${(chronicle.volume || 'VOL').replace(/[^a-zA-Z0-9]+/g, '_')}.docx`;

    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = targetName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Utility Toolbar (Download / Print / Raw Toggle) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center font-serif font-black text-lg">
            PSA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C9A84C] bg-[#0A1F44] px-2 py-0.5 rounded">
                {chronicle.volume}
              </span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {chronicle.briefingTime}
              </span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {chronicle.editionDate}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Verified Source: NGX Daily Official Price List, CSCS, CBN & FMDQ
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('doc')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'doc'
                  ? 'bg-white text-[#2B579A] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#2B579A]" />
              <span>Formatted Document</span>
            </button>
            <button
              onClick={() => setViewMode('broadsheet')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'broadsheet'
                  ? 'bg-white text-[#0A1F44] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Broadsheet</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-white text-[#0A1F44] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Raw Text</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-[#0A1F44] transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            title="Copy Raw Dispatch Text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Primary Action: Direct Download Word Document (.docx) */}
          <button
            onClick={handleDownloadDocx}
            className="px-4 py-2 bg-[#2B579A] hover:bg-[#1E3E6D] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
            title="Direct download Word Document (.docx)"
          >
            <Download className="w-4 h-4" />
            <span>Download Word Document (.docx)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">
              DOCX
            </span>
          </button>
        </div>
      </div>

      {/* 1. FORMATTED WORD DOCUMENT VIEW */}
      {viewMode === 'doc' && (
        <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden max-w-5xl mx-auto font-serif">
          {/* Word Document Top Status Ribbon */}
          <div className="bg-[#2B579A] text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-bold">PSA Transcripts</span>
              <span className="text-white/60">•</span>
              <span className="text-slate-200">Microsoft Word Formatted Document</span>
            </div>
            <button
              onClick={handleDownloadDocx}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-[#2B579A] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.docx)</span>
            </button>
          </div>

          {/* Formatted Document Body */}
          <div className="p-8 sm:p-14 space-y-8 bg-white text-slate-800">
            {chronicle.formattedHtml ? (
              <div
                className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-4 [&>table]:w-full [&>table]:border-collapse [&>table]:border [&>table]:border-slate-300 [&>table_td]:border [&>table_td]:border-slate-300 [&>table_td]:p-2.5 [&>table_th]:border [&>table_th]:border-slate-300 [&>table_th]:p-2.5 [&>table_th]:bg-slate-100 [&>p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: chronicle.formattedHtml }}
              />
            ) : (
              <div className="space-y-6">
                {/* Document Header */}
                <div className="text-center pb-6 border-b border-slate-300 space-y-2">
                  <div className="text-xs uppercase tracking-widest font-sans font-bold text-slate-500">
                    PSA INVESTMENT CAPITAL INTELLIGENCE • INSTITUTIONAL DESK
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1F44] tracking-tight">
                    {chronicle.title || 'THE PSA FINANCIAL CHRONICLE'}
                  </h1>
                  <p className="text-xs italic text-slate-600 font-sans">
                    {chronicle.subtitle || 'Verified Pre-Market Intelligence Briefing for Institutional Partners, Stockbrokers & Analysts'}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-sans font-semibold text-slate-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-mono text-[#0A1F44]">
                      {chronicle.volume}
                    </span>
                    <span>{chronicle.editionDate}</span>
                    <span>•</span>
                    <span>{chronicle.briefingTime}</span>
                  </div>
                </div>

                {/* Headline Section */}
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0A1F44] leading-snug">
                    {chronicle.headline}
                  </h2>
                  <p className="text-sm font-sans text-slate-600 leading-relaxed font-medium">
                    {chronicle.subheadline}
                  </p>
                </div>

                {/* Lead Article */}
                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line space-y-4">
                  {chronicle.leadArticle}
                </div>

                {/* Table 1: Market Barometers */}
                {chronicle.marketBarometers && chronicle.marketBarometers.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
                      TABLE 1: VERIFIED OFFICIAL MARKET BAROMETERS
                    </h3>
                    <div className="overflow-x-auto border border-slate-300 rounded-lg">
                      <table className="w-full text-left text-xs font-sans border-collapse">
                        <thead className="bg-[#0A1F44] text-[#C9A84C] font-bold">
                          <tr>
                            <th className="p-3 border-r border-slate-700">Official Market Barometer</th>
                            <th className="p-3 border-r border-slate-700">Current Close</th>
                            <th className="p-3 border-r border-slate-700">Prior Close</th>
                            <th className="p-3 border-r border-slate-700">Change (%)</th>
                            <th className="p-3">Verified Source</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {chronicle.marketBarometers.map((b, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-2.5 font-semibold text-slate-900 border-r border-slate-200">
                                {b.metric}
                              </td>
                              <td className="p-2.5 font-mono text-slate-800 border-r border-slate-200">
                                {b.fridayClose}
                              </td>
                              <td className="p-2.5 font-mono text-slate-600 border-r border-slate-200">
                                {b.thursdayClose}
                              </td>
                              <td
                                className={`p-2.5 font-mono font-bold border-r border-slate-200 ${
                                  b.change.startsWith('+') ? 'text-emerald-700' : 'text-rose-700'
                                }`}
                              >
                                {b.change}
                              </td>
                              <td className="p-2.5 text-slate-500 text-[11px]">{b.source}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Top Gainers & Losers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 font-sans text-xs">
                  {chronicle.topGainers && chronicle.topGainers.length > 0 && (
                    <div className="border border-slate-300 rounded-lg p-4 space-y-2">
                      <div className="font-bold text-emerald-800 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                        Top Official Gainers
                      </div>
                      <div className="space-y-1.5">
                        {chronicle.topGainers.map((g, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{g.name} ({g.ticker})</span>
                            <span className="font-mono font-bold text-emerald-700">{g.close} ({g.change})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {chronicle.topLosers && chronicle.topLosers.length > 0 && (
                    <div className="border border-slate-300 rounded-lg p-4 space-y-2">
                      <div className="font-bold text-rose-800 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                        Top Official Decliners
                      </div>
                      <div className="space-y-1.5">
                        {chronicle.topLosers.map((l, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{l.name} ({l.ticker})</span>
                            <span className="font-mono font-bold text-rose-700">{l.close} ({l.change})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Blue Chip Bellwethers */}
                {chronicle.bellwethers && chronicle.bellwethers.length > 0 && (
                  <div className="space-y-2 pt-4 font-sans">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
                      Blue-Chip Bellwethers & Institutional Order Flows
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {chronicle.bellwethers.map((item, idx) => (
                        <div key={idx} className="p-3 border border-slate-300 rounded-lg space-y-1 bg-slate-50/50">
                          <div className="flex items-center justify-between font-bold">
                            <span className="font-mono text-[#0A1F44]">{item.ticker}</span>
                            <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">{item.signal}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-800">{item.close}</span>
                            <span className="text-slate-500">{item.turnover}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed pt-1">{item.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Macro Benchmarks */}
                {chronicle.macroBenchmarks && chronicle.macroBenchmarks.length > 0 && (
                  <div className="space-y-2 pt-4 font-sans">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
                      Macroeconomic & Money Market Indicators
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {chronicle.macroBenchmarks.map((m, idx) => (
                        <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">{m.indicator}</div>
                          <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">{m.level}</div>
                          <div className="text-[10px] text-slate-600 mt-1">{m.variance}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tactical Playbook */}
                {chronicle.tacticalPlaybook && chronicle.tacticalPlaybook.length > 0 && (
                  <div className="space-y-2 pt-4 font-sans">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
                      Tactical Pre-Market Playbook
                    </h3>
                    <div className="space-y-2 text-xs">
                      {chronicle.tacticalPlaybook.map((play, idx) => (
                        <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#0A1F44] text-[#C9A84C] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-slate-800 leading-relaxed">{play}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Word Document Footer */}
                <div className="pt-8 border-t border-slate-300 text-center font-sans text-xs text-slate-500 space-y-1">
                  <div className="font-bold text-slate-700">
                    PSA INVESTMENT CAPITAL INTELLIGENCE • ALL RIGHTS RESERVED © 2026
                  </div>
                  <p className="text-[10px]">
                    Formatted transcript extracted from official Word (.docx) document. Click "Download Word Document" above for original binary copy.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RAW DISPATCH VIEW */}
      {viewMode === 'raw' && (
        <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>VERIFIED DESK DISPATCH PAYLOAD</span>
            <span>{chronicle.source === 'gemini_automation' ? 'AI Ingested via Gemini 7:00 AM' : 'Admin Publishing'}</span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] sm:text-xs">
            {chronicle.rawText}
          </pre>
        </div>
      )}

      {/* BROADSHEET NEWSPAPER VIEW */}
      {viewMode === 'broadsheet' && (
        <article className="bg-[#FAF8F5] text-slate-900 rounded-3xl p-6 sm:p-12 border-2 border-slate-300/80 shadow-2xl space-y-8 font-serif print:p-0 print:border-none print:shadow-none print:bg-white">
          {/* Broadsheet Top Meta Header */}
          <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
            <div className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.25em] font-extrabold text-slate-600">
              PSA Investment Capital Intelligence • Institutional Desk
            </div>

            {/* Newspaper Masthead */}
            <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#0A1F44] tracking-tight uppercase py-2 border-y-4 border-slate-900">
              The PSA Financial Chronicle
            </h1>

            <div className="text-xs sm:text-sm font-sans italic text-slate-700 font-medium">
              Verified Pre-Market Intelligence Briefing for Institutional Partners, Stockbrokers & Analysts
            </div>

            {/* Dateline Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-400 font-sans text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">
              <span>{chronicle.editionDate}</span>
              <span className="hidden sm:inline">PRE-MARKET BRIEFING | {chronicle.briefingTime}</span>
              <span className="hidden md:inline">PSA INVESTMENT RESEARCH</span>
              <span className="text-[#0A1F44] font-black">{chronicle.volume}</span>
            </div>
          </div>

          {/* Assessment & Main Headline */}
          <div className="space-y-4 border-b border-slate-300 pb-6">
            <div className="inline-block bg-[#0A1F44] text-[#C9A84C] text-[10px] sm:text-xs font-sans font-black uppercase tracking-widest px-3 py-1 rounded">
              NGX Weekly Close & Pre-Market Assessment
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#0A1F44] leading-tight">
              {chronicle.headline}
            </h2>

            <p className="text-sm sm:text-base text-slate-700 font-sans italic font-normal leading-relaxed border-l-4 border-[#C9A84C] pl-4 py-1">
              {chronicle.subheadline}
            </p>

            {/* Lead Story with Drop Cap */}
            <div className="font-serif text-sm sm:text-base leading-relaxed text-slate-800 space-y-3 pt-2">
              <p className="first-letter:font-black first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-[#0A1F44] first-letter:leading-none">
                {chronicle.leadArticle}
              </p>
            </div>
          </div>

          {/* TABLE 1: OFFICIAL MARKET BAROMETERS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#0A1F44] flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#C9A84C]" />
                Table 1: Verified Official Market Barometers (Close vs. Previous)
              </h3>
              <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase">
                Official NGX Logs
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#0A1F44] text-white uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Official Market Barometer</th>
                    <th className="py-3 px-4">Friday Close</th>
                    <th className="py-3 px-4">Thursday Close</th>
                    <th className="py-3 px-4">Day Change (%)</th>
                    <th className="py-3 px-4">Official Verified Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {chronicle.marketBarometers.map((bar, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{bar.metric}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{bar.fridayClose}</td>
                      <td className="py-2.5 px-4 text-slate-600">{bar.thursdayClose}</td>
                      <td className="py-2.5 px-4 font-bold">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                            bar.change.includes('+')
                              ? 'bg-emerald-100 text-emerald-800'
                              : bar.change.includes('-')
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {bar.change.includes('+') ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : bar.change.includes('-') ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : null}
                          {bar.change}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[11px] text-slate-500 italic">{bar.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TWO-COLUMN SECTION: TOP GAINERS & LOSERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-slate-300 py-6">
            {/* Top Gainers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                <h4 className="font-sans font-black text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Top 5 Official Gainers
                </h4>
                <span className="text-[10px] font-sans font-semibold text-slate-500">Highest % Moves</span>
              </div>
              <div className="space-y-2">
                {chronicle.topGainers.map((g, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/60 font-sans text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{g.name}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 ml-1.5">
                        ({g.ticker})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{g.close}</div>
                      <div className="text-[11px] font-bold text-emerald-700">{g.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                <h4 className="font-sans font-black text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  Top 5 Official Losers
                </h4>
                <span className="text-[10px] font-sans font-semibold text-slate-500">Decliners Desk</span>
              </div>
              <div className="space-y-2">
                {chronicle.topLosers.map((l, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50/50 border border-rose-200/60 font-sans text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{l.name}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 ml-1.5">
                        ({l.ticker})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{l.close}</div>
                      <div className="text-[11px] font-bold text-rose-700">{l.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BLUE-CHIP BELLWETHERS & VOLUME LEADERS DOSSIER */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#0A1F44] flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#C9A84C]" />
                Blue-Chip Bellwethers & Volume Leaders Dossier
              </h3>
              <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase">
                Institutional Order Flow
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chronicle.bellwethers.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-slate-300 font-sans space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-[#0A1F44]">
                      {item.ticker}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.signal}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs border-y border-slate-100 py-1.5">
                    <span className="font-bold text-slate-900">{item.close}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{item.turnover}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* MACROECONOMIC, FX & MONEY MARKET BENCHMARKS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#0A1F44] flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#C9A84C]" />
                Macroeconomic, FX & Money Market Benchmarks
              </h3>
              <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase">
                Sovereign Environment
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#0A1F44] text-white uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-4">Macro Benchmark Indicator</th>
                    <th className="py-2.5 px-4">Prevailing Level / Fixing</th>
                    <th className="py-2.5 px-4">Policy Corridor / Variance</th>
                    <th className="py-2.5 px-4">Official Regulatory Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {chronicle.macroBenchmarks.map((macro, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{macro.indicator}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{macro.level}</td>
                      <td className="py-2.5 px-4 text-slate-600">{macro.variance}</td>
                      <td className="py-2.5 px-4 text-[11px] text-slate-500 italic">{macro.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TACTICAL PRE-MARKET PLAYBOOK */}
          <section className="bg-[#0A1F44] bg-gradient-to-br from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white rounded-2xl p-6 sm:p-8 space-y-4 font-sans shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C9A84C]" />
              <h3 className="font-serif font-black text-lg text-white">
                Tactical Pre-Market Playbook & Broker Desk Strategy
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Guidance for Monday open order executions, risk budgets, and portfolio positioning.
            </p>

            <div className="space-y-3 pt-2">
              {chronicle.tacticalPlaybook.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 rounded-xl p-4 border border-white/15 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-[#C9A84C] text-[#0A1F44] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Broadsheet Legal & Verification Footer */}
          <footer className="pt-6 border-t-2 border-slate-900 text-center font-sans space-y-2 text-[11px] text-slate-600">
            <div className="font-bold uppercase tracking-wider text-slate-800">
              The PSA Financial Chronicle © 2026 | Property of PSA INVESTMENT
            </div>
            <p className="max-w-2xl mx-auto text-[10px] leading-relaxed text-slate-500">
              Prepared for Institutional Members, Brokers & Wealth Managers. All data verified via NGX
              Daily Official Price List, FMDQ, CBN, & CSCS. Not an unsolicited offer to buy or sell securities.
            </p>
          </footer>
        </article>
      )}

      {/* Institutional Commentary & Member Discussion */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <ResourceComments
          resourceId={chronicle.id}
          resourceType="chronicle"
          resourceTitle={chronicle.headline}
          onOpenAuthModal={onOpenAuthModal}
        />
      </div>
    </div>
  );
};
