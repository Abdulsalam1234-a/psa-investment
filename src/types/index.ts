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
  templateType: 'application_received' | 'membership_approved' | 'membership_rejected' | 'research_broadcast' | 'event_announcement' | 'password_reset';
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

export interface CorporateActionItem {
  entity: string;
  event: string;
  details: string;
  timeline: string;
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
  gainerDrivers?: string[];
  loserDrivers?: string[];
  bellwethers: BellwetherItem[];
  corporateActions?: CorporateActionItem[];
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
  showOnAboutPage?: boolean;
  bio?: string;
  displayOrder?: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
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
  | 'events'
  | 'about'
  | 'services'
  | 'research'
  | 'videos'
  | 'analyst-circle'
  | 'contact'
  | 'member-portal'
  | 'admin-panel';

export type DemoRole = 'visitor' | 'pending_member' | 'active_member' | 'admin' | null;

// ==========================================
// EVENTS, TRAINING & CUSTOM FORM BUILDER TYPES
// ==========================================

export type FormFieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'radio'
  | 'textarea'
  | 'checkbox';

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select, radio, checkbox
}

export type EventCategory =
  | 'masterclass'
  | 'training'
  | 'webinar'
  | 'conference'
  | 'announcement';

export interface EventProgram {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  description: string;
  learningObjectives: string[];
  targetAudience: string;
  instructor: string;
  instructorTitle: string;
  instructorPhoto?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  startTime: string; // e.g. '10:00 WAT'
  endTime: string;   // e.g. '16:00 WAT'
  timezone: string;
  locationType: 'virtual' | 'physical' | 'hybrid';
  venue: string;
  capacity: number;
  registrationDeadline: string;
  price: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  bannerUrl?: string;
  badge?: string;
  customFormFields: FormFieldDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  jobTitle?: string;
  responses: Record<string, any>;
  ticketCode: string;
  registeredAt: string;
  status: 'confirmed' | 'waitlist' | 'attended';
}

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'event' | 'research' | 'policy' | 'market_update' | 'system';
  urgency: 'normal' | 'high' | 'critical';
  popupAlert: boolean;
  emailBroadcast: boolean;
  whatsappBroadcast: boolean;
  targetAudience: 'all' | 'members_only' | 'public';
  linkUrl?: string;
  linkText?: string;
  createdAt: string;
  dismissed?: boolean;
}

export interface GoogleAdsConfig {
  enabled: boolean;
  publisherId: string;
  leaderboardSlot?: string;
  sidebarSlot?: string;
  inFeedSlot?: string;
  chronicleSlot?: string;
  testMode: boolean;
  estimatedImpressions: number;
  estimatedCpm: number;
}

export interface ManagementMember {
  id: string;
  fullName: string;
  roleTitle: string; // e.g. "Founder, CEO, COO, & Chief Analyst"
  email: string;
  phone?: string;
  bio: string;
  photoUrl: string;
  order: number;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface CompanyPillar {
  id: string;
  number: string; // e.g. "1", "2", "3"
  title: string;
  description: string;
  iconName?: string;
}

export interface FinancialModelShowcase {
  id: string;
  name: string;
  category: string;
  description: string;
  keyOutputs: string[];
  accessLevel: 'public' | 'premium';
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  logoUrl?: string; // Custom uploaded official logo URL or base64 data
  faviconUrl?: string; // Custom favicon URL or base64
  ceoPhotoUrl?: string;
  heroHeadline: string;
  heroSubheadline: string;
  officialEmail: string;
  ceoEmail: string;
  officialPhone: string;
  whatsappChannelUrl: string;
  mediumBlogUrl: string; // Direct link to Medium publication
  announcementTickerText: string;
  showTicker: boolean;
  showDailyChronicleHighlight: boolean;
  showAdsenseOnHome: boolean;
  metaDescription: string;
  metaKeywords: string;
  // Social Proof Multiplier for Public Engagement & Trust
  enableSocialProofMultiplier: boolean;
  publicMetricMultiplier: number;
  publicMetricOffset: number;
  // About Page Customizations
  missionStatement: string;
  visionStatement: string;
  pillars: CompanyPillar[];
  managementTeam: ManagementMember[];
  financialModels: FinancialModelShowcase[];
}

