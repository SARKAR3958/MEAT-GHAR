import React, { useState, useEffect } from 'react';
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
  Send,
  CheckCircle2,
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
  const [activeCategoryModal, setActiveCategoryModal] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [myTickets, setMyTickets] = useState<any[]>([]);

  useEffect(() => {
    try {
      const savedTickets = localStorage.getItem('meatghar_admin_support_tickets');
      if (savedTickets) {
        setMyTickets(JSON.parse(savedTickets));
      }
    } catch {}
  }, []);

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

  const handleCategoryClick = (title: string) => {
    setActiveCategoryModal(title);
    setTicketSubject(`${title} Query`);
    setTicketMessage('');
    setSubmittedSuccess(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    try {
      const savedUserStr = localStorage.getItem('meatghar_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const customerName = savedUser?.userName || 'Rahul Sharma';
      const customerPhone = savedUser?.phone || '+91 98765 43210';
      const randomNum = Math.floor(1000 + Math.random() * 9000);

      const newTicket = {
        id: `sup_${Date.now()}`,
        ticketNumber: `#SUP${randomNum}`,
        customerName,
        customerPhone,
        customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        category: activeCategoryModal || 'General Support',
        orderNumber: '#ORD1024',
        subject: ticketSubject || 'Help Request',
        message: ticketMessage.trim(),
        status: 'Open',
        priority: 'High',
        createdAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timeAgo: 'Just now',
      };

      const existingStr = localStorage.getItem('meatghar_admin_support_tickets');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newTicket, ...existing];
      localStorage.setItem('meatghar_admin_support_tickets', JSON.stringify(updated));
      setMyTickets(updated);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setActiveCategoryModal(null);
        setSubmittedSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

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
          <HeaderMeatGharLogo />
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
          <p className="text-[10px] text-slate-400 font-medium mb-2.5">Tap a category to submit query directly to Admin support team.</p>

          <div className="grid grid-cols-2 gap-2.5">
            {supportCategories.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => handleCategoryClick(c.title)}
                  className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-start justify-between cursor-pointer hover:border-red-400 hover:shadow-xs transition-all active:scale-95"
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
          <p className="text-[10px] text-slate-400 font-medium mb-2">Instant assistance from Meat Ghar support center.</p>

          <div className="grid grid-cols-3 gap-2">
            <a
              href="tel:+919876543210"
              className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs text-center space-y-1 cursor-pointer block hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-xs">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-slate-900">Call Support</h4>
              <p className="text-[9px] text-slate-500 font-mono">+91 98765 43210</p>
              <span className="text-[8px] text-slate-400 block">8AM - 10PM</span>
            </a>

            <div
              onClick={() => handleCategoryClick('Live Chat Inquiry')}
              className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs text-center space-y-1 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-slate-900">Chat with Us</h4>
              <p className="text-[9px] text-slate-500">Live Admin Desk</p>
              <span className="text-[8px] text-emerald-600 font-bold block">Online</span>
            </div>

            <a
              href="mailto:support@meatghar.in"
              className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs text-center space-y-1 cursor-pointer block hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-xs">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-slate-900">Email Support</h4>
              <p className="text-[9px] text-slate-500 truncate">support@meatghar.in</p>
              <span className="text-[8px] text-slate-400 block">24/7 SLA</span>
            </a>
          </div>
        </div>

        {/* Live Support Tickets Sync */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-slate-900">My Support Tickets (Live)</h3>
            <span className="text-[11px] font-bold text-red-600">{myTickets.length} Total</span>
          </div>

          <div className="space-y-2">
            {myTickets.slice(0, 3).map((t: any) => (
              <div key={t.id} className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 font-mono block">{t.ticketNumber}</span>
                    <p className="text-xs font-bold text-slate-900 truncate">{t.subject || t.category}</p>
                    {t.adminReply && (
                      <p className="text-[10px] text-emerald-600 font-medium truncate mt-0.5">Admin: {t.adminReply}</p>
                    )}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : t.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Ticket Modal */}
      {activeCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activeCategoryModal}</h3>
                <p className="text-[10px] text-slate-400">Direct query dispatch to Admin Desk</p>
              </div>
              <button
                onClick={() => setActiveCategoryModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-slate-900">Request Sent to Admin!</h4>
                <p className="text-xs text-slate-500">Ticket created in Admin Support desk.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Subject</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Your Message / Query</label>
                  <textarea
                    rows={3}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Describe your issue or custom request in detail..."
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Admin Support</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around z-20">
        <button onClick={() => onNavigateTab('home')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button onClick={() => onNavigateTab('categories')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Categories</span>
        </button>
        <button onClick={() => onNavigateTab('orders')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Orders</span>
        </button>
        <button onClick={() => onNavigateTab('cart')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 relative cursor-pointer">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Cart</span>
        </button>
        <button onClick={() => onNavigateTab('profile')} className="flex flex-col items-center gap-0.5 text-[#A8071A] cursor-pointer">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
};
