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
  loading: boolean;
  demoRole: DemoRole;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string, phone?: string, referralCode?: string) => Promise<Member>;
  resetPassword: (email: string) => Promise<void>;
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
    console.log(`Password reset initiated for ${email}`);
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        memberProfile,
        isAdmin,
        loading,
        demoRole,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
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
