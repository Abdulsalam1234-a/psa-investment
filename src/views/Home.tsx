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
  Play
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
  const { services, reports, videos } = useData();

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
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50 to-[#F4F6F8] pt-12 pb-20 border-b border-slate-200/60 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#0A1F44]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1F44]/5 border border-[#0A1F44]/15 text-[#0A1F44] text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                Independent Nigerian Equity Research & Intelligence
              </div>

              <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#0A1F44] tracking-tight leading-[1.12]">
                Building Wealth Through{' '}
                <span className="text-[#C9A84C] italic font-serif">Intelligent</span> Investments.
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Institutional-grade equity research covering NGX-listed securities, disciplined
                portfolio allocation, and capital advisory. We transform market noise into verified
                capital compounding.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onOpenAuthModal('signup')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-sm shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Apply to Analyst Circle
                </button>
                <button
                  onClick={() => {
                    setActiveTab('research');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0A1F44] font-bold text-sm border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Review Research Notes
                </button>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="font-serif font-black text-xl sm:text-2xl text-[#0A1F44]">
                    ₦500B+
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Recapitalization
                  </div>
                </div>
                <div>
                  <div className="font-serif font-black text-xl sm:text-2xl text-[#0A1F44]">
                    6 Core
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Advisories
                  </div>
                </div>
                <div>
                  <div className="font-serif font-black text-xl sm:text-2xl text-[#C9A84C]">
                    100%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Independent
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Card: Featured Report */}
            <div className="lg:col-span-5">
              {featuredReport && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 relative overflow-hidden group hover:shadow-2xl transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-bl-full pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#0A1F44] text-[#C9A84C]">
                      Featured Valuation Note
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {featuredReport.recommendation || 'Buy'}
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-xl text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors leading-snug">
                    {featuredReport.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-3">
                    {featuredReport.summary}
                  </p>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Primary Analyst
                      </div>
                      <div className="text-xs font-bold text-[#0A1F44]">
                        {featuredReport.author}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectReport(featuredReport.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-[#0A1F44] text-[#0A1F44] hover:text-[#C9A84C] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Read Note</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars / Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] block">
              The PSA Difference
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#0A1F44] leading-tight">
              An Independent Financial Intelligence Powerhouse Rooted in Nigeria.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              PSA Investment was established to bridge the information gap in Nigerian capital
              markets. While emerging markets offer superior real returns, investors often struggle
              with fragmented disclosures, sell-side broker conflicts, and currency volatility.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              We combine deep grassroots commercial realities with rigorous quantitative valuation
              models. Whether analyzing tier-1 NGX banks, structuring clean energy Power-as-a-Service
              for mid-market manufacturing, or vetting commercial real estate cash flows, our
              mandate remains singular: safeguarding and multiplying client wealth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero sell-side broker commissions</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real DCF models with Nigerian risk adjustments</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Exclusive Analyst Circle access tier</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct executive leadership and accountability</span>
              </div>
            </div>
          </div>

          {/* Executive Leadership Spotlight Box */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-[#0A1F44] to-[#122A5E] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden border border-slate-800">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#C9A84C]/10 rounded-tl-full pointer-events-none" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#C9A84C] text-[#0A1F44] flex items-center justify-center font-serif font-black text-2xl shadow-lg">
                  SA
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-white">Salami Abdullahi</h3>
                  <div className="text-xs text-[#C9A84C] font-semibold">
                    Founder, CEO, COO, & Chief Analyst
                  </div>
                  <div className="text-[11px] text-slate-400">PSA Investment Desk</div>
                </div>
              </div>

              <blockquote className="text-xs sm:text-sm text-slate-200 leading-relaxed italic border-l-2 border-[#C9A84C] pl-4 my-4">
                "Our valuation paradigm refuses to copy-paste Western formulas that ignore Nigerian
                interest rate realities or sovereign spreads. We evaluate African assets on empirical
                cash generation, foreign exchange resilience, and corporate governance."
              </blockquote>

              <div className="pt-4 flex items-center justify-between">
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

                <div className="text-[11px] font-mono text-slate-400">ID: PSA-CEO001</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Comprehensive Capabilities
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#0A1F44]">
            Our Core Advisory Services
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            From publicly quoted equity valuation to commercial solar deployment and institutional
            financial modeling, discover our multi-disciplinary capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(svc => (
            <div
              key={svc.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0A1F44]/5 group-hover:bg-[#0A1F44] transition-colors flex items-center justify-center">
                  {getServiceIcon(svc.icon)}
                </div>

                <h3 className="font-serif font-black text-lg text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors">
                  {svc.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">{svc.shortDescription}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {svc.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3 h-3 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveTab('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Deliverables</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Research Notes Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                Institutional Intelligence
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#0A1F44] mt-1">
                Latest Valuation Notes & Reports
              </h2>
            </div>

            <button
              onClick={() => {
                setActiveTab('research');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Research Dispatches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {reports.map(rep => (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep.id)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {rep.category}
                      </span>
                      {rep.ticker && (
                        <span className="text-xs font-mono font-bold text-[#0A1F44]">
                          {rep.ticker}
                        </span>
                      )}
                    </div>
                    {rep.access === 'premium' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A84C]/20 text-[#0A1F44]">
                        <Lock className="w-3 h-3 text-[#C9A84C]" />
                        Circle Exclusive
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        Public
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-black text-xl text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors">
                    {rep.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {rep.summary}
                  </p>
                </div>

                <div className="p-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">{rep.author}</div>
                  <div className="font-bold text-[#0A1F44] group-hover:text-[#C9A84C] flex items-center gap-1">
                    <span>Read Full Note</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PSA Lens Videos Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              PSA Lens Media Channel
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#0A1F44] mt-1">
              Free Financial Intelligence Videos
            </h2>
          </div>

          <button
            onClick={() => {
              setActiveTab('videos');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All PSA Lens Lessons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map(vid => (
            <div
              key={vid.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all"
            >
              <div className="relative aspect-video bg-slate-900 group">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${vid.youtubeId}`}
                  title={vid.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A84C]">
                  {vid.topicTag} • {vid.duration}
                </span>
                <h4 className="font-serif font-black text-base text-[#0A1F44]">{vid.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{vid.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analyst Circle CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0A1F44] to-[#122A5E] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all hover:scale-102 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Request Membership Access
            </button>
            <button
              onClick={() => {
                setActiveTab('analyst-circle');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              Learn More About the Tier
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
