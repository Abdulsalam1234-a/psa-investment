import React from 'react';
import {
  LineChart,
  PieChart,
  SunMedium,
  Building2,
  GraduationCap,
  Video,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { ViewTab } from '../types';
import { useData } from '../context/DataContext';

interface ServicesProps {
  setActiveTab: (tab: ViewTab) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const Services: React.FC<ServicesProps> = ({ setActiveTab, onOpenAuthModal }) => {
  const { services } = useData();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'LineChart':
        return <LineChart className="w-7 h-7 text-[#C9A84C]" />;
      case 'PieChart':
        return <PieChart className="w-7 h-7 text-[#C9A84C]" />;
      case 'SunMedium':
        return <SunMedium className="w-7 h-7 text-[#C9A84C]" />;
      case 'Building2':
        return <Building2 className="w-7 h-7 text-[#C9A84C]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-7 h-7 text-[#C9A84C]" />;
      case 'Video':
        return <Video className="w-7 h-7 text-[#C9A84C]" />;
      default:
        return <Sparkles className="w-7 h-7 text-[#C9A84C]" />;
    }
  };

  const getTurnaround = (id: string) => {
    switch (id) {
      case 'research-advisory':
        return 'Continuous Coverage & Weekly Valuation Notes';
      case 'portfolio-management':
        return 'Quarterly Review & Continuous Downside Monitoring';
      case 'sme-solar-paas':
        return 'Technical Audit to Commissioning: 6 to 10 Weeks';
      case 'real-estate':
        return 'Due Diligence & Title Verification: 10 to 14 Days';
      case 'financial-modeling':
        return '4-Week Intensive Cohort or 2-Day Executive Bootcamp';
      case 'psa-lens':
        return 'Bi-Weekly YouTube & Social Dispatches';
      default:
        return 'Tailored Engagement Timeline';
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Advisory Capabilities
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#0A1F44] tracking-tight max-w-3xl mx-auto">
            Institutional Advisory Tailored for Nigerian Capital Markets
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Delivering quantitative precision, alternative asset origination, clean energy transition,
            and executive financial education.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {services.map((svc, idx) => (
          <div
            key={svc.id}
            id={svc.slug}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Icon and Title */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A1F44] flex items-center justify-center shadow-md">
                    {getServiceIcon(svc.icon)}
                  </div>
                  <span className="text-xs font-bold font-mono text-[#C9A84C] uppercase tracking-wider">
                    Service Offering 0{idx + 1}
                  </span>
                </div>

                <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#0A1F44]">
                  {svc.title}
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                  {svc.shortDescription}
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>{getTurnaround(svc.id)}</span>
                </div>
              </div>

              {/* Right Column: Full description and highlights */}
              <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
                <p className="text-slate-700 text-sm leading-relaxed">{svc.fullDescription}</p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase font-bold text-[#0A1F44] tracking-wider">
                    Core Deliverables & Strategic Value:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {svc.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5 leading-snug"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Request Service Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Bottom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1F44] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h3 className="font-serif font-black text-2xl sm:text-3xl">
            Need a Bespoke Financial Advisory Mandate?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Schedule a confidential meeting with Salami Abdullahi to structure your commercial real
            estate underwriting, clean energy transition, or portfolio tilt.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-102"
            >
              Consult with Advisory Desk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
