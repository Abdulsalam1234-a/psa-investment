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
  StorageFile
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_REPORTS,
  INITIAL_VIDEOS,
  INITIAL_MEMBERS,
  INITIAL_STORAGE_FILES,
  INITIAL_DOWNLOAD_LOGS,
  INITIAL_SUBSCRIBERS
} from '../data/initialData';

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
  submitContactForm: (data: Omit<ContactSubmission, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateContactStatus: (id: string, status: 'unread' | 'reviewed' | 'archived') => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  subscribeNewsletter: (email: string, fullName?: string, preferences?: string[], source?: string) => Promise<NewsletterSubscriber>;
  addStorageFile: (file: Omit<StorageFile, 'id' | 'uploadedAt'>) => Promise<void>;
  deleteStorageFile: (id: string) => Promise<void>;
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

  const submitContactForm = async (
    data: Omit<ContactSubmission, 'id' | 'status' | 'createdAt'>
  ) => {
    const newSubmission: ContactSubmission = {
      ...data,
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
        submitContactForm,
        updateContactStatus,
        deleteContact,
        subscribeNewsletter,
        addStorageFile,
        deleteStorageFile,
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
