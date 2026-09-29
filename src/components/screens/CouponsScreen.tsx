import React, { useState } from 'react';
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

interface CouponsScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
  onApplyCoupon?: (code: string) => void;
}

interface Coupon {
  id: string;
  code: string;
  discountTag: string;
  title: string;
  description: string;
  minOrder: string;
  maxDiscount: string;
  validTill: string;
  appliesTo: string;
  isExpired: boolean;
  highlightText?: string;
}

const ACTIVE_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'MEATFRESH20',
    discountTag: '20% OFF',
    title: 'Flat 20% OFF on Fresh Meat',
    description: 'Get 20% instant discount on all Chicken, Mutton & Seafood items.',
    minOrder: '₹499',
    maxDiscount: '₹150',
    validTill: '15 Oct 2026',
    appliesTo: 'All Chicken, Mutton & Seafood',
    isExpired: false,
    highlightText: '🔥 Most Popular',
  },
  {
    id: 'c2',
    code: 'WELCOME100',
    discountTag: '₹100 OFF',
    title: 'Flat ₹100 Welcome Discount',
    description: 'Special welcome offer for your order. Savings applied instantly.',
    minOrder: '₹399',
    maxDiscount: '₹100',
    validTill: '31 Dec 2026',
    appliesTo: 'First Order on Meat Ghar',
    isExpired: false,
    highlightText: '🎉 New User Special',
  },
  {
    id: 'c3',
    code: 'FREEDEL',
    discountTag: 'FREE DELIVERY',
    title: 'Free Express Delivery',
    description: 'Zero delivery charges on all fresh meat orders above ₹299.',
    minOrder: '₹299',
    maxDiscount: '₹40 Delivery Fee Saved',
    validTill: '20 Nov 2026',
    appliesTo: 'All Orders',
    isExpired: false,
  },
  {
    id: 'c4',
    code: 'MUTTON50',
    discountTag: '₹50 OFF',
    title: '₹50 Extra OFF on Premium Mutton',
    description: 'Special savings on Mutton Boneless, Curry Cut & Chops.',
    minOrder: '₹599',
    maxDiscount: '₹50',
    validTill: '05 Nov 2026',
    appliesTo: 'All Premium Mutton Items',
    isExpired: false,
  },
];

const EXPIRED_COUPONS: Coupon[] = [
  {
    id: 'e1',
    code: 'MONSOON15',
    discountTag: '15% OFF',
    title: 'Monsoon Special Offer',
    description: 'Enjoy 15% discount on all hot curry cuts during monsoon.',
    minOrder: '₹450',
    maxDiscount: '₹100',
    validTill: 'Expired on 15 Aug 2026',
    appliesTo: 'Curry Cut & Boneless Items',
    isExpired: true,
  },
  {
    id: 'e2',
    code: 'EATFRESH',
    discountTag: '₹75 OFF',
    title: 'Weekend Barbecue Savings',
    description: 'Flat ₹75 discount on barbecue chicken and marinated cuts.',
    minOrder: '₹600',
    maxDiscount: '₹75',
    validTill: 'Expired on 31 Jul 2026',
    appliesTo: 'Barbecue & Marinated Cuts',
    isExpired: true,
  },
];

export const CouponsScreen: React.FC<CouponsScreenProps> = ({
  onBack,
  onNavigateTab,
  onApplyCoupon,
}) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Expired'>('Active');
  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedTermsId, setExpandedTermsId] = useState<string | null>(null);
  const [appliedCodeSuccess, setAppliedCodeSuccess] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleTerms = (id: string) => {
    setExpandedTermsId((prev) => (prev === id ? null : id));
  };

  const handleManualApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const cleanCode = inputCode.trim().toUpperCase();
    setAppliedCodeSuccess(cleanCode);
    if (onApplyCoupon) onApplyCoupon(cleanCode);
  };

  const handleApplyCouponCard = (code: string) => {
    setAppliedCodeSuccess(code);
    if (onApplyCoupon) onApplyCoupon(code);
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-20 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <Ticket className="w-5 h-5 text-[#BA181B]" /> Coupons & Offers
            </h2>
          </div>

          <HeaderMeatGharLogo />
        </div>

        <p className="text-xs text-slate-500 font-normal leading-relaxed mb-3">
          Apply promotional codes for extra savings on your fresh meat orders.
        </p>

        {/* Promo Code Input Bar */}
        <form
          onSubmit={handleManualApply}
          className="flex items-center gap-2 mb-3"
          autoComplete="off"
          noValidate
          data-form-type="other"
        >
          <div className="relative flex-1">
            <input
              type="text"
              name="coupon_code_no_autofill"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter Promo Code (e.g. MEATFRESH20)"
              className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 uppercase placeholder:text-slate-400 placeholder:normal-case focus:outline-none focus:border-[#BA181B] focus:bg-white transition-all"
            />
            <Ticket className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={!inputCode.trim()}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              inputCode.trim()
                ? 'bg-[#BA181B] text-white shadow-xs hover:bg-red-800'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Apply
          </button>
        </form>

        {/* Applied success banner */}
        {appliedCodeSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-emerald-900 text-xs mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Coupon <strong>&quot;{appliedCodeSuccess}&quot;</strong> applied successfully!
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('cart')}
              className="text-[10px] font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Go to Cart &rarr;
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('Active')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'Active'
                ? 'bg-[#BA181B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Coupons ({ACTIVE_COUPONS.length})
          </button>
          <button
            onClick={() => setActiveTab('Expired')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'Expired'
                ? 'bg-[#BA181B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expired ({EXPIRED_COUPONS.length})
          </button>
        </div>
      </div>

      {/* Coupons List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-16">
        {activeTab === 'Active' ? (
          ACTIVE_COUPONS.map((coupon) => {
            const isExpanded = expandedTermsId === coupon.id;
            const isCopied = copiedCode === coupon.code;

            return (
              <div
                key={coupon.id}
                className="bg-white rounded-2xl border border-red-200/90 shadow-2xs relative overflow-hidden transition-all"
              >
                {/* Side Ticket Cutout Circles */}
                <div className="w-4 h-4 rounded-full bg-slate-50 border-r border-red-200/90 absolute -left-2 top-1/2 -translate-y-1/2 z-10" />
                <div className="w-4 h-4 rounded-full bg-slate-50 border-l border-red-200/90 absolute -right-2 top-1/2 -translate-y-1/2 z-10" />

                {/* Top Badge Highlight */}
                {coupon.highlightText && (
                  <div className="bg-red-50 text-[#BA181B] px-3 py-1 text-[10px] font-extrabold border-b border-red-100 flex items-center justify-between">
                    <span>{coupon.highlightText}</span>
                    <span className="text-[9px] text-slate-500 font-mono">Valid till {coupon.validTill}</span>
                  </div>
                )}

                <div className="p-3.5 space-y-3">
                  {/* Coupon Title & Discount Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-red-100/80 border border-red-200 text-[#BA181B] flex flex-col items-center justify-center font-black shrink-0 text-center leading-none p-1">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="inline-block bg-[#BA181B] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full mb-1 uppercase tracking-wide">
                          {coupon.discountTag}
                        </span>
                        <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                          {coupon.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                          {coupon.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Box with Copy Code & Apply Buttons */}
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-wider text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-mono">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="text-[10px] font-bold text-slate-600 hover:text-[#BA181B] flex items-center gap-1 cursor-pointer transition-colors bg-white border border-slate-200 px-2 py-1 rounded-lg"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-extrabold">COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => handleApplyCouponCard(coupon.code)}
                      className="px-3 py-1 bg-[#BA181B] hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Apply Code
                    </button>
                  </div>

                  {/* Terms & Conditions Toggle Button */}
                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                    <button
                      onClick={() => toggleTerms(coupon.id)}
                      className="text-[11px] font-bold text-slate-500 hover:text-[#BA181B] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Terms & Conditions apply</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    <span className="text-[10px] text-slate-400 font-medium">
                      Min Order: <strong>{coupon.minOrder}</strong>
                    </span>
                  </div>

                  {/* Expanded Terms & Breakdown */}
                  {isExpanded && (
                    <div className="bg-red-50/50 border border-red-200/80 rounded-xl p-3 text-[11px] space-y-2 text-slate-700 animate-in fade-in duration-150">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#BA181B]">
                        <Info className="w-3.5 h-3.5" />
                        <span>Coupon Terms & Details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 font-medium block uppercase">Applies To</span>
                          <strong className="text-slate-800">{coupon.appliesTo}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 font-medium block uppercase">Min Order Value</span>
                          <strong className="text-slate-800">{coupon.minOrder}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 font-medium block uppercase">Max Discount</span>
                          <strong className="text-emerald-700 font-bold">{coupon.maxDiscount}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 font-medium block uppercase">Valid Till</span>
                          <strong className="text-slate-800">{coupon.validTill}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          /* EXPIRED COUPONS TAB (FULL GRAY DESIGN) */
          EXPIRED_COUPONS.map((coupon) => {
            const isExpanded = expandedTermsId === coupon.id;

            return (
              <div
                key={coupon.id}
                className="bg-slate-100/90 rounded-2xl border border-slate-300 shadow-2xs relative overflow-hidden grayscale opacity-75 transition-all"
              >
                {/* Side Ticket Cutout Circles */}
                <div className="w-4 h-4 rounded-full bg-slate-50 border-r border-slate-300 absolute -left-2 top-1/2 -translate-y-1/2 z-10" />
                <div className="w-4 h-4 rounded-full bg-slate-50 border-l border-slate-300 absolute -right-2 top-1/2 -translate-y-1/2 z-10" />

                <div className="p-3.5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-500 flex flex-col items-center justify-center font-black shrink-0 text-center leading-none p-1">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-slate-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            EXPIRED
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {coupon.validTill}
                          </span>
                        </div>
                        <h3 className="text-xs font-extrabold text-slate-700 leading-snug line-through">
                          {coupon.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                          {coupon.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Code & Expired label */}
                  <div className="bg-slate-200/80 border border-slate-300 rounded-xl p-2 flex items-center justify-between">
                    <span className="text-xs font-black tracking-wider text-slate-500 font-mono line-through">
                      {coupon.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Expired
                    </span>
                  </div>

                  {/* Terms & Conditions Toggle */}
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                    <button
                      onClick={() => toggleTerms(coupon.id)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Terms & Conditions apply</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>

                    <span className="text-[10px] text-slate-500 font-medium">
                      Min Order: {coupon.minOrder}
                    </span>
                  </div>

                  {/* Expanded Terms for Expired Coupon */}
                  {isExpanded && (
                    <div className="bg-slate-200/60 border border-slate-300 rounded-xl p-3 text-[11px] space-y-2 text-slate-600 animate-in fade-in duration-150">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Info className="w-3.5 h-3.5" />
                        <span>Expired Coupon Terms & Details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                        <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 font-medium block uppercase">Applies To</span>
                          <strong className="text-slate-700">{coupon.appliesTo}</strong>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 font-medium block uppercase">Min Order Value</span>
                          <strong className="text-slate-700">{coupon.minOrder}</strong>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 font-medium block uppercase">Max Discount</span>
                          <strong className="text-slate-700">{coupon.maxDiscount}</strong>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 font-medium block uppercase">Validity</span>
                          <strong className="text-slate-700">{coupon.validTill}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-20 shrink-0">
        <button
          onClick={() => onNavigateTab('home')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Home</span>
        </button>

        <button
          onClick={() => onNavigateTab('categories')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Categories</span>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Orders</span>
        </button>

        <button
          onClick={() => onNavigateTab('cart')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 relative cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA181B] text-white text-[9px] font-extrabold flex items-center justify-center border-1.5 border-white shadow-2xs">
            2
          </span>
          <span className="text-[10px] font-medium text-slate-500">Cart</span>
        </button>

        <button
          onClick={() => onNavigateTab('profile')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <User className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Profile</span>
        </button>
      </div>
    </div>
  );
};
