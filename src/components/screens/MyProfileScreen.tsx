import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  MapPin,
  ShoppingCart,
  ClipboardList,
  Ticket,
  Bell,
  HelpCircle,
  FileText,
  Shield,
  Info,
  LogOut,
  ChevronRight,
  Edit2,
  Home,
  Grid,
  X,
  Share2,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { useCart } from '../../context/CartContext';
import { getUnreadNotificationCount } from '../../lib/notificationService';

interface MyProfileScreenProps {
  userName: string;
  userPhone: string;
  currentAddress?: string;
  onBack: () => void;
  onNavigateOption: (screen: string) => void;
  onLogout: () => void;
}

export const MyProfileScreen: React.FC<MyProfileScreenProps> = ({
  userName,
  userPhone,
  currentAddress = 'No delivery address added yet',
  onBack,
  onNavigateOption,
  onLogout,
}) => {
  const { cartCount } = useCart();
  const [activeModal, setActiveModal] = useState<'about' | 'privacy' | 'terms' | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(() => getUnreadNotificationCount());

  useEffect(() => {
    const updateCount = () => {
      setUnreadNotifications(getUnreadNotificationCount());
    };
    updateCount();
    window.addEventListener('meatghar_notifications_updated', updateCount);
    return () => window.removeEventListener('meatghar_notifications_updated', updateCount);
  }, []);

  const menuItems = [
    {
      id: 'profile_edit',
      icon: User,
      title: 'My Profile',
      subtitle: 'View and edit your personal details',
      badge: null,
    },
    {
      id: 'cart',
      icon: ShoppingCart,
      title: 'My Cart',
      subtitle: 'View items in your cart & proceed to checkout',
      badge: cartCount > 0 ? String(cartCount) : null,
    },
    {
      id: 'addresses',
      icon: MapPin,
      title: 'My Addresses',
      subtitle: 'Manage your delivery addresses',
      badge: null,
    },
    {
      id: 'orders',
      icon: ClipboardList,
      title: 'My Orders',
      subtitle: 'Track your orders and view history',
      badge: null,
    },
    {
      id: 'referral',
      icon: Share2,
      title: 'Refer & Earn',
      subtitle: 'Share your code & get free meat rewards',
      badge: null, // Free Meat tag removed as requested
    },
    {
      id: 'coupons',
      icon: Ticket,
      title: 'Coupons',
      subtitle: 'View and manage your available coupons',
      badge: null,
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Order updates, offers and more',
      badge: unreadNotifications > 0 ? String(unreadNotifications) : null,
    },
    {
      id: 'support',
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help or contact us',
      badge: null,
    },
    {
      id: 'terms',
      icon: FileText,
      title: 'Terms & Conditions',
      subtitle: 'Read our terms and conditions',
      badge: null,
    },
    {
      id: 'privacy',
      icon: Shield,
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      badge: null,
    },
    {
      id: 'about',
      icon: Info,
      title: 'About Meat Ghar',
      subtitle: 'Version 1.0.0',
      badge: null,
    },
  ];

  const handleItemClick = (id: string) => {
    if (id === 'about' || id === 'privacy' || id === 'terms') {
      setActiveModal(id);
    } else {
      onNavigateOption(id);
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h1 className="text-base font-bold text-slate-900">My Profile</h1>
          </div>

          <HeaderMeatGharLogo />
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Manage your account, orders and preferences.
        </p>
      </div>

      {/* 2. Main Scrollable Settings Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3 no-scrollbar pb-28">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A8071A] to-[#780512] text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0 mt-0.5">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 leading-snug truncate">
                {userName || 'Customer'}
              </h2>
              <button
                onClick={() => onNavigateOption('profile_edit')}
                className="text-xs font-semibold text-[#A8071A] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {userPhone ? (userPhone.startsWith('+') ? userPhone : `+91 ${userPhone}`) : 'No phone linked'}
            </p>
            <div className="pt-1.5 border-t border-slate-100 flex items-start gap-1 text-[11px] text-slate-500 font-normal leading-tight">
              <MapPin className="w-3.5 h-3.5 text-[#A8071A] shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                {currentAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {menuItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#A8071A] flex items-center justify-center shrink-0">
                    <ItemIcon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-normal">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="bg-[#A8071A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full py-3 bg-white border border-red-200 hover:bg-red-50 text-[#A8071A] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* 3. FIXED BOTTOM NAVIGATION BAR */}
      <div className="bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shrink-0 shadow-md">
        <button
          onClick={() => onNavigateOption('home')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Home</span>
        </button>

        <button
          onClick={() => onNavigateOption('categories')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Categories</span>
        </button>

        <button
          onClick={() => onNavigateOption('orders')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Orders</span>
        </button>

        <button
          onClick={() => onNavigateOption('cart')}
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
          onClick={() => onNavigateOption('profile')}
          className="flex flex-col items-center gap-0.5 text-[#A8071A] relative cursor-pointer"
        >
          <User className="w-5 h-5 text-[#A8071A] stroke-[#A8071A] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#A8071A]">Profile</span>
          <div className="w-7 h-[2.5px] bg-[#A8071A] rounded-full absolute -bottom-1.5" />
        </button>
      </div>

      {/* Original Rich Modals */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HeaderMeatGharLogo />
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="bg-red-50/60 p-3 rounded-2xl border border-red-100 text-[#A8071A] space-y-1">
                <h4 className="font-bold text-xs">About Meat Ghar (Version 1.0.0)</h4>
                <p className="text-[11px] font-medium leading-relaxed">
                  Meat Ghar is Assam&apos;s trusted fresh meat delivery platform serving Boko, Guwahati, and Dhupdhara with 100% Halal certified chicken, mutton, and seafood delivered in 70 minutes.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-900">Why Choose Meat Ghar?</h5>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#A8071A] font-bold">&bull;</span>
                    <span><strong>100% Halal Slaughter:</strong> Daily fresh cuts prepared following strict halal guidelines.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#A8071A] font-bold">&bull;</span>
                    <span><strong>70-Minute Express SLA:</strong> On-time delivery guarantee or instant refund policy.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#A8071A] font-bold">&bull;</span>
                    <span><strong>Zero Preservatives:</strong> Never frozen, chilled at optimal 0-4°C fresh temperatures.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                &copy; {new Date().getFullYear()} Meat Ghar Technologies. All rights reserved.
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#A8071A]" />
                <h3 className="text-sm font-bold text-slate-900">Privacy Policy</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p className="text-[11px] font-medium text-slate-700">
                At Meat Ghar, protecting your personal data and delivery information is our top priority.
              </p>

              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">1. Information We Collect</h5>
                  <p className="text-slate-600">
                    We collect your name, active mobile number, and delivery address exclusively for order processing, dispatch, and delivery verification.
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">2. Real-Time Rider Tracking</h5>
                  <p className="text-slate-600">
                    Your location is shared solely with the assigned delivery partner to fulfill your 70-minute SLA promise and never sold to 3rd parties.
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">3. Data Security</h5>
                  <p className="text-slate-600">
                    All authentication and order records are secured via end-to-end encrypted databases.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#A8071A]" />
                <h3 className="text-sm font-bold text-slate-900">Terms & Conditions</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">1. 70-Minute Delivery Guarantee</h5>
                  <p className="text-slate-600">
                    If an order fails to arrive within 70 minutes from confirmation time (excluding extreme weather or road blockages), you are entitled to a guarantee breach refund.
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">2. Fresh Cut Replacement</h5>
                  <p className="text-slate-600">
                    If you are unsatisfied with meat cut quality or packaging upon delivery, notify our support within 2 hours for a 100% free instant replacement.
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-900">3. Cancellation Policy</h5>
                  <p className="text-slate-600">
                    Orders can only be cancelled before butchering and packaging starts at our Boko dispatch center.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Accept & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
