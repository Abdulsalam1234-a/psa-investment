import React from 'react';
import {
  LineChart,
  Mail,
  Phone,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { ViewTab } from '../types';
import { YoutubeIcon, InstagramIcon, WhatsAppIcon, XIcon } from './BrandIcons';

interface FooterProps {
  setActiveTab: (tab: ViewTab) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAuthModal }) => {
  return (
    <footer className="bg-[#0A1F44] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1 & 2: Brand & Leadership */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C] text-[#0A1F44] flex items-center justify-center font-bold shadow-md">
                <LineChart className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="font-serif font-black text-xl text-white tracking-tight">
                PSA <span className="text-[#C9A84C]">INVESTMENT</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Building Wealth Through Intelligent Investments. Independent equity research,
              NGX-listed company valuation, and corporate capital advisory.
            </p>

            <div className="pt-2">
              <div className="text-xs uppercase tracking-wider font-bold text-[#C9A84C] mb-1">
                Executive Leadership
              </div>
              <div className="text-sm font-semibold text-white">Salami Abdullahi</div>
              <div className="text-xs text-slate-400">Founder, CEO, COO, and Chief Analyst</div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://youtube.com/@psa_investment"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-[#C9A84C] hover:text-[#0A1F44] flex items-center justify-center text-slate-300 transition-all cursor-pointer"
                title="PSA Investment YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb7oZ03D38CbwP1M8f0R"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-[#C9A84C] hover:text-[#0A1F44] flex items-center justify-center text-slate-300 transition-all cursor-pointer"
                title="WhatsApp Broadcast"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/salami_abdulslm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-[#C9A84C] hover:text-[#0A1F44] flex items-center justify-center text-slate-300 transition-all cursor-pointer"
                title="X (Twitter) Profile"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/salamiabdullahia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-[#C9A84C] hover:text-[#0A1F44] flex items-center justify-center text-slate-300 transition-all cursor-pointer"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://vm.tiktok.com/ZS9DNRkLa8gFE-pHYZL/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-[#C9A84C] hover:text-[#0A1F44] flex items-center justify-center text-slate-300 transition-all cursor-pointer"
                title="TikTok"
              >
                <span className="text-xs font-bold font-mono">TT</span>
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us & Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Advisory Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('research');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Equity Research
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('videos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  PSA Lens Videos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('analyst-circle');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  PSA Analyst Circle
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Advisory Practice */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Practice Areas</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>NGX Banking Recapitalization</li>
              <li>Institutional DCF Valuation</li>
              <li>Dividend Sustainability Models</li>
              <li>Commercial Solar PaaS</li>
              <li>Real Estate Cashflow Analysis</li>
              <li>Executive 3-Statement Modeling</li>
            </ul>
          </div>

          {/* Col 5: Desk Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Advisory Desk</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <span>Lagos, Nigeria (Primary Capital Operations)</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div>
                    <span className="text-[10px] text-[#C9A84C] uppercase font-bold block">Desk</span>
                    <a
                      href="mailto:psainvestment.ng@gmail.com"
                      className="hover:text-white font-mono transition-colors"
                    >
                      psainvestment.ng@gmail.com
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Founder / CEO</span>
                    <a
                      href="mailto:salamiabdullahi257@gmail.com"
                      className="hover:text-white font-mono transition-colors text-slate-300"
                    >
                      salamiabdullahi257@gmail.com
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <a
                  href="tel:+2347068371292"
                  className="hover:text-white font-mono transition-colors text-xs"
                >
                  +234 706 837 1292
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="w-full py-2 bg-[#C9A84C] hover:bg-[#B8973D] text-[#0A1F44] font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Apply to Analyst Circle
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> Research dispatches, valuation models,
            and commentaries published by PSA Investment and Salami Abdullahi are prepared strictly for
            independent financial intelligence and educational reference. They do not constitute personalized
            investment advice. Historical performance is not indicative of future returns on the Nigerian Exchange.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <div>© 2026 PSA Investment. All rights reserved.</div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Lagos • Abuja • London</span>
              <span>•</span>
              <span className="text-[#C9A84C]">Institutional Independence</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
