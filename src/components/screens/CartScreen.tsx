import React, { useState } from 'react';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Home as HomeIcon,
  LayoutGrid,
  ClipboardList,
  ShoppingCart,
  User,
  Share2,
  Ticket,
  X,
  ShoppingBag,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';
import { useCart } from '../../context/CartContext';

interface CartScreenProps {
  onBack: () => void;
  onProceedToCheckout: () => void;
  onNavigateTab: (tab: string) => void;
}

const AVAILABLE_CART_COUPONS = [
  {
    code: 'MEAT100',
    title: 'Flat ₹100 OFF on Orders above ₹699',
    discount: '₹100 OFF',
    desc: 'Valid on Fresh Chicken & Mutton cuts.',
    minOrder: '₹699',
    amount: 100,
  },
  {
    code: 'FRESH50',
    title: '₹50 OFF on First 3 Orders',
    discount: '₹50 OFF',
    desc: 'Instant discount on fresh meat delivery.',
    minOrder: '₹399',
    amount: 50,
  },
  {
    code: 'MUTTON50',
    title: '₹50 Extra OFF on Mutton',
    discount: '₹50 OFF',
    desc: 'Valid on Mutton Boneless & Curry Cuts.',
    minOrder: '₹599',
    amount: 50,
  },
];

export const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  onProceedToCheckout,
  onNavigateTab,
}) => {
  const { cartItems, cartCount, subtotal, deliveryFee, taxes, totalAmount, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const handleApplyCoupon = (code: string) => {
    const found = AVAILABLE_CART_COUPONS.find((c) => c.code === code);
    if (found) {
      setCouponCode(found.code);
      setDiscountAmount(found.amount);
      setCouponApplied(true);
      setShowCouponModal(false);
    } else if (code.trim()) {
      setCouponCode(code.toUpperCase());
      setDiscountAmount(50);
      setCouponApplied(true);
      setShowCouponModal(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setDiscountAmount(0);
  };

  const finalTotal = Math.max(0, subtotal - (couponApplied ? discountAmount : 0) + (subtotal > 0 ? 20 : 0) + deliveryFee + taxes);

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. FIXED TOP HEADER (Never scrolls) */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">Your Cart</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {cartCount > 0 ? `${cartCount} items in basket` : 'Empty cart'}
            </p>
          </div>
        </div>

        {/* Meat Ghar Header Branding */}
        <HeaderMeatGharLogo />
      </div>

      {/* 2. SCROLLABLE MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-6">
        {cartItems.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs mt-4">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#BA181B] flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-black text-slate-900">Your Cart is Empty</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Explore our wide variety of fresh chicken, mutton, fish, and ready-to-cook meat.
            </p>
            <button
              onClick={() => onNavigateTab('home')}
              className="mt-2 py-2.5 px-6 bg-[#BA181B] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              Browse Fresh Cuts
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs relative"
                >
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                      <AppImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                              {item.weight || '1 KG'}
                            </span>
                            {item.prep && (
                              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                                {item.prep}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-[#BA181B] p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-[#BA181B]">₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through ml-1">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Quantity modifier */}
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-[#BA181B] hover:text-red-800 cursor-pointer"
                          >
                            <Minus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                          <span className="text-xs font-bold text-[#BA181B]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-[#BA181B] hover:text-red-800 cursor-pointer"
                          >
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100 mt-2">
                    <span className="text-xs font-black text-[#BA181B]">
                      Subtotal: ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Apply Coupons Box */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#BA181B]" />
                  <span className="text-xs font-bold text-slate-900">Apply Coupon</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(true)}
                  className="text-xs font-extrabold text-[#BA181B] hover:underline cursor-pointer"
                >
                  View Offers
                </button>
              </div>

              {couponApplied ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800">
                      Code <span className="font-mono">{couponCode}</span> applied (-₹{discountAmount})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code (e.g. MEAT100)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#BA181B]"
                  />
                  <button
                    onClick={() => handleApplyCoupon(couponCode)}
                    className="px-4 py-2 bg-[#BA181B] hover:bg-red-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                Bill Details
              </h3>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Item Total</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>

              {couponApplied && (
                <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Packaging Fee</span>
                <span className="font-bold text-slate-900">₹20</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
                <span>Taxes & Charges</span>
                <span className="font-bold text-slate-900">₹{taxes}</span>
              </div>

              <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-1">
                <span>Grand Total</span>
                <span className="text-[#BA181B] text-base font-extrabold">₹{finalTotal}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <div className="pt-1">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-6 bg-[#BA181B] hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm rounded-xl shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                <span>Proceed to Checkout (₹{finalTotal})</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* 70-Minute Delivery Guarantee Box */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-emerald-950">
                  70-minute express delivery guarantee active
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </div>
          </>
        )}
      </div>

      {/* 3. FIXED BOTTOM NAVIGATION BAR (Never scrolls) */}
      <div className="shrink-0 bg-white border-t border-slate-200/90 z-30 shadow-lg">
        <div className="px-4 py-2 flex items-center justify-around">
          <button
            onClick={() => onNavigateTab('home')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <HomeIcon className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            <span className="text-[10px] font-semibold text-slate-500">Home</span>
          </button>

          <button
            onClick={() => onNavigateTab('category')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            <span className="text-[10px] font-semibold text-slate-500">Categories</span>
          </button>

          <button
            onClick={() => onNavigateTab('cart')}
            className="flex flex-col items-center gap-0.5 text-[#BA181B] relative cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-[#BA181B] stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#BA181B] text-white text-[9px] font-extrabold flex items-center justify-center border-1.5 border-white shadow-2xs">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-bold text-[#BA181B]">Cart</span>
            <div className="w-7 h-[2.5px] bg-[#BA181B] rounded-full absolute -bottom-1.5" />
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <ClipboardList className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            <span className="text-[10px] font-semibold text-slate-500">Orders</span>
          </button>

          <button
            onClick={() => onNavigateTab('share')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            <span className="text-[10px] font-semibold text-slate-500">Share</span>
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
                    onClick={() => handleApplyCoupon(coupon.code)}
                    className="px-3 py-1.5 bg-[#BA181B] hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
