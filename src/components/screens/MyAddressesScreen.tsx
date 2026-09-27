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
  ShoppingCart,
  ClipboardList,
  User,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { useCart } from '../../context/CartContext';

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
  const { cartCount } = useCart();
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
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. FIXED TOP HEADER (Never scrolls) */}
      <div className="shrink-0 bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="text-base font-black text-slate-900 leading-tight">My Addresses</h2>
          </div>

          <HeaderMeatGharLogo onClick={() => onNavigateTab('home')} />
        </div>
        <p className="text-xs text-slate-500 font-medium">Manage delivery locations for quick ordering.</p>
      </div>

      {/* 2. SCROLLABLE CONTENT ONLY */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar pb-6">
        {addresses.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-3.5 border shadow-2xs relative transition-all ${
                item.isDefault ? 'border-[#BA181B]/80 ring-1 ring-[#BA181B]/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      item.isDefault ? 'bg-red-50 text-[#BA181B]' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-slate-900 text-xs">{item.type}</span>
                  {item.isDefault && (
                    <span className="text-[9px] bg-red-100 text-[#BA181B] font-extrabold px-1.5 py-0.5 rounded-md">
                      Default
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-0.5 mb-2.5">
                <p className="text-xs font-bold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500">{item.phone}</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{item.address}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-semibold">
                <button
                  type="button"
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Address Button */}
        <button
          onClick={onAddNewAddress}
          className="w-full py-3 px-6 bg-[#BA181B] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium justify-center pt-1">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Delivery charges and availability are calculated based on your selected address.</span>
        </div>
      </div>

      {/* 3. FIXED BOTTOM NAVIGATION BAR (Never scrolls) */}
      <div className="shrink-0 bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shadow-md">
        <button onClick={() => onNavigateTab('home')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Home</span>
        </button>
        <button onClick={() => onNavigateTab('category')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Categories</span>
        </button>
        <button onClick={() => onNavigateTab('orders')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <ClipboardList className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Orders</span>
        </button>
        <button onClick={() => onNavigateTab('cart')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 relative cursor-pointer">
          <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA181B] text-white text-[9px] font-bold flex items-center justify-center border-1.5 border-white shadow-2xs">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-semibold text-slate-500">Cart</span>
        </button>
        <button onClick={() => onNavigateTab('profile')} className="flex flex-col items-center gap-0.5 text-[#BA181B] cursor-pointer">
          <User className="w-5 h-5 text-[#BA181B] stroke-[#BA181B] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#BA181B]">Profile</span>
          <div className="w-7 h-[2.5px] bg-[#BA181B] rounded-full absolute -bottom-1.5" />
        </button>
      </div>
    </div>
  );
};
