import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Copy,
  Users,
  Gift,
  CheckCircle2,
  Send,
  Home,
  Grid,
  ClipboardList,
  ShoppingCart,
  Check,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';
import { getUserReferralCode } from '../../utils/referral';

interface ShareScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
  userName?: string;
  userPhone?: string;
}

export const ShareScreen: React.FC<ShareScreenProps> = ({
  onBack,
  onNavigateTab,
  userName = 'Rahul Sharma',
  userPhone = '98765 43210',
}) => {
  const { cartCount } = useCart();
  const referralCode = getUserReferralCode(userName, userPhone);
  const [referralCount] = useState(7); // Mock current referrals
  const targetCount = 10;
  const progress = (referralCount / targetCount) * 100;

  const [copied, setCopied] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meat Ghar - Fresh Meat Delivered',
          text: `Hey! Use my referral code ${referralCode} to get 250g free meat on Meat Ghar. Download now!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      handleCopy();
      alert('Referral link copied to clipboard!');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* 1. FIXED TOP HEADER */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30 shrink-0 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700 stroke-[2.5]" />
        </button>
        <h1 className="text-base font-black text-slate-900 tracking-tight">Refer & Earn</h1>
      </div>

      {/* 2. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-4 py-5">
          {/* Banner */}
          <div className="bg-gradient-to-br from-[#BA181B] to-[#A11417] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden mb-6">
            <div className="relative z-10">
              <h2 className="text-xl font-black mb-1">Get 250g Free Meat! 🥩</h2>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                Invite 10 friends to join Meat Ghar and get a 250g Chicken/Mutton pack absolutely free!
              </p>
            </div>
            <Gift className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 rotate-12" />
          </div>

          {/* Referral Progress */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#BA181B]" />
                <span className="text-sm font-extrabold text-slate-900">Your Referrals</span>
              </div>
              <span className="text-sm font-black text-[#BA181B] bg-red-50 px-3 py-1 rounded-full border border-red-100">
                {referralCount} / {targetCount}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium text-center">
              {referralCount >= targetCount
                ? "🎉 Goal reached! You're eligible for free meat!"
                : `Add ${targetCount - referralCount} more users to unlock your reward.`}
            </p>

            {referralCount >= targetCount && !isSubmitted && (
              <button
                onClick={() => setShowClaimForm(true)}
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                CLAIM YOUR FREE 250 GRAM MEAT
              </button>
            )}
          </div>

          {/* Referral Code Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 text-center">
              Your Referral Code
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl py-3 px-4 flex items-center justify-center font-black text-lg text-slate-900 tracking-widest uppercase">
                {referralCode}
              </div>
              <button
                onClick={handleCopy}
                className="w-12 h-12 bg-[#BA181B] text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <button 
              onClick={handleShare}
              className="w-full mt-4 py-3 border-2 border-[#BA181B] text-[#BA181B] font-black text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              SHARE WITH FRIENDS
            </button>
          </div>

          {/* How it works */}
          <div className="px-1 mb-8">
            <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-tight">How it works</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">1</div>
                <p className="text-xs text-slate-600 leading-snug">Share your code or referral link with friends and family.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">2</div>
                <p className="text-xs text-slate-600 leading-snug">They must use your code to login or register in the app.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">3</div>
                <p className="text-xs text-slate-600 leading-snug font-bold text-slate-800">Once 10 friends join, you unlock the claim form for 250g Free Meat!</p>
              </div>
            </div>
          </div>

          {/* Referred Users List */}
          <div className="px-1 pb-10">
            <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-tight">Registered Referrals ({referralCount})</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
              {[
                { name: 'Amit Kumar', date: '24 Sep 2026', phone: '******4321' },
                { name: 'Suresh Raina', date: '22 Sep 2026', phone: '******9876' },
                { name: 'Priya Sharma', date: '18 Sep 2026', phone: '******1234' },
                { name: 'Vikram Singh', date: '15 Sep 2026', phone: '******5566' },
                { name: 'Anjali Gupta', date: '10 Sep 2026', phone: '******0099' },
                { name: 'Rohan Mehra', date: '05 Sep 2026', phone: '******8877' },
                { name: 'Kavita Jha', date: '01 Sep 2026', phone: '******2211' },
              ].map((user, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold uppercase">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-slate-400">{user.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Joined</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">{user.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CLAIM FORM MODAL */}
      {showClaimForm && !isSubmitted && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900">Claim Your Reward! 🍗</h3>
              <button
                onClick={() => setShowClaimForm(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 ml-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  placeholder="Enter your registered mobile"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-[#BA181B] transition-colors"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5 ml-1">Complete Delivery Address</label>
                <textarea
                  required
                  rows={3}
                  placeholder="House No, Area, Landmark, City..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-[#BA181B] transition-colors resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <button
                disabled={isSubmitting}
                className="w-full py-4 bg-[#BA181B] text-white font-black text-sm rounded-xl shadow-lg shadow-red-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    SUBMIT CLAIM REQUEST
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 font-medium text-center leading-relaxed">
                Reward delivery takes 24-48 hours after verification. Our team will contact you if needed.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* 4. SUCCESS MESSAGE AFTER CLAIM */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Request Submitted!</h3>
          <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
            Congratulations! Your request for 250g Free Meat has been received. We will verify your referrals and deliver the reward to your address soon.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setShowClaimForm(false);
              onBack();
            }}
            className="w-full py-4 bg-slate-900 text-white font-black text-sm rounded-xl active:scale-95 transition-all"
          >
            BACK TO HOME
          </button>
        </div>
      )}

      {/* 5. BOTTOM NAVIGATION BAR */}
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
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA181B] text-white text-[9px] font-extrabold flex items-center justify-center border-1.5 border-white shadow-2xs">
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
          onClick={() => onNavigateTab('share')}
          className="flex flex-col items-center gap-0.5 text-[#BA181B] relative cursor-pointer"
        >
          <Share2 className="w-5 h-5 text-[#BA181B] stroke-[#BA181B] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#BA181B]">Share</span>
          <div className="w-7 h-[2.5px] bg-[#BA181B] rounded-full absolute -bottom-1.5" />
        </button>
      </div>
    </div>
  );
};
