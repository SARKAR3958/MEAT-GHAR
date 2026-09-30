import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { MeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';

interface SignUpFormScreenProps {
  onSignUpSubmit: (data: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
  }) => void;
  onGoogleLogin: () => void;
  onGoToLogin: () => void;
}

export const SignUpFormScreen: React.FC<SignUpFormScreenProps> = ({
  onSignUpSubmit,
  onGoogleLogin,
  onGoToLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Please enter your full name');
      return;
    }
    const cleanDigits = trimmedPhone.replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setErrorMsg('');
    onSignUpSubmit({
      fullName: trimmedName,
      phone: cleanDigits,
      email: trimmedEmail,
      password,
    });
  };

  return (
    <div className="w-full h-full bg-white text-slate-800 flex flex-col justify-between relative overflow-y-auto no-scrollbar select-none">
      {/* Main Content Area */}
      <div className="px-6 pt-5 pb-2 z-10 flex-1 flex flex-col justify-start">
        {/* Logo - Matches Login Screen Exactly */}
        <div className="mb-2 flex justify-center">
          <MeatGharLogo variant="red" size="md" showTagline={true} />
        </div>

        {/* Heading */}
        <div className="text-left mt-1 mb-3">
          <h2
            className="text-2xl font-extrabold text-[#111827] tracking-tight mb-0.5"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Create Your Account
          </h2>
          <p className="text-xs text-slate-500 font-normal leading-relaxed">
            Fill in your details to get fresh meat delivered.
          </p>
        </div>

        {/* Sign Up Form */}
        <form
          onSubmit={handleFormSubmit}
          className="space-y-2.5"
          autoComplete="off"
          noValidate
          data-form-type="other"
        >
          {/* Full Name */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="user_fullname_no_autofill"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#A8071A] focus:ring-1 focus:ring-[#A8071A] transition-all shadow-2xs"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
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
                name="user_regphone_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10 digit number"
                className="w-full pl-20 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#A8071A] focus:ring-1 focus:ring-[#A8071A] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="user_regemail_no_autofill"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#A8071A] focus:ring-1 focus:ring-[#A8071A] transition-all shadow-2xs"
            />
          </div>

          {/* Password & Confirm Password in 2 columns */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="user_newpass_no_autofill"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#A8071A] focus:ring-1 focus:ring-[#A8071A] transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="user_confirmpass_no_autofill"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm"
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#A8071A] focus:ring-1 focus:ring-[#A8071A] transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Referral Code (Optional) */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between mb-1">
              <span>Referral Code</span>
              <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="user_refcode_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={referralCodeInput}
                onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter Friend's Code (e.g. RAHUL3210)"
                className="w-full pl-3.5 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#A8071A] focus:ring-1 focus:ring-[#A8071A] transition-all shadow-2xs uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400"
              />
              {referralCodeInput && (
                <span className="absolute right-3 text-emerald-600 font-bold text-xs">✓ Valid</span>
              )}
            </div>
          </div>

          {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#A8071A] hover:bg-[#8C0818] active:bg-[#720412] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-red-950/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <span>CREATE ACCOUNT</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Already have an account? Login Link */}
        <p className="text-center text-xs text-slate-500 mt-4 font-medium">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-[#A8071A] font-extrabold hover:underline cursor-pointer ml-0.5"
          >
            Login
          </button>
        </p>
      </div>

      {/* Pinned Bottom BG Platter Graphic Banner with Smooth Top Blend */}
      <div className="w-full h-28 relative mt-auto overflow-hidden shrink-0">
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <AppImage
          src="/images/bg_1790503776302.jpg"
          alt="Meat Ghar BG"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};
