import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { MeatGharLogo } from '../MeatGharLogo';

interface LoginScreenProps {
  phoneNumber: string;
  setPhoneNumber: (num: string) => void;
  onLoginSubmit: (phone: string, pass: string) => void;
  onGoogleLogin: () => void;
  onGoToSignUp: () => void;
}

export const SignupScreen: React.FC<LoginScreenProps> = ({
  phoneNumber,
  setPhoneNumber,
  onLoginSubmit,
  onGoogleLogin,
  onGoToSignUp,
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
    <div className="w-full h-full min-h-[780px] bg-white text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Main Form Area */}
      <div className="px-6 pt-6 pb-2 z-10 flex-1 flex flex-col justify-start">
        {/* Logo */}
        <div className="mb-3">
          <MeatGharLogo variant="red" size="md" showTagline={true} />
        </div>

        {/* Headings */}
        <div className="text-left mt-1 mb-5">
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
            <label className="text-[10px] font-bold text-slate-500 block mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all bg-slate-50/50">
              {/* Indian Flag Box with rounded-[8px] border radius */}
              <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-100/90 border-r border-slate-300 text-xs font-extrabold text-slate-700 shrink-0">
                <div className="w-6 h-4 rounded-[3px] overflow-hidden shadow-2xs border border-slate-300 flex flex-col shrink-0 relative bg-white">
                  {/* Saffron */}
                  <div className="h-1.5 bg-[#FF9933] w-full" />
                  {/* White with Chakra */}
                  <div className="h-1.5 bg-white w-full flex items-center justify-center relative">
                    <div className="w-1.5 h-1.5 rounded-full border border-[#000080] flex items-center justify-center">
                      <div className="w-0.5 h-0.5 bg-[#000080] rounded-full" />
                    </div>
                  </div>
                  {/* Green */}
                  <div className="h-1.5 bg-[#138808] w-full" />
                </div>
                <span>+91</span>
              </div>

              {/* Number Input */}
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
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="98765 43210"
                className="w-full px-3 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 bg-transparent outline-none"
                maxLength={14}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 block mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all bg-slate-50/50 px-3 py-3">
              <input
                type={showPassword ? 'text' : 'password'}
                name="user_pass_no_autofill"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter password"
                className="w-full text-sm font-semibold text-slate-800 placeholder-slate-400 bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="View Password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-xs text-red-600 font-medium ml-1">{errorMsg}</p>
          )}

          {/* LOGIN Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-black text-sm sm:text-base rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider mt-1"
          >
            <span>LOGIN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="absolute bg-white px-3 text-[10px] font-bold text-slate-400 tracking-wider">
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

      {/* Pinned Bottom BG.PNG Platter Graphic Banner with Smooth Top Blend */}
      <div className="w-full h-36 relative mt-auto overflow-hidden shrink-0">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <img
          src="/src/assets/images/bg_1790503776302.jpg"
          alt="Meat Ghar BG"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};
