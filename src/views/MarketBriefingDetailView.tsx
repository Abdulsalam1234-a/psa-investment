import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Building2,
  Globe,
  Copy,
  Check,
  Play,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { MarketBriefing } from '../types';

interface MarketBriefingDetailViewProps {
  slug: string;
  onNavigate: (tab: string, slug?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const MarketBriefingDetailView: React.FC<MarketBriefingDetailViewProps> = ({
  slug,
  onNavigate,
  onOpenAuthModal
}) => {
  const { marketBriefings } = useData();

  const briefing = marketBriefings.find(b => b.slug === slug || b.id === slug) || marketBriefings[0];

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTeaser, setCopiedTeaser] = useState(false);

  // Dynamic Metadata and JSON-LD injection
  useEffect(() => {
    if (!briefing) return;

    const originalTitle = document.title;
    document.title = `${briefing.title} | PSA Investment`;

    // Dynamic Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `Daily NGX Pre-Market Intelligence for ${briefing.date}. ASI: ${briefing.asiSnapshot.asi}, market cap: ${briefing.asiSnapshot.marketCap}, and top gainers/losers.`
      );
    }

    // Dynamic Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://psainvestment.com/market-briefings/${briefing.slug}`);
    }

    // Dynamic Open Graph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${briefing.title} | PSA Investment`);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', briefing.leadArticle.slice(0, 160));

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://psainvestment.com/market-briefings/${briefing.slug}`);

    // Inject Per-Page JSON-LD
    const scriptId = 'briefing-jsonld-schema';
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
              'name': 'Market Briefings',
              'item': 'https://psainvestment.com/market-briefings'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': briefing.volume,
              'item': `https://psainvestment.com/market-briefings/${briefing.slug}`
            }
          ]
        },
        {
          '@type': 'AnalysisNewsArticle',
          '@id': `https://psainvestment.com/market-briefings/${briefing.slug}#article`,
          'headline': briefing.title,
          'description': briefing.leadArticle.slice(0, 160),
          'datePublished': briefing.publishedAt,
          'dateModified': briefing.publishedAt,
          'mainEntityOfPage': `https://psainvestment.com/market-briefings/${briefing.slug}`,
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
  }, [briefing]);

  if (!briefing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif font-black text-2xl text-[#0A1F44]">Briefing Not Found</h2>
        <p className="text-xs text-slate-600">The requested daily market briefing could not be located.</p>
        <button
          onClick={() => onNavigate('market-briefings')}
          className="px-5 py-2.5 bg-[#0A1F44] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer"
        >
          Return to Market Briefings
        </button>
      </div>
    );
  }

  const shareUrl = `https://psainvestment.com/market-briefings/${briefing.slug}?utm_source=whatsapp&utm_medium=social`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyTeaser = () => {
    navigator.clipboard.writeText(briefing.whatsappTeaser);
    setCopiedTeaser(true);
    setTimeout(() => setCopiedTeaser(false), 2500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      {/* Top Breadcrumb Navigation */}
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
              onClick={() => onNavigate('market-briefings')}
              className="hover:text-[#0A1F44] transition-colors cursor-pointer"
            >
              Market Briefings
            </button>
            <span>/</span>
            <span className="font-bold text-[#0A1F44] font-mono">
              {briefing.volume}
            </span>
          </nav>

          <button
            onClick={() => onNavigate('market-briefings')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Briefings</span>
          </button>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header Hero */}
        <header className="bg-gradient-to-br from-[#0A1F44] via-[#0D244F] to-[#07152E] text-white rounded-3xl p-6 sm:p-10 border border-[#C9A84C]/40 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-black bg-[#C9A84C] text-[#0A1F44]">
                {briefing.volume}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/20 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>07:00 WAT Opening Bell Dispatch</span>
              </span>
              <span className="text-[11px] text-slate-300">
                {new Date(briefing.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight leading-snug">
              {briefing.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 border-t border-white/10">
              <span>Director: <strong className="text-white">Salami Abdullahi A.</strong></span>
              <span>•</span>
              <span className="text-[#C9A84C] font-semibold">Verified Official NGX Daily Price List</span>
            </div>
          </div>
        </header>

        {/* 1-Click WhatsApp Quick-Copy Teaser Bar for Founder/Admin */}
        <section className="bg-[#0A1F44]/5 border border-[#C9A84C]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0A1F44]">
            <Share2 className="w-4 h-4 text-[#C9A84C]" />
            <span>Publish-First, WhatsApp-Second Action:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyTeaser}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedTeaser ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedTeaser ? 'WhatsApp Teaser Copied!' : 'Copy WhatsApp Channel Teaser'}</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(briefing.whatsappTeaser)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Share to WhatsApp</span>
            </a>

            <button
              onClick={handleCopyLink}
              title="Copy Page URL"
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </section>

        {/* NGX All-Share Index (ASI) Snapshot Grid */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-serif font-black text-xl text-[#0A1F44]">
              NGX Official Session Snapshot
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              CSCS Floor Clearance Report
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">All-Share Index</span>
              <span className="font-mono font-black text-slate-900 text-sm">{briefing.asiSnapshot.asi}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Day Change</span>
              <span className="font-mono font-bold text-emerald-600 text-sm">{briefing.asiSnapshot.dayChange}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Equities Cap</span>
              <span className="font-mono font-black text-slate-900 text-sm">{briefing.asiSnapshot.marketCap}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Traded Volume</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{briefing.asiSnapshot.volume}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Traded Value</span>
              <span className="font-mono font-black text-[#0A1F44] text-sm">{briefing.asiSnapshot.value}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Market Breadth</span>
              <span className="font-mono font-bold text-slate-700 text-sm">{briefing.asiSnapshot.breadth}</span>
            </div>
          </div>
        </section>

        {/* Lead Article Analysis */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="font-serif font-black text-2xl text-[#0A1F44] border-b border-slate-100 pb-3">
            Institutional Flow & Opening Bell Assessment
          </h2>
          <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed">
            {briefing.leadArticle}
          </div>
        </section>

        {/* TOP GAINERS & LOSERS HTML TABLE (SEMANTIC HTML <table>) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-serif font-black text-xl text-[#0A1F44]">
              Top Gainers & Losers Analysis
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Official Price Movements
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Gainers Table */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <TrendingUp className="w-4 h-4" />
                <span>Top Advancers</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                      <th scope="col" className="p-2.5 font-bold uppercase">Ticker</th>
                      <th scope="col" className="p-2.5 font-bold uppercase">Company</th>
                      <th scope="col" className="p-2.5 font-bold uppercase">Close</th>
                      <th scope="col" className="p-2.5 font-bold uppercase text-right">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {briefing.topGainers.map((g, idx) => (
                      <tr key={g.ticker} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <th scope="row" className="p-2.5 font-mono font-bold text-[#0A1F44]">{g.ticker}</th>
                        <td className="p-2.5 text-slate-600 truncate max-w-[140px]">{g.name}</td>
                        <td className="p-2.5 font-mono font-semibold">{g.close}</td>
                        <td className="p-2.5 font-mono font-black text-emerald-600 text-right">{g.change}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Losers Table */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                <TrendingDown className="w-4 h-4" />
                <span>Top Decliners</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-rose-50 text-rose-900 border-b border-rose-100">
                      <th scope="col" className="p-2.5 font-bold uppercase">Ticker</th>
                      <th scope="col" className="p-2.5 font-bold uppercase">Company</th>
                      <th scope="col" className="p-2.5 font-bold uppercase">Close</th>
                      <th scope="col" className="p-2.5 font-bold uppercase text-right">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {briefing.topLosers.map((l, idx) => (
                      <tr key={l.ticker} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <th scope="row" className="p-2.5 font-mono font-bold text-[#0A1F44]">{l.ticker}</th>
                        <td className="p-2.5 text-slate-600 truncate max-w-[140px]">{l.name}</td>
                        <td className="p-2.5 font-mono font-semibold">{l.close}</td>
                        <td className="p-2.5 font-mono font-black text-rose-600 text-right">{l.change}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mover Drivers */}
          {briefing.moverDrivers && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
              <span className="font-bold text-[#0A1F44] uppercase tracking-wider text-[10px]">
                Key Floor Catalysts:
              </span>
              <ul className="space-y-1 list-disc list-inside">
                {briefing.moverDrivers.gainers.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Corporate Disclosures & Macro Drivers */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Corporate Disclosures */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-serif font-black text-xl text-[#0A1F44] border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#C9A84C]" />
              <span>Corporate Disclosures</span>
            </h3>

            <div className="space-y-3">
              {briefing.corporateDisclosures.map(cd => (
                <div key={cd.entity} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0A1F44]">{cd.entity}</span>
                    <span className="text-[10px] font-mono text-[#C9A84C] font-semibold">{cd.timeline}</span>
                  </div>
                  <div className="font-semibold text-slate-800 text-[11px]">{cd.event}</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{cd.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Macro Drivers */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-serif font-black text-xl text-[#0A1F44] border-b border-slate-100 pb-2 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Macroeconomic Benchmarks</span>
            </h3>

            <div className="space-y-3">
              {briefing.macroDrivers.map(md => (
                <div key={md.indicator} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0A1F44] block">{md.indicator}</span>
                    <span className="text-[10px] text-slate-400">{md.source}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-slate-900 block">{md.level}</span>
                    <span className="font-mono text-[10px] text-slate-500">{md.variance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Embedded YouTube Video Player (from @psa_investment) */}
        {briefing.youtubeUrl && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Play className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                PSA Lens Pre-Market Video Breakdown (@psa_investment)
              </h3>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                title="PSA Lens Video Breakdown"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Tactical Playbook */}
        <section className="bg-gradient-to-br from-[#0A1F44] to-[#07152E] rounded-3xl p-6 sm:p-8 border border-[#C9A84C]/40 text-white shadow-xl space-y-4">
          <h3 className="font-serif font-black text-xl text-[#C9A84C] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>Tactical Broker Desk Playbook & Action Directives</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {briefing.tacticalPlaybook.map((play, idx) => (
              <li key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10">
                {play}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
};
