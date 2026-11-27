import React from 'react';
import { Scale, AlertTriangle, ShieldCheck, FileCheck, ArrowLeft, Mail, Phone } from 'lucide-react';

interface TermsOfServiceProps {
  onNavigate?: (tab: string) => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans text-slate-800">
      {onNavigate && (
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      )}

      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold border border-amber-200">
          <Scale className="w-3.5 h-3.5 text-amber-700" />
          <span>Statutory Terms of Use &amp; Regulatory Disclosures</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#0A1F44]">
          Terms of Service &amp; Investment Research Charter
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Effective Date: November 27, 2026 | Last Updated: November 2026
        </p>
      </div>

      {/* Section 1: Non-Broker / Non-Advisory Regulatory Disclosure */}
      <div className="p-6 bg-[#0A1F44] text-white rounded-3xl space-y-4 border-l-4 border-[#C9A84C] shadow-lg">
        <div className="flex items-center gap-2 text-[#C9A84C] font-serif font-bold text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Statutory Regulatory Disclosure: SEC Nigeria Compliance</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          PSA Investment (PSAI) is an independent financial media publisher, equity intelligence research desk, and capital education provider directed by Founder &amp; Chief Analyst Salami Abdullahi.
        </p>
        <div className="p-4 bg-[#07152F] rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-2">
          <p>
            <strong>IMPORTANT REGULATORY NOTICE:</strong> PSA Investment is NOT a registered broker-dealer, investment adviser, issuing house, or asset management firm registered with the Securities and Exchange Commission (SEC Nigeria) under the Investments and Securities Act (ISA 2007).
          </p>
          <p>
            Nothing published on this website, in the daily PSA Financial Chronicle, in monthly equity research dossiers, or in executive masterclasses constitutes personalized investment advice, a formal financial recommendation, an endorsement to purchase or sell securities, or an offer of investment advisory services under Nigerian securities law.
          </p>
        </div>
      </div>

      {/* Section 2: Intellectual Property Rights */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C9A84C]" />
          <span>1. Intellectual Property &amp; Content Licensing</span>
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            All valuation dossiers, Discounted Cash Flow (DCF) spreadsheets, daily financial chronicles, editorial articles, brand logos, and proprietary formulas published on psainvestment.com are the exclusive intellectual property of PSA Investment and Salami Abdullahi.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Permitted Use:</strong> Members and visitors are granted a limited, revocable, non-transferable license to access, view, and read research dispatches for personal analytical or corporate reference.</li>
            <li><strong>Prohibited Actions:</strong> You may not commercially redistribute, scrape, reverse-engineer, resell, or republish complete research dossiers, financial models, or subscriber materials without explicit written authorization from the Chief Analyst.</li>
            <li><strong>Attribution:</strong> Fair citation of excerpted market figures requires clear attribution to "PSA Investment (psainvestment.com)".</li>
          </ul>
        </div>
      </section>

      {/* Section 3: Market Risk & No-Warranty Disclaimer */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44]">
          2. Capital Market Risk &amp; Valuation Limitations
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
          <p>
            Trading and investing in equities on the Nigerian Exchange (NGX), commercial papers, and fixed-income assets carry inherent risk of capital loss:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Past Performance:</strong> Historical share price appreciation, dividend yield consistency, or banking recapitalization metrics are not guarantees of future investment performance.</li>
            <li><strong>Valuation Assumptions:</strong> Valuation target prices, Discounted Cash Flow models, and projected upside calculations are based on macroeconomic assumptions (interest rates, inflation, foreign exchange rates) that are subject to rapid change.</li>
            <li><strong>Due Diligence Requirement:</strong> Investors must perform independent due diligence and consult a licensed capital market operator (stockbroker or investment adviser) registered with SEC Nigeria before making capital commitments.</li>
          </ul>
        </div>
      </section>

      {/* Section 4: Analyst Circle Governance */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44] flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#C9A84C]" />
          <span>3. Analyst Circle Membership Governance</span>
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
          <p>
            Admission to the PSA Analyst Circle is subject to administrative review. PSA Investment reserves the right to suspend or revoke membership access if a user attempts unauthorized credential sharing, automated scraping, or abuses platform communications.
          </p>
        </div>
      </section>

      {/* Section 5: Governing Law & Dispute Resolution */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44]">
          4. Governing Law &amp; Jurisdiction
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any legal disputes arising in connection with the use of psainvestment.com shall be resolved through good-faith negotiation, and if unresolved, through the competent courts located in Lagos State, Nigeria.
          </p>
        </div>
      </section>

      {/* Section 6: Contact Information */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44]">
          5. Legal &amp; Compliance Inquiries
        </h2>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
          <p>For questions regarding these terms, corporate licensing, or institutional syndication, contact:</p>
          <div className="space-y-1 font-mono text-xs pt-1">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C9A84C]" />
              <span>Desk: psainvestment.ng@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C9A84C]" />
              <span>Phone: +234 706 837 1292</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
