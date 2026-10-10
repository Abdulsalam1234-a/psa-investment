import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  BellRing,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const Contact: React.FC = () => {
  const { services, submitContactForm, subscribeNewsletter } = useData();

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(services[0]?.title || 'Investment Research and Advisory');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Newsletter state
  const [newsEmail, setNewsEmail] = useState('');
  const [newsName, setNewsName] = useState('');
  const [newsTopics, setNewsTopics] = useState<string[]>([
    'Weekly Research Notes',
    'Banking Recapitalization'
  ]);
  const [newsSubmitting, setNewsSubmitting] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);

  const availableTopics = [
    'Weekly Research Notes',
    'Banking Recapitalization',
    'Energy & Oil Gas',
    'Dividend Analysis'
  ];

  const toggleTopic = (topic: string) => {
    setNewsTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactForm({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        service,
        subject: subject.trim(),
        message: message.trim()
      });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting form.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail.trim() || !newsEmail.includes('@')) return;

    setNewsSubmitting(true);
    try {
      await subscribeNewsletter(newsEmail, newsName, newsTopics, 'contact_page');
      setNewsSuccess(true);
    } finally {
      setNewsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Advisory Desk
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-[#0A1F44] tracking-tight max-w-3xl mx-auto">
            Consult with PSA Investment
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Whether seeking bespoke institutional research, portfolio guidance, or clean energy SME
            structuring, our desk is prepared to engage.
          </p>
        </div>
      </section>

      {/* Main Grid: Direct Channels & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-[#0A1F44] to-[#122A5E] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                  Direct Channels
                </span>
                <h3 className="font-serif font-black text-2xl text-white">Direct Communication</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect directly through our broadcast channels or coordinate a meeting with our
                  research desk.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* WhatsApp Channel */}
                <a
                  href="https://whatsapp.com/channel/0029Vb7oZ03D38CbwP1M8f0R"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-slate-800/80 hover:bg-[#C9A84C] group transition-all flex items-center justify-between cursor-pointer border border-slate-700/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-[#0A1F44] group-hover:text-[#C9A84C] flex items-center justify-center font-bold font-mono">
                      WA
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#0A1F44]">
                        WhatsApp Broadcast Channel
                      </div>
                      <div className="text-[11px] text-slate-300 group-hover:text-[#0A1F44]/80">
                        Fast market updates and announcements
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0A1F44]" />
                </a>

                {/* Email */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 text-[#C9A84C] flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Direct Email</div>
                    <a
                      href="mailto:salamiabdullahi257@gmail.com"
                      className="text-xs font-bold font-mono text-white hover:text-[#C9A84C] transition-colors"
                    >
                      salamiabdullahi257@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 text-[#C9A84C] flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Official Desk Line</div>
                    <div className="text-xs font-bold font-mono text-white">
                      +234 803 000 0000 / +234 800 000 0000
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 text-[#C9A84C] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Headquarters</div>
                    <div className="text-xs font-semibold text-white">
                      Lagos, Nigeria (Primary Capital Operations)
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Inquiries acknowledged within 24 business hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>All consultations held under strict commercial confidentiality</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Consultation Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif font-black text-2xl text-[#0A1F44]">
                  Send a Consultation Inquiry
                </h3>
                <p className="text-xs text-slate-500">
                  Please provide relevant context so our Chief Analyst can prepare an appropriate
                  preliminary review.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-lg text-emerald-950">Inquiry Successfully Received</h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you for contacting PSA Investment. Your submission has been securely logged
                    to our advisory database. Our team will review your message and respond promptly.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-3 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Babatunde Adeleke"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C] focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Corporate or Personal Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C] focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C] focus:bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Service of Primary Interest
                      </label>
                      <select
                        value={service}
                        onChange={e => setService(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C] focus:bg-white font-medium"
                      >
                        {services.map(s => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject / Mandate Scope *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Valuation advisory on commercial real estate portfolio"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C] focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Detailed Message & Context *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Provide background regarding your timeline, capital parameters, or specific NGX equities under consideration..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C] focus:bg-white font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-101 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Transmitting...' : 'Submit Consultation Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Broadcast Subscription Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80">
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#0A1F44] text-[#C9A84C] flex items-center justify-center mx-auto">
              <BellRing className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                Analyst Research Broadcasts
              </span>
              <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#0A1F44]">
                Stay Ahead of NGX Market Dispatches
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Subscribe to direct email broadcasts sent by Salami Abdullahi when new equity memos,
                dividend forecasts, or recapitalization updates are published.
              </p>
            </div>

            {newsSuccess ? (
              <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>You are successfully subscribed to research dispatches!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4 max-w-lg mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={newsName}
                    onChange={e => setNewsName(e.target.value)}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Delivery Email *"
                    value={newsEmail}
                    onChange={e => setNewsEmail(e.target.value)}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C9A84C]"
                  />
                </div>

                {/* Priority Research Topic Toggles */}
                <div className="space-y-2 text-left pt-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Select Your Priority Research Topics:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTopics.map(topic => {
                      const active = newsTopics.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleTopic(topic)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            active
                              ? 'bg-[#0A1F44] text-[#C9A84C]'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5" />}
                          <span>{topic}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={newsSubmitting}
                  className="w-full py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-101 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {newsSubmitting ? 'Registering...' : 'Join Research Broadcast Registry'}
                  </span>
                </button>
                <div className="text-[11px] text-slate-400">
                  Zero spam. You can adjust your broadcast frequency or unsubscribe at any time.
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
