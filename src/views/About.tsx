import React from 'react';
import {
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  LineChart,
  ExternalLink,
  Mail,
  Phone,
  FileSpreadsheet,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ViewTab } from '../types';
import { useData } from '../context/DataContext';
import { YoutubeIcon, InstagramIcon, XIcon } from '../components/BrandIcons';

interface AboutProps {
  setActiveTab: (tab: ViewTab) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const About: React.FC<AboutProps> = ({ setActiveTab, onOpenAuthModal }) => {
  const { siteSettings, staffMembers } = useData();

  const mission = siteSettings?.missionStatement || 'To democratize institutional-grade equity valuation, debunk speculative rumors in Nigerian capital markets, and provide actionable financial intelligence that outpaces inflation and currency volatility.';
  const vision = siteSettings?.visionStatement || "To stand as West Africa's foremost independent equity research authority, recognized internationally for analytical purity, innovative SME capital advisory, and transformative investor education.";
  const pillars = siteSettings?.pillars || [];
  const management = siteSettings?.managementTeam || [];
  const models = siteSettings?.financialModels || [];

  const featuredStaff = (staffMembers || []).filter(
    s => s.showOnAboutPage && s.id !== 'staff-ceo-001' && s.email !== 'salamiabdullahi257@gmail.com'
  );

  const getStaffRoleBadge = (role: string) => {
    switch (role) {
      case 'management':
        return { label: 'Executive Management', className: 'bg-purple-50 text-purple-900 border-purple-200' };
      case 'social_media_director':
        return { label: 'Social Media & Communications', className: 'bg-rose-50 text-rose-900 border-rose-200' };
      case 'analyst':
        return { label: 'Equity Research Analyst', className: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
      case 'partners':
        return { label: 'Strategic Partner', className: 'bg-amber-50 text-amber-900 border-amber-200' };
      default:
        return { label: 'Executive Staff', className: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            About PSA Investment (PSAI)
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#0A1F44] tracking-tight max-w-3xl mx-auto">
            Institutional Discipline. Grassroots Conviction.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Pioneering independent equity intelligence on the Nigerian Exchange (NGX) to help
            ambitious individuals and institutions build generational wealth.
          </p>

          {/* Medium Publication Deep Link */}
          {siteSettings?.mediumBlogUrl && (
            <div className="pt-2">
              <a
                href={siteSettings.mediumBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#0A1F44] text-white text-xs font-bold shadow-sm transition-all hover:scale-102"
              >
                <span>Read Chief Analyst Research on Medium</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C9A84C]" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* INSTITUTIONAL E-E-A-T & NIGERIAN ENTITY VERIFICATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0A1F44] to-[#07152E] rounded-3xl p-6 sm:p-10 border border-[#C9A84C]/50 text-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C9A84C]">
                  Official E-E-A-T Entity Verification
                </span>
              </div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-white">
                PSA Investment (PSAI) - Nigerian Capital Markets Authority
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Verified Domestic Operation
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10 font-mono">
                Lagos, Nigeria
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="font-bold text-[#C9A84C] text-sm block">1. Operational Mandate</span>
              <p>
                <strong>PSA Investment (PSAI)</strong> operates exclusively within Nigerian capital markets, the Nigerian Exchange (NGX), and West African emerging sovereign instruments. It provides independent fundamental equity research, recapitalization diagnostics, and SME financial structuring.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="font-bold text-[#C9A84C] text-sm block">2. Entity Disambiguation</span>
              <p>
                PSA Investment is an independent Nigerian institution headquartered in Lagos, Nigeria. It is distinct from and completely unaffiliated with foreign sovereign wealth funds, international logistics firms, or overseas namesakes. All intelligence is produced under local regulatory context.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="font-bold text-[#C9A84C] text-sm block">3. Research Independence</span>
              <p>
                Our valuation models, pre-market briefings, and equity dossiers are published free from sell-side broker conflicts, trading commissions, or issuer-paid bias. Every recommendation adheres to discounted cash flow (DCF) and Gordon Growth equity principles.
              </p>
            </div>
          </div>
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
            <p className="text-slate-600 text-sm leading-relaxed">{mission}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A84C] text-[#0A1F44] flex items-center justify-center">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="font-serif font-black text-2xl text-[#0A1F44]">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{vision}</p>
          </div>
        </div>
      </section>

      {/* Leadership & Management Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Executive Governance
          </span>
          <h2 className="font-serif font-black text-3xl text-[#0A1F44]">
            Leadership & Management Team
          </h2>
          <p className="text-xs text-slate-500">
            Directed by seasoned analysts with deep technical expertise in Nigerian banking, equities, and sovereign debt.
          </p>
        </div>

        <div className="space-y-8">
          {management.map((member) => (
            <div
              key={member.id}
              className="bg-[#0A1F44] bg-gradient-to-br from-[#0A1F44] via-[#0B1C3D] to-[#07152E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Bio Details */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                        Founder & Chief Analyst
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/40">
                        ABU First-Class Honours
                      </span>
                    </div>

                    <h2 className="font-serif font-black text-3xl sm:text-4xl text-white">
                      Salami Abdullahi Adaviruku (Salami Abdullahi A.)
                    </h2>

                    <div className="text-sm font-semibold text-[#C9A84C]">
                      Founder, Chief Operating Officer & Lead Equity Research Analyst
                    </div>

                    {/* Academic & Professional Credentials Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10 font-semibold">
                        🎓 First-Class Honours in Banking & Finance - Ahmadu Bello University (ABU), Zaria
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10 font-semibold">
                        📊 IBM Data Analyst Certified
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[#C9A84C] border border-[#C9A84C]/30 font-semibold">
                        📈 FMVA Candidate (Financial Modeling & Valuation)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    <p>{member.bio}</p>
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
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    {member.socialLinks?.youtube && (
                      <a
                        href={member.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#C9A84C] hover:text-[#0A1F44] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <YoutubeIcon className="w-4 h-4" />
                        <span>PSA YouTube</span>
                      </a>
                    )}
                    {member.socialLinks?.twitter && (
                      <a
                        href={member.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#C9A84C] hover:text-[#0A1F44] text-xs font-semibold flex items-center gap-1.5 transition-colors font-mono"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                        <span>Twitter / X</span>
                      </a>
                    )}
                    {member.socialLinks?.instagram && (
                      <a
                        href={member.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#C9A84C] hover:text-[#0A1F44] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <InstagramIcon className="w-4 h-4" />
                        <span>Instagram</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Headshot Card */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-[#07152E]/90 rounded-3xl border border-slate-700 shadow-xl text-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-[#C9A84C] shadow-2xl bg-slate-900 border-2 border-slate-800">
                      <img
                        src={member.photoUrl || siteSettings?.ceoPhotoUrl || '/salami-abdullahi.jpg'}
                        alt={`${member.fullName} - ${member.roleTitle}`}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0A1F44] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      Verified Executive
                    </div>
                  </div>
                  <div className="pt-2">
                    <h4 className="font-serif font-black text-xl text-white">{member.fullName}</h4>
                    <div className="text-xs text-[#C9A84C] font-semibold mt-0.5">Lagos, Nigeria</div>
                    <div className="text-[11px] text-slate-400 mt-2 font-mono">
                      Administrator UID: PSA-CEO001
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed space-y-1.5 pt-1 text-left w-full">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Personal Direct:</span>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-white hover:text-[#C9A84C] font-mono transition-colors block truncate"
                      >
                        {member.email}
                      </a>
                    </div>
                    {member.phone && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Direct Line:</span>
                        <a
                          href={`tel:${member.phone.replace(/\s+/g, '')}`}
                          className="text-[#C9A84C] hover:underline font-mono font-semibold"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">PSA Official Desk:</span>
                      <a
                        href={`mailto:${siteSettings?.officialEmail || 'psainvestment.ng@gmail.com'}`}
                        className="text-slate-300 hover:text-[#C9A84C] font-mono transition-colors block truncate"
                      >
                        {siteSettings?.officialEmail || 'psainvestment.ng@gmail.com'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Staff Members (Smaller Cards Section) */}
        {featuredStaff.length > 0 && (
          <div className="pt-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                Executive Directorate & Analytical Desk
              </span>
              <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#0A1F44]">
                Research, Operations & Advisory Team
              </h3>
              <p className="text-xs text-slate-500">
                The multidisciplinary team executing quantitative equity research, media communications, operational excellence, and institutional capital alliances.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStaff.map(staff => {
                const roleBadge = getStaffRoleBadge(staff.role);

                return (
                  <div
                    key={staff.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-[#C9A84C]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Top Row: Headshot + Role Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-[#C9A84C]/50 shadow-md bg-slate-900 border border-slate-200 shrink-0">
                            {staff.avatarUrl ? (
                              <img
                                src={staff.avatarUrl}
                                alt={staff.fullName}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                onError={e => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-[#0A1F44] text-[#C9A84C] font-serif font-black text-xl flex items-center justify-center">
                                {staff.fullName
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                            )}
                          </div>
                          <span
                            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                            title="Active Verified Staff"
                          />
                        </div>

                        <div className="text-right flex flex-col items-end gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${roleBadge.className}`}
                          >
                            {roleBadge.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {staff.department}
                          </span>
                        </div>
                      </div>

                      {/* Name & Title */}
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-lg text-[#0A1F44] group-hover:text-[#C9A84C] transition-colors">
                          {staff.fullName}
                        </h4>
                        <div className="text-xs font-semibold text-slate-600">
                          {staff.title}
                        </div>
                      </div>

                      {/* Brief Write-up / Bio */}
                      <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100 line-clamp-4">
                        {staff.bio ||
                          staff.notes ||
                          'Key team member executing institutional operations and research advisory.'}
                      </p>

                      {/* Key Permissions / Specializations */}
                      {staff.permissions && staff.permissions.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1">
                          {staff.permissions.slice(0, 2).map((perm, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-600 font-medium"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Contact */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <a
                        href={`mailto:${staff.email}`}
                        className="text-slate-600 hover:text-[#0A1F44] font-mono text-[11px] inline-flex items-center gap-1.5 truncate max-w-[170px]"
                        title={staff.email}
                      >
                        <Mail className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                        <span className="truncate">{staff.email}</span>
                      </a>
                      {staff.phone && (
                        <a
                          href={`tel:${staff.phone.replace(/\s+/g, '')}`}
                          className="text-[#0A1F44] hover:text-[#C9A84C] font-mono text-[11px] font-semibold inline-flex items-center gap-1 shrink-0"
                          title={staff.phone}
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
          {pillars.map((pillar) => (
            <div key={pillar.id} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A1F44] text-[#C9A84C] font-mono font-black flex items-center justify-center text-sm shadow-xs">
                {pillar.number}
              </div>
              <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Proprietary Financial Models Showcase */}
      {models.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              Institutional Infrastructure
            </span>
            <h2 className="font-serif font-black text-3xl text-[#0A1F44]">
              Proprietary Valuation Models & Engines
            </h2>
            <p className="text-xs text-slate-500">
              Battle-tested models calibrated specifically to address inflation, foreign exchange volatility, and sovereign debt spreads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model) => (
              <div
                key={model.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {model.category}
                    </span>
                    {model.accessLevel === 'premium' ? (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Analyst Circle
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Public Model
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#0A1F44]">{model.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{model.description}</p>
                  
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Key Analytical Outputs:
                    </div>
                    {model.keyOutputs.map((out, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                        <span>{out}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab('events')}
                    className="w-full py-2 bg-slate-100 hover:bg-[#0A1F44] hover:text-[#C9A84C] text-[#0A1F44] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Master this in FMVA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1F44] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl border border-slate-800">
          <h3 className="font-serif font-black text-2xl sm:text-3xl text-white max-w-xl mx-auto">
            Ready to Build Multi-Generational Wealth on the Nigerian Exchange?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Join the PSA Analyst Circle today to gain unhindered access to institutional research, weekly valuation notes, and direct advisory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="px-8 py-3.5 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-black text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-102 inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Join the Analyst Circle
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              Nov 28 FMVA Masterclass &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
