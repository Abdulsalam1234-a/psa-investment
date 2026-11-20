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
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [superPin, setSuperPin] = useState('');
  
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

  // Prevent background page scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setMode(initialMode);
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
      // In web app, prompt for or use connected Google account
      const googleEmail = prompt('Enter your Google Account email address (or click OK for default):', 'investor@gmail.com');
      if (googleEmail === null) return; // User cancelled
      const cleanEmail = googleEmail.trim() || 'investor@gmail.com';
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
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please provide your full legal name, email, and a secure password.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await sendRegistrationOtp(email, fullName);
      setSignupOtpHint(res.otpCode);
      setSignupStep(2);
      setSuccessMessage(`A 6-digit verification code has been dispatched to ${email.trim()}.`);
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
        if (!email.trim() || !password) {
          throw new Error('Please enter both your email address and password.');
        }
        await loginWithEmail(email, password);
        onClose();
        if (onSuccess) onSuccess();
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
      } else if (mode === 'superuser') {
        if (!superPin.trim()) {
          throw new Error('Please enter the Executive Master PIN or Security Passcode.');
        }
        await loginSuperUser(superPin);
        onClose();
        if (onSuccess) onSuccess();
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

        {/* Header */}
        <div className={`p-6 text-white text-center transition-colors ${
          mode === 'superuser'
            ? 'bg-gradient-to-b from-[#1c1808] via-[#0A1F44] to-[#07152E] border-b border-[#C9A84C]/40'
            : 'bg-gradient-to-b from-[#0A1F44] to-[#07152E]'
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border ${
            mode === 'superuser'
              ? 'bg-[#C9A84C]/30 border-[#C9A84C] text-[#C9A84C]'
              : 'bg-[#C9A84C]/20 border-[#C9A84C]/40 text-[#C9A84C]'
          }`}>
            {mode === 'superuser' ? (
              <Crown className="w-6 h-6 stroke-[2.2]" />
            ) : mode === 'forgot_password' ? (
              <KeyRound className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>

          <h3 className="font-serif font-black text-xl tracking-tight">
            {mode === 'login'
              ? 'Analyst Portal Sign In'
              : mode === 'signup'
              ? signupStep === 1 ? 'Join the PSA Analyst Circle' : 'Verify Your Email Address'
              : mode === 'superuser'
              ? 'Executive Super User Mode'
              : resetStep === 1
              ? 'Password Recovery Request'
              : 'Set New Account Password'}
          </h3>

          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Access institutional intelligence, valuation models, and research memos'
              : mode === 'signup'
              ? signupStep === 1 ? 'Free membership application, vetted and approved by Chief Analyst' : `Enter the 6-digit code sent to ${email}`
              : mode === 'superuser'
              ? 'Chief Analyst & Executive Director elevation credentials'
              : resetStep === 1
              ? 'Enter registered email to receive a 6-digit OTP verification code'
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
                    Demo OTP Code: {demoOtpHint}
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
              {/* GOOGLE SIGN IN BUTTON */}
              {(mode === 'login' || (mode === 'signup' && signupStep === 1)) && (
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
                    <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
                  </button>

                  <div className="flex items-center my-3.5">
                    <div className="flex-1 border-t border-slate-200"></div>
                    <span className="px-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Or with email
                    </span>
                    <div className="flex-1 border-t border-slate-200"></div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* SUPER USER MODE */}
                {mode === 'superuser' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                      <strong>Executive Mode Notice:</strong> Direct elevation for Salami Abdullahi
                      (<span className="font-mono">salamiabdullahi257@gmail.com</span>). Enter executive master PIN to assume full super administrative control.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Executive Master PIN / Security Passcode *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          autoFocus
                          placeholder="Master PIN (e.g. 2570)"
                          value={superPin}
                          onChange={e => setSuperPin(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#C9A84C] focus:bg-white transition-all font-mono font-bold"
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span>CEO Master PIN: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-[#0A1F44]">2570</code></span>
                        <button
                          type="button"
                          onClick={() => setSuperPin('2570')}
                          className="text-[#0A1F44] hover:text-[#C9A84C] font-bold underline cursor-pointer"
                        >
                          Auto-fill
                        </button>
                      </div>
                    </div>
                  </div>
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
                          placeholder="e.g. Babatunde Adeleke"
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
                          placeholder="+234 706 837 1292"
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

                {/* LOGIN EMAIL & PASSWORD */}
                {mode === 'login' && (
                  <>
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
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span>CEO Account: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[#0A1F44]">salamiabdullahi257@gmail.com</code></span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail('salamiabdullahi257@gmail.com');
                            setPassword('admin1234');
                          }}
                          className="text-[#0A1F44] hover:text-[#C9A84C] font-bold underline cursor-pointer"
                        >
                          Auto-fill
                        </button>
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
                      {demoOtpHint && (
                        <button
                          type="button"
                          onClick={() => setOtpCode(demoOtpHint)}
                          className="mt-1 text-[10px] text-[#0A1F44] hover:text-[#C9A84C] font-semibold underline cursor-pointer"
                        >
                          Insert generated OTP ({demoOtpHint})
                        </button>
                      )}
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
                    mode === 'superuser'
                      ? 'bg-gradient-to-r from-amber-600 to-[#0A1F44] text-white hover:opacity-95'
                      : 'bg-[#0A1F44] hover:bg-[#13306B] text-[#C9A84C]'
                  }`}
                >
                  <span>
                    {loading
                      ? 'Processing...'
                      : mode === 'login'
                      ? 'Sign In to Member Portal'
                      : mode === 'signup'
                      ? signupStep === 1
                        ? 'Send Email Verification OTP'
                        : 'Verify OTP & Complete Application'
                      : mode === 'superuser'
                      ? 'Authenticate as Super User'
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
                <>
                  <div>
                    Need access to the research vault?{' '}
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
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setMode('superuser')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 font-semibold border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer text-[11px]"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-700" />
                      Executive Super User Login
                    </button>
                  </div>
                </>
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

              {mode === 'superuser' && (
                <div>
                  Return to normal sign in?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="font-bold text-[#0A1F44] hover:text-[#C9A84C] cursor-pointer"
                  >
                    Member & Analyst Login
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
