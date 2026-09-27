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
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { useCart } from '../../context/CartContext';

interface NotificationsScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  const { cartCount } = useCart();
  const [unreadList, setUnreadList] = useState<string[]>(['n1', 'n2', 'n3', 'n5']);

  // Automatically mark all notifications as read when user opens the screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setUnreadList([]);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

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
            <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              <Bell className="w-5 h-5 text-[#BA181B]" /> Notifications
            </h2>
          </div>

          <HeaderMeatGharLogo onClick={() => onNavigateTab('home')} />
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Stay updated on your orders, offers and more.
        </p>
      </div>

      {/* 2. SCROLLABLE MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar pb-6">
        {/* Today Section */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-900 mb-2">Today</h3>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {/* N1 */}
            <div className="p-3 flex items-start justify-between relative hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Order #MM10284 Confirmed
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Your order has been confirmed. It will be ready in 70 minutes. ⏱️
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block">10:28 AM</span>
                </div>
              </div>

              {unreadList.includes('n1') && (
                <span className="w-2 h-2 rounded-full bg-[#A8071A] shrink-0 mt-1 ml-1" />
              )}
            </div>

            {/* N2 */}
            <div className="p-3 flex items-start justify-between relative hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Order Out for Delivery
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Your order #MM10267 is out for delivery. Our rider is on the way!
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block">6:15 PM</span>
                </div>
              </div>

              {unreadList.includes('n2') && (
                <span className="w-2 h-2 rounded-full bg-[#A8071A] shrink-0 mt-1 ml-1" />
              )}
            </div>

            {/* N3 */}
            <div className="p-3 flex items-start justify-between relative hover:bg-slate-50 bg-red-50/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    10-Minute Guarantee
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Your order #MM10295 is delayed. Don't worry! You'll get ₹20 cashback if we are late.
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block">5:42 PM</span>
                </div>
              </div>

              {unreadList.includes('n3') && (
                <span className="w-2 h-2 rounded-full bg-[#A8071A] shrink-0 mt-1 ml-1" />
              )}
            </div>

            {/* N4 */}
            <div className="p-3 flex items-start justify-between relative hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Order Delivered
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Your order #MM10284 has been delivered. Enjoy your fresh meat!
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block">2:17 PM</span>
                </div>
              </div>
            </div>

            {/* N5 */}
            <div className="p-3 flex items-start justify-between relative hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Special Offer for You
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Get fresh Chicken & Mutton at special prices! Up to 25% OFF - Limited Time Only.
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block">11:20 AM</span>
                </div>
              </div>

              {unreadList.includes('n5') && (
                <span className="w-2 h-2 rounded-full bg-[#A8071A] shrink-0 mt-1 ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Earlier Section */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-900 mb-2">Earlier</h3>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-3 flex items-start gap-3 hover:bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  Fresh Chicken & Mutton Offer
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Fresh, juicy and hygienic meat at best prices. Order now!
                </p>
                <span className="text-[9px] text-slate-400 font-mono mt-1 block">28 Aug, 2025</span>
              </div>
            </div>

            {/* Notification settings option */}
            <div className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Notification Settings</h4>
                  <p className="text-[10px] text-slate-400">Manage your notification preferences.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. FIXED BOTTOM NAVIGATION BAR (Never scrolls) */}
      <div className="shrink-0 bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shadow-md">
        <button onClick={() => onNavigateTab('home')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Home</span>
        </button>

        <button onClick={() => onNavigateTab('category')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Categories</span>
        </button>

        <button onClick={() => onNavigateTab('orders')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <ClipboardList className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Orders</span>
        </button>

        <button onClick={() => onNavigateTab('cart')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 relative cursor-pointer">
          <ShoppingCart className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA181B] text-white text-[9px] font-extrabold flex items-center justify-center border-1.5 border-white shadow-2xs">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium text-slate-500">Cart</span>
        </button>

        <button onClick={() => onNavigateTab('profile')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <User className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Profile</span>
        </button>
      </div>
    </div>
  );
};
