import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Trash2,
  Edit,
  Download,
  Share2,
  Send,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  ListPlus,
  Radio,
  Sliders,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  EventProgram,
  EventRegistration,
  FormFieldDefinition,
  FormFieldType,
  EventCategory
} from '../types';

export const AdminEventsDesk: React.FC = () => {
  const {
    events,
    eventRegistrations,
    saveEvent,
    deleteEvent,
    exportEventRegistrationsToCsv,
    triggerEventBroadcast
  } = useData();

  const [selectedEventId, setSelectedEventId] = useState<string>(
    events[0]?.id || 'evt-fmva-2026'
  );

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<EventProgram> | null>(null);

  // Lock background scrolling and add Escape key listener when editor modal is open
  useEffect(() => {
    if (isEditorOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsEditorOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }, [isEditorOpen]);
  
  // Custom Form Builder state inside modal
  const [formFields, setFormFields] = useState<FormFieldDefinition[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FormFieldType>('text');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  // Broadcast state
  const [broadcastEmail, setBroadcastEmail] = useState(true);
  const [broadcastWhatsapp, setBroadcastWhatsapp] = useState(true);
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{ emailsSent: number; whatsappUrl: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected event for registration table
  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];
  const registrationsForSelected = eventRegistrations.filter(r => r.eventId === selectedEvent?.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open modal for new event
  const handleOpenCreateModal = () => {
    const newEv: Partial<EventProgram> = {
      title: '',
      slug: `psa-event-${Date.now()}`,
      category: 'masterclass',
      description: '',
      learningObjectives: [''],
      targetAudience: 'Financial analysts, investment associates, and retail investors',
      instructor: 'Salami Abdullahi',
      instructorTitle: 'CEO & Chief Analyst, PSA Investment',
      startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      startTime: '10:00 WAT',
      endTime: '15:00 WAT',
      timezone: 'WAT (UTC+1)',
      locationType: 'virtual',
      venue: 'PSA Executive Virtual Auditorium (Zoom Direct / Google Meet)',
      capacity: 100,
      registrationDeadline: new Date(Date.now() + 13 * 86400000).toISOString().split('T')[0],
      price: 'Complimentary for Circle Members / ₦35,000 Public',
      status: 'upcoming'
    };
    setEditingEvent(newEv);
    setFormFields([
      {
        id: 'years_experience',
        label: 'Years of Financial Modeling / Investment Experience',
        type: 'select',
        required: true,
        options: ['Under 1 year', '1 - 3 years', '3 - 5 years', '5+ years (Senior)']
      },
      {
        id: 'primary_objective',
        label: 'What is your primary objective for this masterclass?',
        type: 'textarea',
        placeholder: 'e.g., Mastering banking recapitalization modeling & DCF valuations',
        required: true
      }
    ]);
    setIsEditorOpen(true);
  };

  // Open modal to edit existing event
  const handleOpenEditModal = (ev: EventProgram) => {
    setEditingEvent({ ...ev });
    setFormFields(ev.customFormFields ? [...ev.customFormFields] : []);
    setIsEditorOpen(true);
  };

  // Add field in form builder
  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;

    const optionsArray = (newFieldType === 'select' || newFieldType === 'radio')
      ? newFieldOptions.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const newField: FormFieldDefinition = {
      id: `field_${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      placeholder: newFieldPlaceholder.trim() || undefined,
      required: newFieldRequired,
      options: optionsArray && optionsArray.length > 0 ? optionsArray : undefined
    };

    setFormFields(prev => [...prev, newField]);
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    setNewFieldOptions('');
    setNewFieldRequired(true);
    setNewFieldType('text');
  };

  // Remove field in form builder
  const handleRemoveField = (fieldId: string) => {
    setFormFields(prev => prev.filter(f => f.id !== fieldId));
  };

  // Save event with form fields
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;

    try {
      await saveEvent({
        ...editingEvent,
        customFormFields: formFields
      });
      setIsEditorOpen(false);
      showToast('Program and custom registration form successfully saved.');
    } catch (err) {
      alert('Error saving program: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Trigger Broadcast
  const handleExecuteBroadcast = async () => {
    if (!selectedEvent) return;
    setBroadcastLoading(true);
    setBroadcastResult(null);

    try {
      const res = await triggerEventBroadcast(selectedEvent.id, {
        email: broadcastEmail,
        whatsapp: broadcastWhatsapp
      });
      setBroadcastResult(res);
      showToast(`Broadcast completed: ${res.emailsSent} member emails queued.`);
    } catch (err) {
      alert('Broadcast dispatch error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setBroadcastLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A84C]/20 text-[#0A1F44]">
              Executive Program Manager
            </span>
            <span className="text-xs text-slate-400">• Form Builder & Attendee Intelligence</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-[#0A1F44] mt-1">
            Events, Masterclasses & Form Builder Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-program events, design bespoke registration question types, export attendee records to Excel (.csv), and broadcast to members.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportEventRegistrationsToCsv()}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-102 flex items-center gap-2 shrink-0"
            title="Download complete database of all event applicants across all masterclasses as an Excel-formatted CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Export All Registrations (Excel)</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-102 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Program / Masterclass</span>
          </button>
        </div>
      </div>

      {/* PROGRAMS LIST TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#0A1F44]">
            Active & Scheduled Programs ({events.length})
          </h3>
          <span className="text-xs text-slate-400">Official curriculum catalog</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-[#0A1F44] text-[#C9A84C] uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Program Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Time (WAT)</th>
                <th className="py-3 px-4">Custom Fields</th>
                <th className="py-3 px-4">Registrations</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map(ev => {
                const count = eventRegistrations.filter(r => r.eventId === ev.id).length;
                const isSelected = selectedEventId === ev.id;
                return (
                  <tr
                    key={ev.id}
                    className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-amber-50/40' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0A1F44] text-xs">{ev.title}</div>
                      <div className="text-[10px] text-slate-400">{ev.instructor}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {ev.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-semibold">
                      {ev.startDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {ev.startTime} - {ev.endTime}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#0A1F44] bg-slate-100 px-2 py-0.5 rounded">
                        {ev.customFormFields?.length || 0} fields
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-900">{count}</span>
                        <span className="text-slate-400 text-[10px]">/ {ev.capacity}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ev.status === 'upcoming'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ev.status === 'ongoing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedEventId(ev.id)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#0A1F44] text-[#C9A84C] border-[#0A1F44]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        View Responses
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(ev)}
                        className="p-1.5 text-slate-500 hover:text-[#0A1F44] rounded hover:bg-slate-100 cursor-pointer"
                        title="Edit program & form fields"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {events.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${ev.title}?`)) {
                              deleteEvent(ev.id);
                              showToast('Event removed.');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                          title="Delete program"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATTENDEE RESPONSES & EXCEL EXPORT DESK */}
      {selectedEvent && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  Selected Program Desk
                </span>
                <span className="text-xs text-slate-500">ID: {selectedEvent.id}</span>
              </div>
              <h3 className="font-serif font-black text-xl text-[#0A1F44] mt-1">
                {selectedEvent.title} - Registration Intelligence
              </h3>
              <p className="text-xs text-slate-500">
                Date: {selectedEvent.startDate} ({selectedEvent.startTime} WAT) • {registrationsForSelected.length} confirmed attendees
              </p>
            </div>

            {/* EXCEL DOWNLOAD & BROADCAST BUTTONS */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => exportEventRegistrationsToCsv(selectedEvent.id)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span>Download Responses in Excel (.csv)</span>
              </button>
            </div>
          </div>

          {/* ATTENDEES TABLE WITH DYNAMIC RESPONSES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider">
                Confirmed Attendee Ledger ({registrationsForSelected.length})
              </h4>
              <span className="text-[11px] text-slate-400">Live Server Database</span>
            </div>

            {registrationsForSelected.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                No registrations logged for this program yet.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-[#0A1F44] text-[#C9A84C] uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Attendee Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Organization / Title</th>
                      <th className="py-3 px-4">Custom Question Responses</th>
                      <th className="py-3 px-4">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrationsForSelected.map(reg => (
                      <tr key={reg.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-[#0A1F44]">
                          {reg.ticketCode}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {reg.fullName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {reg.email}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {reg.phone}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <div>{reg.organization || 'Independent'}</div>
                          <div className="text-[10px] text-slate-400">{reg.jobTitle || 'Investor'}</div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          {reg.responses && Object.keys(reg.responses).length > 0 ? (
                            <div className="space-y-1">
                              {Object.entries(reg.responses).map(([k, v]) => {
                                const fieldDef = selectedEvent.customFormFields?.find(f => f.id === k);
                                return (
                                  <div key={k} className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100">
                                    <span className="text-slate-400 font-medium">
                                      {fieldDef ? fieldDef.label : k}:{' '}
                                    </span>
                                    <strong className="text-slate-800">
                                      {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                                    </strong>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Standard profile</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[10px] whitespace-nowrap">
                          {new Date(reg.registeredAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* EXECUTIVE BROADCAST & DISTRIBUTION DESK */}
          <div className="p-6 bg-gradient-to-br from-slate-50 to-amber-50/50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#C9A84C]" />
                <h4 className="font-serif font-bold text-base text-[#0A1F44]">
                  Multi-Channel Member Distribution Desk
                </h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A1F44] text-[#C9A84C] px-2 py-0.5 rounded">
                Admin Approval Required
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dispatch an automated formatted announcement summarizing this program to all active Circle Members
              via transactional email and prepare a formatted WhatsApp broadcast link for investor groups.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={broadcastEmail}
                  onChange={e => setBroadcastEmail(e.target.checked)}
                  className="rounded text-[#0A1F44] focus:ring-[#C9A84C]"
                />
                <span className="font-semibold">Dispatch Email to Registered Circle Members</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={broadcastWhatsapp}
                  onChange={e => setBroadcastWhatsapp(e.target.checked)}
                  className="rounded text-[#0A1F44] focus:ring-[#C9A84C]"
                />
                <span className="font-semibold">Generate Pre-Formatted WhatsApp Community Link</span>
              </label>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleExecuteBroadcast}
                disabled={broadcastLoading || (!broadcastEmail && !broadcastWhatsapp)}
                className="px-6 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <span>{broadcastLoading ? 'Dispatching Broadcast...' : 'Approve & Trigger Multi-Channel Broadcast'}</span>
              </button>

              {broadcastResult?.whatsappUrl && (
                <a
                  href={broadcastResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp Broadcast Link</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EVENT CREATION & CUSTOM FORM BUILDER MODAL */}
      {isEditorOpen && editingEvent && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditorOpen(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0A1F44] p-5 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A84C]">
                  Program Architect & Form Builder
                </span>
                <h3 className="font-serif font-black text-xl text-white mt-0.5">
                  {editingEvent.id ? 'Edit Program & Form Fields' : 'Design New Institutional Program'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEvent} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Basic Event Settings */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider pb-1 border-b border-slate-100">
                  1. Program Schedule & Venue
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Program Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Financial Modeling and Valuation Analysis (FMVA)"
                      value={editingEvent.title || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={editingEvent.category || 'masterclass'}
                      onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value as EventCategory })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white cursor-pointer"
                    >
                      <option value="masterclass">Masterclass</option>
                      <option value="training">Training Workshop</option>
                      <option value="webinar">Webinar</option>
                      <option value="conference">Summit / Conference</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Program Date (YYYY-MM-DD) *
                    </label>
                    <input
                      type="date"
                      required
                      value={editingEvent.startDate || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Time (WAT) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10:00 WAT"
                      value={editingEvent.startTime || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      End Time (WAT) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 16:00 WAT"
                      value={editingEvent.endTime || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Venue / Virtual Platform *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zoom Direct / Google Meet"
                      value={editingEvent.venue || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Seating Capacity *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingEvent.capacity || 100}
                      onChange={e => setEditingEvent({ ...editingEvent, capacity: parseInt(e.target.value, 10) || 50 })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Program Overview & Abstract *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={editingEvent.description || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* CUSTOM FORM BUILDER SECTION */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider">
                    2. Dynamic Registration Form Builder
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Add custom fields of any question type
                  </span>
                </div>

                {/* Existing Custom Fields List */}
                <div className="space-y-2">
                  {formFields.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                      No custom fields added yet. Add questions below to customize your registration form.
                    </div>
                  ) : (
                    formFields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#0A1F44] text-[#C9A84C] font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-800">{field.label}</span>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span>Type: <code className="text-[#0A1F44] font-bold">{field.type}</code></span>
                              {field.required && <span className="text-rose-600 font-semibold">• Required</span>}
                              {field.options && <span>• Options: {field.options.join(', ')}</span>}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                          title="Remove Field"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add New Field Box */}
                <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3">
                  <div className="font-bold text-xs text-[#0A1F44] flex items-center gap-1.5">
                    <ListPlus className="w-4 h-4 text-[#C9A84C]" />
                    <span>Add New Question Field</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Question / Field Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nigerian Banking Sector Experience"
                        value={newFieldLabel}
                        onChange={e => setNewFieldLabel(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Field Type
                      </label>
                      <select
                        value={newFieldType}
                        onChange={e => setNewFieldType(e.target.value as FormFieldType)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] cursor-pointer"
                      >
                        <option value="text">Short Text</option>
                        <option value="number">Number</option>
                        <option value="select">Dropdown (Select)</option>
                        <option value="radio">Radio Group</option>
                        <option value="textarea">Paragraph (Textarea)</option>
                        <option value="checkbox">Single Checkbox (Agree / Yes)</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone Number</option>
                      </select>
                    </div>

                    {(newFieldType === 'select' || newFieldType === 'radio') && (
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Options (Comma Separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Beginner, Intermediate, Advanced, Professional"
                          value={newFieldOptions}
                          onChange={e => setNewFieldOptions(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Placeholder / Help Text (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Select your experience level..."
                        value={newFieldPlaceholder}
                        onChange={e => setNewFieldPlaceholder(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newFieldRequired}
                          onChange={e => setNewFieldRequired(e.target.checked)}
                          className="rounded text-[#0A1F44] focus:ring-[#C9A84C]"
                        />
                        <span className="font-semibold">Required Question</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddField}
                    disabled={!newFieldLabel.trim()}
                    className="px-4 py-2 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Attach Field to Form</span>
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-102"
                >
                  Save Program & Land to Server
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
