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
  ResourceComment
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
  INITIAL_COMMENTS
} from '../data/initialData';
import { INITIAL_CHRONICLES } from '../data/initialChronicles';
import { parseRawChronicle } from '../utils/chronicleParser';
import {
  sanitizeText,
  checkSqlSafety,
  logSecurityEvent,
  sanitizeSafeHtml
} from '../utils/security';

interface DataContextType {
  reports: ResearchReport[];
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
  loading: boolean;
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
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [comments, setComments] = useState<ResourceComment[]>(() => {
    const saved = localStorage.getItem('psa_resource_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [loading, setLoading] = useState<boolean>(false);

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

  const refreshData = async () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <DataContext.Provider
      value={{
        reports,
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
