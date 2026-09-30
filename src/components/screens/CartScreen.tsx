import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Home as HomeIcon,
  Grid,
  ClipboardList,
  ShoppingCart,
  User,
  Share2,
  Ticket,
  X,
  ShoppingBag,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';
import { useCart } from '../../context/CartContext';
import { fetchRealCoupons, RealCoupon, validateRealCoupon } from '../../lib/couponService';

interface CartScreenProps {
  onBack: () => void;
  onProceedToCheckout: () => void;
  onNavigateTab: (tab: string) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  onProceedToCheckout,
  onNavigateTab,
}) => {
  const { cartItems, cartCount, subtotal, deliveryFee, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<RealCoupon[]>([]);

  useEffect(() => {
    fetchRealCoupons()
      .then((coupons) => {
        setAvailableCoupons(coupons.filter((c) => c.isActive && !c.isExpired));
      })
      .catch((err) => console.warn('Coupons fetch notice:', err));
  }, []);

  const handleApplyCoupon = async (code: string) => {
    if (!code.trim()) return;
    setCouponError(null);

    const result = await validateRealCoupon(code, subtotal);
    if (result.valid && result.coupon) {
      setCouponCode(result.coupon.code);
      setDiscountAmount(result.discountAmount);
      setCouponApplied(true);
      setShowCouponModal(false);
      setCouponError(null);
    } else {
      setCouponError(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setDiscountAmount(0);
    setCouponError(null);
  };

  const finalTotal = Math.max(0, subtotal - (couponApplied ? discountAmount : 0) + deliveryFee);

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. FIXED TOP HEADER */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">Your Cart</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {cartCount > 0 ? `${cartCount} items in basket` : 'Empty cart'}
            </p>
          </div>
        </div>

        {/* Meat Ghar Header Branding */}
        <HeaderMeatGharLogo />
      </div>

      {/* 2. SCROLLABLE MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-32">
        {cartItems.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs mt-4">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#A8071A] flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Your Cart is Empty</h3>
            <p className="text-xs text-slate-500 max-w-xs font-normal">
              Explore our wide variety of fresh chicken, mutton, fish, and ready-to-cook meat.
            </p>
            <button
              onClick={() => onNavigateTab('home')}
              className="mt-2 py-2.5 px-6 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              Browse Fresh Cuts
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-start gap-3">
                    <AppImage
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug break-words">
                        {item.name}
                      </h4>
                      
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[11px] text-slate-600 font-semibold">{item.weight || '500g'}</span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {item.cut || 'Curry Cut'}
                        </span>
                      </div>

                      {/* Custom Cut Instruction / Notes Box */}
                      {(item.notes || (item.cut && item.cut.toLowerCase().includes('custom'))) && (
                        <div className="mt-1.5 p-2 bg-amber-50/90 border border-amber-200 rounded-xl text-[10.5px] font-semibold text-amber-900 flex items-start gap-1.5 shadow-2xs">
                          <span className="shrink-0 text-amber-700">✂️</span>
                          <span className="leading-tight break-words">
                            {item.cut && item.cut.toLowerCase().includes('custom')
                              ? item.cut
                              : `Note: ${item.notes}`}
                          </span>
                        </div>
                      )}

                      <div className="text-xs font-black text-[#A8071A] mt-1.5">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Control & Delete Button below Title & Price */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-50">
                    <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeFromCart(item.id);
                          } else {
                            updateQuantity(item.id, -1);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-[#A8071A] text-white flex items-center justify-center hover:bg-red-800 active:scale-95 transition-all shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1.5 py-1 px-2.5 text-[#A8071A] hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#A8071A]" />
                      <span className="text-[11px] text-[#A8071A]">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Guarantee Banner (Moved above Apply Coupon as requested) */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 leading-tight">
                    70-Min Fresh Delivery Guarantee
                  </h4>
                  <p className="text-[10px] text-emerald-800 font-medium">
                    Order delivered fresh or full refund credited to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Apply Coupons Box */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#A8071A]" />
                  <span className="text-xs font-bold text-slate-900">Apply Coupon</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(true)}
                  className="text-xs font-bold text-[#A8071A] hover:underline cursor-pointer"
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
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo code (e.g. MEAT100)"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#A8071A]"
                    />
                    <button
                      onClick={() => handleApplyCoupon(couponCode)}
                      className="px-4 py-2 bg-[#A8071A] hover:bg-red-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] font-semibold text-[#A8071A] flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{couponError}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bill Details (Govt Taxes & Packaging line removed as requested) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2 text-xs text-slate-600">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                Bill Details
              </h3>
              <div className="flex justify-between">
                <span>Items Total</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee (70-Min Guarantee)</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-100">
                <span>To Pay</span>
                <span className="text-[#A8071A] text-base font-black">₹{finalTotal}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. DOCKED CHECKOUT BAR & BOTTOM NAVBAR */}
      <div className="shrink-0 z-30 bg-white border-t border-slate-200 shadow-2xl">
        {cartItems.length > 0 && (
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Total to pay
              </span>
              <span className="text-base font-black text-[#A8071A]">₹{finalTotal}</span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="py-2.5 px-5 bg-[#A8071A] hover:bg-red-800 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <div className="px-4 py-2 flex items-center justify-around z-30 bg-white border-t border-slate-200/90">
          <button
            onClick={() => onNavigateTab('home')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <HomeIcon className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium text-slate-500">Home</span>
          </button>

          <button
            onClick={() => onNavigateTab('category')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <Grid className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium text-slate-500">Categories</span>
          </button>

          {/* CART (Active) */}
          <button
            onClick={() => onNavigateTab('cart')}
            className="flex flex-col items-center gap-0.5 text-[#A8071A] relative cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-[#A8071A] stroke-[#A8071A] stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A8071A] text-white text-[9px] font-bold flex items-center justify-center border-1.5 border-white shadow-2xs">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-bold text-[#A8071A]">Cart</span>
            <div className="w-7 h-[2.5px] bg-[#A8071A] rounded-full absolute -bottom-1.5" />
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
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <Share2 className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium text-slate-500">Share</span>
          </button>
        </div>
      </div>

      {/* Coupon Selection Modal Popup */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-4 shadow-2xl border border-slate-200 space-y-3 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#A8071A]" />
                <h3 className="text-sm font-bold text-slate-900">Available Coupons & Offers</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 shrink-0 font-normal">
              Select a coupon below to apply instant savings to your order.
            </p>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 no-scrollbar">
              {availableCoupons.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No active coupons available for this cart.
                </div>
              ) : (
                availableCoupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="border border-red-200 bg-red-50/40 rounded-2xl p-3 flex items-center justify-between gap-2 hover:border-[#A8071A] transition-all"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#A8071A] text-white text-[9px] font-bold px-2 py-0.5 rounded-md font-mono">
                          {coupon.code}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {coupon.discountTag}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {coupon.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        {coupon.description} &bull; Min Order ₹{coupon.minOrder}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(coupon.code)}
                      className="px-3 py-1.5 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
