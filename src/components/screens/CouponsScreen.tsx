import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Ticket,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  ShoppingBag,
  Home,
  Grid,
  ClipboardList,
  ShoppingCart,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { fetchRealCoupons, RealCoupon, validateRealCoupon } from '../../lib/couponService';

interface CouponsScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
  onApplyCoupon?: (code: string) => void;
}

export const CouponsScreen: React.FC<CouponsScreenProps> = ({
  onBack,
  onNavigateTab,
  onApplyCoupon,
}) => {
  const [coupons, setCoupons] = useState<RealCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Active' | 'Expired'>('Active');
  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedTermsId, setExpandedTermsId] = useState<string | null>(null);
  const [appliedCodeSuccess, setAppliedCodeSuccess] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    fetchRealCoupons()
      .then((data) => {
        setCoupons(data);
      })
      .catch((err) => console.warn('Coupon fetch error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const activeCoupons = coupons.filter((c) => c.isActive && !c.isExpired);
  const expiredCoupons = coupons.filter((c) => !c.isActive || c.isExpired);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleManualApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setCouponError(null);
    const result = await validateRealCoupon(inputCode, 500);

    if (result.valid && result.coupon) {
      setAppliedCodeSuccess(result.coupon.code);
      if (onApplyCoupon) {
        onApplyCoupon(result.coupon.code);
      }
      setTimeout(() => {
        onNavigateTab('cart');
      }, 1200);
    } else {
      setCouponError(result.message);
    }
  };

  const handleCardApply = (coupon: RealCoupon) => {
    setAppliedCodeSuccess(coupon.code);
    setCouponError(null);
    if (onApplyCoupon) {
      onApplyCoupon(coupon.code);
    }
    setTimeout(() => {
      onNavigateTab('cart');
    }, 1000);
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. FIXED TOP HEADER */}
      <div className="shrink-0 bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h2 className="text-base font-bold text-slate-900 leading-tight">Coupons & Offers</h2>
          </div>

          <HeaderMeatGharLogo />
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Apply real verified discount promo codes on your fresh meat order.
        </p>
      </div>

      {/* 2. PROMO CODE INPUT & TABS */}
      <div className="shrink-0 bg-white px-4 pt-2.5 pb-3 border-b border-slate-200/90 space-y-2.5 shadow-2xs z-20">
        <form onSubmit={handleManualApply} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter Promo Code (e.g. MEAT100)"
              className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 uppercase placeholder:text-slate-400 focus:outline-none focus:border-[#A8071A] focus:bg-white transition-all"
            />
            <Ticket className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={!inputCode.trim()}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              inputCode.trim()
                ? 'bg-[#A8071A] text-white shadow-xs hover:bg-red-800'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Apply
          </button>
        </form>

        {/* Applied success banner */}
        {appliedCodeSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-emerald-900 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Coupon <strong>&quot;{appliedCodeSuccess}&quot;</strong> applied!
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('cart')}
              className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Go to Cart &rarr;
            </button>
          </div>
        )}

        {/* Error banner */}
        {couponError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-center gap-2 text-[#A8071A] text-xs">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{couponError}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('Active')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'Active'
                ? 'bg-white text-[#A8071A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Coupons ({activeCoupons.length})
          </button>
          <button
            onClick={() => setActiveTab('Expired')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'Expired'
                ? 'bg-white text-[#A8071A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expired ({expiredCoupons.length})
          </button>
        </div>
      </div>

      {/* 3. SCROLLABLE COUPONS LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-28">
        {activeTab === 'Active' ? (
          activeCoupons.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">No active coupons available right now.</p>
            </div>
          ) : (
            activeCoupons.map((coupon) => {
              const isExpanded = expandedTermsId === coupon.id;
              const isCopied = copiedCode === coupon.code;

              return (
                <div
                  key={coupon.id}
                  className="bg-white rounded-2xl border border-red-200/90 shadow-2xs relative overflow-hidden transition-all"
                >
                  {/* Side Ticket Cutouts */}
                  <div className="w-4 h-4 rounded-full bg-slate-50 border-r border-red-200/90 absolute -left-2 top-1/2 -translate-y-1/2 z-10" />
                  <div className="w-4 h-4 rounded-full bg-slate-50 border-l border-red-200/90 absolute -right-2 top-1/2 -translate-y-1/2 z-10" />

                  {coupon.highlightText && (
                    <div className="bg-red-50 text-[#A8071A] px-3 py-1 text-[10px] font-bold border-b border-red-100 flex items-center justify-between">
                      <span>{coupon.highlightText}</span>
                      <span className="text-[9px] text-slate-500 font-mono">Valid till {coupon.validTill}</span>
                    </div>
                  )}

                  <div className="p-3.5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-red-100/80 border border-red-200 text-[#A8071A] flex flex-col items-center justify-center font-bold shrink-0">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="inline-block bg-[#A8071A] text-white text-[9px] font-bold px-2 py-0.5 rounded-full mb-1 uppercase tracking-wide">
                            {coupon.discountTag}
                          </span>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug">
                            {coupon.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                            {coupon.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#A8071A] tracking-wider px-2 py-0.5 bg-red-50 rounded-lg border border-red-200">
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(coupon.code)}
                          className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        >
                          {isCopied ? (
                            <span className="text-emerald-600 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Copied
                            </span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCardApply(coupon)}
                        className="py-1.5 px-3 bg-[#A8071A] hover:bg-red-800 active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Min Order: ₹{coupon.minOrder}</span>
                      <button
                        type="button"
                        onClick={() => setExpandedTermsId(isExpanded ? null : coupon.id)}
                        className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Terms & Conditions</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="bg-slate-50 rounded-xl p-2.5 text-[10px] text-slate-600 space-y-1 border border-slate-200">
                        <p>&bull; Valid on minimum cart subtotal of ₹{coupon.minOrder}.</p>
                        <p>&bull; Applies to {coupon.appliesTo}.</p>
                        <p>&bull; Single use per customer account.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )
        ) : (
          expiredCoupons.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Clock className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">No expired coupons.</p>
            </div>
          ) : (
            expiredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-2xl border border-slate-200 p-3.5 opacity-60 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-600">{coupon.code}</span>
                    <h3 className="text-xs font-semibold text-slate-700 mt-0.5">{coupon.title}</h3>
                  </div>
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    Expired
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Expired on {coupon.validTill}</p>
              </div>
            ))
          )
        )}
      </div>

      {/* 4. FIXED BOTTOM NAVIGATION BAR */}
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
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5 text-slate-400 stroke-[1.8]" />
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
