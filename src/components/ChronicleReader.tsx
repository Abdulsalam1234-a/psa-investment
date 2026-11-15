import React, { useState } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  FileText,
  FileCode,
  BookOpen
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
      chronicle.docxUrl || '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx';
    const targetName =
      chronicle.docxFileName ||
      `PSA_Financial_Chronicle_${(chronicle.volume || 'VOL').replace(/[^a-zA-Z0-9]+/g, '_')}_Official.docx`;

    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = targetName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintDocument = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Utility Toolbar (Download / Print / Raw Toggle) - strictly hidden during print */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center font-serif font-black text-lg shadow-sm">
            PSA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C9A84C] bg-[#0A1F44] px-2 py-0.5 rounded">
                {chronicle.volume}
              </span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {chronicle.briefingTime}
              </span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {chronicle.editionDate}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Verified Official NGX Daily List, Nairametrics, GTI Pulse, CSCS & CBN
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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
              <span>Official Document</span>
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

          {/* Dedicated Print Button: isolates and prints only this document */}
          <button
            onClick={handlePrintDocument}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print Document or Save as PDF (Document Only)"
          >
            <Printer className="w-4 h-4 text-[#C9A84C]" />
            <span>Print Document</span>
          </button>

          {/* Primary Action: Direct Download Word Document (.docx) */}
          <button
            onClick={handleDownloadDocx}
            className="px-4 py-2 bg-[#2B579A] hover:bg-[#1E3E6D] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
            title="Direct download Word Document (.docx)"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Word Document</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">
              .DOCX
            </span>
          </button>
        </div>
      </div>

      {/* 1. OFFICIAL FORMATTED WORD DOCUMENT VIEW */}
      {viewMode === 'doc' && (
        <div
          id="printable-chronicle-document"
          className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden max-w-5xl mx-auto font-serif print:border-none print:shadow-none print:m-0 print:p-0 print:max-w-none print:rounded-none"
        >
          {/* Word Document Top Ribbon (Screen Only) */}
          <div className="bg-[#2B579A] text-white px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-sans print:hidden">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-bold">PSA Transcripts</span>
              <span className="text-white/60">•</span>
              <span className="text-slate-200">Official Microsoft Word Formatted Document</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintDocument}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded transition-all flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadDocx}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-[#2B579A] font-bold text-xs rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download (.docx)</span>
              </button>
            </div>
          </div>

          {/* Formatted Document Body */}
          <div className="p-8 sm:p-14 space-y-8 bg-white text-slate-900 leading-relaxed print:p-0 print:space-y-6">
            {/* Header / Masthead */}
            <div className="text-center space-y-2 border-b-2 border-slate-900 pb-4">
              <div className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-sans font-bold text-slate-700">
                PSA INVESTMENT CAPITAL INTELLIGENCE • INSTITUTIONAL RESEARCH DESK
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#0A1F44] tracking-tight uppercase">
                {chronicle.title || 'THE PSA FINANCIAL CHRONICLE'}
              </h1>
              <p className="text-xs sm:text-sm italic text-slate-700 font-sans font-medium max-w-3xl mx-auto">
                {chronicle.subtitle || 'Enhanced Pre-Market Intelligence: Verified Institutional Block Flow, Corporate Actions & Strategic Trade Setups'}
              </p>

              {/* Official Dateline Bar Box */}
              <div className="mt-3 border-2 border-slate-900 bg-slate-50 py-2 px-4 flex flex-wrap items-center justify-between text-xs font-sans font-bold text-slate-900 uppercase tracking-wider">
                <span>{chronicle.editionDate}</span>
                <span>PRE-MARKET BRIEFING | {chronicle.briefingTime}</span>
                <span className="text-[#0A1F44] font-black">PSA INVESTMENT DESK | {chronicle.volume}</span>
              </div>
            </div>

            {/* Section 1: Verified Official Market Recap & Volume Surge */}
            <div className="space-y-3 pt-2">
              <div className="font-sans font-extrabold text-xs uppercase tracking-wider text-[#0A1F44] bg-[#0A1F44]/5 px-3 py-1 rounded inline-block">
                VERIFIED OFFICIAL MARKET RECAP & INSTITUTIONAL VOLUME SURGE
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0A1F44] leading-snug">
                {chronicle.headline}
              </h2>

              <p className="text-xs sm:text-sm font-sans text-slate-700 font-semibold italic border-l-4 border-[#C9A84C] pl-3 py-0.5">
                {chronicle.subheadline}
              </p>

              <div className="text-xs sm:text-sm font-serif leading-relaxed text-slate-800 space-y-3 pt-2 whitespace-pre-line text-justify">
                {chronicle.leadArticle}
              </div>
            </div>

            {/* TABLE 1: VERIFIED OFFICIAL MARKET BAROMETERS */}
            {chronicle.marketBarometers && chronicle.marketBarometers.length > 0 && (
              <div className="space-y-2 pt-4">
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
                  TABLE 1: VERIFIED OFFICIAL MARKET BAROMETERS (CURRENT VS. PREVIOUS SESSION)
                </h3>
                <div className="overflow-x-auto border-2 border-slate-900 rounded-none">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead className="bg-[#0A1F44] text-[#C9A84C] font-bold uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-2.5 border-r border-slate-700">Official Market Barometer</th>
                        <th className="p-2.5 border-r border-slate-700">Thursday Close (Nov 12)</th>
                        <th className="p-2.5 border-r border-slate-700">Wednesday Close (Nov 11)</th>
                        <th className="p-2.5 border-r border-slate-700">Day Change (%)</th>
                        <th className="p-2.5">Official Verified Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {chronicle.marketBarometers.map((b, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-slate-300">
                            {b.metric}
                          </td>
                          <td className="p-2.5 font-mono text-slate-800 border-r border-slate-300">
                            {b.fridayClose}
                          </td>
                          <td className="p-2.5 font-mono text-slate-600 border-r border-slate-300">
                            {b.thursdayClose}
                          </td>
                          <td
                            className={`p-2.5 font-mono font-bold border-r border-slate-300 ${
                              b.change.startsWith('+') ? 'text-emerald-700' : b.change.startsWith('-') ? 'text-rose-700' : 'text-slate-800'
                            }`}
                          >
                            {b.change}
                          </td>
                          <td className="p-2.5 text-slate-600 text-[11px]">{b.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 2: OFFICIAL PRICE MOVEMENTS: TOP GAINERS & LOSERS (WITH MOVER DRIVERS) */}
            <div className="space-y-4 pt-4">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
                OFFICIAL PRICE MOVEMENTS: TOP GAINERS & LOSERS (WITH MOVER DRIVERS)
              </h3>

              {/* Gainers & Losers Table */}
              <div className="overflow-x-auto border-2 border-slate-900">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead className="bg-[#0A1F44] text-white font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-2.5 bg-emerald-900 text-emerald-100 border-r border-slate-700">Top 5 Gainers</th>
                      <th className="p-2.5 bg-emerald-900 text-emerald-100 border-r border-slate-700">Close</th>
                      <th className="p-2.5 bg-emerald-900 text-emerald-100 border-r-2 border-slate-900">% Change</th>
                      <th className="p-2.5 bg-rose-950 text-rose-100 border-r border-slate-700">Top 5 Losers</th>
                      <th className="p-2.5 bg-rose-950 text-rose-100 border-r border-slate-700">Close</th>
                      <th className="p-2.5 bg-rose-950 text-rose-100">% Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {chronicle.topGainers.map((g, idx) => {
                      const l = chronicle.topLosers[idx];
                      return (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 font-semibold text-slate-900 border-r border-slate-300">
                            {g.name} <span className="font-mono text-slate-500">({g.ticker})</span>
                          </td>
                          <td className="p-2.5 font-mono text-slate-800 border-r border-slate-300">{g.close}</td>
                          <td className="p-2.5 font-mono font-bold text-emerald-700 border-r-2 border-slate-900">{g.change}</td>
                          <td className="p-2.5 font-semibold text-slate-900 border-r border-slate-300">
                            {l ? `${l.name} (${l.ticker})` : '-'}
                          </td>
                          <td className="p-2.5 font-mono text-slate-800 border-r border-slate-300">{l ? l.close : '-'}</td>
                          <td className="p-2.5 font-mono font-bold text-rose-700">{l ? l.change : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mover Drivers: 2 Column Box matching Word Document */}
              <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-slate-900 divide-y md:divide-y-0 md:divide-x-2 divide-slate-900 font-sans text-xs">
                {/* Left: Gainer Drivers */}
                <div className="p-4 bg-emerald-50/40 space-y-2">
                  <div className="font-bold text-emerald-900 uppercase text-[11px] pb-1 border-b border-emerald-200">
                    Top Gainer Fundamental & Flow Drivers
                  </div>
                  <ul className="space-y-2 text-slate-800 leading-relaxed text-[11px]">
                    {chronicle.gainerDrivers && chronicle.gainerDrivers.length > 0 ? (
                      chronicle.gainerDrivers.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">•</span>
                          <span>{d.replace(/^[•\-]\s*/, '')}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li>• <strong>FIDSON (+9.94% to ₦91.80)</strong>: Hit upper limit on strong healthcare margin expansion and pharmaceutical output growth.</li>
                        <li>• <strong>CHAMPION (+9.85% to ₦11.15)</strong>: Extended rally following proposed HoldCo restructuring into Champion Brands Plc.</li>
                        <li>• <strong>SUNUASSUR (+9.92%) & FTGINSURE (+9.42%)</strong>: Lifted NGX Insurance Index (+0.66% to 1,057.59 pts).</li>
                        <li>• <strong>CAVERTON (+9.59% to ₦4.00)</strong>: Reclaimed psychological ₦4.00 level on sustained logistics demand.</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Right: Loser Drivers */}
                <div className="p-4 bg-rose-50/40 space-y-2">
                  <div className="font-bold text-rose-900 uppercase text-[11px] pb-1 border-b border-rose-200">
                    Top Loser Fundamental & Flow Drivers
                  </div>
                  <ul className="space-y-2 text-slate-800 leading-relaxed text-[11px]">
                    {chronicle.loserDrivers && chronicle.loserDrivers.length > 0 ? (
                      chronicle.loserDrivers.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-700 font-bold">•</span>
                          <span>{d.replace(/^[•\-]\s*/, '')}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li>• <strong>INTBREW (-7.18%) & HONYFLOUR (-4.85%)</strong>: Profit harvesting across consumer staples dragged Consumer Goods Index down 0.65%.</li>
                        <li>• <strong>TANTALIZER (-6.67% to ₦3.50)</strong>: Hospitality profit taking.</li>
                        <li>• <strong>VITAFOAM (-4.66% to ₦134.90)</strong>: Distribution in household foam manufacturing.</li>
                        <li>• <strong>UPDCREIT (-3.74% to ₦19.30)</strong>: Yield rotation into fixed income instruments.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 3: BLUE-CHIP BELLWETHERS & VOLUME LEADERS DOSSIER */}
            {chronicle.bellwethers && chronicle.bellwethers.length > 0 && (
              <div className="space-y-2 pt-4">
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
                  BLUE-CHIP BELLWETHERS & VOLUME LEADERS DOSSIER
                </h3>
                <div className="overflow-x-auto border-2 border-slate-900">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead className="bg-[#0A1F44] text-[#C9A84C] font-bold uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-2.5 border-r border-slate-700">Ticker / Counter</th>
                        <th className="p-2.5 border-r border-slate-700">Official Close</th>
                        <th className="p-2.5 border-r border-slate-700">Session Change</th>
                        <th className="p-2.5 border-r border-slate-700">Volume / Value Role</th>
                        <th className="p-2.5">Institutional Flow & Order Book Analysis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {chronicle.bellwethers.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 font-bold font-mono text-[#0A1F44] border-r border-slate-300 whitespace-nowrap">
                            {item.ticker}
                          </td>
                          <td className="p-2.5 font-mono text-slate-800 border-r border-slate-300 whitespace-nowrap">
                            {item.close}
                          </td>
                          <td className="p-2.5 font-mono text-slate-700 border-r border-slate-300 whitespace-nowrap">
                            {item.signal}
                          </td>
                          <td className="p-2.5 font-semibold text-slate-800 border-r border-slate-300">
                            {item.turnover}
                          </td>
                          <td className="p-2.5 text-slate-700 leading-relaxed text-[11px]">
                            {item.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 4: CORPORATE ACTIONS, REGULATORY FILINGS & DISCLOSURE MONITOR */}
            {chronicle.corporateActions && chronicle.corporateActions.length > 0 && (
              <div className="space-y-2 pt-4">
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
                  CORPORATE ACTIONS, REGULATORY FILINGS & DISCLOSURE MONITOR
                </h3>
                <div className="overflow-x-auto border-2 border-slate-900">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead className="bg-[#0A1F44] text-[#C9A84C] font-bold uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-2.5 border-r border-slate-700">Entity / Counter</th>
                        <th className="p-2.5 border-r border-slate-700">Regulatory / Corporate Event</th>
                        <th className="p-2.5 border-r border-slate-700">Key Details & Market Intelligence</th>
                        <th className="p-2.5">Timeline & Statutory Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {chronicle.corporateActions.map((c, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-slate-300 whitespace-nowrap">
                            {c.entity}
                          </td>
                          <td className="p-2.5 font-semibold text-[#0A1F44] border-r border-slate-300">
                            {c.event}
                          </td>
                          <td className="p-2.5 text-slate-700 border-r border-slate-300 text-[11px] leading-relaxed">
                            {c.details}
                          </td>
                          <td className="p-2.5 text-slate-600 text-[11px]">
                            {c.timeline}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 5: MACROECONOMIC, FX & MONEY MARKET BENCHMARKS */}
            {chronicle.macroBenchmarks && chronicle.macroBenchmarks.length > 0 && (
              <div className="space-y-2 pt-4">
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
                  MACROECONOMIC, FX & MONEY MARKET BENCHMARKS
                </h3>
                <div className="overflow-x-auto border-2 border-slate-900">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead className="bg-[#0A1F44] text-[#C9A84C] font-bold uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-2.5 border-r border-slate-700">Macro Benchmark Indicator</th>
                        <th className="p-2.5 border-r border-slate-700">Prevailing Level / Fixing</th>
                        <th className="p-2.5 border-r border-slate-700">Policy Corridor / Market Dynamic</th>
                        <th className="p-2.5">Official Regulatory Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {chronicle.macroBenchmarks.map((m, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-slate-300">
                            {m.indicator}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-900 border-r border-slate-300 whitespace-nowrap">
                            {m.level}
                          </td>
                          <td className="p-2.5 text-slate-700 border-r border-slate-300 text-[11px]">
                            {m.variance}
                          </td>
                          <td className="p-2.5 text-slate-500 text-[11px] italic">
                            {m.source}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 6: TACTICAL PRE-MARKET PLAYBOOK & BROKER DESK STRATEGY */}
            {chronicle.tacticalPlaybook && chronicle.tacticalPlaybook.length > 0 && (
              <div className="space-y-3 pt-4 font-sans">
                <div className="border-2 border-slate-900 bg-amber-50/50 p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-300 pb-2">
                    <ShieldCheck className="w-5 h-5 text-[#C9A84C]" />
                    <h3 className="font-serif font-black text-sm uppercase text-[#0A1F44] tracking-wide">
                      TACTICAL PRE-MARKET PLAYBOOK & BROKER DESK STRATEGY (FRIDAY WEEK-CLOSE)
                    </h3>
                  </div>
                  <div className="space-y-3 pt-1">
                    {chronicle.tacticalPlaybook.map((play, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <span className="w-5 h-5 rounded-full bg-[#0A1F44] text-[#C9A84C] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {play}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Statutory & Legal Footer */}
            <div className="pt-6 border-t-2 border-slate-900 text-center font-sans space-y-1.5 text-xs text-slate-600">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                The PSA Financial Chronicle © 2026 | Property of PSA INVESTMENT.
              </div>
              <p className="max-w-3xl mx-auto text-[10px] leading-relaxed text-slate-500">
                Prepared for Institutional Members, Brokers & Wealth Managers. All data verified via NGX Daily Official Price List, Nairametrics, GTI Pulse, Kobo Terminal, FMDQ, & Central Bank of Nigeria. Click "Download Word Document" for the original formatted Microsoft Word file.
              </p>
            </div>
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
        <article className="bg-[#FAF8F5] text-slate-900 rounded-3xl p-6 sm:p-12 border-2 border-slate-300/80 shadow-2xl space-y-8 font-serif print:hidden">
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
              <span className="hidden md:inline">PSA INVESTMENT DESK</span>
              <span className="text-[#0A1F44] font-black">{chronicle.volume}</span>
            </div>
          </div>

          {/* Assessment & Main Headline */}
          <div className="space-y-4 border-b border-slate-300 pb-6">
            <div className="inline-block bg-[#0A1F44] text-[#C9A84C] text-[10px] sm:text-xs font-sans font-black uppercase tracking-widest px-3 py-1 rounded">
              VERIFIED OFFICIAL MARKET RECAP & VOLUME SURGE
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#0A1F44] leading-tight">
              {chronicle.headline}
            </h2>

            <p className="text-sm sm:text-base text-slate-700 font-sans italic font-normal leading-relaxed border-l-4 border-[#C9A84C] pl-4 py-1">
              {chronicle.subheadline}
            </p>

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
                Table 1: Verified Official Market Barometers
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
                    <th className="py-3 px-4">Current Close</th>
                    <th className="py-3 px-4">Prior Close</th>
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

          {/* BLUE-CHIP BELLWETHERS */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {chronicle.bellwethers.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-3.5 border border-slate-300 font-sans space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-[#0A1F44]">
                      {item.ticker}
                    </span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.signal}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs border-y border-slate-100 py-1">
                    <span className="font-bold text-slate-900">{item.close}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{item.turnover}</span>
                  </div>

                  <p className="text-[10px] text-slate-600 leading-relaxed font-normal">
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* TACTICAL PRE-MARKET PLAYBOOK */}
          <section className="bg-[#0A1F44] text-white rounded-2xl p-6 sm:p-8 space-y-4 font-sans shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C9A84C]" />
              <h3 className="font-serif font-black text-lg text-white">
                Tactical Pre-Market Playbook & Broker Desk Strategy
              </h3>
            </div>
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
              Daily Official Price List, FMDQ, CBN, & CSCS.
            </p>
          </footer>
        </article>
      )}

      {/* Institutional Commentary & Member Discussion - strictly hidden during print */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 print:hidden">
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
