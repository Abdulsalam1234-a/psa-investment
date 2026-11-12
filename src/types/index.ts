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

export interface MarketBarometer {
  metric: string;
  fridayClose: string;
  thursdayClose: string;
  change: string;
  source: string;
}

export interface StockMover {
  ticker: string;
  name: string;
  close: string;
  change: string;
}

export interface BellwetherItem {
  ticker: string;
  close: string;
  turnover: string;
  signal: string;
  notes: string;
}

export interface MacroBenchmark {
  indicator: string;
  level: string;
  variance: string;
  source: string;
}

export interface ChronicleEdition {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  volume: string;
  editionDate: string;
  briefingTime: string;
  headline: string;
  subheadline: string;
  leadArticle: string;
  marketBarometers: MarketBarometer[];
  topGainers: StockMover[];
  topLosers: StockMover[];
  bellwethers: BellwetherItem[];
  macroBenchmarks: MacroBenchmark[];
  tacticalPlaybook: string[];
  rawText: string;
  pdfUrl?: string;
  docxUrl?: string;
  docxFileName?: string;
  formattedHtml?: string;
  fileSizeBytes?: number;
  status: 'published' | 'draft';
  source: 'gemini_automation' | 'admin_upload';
  downloadCount: number;
  viewCount: number;
  createdAt: string;
  publishedAt: string;
}

export type StaffRole = 'management' | 'social_media_director' | 'analyst' | 'partners' | 'admin';

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: StaffRole;
  title: string;
  department: string;
  status: 'active' | 'suspended';
  assignedAt: string;
  avatarUrl?: string;
  notes?: string;
  permissions: string[];
}

export type ResourceType = 'report' | 'chronicle' | 'video';

export interface ResourceComment {
  id: string;
  resourceId: string;
  resourceType: ResourceType;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorTier: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export type ViewTab =
  | 'home'
  | 'chronicle'
  | 'about'
  | 'services'
  | 'research'
  | 'videos'
  | 'analyst-circle'
  | 'contact'
  | 'member-portal'
  | 'admin-panel';

export type DemoRole = 'visitor' | 'pending_member' | 'active_member' | 'admin' | null;
