import React from 'react';
import { MapPin, Sparkles, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { MeatGharLogo } from '../MeatGharLogo';

interface NoAddressOnboardingScreenProps {
  onAddAddressClick: () => void;
  userName?: string;
}

export const NoAddressOnboardingScreen: React.FC<NoAddressOnboardingScreenProps> = ({
  onAddAddressClick,
  userName,
}) => {
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-red-50/40 via-white to-slate-50 flex flex-col justify-between select-none overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="pt-6 pb-2 px-5 flex flex-col items-center text-center">
        <MeatGharLogo variant="red" size="md" showTagline={true} />
      </div>

      {/* Center Hero Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 text-center max-w-md mx-auto w-full">
        {/* Map Illustration Frame */}
        <div className="relative w-full max-w-[280px] aspect-4/3 rounded-3xl overflow-hidden shadow-xl shadow-red-950/10 border-2 border-red-100 bg-white mb-6 transform hover:scale-[1.02] transition-transform">
          <img
            src="/src/assets/images/map_delivery_illustration_1790502010289.jpg"
            alt="Delivery Location Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center p-3">
            <span className="bg-white/95 backdrop-blur-xs text-[#A8071A] font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 fill-[#A8071A]" />
              Guwahati • Boko • Dhupdhara
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#A8071A] text-[11px] font-bold tracking-wide uppercase mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Delivery Address Required</span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
          {userName ? `Welcome, ${userName}!` : 'Welcome to Meat Ghar!'}
        </h2>

        <p className="text-sm font-semibold text-slate-600 mt-2 leading-relaxed px-2">
          Please add your delivery address to get fresh halal meat delivered to your doorstep in 70 minutes.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-2.5 w-full mt-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 text-left shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-red-50 text-[#A8071A] flex items-center justify-center mb-1.5 font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-800">70-Min Express</h4>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Quick delivery at your door</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 text-left shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-800">100% Halal</h4>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Strict quality & hygiene</p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="p-5 pb-8 bg-white/80 backdrop-blur-md border-t border-slate-100 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={onAddAddressClick}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#A8071A] to-[#800412] hover:from-red-800 hover:to-red-900 active:scale-[0.99] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <MapPin className="w-5 h-5 fill-white" />
          <span>Add Delivery Address</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        <p className="text-center text-[10px] text-slate-400 font-medium mt-3">
          Currently serving Boko and Dhupdhara in Guwahati region
        </p>
      </div>
    </div>
  );
};
