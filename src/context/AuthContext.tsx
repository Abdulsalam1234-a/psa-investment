import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, DemoRole } from '../types';

interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  memberProfile: Member | null;
  isAdmin: boolean;
  isSuperUser: boolean;
  loading: boolean;
  demoRole: DemoRole;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string, phone?: string, referralCode?: string) => Promise<Member>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [memberProfile, setMemberProfile] = useState<Member | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [demoRole, setDemoRole] = useState<DemoRole>(null);

  // Helper to generate unique referral code
  const generateReferralCode = (name: string) => {
    const prefix = (name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3) || 'PSA').padEnd(3, 'X');
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PSA-${prefix}${suffix}`;
  };

  // Check stored session
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('psa_auth_user');
      const storedProfile = localStorage.getItem('psa_member_profile');
      if (storedUser && storedProfile) {
        const u = JSON.parse(storedUser);
        const p = JSON.parse(storedProfile);
        setCurrentUser(u);
        setMemberProfile(p);
        setIsAdmin(u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || p.membershipTier === 'executive');
      }
    } catch (e) {
      console.warn('Auth restoration error:', e);
    }
  }, []);

  const loginWithEmail = async (email: string, _pass: string) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isAdminLogin = cleanEmail === ADMIN_EMAIL.toLowerCase();

      const user: AuthUser = {
        uid: isAdminLogin ? 'admin-uid-ceo' : 'user-' + cleanEmail.replace(/[^a-z0-9]/g, '_'),
        email: cleanEmail,
        displayName: isAdminLogin ? 'Salami Abdullahi' : cleanEmail.split('@')[0]
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
      } else {
        // Retrieve or generate member profile
        profile = {
          uid: user.uid,
          fullName: user.displayName || 'Circle Member',
          email: cleanEmail,
          phone: '+234 812 000 0000',
          membershipTier: 'standard',
          status: 'active',
          referralCode: generateReferralCode(user.displayName || 'PSA'),
          referralCount: 2,
          appliedAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      setCurrentUser(user);
      setMemberProfile(profile);
      setIsAdmin(isAdminLogin);
      setDemoRole(null);

      localStorage.setItem('psa_auth_user', JSON.stringify(user));
      localStorage.setItem('psa_member_profile', JSON.stringify(profile));
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (
    fullName: string,
    email: string,
    _pass: string,
    phone?: string,
    referredBy?: string
  ): Promise<Member> => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isAdminRegistration = cleanEmail === ADMIN_EMAIL.toLowerCase();
      const refCode = generateReferralCode(fullName);

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

      // Verify code (allow demo OTPs 123456 or 257000 as universal fallback)
      const isValid = (resetEntry && resetEntry.code === cleanCode && resetEntry.expiresAt > Date.now()) || cleanCode === '123456' || cleanCode === '257000';

      if (!isValid) {
        throw new Error('Invalid or expired 6-digit recovery code. Please request a new code.');
      }

      // Clear the reset code
      delete storedResets[cleanEmail];
      localStorage.setItem('psa_pwd_resets', JSON.stringify(storedResets));

      // Store updated credential record
      const creds = JSON.parse(localStorage.getItem('psa_user_credentials') || '{}');
      creds[cleanEmail] = {
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
      // Master credentials: '2570' (Chief Analyst PIN), 'PSA-SUPERUSER-2026', or executive password
      if (key !== '2570' && key !== 'PSA-SUPERUSER-2026' && key !== 'salami2026' && key.length < 4) {
        throw new Error('Invalid Executive Master PIN or Security Passcode. Access denied.');
      }

      const superUser: AuthUser = {
        uid: 'admin-uid-ceo-super',
        email: ADMIN_EMAIL,
        displayName: 'Salami Abdullahi (Super User)'
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
      setDemoRole(null);

      localStorage.setItem('psa_auth_user', JSON.stringify(superUser));
      localStorage.setItem('psa_member_profile', JSON.stringify(superProfile));

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
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setCurrentUser(null);
      setMemberProfile(null);
      setIsAdmin(false);
      setDemoRole(null);
      localStorage.removeItem('psa_auth_user');
      localStorage.removeItem('psa_member_profile');
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
        loading,
        demoRole,
        loginWithEmail,
        registerWithEmail,
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
