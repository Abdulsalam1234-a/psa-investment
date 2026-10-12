import React from 'react';
import {
  LineChart,
  PieChart,
  SunMedium,
  Building2,
  GraduationCap,
  Video,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileText,
  CheckCircle2,
  ExternalLink,
  Lock,
  Clock,
  Sparkles,
  Download,
  Calendar,
  Archive
} from 'lucide-react';
import { ViewTab } from '../types';
import { useData } from '../context/DataContext';

interface HomeProps {
  setActiveTab: (tab: ViewTab) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onSelectReport: (reportId: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  setActiveTab,
  onOpenAuthModal,
  onSelectReport
}) => {
  const { services, reports, videos, chronicles, logChronicleDownload } = useData();
  const latestChronicle = chronicles[0];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'LineChart':
        return <LineChart className="w-6 h-6 text-[#C9A84C]" />;
      case 'PieChart':
        return <PieChart className="w-6 h-6 text-[#C9A84C]" />;
      case 'SunMedium':
        return <SunMedium className="w-6 h-6 text-[#C9A84C]" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-[#C9A84C]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-[#C9A84C]" />;
      case 'Video':
        return <Video className="w-6 h-6 text-[#C9A84C]" />;
      default:
        return <TrendingUp className="w-6 h-6 text-[#C9A84C]" />;
    }
  };

  const featuredReport = reports[0];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section (Executive Deep Navy) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white pt-16 pb-24 border-b border-[#C9A84C]/20">
        {/* Subtle radial texture & glows */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#13306B]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#C9A84C]/30 text-white text-xs font-semibold backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                <span>Independent Nigerian Equity Research & Intelligence</span>
              </div>

              <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
                Building Wealth Through{' '}
                <span className="text-[#C9A84C] italic font-serif">Intelligent</span> Investments.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Institutional-grade equity research covering NGX-listed securities, disciplined
                portfolio allocation, and capital advisory. We transform market noise into verified
                capital compounding.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onOpenAuthModal('signup')}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#B8973D] hover:from-[#B8973D] hover:to-[#A7862C] text-[#0A1F44] font-bold text-sm shadow-lg shadow-[#C9A84C]/20 transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Apply to Analyst Circle</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('research');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 hover:border-[#C9A84C] transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
                >
                  <FileText className="w-4 h-4 text-[#C9A84C]" />
                  <span>Explore Research</span>
                </button>
              </div>

              {/* Stats badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="font-serif font-black text-2xl sm:text-3xl text-white">30+</div>
                  <div className="text-xs text-slate-400 font-medium">NGX Equities Covered</div>
                </div>
                <div>
                  <div className="font-serif font-black text-2xl sm:text-3xl text-[#C9A84C]">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Independent Research</div>
                </div>
                <div>
                  <div className="font-serif font-black text-2xl sm:text-3xl text-white">₦500B+</div>
                  <div className="text-xs text-slate-400 font-medium">Banking Recap Tracked</div>
                </div>
              </div>
            </div>

            {/* Right Hero Card: Featured Valuation Note Card */}
            <div className="lg:col-span-5">
              {featuredReport && (
                <div className="relative mx-auto max-w-md bg-[#0F2752]/90 border border-[#C9A84C]/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 backdrop-blur-md transition-all hover:border-[#C9A84C]">
                  {/* Card Header with Chief Analyst Headshot & Live Badge */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/salami-abdullahi.jpg"
                        alt="Salami Abdullahi - Founder, CEO & Chief Analyst"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C9A84C] shadow-md shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">Salami Abdullahi</div>
                        <div className="text-xs text-[#C9A84C] font-semibold">
                          CEO, COO, & Chief Analyst
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live Coverage
                    </span>
                  </div>

                  {/* Featured Note Content */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-wider">
                      Featured Valuation Note
                    </div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-snug">
                      {featuredReport.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {featuredReport.summary}
                    </p>
                  </div>

                  {/* Ticker & Stance Box */}
                  <div className="bg-[#07152E] rounded-2xl p-4 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] font-medium">Primary Sector:</span>
                      <span className="font-bold text-white">Financial Institutions</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[11px] font-medium">Analyst Stance:</span>
                      <span className="font-bold text-emerald-400">Sector Overweight</span>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => onSelectReport(featuredReport.id)}
                    className="w-full py-3 px-4 bg-white/10 hover:bg-[#C9A84C] hover:text-[#0A1F44] text-white text-xs font-bold rounded-xl border border-white/20 hover:border-[#C9A84C] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Read Full Public Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Executive Leadership Spotlight & Who We Are */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Salami Abdullahi Executive Headshot Card */}
            <div className="lg:col-span-5 flex flex-col items-center text-center p-8 bg-[#0A1F44] rounded-3xl border border-[#C9A84C]/40 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Executive Lead</span>
              </div>

              {/* Headshot Photo */}
              <div className="relative mb-5">
                <img
                  src="/salami-abdullahi.jpg"
                  alt="Salami Abdullahi - Founder, CEO, COO, and Chief Analyst of PSA Investment"
                  className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl object-cover ring-4 ring-[#C9A84C]/50 shadow-2xl border-2 border-[#C9A84C]"
                  loading="eager"
                />
              </div>

              <h3 className="font-serif text-2xl font-black text-white">Salami Abdullahi</h3>
              <p className="text-xs font-bold text-[#C9A84C] tracking-wide mt-1 uppercase">
                Founder, CEO, COO, & Chief Analyst
              </p>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-sm">
                Leading PSA Investment across operational strategy, institutional research synthesis,
                and executive equity valuation. Committed to transparent, high-conviction Nigerian
                capital growth.
              </p>

              <div className="mt-6 pt-4 border-t border-white/10 w-full flex items-center justify-center">
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#C9A84C] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Read Executive Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Narrative & Values */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0A1F44]/5 text-[#0A1F44] text-xs font-bold uppercase tracking-wider">
                Who We Are
              </div>

              <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#0A1F44] leading-tight">
                An Independent Financial Intelligence Powerhouse Rooted in Nigeria.
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                PSA Investment was established to bridge the information gap in Nigerian capital
                markets. While emerging markets offer superior real returns, investors often struggle
                with fragmented disclosures, sell-side broker conflicts, and currency volatility.
              </p>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                We combine deep grassroots commercial realities with rigorous quantitative valuation
                models. Whether analyzing tier-1 NGX banks, structuring clean energy Power-as-a-Service
                for mid-market manufacturing, or vetting commercial real estate cash flows, our
                mandate remains singular: safeguarding and multiplying client wealth.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Zero sell-side broker commissions
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Real DCF models with Nigerian risk adjustments
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Exclusive Analyst Circle access tier
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Direct executive leadership and accountability
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The PSA Financial Chronicle (Today's Daily Newspaper & Pre-Market Briefing) */}
      {latestChronicle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border-2 border-[#0A1F44]/20 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-2 border-slate-900 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-sans uppercase font-bold tracking-widest text-[#0A1F44]">
                    Daily 07:00 WAT Automation Dispatch
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#0A1F44] text-[#C9A84C] text-[10px] font-mono font-bold">
                    {latestChronicle.volume}
                  </span>
                </div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#0A1F44] uppercase tracking-tight">
                  The PSA Financial Chronicle
                </h2>
                <div className="text-xs text-slate-600 font-sans italic font-medium">
                  {latestChronicle.subtitle}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('chronicle');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Read Broadsheet Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    logChronicleDownload(latestChronicle.id);
                    window.print();
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#0A1F44] font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#C9A84C]" />
                  <span>Download Newspaper (PDF)</span>
                </button>
              </div>
            </div>

            {/* Broadsheet Headline & Snippet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-block bg-[#0A1F44]/10 text-[#0A1F44] text-[11px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  {latestChronicle.editionDate} | {latestChronicle.briefingTime}
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 leading-snug">
                  {latestChronicle.headline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed border-l-4 border-[#C9A84C] pl-3 py-0.5">
                  {latestChronicle.subheadline}
                </p>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-serif">
                  {latestChronicle.leadArticle}
                </p>
              </div>

              {/* Fast Barometer Snapshot Cards */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-300/80 space-y-3 font-sans">
                <div className="text-[11px] font-bold uppercase text-[#0A1F44] border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span>Market Barometer Snapshot</span>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold">+0.13% Close</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">NGX ASI:</span>
                    <span className="font-bold text-slate-900">248,363.55 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Equities Cap:</span>
                    <span className="font-bold text-slate-900">₦161.26 Trillion</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Traded Value:</span>
                    <span className="font-bold text-slate-900">₦20.50 Billion</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Top Gainer:</span>
                    <span className="font-bold text-emerald-700">REGALINS (+10.0%)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Public Archive:</span>
                  <button
                    onClick={() => {
                      setActiveTab('chronicle');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-bold text-[#0A1F44] hover:text-[#C9A84C] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Browse {chronicles.length} Past Editions</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Core Advisory Services (Refined Seamless Card Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Comprehensive Capabilities
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#0A1F44]">
            Our Core Advisory Services
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            From publicly quoted equity valuation to commercial solar deployment and institutional
            financial modeling, discover our multi-disciplinary capabilities.
          </p>
        </div>

        {/* 3-Column Grid with Equal Height Flex Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <div
              key={svc.id}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-[#C9A84C] shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group h-full relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A1F44]/5 text-[#C9A84C] group-hover:bg-[#0A1F44] group-hover:text-[#C9A84C] transition-colors flex items-center justify-center shadow-xs">
                    {getServiceIcon(svc.icon)}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-[#C9A84C] transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-serif font-black text-xl text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors leading-snug">
                  {svc.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed min-h-[55px]">
                  {svc.shortDescription}
                </p>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  {svc.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span className="leading-snug">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveTab('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Service Specifics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Research & Insights (Dark Institutional Section) */}
      <section className="bg-slate-900 text-white py-20 border-y border-[#C9A84C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                Open-Access Market Commentary
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-white mt-1">
                Featured Free Research & Insights
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mt-2 max-w-2xl">
                Review our complimentary fundamental valuation reports and macroeconomic breakdowns
                before stepping up to the Analyst Circle.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('research');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#C9A84C] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>View All Research Dispatches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reports.slice(0, 2).map(rep => (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep.id)}
                className="bg-[#0A1F44]/90 border border-slate-700/80 hover:border-[#C9A84C] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group flex flex-col justify-between cursor-pointer backdrop-blur-xs"
              >
                <div>
                  {/* Report Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={rep.coverImage}
                      alt={rep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#0A1F44]">
                        {rep.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {rep.access === 'premium' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C9A84C] text-[#0A1F44]">
                          <Lock className="w-3 h-3" />
                          Circle Exclusive
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500 text-white">
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

                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      {rep.targetPrice ? (
                        <span className="font-semibold text-slate-300">
                          Target: <strong className="text-white">{rep.targetPrice}</strong>
                        </span>
                      ) : (
                        <span className="text-slate-400">Institutional Review</span>
                      )}

                      {rep.recommendation && (
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded text-[11px] ${
                            rep.recommendation.includes('Buy')
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {rep.recommendation}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-white group-hover:text-[#C9A84C] transition-colors leading-snug">
                      {rep.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {rep.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:px-8 py-4 bg-[#07152E] border-t border-slate-700/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400 font-medium">By {rep.author}</div>
                  <div className="font-bold text-[#C9A84C] group-hover:text-white flex items-center gap-1.5 transition-colors">
                    <span>Read Full Note</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PSA Lens Media Channel (Videos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              PSA Lens Media Channel
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#0A1F44] mt-1">
              Free Financial Intelligence Videos
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mt-2 max-w-2xl">
              Watch our masterclasses directly on the platform or join our YouTube community for
              updates and subscriber discussions.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('videos');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>View All PSA Lens Video Lessons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.map(vid => (
            <div
              key={vid.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-900">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${vid.youtubeId}`}
                  title={vid.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-0.5 rounded-full">
                    {vid.topicTag}
                  </span>
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {vid.duration}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0A1F44] leading-snug">
                  {vid.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PSA Analyst Circle CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0A1F44] via-[#0D2450] to-[#122A5E] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden border border-[#C9A84C]/30">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              Exclusive Member Network
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-white">
              Step Inside the PSA Analyst Circle.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Membership is free to apply. Access confidential equity valuation models, institutional
              DCF templates, quarterly dividend projections, and your personal member referral code.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#C9A84C] to-[#B8973D] hover:from-[#B8973D] hover:to-[#A7862C] text-[#0A1F44] font-bold text-xs rounded-xl shadow-lg shadow-[#C9A84C]/20 cursor-pointer transition-all hover:scale-102 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Request Membership Access</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('analyst-circle');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl cursor-pointer transition-all border border-white/20 hover:border-white/40"
            >
              Learn More About the Tier
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
