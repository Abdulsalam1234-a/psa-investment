import React, { useState } from 'react';
import {
  ShieldCheck,
  FileSpreadsheet,
  Calendar,
  Layers,
  FileText,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2
} from 'lucide-react';
import { ViewTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface AnalystCircleProps {
  setActiveTab: (tab: ViewTab) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const AnalystCircle: React.FC<AnalystCircleProps> = ({
  setActiveTab,
  onOpenAuthModal
}) => {
  const { currentUser, memberProfile } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const benefits = [
    {
      icon: <FileSpreadsheet className="w-6 h-6 text-[#C9A84C]" />,
      title: 'Confidential DCF Valuation Spreadsheets',
      desc: 'Complete operating financial models in Excel, dynamic revenue builds, debt service schedules, and WACC calculations.'
    },
    {
      icon: <Calendar className="w-6 h-6 text-[#C9A84C]" />,
      title: 'Quarterly Dividend Sustainability Calendars',
      desc: 'Predictive modeling of qualification dates, cash conversion cycles, and yield forecasts for all high-payout NGX listings.'
    },
    {
      icon: <Layers className="w-6 h-6 text-[#C9A84C]" />,
      title: 'Deepwater Energy & Banking Recap Trackers',
      desc: 'Priority access to sector-wide recapitalization metrics, rights issue pricing sensitivity, and offshore oil/gas developments.'
    },
    {
      icon: <FileText className="w-6 h-6 text-[#C9A84C]" />,
      title: 'Audit-Logged Research Library',
      desc: 'Unlimited PDF downloads of institutional investment memos stamped with personal member credentials.'
    },
    {
      icon: <Users className="w-6 h-6 text-[#C9A84C]" />,
      title: 'Unique Member Referral Recognition',
      desc: 'Receive your own generated referral code to invite fellow capital market participants, with visible tracking on your dashboard.'
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-[#C9A84C]" />,
      title: 'Direct Q&A Dispatches with Chief Analyst',
      desc: 'Submit technical inquiries regarding corporate restructuring, financial statements, and monetary policy directly to Salami Abdullahi.'
    }
  ];

  const faqs = [
    {
      q: 'Is there any fee to apply for the PSA Analyst Circle?',
      a: 'No. Membership is currently free to apply. Admission is strictly curated and approved by the Chief Analyst based on application profile and capital market intent.'
    },
    {
      q: 'How long does the application review process take?',
      a: 'Applications are typically reviewed within 24 to 48 business hours. You will receive an automated confirmation email upon submission, followed by an official approval notification once active.'
    },
    {
      q: 'What happens if I try to log in while my application is pending?',
      a: 'You will see a secure pending approval screen that confirms receipt of your application. Once the administrator approves your profile, your member dashboard unlocks automatically.'
    },
    {
      q: 'How does the referral code mechanism operate?',
      a: 'Every member is assigned a unique tracking identifier (e.g. PSA-CHI882). When colleagues register using your referral link or enter your code, your dashboard tracks total successful admissions.'
    },
    {
      q: 'Will there be paid tiers in the future?',
      a: 'Our data architecture already supports multi-tier expansion (Standard, Executive, and Institutional). Future premium enterprise add-ons or Paystack integrations will seamlessly map onto existing member accounts.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#0A1F44] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            Gated Institutional Intelligence Portal
          </div>

          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#0A1F44] tracking-tight max-w-3xl mx-auto">
            The Inner Circle of Disciplined Nigerian Equity Investors.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Gain unrestricted access to proprietary discounted cash flow models, downloadable equity
            valuation memos, and executive market intelligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {currentUser && memberProfile?.status === 'active' ? (
              <button
                onClick={() => {
                  setActiveTab('member-portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-102 flex items-center gap-2"
              >
                <span>Go to My Member Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuthModal('signup')}
                  className="px-7 py-3.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-102 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Request Membership Access</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-7 py-3.5 bg-white hover:bg-slate-50 text-[#0A1F44] font-bold text-xs rounded-xl border border-slate-200 shadow-xs cursor-pointer transition-all"
                >
                  Member Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Model Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              Membership Model
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#0A1F44]">
              Free Application. Admin-Approved Cohort.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We prioritize analytical substance and community caliber over automated subscription
              volume. Every member profile is vetted by our Chief Analyst before vault access is
              granted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs">
                  {b.icon}
                </div>
                <h3 className="font-bold text-base text-[#0A1F44]">{b.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Incentive Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1F44] bg-gradient-to-br from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Referral Incentive & Recognition
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
                Expand the Circle and Earn Priority Intelligence Access
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Upon approval, each member receives a permanent referral code (e.g.{' '}
                <span className="font-mono text-[#C9A84C] font-bold">PSA-CHI882</span>). Members
                with top referral records receive featured recognition, early previews of unreleased
                valuation notes, and direct roundtables with Salami Abdullahi.
              </p>
            </div>

            <div className="lg:col-span-4 p-6 bg-[#07152E] rounded-2xl border border-slate-700 text-center space-y-3 shadow-lg">
              <div className="text-xs text-[#C9A84C] font-semibold">Sample Member Referral Link</div>
              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-[#C9A84C] font-bold truncate border border-slate-800">
                psainvestment.com.ng/?ref=PSA-DEMO77
              </div>
              <div className="text-[11px] text-slate-300">
                Pre-fills referral code for new applicants automatically.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Got Questions?
          </span>
          <h2 className="font-serif font-black text-3xl text-[#0A1F44]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about the Analyst Circle admission and security model.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-[#0A1F44] flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#C9A84C] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 space-y-4">
          <h3 className="font-serif font-black text-2xl text-[#0A1F44]">
            Ready to Deepen Your Market Edge?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Take 60 seconds to submit your application for the upcoming quarterly intake cohort.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="px-8 py-3.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-102 inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Submit Membership Application
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
