import React from 'react';
import { Shield, Lock, FileText, CheckCircle2, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigate?: (tab: string) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Statutory Compliance: NDPA 2023</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#0A1F44]">
          Privacy Policy & Data Protection Charter
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Effective Date: November 27, 2026 | Last Updated: November 2026
        </p>
      </div>

      {/* Overview Card */}
      <div className="p-6 bg-[#0A1F44] text-white rounded-3xl space-y-3 border-l-4 border-[#C9A84C] shadow-lg">
        <h2 className="font-serif font-bold text-lg text-[#C9A84C]">
          Commitment to Data Privacy (Nigeria Data Protection Act 2023)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          PSA Investment (PSAI) and its Founder &amp; Chief Analyst Salami Abdullahi are committed to safeguarding the personal data of our members, research subscribers, executive masterclass attendees, and site visitors in strict accordance with the Nigeria Data Protection Act 2023 (NDPA 2023) and global data protection standards.
        </p>
      </div>

      {/* Section 1: Data Controller Identification */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#C9A84C]" />
          <span>1. Data Controller Identification</span>
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 text-sm text-slate-700">
          <p>
            The Data Controller responsible for your personal information is:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Legal Entity:</strong> PSA Investment (PSAI)</li>
            <li><strong>Founder &amp; Chief Analyst:</strong> Salami Abdullahi A.</li>
            <li><strong>Operating Hubs:</strong> Lagos and Abuja, Nigeria</li>
            <li><strong>Official Contact Email:</strong> psainvestment.ng@gmail.com</li>
            <li><strong>Supervisory Authority:</strong> Nigeria Data Protection Commission (NDPC)</li>
          </ul>
        </div>
      </section>

      {/* Section 2: Personal Data We Collect */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44]">
          2. Personal Data We Collect
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
              A. Information You Provide Directly
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>• Full legal name and executive job title</li>
              <li>• Official email address and contact telephone number</li>
              <li>• Institutional firm, corporate entity, or fund affiliation</li>
              <li>• Executive event registrations (e.g. FMVA Masterclasses)</li>
              <li>• Analyst Circle membership applications and financial interests</li>
            </ul>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0A1F44]">
              B. Automated Technical &amp; Usage Data
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>• Browser type, operating system, and screen viewport</li>
              <li>• IP address and general geographic locality (Nigeria)</li>
              <li>• Reading timestamps for daily pre-market intelligence</li>
              <li>• Cryptographic session tokens and authentication state</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Lawful Basis of Processing */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44]">
          3. Lawful Basis for Processing (NDPA Section 25)
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-sm text-slate-700">
          <p>Under Section 25 of the NDPA 2023, we process personal data only when an authorized lawful basis exists:</p>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div><strong>Consent:</strong> When you voluntarily register for the Analyst Circle, subscribe to daily market notifications, or register for executive training events.</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div><strong>Contractual Performance:</strong> To deliver proprietary research dossiers, financial models, and course materials you have requested.</div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div><strong>Legitimate Interests:</strong> To prevent unauthorized access, mitigate brute-force cyber threats, enforce role-based access governance, and improve research readability.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Data Security Safeguards */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#C9A84C]" />
          <span>4. Technical &amp; Organizational Security Safeguards</span>
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>We deploy robust technical measures to defend data against unauthorized access, loss, alteration, or disclosure:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cryptographic Salting &amp; Hashing:</strong> User credentials are protected using salted SHA-256 cryptographic hashes; plaintext passwords are never stored.</li>
            <li><strong>Transport Layer Security:</strong> All data in transit is encrypted using modern TLS 1.3 / HTTPS encryption with Strict-Transport-Security (HSTS).</li>
            <li><strong>Row-Level Security (RLS):</strong> Cloud PostgreSQL databases enforce row-level security policies restricting table access by authenticated roles.</li>
            <li><strong>Content Security Policy:</strong> Strict HTTP headers block unauthorized script execution and cross-site injection vectors.</li>
          </ul>
        </div>
      </section>

      {/* Section 5: Your Statutory Data Subject Rights */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44]">
          5. Your Statutory Data Subject Rights (NDPA Sections 34-39)
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
          <p>As a data subject in Nigeria, you possess fundamental enforceable rights under the NDPA 2023:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong>Right to Access:</strong> Request confirmation and copies of personal data held about you.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong>Right to Rectification:</strong> Request prompt correction of inaccurate or incomplete records.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong>Right to Erasure:</strong> Request permanent deletion of data when no longer legally required.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong>Right to Object:</strong> Object at any time to marketing dispatches or processing on legitimate interest grounds.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong>Right to Restrict:</strong> Request freezing of data processing under contested accuracy conditions.
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong>Right to Portability:</strong> Obtain your profile and event records in a machine-readable format.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 6: Data Retention & Deletion */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44]">
          6. Retention Period &amp; Disposal
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
          <p>
            Personal data is retained only for as long as is necessary to fulfill the research advisory purposes for which it was collected, or to comply with statutory audit and financial reporting requirements. When data is no longer necessary, it is permanently purged using secure deletion procedures.
          </p>
        </div>
      </section>

      {/* Section 7: Data Protection Officer Contact */}
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-xl text-[#0A1F44]">
          7. Data Protection Officer (DPO) Contact
        </h2>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700">
          <p>
            To exercise any of your data rights, lodge an inquiry, or report a suspected data grievance, contact our designated privacy desk:
          </p>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C9A84C]" />
              <span>Desk: psainvestment.ng@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C9A84C]" />
              <span>Founder / CEO: salamiabdullahi257@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C9A84C]" />
              <span>Telephone: +234 706 837 1295</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C9A84C]" />
              <span>Jurisdiction: Lagos and Abuja, Federal Republic of Nigeria</span>
            </div>
          </div>
          <p className="pt-2 text-[11px] text-slate-500 border-t border-slate-200">
            If you believe your data protection rights have not been adequately addressed, you maintain the right to lodge a complaint directly with the Nigeria Data Protection Commission (NDPC) at <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="text-[#0A1F44] underline font-bold">ndpc.gov.ng</a>.
          </p>
        </div>
      </section>
    </div>
  );
};
