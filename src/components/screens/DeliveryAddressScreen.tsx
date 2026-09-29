import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Edit2,
  Trash2,
  Plus,
  Truck,
  ShieldCheck,
  ArrowRight,
  Home,
  Grid,
  ShoppingBag,
  User,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';

interface DeliveryAddressScreenProps {
  onBack: () => void;
  onContinueToCheckout: () => void;
  onAddNewAddress: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DeliveryAddressScreen: React.FC<DeliveryAddressScreenProps> = ({
  onBack,
  onContinueToCheckout,
  onAddNewAddress,
  onNavigateTab,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState('home');

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-extrabold text-slate-900">Delivery Address</h2>
        </div>

        <HeaderMeatGharLogo />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar pb-24">
        {/* Top Current Area Selector Banner */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-50 text-[#A8071A] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 fill-[#A8071A]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Deliver to</span>
            <p className="text-xs font-extrabold text-slate-900">
              Sector 10, Noida <span className="text-slate-400 font-normal">v Change location</span>
            </p>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-slate-900">Saved Addresses</h3>
            <span className="text-[11px] font-bold text-[#A8071A] cursor-pointer">
              Manage Addresses &gt;
            </span>
          </div>

          <div className="space-y-3">
            {/* Address 1: Home */}
            <div
              onClick={() => setSelectedAddressId('home')}
              className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer relative shadow-2xs ${
                selectedAddressId === 'home'
                  ? 'border-[#A8071A] ring-2 ring-red-500/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-red-50 text-[#A8071A] p-1.5 rounded-lg">
                    <Home className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Home</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#A8071A] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                    Default Address
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedAddressId === 'home'
                        ? 'border-[#A8071A] bg-[#A8071A]'
                        : 'border-slate-300'
                    }`}
                  >
                    {selectedAddressId === 'home' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Address details */}
              <div className="mt-2.5">
                <p className="text-xs font-bold text-slate-900">Rahul Sharma</p>
                <p className="text-[11px] text-slate-500 font-medium">📞 +91 98765 43210</p>
                <p className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                  📍 House No. 24, Green Park Road, Sector 10, Noida, Uttar Pradesh - 201301
                </p>
              </div>

              {/* Mini Map Box */}
              <div className="mt-2 bg-slate-100 rounded-xl p-2 flex items-center justify-between text-[10px] font-bold text-slate-600 border border-slate-200">
                <span>🗺️ 4.2 KM from store</span>
                <span className="text-[#A8071A]">View on Map</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-100 text-xs font-bold">
                <button className="text-slate-600 hover:text-[#A8071A] flex items-center gap-1">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="text-red-500 hover:text-red-700 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>

            {/* Address 2: Work */}
            <div
              onClick={() => setSelectedAddressId('work')}
              className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer relative shadow-2xs ${
                selectedAddressId === 'work'
                  ? 'border-[#A8071A] ring-2 ring-red-500/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-700 p-1.5 rounded-lg">
                    🏢
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Work</span>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAddressId === 'work'
                      ? 'border-[#A8071A] bg-[#A8071A]'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedAddressId === 'work' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs font-bold text-slate-900">Amit Kumar</p>
                <p className="text-[11px] text-slate-500 font-medium">📞 +91 87654 32109</p>
                <p className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                  📍 Tech Park, Sector 62, Noida, Uttar Pradesh - 201309
                </p>
              </div>

              <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-100 text-xs font-bold">
                <button className="text-slate-600 hover:text-[#A8071A] flex items-center gap-1">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="text-red-500 hover:text-red-700 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* Add New Address Button */}
          <button
            onClick={onAddNewAddress}
            className="w-full mt-3 py-3 px-4 bg-white border-2 border-[#A8071A] text-[#A8071A] hover:bg-red-50 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Delivery Information Box */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3.5 space-y-2">
          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#A8071A]" />
            <span>Delivery Information</span>
          </h4>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] text-slate-400 font-semibold block">Road Distance</span>
              <span className="text-xs font-black text-slate-900">4.2 KM</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] text-slate-400 font-semibold block">Delivery Fee</span>
              <span className="text-xs font-black text-slate-900">₹30</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] text-slate-400 font-semibold block">70-min guarantee</span>
              <span className="text-xs font-black text-emerald-600 flex items-center justify-center gap-0.5">
                Eligible ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Button */}
      <div className="absolute bottom-12 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl">
        <button
          onClick={onContinueToCheckout}
          className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around z-20">
        <button onClick={() => onNavigateTab('home')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button onClick={() => onNavigateTab('categories')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Categories</span>
        </button>
        <button onClick={() => onNavigateTab('orders')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Orders</span>
        </button>
        <button onClick={() => onNavigateTab('cart')} className="flex flex-col items-center gap-0.5 text-[#A8071A] relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-[#A8071A] text-white text-[9px] font-bold flex items-center justify-center">2</span>
          <span className="text-[10px] font-bold">Cart</span>
        </button>
        <button onClick={() => onNavigateTab('profile')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </div>
    </div>
  );
};
