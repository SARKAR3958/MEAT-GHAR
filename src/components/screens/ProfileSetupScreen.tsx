import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail, Phone, Lock } from 'lucide-react';
import { MeatGharLogo } from '../MeatGharLogo';

interface ProfileSetupScreenProps {
  phoneNumber: string;
  onBack: () => void;
  onComplete: (profile: { fullName: string; email: string }) => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  phoneNumber,
  onBack,
  onComplete,
}) => {
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul@example.com');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    setErrorMsg('');
    onComplete({ fullName, email });
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-white text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-slate-100/50">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold text-slate-400">Step 3 of 3</span>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-2 pb-2 z-10 flex-1 flex flex-col items-center">
        {/* Meat Ghar Logo */}
        <div className="mb-3">
          <MeatGharLogo variant="red" size="sm" showTagline={true} />
        </div>

        {/* Headings */}
        <div className="text-center mb-5">
          <h2
            className="text-2xl font-extrabold text-[#111827] tracking-tight mb-1"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Profile Setup
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Tell us a little about yourself to complete your profile.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5 mb-4">
          {/* Full Name Field */}
          <div>
            <div className="relative flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50/50 focus-within:bg-white focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
              <div className="pl-3.5 pr-1 text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <div className="w-full py-2 px-2 flex flex-col">
                <label className="text-[10px] font-semibold text-slate-400">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter your name"
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent outline-none"
                />
              </div>
            </div>
            {errorMsg && (
              <p className="text-[11px] text-red-600 font-medium mt-1 ml-1">{errorMsg}</p>
            )}
          </div>

          {/* Email Field (Optional) */}
          <div className="relative flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50/50 focus-within:bg-white focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <div className="pl-3.5 pr-1 text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <div className="w-full py-2 px-2 flex flex-col">
              <label className="text-[10px] font-semibold text-slate-400">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Mobile Number Field (Read-only) */}
          <div className="relative flex items-center border border-slate-200 bg-slate-100/70 rounded-xl overflow-hidden opacity-90">
            <div className="pl-3.5 pr-1 text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <div className="w-full py-2 px-2 flex flex-col">
              <label className="text-[10px] font-semibold text-slate-400">
                Mobile Number
              </label>
              <input
                type="text"
                readOnly
                value={`+91 ${phoneNumber || '98765 43210'}`}
                className="w-full text-xs sm:text-sm font-semibold text-slate-600 bg-transparent outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Lock Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Your information is safe and secure with us.</span>
        </div>
      </div>

      {/* Bottom Fresh Meat Platter Graphic Banner */}
      <div className="w-full h-36 relative mt-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
        <img
          src="/src/assets/images/meat_bottom_platter_1790501395172.jpg"
          alt="Fresh Meat Platter"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};
