import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, DemoRole, StaffRole, StaffMember } from '../types';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  validateCredentialSafety,
  logSecurityEvent,
  computeSha256,
  hashCredentialWithSalt,
  generateCryptoSalt,
  AUTHORIZED_SUPERADMIN_EMAILS,
  SUPERADMIN_PASSWORD_HASH,
  SUPERADMIN_PIN_HASH
} from '../utils/security';

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  roleType?: 'super_admin' | 'admin' | 'staff' | 'analyst' | 'member' | 'public';
  staffRole?: StaffRole;
  staffTitle?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  memberProfile: Member | null;
  isAdmin: boolean;
  isSuperUser: boolean;
  isStaff: boolean;
  staffRole: StaffRole | null;
  userRoleTitle: string;
  loading: boolean;
  demoRole: DemoRole;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginStaff: (email: string, pass: string, role?: StaffRole) => Promise<void>;
  loginWithGoogle: (googleEmail?: string, googleName?: string) => Promise<Member>;
  registerWithEmail: (name: string, email: string, pass: string, phone?: string, referralCode?: string) => Promise<Member>;
  sendRegistrationOtp: (email: string, name: string) => Promise<{ otpCode: string; message: string }>;
  verifyRegistrationOtp: (email: string, code: string) => boolean;
  resetPassword: (email: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ resetCode: string; message: string }>;
  verifyAndResetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  loginSuperUser: (masterPinOrKey: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: DemoRole) => void;
  updateMemberProfile: (data: Partial<Member>) => Promise<void>;
  updateAdminProfile: (data: { fullName: string; phone: string; title: string; bio: string; photoUrl?: string }) => Promise<void>;
}

const ADMIN_EMAIL = 'salamiabdullahi257@gmail.com';

export const isAdminEmail = (email?: string): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return AUTHORIZED_SUPERADMIN_EMAILS.some(e => e.toLowerCase() === clean);
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [memberProfile, setMemberProfile] = useState<Member | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [staffRole, setStaffRole] = useState<StaffRole | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [demoRole, setDemoRole] = useState<DemoRole>(null);

  // Helper to generate unique referral code
  const generateReferralCode = (name: string) => {
    const prefix = (name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3) || 'PSA').padEnd(3, 'X');
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PSA-${prefix}${suffix}`;
  };

  // Helper to determine human-readable role title
  const userRoleTitle = (() => {
    if (isAdmin || (currentUser?.email && isAdminEmail(currentUser.email))) {
      return 'Founder, CEO, COO & Chief Analyst';
    }
    if (currentUser?.staffTitle) {
      return currentUser.staffTitle;
    }
    if (staffRole === 'analyst' || currentUser?.roleType === 'analyst') {
      return 'Equity Research Analyst';
    }
    if (staffRole === 'management') {
      return 'Executive Management';
    }
    if (staffRole === 'social_media_director') {
      return 'Social Media & Communications Director';
    }
    if (staffRole === 'partners') {
      return 'Strategic Capital Partner';
    }
    if (memberProfile) {
      return memberProfile.status === 'active' ? 'Analyst Circle Member' : 'Circle Applicant (Pending)';
    }
    return 'Public Visitor';
  })();

  // Check stored session
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('psa_auth_user');
      const storedProfile = localStorage.getItem('psa_member_profile');
      if (storedUser && storedProfile) {
        const u: AuthUser = JSON.parse(storedUser);
        const p: Member = JSON.parse(storedProfile);
        setCurrentUser(u);
        setMemberProfile(p);
        const adminStatus = isAdminEmail(u.email) || p.membershipTier === 'executive';
        setIsAdmin(adminStatus);
        setIsStaff(Boolean(u.staffRole) || u.roleType === 'staff' || u.roleType === 'analyst');
        setStaffRole(u.staffRole || null);
      }
    } catch (e) {
      console.warn('Auth restoration error:', e);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      
      // 1. Rate Limit Defense
      const rateCheck = checkRateLimit(cleanEmail);
      if (!rateCheck.allowed) {
        throw new Error(`Too many failed login attempts. For security, please wait ${rateCheck.retryAfterSeconds} seconds before retrying.`);
      }

      // 2. SQL & XSS Injection Protection
      const emailSafety = validateCredentialSafety(cleanEmail, 'Email Address');
      if (!emailSafety.isValid) throw new Error(emailSafety.error);

      const passSafety = validateCredentialSafety(pass, 'Password');
      if (!passSafety.isValid) throw new Error(passSafety.error);

      if (!cleanEmail || !cleanEmail.includes('@')) {
        recordFailedAttempt(cleanEmail);
        throw new Error('Please enter a valid email address.');
      }
      if (!pass || pass.length < 4) {
        recordFailedAttempt(cleanEmail);
        throw new Error('Please enter your account password.');
      }

      const isAdminLogin = isAdminEmail(cleanEmail);

      // Strict Password Verification via Cryptographic Hash Matching
      if (isAdminLogin) {
        const passHash = await computeSha256(pass);
        if (passHash !== SUPERADMIN_PASSWORD_HASH) {
          recordFailedAttempt(cleanEmail);
          logSecurityEvent('SUPERADMIN_FAILED_AUTH', cleanEmail, 'auth', 'Invalid password attempted for Super Admin account', 'high');
          throw new Error('Authentication Failed: Invalid credentials for Founder & Chief Analyst account.');
        }
      } else {
        // Check if email belongs to a staff member
        const staffList: StaffMember[] = JSON.parse(localStorage.getItem('psa_staff_members') || '[]');
        const matchedStaff = staffList.find(s => s.email.toLowerCase() === cleanEmail && s.status === 'active');

        const credsStore = JSON.parse(localStorage.getItem('psa_user_credentials') || '{}');
        const userCred = credsStore[cleanEmail];

        if (userCred && userCred.passwordHash && userCred.salt) {
          const computed = await hashCredentialWithSalt(pass, userCred.salt);
          if (computed !== userCred.passwordHash) {
            recordFailedAttempt(cleanEmail);
            throw new Error('Authentication Failed: Incorrect account password. Please try again or use Forgot Password.');
          }
        } else if (matchedStaff) {
          if (pass.length < 6) {
            recordFailedAttempt(cleanEmail);
            throw new Error('Staff security passcode must be at least 6 characters.');
          }
        } else {
          const membersList: Member[] = JSON.parse(localStorage.getItem('psa_members') || '[]');
          const existing = membersList.find(m => m.email.toLowerCase() === cleanEmail);
          if (!existing) {
            recordFailedAttempt(cleanEmail);
            throw new Error('Authentication Failed: Account does not exist. Please join the Analyst Circle first.');
          }
          if (pass.length < 6) {
            recordFailedAttempt(cleanEmail);
            throw new Error('Authentication Failed: Password must be at least 6 characters.');
          }
          // Seed initial cryptographic salt and hash
          const salt = generateCryptoSalt();
          const hash = await hashCredentialWithSalt(pass, salt);
          credsStore[cleanEmail] = {
            salt,
            passwordHash: hash,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem('psa_user_credentials', JSON.stringify(credsStore));
        }
      }

      // Check if email belongs to a staff member
      const staffList: StaffMember[] = JSON.parse(localStorage.getItem('psa_staff_members') || '[]');
      const matchedStaff = staffList.find(s => s.email.toLowerCase() === cleanEmail && s.status === 'active');

      const user: AuthUser = {
        uid: isAdminLogin ? 'admin-uid-ceo' : matchedStaff ? matchedStaff.id : 'user-' + cleanEmail.replace(/[^a-z0-9]/g, '_'),
        email: cleanEmail,
        displayName: isAdminLogin ? 'Salami Abdullahi' : matchedStaff ? matchedStaff.fullName : cleanEmail.split('@')[0],
        roleType: isAdminLogin ? 'super_admin' : matchedStaff ? (matchedStaff.role === 'analyst' ? 'analyst' : 'staff') : 'member',
        staffRole: matchedStaff ? matchedStaff.role : undefined,
        staffTitle: matchedStaff ? matchedStaff.title : undefined
      };

      let profile: Member;
      if (isAdminLogin) {
        profile = {
          uid: user.uid,
          fullName: 'Salami Abdullahi',
          email: cleanEmail,
          phone: '+234 706 837 1292',
          membershipTier: 'executive',
          status: 'active',
          referralCode: 'PSA-CEO001',
          referralCount: 32,
          appliedAt: '2026-08-01T00:00:00Z',
          approvedAt: '2026-08-01T00:00:00Z',
          createdAt: '2026-08-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        };
      } else if (matchedStaff) {
        profile = {
          uid: user.uid,
          fullName: matchedStaff.fullName,
          email: cleanEmail,
          phone: matchedStaff.phone || '+234 812 000 0000',
          membershipTier: 'executive',
          status: 'active',
          referralCode: generateReferralCode(matchedStaff.fullName),
          referralCount: 5,
          appliedAt: matchedStaff.assignedAt,
          approvedAt: matchedStaff.assignedAt,
          createdAt: matchedStaff.assignedAt,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Retrieve or generate member profile
        const membersList: Member[] = JSON.parse(localStorage.getItem('psa_members') || '[]');
        const existing = membersList.find(m => m.email.toLowerCase() === cleanEmail);
        profile = existing || {
          uid: user.uid,
          fullName: user.displayName || 'Circle Member',
          email: cleanEmail,
          phone: '+234 812 000 0000',
          membershipTier: 'standard',
          status: 'active',
          referralCode: generateReferralCode(user.displayName || 'PSA'),
          referralCount: 0,
          appliedAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      setCurrentUser(user);
      setMemberProfile(profile);
      setIsAdmin(isAdminLogin || profile.membershipTier === 'executive');
      setIsStaff(Boolean(matchedStaff));
      setStaffRole(matchedStaff ? matchedStaff.role : null);
      setDemoRole(null);

      localStorage.setItem('psa_auth_user', JSON.stringify(user));
      localStorage.setItem('psa_member_profile', JSON.stringify(profile));

      resetRateLimit(cleanEmail);
      logSecurityEvent('USER_LOGIN_SUCCESS', cleanEmail, 'auth', `Authenticated as ${user.roleType}`, 'low');
    } catch (err) {
      recordFailedAttempt(email);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginStaff = async (email: string, pass: string, designatedRole?: StaffRole) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Rate limit check
      const rateCheck = checkRateLimit(cleanEmail);
      if (!rateCheck.allowed) {
        throw new Error(`Too many failed attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.`);
      }

      // Security check
      const emailSafety = validateCredentialSafety(cleanEmail, 'Staff Email');
      if (!emailSafety.isValid) throw new Error(emailSafety.error);

      const passSafety = validateCredentialSafety(pass, 'Staff Password');
      if (!passSafety.isValid) throw new Error(passSafety.error);

      if (!cleanEmail || !cleanEmail.includes('@')) {
        throw new Error('Please enter a valid staff email address.');
      }
      if (!pass || pass.length < 4) {
        throw new Error('Please enter your staff security credentials.');
      }

      // Staff / Admin credential verification
      const isSuperAdminStaff = isAdminEmail(cleanEmail);
      if (isSuperAdminStaff) {
        const passHash = await computeSha256(pass);
        if (passHash !== SUPERADMIN_PASSWORD_HASH) {
          recordFailedAttempt(cleanEmail);
          throw new Error('Authentication Failed: Invalid credentials for Chief Analyst account.');
        }
      } else {
        const credsStore = JSON.parse(localStorage.getItem('psa_user_credentials') || '{}');
        const userCred = credsStore[cleanEmail];
        if (userCred && userCred.passwordHash && userCred.salt) {
          const computed = await hashCredentialWithSalt(pass, userCred.salt);
          if (computed !== userCred.passwordHash) {
            recordFailedAttempt(cleanEmail);
            throw new Error('Authentication Failed: Incorrect staff credentials.');
          }
        } else if (pass.length < 6) {
          recordFailedAttempt(cleanEmail);
          throw new Error('Staff security passcode must be at least 6 characters.');
        }
      }

      const staffList: StaffMember[] = JSON.parse(localStorage.getItem('psa_staff_members') || '[]');
      let matchedStaff = staffList.find(s => s.email.toLowerCase() === cleanEmail);

      const role = designatedRole || (matchedStaff ? matchedStaff.role : 'analyst');
      const staffName = matchedStaff ? matchedStaff.fullName : cleanEmail.split('@')[0].toUpperCase();
      const staffTitle = matchedStaff ? matchedStaff.title : (role === 'analyst' ? 'Equity Research Analyst' : 'Staff Executive');

      const user: AuthUser = {
        uid: matchedStaff ? matchedStaff.id : `staff-${role}-${Date.now()}`,
        email: cleanEmail,
        displayName: staffName,
        roleType: role === 'analyst' ? 'analyst' : 'staff',
        staffRole: role,
        staffTitle: staffTitle
      };

      const profile: Member = {
        uid: user.uid,
        fullName: staffName,
        email: cleanEmail,
        phone: matchedStaff?.phone || '+234 812 000 0000',
        membershipTier: 'executive',
        status: 'active',
        referralCode: generateReferralCode(staffName),
        referralCount: 5,
        appliedAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCurrentUser(user);
      setMemberProfile(profile);
      setIsAdmin(role === 'admin' || cleanEmail === ADMIN_EMAIL.toLowerCase());
      setIsStaff(true);
      setStaffRole(role);
      setDemoRole(null);

      localStorage.setItem('psa_auth_user', JSON.stringify(user));
      localStorage.setItem('psa_member_profile', JSON.stringify(profile));

      resetRateLimit(cleanEmail);
      logSecurityEvent('STAFF_LOGIN_SUCCESS', cleanEmail, 'auth', `Staff signed in with role: ${role}`, 'low');
    } catch (err) {
      recordFailedAttempt(email);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendRegistrationOtp = async (email: string, name: string): Promise<{ otpCode: string; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const otps = JSON.parse(localStorage.getItem('psa_email_otps') || '{}');
    otps[cleanEmail] = {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('psa_email_otps', JSON.stringify(otps));

    // Log outbound email dispatch
    const dispatches = JSON.parse(localStorage.getItem('psa_email_dispatches') || '[]');
    dispatches.unshift({
      id: `disp-otp-${Date.now()}`,
      recipientEmail: cleanEmail,
      recipientName: name,
      templateType: 'password_reset',
      subject: `PSA Investment - Your 6-Digit Verification Code is ${code}`,
      body: `Hello ${name},\n\nYour 6-digit email verification code for the PSA Analyst Circle is:\n\n${code}\n\nThis verification code expires in 15 minutes. Use this code to complete your membership application.\n\nBest regards,\nPSA Investment Advisory Desk`,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('psa_email_dispatches', JSON.stringify(dispatches));

    return { otpCode: code, message: `Verification code sent to ${cleanEmail}` };
  };

  const verifyRegistrationOtp = (email: string, code: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const otps = JSON.parse(localStorage.getItem('psa_email_otps') || '{}');
    const record = otps[cleanEmail];
    if (!record) return false;
    if (Date.now() > record.expiresAt) return false;
    return record.code.trim() === code.trim();
  };

  const loginWithGoogle = async (googleEmail?: string, googleName?: string): Promise<Member> => {
    setLoading(true);
    try {
      const cleanEmail = (googleEmail || 'circle.investor@gmail.com').trim().toLowerCase();
      const cleanName = googleName || 'Google Circle Member';
      const isAdminLogin = cleanEmail === ADMIN_EMAIL.toLowerCase();

      const user: AuthUser = {
        uid: 'google-' + cleanEmail.replace(/[^a-z0-9]/g, '_'),
        email: cleanEmail,
        displayName: cleanName
      };

      const existingMembers: Member[] = JSON.parse(localStorage.getItem('psa_members') || '[]');
      let profile = existingMembers.find(m => m.email.toLowerCase() === cleanEmail);

      if (!profile) {
        profile = {
          uid: user.uid,
          fullName: cleanName,
          email: cleanEmail,
          phone: '+234 810 000 0000',
          membershipTier: isAdminLogin ? 'executive' : 'standard',
          status: isAdminLogin ? 'active' : 'pending',
          referralCode: generateReferralCode(cleanName),
          referralCount: 0,
          appliedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        existingMembers.unshift(profile);
        localStorage.setItem('psa_members', JSON.stringify(existingMembers));

        // Create alert for admin
        const announcements = JSON.parse(localStorage.getItem('psa_announcements') || '[]');
        announcements.unshift({
          id: `ann-google-${Date.now()}`,
          title: `New Google Circle Sign-Up: ${cleanName}`,
          summary: `${cleanName} authenticated with Google.`,
          content: `${cleanName} (${cleanEmail}) authenticated via Google. Awaiting Chief Analyst activation.`,
          category: 'system',
          urgency: 'high',
          popupAlert: true,
          emailBroadcast: false,
          whatsappBroadcast: false,
          targetAudience: 'all',
          createdAt: new Date().toISOString(),
          dismissed: false
        });
        localStorage.setItem('psa_announcements', JSON.stringify(announcements));
      }

      setCurrentUser(user);
      setMemberProfile(profile);
      setIsAdmin(isAdminLogin || profile.membershipTier === 'executive');
      setDemoRole(null);

      localStorage.setItem('psa_auth_user', JSON.stringify(user));
      localStorage.setItem('psa_member_profile', JSON.stringify(profile));

      // Log user activity
      const activityLogs = JSON.parse(localStorage.getItem('psa_user_activity_logs') || '[]');
      activityLogs.unshift({
        id: `act-${Date.now()}`,
        uid: user.uid,
        action: 'google_signin',
        details: `Signed in via Google OAuth (${cleanEmail})`,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('psa_user_activity_logs', JSON.stringify(activityLogs.slice(0, 500)));

      return profile;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (
    fullName: string,
    email: string,
    pass: string,
    phone?: string,
    referredBy?: string
  ): Promise<Member> => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isAdminRegistration = isAdminEmail(cleanEmail);
      const refCode = generateReferralCode(fullName);

      // Store salted hash of user's chosen password
      if (pass && pass.length >= 6) {
        const salt = generateCryptoSalt();
        const passwordHash = await hashCredentialWithSalt(pass, salt);
        const credsStore = JSON.parse(localStorage.getItem('psa_user_credentials') || '{}');
        credsStore[cleanEmail] = {
          salt,
          passwordHash,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('psa_user_credentials', JSON.stringify(credsStore));
      }

      const user: AuthUser = {
        uid: 'user-' + Date.now(),
        email: cleanEmail,
        displayName: fullName.trim()
      };

      const newMember: Member = {
        uid: user.uid,
        fullName: fullName.trim(),
        email: cleanEmail,
        phone: phone?.trim() || '',
        membershipTier: isAdminRegistration ? 'executive' : 'standard',
        status: isAdminRegistration ? 'active' : 'pending',
        referralCode: refCode,
        referredBy: referredBy?.trim().toUpperCase() || undefined,
        referralCount: 0,
        appliedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCurrentUser(user);
      setMemberProfile(newMember);
      setIsAdmin(isAdminRegistration);
      setDemoRole(null);

      localStorage.setItem('psa_auth_user', JSON.stringify(user));
      localStorage.setItem('psa_member_profile', JSON.stringify(newMember));

      // Save to psa_members table for Admin review
      const existingMembers: Member[] = JSON.parse(localStorage.getItem('psa_members') || '[]');
      const filtered = existingMembers.filter(m => m.email.toLowerCase() !== cleanEmail && m.uid !== newMember.uid);
      localStorage.setItem('psa_members', JSON.stringify([newMember, ...filtered]));

      // Log notification alert for admin
      const announcements = JSON.parse(localStorage.getItem('psa_announcements') || '[]');
      announcements.unshift({
        id: `ann-email-reg-${Date.now()}`,
        title: `New Circle Registration: ${newMember.fullName}`,
        summary: `${newMember.fullName} (${cleanEmail}) completed 2-step email verification.`,
        content: `${newMember.fullName} (${cleanEmail}) completed 2-step email verification and requested to join. Awaiting review.`,
        category: 'system',
        urgency: 'high',
        popupAlert: true,
        emailBroadcast: false,
        whatsappBroadcast: false,
        targetAudience: 'all',
        createdAt: new Date().toISOString(),
        dismissed: false
      });
      localStorage.setItem('psa_announcements', JSON.stringify(announcements));

      // Log user activity
      const activityLogs = JSON.parse(localStorage.getItem('psa_user_activity_logs') || '[]');
      activityLogs.unshift({
        id: `act-${Date.now()}`,
        uid: user.uid,
        action: 'email_signup',
        details: `Registered with verified email OTP (${cleanEmail}). Status: ${newMember.status}`,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('psa_user_activity_logs', JSON.stringify(activityLogs.slice(0, 500)));

      return newMember;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await requestPasswordReset(email);
  };

  const requestPasswordReset = async (email: string): Promise<{ resetCode: string; message: string }> => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }

      // Generate secure 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in reset store with 15 min expiry
      const storedResets = JSON.parse(localStorage.getItem('psa_pwd_resets') || '{}');
      storedResets[cleanEmail] = {
        code,
        expiresAt: Date.now() + 15 * 60 * 1000,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('psa_pwd_resets', JSON.stringify(storedResets));

      // Dispatch automated email record to outbound queue
      const dispatches = JSON.parse(localStorage.getItem('psa_email_dispatches') || '[]');
      dispatches.unshift({
        id: `disp-reset-${Date.now()}`,
        recipientEmail: cleanEmail,
        recipientName: cleanEmail.split('@')[0],
        templateType: 'password_reset',
        subject: 'PSA Investment: Security Password Recovery Verification Code',
        status: 'delivered',
        sentAt: new Date().toISOString(),
        metadata: { resetCode: code }
      });
      localStorage.setItem('psa_email_dispatches', JSON.stringify(dispatches));

      return {
        resetCode: code,
        message: `A 6-digit recovery code has been dispatched to ${cleanEmail}.`
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyAndResetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = code.trim();

      if (!newPassword || newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long.');
      }

      const storedResets = JSON.parse(localStorage.getItem('psa_pwd_resets') || '{}');
      const resetEntry = storedResets[cleanEmail];

      // Verify code strictly against valid active reset record
      const isValid = Boolean(resetEntry && resetEntry.code === cleanCode && resetEntry.expiresAt > Date.now());

      if (!isValid) {
        throw new Error('Invalid or expired 6-digit recovery code. Please request a new code.');
      }

      // Clear the reset code
      delete storedResets[cleanEmail];
      localStorage.setItem('psa_pwd_resets', JSON.stringify(storedResets));

      // Store updated credential record with salted hash
      const salt = generateCryptoSalt();
      const passwordHash = await hashCredentialWithSalt(newPassword, salt);
      const creds = JSON.parse(localStorage.getItem('psa_user_credentials') || '{}');
      creds[cleanEmail] = {
        salt,
        passwordHash,
        updatedAt: new Date().toISOString(),
        hasResetPassword: true
      };
      localStorage.setItem('psa_user_credentials', JSON.stringify(creds));

      return {
        success: true,
        message: 'Your password has been successfully reset. You may now sign in with your new credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const loginSuperUser = async (masterPinOrKey: string): Promise<void> => {
    setLoading(true);
    try {
      const key = masterPinOrKey.trim();

      // Rate limit check
      const rateCheck = checkRateLimit('superuser_master_pin', 5, 300000);
      if (!rateCheck.allowed) {
        throw new Error(`Master PIN access locked due to security attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.`);
      }

      // Security check
      const safety = validateCredentialSafety(key, 'Super User Master Key');
      if (!safety.isValid) throw new Error(safety.error);

      // Verify cryptographic credential digest
      const inputHash = await computeSha256(key);
      const isAuthorized =
        inputHash === SUPERADMIN_PIN_HASH ||
        inputHash === SUPERADMIN_PASSWORD_HASH;

      if (!isAuthorized) {
        recordFailedAttempt('superuser_master_pin', 5, 300000);
        logSecurityEvent('SUPERUSER_FAILED_PIN', 'anonymous', 'auth', 'Incorrect Master PIN attempt', 'high');
        throw new Error('Invalid Executive Master PIN or Security Passcode. Access denied.');
      }

      const superUser: AuthUser = {
        uid: 'admin-uid-ceo-super',
        email: ADMIN_EMAIL,
        displayName: 'Salami Abdullahi (Chief Analyst)',
        roleType: 'super_admin',
        staffRole: 'admin',
        staffTitle: 'Founder, CEO, COO & Chief Analyst'
      };

      const superProfile: Member = {
        uid: superUser.uid,
        fullName: 'Salami Abdullahi',
        email: ADMIN_EMAIL,
        phone: '+234 706 837 1292',
        membershipTier: 'executive',
        status: 'active',
        referralCode: 'PSA-CEO001',
        referralCount: 32,
        appliedAt: '2026-08-01T00:00:00Z',
        approvedAt: '2026-08-01T00:00:00Z',
        createdAt: '2026-08-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };

      setCurrentUser(superUser);
      setMemberProfile(superProfile);
      setIsAdmin(true);
      setIsStaff(true);
      setStaffRole('admin');
      setDemoRole(null);

      localStorage.setItem('psa_auth_user', JSON.stringify(superUser));
      localStorage.setItem('psa_member_profile', JSON.stringify(superProfile));

      resetRateLimit('superuser_master_pin');

      // Log executive audit trail
      const auditLogs = JSON.parse(localStorage.getItem('psa_audit_logs') || '[]');
      auditLogs.unshift({
        id: `audit-super-${Date.now()}`,
        action: 'SUPER_USER_LOGIN',
        actor: 'Salami Abdullahi (CEO & Chief Analyst)',
        details: 'Executive Super User elevation granted via master authentication key.',
        timestamp: new Date().toISOString(),
        severity: 'critical'
      });
      localStorage.setItem('psa_audit_logs', JSON.stringify(auditLogs));
      logSecurityEvent('SUPERUSER_LOGIN_GRANTED', ADMIN_EMAIL, 'auth', 'Chief Analyst elevation assumed', 'low');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const email = currentUser?.email || 'authenticated-user';
      setCurrentUser(null);
      setMemberProfile(null);
      setIsAdmin(false);
      setIsStaff(false);
      setStaffRole(null);
      setDemoRole(null);
      localStorage.removeItem('psa_auth_user');
      localStorage.removeItem('psa_member_profile');
      logSecurityEvent('USER_LOGOUT', email, 'auth', 'User initiated clean session sign out', 'low');
    } finally {
      setLoading(false);
    }
  };

  const switchDemoRole = (role: DemoRole) => {
    setDemoRole(role);
    if (!role || role === 'visitor') {
      setCurrentUser(null);
      setMemberProfile(null);
      setIsAdmin(false);
      return;
    }

    if (role === 'admin') {
      const adminUser: AuthUser = {
        uid: 'demo-admin-uid',
        email: ADMIN_EMAIL,
        displayName: 'Salami Abdullahi'
      };
      const adminProfile: Member = {
        uid: 'demo-admin-uid',
        fullName: 'Salami Abdullahi',
        email: ADMIN_EMAIL,
        phone: '+234 706 837 1292',
        membershipTier: 'executive',
        status: 'active',
        referralCode: 'PSA-CEO001',
        referralCount: 32,
        appliedAt: '2026-08-01T00:00:00Z',
        approvedAt: '2026-08-01T00:00:00Z',
        createdAt: '2026-08-01T00:00:00Z',
        updatedAt: '2026-08-01T00:00:00Z'
      };
      setCurrentUser(adminUser);
      setMemberProfile(adminProfile);
      setIsAdmin(true);
    } else if (role === 'pending_member') {
      const pendingUser: AuthUser = {
        uid: 'sample-pending-member-1',
        email: 'babatunde.adeleke@example.com',
        displayName: 'Babatunde Adeleke'
      };
      const pendingProfile: Member = {
        uid: 'sample-pending-member-1',
        fullName: 'Babatunde Adeleke',
        email: 'babatunde.adeleke@example.com',
        phone: '+234 803 123 4567',
        membershipTier: 'standard',
        status: 'pending',
        referralCode: 'PSA-BAB941',
        referredBy: 'PSA-ABD001',
        referralCount: 0,
        appliedAt: '2026-09-29T14:20:00Z',
        notes: 'Equity research enthusiast interested in industrial commodities and tier-1 banking.',
        createdAt: '2026-09-29T14:20:00Z',
        updatedAt: '2026-09-29T14:20:00Z'
      };
      setCurrentUser(pendingUser);
      setMemberProfile(pendingProfile);
      setIsAdmin(false);
    } else if (role === 'active_member') {
      const activeUser: AuthUser = {
        uid: 'sample-active-member-2',
        email: 'chidinma.o@example.com',
        displayName: 'Chidinma Okonkwo'
      };
      const activeProfile: Member = {
        uid: 'sample-active-member-2',
        fullName: 'Chidinma Okonkwo',
        email: 'chidinma.o@example.com',
        phone: '+234 812 987 6543',
        membershipTier: 'standard',
        status: 'active',
        referralCode: 'PSA-CHI882',
        referredBy: 'PSA-ABD001',
        referralCount: 7,
        appliedAt: '2026-09-10T09:15:00Z',
        approvedAt: '2026-09-11T16:00:00Z',
        notes: 'Active member participating in weekly market valuation notes.',
        createdAt: '2026-09-10T09:15:00Z',
        updatedAt: '2026-09-11T16:00:00Z'
      };
      setCurrentUser(activeUser);
      setMemberProfile(activeProfile);
      setIsAdmin(false);
    }
  };

  const updateMemberProfile = async (data: Partial<Member>) => {
    if (!memberProfile) return;
    const updated = { ...memberProfile, ...data, updatedAt: new Date().toISOString() };
    setMemberProfile(updated);
    localStorage.setItem('psa_member_profile', JSON.stringify(updated));
  };

  const updateAdminProfile = async (data: { fullName: string; phone: string; title: string; bio: string; photoUrl?: string }) => {
    try {
      localStorage.setItem('psa_admin_profile', JSON.stringify(data));
      if (data.photoUrl) {
        localStorage.setItem('psa_ceo_photo', data.photoUrl);
      }
      if (memberProfile) {
        const updated = { ...memberProfile, fullName: data.fullName, phone: data.phone, updatedAt: new Date().toISOString() };
        setMemberProfile(updated);
      }
    } catch (e) {
      console.error('Save admin profile error:', e);
    }
  };

  const isSuperUser = isAdmin || (currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) || (memberProfile?.membershipTier === 'executive');

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        memberProfile,
        isAdmin,
        isSuperUser,
        isStaff,
        staffRole,
        userRoleTitle,
        loading,
        demoRole,
        loginWithEmail,
        loginStaff,
        loginWithGoogle,
        registerWithEmail,
        sendRegistrationOtp,
        verifyRegistrationOtp,
        resetPassword,
        requestPasswordReset,
        verifyAndResetPassword,
        loginSuperUser,
        logout,
        switchDemoRole,
        updateMemberProfile,
        updateAdminProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
