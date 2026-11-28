import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  Tag,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  KeyRound,
  Crown,
  RefreshCw,
  TrendingUp,
  Briefcase,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StaffRole } from '../types';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  validateCredentialSafety
} from '../utils/security';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot_password' | 'superuser';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const {
    loginWithEmail,
    loginStaff,
    loginWithGoogle,
    registerWithEmail,
    sendRegistrationOtp,
    verifyRegistrationOtp,
    requestPasswordReset,
    verifyAndResetPassword,
    loginSuperUser,
    loading
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password' | 'superuser'>(initialMode);
  const [loginRole, setLoginRole] = useState<'member' | 'analyst' | 'staff' | 'superuser'>('member');

  // Input states strictly initialized to empty strings (zero pre-population)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [superPin, setSuperPin] = useState('');
  const [selectedStaffRole, setSelectedStaffRole] = useState<StaffRole>('analyst');
  
  // 2-Step Signup Verification state
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [signupOtp, setSignupOtp] = useState('');
  const [signupOtpHint, setSignupOtpHint] = useState<string | null>(null);

  // Forgot password 2-step states
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submittedMember, setSubmittedMember] = useState<{ name: string; refCode: string } | null>(null);

  // Prevent background page scrolling and attach Escape key listener when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
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
  }, [isOpen, onClose]);

  useEffect(() => {
    setMode(initialMode === 'superuser' ? 'login' : initialMode);
    if (initialMode === 'superuser') {
      setLoginRole('superuser');
    }
    setError(null);
    setSuccessMessage(null);
    setSubmittedMember(null);
    setSignupStep(1);
    setSignupOtp('');
    setSignupOtpHint(null);
    setResetStep(1);
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setDemoOtpHint(null);
    setEmail('');
    setPassword('');
    setSuperPin('');
    setFullName('');
    setPhone('');

    // Check URL parameters for referral code
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setError(null);
    try {
      const googleEmail = prompt('Enter your Google Account email address:');
      if (!googleEmail || !googleEmail.trim()) return;

      const cleanEmail = googleEmail.trim().toLowerCase();
      const safety = validateCredentialSafety(cleanEmail, 'Google Email');
      if (!safety.isValid) throw new Error(safety.error);

      const cleanName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').toUpperCase();
      
      const member = await loginWithGoogle(cleanEmail, cleanName);
      if (member.status === 'pending') {
        setSubmittedMember({ name: member.fullName, refCode: member.referralCode });
      } else {
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed.');
    }
  };

  const handleSendSignupOtp = async () => {
    setError(null);
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Credential security checks
    const nameSafety = validateCredentialSafety(cleanName, 'Full Name');
    if (!nameSafety.isValid) {
      setError(nameSafety.error || 'Invalid name input.');
      return;
    }
    const emailSafety = validateCredentialSafety(cleanEmail, 'Email');
    if (!emailSafety.isValid) {
      setError(emailSafety.error || 'Invalid email input.');
      return;
    }

    if (!cleanName || !cleanEmail || !password) {
      setError('Please provide your full legal name, email, and a secure password.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Rate limit check
    const rate = checkRateLimit(cleanEmail);
    if (!rate.allowed) {
      setError(`Too many requests. Please wait ${rate.retryAfterSeconds}s.`);
      return;
    }

    try {
      const res = await sendRegistrationOtp(cleanEmail, cleanName);
      setSignupOtpHint(res.otpCode);
      setSignupStep(2);
      setSuccessMessage(`A 6-digit verification code has been dispatched to ${cleanEmail}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dispatch verification code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'login') {
        if (loginRole === 'superuser') {
          if (!superPin.trim()) {
            throw new Error('Please enter the Executive Master PIN or Security Passcode.');
          }
          const pinSafety = validateCredentialSafety(superPin, 'Master PIN');
          if (!pinSafety.isValid) throw new Error(pinSafety.error);

          await loginSuperUser(superPin);
          onClose();
          if (onSuccess) onSuccess();
        } else if (loginRole === 'analyst') {
          if (!email.trim() || !password) {
            throw new Error('Please enter your analyst email and credentials.');
          }
          await loginStaff(email, password, 'analyst');
          onClose();
          if (onSuccess) onSuccess();
        } else if (loginRole === 'staff') {
          if (!email.trim() || !password) {
            throw new Error('Please enter your staff email and password.');
          }
          await loginStaff(email, password, selectedStaffRole);
          onClose();
          if (onSuccess) onSuccess();
        } else {
          // Normal public / Circle member
          if (!email.trim() || !password) {
            throw new Error('Please enter both your email address and password.');
          }
          await loginWithEmail(email, password);
          onClose();
          if (onSuccess) onSuccess();
        }
      } else if (mode === 'signup') {
        if (signupStep === 1) {
          await handleSendSignupOtp();
        } else {
          if (!signupOtp.trim() || signupOtp.trim().length < 6) {
            throw new Error('Please enter the 6-digit verification code sent to your email.');
          }
          const valid = verifyRegistrationOtp(email, signupOtp);
          if (!valid) {
            throw new Error('Invalid or expired verification code. Please check and try again.');
          }
          const member = await registerWithEmail(fullName, email, password, phone, referralCode);
          setSubmittedMember({ name: member.fullName, refCode: member.referralCode });
        }
      } else if (mode === 'forgot_password') {
        if (resetStep === 1) {
          if (!email.trim() || !email.includes('@')) {
            throw new Error('Please enter a valid email address.');
          }
          const emailSafety = validateCredentialSafety(email, 'Email Address');
          if (!emailSafety.isValid) throw new Error(emailSafety.error);

          const res = await requestPasswordReset(email);
          setResetStep(2);
          setDemoOtpHint(res.resetCode);
          setSuccessMessage(`Recovery verification code dispatched to ${email.trim()}.`);
        } else {
          if (!otpCode.trim() || otpCode.trim().length < 6) {
            throw new Error('Please enter the 6-digit verification code.');
          }
          if (!newPassword || newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters long.');
          }
          if (newPassword !== confirmPassword) {
            throw new Error('Passwords do not match. Please verify both fields.');
          }
          const res = await verifyAndResetPassword(email, otpCode, newPassword);
          setSuccessMessage(res.message);
          setTimeout(() => {
            setMode('login');
            setPassword('');
            setResetStep(1);
          }, 1800);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An authentication error occurred.');
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className={`p-6 text-white text-center transition-colors ${
          mode === 'login' && loginRole === 'superuser'
            ? 'bg-gradient-to-b from-[#1c1808] via-[#0A1F44] to-[#07152E] border-b border-[#C9A84C]/40'
            : 'bg-gradient-to-b from-[#0A1F44] to-[#07152E]'
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border ${
            mode === 'login' && loginRole === 'superuser'
              ? 'bg-[#C9A84C]/30 border-[#C9A84C] text-[#C9A84C]'
              : 'bg-[#C9A84C]/20 border-[#C9A84C]/40 text-[#C9A84C]'
          }`}>
            {mode === 'login' ? (
              loginRole === 'superuser' ? (
                <Crown className="w-6 h-6 stroke-[2.2]" />
              ) : loginRole === 'analyst' ? (
                <TrendingUp className="w-6 h-6 stroke-[2.2]" />
              ) : loginRole === 'staff' ? (
                <Briefcase className="w-6 h-6 stroke-[2.2]" />
              ) : (
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              )
            ) : mode === 'forgot_password' ? (
              <KeyRound className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>

          <h3 className="font-serif font-black text-xl tracking-tight">
            {mode === 'login'
              ? loginRole === 'superuser'
                ? 'Chief Analyst & Super Admin'
                : loginRole === 'analyst'
                ? 'Equity Research Analyst'
                : loginRole === 'staff'
                ? 'Staff & Management Console'
                : 'Analyst Circle Sign In'
              : mode === 'signup'
              ? signupStep === 1
                ? 'Join the PSA Analyst Circle'
                : 'Verify Your Email Address'
              : resetStep === 1
              ? 'Password Recovery Request'
              : 'Set New Account Password'}
          </h3>

          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {mode === 'login'
              ? loginRole === 'superuser'
                ? 'Executive command access for Founder & Chief Analyst Salami Abdullahi'
                : loginRole === 'analyst'
                ? 'Accredited access for fundamental equity analysts and modelers'
                : loginRole === 'staff'
                ? 'Role-based access for management, social media directors & partners'
                : 'Public investors and members accessing Nigerian equity intelligence'
              : mode === 'signup'
              ? signupStep === 1
                ? 'Free membership application, reviewed by Chief Analyst'
                : `Enter the 6-digit verification code sent to ${email}`
              : resetStep === 1
              ? 'Enter registered email to receive a 6-digit verification code'
              : 'Enter verification OTP code and choose your new password'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span>{successMessage}</span>
                {signupOtpHint && mode === 'signup' && signupStep === 2 && (
                  <div className="mt-1 font-mono font-bold text-[11px] text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded inline-block">
                    Verification OTP: {signupOtpHint}
                  </div>
                )}
                {demoOtpHint && mode === 'forgot_password' && resetStep === 2 && (
                  <div className="mt-1 font-mono font-bold text-[11px] text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded inline-block">
                    Recovery OTP Code: {demoOtpHint}
                  </div>
                )}
              </div>
            </div>
          )}

          {submittedMember ? (
            <div className="py-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#0A1F44]">Application Received!</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Thank you, <strong className="text-slate-800">{submittedMember.name}</strong>. Your
                  application to join the PSA Analyst Circle has been securely logged and is under
                  review by Salami Abdullahi. You will receive an approval notification shortly.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="text-slate-500">Your Official Referral Identifier:</div>
                <div className="font-mono font-bold text-sm text-[#0A1F44]">
                  {submittedMember.refCode}
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onSuccess) onSuccess();
                }}
                className="w-full py-2.5 bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C] font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
              >
                Access Member Portal Overview
              </button>
            </div>
          ) : (
            <div>
              {/* Role Selection Tabs for Login Mode */}
              {mode === 'login' && (
                <div className="mb-5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Select Your Sign-In Category
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginRole('member');
                        setError(null);
                      }}
                      className={`py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        loginRole === 'member'
                          ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Public / Member</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginRole('analyst');
                        setError(null);
                      }}
                      className={`py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        loginRole === 'analyst'
                          ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Analyst</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginRole('staff');
                        setError(null);
                      }}
                      className={`py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        loginRole === 'staff'
                          ? 'bg-[#0A1F44] text-[#C9A84C] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Staff &amp; Mgmt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginRole('superuser');
                        setError(null);
                      }}
                      className={`py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        loginRole === 'superuser'
                          ? 'bg-amber-700 text-amber-100 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Super Admin</span>
                    </button>
                  </div>
                </div>
              )}

              {/* GOOGLE SIGN IN BUTTON for Public Member */}
              {mode === 'login' && loginRole === 'member' && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2.5"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="flex items-center my-3.5">
                    <div className="flex-1 border-t border-slate-200"></div>
                    <span className="px-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Or with email credentials
                    </span>
                    <div className="flex-1 border-t border-slate-200"></div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. SUPER USER LOGIN */}
                {mode === 'login' && loginRole === 'superuser' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                      <strong>Executive Security Check:</strong> Direct elevation for Founder &amp; Chief Analyst Salami Abdullahi. Enter your Master PIN or security key to assume super user command.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Executive Master PIN or Security Passcode *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          autoFocus
                          placeholder="Enter Master PIN"
                          value={superPin}
                          onChange={e => setSuperPin(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. RESEARCH ANALYST LOGIN */}
                {mode === 'login' && loginRole === 'analyst' && (
                  <div className="space-y-3">
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900">
                      <strong>Research Analyst Authentication:</strong> Access institutional valuation models, draft memos, and Analyst Circle discussion feeds.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Analyst Work Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="analyst@psainvestment.com.ng"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Analyst Security Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. STAFF & MANAGEMENT LOGIN */}
                {mode === 'login' && loginRole === 'staff' && (
                  <div className="space-y-3">
                    <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-[11px] text-indigo-900">
                      <strong>Staff Management Access:</strong> Authenticate operational staff, department heads, and institutional partners.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Staff Official Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="staff@organization.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Operational Role / Department *
                      </label>
                      <select
                        value={selectedStaffRole}
                        onChange={e => setSelectedStaffRole(e.target.value as StaffRole)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium cursor-pointer"
                      >
                        <option value="management">Executive Management</option>
                        <option value="analyst">Senior Research Analyst</option>
                        <option value="social_media_director">Social Media &amp; Communications Director</option>
                        <option value="partners">Institutional Capital Partner</option>
                        <option value="admin">Operations Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Security Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. PUBLIC / MEMBER LOGIN */}
                {mode === 'login' && loginRole === 'member' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Registered Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="name@organization.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Password *
                        </label>
                        <button
                          type="button"
                          onClick={() => setMode('forgot_password')}
                          className="text-[11px] text-[#0A1F44] hover:text-[#C9A84C] font-medium cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* SIGNUP STEP 1: BASIC DETAILS */}
                {mode === 'signup' && signupStep === 1 && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Legal Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="name@organization.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password (Min 6 characters) *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          placeholder="+234 706 837 1295"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Referral Code (Optional)
                      </label>
                      <div className="relative">
                        <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="PSA-ABC123"
                          value={referralCode}
                          onChange={e => setReferralCode(e.target.value.toUpperCase())}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* SIGNUP STEP 2: 2-STEP EMAIL OTP VERIFICATION */}
                {mode === 'signup' && signupStep === 2 && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      Step 2 of 2: We sent a 6-digit verification code to <strong className="text-[#0A1F44]">{email}</strong>. Please enter it below to confirm your application.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        6-Digit Email Verification Code *
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          autoFocus
                          maxLength={6}
                          placeholder="e.g. 584912"
                          value={signupOtp}
                          onChange={e => setSignupOtp(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-widest text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all text-center"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        ← Edit Information
                      </button>
                      <button
                        type="button"
                        onClick={handleSendSignupOtp}
                        className="text-[#0A1F44] hover:text-[#C9A84C] font-semibold underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                )}

                {/* FORGOT PASSWORD STEP 1 */}
                {mode === 'forgot_password' && resetStep === 1 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="name@organization.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* FORGOT PASSWORD STEP 2 */}
                {mode === 'forgot_password' && resetStep === 2 && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      Resetting password for: <strong className="text-[#0A1F44]">{email}</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        6-Digit Recovery OTP Code *
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="e.g. 123456"
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        New Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="At least 6 characters"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="Repeat new password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-2 py-3 text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all hover:scale-101 flex items-center justify-center gap-2 disabled:opacity-50 ${
                    mode === 'login' && loginRole === 'superuser'
                      ? 'bg-gradient-to-r from-amber-600 to-[#0A1F44] text-white hover:opacity-95'
                      : 'bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C]'
                  }`}
                >
                  <span>
                    {loading
                      ? 'Authenticating...'
                      : mode === 'login'
                      ? loginRole === 'superuser'
                        ? 'Authenticate as Super User'
                        : loginRole === 'analyst'
                        ? 'Sign In as Research Analyst'
                        : loginRole === 'staff'
                        ? 'Sign In to Staff Console'
                        : 'Sign In to Member Portal'
                      : mode === 'signup'
                      ? signupStep === 1
                        ? 'Send Email Verification OTP'
                        : 'Verify OTP & Complete Application'
                      : resetStep === 1
                      ? 'Dispatch Recovery Code'
                      : 'Confirm & Reset Password'}
                  </span>
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          )}

          {/* Mode Switchers */}
          {!submittedMember && (
            <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2.5">
              {mode === 'login' && (
                <div>
                  Need access to the institutional research vault?{' '}
                  <button
                    onClick={() => {
                      setMode('signup');
                      setSignupStep(1);
                    }}
                    className="font-bold text-[#0A1F44] hover:text-[#C9A84C] cursor-pointer"
                  >
                    Apply to Join Circle
                  </button>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  Already have an active member account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="font-bold text-[#0A1F44] hover:text-[#C9A84C] cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {mode === 'forgot_password' && (
                <div className="flex items-center justify-between text-xs">
                  {resetStep === 2 ? (
                    <button
                      type="button"
                      onClick={() => setResetStep(1)}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      ← Back to Email Step
                    </button>
                  ) : <span />}
                  <button
                    onClick={() => setMode('login')}
                    className="font-bold text-[#0A1F44] hover:text-[#C9A84C] cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
