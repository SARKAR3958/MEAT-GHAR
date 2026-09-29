import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { MeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';

interface LoginScreenProps {
  phoneNumber: string;
  setPhoneNumber: (num: string) => void;
  onLoginSubmit: (phone: string, pass: string) => void;
  onGoogleLogin: () => void;
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
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 5) {
      setErrorMsg('Please enter a valid mobile number');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }
    setErrorMsg('');
    onLoginSubmit(phoneNumber, password);
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

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-3"
          autoComplete="off"
          noValidate
          data-form-type="other"
        >
          {/* Phone Input Box with India flag (rounded-8px) */}
          <div className="relative">
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
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                onClick={() => alert('OTP / Reset link sent to your registered mobile')}
                className="text-[11px] font-bold text-[#A8071A] hover:underline"
              >
                Forgot?
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
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
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

          {/* Primary Action Button (Brand Red, rounded-12px) */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#A8071A] hover:bg-[#8C0818] active:bg-[#720412] text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-950/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>LOGIN</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Divider with 'OR' */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider absolute">
            OR
          </span>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={onGoogleLogin}
          className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl shadow-2xs transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {/* Google colored G SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Don't have an account? Sign Up Link */}
        <p className="text-center text-xs text-slate-500 mt-3 font-medium">
          Don't have an account?{' '}
          <button
            onClick={onGoToSignUp}
            className="text-[#A8071A] font-extrabold hover:underline cursor-pointer ml-0.5"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* Pinned Bottom BG Platter Graphic Banner with Smooth Top Blend */}
      <div className="w-full h-36 relative mt-auto overflow-hidden shrink-0">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <AppImage
          src="/images/bg_1790503776302.jpg"
          alt="Meat Ghar BG"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};
