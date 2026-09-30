import React, { useState, useEffect } from 'react';
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
  UserCheck,
  Sparkles,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';
import { fetchUserReferralData, ReferralProgressData } from '../../lib/referralService';

interface ShareScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
  userName?: string;
  userPhone?: string;
}

export const ShareScreen: React.FC<ShareScreenProps> = ({
  onBack,
  onNavigateTab,
  userName = 'Customer',
  userPhone = '',
}) => {
  const { cartCount } = useCart();
  const [referralData, setReferralData] = useState<ReferralProgressData>({
    referralCode: 'MEATGHAR100',
    referralCount: 0,
    targetCount: 10,
    progressPercent: 0,
    totalEarnedAmount: 0,
    referredFriends: [],
    canClaimReward: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserReferralData()
      .then((data) => {
        setReferralData(data);
      })
      .catch((err) => console.warn('Referral load notice:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const [copied, setCopied] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    phone: userPhone,
    address: '',
  });

  const handleShare = async () => {
    const text = `Hey! Use my referral code *${referralData.referralCode}* to order fresh 100% Halal meat on Meat Ghar in 70 mins. Sign up now!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meat Ghar - Fresh Meat Delivered',
          text,
          url: window.location.href,
        });
      } catch (error) {
        // user cancelled or failed
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* 1. FIXED TOP HEADER */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight">Refer & Earn</h1>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Rewards</span>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
        <div className="px-4 py-4 space-y-4">
          {/* Banner */}
          <div className="bg-gradient-to-br from-[#A8071A] to-[#780512] rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-1.5">
              <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Special Referral Offer
              </span>
              <h2 className="text-xl font-black">Get 250g Free Meat! 🥩</h2>
              <p className="text-xs font-medium text-white/90 leading-relaxed">
                Invite 10 friends to register on Meat Ghar with your code and get a 250g Chicken or Mutton pack completely free.
              </p>
            </div>
            <Gift className="absolute -right-4 -bottom-4 w-32 h-32 opacity-15 rotate-12 pointer-events-none" />
          </div>

          {/* Referral Code Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Your Unique Referral Code
            </span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border-2 border-dashed border-red-300 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                <span className="font-mono font-black text-base text-[#A8071A] tracking-wider">
                  {referralData.referralCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-slate-500 hover:text-[#A8071A] transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  {copied ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="py-3 px-4 bg-[#A8071A] hover:bg-red-800 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Real Referral Progress from Supabase */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#A8071A]" />
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">Registered Referrals</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Real-time status</p>
                </div>
              </div>
              <span className="text-xs font-black text-[#A8071A] bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                {referralData.referralCount} / {referralData.targetCount} Friends
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(5, referralData.progressPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 px-0.5">
                <span>0 Invited</span>
                <span>{referralData.targetCount} Goal</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 font-medium text-center bg-slate-50 py-2 px-3 rounded-xl border border-slate-100">
              {referralData.referralCount >= referralData.targetCount
                ? "🎉 Milestone Reached! You have unlocked your 250g Free Meat Reward!"
                : `Invite ${referralData.targetCount - referralData.referralCount} more friend${
                    referralData.targetCount - referralData.referralCount === 1 ? '' : 's'
                  } to claim your free reward pack.`}
            </p>

            {referralData.canClaimReward && !isSubmitted && (
              <button
                type="button"
                onClick={() => setShowClaimForm(true)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                <span>CLAIM YOUR FREE 250G MEAT NOW</span>
              </button>
            )}
          </div>

          {/* List of Real Registered Friends */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Friends who joined with your code</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {referralData.referredFriends.length} joined
              </span>
            </h3>

            {referralData.referredFriends.length === 0 ? (
              <div className="py-6 text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <UserCheck className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">No referrals yet</p>
                <p className="text-[11px] text-slate-400 max-w-[240px] mx-auto">
                  Share your code on WhatsApp with family & friends to start earning rewards!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {referralData.referredFriends.map((f, i) => (
                  <div
                    key={f.id || i}
                    className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-red-100 text-[#A8071A] font-extrabold text-xs flex items-center justify-center shrink-0">
                        {f.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{f.name}</p>
                        <p className="text-[10px] text-slate-400">Joined on {f.date}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      ✓ Registered
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim Form Modal */}
      {showClaimForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900">Claim 250g Free Meat</h3>
              <button
                type="button"
                onClick={() => setShowClaimForm(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete house/flat, street, Boko/Dhupdhara..."
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#A8071A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#A8071A] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Claim Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Claim Request Submitted!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              We have verified your referrals. Your free 250g meat pack will be delivered to your address!
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setShowClaimForm(false);
              onBack();
            }}
            className="py-3 px-6 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Back to Home
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
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A8071A] text-white text-[9px] font-extrabold flex items-center justify-center border-1.5 border-white shadow-2xs">
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
          className="flex flex-col items-center gap-0.5 text-[#A8071A] relative cursor-pointer"
        >
          <Share2 className="w-5 h-5 text-[#A8071A] stroke-[#A8071A] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#A8071A]">Share</span>
          <div className="w-7 h-[2.5px] bg-[#A8071A] rounded-full absolute -bottom-1.5" />
        </button>
      </div>
    </div>
  );
};
