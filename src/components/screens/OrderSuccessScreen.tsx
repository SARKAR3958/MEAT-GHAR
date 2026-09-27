import React, { useEffect } from 'react';
import { ChevronRight, Clock, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';
import { GreenTickAnimation } from '../GreenTickAnimation';
import { HeaderMeatGharLogo } from '../MeatGharLogo';

interface OrderSuccessScreenProps {
  onTrackOrder: () => void;
  onViewOrderDetails: () => void;
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({
  onTrackOrder,
  onViewOrderDetails,
}) => {
  // Optional auto-redirect after celebration, or manual click
  useEffect(() => {
    const timer = setTimeout(() => {
      // Optional subtle hint or auto-transition if desired
    }, 4000);
    return () => clearTimeout(timer);
  }, [onTrackOrder]);

  return (
    <div className="w-full h-full min-h-[780px] bg-white text-slate-800 flex flex-col justify-between select-none relative overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-slate-100">
        <span className="text-xs font-bold text-slate-400">Order Confirmed</span>
        <HeaderMeatGharLogo />
      </div>

      {/* Main Body */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center text-center">
        {/* Animated Green Tick */}
        <div className="relative mb-2 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-100/50 rounded-full scale-125 blur-xl animate-pulse" />
          <GreenTickAnimation size={150} loop={false} />
        </div>

        {/* Success Message */}
        <div className="space-y-1 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Payment Successful
          </span>
          <h2
            className="text-2xl font-black text-slate-900 tracking-tight pt-1"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Order <span className="font-mono font-bold text-slate-700">#MM10312</span> has been assigned to our master butcher.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-3 shadow-xs mb-6">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#BA181B]" />
              <span className="text-xs font-bold text-slate-800">Estimated Delivery</span>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              30 Mins Express
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-slate-700">Delivery Address</p>
              <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                MG Road, Sector 10, Noida, Uttar Pradesh, 201301
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShoppingBag className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-slate-700">Items Ordered</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                1x Premium Fresh Chicken Curry Cut (500g)
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 text-xs">
            <span className="font-bold text-slate-600">Total Amount Paid</span>
            <span className="font-black text-slate-900 text-sm">₹470.00</span>
          </div>
        </div>

        {/* Quality Guarantee Pill */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Halal Fresh Cut &bull; Vacuum-Sealed Cold Pack</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-t border-slate-100 space-y-2">
        <button
          onClick={onTrackOrder}
          className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Track Live Order</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onViewOrderDetails}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          View Order Details
        </button>
      </div>
    </div>
  );
};
