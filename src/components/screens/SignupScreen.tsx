import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, KeyRound, Mail, Phone, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { MeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';
import { supabase } from '../../lib/supabase';

interface LoginScreenProps {
  phoneNumber: string;
  setPhoneNumber: (num: string) => void;
  onLoginSubmit: (phone: string, pass: string) => void;
  onGoogleLogin: (email?: string, name?: string) => void;
  onGoToSignUp: () => void;
  onOpenAdmin?: () => void;
}

export const SignupScreen: React.FC<LoginScreenProps> = ({
  phoneNumber,
  setPhoneNumber,
  onLoginSubmit,
  onGoogleLogin,
  onGoToSignUp,
  onOpenAdmin,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');

  // Forgot Password modal states: 'identifier' | 'otp' | 'new_password'
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'identifier' | 'otp' | 'new_password'>('identifier');
  const [forgotInput, setForgotInput] = useState('');
  const [resolvedEmail, setResolvedEmail] = useState('');
  const [resolvedPhone, setResolvedPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = (phoneNumber || '').replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }
    setErrorMsg('');
    onLoginSubmit(cleanDigits, password);
  };

  // Helper to mask email for privacy: s***4@gmail.com
  const maskEmail = (emailStr: string) => {
    if (!emailStr || !emailStr.includes('@')) return emailStr;
    const [user, domain] = emailStr.split('@');
    if (user.length <= 2) return `${user[0]}*@${domain}`;
    return `${user[0]}${'*'.repeat(Math.max(1, user.length - 2))}${user[user.length - 1]}@${domain}`;
  };

  // Step 1: Send OTP to Email
  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = forgotInput.trim();
    if (!raw) {
      setForgotError('Please enter your mobile number or email address');
      return;
    }

    setIsForgotLoading(true);
    setForgotError('');

    try {
      let targetEmail = '';
      let targetPhone = '';

      if (raw.includes('@')) {
        // Entered email directly
        targetEmail = raw.toLowerCase();
        // Check if exists in profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, phone')
          .eq('email', targetEmail)
          .maybeSingle();

        if (profile?.phone) {
          targetPhone = profile.phone;
        }
      } else {
        // Entered mobile number
        const cleanPhone = raw.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          setForgotError('Please enter a valid 10-digit mobile number');
          setIsForgotLoading(false);
          return;
        }

        const { data: profile, error: pErr } = await supabase
          .from('profiles')
          .select('email, full_name, phone')
          .eq('phone', cleanPhone)
          .maybeSingle();

        if (pErr) {
          setForgotError('Unable to connect to the server. Please check your internet connection.');
          setIsForgotLoading(false);
          return;
        }

        if (!profile || !profile.email) {
          setForgotError('This mobile number is not registered with Meat Ghar!');
          setIsForgotLoading(false);
          return;
        }

        targetEmail = profile.email;
        targetPhone = profile.phone || cleanPhone;
      }

      // Send OTP to the target email via Supabase Auth
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(targetEmail);

      if (resetErr) {
        setForgotError(`Failed to send verification code: ${resetErr.message}`);
        setIsForgotLoading(false);
        return;
      }

      setResolvedEmail(targetEmail);
      if (targetPhone) setResolvedPhone(targetPhone);
      setForgotStep('otp');
      setResendCooldown(60);
    } catch (err: any) {
      setForgotError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = forgotOtp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setForgotError('Please enter the complete 6-digit OTP code');
      return;
    }

    setIsForgotLoading(true);
    setForgotError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: resolvedEmail,
        token: cleanOtp,
        type: 'recovery',
      });

      if (error) {
        setForgotError(error.message || 'Invalid or expired OTP code. Please try again.');
        setIsForgotLoading(false);
        return;
      }

      // OTP verified! Move to set new password step
      setForgotStep('new_password');
    } catch (err: any) {
      setForgotError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Step 3: Update Password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match');
      return;
    }

    setIsForgotLoading(true);
    setForgotError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setForgotError(error.message || 'Failed to update password. Please try again.');
        setIsForgotLoading(false);
        return;
      }

      // Sign out recovery session to allow clean login with new password
      await supabase.auth.signOut();

      // Set new password in login form & fill phone if known
      setPassword(newPassword);
      if (resolvedPhone) {
        setPhoneNumber(resolvedPhone);
      }

      // Close modal & show success message on login screen
      setShowForgotModal(false);
      setLoginSuccessMsg('Password updated successfully! Please login with your new password.');
    } catch (err: any) {
      setForgotError(err.message || 'Error setting new password.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !resolvedEmail) return;
    setIsForgotLoading(true);
    setForgotError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resolvedEmail);
      if (error) {
        setForgotError(error.message);
      } else {
        setResendCooldown(60);
      }
    } catch (err: any) {
      setForgotError(err.message || 'Failed to resend OTP');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white text-slate-800 flex flex-col justify-between relative overflow-y-auto no-scrollbar select-none">
      {/* Main Form Area */}
      <div className="px-6 pt-6 pb-2 z-10 flex-1 flex flex-col justify-start">
        {/* Logo */}
        <div className="mb-3 flex justify-center">
          <MeatGharLogo variant="red" size="md" showTagline={true} />
        </div>

        {/* Headings */}
        <div className="text-left mt-1 mb-4">
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-1"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Welcome Back to <br />
            <span className="text-[#A8071A]">Meat Ghar</span>
          </h2>
          <p className="text-xs text-slate-500 font-normal leading-relaxed">
            Enter your mobile number and password to login.
          </p>
        </div>

        {loginSuccessMsg && (
          <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{loginSuccessMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5" autoComplete="off" noValidate>
          {/* Mobile Number Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center gap-1 text-slate-700 font-semibold text-xs pointer-events-none z-10">
                <img src="/src/assets/images/INDIA.png" alt="India" className="w-5 h-5 object-contain" />
                <span>+91</span>
                <span className="text-slate-300 ml-1">|</span>
              </div>
              <input
                type="tel"
                name="user_phone_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={phoneNumber}
                maxLength={10}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10 digit number"
                className="w-full pl-20 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#A8071A] focus:ring-1 focus:ring-[#A8071A] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Password Input Box */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotStep('identifier');
                  setForgotInput(phoneNumber || '');
                  setResolvedEmail('');
                  setForgotOtp('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                  setForgotError('');
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-bold text-[#A8071A] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                name="user_password_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#A8071A] focus:ring-1 focus:ring-[#A8071A] transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#A8071A] hover:bg-[#8C0818] active:bg-[#720412] text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-950/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>LOGIN</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Don't have an account? Sign Up Link */}
        <p className="text-center text-xs text-slate-500 mt-4 font-medium">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onGoToSignUp}
            className="text-[#A8071A] font-extrabold hover:underline cursor-pointer ml-0.5"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* Pinned Bottom BG Platter Graphic */}
      <div className="w-full h-36 relative mt-auto overflow-hidden shrink-0">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <AppImage
          src="/images/bg_1790503776302.jpg"
          alt="Meat Ghar BG"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* FORGOT PASSWORD 3-STEP MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl p-6 shadow-2xl relative max-w-sm w-full border border-slate-100 animate-scale-in">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-left">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#A8071A]" />
                  <span>Reset Password</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {forgotStep === 'identifier' && 'Enter your mobile number or email address'}
                  {forgotStep === 'otp' && `Enter the 6-digit code sent to ${maskEmail(resolvedEmail)}`}
                  {forgotStep === 'new_password' && 'Create your new login password'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                disabled={isForgotLoading}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-full hover:bg-slate-50 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold text-left">
                {forgotError}
              </div>
            )}

            {/* STEP 1: Enter Phone Number or Email */}
            {forgotStep === 'identifier' && (
              <form onSubmit={handleSendForgotOtp} className="space-y-3.5">
                <div className="text-left">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Mobile Number or Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="Enter 10-digit number or email"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#A8071A] transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    We will find your account and send a 6-digit OTP to your registered email.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    disabled={isForgotLoading}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="flex-1 py-2.5 bg-[#A8071A] hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {isForgotLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Finding...</span>
                      </>
                    ) : (
                      <span>Send OTP</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter 6-digit OTP */}
            {forgotStep === 'otp' && (
              <form onSubmit={handleVerifyForgotOtp} className="space-y-3.5">
                <div className="text-left">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      6-Digit OTP Code <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotStep('identifier')}
                      className="text-[10px] text-[#A8071A] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <ArrowLeft className="w-3 h-3" /> Change
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={8}
                    required
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="Enter code"
                    className="w-full px-3.5 py-3 text-center tracking-[0.4em] font-mono text-base font-extrabold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-[#A8071A] focus:bg-white transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 text-center">
                    Check your inbox or spam folder for the Meat Ghar verification code.
                  </p>
                </div>

                <div className="flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isForgotLoading}
                    className="text-[11px] text-[#A8071A] font-bold hover:underline disabled:opacity-40 cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP to Email'}
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    disabled={isForgotLoading}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="flex-1 py-2.5 bg-[#A8071A] hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {isForgotLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify Code</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Enter New Password */}
            {forgotStep === 'new_password' && (
              <form onSubmit={handleSetNewPassword} className="space-y-3">
                <div className="text-left">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full px-3.5 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#A8071A] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-left">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#A8071A] transition-all"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    disabled={isForgotLoading}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="flex-1 py-2.5 bg-[#A8071A] hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {isForgotLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save & Login</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
