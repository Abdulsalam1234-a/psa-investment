export interface Member {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  membershipTier: 'standard' | 'executive' | 'institutional';
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  notes?: string;
  appliedAt: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchReport {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  coverImage: string;
  pdfUrl: string;
  access: 'public' | 'premium';
  status: 'published' | 'draft';
  author: string;
  readTime: string;
  downloadCount: number;
  viewsCount: number;
  ticker?: string;
  targetPrice?: string;
  recommendation?: 'Strong Buy' | 'Buy' | 'Hold' | 'Underweight' | 'Sell';
  createdAt: string;
  updatedAt: string;
}

export interface LearningVideo {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  topicTag: string;
  thumbnailUrl: string;
  status: 'published' | 'draft';
  clicksToYouTube: number;
  duration: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  order: number;
  highlights: string[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  subject: string;
  message: string;
  status: 'unread' | 'reviewed' | 'archived';
  createdAt: string;
}

export interface DownloadLog {
  id: string;
  memberId: string;
  memberEmail: string;
  reportId: string;
  fileId: string;
  reportTitle: string;
  timestamp: string;
}

export interface EmailDispatch {
  id: string;
  recipientEmail: string;
  recipientName: string;
  templateType: 'application_received' | 'membership_approved' | 'membership_rejected' | 'research_broadcast';
  subject: string;
  body: string;
  sentAt: string;
  status: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  fullName?: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  source: string;
  preferences: string[];
}

export interface StorageFile {
  id: string;
  name: string;
  url: string;
  type: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedBy: string;
}

export type ViewTab =
  | 'home'
  | 'about'
  | 'services'
  | 'research'
  | 'videos'
  | 'analyst-circle'
  | 'contact'
  | 'member-portal'
  | 'admin-panel';

export type DemoRole = 'visitor' | 'pending_member' | 'active_member' | 'admin' | null;
