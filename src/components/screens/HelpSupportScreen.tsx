import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  Package,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw,
  Clock,
  HelpCircle,
  Phone,
  MessageSquare,
  Mail,
  Ticket,
  ChevronRight,
  Home,
  Grid,
  ShoppingBag,
  User,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';

interface HelpSupportScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  const [searchHelp, setSearchHelp] = useState('');

  const supportCategories = [
    {
      id: 'cat_order',
      title: 'Order Issue',
      desc: 'Track, cancel or modify your order.',
      icon: Package,
      color: 'bg-red-50 text-red-600',
    },
    {
      id: 'cat_payment',
      title: 'Payment Issue',
      desc: 'Failed payment, refund or wallet issues.',
      icon: CreditCard,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'cat_delivery',
      title: 'Delivery Issue',
      desc: 'Late delivery, wrong item or delivery details.',
      icon: Truck,
      color: 'bg-red-50 text-red-600',
    },
    {
      id: 'cat_product',
      title: 'Product Issue',
      desc: 'Quality, quantity or product related issues.',
      icon: ShieldCheck,
      color: 'bg-red-50 text-red-600',
    },
    {
      id: 'cat_refund',
      title: 'Refund Issue',
      desc: 'Refund status or money back.',
      icon: RotateCcw,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'cat_70min',
      title: '70-Minute Guarantee',
      desc: 'Know about our 70-minute delivery promise.',
      icon: Clock,
      color: 'bg-red-50 text-red-600',
    },
    {
      id: 'cat_other',
      title: 'Other',
      desc: 'Any other help or query.',
      icon: HelpCircle,
      color: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <HeaderMeatGharLogo onClick={() => onNavigateTab('home')} />
          <button className="text-xs font-bold text-[#A8071A]">Support</button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-red-100 text-[#A8071A] flex items-center justify-center font-bold text-sm">
            🎧
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-none">Help & Support</h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">How can we help you today?</p>
          </div>
        </div>

        {/* Search help bar */}
        <div className="mt-3 relative">
          <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              name="help_search_no_autofill"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
              value={searchHelp}
              onChange={(e) => setSearchHelp(e.target.value)}
              placeholder="Search for help"
              className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
            />
            {searchHelp && (
              <button onClick={() => setSearchHelp('')} className="p-0.5 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Support Options Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar pb-16">
        {/* Support Categories */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-900 mb-0.5">Support Categories</h3>
          <p className="text-[10px] text-slate-400 font-medium mb-2.5">Select a category to get quick help.</p>

          <div className="grid grid-cols-2 gap-2.5">
            {supportCategories.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-start justify-between cursor-pointer hover:border-red-200 transition-all"
                >
                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-xl ${c.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{c.title}</h4>
                    <p className="text-[9px] text-slate-400 font-medium leading-tight">{c.desc}</p>
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-red-500 shrink-0 mt-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Us Options */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-900 mb-0.5">Contact Us</h3>
          <p className="text-[10px] text-slate-400 font-medium mb-2">Still need help? Get in touch with our support team.</p>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs text-center space-y-1 cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-xs">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-slate-900">Call Support</h4>
              <p className="text-[9px] text-slate-500 font-mono">+91 98765 43210</p>
              <span className="text-[8px] text-slate-400 block">Mon-Sun | 8AM - 10PM</span>
            </div>

            <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs text-center space-y-1 cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-slate-900">Chat with Us</h4>
              <p className="text-[9px] text-slate-500">Get instant help from team</p>
            </div>

            <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs text-center space-y-1 cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-xs">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-slate-900">Email Support</h4>
              <p className="text-[9px] text-slate-500 truncate">support@meatghar.in</p>
            </div>
          </div>
        </div>

        {/* My Support Tickets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-slate-900">My Support Tickets</h3>
            <span className="text-[11px] font-bold text-emerald-700">View All &gt;</span>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 font-mono block">#TKT10284</span>
                <p className="text-xs font-bold text-slate-900">Order not delivered yet</p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">29 Aug 2025 &bull; 6:20 PM</p>
              </div>
            </div>

            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> In Progress
            </span>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900">Frequently Asked Questions</h3>
            <span className="text-[11px] font-bold text-[#A8071A]">View FAQ &gt;</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Order tracking', 'Payment issues', 'Delivery time', 'Refund process'].map((f) => (
              <span key={f} className="px-2.5 py-1 bg-red-50 text-[#A8071A] rounded-lg text-[10px] font-bold cursor-pointer hover:bg-red-100">
                {f}
              </span>
            ))}
          </div>
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
