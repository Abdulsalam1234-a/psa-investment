import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ResearchReport,
  LearningVideo,
  Member,
  ServiceItem,
  ContactSubmission,
  DownloadLog,
  EmailDispatch,
  NewsletterSubscriber,
  StorageFile,
  ChronicleEdition,
  StaffMember,
  StaffRole,
  ResourceComment,
  EventProgram,
  EventRegistration,
  Announcement,
  GoogleAdsConfig,
  SiteSettings,
  EquityDossier,
  MarketBriefing,
  SubscriberLead
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_REPORTS,
  INITIAL_VIDEOS,
  INITIAL_MEMBERS,
  INITIAL_STORAGE_FILES,
  INITIAL_DOWNLOAD_LOGS,
  INITIAL_SUBSCRIBERS,
  INITIAL_STAFF,
  INITIAL_COMMENTS,
  INITIAL_EVENTS,
  INITIAL_EVENT_REGISTRATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ADS_CONFIG,
  INITIAL_SITE_SETTINGS
} from '../data/initialData';
import { INITIAL_CHRONICLES } from '../data/initialChronicles';
import { INITIAL_EQUITY_DOSSIERS } from '../data/dossiersData';
import { INITIAL_MARKET_BRIEFINGS } from '../data/briefingsData';
import { parseRawChronicle } from '../utils/chronicleParser';
import {
  sanitizeText,
  checkSqlSafety,
  logSecurityEvent,
  sanitizeSafeHtml
} from '../utils/security';

interface DataContextType {
  reports: ResearchReport[];
  equityDossiers: EquityDossier[];
  marketBriefings: MarketBriefing[];
  subscriberLeads: SubscriberLead[];
  videos: LearningVideo[];
  members: Member[];
  services: ServiceItem[];
  contactSubmissions: ContactSubmission[];
  downloadLogs: DownloadLog[];
  emailLogs: EmailDispatch[];
  storageFiles: StorageFile[];
  subscribers: NewsletterSubscriber[];
  chronicles: ChronicleEdition[];
  staffMembers: StaffMember[];
  comments: ResourceComment[];
  events: EventProgram[];
  eventRegistrations: EventRegistration[];
  announcements: Announcement[];
  googleAdsConfig: GoogleAdsConfig;
  siteSettings: SiteSettings;
  loading: boolean;
  saveEquityDossier: (dossier: Partial<EquityDossier>) => Promise<EquityDossier>;
  deleteEquityDossier: (id: string) => Promise<void>;
  getDossierBySlug: (slug: string) => EquityDossier | undefined;
  saveMarketBriefing: (briefing: Partial<MarketBriefing>) => Promise<MarketBriefing>;
  deleteMarketBriefing: (id: string) => Promise<void>;
  getBriefingBySlug: (slug: string) => MarketBriefing | undefined;
  addSubscriberLead: (data: Omit<SubscriberLead, 'id' | 'subscribedAt'>) => Promise<SubscriberLead>;
  saveReport: (report: Partial<ResearchReport>) => Promise<ResearchReport>;
  deleteReport: (id: string) => Promise<void>;
  incrementReportView: (id: string) => Promise<void>;
  logReportDownload: (reportId: string, memberId: string, memberEmail: string, fileId?: string) => Promise<DownloadLog>;
  saveVideo: (video: Partial<LearningVideo>) => Promise<LearningVideo>;
  deleteVideo: (id: string) => Promise<void>;
  trackVideoClick: (id: string) => Promise<void>;
  approveMember: (uid: string) => Promise<void>;
  rejectMember: (uid: string, note?: string) => Promise<void>;
  suspendMember: (uid: string) => Promise<void>;
  reinstateMember: (uid: string) => Promise<void>;
  updateMemberRecord: (uid: string, data: Partial<Member>) => Promise<void>;
  addStaffMember: (data: Omit<StaffMember, 'id' | 'assignedAt'>) => Promise<StaffMember>;
  updateStaffRole: (id: string, role: StaffRole, title?: string, permissions?: string[]) => Promise<void>;
  updateStaffStatus: (id: string, status: 'active' | 'suspended') => Promise<void>;
  updateStaffRecord: (id: string, data: Partial<StaffMember>) => Promise<void>;
  toggleStaffAboutVisibility: (id: string, show: boolean) => Promise<void>;
  deleteStaffMember: (id: string) => Promise<void>;
  addComment: (data: Omit<ResourceComment, 'id' | 'createdAt' | 'likes'>) => Promise<ResourceComment>;
  deleteComment: (id: string) => Promise<void>;
  likeComment: (id: string) => Promise<void>;
  submitContactForm: (data: Omit<ContactSubmission, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateContactStatus: (id: string, status: 'unread' | 'reviewed' | 'archived') => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  subscribeNewsletter: (email: string, fullName?: string, preferences?: string[], source?: string) => Promise<NewsletterSubscriber>;
  addStorageFile: (file: Omit<StorageFile, 'id' | 'uploadedAt'>) => Promise<void>;
  deleteStorageFile: (id: string) => Promise<void>;
  saveChronicle: (chronicle: Partial<ChronicleEdition>) => Promise<ChronicleEdition>;
  deleteChronicle: (id: string) => Promise<void>;
  incrementChronicleView: (id: string) => Promise<void>;
  logChronicleDownload: (chronicleId: string, memberEmail?: string) => Promise<void>;
  autoPublishGeminiChronicle: (rawText: string, customVolume?: string) => Promise<ChronicleEdition>;
  publishWordDocumentChronicle: (data: {
    rawText: string;
    docxUrl: string;
    docxFileName: string;
    formattedHtml: string;
    fileSizeBytes: number;
    customVolume?: string;
  }) => Promise<ChronicleEdition>;
  saveEvent: (event: Partial<EventProgram>) => Promise<EventProgram>;
  deleteEvent: (id: string) => Promise<void>;
  registerForEvent: (eventId: string, data: {
    fullName: string;
    email: string;
    phone: string;
    organization?: string;
    jobTitle?: string;
    responses: Record<string, any>;
  }) => Promise<EventRegistration>;
  saveAnnouncement: (announcement: Partial<Announcement>) => Promise<Announcement>;
  deleteAnnouncement: (id: string) => Promise<void>;
  dismissAnnouncement: (id: string) => void;
  updateGoogleAdsConfig: (config: Partial<GoogleAdsConfig>) => void;
  exportEventRegistrationsToCsv: (eventId: string) => void;
  triggerEventBroadcast: (eventId: string, channels: { email: boolean; whatsapp: boolean }) => Promise<{ emailsSent: number; whatsappUrl: string }>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  registerMemberDirectly: (member: Member) => Promise<void>;
  getPublicViews: (rawViews: number) => number;
  getPublicDownloads: (rawDownloads: number) => number;
  logUserActivity: (uid: string, action: string, details?: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<ResearchReport[]>(() => {
    const saved = localStorage.getItem('psa_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [videos, setVideos] = useState<LearningVideo[]>(() => {
    const saved = localStorage.getItem('psa_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('psa_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);

  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(() => {
    const saved = localStorage.getItem('psa_contact_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>(() => {
    const saved = localStorage.getItem('psa_download_logs');
    return saved ? JSON.parse(saved) : INITIAL_DOWNLOAD_LOGS;
  });

  const [emailLogs, setEmailLogs] = useState<EmailDispatch[]>(() => {
    const saved = localStorage.getItem('psa_email_dispatches');
    return saved ? JSON.parse(saved) : [];
  });

  const [storageFiles, setStorageFiles] = useState<StorageFile[]>(() => {
    const saved = localStorage.getItem('psa_storage_files');
    return saved ? JSON.parse(saved) : INITIAL_STORAGE_FILES;
  });

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    const saved = localStorage.getItem('psa_newsletter_subscribers');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIBERS;
  });

  const [chronicles, setChronicles] = useState<ChronicleEdition[]>(() => {
    const saved = localStorage.getItem('psa_chronicles');
    return saved ? JSON.parse(saved) : INITIAL_CHRONICLES;
  });

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('psa_staff_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge missing properties from INITIAL_STAFF (e.g. showOnAboutPage, bio, avatarUrl)
          return parsed.map((m: any) => {
            const init = INITIAL_STAFF.find(is => is.id === m.id);
            return {
              ...init,
              ...m,
              showOnAboutPage: m.showOnAboutPage !== undefined ? m.showOnAboutPage : (init?.showOnAboutPage ?? false),
              bio: m.bio || init?.bio || m.notes || '',
              avatarUrl: m.avatarUrl || init?.avatarUrl || ''
            };
          });
        }
      } catch (e) {
        console.error('Failed to parse psa_staff_members', e);
      }
    }
    return INITIAL_STAFF;
  });

  const [comments, setComments] = useState<ResourceComment[]>(() => {
    const saved = localStorage.getItem('psa_resource_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [events, setEvents] = useState<EventProgram[]>(() => {
    const saved = localStorage.getItem('psa_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(() => {
    const saved = localStorage.getItem('psa_event_registrations');
    return saved ? JSON.parse(saved) : INITIAL_EVENT_REGISTRATIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('psa_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [googleAdsConfig, setGoogleAdsConfig] = useState<GoogleAdsConfig>(() => {
    const saved = localStorage.getItem('psa_google_ads_config');
    return saved ? JSON.parse(saved) : INITIAL_ADS_CONFIG;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('psa_site_settings');
    return saved ? { ...INITIAL_SITE_SETTINGS, ...JSON.parse(saved) } : INITIAL_SITE_SETTINGS;
  });

  // Equity Dossiers & Market Briefings States
  const [equityDossiers, setEquityDossiers] = useState<EquityDossier[]>(() => {
    const saved = localStorage.getItem('psa_equity_dossiers');
    return saved ? JSON.parse(saved) : INITIAL_EQUITY_DOSSIERS;
  });

  const [marketBriefings, setMarketBriefings] = useState<MarketBriefing[]>(() => {
    const saved = localStorage.getItem('psa_market_briefings');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_BRIEFINGS;
  });

  const [subscriberLeads, setSubscriberLeads] = useState<SubscriberLead[]>(() => {
    const saved = localStorage.getItem('psa_subscriber_leads');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('psa_equity_dossiers', JSON.stringify(equityDossiers));
  }, [equityDossiers]);

  useEffect(() => {
    localStorage.setItem('psa_market_briefings', JSON.stringify(marketBriefings));
  }, [marketBriefings]);

  useEffect(() => {
    localStorage.setItem('psa_subscriber_leads', JSON.stringify(subscriberLeads));
  }, [subscriberLeads]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('psa_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('psa_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('psa_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('psa_contact_submissions', JSON.stringify(contactSubmissions));
  }, [contactSubmissions]);

  useEffect(() => {
    localStorage.setItem('psa_download_logs', JSON.stringify(downloadLogs));
  }, [downloadLogs]);

  useEffect(() => {
    localStorage.setItem('psa_email_dispatches', JSON.stringify(emailLogs));
  }, [emailLogs]);

  useEffect(() => {
    localStorage.setItem('psa_storage_files', JSON.stringify(storageFiles));
  }, [storageFiles]);

  useEffect(() => {
    localStorage.setItem('psa_newsletter_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('psa_chronicles', JSON.stringify(chronicles));
  }, [chronicles]);

  useEffect(() => {
    localStorage.setItem('psa_staff_members', JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem('psa_resource_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('psa_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('psa_event_registrations', JSON.stringify(eventRegistrations));
  }, [eventRegistrations]);

  useEffect(() => {
    localStorage.setItem('psa_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('psa_google_ads_config', JSON.stringify(googleAdsConfig));
  }, [googleAdsConfig]);

  // Sync siteSettings to localStorage and dynamic browser title & meta tags
  useEffect(() => {
    localStorage.setItem('psa_site_settings', JSON.stringify(siteSettings));

    try {
      if (typeof document !== 'undefined') {
        // Dynamic Browser Title Tab
        if (siteSettings.siteTitle) {
          document.title = `${siteSettings.siteTitle} | ${siteSettings.tagline}`;
        }

        // Dynamic Favicon Update
        if (siteSettings.faviconUrl || siteSettings.logoUrl) {
          const iconUrl = siteSettings.faviconUrl || siteSettings.logoUrl;
          const links = document.querySelectorAll("link[rel*='icon']");
          if (links.length > 0) {
            links.forEach(l => l.setAttribute('href', iconUrl!));
          } else {
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = iconUrl!;
            document.head.appendChild(link);
          }
        }

        // Dynamic Meta Description & OpenGraph Tags
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && siteSettings.metaDescription) {
          metaDesc.setAttribute('content', siteSettings.metaDescription);
        }
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && siteSettings.metaDescription) {
          ogDesc.setAttribute('content', siteSettings.metaDescription);
        }
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && siteSettings.siteTitle) {
          ogTitle.setAttribute('content', `${siteSettings.siteTitle} | ${siteSettings.tagline}`);
        }
        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg && (siteSettings.logoUrl || siteSettings.ceoPhotoUrl)) {
          ogImg.setAttribute('content', siteSettings.logoUrl || siteSettings.ceoPhotoUrl || '');
        }

        // Google AdSense meta tag sync
        if (googleAdsConfig?.publisherId) {
          let adsMeta = document.querySelector('meta[name="google-adsense-account"]');
          if (!adsMeta) {
            adsMeta = document.createElement('meta');
            adsMeta.setAttribute('name', 'google-adsense-account');
            document.head.appendChild(adsMeta);
          }
          adsMeta.setAttribute('content', googleAdsConfig.publisherId);
        }
      }
    } catch (e) {
      console.warn('DOM SEO and favicon update notice:', e);
    }
  }, [siteSettings, googleAdsConfig]);

  const logDispatch = useCallback(
    (dispatch: Omit<EmailDispatch, 'id' | 'sentAt' | 'status'>) => {
      const newEntry: EmailDispatch = {
        ...dispatch,
        id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sentAt: new Date().toISOString(),
        status: 'delivered'
      };
      setEmailLogs(prev => [newEntry, ...prev.slice(0, 49)]);
      return newEntry;
    },
    []
  );

  const saveEquityDossier = async (dossierData: Partial<EquityDossier>): Promise<EquityDossier> => {
    const slug =
      dossierData.slug ||
      dossierData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `dossier-${Date.now()}`;
    const newDossier: EquityDossier = {
      id: dossierData.id || `dossier-${Date.now()}`,
      slug,
      title: dossierData.title || 'Untitled Equity Dossier',
      companyName: dossierData.companyName || 'NGX Listed Corporation',
      ticker: dossierData.ticker || 'NGX',
      sector: dossierData.sector || 'Banking',
      convictionRating: dossierData.convictionRating || 'BUY',
      currentPrice: dossierData.currentPrice || '₦0.00',
      targetPrice: dossierData.targetPrice || '₦0.00',
      upsidePercent: dossierData.upsidePercent || '0.0%',
      multiples: dossierData.multiples || {
        pe: '4.0x',
        pb: '0.8x',
        dividendYield: '8.0%',
        roe: '20.0%',
        marketCap: '₦1.00 Trillion'
      },
      valuationTable: dossierData.valuationTable || [],
      executiveSummary: dossierData.executiveSummary || '',
      investmentThesis: dossierData.investmentThesis || '',
      businessOverview: dossierData.businessOverview || '',
      financialDiagnostics: dossierData.financialDiagnostics || '',
      catalystsAndRisks: dossierData.catalystsAndRisks || '',
      valuationAndPriceTarget: dossierData.valuationAndPriceTarget || '',
      coverImage: dossierData.coverImage || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      tearSheetPdfUrl: dossierData.tearSheetPdfUrl || '/transcripts/PSA-Financial-Chronicle-VOL-LIII.docx',
      whatsappTeaser: dossierData.whatsappTeaser || '',
      metaTitle: dossierData.metaTitle || `${dossierData.title} | PSA Investment`,
      metaDescription: dossierData.metaDescription || dossierData.executiveSummary?.slice(0, 160) || '',
      author: dossierData.author || 'Salami Abdullahi A.',
      publishedAt: dossierData.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEquityDossiers(prev => {
      const idx = prev.findIndex(d => d.id === newDossier.id || d.slug === newDossier.slug);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newDossier;
        return updated;
      }
      return [newDossier, ...prev];
    });

    return newDossier;
  };

  const deleteEquityDossier = async (id: string): Promise<void> => {
    setEquityDossiers(prev => prev.filter(d => d.id !== id && d.slug !== id));
  };

  const getDossierBySlug = useCallback(
    (slug: string) => {
      return equityDossiers.find(d => d.slug === slug || d.id === slug);
    },
    [equityDossiers]
  );

  const saveMarketBriefing = async (briefingData: Partial<MarketBriefing>): Promise<MarketBriefing> => {
    const slug =
      briefingData.slug ||
      `ngx-pre-market-briefing-${briefingData.date || new Date().toISOString().split('T')[0]}`;
    const newBriefing: MarketBriefing = {
      id: briefingData.id || `briefing-${Date.now()}`,
      slug,
      title: briefingData.title || `NGX Pre-Market Briefing: ${briefingData.date}`,
      date: briefingData.date || new Date().toISOString().split('T')[0],
      volume: briefingData.volume || 'VOL. LVIII',
      asiSnapshot: briefingData.asiSnapshot || {
        asi: '252,500.00 pts',
        dayChange: '+0.15%',
        marketCap: '₦164.00 Trillion',
        volume: '1.20 Billion units',
        value: '₦35.00 Billion',
        deals: '25,000 deals',
        breadth: 'Positive (1.2x)'
      },
      topGainers: briefingData.topGainers || [],
      topLosers: briefingData.topLosers || [],
      moverDrivers: briefingData.moverDrivers,
      corporateDisclosures: briefingData.corporateDisclosures || [],
      macroDrivers: briefingData.macroDrivers || [],
      tacticalPlaybook: briefingData.tacticalPlaybook || [],
      youtubeUrl: briefingData.youtubeUrl,
      leadArticle: briefingData.leadArticle || '',
      whatsappTeaser: briefingData.whatsappTeaser || '',
      publishedAt: briefingData.publishedAt || new Date().toISOString()
    };

    setMarketBriefings(prev => {
      const idx = prev.findIndex(b => b.id === newBriefing.id || b.slug === newBriefing.slug);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newBriefing;
        return updated;
      }
      return [newBriefing, ...prev];
    });

    return newBriefing;
  };

  const deleteMarketBriefing = async (id: string): Promise<void> => {
    setMarketBriefings(prev => prev.filter(b => b.id !== id && b.slug !== id));
  };

  const getBriefingBySlug = useCallback(
    (slug: string) => {
      return marketBriefings.find(b => b.slug === slug || b.id === slug);
    },
    [marketBriefings]
  );

  const addSubscriberLead = async (
    data: Omit<SubscriberLead, 'id' | 'subscribedAt'>
  ): Promise<SubscriberLead> => {
    const newLead: SubscriberLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      whatsapp: data.whatsapp?.trim(),
      dossierSlug: data.dossierSlug,
      subscribedAt: new Date().toISOString(),
      source: data.source || 'research-tear-sheet'
    };

    setSubscriberLeads(prev => [newLead, ...prev]);

    return newLead;
  };

  const saveReport = async (reportData: Partial<ResearchReport>): Promise<ResearchReport> => {
    const id = reportData.id || `report-${Date.now()}`;
    const now = new Date().toISOString();
    const completeReport: ResearchReport = {
      id,
      title: reportData.title || 'Untitled Report',
      summary: reportData.summary || '',
      body: reportData.body || '',
      category: reportData.category || 'Market Report',
      coverImage: reportData.coverImage || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      pdfUrl: reportData.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      access: reportData.access || 'public',
      status: reportData.status || 'published',
      author: reportData.author || 'Salami Abdullahi',
      readTime: reportData.readTime || '8 min read',
      downloadCount: reportData.downloadCount || 0,
      viewsCount: reportData.viewsCount || 0,
      ticker: reportData.ticker,
      targetPrice: reportData.targetPrice,
      recommendation: reportData.recommendation || 'Buy',
      createdAt: reportData.createdAt || now,
      updatedAt: now
    };

    setReports(prev => {
      const idx = prev.findIndex(r => r.id === id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = completeReport;
        return updated;
      }
      return [completeReport, ...prev];
    });

    return completeReport;
  };

  const deleteReport = async (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const incrementReportView = async (id: string) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, viewsCount: (r.viewsCount || 0) + 1 } : r))
    );
  };

  const logReportDownload = async (
    reportId: string,
    memberId: string,
    memberEmail: string,
    fileId?: string
  ): Promise<DownloadLog> => {
    const report = reports.find(r => r.id === reportId);
    const newLog: DownloadLog = {
      id: `download-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      memberId,
      memberEmail,
      reportId,
      fileId: fileId || `pdf-${reportId}`,
      reportTitle: report?.title || 'Research Document',
      timestamp: new Date().toISOString()
    };

    setDownloadLogs(prev => [newLog, ...prev]);
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r))
    );

    return newLog;
  };

  const saveVideo = async (videoData: Partial<LearningVideo>): Promise<LearningVideo> => {
    const id = videoData.id || `video-${Date.now()}`;
    const now = new Date().toISOString();

    let ytId = videoData.youtubeId || '';
    if (!ytId && videoData.youtubeUrl) {
      const match = videoData.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) ytId = match[1];
    }
    if (!ytId) ytId = 'dQw4w9WgXcQ';

    const completeVideo: LearningVideo = {
      id,
      title: videoData.title || 'Untitled Learning Video',
      description: videoData.description || '',
      youtubeUrl: videoData.youtubeUrl || `https://www.youtube.com/watch?v=${ytId}`,
      youtubeId: ytId,
      topicTag: videoData.topicTag || 'NGX Basics',
      thumbnailUrl: videoData.thumbnailUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
      status: videoData.status || 'published',
      clicksToYouTube: videoData.clicksToYouTube || 0,
      duration: videoData.duration || '15:00',
      createdAt: videoData.createdAt || now,
      updatedAt: now
    };

    setVideos(prev => {
      const idx = prev.findIndex(v => v.id === id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = completeVideo;
        return updated;
      }
      return [completeVideo, ...prev];
    });

    return completeVideo;
  };

  const deleteVideo = async (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const trackVideoClick = async (id: string) => {
    setVideos(prev =>
      prev.map(v => (v.id === id ? { ...v, clicksToYouTube: (v.clicksToYouTube || 0) + 1 } : v))
    );
  };

  const approveMember = async (uid: string) => {
    const member = members.find(m => m.uid === uid);
    if (!member) return;

    const now = new Date().toISOString();
    setMembers(prev =>
      prev.map(m => {
        if (m.uid === uid) {
          return { ...m, status: 'active', approvedAt: now, updatedAt: now };
        }
        // Increment referrer count
        if (member.referredBy && m.referralCode === member.referredBy) {
          return { ...m, referralCount: m.referralCount + 1, updatedAt: now };
        }
        return m;
      })
    );

    logDispatch({
      recipientEmail: member.email,
      recipientName: member.fullName,
      templateType: 'membership_approved',
      subject: 'Welcome to the Circle: Your PSA Analyst Circle Account is Active',
      body: `Hello ${member.fullName},\n\nCongratulations! Your application to the PSA Analyst Circle has been approved by the Chief Analyst. You can now log into your member dashboard to access institutional equity research, proprietary valuation models, and downloadable PDF investment memos.\n\nAccess your dashboard: https://psainvestment.com/portal\n\nBest regards,\nSalami Abdullahi\nFounder, CEO, COO, & Chief Analyst\nPSA Investment`
    });
  };

  const rejectMember = async (uid: string, note?: string) => {
    const member = members.find(m => m.uid === uid);
    if (!member) return;

    const now = new Date().toISOString();
    setMembers(prev =>
      prev.map(m => (m.uid === uid ? { ...m, status: 'rejected', updatedAt: now } : m))
    );

    logDispatch({
      recipientEmail: member.email,
      recipientName: member.fullName,
      templateType: 'membership_rejected',
      subject: 'Update Regarding Your PSA Analyst Circle Application',
      body: `Hello ${member.fullName},\n\nThank you for your interest in the PSA Analyst Circle. At this time, we are unable to approve your application for membership in this intake cohort.\n\n${
        note ? `Note: ${note}\n\n` : ''
      }You can continue accessing our public market commentary and free learning videos on PSA Lens.\n\nBest regards,\nPSA Investment Admissions Committee`
    });
  };

  const suspendMember = async (uid: string) => {
    const now = new Date().toISOString();
    setMembers(prev =>
      prev.map(m => (m.uid === uid ? { ...m, status: 'suspended', updatedAt: now } : m))
    );
  };

  const reinstateMember = async (uid: string) => {
    const now = new Date().toISOString();
    setMembers(prev =>
      prev.map(m => (m.uid === uid ? { ...m, status: 'active', updatedAt: now } : m))
    );
  };

  const updateMemberRecord = async (uid: string, data: Partial<Member>) => {
    const now = new Date().toISOString();
    setMembers(prev =>
      prev.map(m => (m.uid === uid ? { ...m, ...data, updatedAt: now } : m))
    );
  };

  const DEFAULT_ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
    admin: [
      'Full Executive Command',
      'Publish Research & DCF Models',
      'Authorize Chronicle Editions',
      'Approve Circle Members',
      'Assign Staff Access & Roles',
      'Manage Billing & Treasury'
    ],
    management: [
      'Executive Oversight & Performance Tracking',
      'Member Review Workflow',
      'Operational Reporting',
      'Vendor & Compliance Management'
    ],
    social_media_director: [
      'PSA Lens Masterclasses Management',
      'YouTube & Social Video Scheduling',
      'X (@salami_abdulslm) Market Snippets',
      'Public Dispatches & Community Engagement'
    ],
    analyst: [
      'Draft Equity Research Reports',
      'DCF & Multiple Valuation Modeling',
      'Pre-Market Chronicle Drafting',
      'NGX Order Flow & Barometer Analytics'
    ],
    partners: [
      'Commercial Solar PaaS Financing',
      'Institutional Deal Structuring',
      'SME Capital Syndication',
      'Partner Roundtables & Joint Ventures'
    ]
  };

  const addStaffMember = async (
    data: Omit<StaffMember, 'id' | 'assignedAt'>
  ): Promise<StaffMember> => {
    const newStaff: StaffMember = {
      ...data,
      id: `staff-${data.role}-${Date.now()}`,
      assignedAt: new Date().toISOString(),
      showOnAboutPage: data.showOnAboutPage ?? true,
      bio: data.bio || data.notes || '',
      permissions:
        data.permissions && data.permissions.length > 0
          ? data.permissions
          : DEFAULT_ROLE_PERMISSIONS[data.role] || []
    };
    setStaffMembers(prev => [newStaff, ...prev]);
    return newStaff;
  };

  const updateStaffRole = async (
    id: string,
    role: StaffRole,
    title?: string,
    permissions?: string[]
  ) => {
    setStaffMembers(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        return {
          ...s,
          role,
          title: title || s.title,
          permissions: permissions || DEFAULT_ROLE_PERMISSIONS[role] || s.permissions
        };
      })
    );
  };

  const updateStaffStatus = async (id: string, status: 'active' | 'suspended') => {
    setStaffMembers(prev =>
      prev.map(s => (s.id === id ? { ...s, status } : s))
    );
  };

  const updateStaffRecord = async (id: string, data: Partial<StaffMember>) => {
    setStaffMembers(prev =>
      prev.map(s => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const toggleStaffAboutVisibility = async (id: string, show: boolean) => {
    setStaffMembers(prev =>
      prev.map(s => (s.id === id ? { ...s, showOnAboutPage: show } : s))
    );
  };

  const deleteStaffMember = async (id: string) => {
    setStaffMembers(prev => prev.filter(s => s.id !== id));
  };

  const addComment = async (
    data: Omit<ResourceComment, 'id' | 'createdAt' | 'likes'>
  ): Promise<ResourceComment> => {
    // Security check: SQL injection & XSS
    const sqlCheck = checkSqlSafety(data.content);
    if (!sqlCheck.isSafe) {
      logSecurityEvent(
        'SQL Injection Attempt Intercepted',
        data.authorEmail || data.authorName,
        'input_threat',
        `Pattern '${sqlCheck.detectedPattern}' neutralized in comment payload.`,
        'high'
      );
    }
    const cleanContent = sanitizeText(sqlCheck.sanitized, 2000);
    const cleanAuthor = sanitizeText(data.authorName, 100);

    const newComment: ResourceComment = {
      ...data,
      authorName: cleanAuthor,
      content: cleanContent,
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    setComments(prev => [newComment, ...prev]);
    return newComment;
  };

  const deleteComment = async (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const likeComment = async (id: string) => {
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );
  };

  const submitContactForm = async (
    data: Omit<ContactSubmission, 'id' | 'status' | 'createdAt'>
  ) => {
    // Security check on all text inputs
    const sqlCheck = checkSqlSafety(`${data.name} ${data.message} ${data.subject || ''}`);
    if (!sqlCheck.isSafe) {
      logSecurityEvent(
        'SQL Injection Pattern Disarmed',
        data.email,
        'input_threat',
        `Detected pattern '${sqlCheck.detectedPattern}' in contact form input.`,
        'high'
      );
    }

    const newSubmission: ContactSubmission = {
      ...data,
      name: sanitizeText(data.name, 120),
      email: sanitizeText(data.email, 120),
      phone: data.phone ? sanitizeText(data.phone, 40) : undefined,
      subject: sanitizeText(data.subject || '', 150),
      service: sanitizeText(data.service || '', 100),
      message: sanitizeText(data.message, 3000),
      id: `contact-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    setContactSubmissions(prev => [newSubmission, ...prev]);
  };

  const updateContactStatus = async (id: string, status: 'unread' | 'reviewed' | 'archived') => {
    setContactSubmissions(prev =>
      prev.map(c => (c.id === id ? { ...c, status } : c))
    );
  };

  const deleteContact = async (id: string) => {
    setContactSubmissions(prev => prev.filter(c => c.id !== id));
  };

  const subscribeNewsletter = async (
    email: string,
    fullName?: string,
    preferences: string[] = ['Weekly Research Notes', 'Banking Recapitalization'],
    source: string = 'website'
  ): Promise<NewsletterSubscriber> => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = subscribers.find(s => s.email === cleanEmail);
    if (existing) return existing;

    const newSub: NewsletterSubscriber = {
      id: `sub-${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
      email: cleanEmail,
      fullName: fullName?.trim(),
      subscribedAt: new Date().toISOString(),
      status: 'active',
      source,
      preferences
    };

    setSubscribers(prev => [newSub, ...prev]);
    return newSub;
  };

  const addStorageFile = async (fileData: Omit<StorageFile, 'id' | 'uploadedAt'>) => {
    const newFile: StorageFile = {
      ...fileData,
      id: `file-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    setStorageFiles(prev => [newFile, ...prev]);
  };

  const deleteStorageFile = async (id: string) => {
    setStorageFiles(prev => prev.filter(f => f.id !== id));
  };

  const saveChronicle = async (chronicleData: Partial<ChronicleEdition>): Promise<ChronicleEdition> => {
    let result: ChronicleEdition;
    if (chronicleData.id) {
      setChronicles(prev => {
        const index = prev.findIndex(c => c.id === chronicleData.id);
        if (index >= 0) {
          const updated = {
            ...prev[index],
            ...chronicleData
          } as ChronicleEdition;
          result = updated;
          const newArr = [...prev];
          newArr[index] = updated;
          return newArr;
        }
        result = chronicleData as ChronicleEdition;
        return [chronicleData as ChronicleEdition, ...prev];
      });
    } else {
      const now = new Date().toISOString();
      const newChronicle: ChronicleEdition = {
        id: `chronicle-${Date.now()}`,
        slug: (chronicleData.headline || 'pre-market-intelligence')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 50),
        title: chronicleData.title || 'THE PSA FINANCIAL CHRONICLE',
        subtitle: chronicleData.subtitle || 'Verified Pre-Market Intelligence Briefing for Institutional Partners, Stockbrokers & Analysts',
        volume: chronicleData.volume || `VOL. ${chronicles.length + 1}`,
        editionDate: chronicleData.editionDate || new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        briefingTime: chronicleData.briefingTime || '07:00 WAT',
        headline: chronicleData.headline || 'Pre-Market Intelligence Dispatch',
        subheadline: chronicleData.subheadline || 'Institutional overview of trading metrics and order flows.',
        leadArticle: chronicleData.leadArticle || '',
        marketBarometers: chronicleData.marketBarometers || [],
        topGainers: chronicleData.topGainers || [],
        topLosers: chronicleData.topLosers || [],
        bellwethers: chronicleData.bellwethers || [],
        macroBenchmarks: chronicleData.macroBenchmarks || [],
        tacticalPlaybook: chronicleData.tacticalPlaybook || [],
        rawText: chronicleData.rawText || '',
        docxUrl: chronicleData.docxUrl,
        docxFileName: chronicleData.docxFileName,
        formattedHtml: chronicleData.formattedHtml,
        fileSizeBytes: chronicleData.fileSizeBytes,
        pdfUrl: chronicleData.pdfUrl,
        status: chronicleData.status || 'published',
        source: chronicleData.source || 'admin_upload',
        downloadCount: 0,
        viewCount: 0,
        createdAt: now,
        publishedAt: now
      };
      result = newChronicle;
      setChronicles(prev => [newChronicle, ...prev]);
    }
    return result!;
  };

  const deleteChronicle = async (id: string) => {
    setChronicles(prev => prev.filter(c => c.id !== id));
  };

  const incrementChronicleView = async (id: string) => {
    setChronicles(prev =>
      prev.map(c => (c.id === id ? { ...c, viewCount: c.viewCount + 1 } : c))
    );
  };

  const logChronicleDownload = async (chronicleId: string, memberEmail?: string) => {
    const chron = chronicles.find(c => c.id === chronicleId);
    setChronicles(prev =>
      prev.map(c => (c.id === chronicleId ? { ...c, downloadCount: c.downloadCount + 1 } : c))
    );
    const newLog: DownloadLog = {
      id: `download-chron-${Date.now()}`,
      memberId: 'public-download',
      memberEmail: memberEmail || 'public-reader@psa-investment.ai.studio',
      reportId: chronicleId,
      fileId: `pdf-${chronicleId}`,
      reportTitle: chron ? `${chron.title} (${chron.volume})` : 'The PSA Financial Chronicle',
      timestamp: new Date().toISOString()
    };
    setDownloadLogs(prev => [newLog, ...prev]);
  };

  const autoPublishGeminiChronicle = async (rawText: string, customVolume?: string): Promise<ChronicleEdition> => {
    const parsed = parseRawChronicle(rawText);
    const now = new Date().toISOString();
    const newChronicle: ChronicleEdition = {
      id: `chronicle-gemini-${Date.now()}`,
      slug: (parsed.headline || 'pre-market-dispatch')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 50),
      title: parsed.title || 'THE PSA FINANCIAL CHRONICLE',
      subtitle: parsed.subtitle || 'Verified Pre-Market Intelligence Briefing for Institutional Partners, Stockbrokers & Analysts',
      volume: customVolume || parsed.volume || `VOL. ${chronicles.length + 1}`,
      editionDate: parsed.editionDate || new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      briefingTime: parsed.briefingTime || '07:00 WAT',
      headline: parsed.headline || 'NGX Pre-Market Daily Intelligence Briefing',
      subheadline: parsed.subheadline || 'Institutional overview of NGX order flows and price metrics.',
      leadArticle: parsed.leadArticle || '',
      marketBarometers: parsed.marketBarometers || [],
      topGainers: parsed.topGainers || [],
      topLosers: parsed.topLosers || [],
      bellwethers: parsed.bellwethers || [],
      macroBenchmarks: parsed.macroBenchmarks || [],
      tacticalPlaybook: parsed.tacticalPlaybook || [],
      rawText: rawText,
      status: 'published',
      source: 'gemini_automation',
      downloadCount: 0,
      viewCount: 1,
      createdAt: now,
      publishedAt: now
    };
    setChronicles(prev => [newChronicle, ...prev]);
    return newChronicle;
  };

  const publishWordDocumentChronicle = async (data: {
    rawText: string;
    docxUrl: string;
    docxFileName: string;
    formattedHtml: string;
    fileSizeBytes: number;
    customVolume?: string;
  }): Promise<ChronicleEdition> => {
    const parsed = parseRawChronicle(data.rawText);
    const now = new Date().toISOString();
    const newChronicle: ChronicleEdition = {
      id: `chronicle-docx-${Date.now()}`,
      slug: (parsed.headline || data.docxFileName.replace(/\.docx$/i, '') || 'transcript')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 50),
      title: parsed.title || 'THE PSA FINANCIAL CHRONICLE & TRANSCRIPTS',
      subtitle:
        parsed.subtitle ||
        'Verified Pre-Market Intelligence Briefing & Official Institutional Transcripts',
      volume: data.customVolume || parsed.volume || `VOL. ${chronicles.length + 1}`,
      editionDate:
        parsed.editionDate ||
        new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
      briefingTime: parsed.briefingTime || '07:00 WAT',
      headline:
        parsed.headline ||
        data.docxFileName.replace(/\.docx$/i, '').replace(/[-_]/g, ' ') ||
        'PSA Institutional Financial Transcript',
      subheadline:
        parsed.subheadline ||
        'Official formatted Microsoft Word market transcript and intelligence document.',
      leadArticle: parsed.leadArticle || '',
      marketBarometers: parsed.marketBarometers || [],
      topGainers: parsed.topGainers || [],
      topLosers: parsed.topLosers || [],
      gainerDrivers: parsed.gainerDrivers || [],
      loserDrivers: parsed.loserDrivers || [],
      bellwethers: parsed.bellwethers || [],
      corporateActions: parsed.corporateActions || [],
      macroBenchmarks: parsed.macroBenchmarks || [],
      tacticalPlaybook: parsed.tacticalPlaybook || [],
      rawText: data.rawText,
      docxUrl: data.docxUrl,
      docxFileName: data.docxFileName,
      formattedHtml: sanitizeSafeHtml(data.formattedHtml),
      fileSizeBytes: data.fileSizeBytes,
      status: 'published',
      source: 'admin_upload',
      downloadCount: 0,
      viewCount: 1,
      createdAt: now,
      publishedAt: now
    };
    logSecurityEvent(
      'Word Document Transcript Ingested',
      'Chief Analyst Desk',
      'admin_action',
      `Published ${data.docxFileName} (${(data.fileSizeBytes / 1024).toFixed(1)} KB) with verified formatting.`,
      'low'
    );
    setChronicles(prev => [newChronicle, ...prev]);
    return newChronicle;
  };

  const saveEvent = async (eventData: Partial<EventProgram>): Promise<EventProgram> => {
    let result: EventProgram;
    const now = new Date().toISOString();
    if (eventData.id) {
      setEvents(prev => {
        const index = prev.findIndex(e => e.id === eventData.id);
        if (index >= 0) {
          const updated = {
            ...prev[index],
            ...eventData,
            updatedAt: now
          } as EventProgram;
          result = updated;
          const copy = [...prev];
          copy[index] = updated;
          return copy;
        }
        result = eventData as EventProgram;
        return [result, ...prev];
      });
    } else {
      const newEvent: EventProgram = {
        id: `event-${Date.now()}`,
        slug: (eventData.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
        title: sanitizeText(eventData.title || 'New Event Program', 150),
        category: eventData.category || 'training',
        description: sanitizeText(eventData.description || '', 2000),
        learningObjectives: eventData.learningObjectives || [],
        targetAudience: sanitizeText(eventData.targetAudience || 'Capital market participants', 200),
        instructor: sanitizeText(eventData.instructor || 'Salami Abdullahi', 100),
        instructorTitle: sanitizeText(eventData.instructorTitle || 'Chief Analyst, PSA Investment', 120),
        instructorPhoto: eventData.instructorPhoto || '/salami-abdullahi.jpg',
        startDate: eventData.startDate || '2026-11-28',
        endDate: eventData.endDate,
        startTime: eventData.startTime || '10:00 WAT',
        endTime: eventData.endTime || '16:00 WAT',
        timezone: eventData.timezone || 'WAT',
        locationType: eventData.locationType || 'virtual',
        venue: sanitizeText(eventData.venue || 'Virtual Executive Suite', 200),
        capacity: eventData.capacity || 100,
        registrationDeadline: eventData.registrationDeadline || '2026-11-27',
        price: eventData.price || 'Complimentary',
        status: eventData.status || 'upcoming',
        badge: eventData.badge,
        customFormFields: eventData.customFormFields || [],
        createdAt: now,
        updatedAt: now
      };
      result = newEvent;
      setEvents(prev => [newEvent, ...prev]);
    }

    logSecurityEvent(
      'Event Program Saved',
      'Executive Admin Desk',
      'admin_action',
      `Event "${result!.title}" configured with ${result!.customFormFields?.length || 0} custom registration fields.`,
      'low'
    );
    return result!;
  };

  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    logSecurityEvent(
      'Event Program Removed',
      'Executive Admin Desk',
      'admin_action',
      `Event ID ${id} deleted from active database.`,
      'medium'
    );
  };

  const registerForEvent = async (eventId: string, data: {
    fullName: string;
    email: string;
    phone: string;
    organization?: string;
    jobTitle?: string;
    responses: Record<string, any>;
  }): Promise<EventRegistration> => {
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found or has concluded.');

    // Security check on inputs
    const check = checkSqlSafety(`${data.fullName} ${data.email} ${data.organization || ''}`);
    if (!check.isSafe) {
      logSecurityEvent(
        'SQL Injection Pattern Disarmed in Event Registration',
        data.email,
        'input_threat',
        `Disarmed pattern '${check.detectedPattern}' in event registration payload.`,
        'high'
      );
    }

    const ticketSuffix = Math.floor(1000 + Math.random() * 9000);
    const categoryPrefix = event.category.toUpperCase().slice(0, 4);
    const ticketCode = `PSA-${categoryPrefix}-${ticketSuffix}`;

    const newReg: EventRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      eventTitle: event.title,
      fullName: sanitizeText(data.fullName, 120),
      email: sanitizeText(data.email, 120),
      phone: sanitizeText(data.phone, 40),
      organization: data.organization ? sanitizeText(data.organization, 150) : undefined,
      jobTitle: data.jobTitle ? sanitizeText(data.jobTitle, 100) : undefined,
      responses: data.responses,
      ticketCode,
      registeredAt: new Date().toISOString(),
      status: 'confirmed'
    };

    setEventRegistrations(prev => [newReg, ...prev]);

    // Send confirmation email dispatch log
    logDispatch({
      recipientEmail: newReg.email,
      recipientName: newReg.fullName,
      templateType: 'event_announcement',
      subject: `Registration Confirmed: ${event.title} [Ticket: ${ticketCode}]`,
      body: `Dear ${newReg.fullName},\n\nYour registration for "${event.title}" has been confirmed.\n\nDate: ${event.startDate}\nTime: ${event.startTime} - ${event.endTime} (${event.timezone})\nVenue: ${event.venue}\nTicket Code: ${ticketCode}\n\nWe look forward to hosting you.\n\nPSA Investment Executive Desk`
    });

    logSecurityEvent(
      'Event Registration Confirmed',
      newReg.email,
      'admin_action',
      `Registered for ${event.title} with ticket ${ticketCode}`,
      'low'
    );

    return newReg;
  };

  const saveAnnouncement = async (announcementData: Partial<Announcement>): Promise<Announcement> => {
    let result: Announcement;
    const now = new Date().toISOString();
    if (announcementData.id) {
      setAnnouncements(prev => {
        const index = prev.findIndex(a => a.id === announcementData.id);
        if (index >= 0) {
          const updated = { ...prev[index], ...announcementData } as Announcement;
          result = updated;
          const copy = [...prev];
          copy[index] = updated;
          return copy;
        }
        result = announcementData as Announcement;
        return [result, ...prev];
      });
    } else {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title: sanitizeText(announcementData.title || 'New Announcement', 150),
        summary: sanitizeText(announcementData.summary || '', 300),
        content: sanitizeText(announcementData.content || '', 3000),
        category: announcementData.category || 'event',
        urgency: announcementData.urgency || 'normal',
        popupAlert: announcementData.popupAlert ?? true,
        emailBroadcast: announcementData.emailBroadcast ?? true,
        whatsappBroadcast: announcementData.whatsappBroadcast ?? true,
        targetAudience: announcementData.targetAudience || 'all',
        linkUrl: announcementData.linkUrl || '/events',
        linkText: announcementData.linkText || 'Learn More',
        createdAt: now
      };
      result = newAnn;
      setAnnouncements(prev => [newAnn, ...prev]);

      if (newAnn.emailBroadcast) {
        members.forEach(m => {
          logDispatch({
            recipientEmail: m.email,
            recipientName: m.fullName,
            templateType: 'event_announcement',
            subject: `Announcement: ${newAnn.title}`,
            body: `Dear ${m.fullName},\n\n${newAnn.content}\n\nRead more: https://psa-investment.ai.studio${newAnn.linkUrl}\n\nPSA Investment Desk`
          });
        });
      }
    }
    return result!;
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const dismissAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  const updateGoogleAdsConfig = (config: Partial<GoogleAdsConfig>) => {
    setGoogleAdsConfig(prev => ({ ...prev, ...config }));
    logSecurityEvent(
      'Google Ads Configuration Updated',
      'Executive Admin Desk',
      'admin_action',
      `Google Ads status: ${config.enabled ? 'Enabled' : 'Disabled'}.`,
      'low'
    );
  };

  const exportEventRegistrationsToCsv = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const regs = eventRegistrations.filter(r => r.eventId === eventId);
    if (!event) return;

    const headers = [
      'Ticket Code',
      'Full Name',
      'Email',
      'Phone',
      'Organization',
      'Job Title',
      'Registration Date',
      'Status'
    ];

    const customFields = event.customFormFields || [];
    customFields.forEach(f => headers.push(f.label));

    const rows = regs.map(r => {
      const standardCols = [
        `"${r.ticketCode}"`,
        `"${r.fullName.replace(/"/g, '""')}"`,
        `"${r.email.replace(/"/g, '""')}"`,
        `"${r.phone.replace(/"/g, '""')}"`,
        `"${(r.organization || '').replace(/"/g, '""')}"`,
        `"${(r.jobTitle || '').replace(/"/g, '""')}"`,
        `"${new Date(r.registeredAt).toLocaleString()}"`,
        `"${r.status}"`
      ];

      customFields.forEach(f => {
        const val = r.responses?.[f.id];
        const strVal = val === true ? 'Yes' : val === false ? 'No' : String(val || '');
        standardCols.push(`"${strVal.replace(/"/g, '""')}"`);
      });

      return standardCols.join(',');
    });

    const csvContent = [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `PSA_Registrations_${event.slug}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerEventBroadcast = async (eventId: string, channels: { email: boolean; whatsapp: boolean }): Promise<{ emailsSent: number; whatsappUrl: string }> => {
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');

    let emailsSent = 0;
    if (channels.email) {
      members.forEach(m => {
        logDispatch({
          recipientEmail: m.email,
          recipientName: m.fullName,
          templateType: 'event_announcement',
          subject: `Executive Event: ${event.title}`,
          body: `Dear ${m.fullName},\n\nWe invite you to participate in "${event.title}".\n\nDate: ${event.startDate}\nTime: ${event.startTime} - ${event.endTime} (${event.timezone})\nVenue: ${event.venue}\nInstructor: ${event.instructor} (${event.instructorTitle})\nPrice: ${event.price}\n\nRegister directly online: https://psa-investment.ai.studio/events\n\nPSA Investment Desk`
        });
        emailsSent++;
      });
    }

    const waText = `*PSA INVESTMENT CAPITAL INTELLIGENCE*\n*EXECUTIVE EVENT BROADCAST*\n\n📌 *${event.title.toUpperCase()}*\n\n📅 *Date:* ${event.startDate}\n⏰ *Time:* ${event.startTime} - ${event.endTime} (${event.timezone})\n📍 *Venue:* ${event.venue}\n👨‍🏫 *Instructor:* ${event.instructor} (${event.instructorTitle})\n💳 *Access:* ${event.price}\n\n*Program Overview:*\n${event.description}\n\n🔗 *Register Online:* https://psa-investment.ai.studio/events\n\nOfficial Desk: +234 706 837 1292 | psainvestment.ng@gmail.com`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;

    logSecurityEvent(
      'Event Broadcast Approved & Triggered',
      'Executive Admin Desk',
      'admin_action',
      `Broadcast for "${event.title}" sent to ${emailsSent} member emails and generated WhatsApp broadcast link.`,
      'low'
    );

    return { emailsSent, whatsappUrl };
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => {
      const updated = { ...prev, ...settings };
      localStorage.setItem('psa_site_settings', JSON.stringify(updated));
      return updated;
    });
    logSecurityEvent(
      'Site Branding & Settings Updated',
      'Executive Admin Desk',
      'admin_action',
      `Updated site settings: title="${settings.siteTitle || siteSettings.siteTitle}", logoUpdated=${Boolean(settings.logoUrl || settings.faviconUrl)}`,
      'low'
    );
  };

  const registerMemberDirectly = async (newMember: Member) => {
    setMembers(prev => {
      const exists = prev.some(m => m.uid === newMember.uid || m.email.toLowerCase() === newMember.email.toLowerCase());
      if (exists) {
        return prev.map(m => m.uid === newMember.uid ? newMember : m);
      }
      const updated = [newMember, ...prev];
      localStorage.setItem('psa_members', JSON.stringify(updated));
      return updated;
    });

    // Create high-priority admin alert in Announcements
    const regAlert: Announcement = {
      id: `ann-reg-${Date.now()}`,
      title: `New Circle Registration: ${newMember.fullName}`,
      summary: `${newMember.fullName} (${newMember.email}) has registered and is awaiting Chief Analyst review.`,
      content: `${newMember.fullName} (${newMember.email}) has completed 2-step verification and registered. Please review credentials and approve in the Member Desk.`,
      category: 'system',
      urgency: 'high',
      popupAlert: true,
      emailBroadcast: false,
      whatsappBroadcast: false,
      targetAudience: 'all',
      createdAt: new Date().toISOString(),
      dismissed: false
    };
    setAnnouncements(prev => [regAlert, ...prev]);

    // Dispatch simulated outbound notification to Admin email
    logDispatch({
      recipientEmail: 'salamiabdullahi257@gmail.com',
      recipientName: 'Salami Abdullahi',
      templateType: 'membership_approved',
      subject: `[PSA Alert] New Circle Application: ${newMember.fullName}`,
      body: `Executive Notification:\n\nA new user has initiated registration on PSA Investment:\nFull Name: ${newMember.fullName}\nEmail: ${newMember.email}\nPhone: ${newMember.phone || 'N/A'}\nReferral Code: ${newMember.referralCode}\nStatus: ${newMember.status.toUpperCase()}\n\nPlease review and approve this member in the Admin Panel -> Member Desk.`
    });

    logSecurityEvent(
      'New Circle Member Registered',
      newMember.fullName,
      'auth',
      `Registered member ${newMember.email} with initial status: ${newMember.status}`,
      'low'
    );
  };

  const getPublicViews = (rawViews: number): number => {
    if (!siteSettings?.enableSocialProofMultiplier) return rawViews;
    const multiplier = siteSettings.publicMetricMultiplier || 14;
    const offset = siteSettings.publicMetricOffset || 165;
    return Math.max(rawViews * multiplier + offset, rawViews);
  };

  const getPublicDownloads = (rawDownloads: number): number => {
    if (!siteSettings?.enableSocialProofMultiplier) return rawDownloads;
    const multiplier = Math.max(Math.floor((siteSettings.publicMetricMultiplier || 14) * 0.7), 5);
    const offset = Math.floor((siteSettings.publicMetricOffset || 165) * 0.45);
    return Math.max(rawDownloads * multiplier + offset, rawDownloads);
  };

  const logUserActivity = async (uid: string, action: string, details?: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem('psa_user_activity_logs') || '[]');
      existing.unshift({
        id: `act-${Date.now()}`,
        uid,
        action,
        details: details || '',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('psa_user_activity_logs', JSON.stringify(existing.slice(0, 500)));
    } catch (e) {
      console.warn('Activity logging error:', e);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <DataContext.Provider
      value={{
        reports,
        equityDossiers,
        marketBriefings,
        subscriberLeads,
        videos,
        members,
        services,
        contactSubmissions,
        downloadLogs,
        emailLogs,
        storageFiles,
        subscribers,
        chronicles,
        staffMembers,
        comments,
        loading,
        saveEquityDossier,
        deleteEquityDossier,
        getDossierBySlug,
        saveMarketBriefing,
        deleteMarketBriefing,
        getBriefingBySlug,
        addSubscriberLead,
        saveReport,
        deleteReport,
        incrementReportView,
        logReportDownload,
        saveVideo,
        deleteVideo,
        trackVideoClick,
        approveMember,
        rejectMember,
        suspendMember,
        reinstateMember,
        updateMemberRecord,
        addStaffMember,
        updateStaffRole,
        updateStaffStatus,
        updateStaffRecord,
        toggleStaffAboutVisibility,
        deleteStaffMember,
        addComment,
        deleteComment,
        likeComment,
        submitContactForm,
        updateContactStatus,
        deleteContact,
        subscribeNewsletter,
        addStorageFile,
        deleteStorageFile,
        saveChronicle,
        deleteChronicle,
        incrementChronicleView,
        logChronicleDownload,
        autoPublishGeminiChronicle,
        publishWordDocumentChronicle,
        events,
        eventRegistrations,
        announcements,
        googleAdsConfig,
        siteSettings,
        saveEvent,
        deleteEvent,
        registerForEvent,
        saveAnnouncement,
        deleteAnnouncement,
        dismissAnnouncement,
        updateGoogleAdsConfig,
        updateSiteSettings,
        registerMemberDirectly,
        getPublicViews,
        getPublicDownloads,
        logUserActivity,
        exportEventRegistrationsToCsv,
        triggerEventBroadcast,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
