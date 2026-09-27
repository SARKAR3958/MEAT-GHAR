import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { GreenTickLottie } from '../GreenTickLottie';

interface OtpVerificationScreenProps {
  phoneNumber: string;
  onBack: () => void;
  onVerify: () => void;
  onChangeNumber: () => void;
}

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  phoneNumber,
  onBack,
  onVerify,
  onChangeNumber,
}) => {
  return (
    <div className="w-full h-full min-h-[780px] bg-white text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-slate-100">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <HeaderMeatGharLogo />
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-2 z-10 flex-1 flex flex-col items-center">
        {/* Headings with Looping Green Tick Animation */}
        <div className="text-center mb-6">
          <GreenTickLottie className="w-20 h-20 mx-auto mb-2" loop={true} />
          <h2
            className="text-2xl font-extrabold text-[#111827] tracking-tight mb-1"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Direct Mobile Sign In
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            No OTP required. Instant secure access to fresh meat.
          </p>
        </div>

        {/* Phone Badge Display */}
        <div className="bg-slate-100/80 rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-200/80 mb-6 shadow-2xs w-full max-w-xs justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🇮🇳</span>
            <span className="text-sm font-bold text-slate-800 tracking-wider">
              +91 {phoneNumber || '98765 43210'}
            </span>
          </div>
          <button
            onClick={onChangeNumber}
            className="text-xs font-bold text-[#A8071A] hover:underline cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* Verify Button */}
        <button
          onClick={onVerify}
          className="w-full max-w-xs py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mb-3"
        >
          <span>Continue to App</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Fresh Meat Platter Graphic with Shield Badge */}
      <div className="w-full h-36 relative mt-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
        <img
          src="/src/assets/images/meat_bottom_platter_1790501395172.jpg"
          alt="Fresh Meat Platter"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />

        <div className="absolute bottom-3 right-4 z-20 bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 border border-slate-200 shadow-lg flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-[10px] font-bold text-slate-800 leading-tight">
            Safe &amp; Secure<br />
            <span className="text-emerald-700">Meat Ghar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
