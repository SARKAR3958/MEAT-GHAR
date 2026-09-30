import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Truck,
  Clock,
  Gift,
  Flame,
  Settings,
  Home,
  Grid,
  ClipboardList,
  ShoppingCart,
  User,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { useCart } from '../../context/CartContext';
import { markAllNotificationsAsRead } from '../../lib/notificationService';

interface NotificationsScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  const { cartCount } = useCart();
  const [unreadList, setUnreadList] = useState<string[]>([]);

  // Automatically mark all notifications as read immediately when user opens the screen
  useEffect(() => {
    markAllNotificationsAsRead();
    setUnreadList([]);
  }, []);

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. FIXED TOP HEADER (Never scrolls) */}
      <div className="shrink-0 bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#A8071A]" /> Notifications
            </h2>
          </div>

          <HeaderMeatGharLogo />
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Stay updated on your orders, offers and delivery status.
        </p>
      </div>

      {/* 2. SCROLLABLE MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar pb-28">
        {/* Today Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 mb-2">Today</h3>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {/* N1 */}
            <div className="p-3 flex items-start justify-between relative hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                    Order #MM10284 Confirmed
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Your order has been confirmed. Fresh halal cuts are being prepared for 70-min delivery. ⏱️
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block">10:28 AM</span>
                </div>
              </div>
            </div>

            {/* N2 */}
            <div className="p-3 flex items-start justify-between relative hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-[#A8071A] flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                    Rider Assigned for Delivery
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Delivery partner is on the way to Boko hub for your meat delivery. 🛵
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block">10:45 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yesterday Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 mb-2">Yesterday</h3>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {/* N3 */}
            <div className="p-3 flex items-start justify-between relative hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                    Referral Milestone: 250g Free Meat
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Invite 10 friends to register on Meat Ghar with your unique code and get a 250g meat pack free! 🥩
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block">Yesterday, 04:15 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FIXED BOTTOM NAVIGATION BAR */}
      <div className="bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shrink-0 shadow-md">
        <button
          onClick={() => onNavigateTab('home')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Home</span>
        </button>

        <button
          onClick={() => onNavigateTab('category')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Categories</span>
        </button>

        <button
          onClick={() => onNavigateTab('cart')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 relative cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A8071A] text-white text-[9px] font-bold flex items-center justify-center border-1.5 border-white shadow-2xs">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium text-slate-500">Cart</span>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Orders</span>
        </button>

        <button
          onClick={() => onNavigateTab('profile')}
          className="flex flex-col items-center gap-0.5 text-[#A8071A] relative cursor-pointer"
        >
          <User className="w-5 h-5 text-[#A8071A] stroke-[#A8071A] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#A8071A]">Profile</span>
          <div className="w-7 h-[2.5px] bg-[#A8071A] rounded-full absolute -bottom-1.5" />
        </button>
      </div>
    </div>
  );
};
