import React, { useState } from 'react';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  ArrowRight,
  Home as HomeIcon,
  LayoutGrid,
  ClipboardList,
  ShoppingCart,
  User,
  Ticket,
  X,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';

interface CartScreenProps {
  onBack: () => void;
  onProceedToCheckout: () => void;
  onNavigateTab: (tab: string) => void;
}

const AVAILABLE_CART_COUPONS = [
  {
    code: 'MEATFRESH20',
    title: 'Flat 20% OFF on Fresh Meat',
    discount: '20% OFF',
    desc: 'Valid on all Chicken & Mutton cuts. Max ₹150 OFF.',
    minOrder: '₹499',
  },
  {
    code: 'WELCOME100',
    title: 'Flat ₹100 Welcome Discount',
    discount: '₹100 OFF',
    desc: 'Special welcome discount for new users.',
    minOrder: '₹399',
  },
  {
    code: 'FREEDEL',
    title: 'Free Express Delivery',
    discount: 'FREE DELIVERY',
    desc: 'Zero delivery charges on orders above ₹299.',
    minOrder: '₹299',
  },
  {
    code: 'MUTTON50',
    title: '₹50 Extra OFF on Mutton',
    discount: '₹50 OFF',
    desc: 'Valid on Mutton Boneless & Curry Cuts.',
    minOrder: '₹599',
  },
];

export const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  onProceedToCheckout,
  onNavigateTab,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [item1Qty, setItem1Qty] = useState(0);
  const [item2Qty, setItem2Qty] = useState(0);

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Top Header - Fixed */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h2 className="text-base font-black text-slate-900 leading-tight">Your Cart</h2>
        </div>

        {/* Meat Ghar Header Branding */}
        <HeaderMeatGharLogo onClick={() => onNavigateTab('home')} />
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-6">
        {/* Cart Item 1 */}
        {item1Qty > 0 && (
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs relative">
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                <img
                  src="/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg"
                  alt="Fresh Chicken Curry Cut"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 bg-[#BA181B] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-2xs">
                  10% OFF
                </span>
              </div>

              <div
                className="flex-1 flex flex-col justify-between py-0.5"
                style={{ width: '87.4667px', height: '64px' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      Fresh Chicken Curry Cut
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">Curry Cut</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">Cleaned</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setItem1Qty(0)}
                    className="text-slate-400 hover:text-[#BA181B] p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-[#BA181B]">₹420</span>
                    <span className="text-[10px] text-[#BA181B]/80 font-semibold">/ KG</span>
                    <span className="text-[10px] text-slate-400 line-through ml-1">₹465</span>
                  </div>

                  {/* Quantity modifier */}
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                    <button
                      onClick={() => setItem1Qty((q) => Math.max(0, q - 1))}
                      className="text-[#BA181B] hover:text-red-800 cursor-pointer"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="text-xs font-bold text-[#BA181B]">{item1Qty} KG</span>
                    <button
                      onClick={() => setItem1Qty((q) => q + 1)}
                      className="text-[#BA181B] hover:text-red-800 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 mt-2">
              <span className="text-xs font-black text-[#BA181B]">₹{420 * item1Qty}</span>
            </div>
          </div>
        )}

        {/* Cart Item 2 */}
        {item2Qty > 0 && (
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs relative">
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                <img
                  src="/src/assets/images/mutton_boneless_1790501365087.jpg"
                  alt="Mutton Boneless"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 bg-[#BA181B] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-2xs">
                  5% OFF
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      Mutton Boneless
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">Boneless</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">Cleaned</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setItem2Qty(0)}
                    className="text-slate-400 hover:text-[#BA181B] p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-[#BA181B]">₹680</span>
                    <span className="text-[10px] text-[#BA181B]/80 font-semibold">/ KG</span>
                    <span className="text-[10px] text-slate-400 line-through ml-1">₹720</span>
                  </div>

                  {/* Quantity modifier */}
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                    <button
                      onClick={() => setItem2Qty((q) => Math.max(0, q - 1))}
                      className="text-[#BA181B] hover:text-red-800 cursor-pointer"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="text-xs font-bold text-[#BA181B]">{item2Qty * 500} G</span>
                    <button
                      onClick={() => setItem2Qty((q) => q + 1)}
                      className="text-[#BA181B] hover:text-red-800 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 mt-2">
              <span className="text-xs font-black text-[#BA181B]">₹{340 * item2Qty}</span>
            </div>
          </div>
        )}

        {/* Empty Cart Message if all items removed */}
        {item1Qty === 0 && item2Qty === 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 text-center shadow-2xs">
            <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Your cart is empty</h3>
            <p className="text-xs text-slate-500 mt-1">Explore fresh cuts and add items to your cart.</p>
            <button
              onClick={() => onNavigateTab('categories')}
              className="mt-3 px-4 py-2 bg-[#BA181B] text-white text-xs font-bold rounded-xl shadow-2xs"
            >
              Browse Categories
            </button>
          </div>
        )}

        {/* Coupon Code Row */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 pl-2 flex-1">
              <Tag className="w-4 h-4 text-[#BA181B]" />
              <input
                type="text"
                name="cart_coupon_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none uppercase placeholder:normal-case placeholder-slate-400"
              />
            </div>

            <button
              onClick={() => setCouponApplied(true)}
              className="py-2 px-4 bg-[#BA181B] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              {couponApplied ? 'Applied ✓' : 'Apply'}
            </button>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Have a promo code or coupon?</span>
            <button
              type="button"
              onClick={() => setShowCouponModal(true)}
              className="font-extrabold text-[#BA181B] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Ticket className="w-3.5 h-3.5 text-[#BA181B]" />
              <span>View All Coupons &rarr;</span>
            </button>
          </div>
        </div>

        {/* Price Summary Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-2xs">
          <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Price Summary
          </h3>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">₹{420 * item1Qty + 340 * item2Qty}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold">
            <span>Discount</span>
            <span className="font-bold">-₹70</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Packaging Fee</span>
            <span className="font-bold text-slate-900">₹20</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Delivery Fee</span>
            <span className="font-bold text-slate-900">₹30</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
            <span>Tax</span>
            <span className="font-bold text-slate-900">₹64</span>
          </div>

          <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-1">
            <span>Grand Total</span>
            <span className="text-[#BA181B] text-base font-extrabold">
              ₹{Math.max(0, 420 * item1Qty + 340 * item2Qty - 70 + 20 + 30 + 64)}
            </span>
          </div>
        </div>

        {/* Proceed to Checkout Button (Non-sticky, placed above delivery guarantee) */}
        <div className="pt-1">
          <button
            onClick={onProceedToCheckout}
            className="w-full py-3.5 px-6 bg-[#BA181B] hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm rounded-xl shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 70-Minute Delivery Guarantee Box */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-emerald-950">
              70-minute delivery guarantee available
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <div className="shrink-0 bg-white border-t border-slate-200/90 z-30 shadow-lg">
        {/* Bottom Navigation */}
        <div className="px-4 py-2 flex items-center justify-around">
          <button
            onClick={() => onNavigateTab('home')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <HomeIcon className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            <span className="text-[10px] font-semibold text-slate-500">Home</span>
          </button>

          <button
            onClick={() => onNavigateTab('categories')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            <span className="text-[10px] font-semibold text-slate-500">Categories</span>
          </button>

          <button
            onClick={() => onNavigateTab('my_orders')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <ClipboardList className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            <span className="text-[10px] font-semibold text-slate-500">Orders</span>
          </button>

          <button
            onClick={() => onNavigateTab('cart')}
            className="flex flex-col items-center gap-0.5 text-[#BA181B] relative cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-[#BA181B] stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#BA181B] text-white text-[9px] font-extrabold flex items-center justify-center border-1.5 border-white shadow-2xs">
              {(item1Qty > 0 ? 1 : 0) + (item2Qty > 0 ? 1 : 0)}
            </span>
            <span className="text-[10px] font-bold text-[#BA181B]">Cart</span>
          </button>

          <button
            onClick={() => onNavigateTab('my_profile')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            <span className="text-[10px] font-semibold text-slate-500">Profile</span>
          </button>
        </div>
      </div>
      {/* Coupon Selection Modal Popup */}
      {showCouponModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-4 shadow-2xl border border-slate-200 space-y-3 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#BA181B]" />
                <h3 className="text-sm font-extrabold text-slate-900">Available Coupons & Offers</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 shrink-0 font-medium">
              Select a coupon below to apply instant savings to your order.
            </p>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 no-scrollbar">
              {AVAILABLE_CART_COUPONS.map((coupon) => (
                <div
                  key={coupon.code}
                  className="border border-red-200 bg-red-50/40 rounded-2xl p-3 flex items-center justify-between gap-2 hover:border-[#BA181B] transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#BA181B] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md font-mono">
                        {coupon.code}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {coupon.discount}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                      {coupon.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {coupon.desc} &bull; Min Order {coupon.minOrder}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode(coupon.code);
                      setCouponApplied(true);
                      setShowCouponModal(false);
                    }}
                    className="px-3 py-1.5 bg-[#BA181B] hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] shrink-0">
              <span className="text-slate-500">Want to see all offers?</span>
              <button
                type="button"
                onClick={() => {
                  setShowCouponModal(false);
                  onNavigateTab('coupons');
                }}
                className="font-extrabold text-[#BA181B] hover:underline"
              >
                Go to Offers Page &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
