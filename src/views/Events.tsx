import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
  BookOpen,
  Filter,
  Search,
  Check,
  UserCheck,
  Tag,
  ArrowRight,
  ArrowLeft,
  Copy,
  X,
  MessageCircle,
  AlertCircle,
  ExternalLink,
  Laptop,
  ShieldCheck,
  FileText,
  Mail
} from 'lucide-react';
import { EventProgram, EventCategory, EventRegistration, FormFieldDefinition } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

interface EventsProps {
  activeEventSlug?: string;
  onNavigateEvent?: (slug?: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'signup' | 'forgot_password') => void;
}

export const Events: React.FC<EventsProps> = ({
  activeEventSlug,
  onNavigateEvent,
  onOpenAuthModal
}) => {
  const { events, registerForEvent, getEventConfirmationEmail } = useData();
  const { currentUser, memberProfile } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventProgram | null>(null);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<EventProgram | null>(null);
  const [copyToast, setCopyToast] = useState<boolean>(false);

  // Registration Form State
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regOrg, setRegOrg] = useState<string>('');
  const [regTitle, setRegTitle] = useState<string>('');
  const [dynamicResponses, setDynamicResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [regSuccess, setRegSuccess] = useState<EventRegistration | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  // Check if viewing single event via unique URL
  const currentEvent = useMemo(() => {
    if (!activeEventSlug) return null;
    const cleanSlug = activeEventSlug.toLowerCase().trim();
    return (
      events.find(
        e => e.slug.toLowerCase() === cleanSlug || e.id.toLowerCase() === cleanSlug
      ) || null
    );
  }, [events, activeEventSlug]);

  // Dynamic Browser Page Title
  useEffect(() => {
    if (currentEvent) {
      document.title = `${currentEvent.title} | PSA Investment Academy`;
    } else {
      document.title = 'Executive Events & Masterclasses | PSA Investment';
    }
  }, [currentEvent]);

  // Autofill user credentials if logged in
  useEffect(() => {
    if (memberProfile) {
      setRegFullName(memberProfile.fullName || '');
      setRegEmail(memberProfile.email || '');
      setRegPhone(memberProfile.phone || '');
    } else if (currentUser) {
      setRegFullName(currentUser.displayName || '');
      setRegEmail(currentUser.email || '');
    }
  }, [memberProfile, currentUser, selectedEventForRegister, currentEvent]);

  // Reset dynamic form when active event changes
  useEffect(() => {
    const targetEvent = selectedEventForRegister || currentEvent;
    if (targetEvent) {
      const initialResp: Record<string, any> = {};
      (targetEvent.customFormFields || []).forEach(f => {
        if (f.type === 'checkbox') {
          initialResp[f.id] = false;
        } else {
          initialResp[f.id] = '';
        }
      });
      setDynamicResponses(initialResp);
      setRegError(null);
      setRegSuccess(null);
    }
  }, [selectedEventForRegister, currentEvent]);

  // Modal toggleability: Lock body scroll & listen for Escape key
  useEffect(() => {
    const isAnyModalOpen = !!selectedEventForDetail || !!selectedEventForRegister;
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEventForDetail(null);
        setSelectedEventForRegister(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEventForDetail, selectedEventForRegister]);

  // Countdown timer to Nov 28, 2026 FMVA Masterclass
  const targetDate = useMemo(() => new Date('2026-11-28T09:00:00+01:00').getTime(), []);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  // Handle dynamic response update
  const handleDynamicChange = (fieldId: string, value: any) => {
    setDynamicResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent, eventToRegister?: EventProgram) => {
    e.preventDefault();
    const target = eventToRegister || selectedEventForRegister || currentEvent;
    if (!target) return;

    setRegError(null);
    setIsSubmitting(true);

    try {
      if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim()) {
        throw new Error('Please fill in your name, email, and contact phone number.');
      }

      // Check required custom fields
      for (const field of target.customFormFields || []) {
        if (field.required) {
          const val = dynamicResponses[field.id];
          if (val === undefined || val === null || val === '' || val === false) {
            throw new Error(`Required field missing: "${field.label}"`);
          }
        }
      }

      const registration = await registerForEvent(target.id, {
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        organization: regOrg.trim(),
        jobTitle: regTitle.trim(),
        responses: dynamicResponses
      });

      setRegSuccess(registration);
    } catch (err) {
      setRegError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to generate and download .ics calendar file
  const downloadIcs = (event: EventProgram) => {
    const startDateClean = event.startDate.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PSA Investment//Financial Modeling Events//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.venue}`,
      `DTSTART:${startDateClean}T090000Z`,
      `DTEND:${startDateClean}T150000Z`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.slug || 'psa-event'}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render Custom Dynamic Form Fields
  const renderCustomField = (field: FormFieldDefinition) => {
    return (
      <div key={field.id} className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700">
          {field.label} {field.required && <span className="text-rose-500">*</span>}
        </label>

        {/* TEXT / EMAIL / PHONE INPUT */}
        {(field.type === 'text' || field.type === 'email' || field.type === 'phone') && (
          <input
            type={field.type}
            required={field.required}
            placeholder={field.placeholder || ''}
            value={dynamicResponses[field.id] || ''}
            onChange={e => handleDynamicChange(field.id, e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
          />
        )}

        {/* NUMBER INPUT */}
        {field.type === 'number' && (
          <input
            type="number"
            required={field.required}
            placeholder={field.placeholder || ''}
            value={dynamicResponses[field.id] || ''}
            onChange={e => handleDynamicChange(field.id, e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
          />
        )}

        {/* SELECT DROPDOWN */}
        {field.type === 'select' && (
          <select
            required={field.required}
            value={dynamicResponses[field.id] || ''}
            onChange={e => handleDynamicChange(field.id, e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium cursor-pointer"
          >
            <option value="">-- Select an option --</option>
            {field.options?.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {/* RADIO BUTTONS */}
        {field.type === 'radio' && (
          <div className="space-y-1.5 pt-1">
            {field.options?.map((opt, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.id}
                  required={field.required}
                  value={opt}
                  checked={dynamicResponses[field.id] === opt}
                  onChange={() => handleDynamicChange(field.id, opt)}
                  className="text-[#0A1F44] focus:ring-[#C9A84C]"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {/* TEXTAREA */}
        {field.type === 'textarea' && (
          <textarea
            required={field.required}
            rows={3}
            placeholder={field.placeholder || ''}
            value={dynamicResponses[field.id] || ''}
            onChange={e => handleDynamicChange(field.id, e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium resize-none"
          />
        )}

        {/* CHECKBOX */}
        {field.type === 'checkbox' && (
          <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              required={field.required}
              checked={Boolean(dynamicResponses[field.id])}
              onChange={e => handleDynamicChange(field.id, e.target.checked)}
              className="mt-0.5 rounded text-[#0A1F44] focus:ring-[#C9A84C]"
            />
            <span>{field.placeholder || field.label}</span>
          </label>
        )}
      </div>
    );
  };

  // =========================================================================
  // CASE 1: DEDICATED INDIVIDUAL EVENT PAGE (UNIQUE URL e.g. /events/:slug)
  // =========================================================================
  if (currentEvent) {
    return (
      <div className="bg-[#F8F9FA] min-h-screen pb-24 animate-in fade-in duration-200">
        {/* Navigation Breadcrumb & Direct Action Bar */}
        <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                if (onNavigateEvent) onNavigateEvent(undefined);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Masterclasses & Events</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopyToast(true);
                  setTimeout(() => setCopyToast(false), 2500);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Copy Direct Link to this Event"
              >
                {copyToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadIcs(currentEvent)}
                className="px-3.5 py-1.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span className="hidden sm:inline">Add to Calendar (.ics)</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Check out this PSA Investment Masterclass: ${currentEvent.title}\n${window.location.href}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-[#0A1F44] text-white py-12 sm:py-16 relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-6xl mx-auto px-4 relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#C9A84C] text-[#0A1F44] text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {currentEvent.category.toUpperCase()}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                REGISTRATIONS OPEN
              </span>
              <span className="bg-white/10 text-slate-200 text-xs font-mono font-semibold px-3 py-1 rounded-full">
                {currentEvent.price || 'Free Admission'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight max-w-4xl">
              {currentEvent.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              {currentEvent.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date</span>
                <span className="font-semibold text-white">{currentEvent.startDate}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Time</span>
                <span className="font-semibold text-white">{currentEvent.startTime} - {currentEvent.endTime}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Venue / Platform</span>
                <span className="font-semibold text-white truncate block">{currentEvent.venue}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Lead Faculty</span>
                <span className="font-semibold text-white truncate block">{currentEvent.instructor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="max-w-6xl mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Syllabus, Modules, Instructor, Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Syllabus & Modules */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                    Comprehensive Syllabus & Learning Objectives
                  </h3>
                  <span className="text-[11px] font-bold text-[#C9A84C] font-mono">
                    {currentEvent.learningObjectives.length} Core Modules
                  </span>
                </div>
                <div className="space-y-3">
                  {currentEvent.learningObjectives.map((obj, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl flex items-start gap-3 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#0A1F44] text-[#C9A84C] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        {i + 1}
                      </span>
                      <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {obj}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-3">
                <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                  Target Audience & Who Should Attend
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentEvent.targetAudience}
                </p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Equity Analysts & Treasurers</span>
                  </div>
                  <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Finance Students & Graduates</span>
                  </div>
                  <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Portfolio & Fund Managers</span>
                  </div>
                  <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Active NGX Retail Investors</span>
                  </div>
                </div>
              </div>

              {/* Lead Faculty Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="font-serif font-black text-xl text-[#0A1F44]">
                  Lead Instructor & Faculty
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#C9A84C] bg-slate-900 shrink-0">
                    <img
                      src={currentEvent.instructorPhoto || '/salami-abdullahi.jpg'}
                      alt={currentEvent.instructor}
                      className="w-full h-full object-cover object-top"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-serif font-black text-base text-[#0A1F44] flex items-center gap-2">
                      <span>{currentEvent.instructor}</span>
                      <span className="text-[10px] font-mono bg-[#C9A84C]/20 text-[#0A1F44] px-2 py-0.5 rounded uppercase font-bold">
                        Chief Analyst
                      </span>
                    </div>
                    <div className="text-xs text-[#C9A84C] font-semibold">{currentEvent.instructorTitle}</div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Leading Nigerian capital markets authority directing DCF valuation models, NGX banking recapitalization stress-testing, and institutional research memos.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dedicated Registration / Enrollment Desk */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              <div className="bg-white rounded-3xl border-2 border-[#C9A84C]/80 shadow-xl overflow-hidden">
                <div className="bg-[#0A1F44] p-5 text-white">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A84C]">
                    Official Enrollment Desk
                  </span>
                  <h3 className="font-serif font-black text-xl text-white mt-0.5">
                    Register for this Program
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {currentEvent.startDate} • {currentEvent.startTime} ({currentEvent.venue})
                  </p>
                </div>

                <div className="p-6">
                  {regError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {regSuccess ? (
                    /* Registration Success Screen */
                    <div className="text-center py-4 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-serif font-black text-xl text-[#0A1F44]">Registration Confirmed!</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Thank you, <strong className="text-slate-800">{regSuccess.fullName}</strong>. Your seat for the{' '}
                          <strong>{regSuccess.eventTitle}</strong> has been secured.
                        </p>
                      </div>

                      {/* Ticket Card */}
                      <div className="p-4 bg-gradient-to-br from-slate-50 to-amber-50/40 border border-[#C9A84C]/60 rounded-2xl text-left space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Official Ticket Code</span>
                          <span className="font-mono font-black text-sm text-[#0A1F44] bg-white px-2 py-0.5 rounded border border-slate-200">
                            {regSuccess.ticketCode}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-slate-400 text-[10px]">Attendee Name</div>
                            <div className="font-semibold text-slate-800">{regSuccess.fullName}</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-[10px]">Email Address</div>
                            <div className="font-semibold text-slate-800 truncate">{regSuccess.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Direct Confirmation Email Status */}
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5 text-left">
                        <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-emerald-950">Official Confirmation Email Dispatched</div>
                          <div className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
                            Your full registration dossier, personalized ticket code, and curriculum syllabus have been dispatched directly to <strong className="font-semibold text-emerald-950 underline">{regSuccess.email}</strong> from <span className="font-mono text-emerald-900 font-medium">psainvestment.ng@gmail.com</span>. Please check your inbox and spam folder.
                          </div>
                        </div>
                      </div>

                      {/* Official WhatsApp Channels (NEXT STEPS) */}
                      <div className="p-4 bg-emerald-950/10 border border-emerald-500/30 rounded-2xl text-left space-y-2">
                        <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <span>Next Steps - Join Official Channels Immediately</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          All class schedules, starter Excel templates, Zoom links, and assessments will be distributed exclusively through our official WhatsApp channels:
                        </p>
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          <a
                            href="https://whatsapp.com/channel/0029VbDmqAvGOj9lfbP6uT3U"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>1. Join PSAI FMVA Bootcamp Cohort Channel</span>
                          </a>
                          <a
                            href="https://whatsapp.com/channel/0029Vb7oZ03D38CbwP1M8f0R"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>2. Join PSA Investment Main Intelligence Channel</span>
                          </a>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => downloadIcs(currentEvent)}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Download className="w-4 h-4 text-[#0A1F44]" />
                          <span>Download Calendar Invite (.ics)</span>
                        </button>

                        <button
                          onClick={() => {
                            setRegSuccess(null);
                            setDynamicResponses({});
                          }}
                          className="w-full py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer"
                        >
                          Register Another Participant
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Registration Form */
                    <form onSubmit={e => handleRegisterSubmit(e, currentEvent)} className="space-y-4">
                      <div className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider pb-1 border-b border-slate-100">
                        Primary Attendee Information
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Babatunde Adeleke"
                          value={regFullName}
                          onChange={e => setRegFullName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="name@organization.com"
                            value={regEmail}
                            onChange={e => setRegEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Phone (WhatsApp) *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+234 803 123 4567"
                            value={regPhone}
                            onChange={e => setRegPhone(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Organization / University
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Zenith Bank / UNILAG"
                            value={regOrg}
                            onChange={e => setRegOrg(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Job Title / Student Level
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Credit Analyst / Final Year"
                            value={regTitle}
                            onChange={e => setRegTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>

                      {/* ADMIN DYNAMIC CUSTOM FORM FIELDS */}
                      {currentEvent.customFormFields && currentEvent.customFormFields.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider">
                              Program Specific Questions
                            </div>
                            <span className="text-[10px] text-slate-400">Institutional Questionnaire</span>
                          </div>

                          {currentEvent.customFormFields.map((field: FormFieldDefinition) =>
                            renderCustomField(field)
                          )}
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-101 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <span>{isSubmitting ? 'Securing Seat...' : 'Confirm Program Registration'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-[10px] text-slate-400 text-center mt-2">
                          By registering, you agree to receive session links and course materials via email and WhatsApp.
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 2: PROGRAM NOT FOUND (INVALID SLUG)
  // =========================================================================
  if (activeEventSlug && !currentEvent) {
    return (
      <div className="bg-[#F8F9FA] min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-black text-2xl text-[#0A1F44]">Program Not Found</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The program or masterclass you requested (<code>{activeEventSlug}</code>) could not be located or may have been concluded.
          </p>
          <button
            onClick={() => {
              if (onNavigateEvent) onNavigateEvent(undefined);
            }}
            className="px-6 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
          >
            Explore Active Masterclasses &rarr;
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 3: ALL EVENTS DIRECTORY / LISTING VIEW
  // =========================================================================
  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20">
      {/* HERO SECTION */}
      <div className="bg-[#0A1F44] text-white py-14 sm:py-20 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            PSA Academy & Executive Programs
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white mb-4 leading-tight">
            Institutional Valuation Summits & Financial Modeling Masterclasses
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
            Empowering analysts, portfolio managers, corporate treasurers, and retail investors with
            Wall Street-grade financial modeling, DCF valuation frameworks, and Nigerian capital markets intelligence.
          </p>

          {/* FLAGSHIP COUNTDOWN BANNER (NOV 28, 2026 FMVA) */}
          <div className="bg-gradient-to-r from-[#0F2752] via-[#142F61] to-[#0A1F44] border-2 border-[#C9A84C] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C9A84C]/10 rounded-full blur-2xl" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-[#C9A84C] text-[#0A1F44] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono">
                    Flagship Executive Masterclass
                  </span>
                  <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Saturday, November 28, 2026
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                  Financial Modeling & Valuation Analysis (FMVA) Masterclass
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Led directly by <strong className="text-white">Salami Abdullahi</strong> (CEO & Chief Analyst). Build dynamic 3-statement models, DCF valuation engines, and NGX equity scorecards.
                </p>
              </div>

              {/* Countdown Clocks */}
              <div className="flex items-center gap-2 sm:gap-3 bg-[#0A1F44]/90 p-3 sm:p-4 rounded-xl border border-slate-700/80 shrink-0">
                <div className="text-center px-2">
                  <div className="font-mono font-black text-xl sm:text-2xl text-[#C9A84C]">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Days</div>
                </div>
                <span className="text-[#C9A84C] font-mono font-bold text-lg">:</span>
                <div className="text-center px-2">
                  <div className="font-mono font-black text-xl sm:text-2xl text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Hours</div>
                </div>
                <span className="text-slate-500 font-mono font-bold text-lg">:</span>
                <div className="text-center px-2">
                  <div className="font-mono font-black text-xl sm:text-2xl text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Mins</div>
                </div>
                <span className="text-slate-500 font-mono font-bold text-lg">:</span>
                <div className="text-center px-2">
                  <div className="font-mono font-black text-xl sm:text-2xl text-[#C9A84C]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Secs</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <button
                  onClick={() => {
                    const fmva = events.find(e => e.id === 'evt-fmva-2026') || events[0];
                    if (onNavigateEvent && fmva) {
                      onNavigateEvent(fmva.slug || fmva.id);
                    } else {
                      setSelectedEventForRegister(fmva);
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#C9A84C] hover:bg-[#d9b657] text-[#0A1F44] font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <span>Register for FMVA Masterclass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GOOGLE ADS LEADERBOARD */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <GoogleAdSlot slotType="leaderboard" />
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'masterclass', label: 'Masterclasses' },
              { id: 'training', label: 'Workshops & Training' },
              { id: 'webinar', label: 'Webinars' },
              { id: 'conference', label: 'Summits' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search programs, modules, instructor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* EVENTS GRID */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">No Matching Programs Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or switching categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Banner */}
                  <div className="bg-gradient-to-r from-[#0A1F44] to-[#122c5e] p-6 text-white relative">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="bg-[#C9A84C] text-[#0A1F44] text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {event.category.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                        {event.price}
                      </span>
                    </div>

                    <h3
                      onClick={() => {
                        if (onNavigateEvent) onNavigateEvent(event.slug || event.id);
                        else setSelectedEventForRegister(event);
                      }}
                      className="font-serif font-black text-xl text-white tracking-tight mb-2 hover:text-[#C9A84C] transition-colors cursor-pointer"
                    >
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                        {new Date(event.startDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                        {event.startTime} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Laptop className="w-3.5 h-3.5 text-[#C9A84C]" />
                        {event.venue}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Learning Objectives */}
                    {event.learningObjectives && event.learningObjectives.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Key Curriculum Highlights:
                        </div>
                        <ul className="space-y-1">
                          {event.learningObjectives.slice(0, 3).map((obj, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-9 h-9 rounded-full bg-[#0A1F44] text-[#C9A84C] font-bold text-xs flex items-center justify-center font-serif">
                        {event.instructor.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0A1F44]">{event.instructor}</div>
                        <div className="text-[10px] text-slate-500">{event.instructorTitle}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedEventForDetail(event)}
                    className="text-xs font-bold text-[#0A1F44] hover:text-[#C9A84C] flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Syllabus</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadIcs(event)}
                      title="Add to Calendar (.ics)"
                      className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-[#0A1F44] rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (onNavigateEvent) onNavigateEvent(event.slug || event.id);
                        else setSelectedEventForRegister(event);
                      }}
                      className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Register & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SYLLABUS & PROGRAM DETAILS MODAL (FULLY TOGGLEABLE) */}
      {selectedEventForDetail && (
        <div
          onClick={e => {
            if (e.target === e.currentTarget) setSelectedEventForDetail(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="bg-[#0A1F44] p-6 text-white relative shrink-0">
              <button
                onClick={() => setSelectedEventForDetail(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="bg-[#C9A84C] text-[#0A1F44] text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {selectedEventForDetail.category.toUpperCase()}
              </span>
              <h3 className="font-serif font-black text-2xl text-white mt-2">
                {selectedEventForDetail.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Date: {selectedEventForDetail.startDate} • Time: {selectedEventForDetail.startTime} - {selectedEventForDetail.endTime} • Venue: {selectedEventForDetail.venue}
              </p>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-[#0A1F44] text-sm uppercase tracking-wider mb-2">Program Overview</h4>
                <p className="leading-relaxed text-slate-600">{selectedEventForDetail.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#0A1F44] text-sm uppercase tracking-wider mb-2">Comprehensive Syllabus & Modules</h4>
                <div className="space-y-2">
                  {selectedEventForDetail.learningObjectives.map((obj, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#0A1F44] text-[#C9A84C] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-slate-700 font-medium">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-1">
                <div className="font-bold text-[#0A1F44] text-xs">Target Audience:</div>
                <p className="text-slate-600 text-xs">{selectedEventForDetail.targetAudience}</p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-[#0A1F44] text-[#C9A84C] font-serif font-bold text-base flex items-center justify-center shrink-0">
                  {selectedEventForDetail.instructor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0A1F44]">{selectedEventForDetail.instructor}</div>
                  <div className="text-xs text-slate-500">{selectedEventForDetail.instructorTitle}</div>
                  <div className="text-[11px] text-slate-600 mt-1">Lead instructor specializing in Nigerian banking valuation, capital adequacy ratios, and discounted cash flow modeling.</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => downloadIcs(selectedEventForDetail)}
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#C9A84C]" />
                <span>Save to Calendar (.ics)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const slug = selectedEventForDetail.slug || selectedEventForDetail.id;
                    setSelectedEventForDetail(null);
                    if (onNavigateEvent) onNavigateEvent(slug);
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  View Full Page
                </button>
                <button
                  onClick={() => {
                    const ev = selectedEventForDetail;
                    setSelectedEventForDetail(null);
                    setSelectedEventForRegister(ev);
                  }}
                  className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1.5"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC REGISTRATION MODAL WITH CUSTOM FORM BUILDER (FULLY TOGGLEABLE) */}
      {selectedEventForRegister && (
        <div
          onClick={e => {
            if (e.target === e.currentTarget) {
              setSelectedEventForRegister(null);
              setRegSuccess(null);
            }
          }}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Header */}
            <div className="bg-[#0A1F44] p-5 text-white relative shrink-0">
              <button
                onClick={() => {
                  setSelectedEventForRegister(null);
                  setRegSuccess(null);
                }}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A84C]">
                Official Program Registration
              </div>
              <h3 className="font-serif font-black text-xl text-white mt-1">
                {selectedEventForRegister.title}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedEventForRegister.startDate} • {selectedEventForRegister.startTime} ({selectedEventForRegister.venue})
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {regError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess ? (
                /* Registration Success Screen */
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-xl text-[#0A1F44]">Registration Confirmed!</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Thank you, <strong className="text-slate-800">{regSuccess.fullName}</strong>. Your seat for the{' '}
                      <strong>{regSuccess.eventTitle}</strong> has been secured.
                    </p>
                  </div>

                  {/* Ticket Card */}
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-amber-50/40 border border-[#C9A84C]/60 rounded-2xl text-left space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Official Ticket Code</span>
                      <span className="font-mono font-black text-sm text-[#0A1F44] bg-white px-2 py-0.5 rounded border border-slate-200">
                        {regSuccess.ticketCode}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px]">Attendee Name</div>
                        <div className="font-semibold text-slate-800">{regSuccess.fullName}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">Email Address</div>
                        <div className="font-semibold text-slate-800 truncate">{regSuccess.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Confirmation Email Status */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5 text-left">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Official Confirmation Email Dispatched</div>
                      <div className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
                        Your full registration dossier, personalized ticket code, and curriculum syllabus have been dispatched directly to <strong className="font-semibold text-emerald-950 underline">{regSuccess.email}</strong> from <span className="font-mono text-emerald-900 font-medium">psainvestment.ng@gmail.com</span>. Please check your inbox and spam folder.
                      </div>
                    </div>
                  </div>

                  {/* Official WhatsApp Channels (NEXT STEPS) */}
                  <div className="p-4 bg-emerald-950/10 border border-emerald-500/30 rounded-2xl text-left space-y-2">
                    <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Next Steps - Join Official Channels Immediately</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      All class schedules, starter Excel templates, Zoom links, and assessments will be distributed exclusively through our official WhatsApp channels:
                    </p>
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      <a
                        href="https://whatsapp.com/channel/0029VbDmqAvGOj9lfbP6uT3U"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>1. Join PSAI FMVA Bootcamp Cohort Channel</span>
                      </a>
                      <a
                        href="https://whatsapp.com/channel/0029Vb7oZ03D38CbwP1M8f0R"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>2. Join PSA Investment Main Intelligence Channel</span>
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => downloadIcs(selectedEventForRegister)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#0A1F44]" />
                      <span>Download Calendar Invite (.ics)</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedEventForRegister(null);
                        setRegSuccess(null);
                      }}
                      className="w-full py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form with Dynamic Custom Fields */
                <form onSubmit={e => handleRegisterSubmit(e, selectedEventForRegister)} className="space-y-4">
                  <div className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider pb-1 border-b border-slate-100">
                    Primary Attendee Information
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Babatunde Adeleke"
                      value={regFullName}
                      onChange={e => setRegFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@organization.com"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 803 123 4567"
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Organization / University
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Zenith Bank / UNILAG"
                        value={regOrg}
                        onChange={e => setRegOrg(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Job Title / Student Level
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Credit Analyst / Final Year"
                        value={regTitle}
                        onChange={e => setRegTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* ADMIN DYNAMIC CUSTOM FORM FIELDS */}
                  {selectedEventForRegister.customFormFields &&
                    selectedEventForRegister.customFormFields.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider">
                            Program Specific Questions
                          </div>
                          <span className="text-[10px] text-slate-400">Customized by Executive Admin</span>
                        </div>

                        {selectedEventForRegister.customFormFields.map((field: FormFieldDefinition) =>
                          renderCustomField(field)
                        )}
                      </div>
                    )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-101 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Securing Seat...' : 'Confirm Program Registration'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-2">
                      By registering, you agree to receive session links and course materials via email and WhatsApp.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
