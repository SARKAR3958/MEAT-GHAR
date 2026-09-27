import React from 'react';
import {
  ArrowLeft,
  MapPin,
  Home,
  Briefcase,
  MoreHorizontal,
  Edit2,
  Trash2,
  Plus,
  Info,
  Grid,
  ShoppingBag,
  User,
} from 'lucide-react';
import { MeatGharLogo } from '../MeatGharLogo';

interface MyAddressesScreenProps {
  onBack: () => void;
  onAddNewAddress: () => void;
  onNavigateTab: (tab: string) => void;
}

export const MyAddressesScreen: React.FC<MyAddressesScreenProps> = ({
  onBack,
  onAddNewAddress,
  onNavigateTab,
}) => {
  const addresses = [
    {
      id: 'a1',
      type: 'Home',
      icon: Home,
      isDefault: true,
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      address: 'House No. 24, Green Park Road, Sector 10, Noida, Uttar Pradesh - 201301',
    },
    {
      id: 'a2',
      type: 'Work',
      icon: Briefcase,
      isDefault: false,
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      address: 'Office No. 302, Tower B, Business Park, VIP Road, Guwahati, Assam - 781022',
    },
    {
      id: 'a3',
      type: 'Other',
      icon: MoreHorizontal,
      isDefault: false,
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      address: 'Village - Dighalipukhuri, P.O - Boko, Kamrup (R), Assam - 781123',
    },
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
            <h2 className="text-lg font-extrabold text-slate-900">My Addresses</h2>
          </div>

          <MeatGharLogo variant="red" size="sm" showTagline={false} />
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Manage your delivery addresses.
        </p>
      </div>

      {/* Main Addresses List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-16">
        {addresses.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#A8071A] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{a.type}</span>
                  {a.isDefault && (
                    <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <span className="text-slate-400 font-bold text-xs">...</span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900">{a.name}</p>
                <p className="text-[11px] text-slate-500 font-medium">📞 {a.phone}</p>
                <p className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                  📍 {a.address}
                </p>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button className="py-1.5 px-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="py-1.5 px-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Address Button */}
        <button
          onClick={onAddNewAddress}
          className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium justify-center pt-1">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Delivery charges and availability are calculated based on the address you select.</span>
        </div>
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
        <button onClick={() => onNavigateTab('cart')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-[#A8071A] text-white text-[9px] font-bold flex items-center justify-center">2</span>
          <span className="text-[10px] font-semibold">Cart</span>
        </button>
        <button onClick={() => onNavigateTab('profile')} className="flex flex-col items-center gap-0.5 text-[#A8071A]">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
};
