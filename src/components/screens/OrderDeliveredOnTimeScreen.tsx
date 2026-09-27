import React from 'react';
import {
  ArrowLeft,
  Clock,
  Star,
  RotateCcw,
  FileText,
  Heart,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { GreenTickLottie } from '../GreenTickLottie';

interface OrderDeliveredOnTimeScreenProps {
  onBack: () => void;
  onRateOrder: () => void;
  onOrderAgain: () => void;
  onViewOrderDetails: () => void;
}

export const OrderDeliveredOnTimeScreen: React.FC<OrderDeliveredOnTimeScreenProps> = ({
  onBack,
  onRateOrder,
  onOrderAgain,
  onViewOrderDetails,
}) => {
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

        <button className="text-xs font-bold text-[#A8071A] hover:underline cursor-pointer">
          Support
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar pb-16">
        {/* Success Header with Looping Green Tick Lottie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs text-center space-y-2">
          <GreenTickLottie className="w-24 h-24 mx-auto drop-shadow-sm" loop={true} />

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Order Delivered!
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Your order has been delivered successfully.
          </p>
        </div>

        {/* Order Info & Guarantee Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Order ID</span>
              <p className="text-xs font-black text-slate-900">#MM10284</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Delivered ✓
            </span>
          </div>

          {/* Guarantee Badge */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                ⏱️
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  70-Minute Delivery Guarantee
                </span>
                <span className="text-sm font-black text-emerald-950">Delivered On Time</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-medium block">Delivered at</span>
              <span className="text-xs font-bold text-slate-900">10:28 AM (70m)</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
          <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Order Summary
          </h3>

          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Fresh Chicken Curry Cut (1 KG)</span>
            <span className="font-bold text-slate-900">₹420</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Mutton Boneless (500 G)</span>
            <span className="font-bold text-slate-900">₹340</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm font-black text-slate-900">
            <span>Total Amount</span>
            <span className="text-[#A8071A]">₹1,114</span>
          </div>
        </div>

        {/* Actions Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Rate Your Order Button */}
          <button
            onClick={onRateOrder}
            className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>Rate Your Order &gt;</span>
          </button>

          {/* Order Again Button */}
          <button
            onClick={onOrderAgain}
            className="w-full py-3 px-6 bg-white border-2 border-[#A8071A] text-[#A8071A] hover:bg-red-50 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Order Again &gt;</span>
          </button>

          {/* View Details Button */}
          <button
            onClick={onViewOrderDetails}
            className="w-full py-2.5 px-6 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Order Details &gt;</span>
          </button>
        </div>

        {/* Thank You Note */}
        <div className="text-center pt-2 text-slate-400 text-xs font-semibold">
          <span>🍃 Thank you for choosing Meat Ghar! Fresh Meat. Fresh Life.</span>
        </div>
      </div>
    </div>
  );
};
