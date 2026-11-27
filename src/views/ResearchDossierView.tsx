import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  Download,
  Lock,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Building,
  Calendar,
  User,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { EquityDossier } from '../types';

interface ResearchDossierViewProps {
  slug: string;
  onNavigate: (tab: string, slug?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const ResearchDossierView: React.FC<ResearchDossierViewProps> = ({
  slug,
  onNavigate,
  onOpenAuthModal
}) => {
  const { equityDossiers, addSubscriberLead } = useData();
  const { currentUser, memberProfile, isAdmin } = useAuth();

  const dossier = equityDossiers.find(d => d.slug === slug || d.id === slug) || equityDossiers[0];

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTeaser, setCopiedTeaser] = useState(false);

  // Tear-Sheet Lead Capture Modal
  const [isTearSheetModalOpen, setIsTearSheetModalOpen] = useState(false);
  const [leadName, setLeadName] = useState(memberProfile?.fullName || currentUser?.displayName || '');
  const [leadEmail, setLeadEmail] = useState(memberProfile?.email || currentUser?.email || '');
  const [leadWhatsapp, setLeadWhatsapp] = useState(memberProfile?.phone || '');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);

  // Dynamic Metadata and JSON-LD injection
  useEffect(() => {
    if (!dossier) return;

    const originalTitle = document.title;
    document.title = dossier.metaTitle || `${dossier.companyName} (${dossier.ticker}) Valuation Dossier | PSA Investment`;

    // Dynamic Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', dossier.metaDescription || dossier.executiveSummary);
    }

    // Dynamic Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://psainvestment.com/research/${dossier.slug}`);
    }

    // Dynamic Open Graph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', dossier.metaTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', dossier.metaDescription);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://psainvestment.com/research/${dossier.slug}`);

    // Inject Per-Page JSON-LD (AnalysisNewsArticle + BreadcrumbList)
    const scriptId = 'dossier-jsonld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://psainvestment.com'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Equity Research',
              'item': 'https://psainvestment.com/research'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': dossier.ticker,
              'item': `https://psainvestment.com/research/${dossier.slug}`
            }
          ]
        },
        {
          '@type': 'AnalysisNewsArticle',
          '@id': `https://psainvestment.com/research/${dossier.slug}#article`,
          'headline': dossier.title,
          'description': dossier.metaDescription,
          'datePublished': dossier.publishedAt,
          'dateModified': dossier.updatedAt,
          'mainEntityOfPage': `https://psainvestment.com/research/${dossier.slug}`,
          'author': {
            '@type': 'Person',
            '@id': 'https://psainvestment.com/#founder',
            'name': 'Salami Abdullahi Adaviruku',
            'jobTitle': 'Founder & Chief Analyst',
            'alumniOf': 'Ahmadu Bello University'
          },
          'publisher': {
            '@type': 'FinancialService',
            '@id': 'https://psainvestment.com/#organization',
            'name': 'PSA Investment',
            'url': 'https://psainvestment.com'
          },
          'about': {
            '@type': 'Corporation',
            'name': dossier.companyName,
            'tickerSymbol': `NGX:${dossier.ticker}`
          }
        }
      ]
    };

    scriptTag.text = JSON.stringify(schemaData);

    return () => {
      document.title = originalTitle;
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [dossier]);

  if (!dossier) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-black text-2xl text-[#0A1F44]">Equity Research Dossier Not Found</h2>
        <p className="text-xs text-slate-600">The requested valuation note may have been archived or updated.</p>
        <button
          onClick={() => onNavigate('research')}
          className="px-5 py-2.5 bg-[#0A1F44] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer"
        >
          Return to Research Index
        </button>
      </div>
    );
  }

  const shareUrl = `https://psainvestment.com/research/${dossier.slug}?utm_source=whatsapp&utm_medium=social`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyTeaser = () => {
    const text = dossier.whatsappTeaser || `*PSA INVESTMENT • RESEARCH DOSSIER*\n📊 *${dossier.companyName} (${dossier.ticker})*\n• Target Price: *${dossier.targetPrice}* (${dossier.upsidePercent})\n• P/E: ${dossier.multiples.pe} | Div Yield: ${dossier.multiples.dividendYield}\n🔗 ${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedTeaser(true);
    setTimeout(() => setCopiedTeaser(false), 2500);
  };

  const handleTearSheetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim() || !leadName.trim()) return;

    setSubmittingLead(true);
    try {
      await addSubscriberLead({
        name: leadName.trim(),
        email: leadEmail.trim(),
        whatsapp: leadWhatsapp.trim() || undefined,
        dossierSlug: dossier.slug,
        source: 'tear-sheet-download-modal'
      });

      // Trigger automatic file download
      const downloadLink = document.createElement('a');
      downloadLink.href = dossier.tearSheetPdfUrl || '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx';
      downloadLink.download = `${dossier.ticker}_PSA_Executive_TearSheet.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloadSuccess(true);
      setTimeout(() => {
        setIsTearSheetModalOpen(false);
        setDownloadSuccess(false);
      }, 3000);
    } finally {
      setSubmittingLead(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      {/* Top Breadcrumbs & Return Navigation */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-500 font-medium">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#0A1F44] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('research')}
              className="hover:text-[#0A1F44] transition-colors cursor-pointer"
            >
              Research
            </button>
            <span>/</span>
            <span className="font-bold text-[#0A1F44] truncate max-w-[200px] sm:max-w-xs">
              {dossier.ticker}
            </span>
          </nav>

          <button
            onClick={() => onNavigate('research')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Dossiers</span>
          </button>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header Hero Banner */}
        <header className="bg-gradient-to-br from-[#0A1F44] via-[#0D244F] to-[#07152E] text-white rounded-3xl p-6 sm:p-10 border border-[#C9A84C]/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#C9A84C] text-[#0A1F44] shadow-sm">
                {dossier.convictionRating} RECOMMENDATION
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-white/10 text-white border border-white/20">
                NGX: {dossier.ticker}
              </span>
              <span className="text-[11px] text-slate-300 font-semibold">
                Sector: {dossier.sector}
              </span>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight leading-snug">
              {dossier.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#C9A84C]" />
                <span className="font-semibold text-white">{dossier.author}</span>
                <span className="text-slate-400">(Chief Analyst)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C9A84C]" />
                <span>Published: {new Date(dossier.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-[#C9A84C] font-semibold">Institutional Verified Model</span>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Valuation Summary Bar */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Share Price</span>
            <div className="font-mono font-black text-lg sm:text-xl text-slate-900">{dossier.currentPrice}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">12M Target Price</span>
            <div className="font-mono font-black text-lg sm:text-xl text-[#0A1F44]">{dossier.targetPrice}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Projected Upside</span>
            <div className="font-mono font-black text-lg sm:text-xl text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{dossier.upsidePercent}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trailing P/E</span>
            <div className="font-mono font-black text-lg sm:text-xl text-slate-900">{dossier.multiples.pe}</div>
          </div>
          <div className="space-y-1 col-span-2 sm:col-span-1 border-t sm:border-t-0 pt-2 sm:pt-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dividend Yield</span>
            <div className="font-mono font-black text-lg sm:text-xl text-[#C9A84C]">{dossier.multiples.dividendYield}</div>
          </div>
        </section>

        {/* Social Distribution & WhatsApp Sharing Bar */}
        <section className="bg-[#0A1F44]/5 rounded-2xl p-4 border border-[#C9A84C]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-xs font-bold text-[#0A1F44]">
              Share Institutional Teaser (WhatsApp & Social Channels)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyTeaser}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedTeaser ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTeaser ? 'Teaser Copied!' : 'Copy WhatsApp Teaser'}</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(dossier.whatsappTeaser)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${dossier.title} - Institutional Valuation Dossier by @salami_abdulslm on @psa_investment`)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
            >
              <span>X</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#0077b5] hover:bg-[#005f93] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>LinkedIn</span>
            </a>

            <button
              onClick={handleCopyLink}
              title="Copy Canonical URL"
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </section>

        {/* Executive Summary & Investment Thesis */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif font-black text-xl text-[#0A1F44] border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#C9A84C]" />
              <span>Executive Summary</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {dossier.executiveSummary}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif font-black text-xl text-[#0A1F44] border-b border-slate-100 pb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Investment Thesis & Catalysts</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {dossier.investmentThesis}
            </p>
          </div>
        </section>

        {/* STANDARDIZED HTML VALUATION & FUNDAMENTAL MULTIPLES TABLE (SEMANTIC HTML <table> FOR SEARCH INDEXING) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A84C]">
                Fundamental Multiples Matrix
              </span>
              <h2 className="font-serif font-black text-xl text-[#0A1F44]">
                Standardized Valuation & Ratio Diagnostics Table
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Source: PSA Investment Research Desk / NGX DOPL
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0A1F44] text-white">
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider rounded-tl-xl">Metric</th>
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider">Current / LTM Figure</th>
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider">Sector Peer Average</th>
                  <th scope="col" className="p-3.5 font-bold uppercase tracking-wider rounded-tr-xl">Analyst Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dossier.valuationTable.map((row, idx) => (
                  <tr
                    key={row.metric}
                    className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} hover:bg-amber-50/50`}
                  >
                    <th scope="row" className="p-3.5 font-bold text-[#0A1F44]">{row.metric}</th>
                    <td className="p-3.5 font-mono font-black text-slate-900">{row.currentFigure}</td>
                    <td className="p-3.5 font-mono text-slate-500">{row.sectorPeerAverage}</td>
                    <td className="p-3.5 text-slate-700 leading-snug">{row.analystAssessment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed 4-Part Analysis Sections */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-slate-800 leading-relaxed text-sm">
          <div className="space-y-3">
            <h2 className="font-serif font-black text-2xl text-[#0A1F44] pb-2 border-b border-slate-100">
              1. Business Overview & Operational Moat
            </h2>
            <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed">
              {dossier.businessOverview}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif font-black text-2xl text-[#0A1F44] pb-2 border-b border-slate-100">
              2. Financial & Ratio Diagnostics
            </h2>
            <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed">
              {dossier.financialDiagnostics}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif font-black text-2xl text-[#0A1F44] pb-2 border-b border-slate-100">
              3. Catalysts & Downside Risk Matrix
            </h2>
            <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed">
              {dossier.catalystsAndRisks}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif font-black text-2xl text-[#0A1F44] pb-2 border-b border-slate-100">
              4. Valuation Methodology & Price Target Formulation
            </h2>
            <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed">
              {dossier.valuationAndPriceTarget}
            </div>
          </div>
        </section>

        {/* DUAL CONVERSION CTA BLOCK */}
        <section className="bg-gradient-to-br from-[#0A1F44] to-[#07152E] rounded-3xl p-6 sm:p-10 border border-[#C9A84C]/40 text-white shadow-2xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C9A84C]">
              Institutional Action Gate
            </span>
            <h3 className="font-serif font-black text-2xl sm:text-3xl">
              Access Full Valuation Models & Executive Tear-Sheets
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Choose your institutional depth: download the 1-page executive tear-sheet or unlock the dynamic 3-statement financial model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* CTA 1: Executive Tear-Sheet (Free Lead Magnet) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#C9A84C]/60 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#C9A84C]">
                  <FileText className="w-5 h-5" />
                  <span className="font-bold text-sm text-white">Executive Tear-Sheet (PDF)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Download the institutional 1-page PDF tearsheet summarizing {dossier.companyName} multiple trajectories, valuation tables, and recapitalization timelines.
                </p>
                <div className="text-[11px] text-[#C9A84C] flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Includes free subscription to PSAI Weekly Market Digest.</span>
                </div>
              </div>

              <button
                onClick={() => setIsTearSheetModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0A1F44] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#0A1F44]" />
                <span>Download Executive Tear-Sheet (Free)</span>
              </button>
            </div>

            {/* CTA 2: Paid Full Model & Analyst Circle Unlock */}
            <div className="bg-gradient-to-br from-[#C9A84C]/15 to-[#0A1F44] border border-[#C9A84C] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#C9A84C]">
                  <FileSpreadsheet className="w-5 h-5 text-[#C9A84C]" />
                  <span className="font-bold text-sm text-white">Unlock Full Institutional Dossier & Excel Model</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Access the live un-redacted 3-statement financial model, dynamic sensitivity tables, WACC matrix, and private Analyst Circle briefings.
                </p>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Direct WhatsApp hotline access with Chief Analyst Salami Abdullahi.</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (currentUser || memberProfile) {
                    onNavigate('analyst-circle');
                  } else {
                    onOpenAuthModal('signup');
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Full Institutional Dossier (Analyst Circle)</span>
              </button>
            </div>
          </div>
        </section>
      </article>

      {/* LEAD CAPTURE MODAL FOR TEAR-SHEET DOWNLOAD (TOGGLEABLE) */}
      {isTearSheetModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTearSheetModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <button
              onClick={() => setIsTearSheetModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A84C]">
                Institutional Tear-Sheet Access
              </span>
              <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                Download {dossier.ticker} Tear-Sheet
              </h3>
              <p className="text-xs text-slate-600">
                Please provide your details below to receive the 1-page executive valuation brief and subscribe to the *PSAI Weekly Digest*.
              </p>
            </div>

            {downloadSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-xs text-emerald-900">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Download Started!</h4>
                <p>Your executive tear-sheet is downloading. You have also been registered for the PSAI Weekly Digest.</p>
              </div>
            ) : (
              <form onSubmit={handleTearSheetSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adebayo Babatunde"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Corporate / Personal Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. adebayo@investment.ng"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    WhatsApp Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 800 000 0000"
                    value={leadWhatsapp}
                    onChange={(e) => setLeadWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Receive morning NGX pre-market briefings on WhatsApp.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{submittingLead ? 'Generating Brief...' : 'Confirm & Download PDF'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
