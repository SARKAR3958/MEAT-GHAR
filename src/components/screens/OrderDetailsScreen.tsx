import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  CreditCard,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { GreenTickLottie } from '../GreenTickLottie';

interface OrderDetailsScreenProps {
  onBack: () => void;
  onReorder: () => void;
  onGetHelp: () => void;
}

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  onBack,
  onReorder,
  onGetHelp,
}) => {
  const steps = [
    { title: 'Placed', time: '10:28 AM' },
    { title: 'Confirmed', time: '10:29 AM' },
    { title: 'Accepted', time: '10:32 AM' },
    { title: 'Preparing', time: '9:20 AM' },
    { title: 'Packed', time: '9:45 AM' },
    { title: 'Assigned', time: '9:58 AM' },
    { title: 'Out for Delivery', time: '10:05 AM' },
    { title: 'Delivered', time: '10:20 AM' },
  ];

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-extrabold text-slate-900">Order Details</h2>
          </div>

          <HeaderMeatGharLogo />
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Your order details and delivery journey at a glance.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-20">
        {/* Order Header Badge */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Order ID</span>
              <p className="text-xs font-black text-slate-900">#MM10284</p>
              <p className="text-[10px] text-slate-400 font-medium">29 Aug 2025 &bull; 10:28 AM</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <GreenTickLottie className="w-3.5 h-3.5 shrink-0" loop={true} /> Delivered
            </span>
          </div>

          {/* Delivery confirmation info with GreenTickLottie */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <GreenTickLottie className="w-8 h-8 shrink-0" loop={true} />
              <div>
                <span className="text-[10px] font-bold text-emerald-900 block uppercase">
                  Delivery Status
                </span>
                <span className="text-xs font-extrabold text-emerald-950">
                  Delivered on 29 Aug 2025, 11:45 AM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Journey Timeline */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold text-slate-900">Order Journey</h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Completed ✓
            </span>
          </div>

          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1 text-center">
            {steps.map((s) => (
              <div key={s.title} className="flex flex-col items-center min-w-[50px] shrink-0">
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center mb-1">
                  ✓
                </div>
                <span className="text-[8px] font-bold text-slate-800 leading-tight">{s.title}</span>
                <span className="text-[7px] text-slate-400 font-mono mt-0.5">{s.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold text-slate-900">Order Items</h3>
            <span className="text-[11px] font-bold text-slate-400">2 Items</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/src/assets/images/meat_onboarding_1_1790501345494.jpg"
                alt="Chicken"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
              />
              <div className="flex-1 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Fresh Chicken Curry Cut</p>
                  <p className="text-[10px] text-slate-500">1 KG &bull; Cleaned</p>
                </div>
                <span className="font-extrabold text-slate-900">₹420</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <img
                src="/src/assets/images/meat_onboarding_2_1790501365087.jpg"
                alt="Mutton"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
              />
              <div className="flex-1 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Mutton Boneless</p>
                  <p className="text-[10px] text-slate-500">500 G &bull; Cleaned</p>
                </div>
                <span className="font-extrabold text-slate-900">₹340</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-1.5 text-xs text-slate-600">
          <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-2">
            Price Breakdown
          </h3>
          <div className="flex justify-between">
            <span>Subtotal (2 items)</span><span className="font-bold text-slate-900">₹760</span>
          </div>
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Discount</span><span>₹0</span>
          </div>
          <div className="flex justify-between">
            <span>Packaging Charge</span><span className="font-bold text-slate-900">₹20</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span><span className="font-bold text-slate-900">₹30</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-100">
            <span>Tax (GST)</span><span className="font-bold text-slate-900">₹64</span>
          </div>
          <div className="flex justify-between font-black text-slate-900 text-sm pt-1">
            <span>Grand Total</span>
            <span className="text-[#A8071A] text-base">₹874</span>
          </div>
        </div>

        {/* Address & Payment Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">Delivery Address</span>
            <p className="text-xs font-bold text-slate-900">Rahul Sharma</p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
              House No. 24, Green Park Road, Sector 10 Noida
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">Payment Method</span>
            <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> UPI &bull; Paid
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Paid via UPI</p>
          </div>
        </div>

        {/* Delivery Partner */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img
                src="/src/assets/images/delivery_partner_avatar_1790502025354.jpg"
                alt="Partner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Amit Kumar</p>
              <p className="text-[10px] text-slate-400">MH12 AB 4587 &bull; 2.1 km away</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1">
              <Phone className="w-3 h-3" /> Call
            </button>
            <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Chat
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl flex items-center gap-2">
        <button
          onClick={onReorder}
          className="flex-1 py-3 px-4 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reorder</span>
        </button>

        <button
          onClick={onGetHelp}
          className="flex-1 py-3 px-4 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Get Help</span>
        </button>
      </div>
    </div>
  );
};
