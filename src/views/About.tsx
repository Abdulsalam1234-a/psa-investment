import React from 'react';
import {
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { ViewTab } from '../types';
import { YoutubeIcon, InstagramIcon, XIcon } from '../components/BrandIcons';

interface AboutProps {
  setActiveTab: (tab: ViewTab) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const About: React.FC<AboutProps> = ({ setActiveTab: _setActiveTab, onOpenAuthModal }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            About PSA Investment
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#0A1F44] tracking-tight max-w-3xl mx-auto">
            Institutional Discipline. Grassroots Conviction.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Pioneering independent equity intelligence on the Nigerian Exchange (NGX) to help
            ambitious individuals and institutions build generational wealth.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="font-serif font-black text-2xl text-[#0A1F44]">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To democratize institutional-grade equity valuation, debunk speculative rumors in
              Nigerian capital markets, and provide actionable financial intelligence that
              outpaces inflation and currency volatility.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A84C] text-[#0A1F44] flex items-center justify-center">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="font-serif font-black text-2xl text-[#0A1F44]">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To stand as West Africa's foremost independent equity research authority, recognized
              internationally for analytical purity, innovative SME capital advisory, and
              transformative investor education.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1F44] bg-gradient-to-br from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Bio Details */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                  Executive Leadership & Founder
                </span>
                <h2 className="font-serif font-black text-3xl sm:text-4xl text-white">
                  Salami Abdullahi
                </h2>
                <div className="text-sm font-semibold text-slate-300">
                  Founder, CEO, COO, and Chief Analyst
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  As the Founder, Chief Executive Officer, Chief Operating Officer, and Chief
                  Analyst of PSA Investment, Salami Abdullahi directs both the institutional
                  research framework and the overarching strategic expansion of the firm.
                </p>
                <p>
                  Under his analytical leadership, PSA Investment has pioneered a distinct valuation
                  paradigm for Nigerian equities. Rather than blindly applying Western financial
                  templates that ignore local foreign exchange dynamics or interest rate swings,
                  Salami’s models explicitly incorporate Nigerian sovereign spreads, domestic
                  inflation buffers, and cash conversion cycles.
                </p>
                <p>
                  His mission through PSA Lens and the PSA Analyst Circle is straightforward: to
                  nurture a new generation of informed African investors who can decipher corporate
                  disclosures, protect their hard-earned capital, and systematically build
                  multi-generational balance sheets.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-xs uppercase font-bold text-[#C9A84C]">
                  Core Specializations & Practice Verticals
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>NGX Fundamental Equity Valuation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Banking Sector Recapitalization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>SME Clean Energy Structuring (PaaS)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Executive Financial Modeling</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-3 pt-3">
                <a
                  href="https://youtube.com/@psa_investment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#C9A84C] hover:text-[#0A1F44] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <YoutubeIcon className="w-4 h-4" />
                  <span>PSA YouTube</span>
                </a>
                <a
                  href="https://x.com/salami_abdulslm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#C9A84C] hover:text-[#0A1F44] text-xs font-semibold flex items-center gap-1.5 transition-colors font-mono"
                >
                  <XIcon className="w-3.5 h-3.5" />
                  <span>@salami_abdulslm</span>
                </a>
                <a
                  href="https://www.instagram.com/salamiabdullahia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#C9A84C] hover:text-[#0A1F44] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Right Headshot Card */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-[#07152E]/90 rounded-3xl border border-slate-700 shadow-xl text-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-[#C9A84C] shadow-2xl bg-slate-900 border-2 border-slate-800">
                  <img
                    src="/salami-abdullahi.jpg"
                    alt="Salami Abdullahi - Founder, CEO, COO & Chief Analyst at PSA Investment"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0A1F44] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                  Verified Executive
                </div>
              </div>
              <div className="pt-2">
                <h4 className="font-serif font-black text-xl text-white">Salami Abdullahi</h4>
                <div className="text-xs text-[#C9A84C] font-semibold mt-0.5">Lagos, Nigeria</div>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">
                  Administrator UID: PSA-CEO001
                </div>
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed space-y-1.5 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Personal Direct (CEO):</span>
                  <a
                    href="mailto:salamiabdullahi257@gmail.com"
                    className="text-white hover:text-[#C9A84C] font-mono transition-colors block"
                  >
                    salamiabdullahi257@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">PSA Official Desk:</span>
                  <a
                    href="mailto:psainvestment.ng@gmail.com"
                    className="text-white hover:text-[#C9A84C] font-mono transition-colors block"
                  >
                    psainvestment.ng@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Direct Line:</span>
                  <a
                    href="tel:+2347068371292"
                    className="text-[#C9A84C] hover:underline font-mono font-semibold"
                  >
                    +234 706 837 1292
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Our Guiding Creed
          </span>
          <h2 className="font-serif font-black text-3xl text-[#0A1F44]">Three Unyielding Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif font-black text-xl text-[#0A1F44]">
              1. Zero Compromise Independence
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We accept no brokerage kickbacks or paid corporate promotion. When an equity is
              overvalued or presents structural hazards, we declare an Underweight or Sell stance
              without hesitation.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif font-black text-xl text-[#0A1F44]">2. Empirical Rigor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every target price is grounded in empirical cash flow models, historical earnings
              cycles, and realistic cost of equity calculations tailored to Nigerian market
              dynamics.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif font-black text-xl text-[#0A1F44]">
              3. Fiduciary Transparency
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Whether advising mid-market enterprises on solar installations or steering members
              through market consolidations, our allegiance remains solely with the long-term wealth
              of our clients.
            </p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={() => onOpenAuthModal('signup')}
            className="px-8 py-3.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-102 inline-flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Join the PSA Analyst Circle
          </button>
        </div>
      </section>
    </div>
  );
};
