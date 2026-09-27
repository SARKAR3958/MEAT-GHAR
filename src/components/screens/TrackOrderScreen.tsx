import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  ShieldCheck,
  Check,
  ChevronRight,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';

interface TrackOrderScreenProps {
  onBack: () => void;
  onArrivedOtpView: () => void;
  onMarkDelivered?: () => void;
}

export const TrackOrderScreen: React.FC<TrackOrderScreenProps> = ({
  onBack,
  onArrivedOtpView,
  onMarkDelivered,
}) => {
  // Step state: 1 = Confirmed, 2 = Packed (after 10m), 3 = On Route (after 10m), 4 = Delivered
  const [currentStep] = useState<1 | 2 | 3 | 4>(3);
  const [isDelivered] = useState(false);

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Top Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-30 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-none">Track Your Order</h2>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Order ID #MM10312</p>
            </div>
          </div>

          <HeaderMeatGharLogo />
        </div>
      </div>

      {/* Main Order Tracker Scroll Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-24">
        {/* Estimated Delivery Time Banner */}
        <div className={`rounded-2xl p-4 border shadow-2xs transition-all ${
          isDelivered
            ? 'bg-emerald-500 text-white border-emerald-600'
            : 'bg-slate-900 text-white border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                {isDelivered ? 'Order Delivered!' : 'Estimated Delivery Time'}
              </span>
            </div>
            <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full font-bold">
              {isDelivered ? 'COMPLETED' : '35 - 45 MINS'}
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-black tracking-tight">
              {isDelivered ? 'Delivered on Time 🎉' : '10:25 AM Today'}
            </h3>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] opacity-90">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 70-Min On-Time Guarantee
            </span>
            <span className="font-bold">Meat Ghar Express</span>
          </div>
        </div>

        {/* Status Timeline Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Order Status Timeline
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {/* STEP 1: ORDER CONFIRMED */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900">1. Order Confirmed</h4>
                  <span className="text-[10px] font-mono text-slate-400">09:15 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Your fresh meat order has been accepted & sent to the store.
                </p>
              </div>
            </div>

            {/* STEP 2: ORDER PACKED (After 10 min) */}
            <div className="relative">
              <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-2xs ${
                currentStep >= 2
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep >= 2 ? <Check className="w-3 h-3 stroke-[3]" /> : <Package className="w-3 h-3" />}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-extrabold ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                    2. Packed (after 10 min)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">09:25 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Hygiene checked & custom cut packed in temperature-controlled seal.
                </p>
              </div>
            </div>

            {/* STEP 3: ON ROUTE / OUT FOR DELIVERY (After 10 min) */}
            <div className="relative">
              <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-2xs ${
                currentStep >= 3 && !isDelivered
                  ? 'bg-[#BA181B] text-white ring-4 ring-red-100 animate-pulse'
                  : currentStep > 3
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 3 ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : (
                  <Truck className="w-3 h-3" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-extrabold ${
                    currentStep === 3 && !isDelivered ? 'text-[#BA181B]' : currentStep > 3 ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    3. On Route (after 10 min)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">09:35 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Rider is on the way to your delivery address.
                </p>
              </div>
            </div>

            {/* STEP 4: DELIVERED */}
            <div className="relative">
              <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-2xs ${
                isDelivered ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-400'
              }`}>
                {isDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3 h-3" />}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-extrabold ${isDelivered ? 'text-emerald-700 font-black' : 'text-slate-400'}`}>
                    4. Order Delivered
                  </h4>
                  {isDelivered && <span className="text-[10px] font-bold text-emerald-600 font-mono">09:50 AM</span>}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Handed over safely at your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rider & Address Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                RK
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Ramesh Kumar</h4>
                <p className="text-[10px] text-slate-500 font-medium">Delivery Partner &bull; Meat Ghar</p>
              </div>
            </div>

            <a
              href="tel:9876543210"
              className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>

          {/* Delivery Location */}
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-[#BA181B] shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-900 block">Delivery Address:</span>
              <p className="text-slate-600 font-medium leading-relaxed">
                House No. 24, Green Park Road, Sector 10, Noida, UP - 201301
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Verification Button / View Summary */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl">
        <button
          onClick={onArrivedOtpView}
          className="w-full py-3.5 px-6 bg-[#BA181B] hover:bg-red-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Confirm Delivery Handover (No OTP)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
