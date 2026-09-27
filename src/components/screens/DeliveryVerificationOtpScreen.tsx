import React from 'react';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  PackageCheck,
  Sparkles,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';

interface DeliveryVerificationOtpScreenProps {
  onBack: () => void;
  onOtpConfirmedOnTime: () => void;
  onOtpConfirmedLate: () => void;
}

export const DeliveryVerificationOtpScreen: React.FC<DeliveryVerificationOtpScreenProps> = ({
  onBack,
  onOtpConfirmedOnTime,
  onOtpConfirmedLate,
}) => {
  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-none">Delivery Confirmation</h2>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Direct Handover (No OTP Required)
            </p>
          </div>
        </div>

        <HeaderMeatGharLogo />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-24">
        <p className="text-xs text-slate-500 font-medium leading-relaxed text-center">
          Your delivery partner has arrived at your doorstep. Receive your fresh order directly without any OTP.
        </p>

        {/* Order & Partner Status */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Order ID</span>
              <p className="text-xs font-black text-slate-900">#MM10284</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Arrived at Doorstep
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img
                  src="/src/assets/images/delivery_partner_avatar_1790502025354.jpg"
                  alt="Amit Kumar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Amit Kumar</p>
                <p className="text-[10px] text-slate-500 font-medium">MH12 AB 4587 &bull; Delivery Executive</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:9876543210"
                className="p-2 bg-slate-100 rounded-full text-slate-700 hover:bg-slate-200 transition-colors"
                title="Call Rider"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                className="p-2 bg-slate-100 rounded-full text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Message Rider"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Direct Verification Confirmation Card (No OTP) */}
        <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 text-center space-y-2.5 shadow-2xs relative">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <PackageCheck className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-sm font-black text-emerald-950">
              Instant Doorstep Verification
            </h3>
            <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
              Zero hassle! No OTP code exchange needed. The rider will hand over your tamper-sealed box directly.
            </p>
          </div>

          <div className="bg-white/90 rounded-xl p-2.5 text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1.5 border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Meat Ghar Seal & Temperature Inspected</span>
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-red-600/30 text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-extrabold text-white flex items-center gap-1.5">
              100% Freshness Guarantee
            </p>
            <p className="text-[10px] text-slate-300 font-normal mt-0.5 leading-snug">
              If your meat isn't 100% fresh or chilled to perfection, get instant replacement or refund via Support.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl">
        <button
          onClick={onOtpConfirmedOnTime}
          className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm Delivery Received &rarr;</span>
        </button>
      </div>
    </div>
  );
};
