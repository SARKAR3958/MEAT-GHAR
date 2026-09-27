import React from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  Gift,
  Clock,
  Wallet,
  PhoneCall,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { GreenTickLottie } from '../GreenTickLottie';

interface OrderDeliveredGuaranteeBreachedScreenProps {
  onBack: () => void;
  onContactSupport: () => void;
}

export const OrderDeliveredGuaranteeBreachedScreen: React.FC<
  OrderDeliveredGuaranteeBreachedScreenProps
> = ({ onBack, onContactSupport }) => {
  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <HeaderMeatGharLogo />

        <button
          onClick={onContactSupport}
          className="text-xs font-bold text-[#A8071A] hover:underline cursor-pointer"
        >
          Support
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar pb-16">
        {/* Apology Banner Header */}
        <div className="bg-red-50/60 border border-red-200 rounded-2xl p-4 text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            We're Really Sorry!
          </h2>
          <p className="text-xs text-slate-600 font-normal leading-relaxed max-w-xs mx-auto">
            Your order was delivered later than our 70-minute guarantee. We understand this may have caused inconvenience.
          </p>
          <p className="text-[10px] text-slate-400 font-semibold">
            Thank you for your patience and support.
          </p>
        </div>

        {/* Guarantee Breached Red Badge */}
        <div className="bg-[#A8071A] text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0">
              !
            </div>
            <div>
              <p className="text-xs font-black">70-Minute Guarantee Breached</p>
              <p className="text-[10px] text-white/80">Order was delivered after guaranteed time.</p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-center shrink-0 border border-white/30">
            <span className="text-[9px] font-bold block text-red-100">Delayed by</span>
            <span className="text-xs font-black text-white">8 minutes</span>
          </div>
        </div>

        {/* Compensation Full Refund Box with Green Tick Lottie */}
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-emerald-200 pb-2">
            <GreenTickLottie className="w-12 h-12" loop={true} />
            <div>
              <h3 className="text-xs font-extrabold text-emerald-950">Compensation Approved &amp; Credited</h3>
              <p className="text-[10px] text-emerald-800 font-medium">
                As per our 70-minute guarantee, you have received full refund / wallet credit.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-emerald-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Compensation Amount</span>
              <span className="text-xl font-black text-emerald-700">₹1,114</span>
            </div>

            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Wallet className="w-3 h-3 text-emerald-700" /> Wallet Credit
              </span>
              <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Will be added to Meat Ghar wallet</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
          <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Order Summary (#MM10284)
          </h3>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Fresh Chicken Curry Cut (1 KG)</span>
            <span className="font-bold text-slate-900">₹420</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Mutton Boneless (500 G)</span>
            <span className="font-bold text-slate-900">₹340</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onBack}
            className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-900/20 transition-all cursor-pointer"
          >
            View Order &gt;
          </button>

          <button
            onClick={onContactSupport}
            className="w-full py-3 px-6 bg-white border-2 border-[#A8071A] text-[#A8071A] hover:bg-red-50 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Contact Support &gt;</span>
          </button>
        </div>

        {/* Processing note */}
        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between text-[10px] text-emerald-800 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Compensation is Being Processed (within 24 hrs)</span>
          </div>
          <span className="italic font-bold">Good Food Always!</span>
        </div>
      </div>
    </div>
  );
};
