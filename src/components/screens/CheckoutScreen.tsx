import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Wallet,
  Building,
  DollarSign,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { GreenTickLottie } from '../GreenTickLottie';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';

interface CheckoutScreenProps {
  onBack: () => void;
  onPlaceOrder: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  onBack,
  onPlaceOrder,
}) => {
  const { totalAmount, subtotal, deliveryFee, cartItems, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'>('upi');
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const displayTotal = totalAmount > 0 ? totalAmount : 420;

  const handlePlaceOrderClick = () => {
    setIsSuccessModal(true);

    // Generate Order ID & assemble data
    const orderId = `MTG-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const savedUserStr = localStorage.getItem('meatghar_user');
      const userObj = savedUserStr ? JSON.parse(savedUserStr) : {};
      const savedAddrStr = localStorage.getItem('meatghar_selected_location');
      const addrObj = savedAddrStr ? JSON.parse(savedAddrStr) : null;

      const orderPayload = {
        id: orderId,
        customer_name: userObj.userName || 'Rahul Sharma',
        customer_phone: userObj.phone || '9876543210',
        customer_email: userObj.email || 'customer@meatghar.in',
        delivery_address: addrObj || {
          address: 'House No. 24, Green Park Road, Sector 10, Noida, UP - 201301',
          city: 'Noida',
        },
        items:
          cartItems.length > 0
            ? cartItems.map((item) => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                unit: item.weight || '500g',
                image: item.image,
              }))
            : [
                {
                  productId: 'prod-1',
                  name: 'Premium Chicken Curry Cut',
                  price: 189,
                  quantity: 2,
                  unit: '500g',
                },
              ],
        total_amount: displayTotal,
        subtotal: subtotal || displayTotal,
        delivery_fee: deliveryFee || 0,
        discount: 0,
        payment_method: selectedPayment.toUpperCase(),
        payment_status: selectedPayment === 'cod' ? 'Pending' : 'Paid',
        status: 'Preparing',
      };

      // 1. Sync to Supabase orders table
      supabase
        .from('orders')
        .insert(orderPayload)
        .then(({ error }) => {
          if (error) console.warn('Supabase order creation note:', error.message);
        });

      // 2. Also save to admin orders local storage for immediate visibility
      const existing = localStorage.getItem('meatghar_admin_orders_v3');
      const parsedOrders = existing ? JSON.parse(existing) : [];
      const adminOrderObj = {
        id: orderId,
        orderNumber: `#${orderId}`,
        customerName: orderPayload.customer_name,
        customerPhone: orderPayload.customer_phone,
        customerAddress: orderPayload.delivery_address.address || 'Sector 10, Noida',
        items: orderPayload.items,
        subtotal: orderPayload.subtotal,
        deliveryFee: orderPayload.delivery_fee,
        discount: 0,
        total: orderPayload.total_amount,
        paymentMethod: orderPayload.payment_method,
        paymentStatus: orderPayload.payment_status,
        status: 'Preparing' as const,
        orderTime: 'Just now',
        estimatedDeliveryTime: '30-45 mins',
      };
      localStorage.setItem('meatghar_admin_orders_v3', JSON.stringify([adminOrderObj, ...parsedOrders]));
    } catch (err) {
      console.warn('Order sync note:', err);
    }

    setTimeout(() => {
      clearCart();
      onPlaceOrder();
    }, 1800);
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Header */}
      <div className="shrink-0 bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-extrabold text-slate-900">Checkout</h2>
        </div>

        <HeaderMeatGharLogo />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-6">
        {/* Delivery Address Summary */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#A8071A] fill-[#A8071A]" />
              <span className="text-xs font-extrabold text-slate-900">Delivery Address</span>
            </div>
            <button onClick={onBack} className="text-xs font-bold text-[#A8071A]">
              Change &gt;
            </button>
          </div>

          <div>
            <span className="text-[10px] bg-red-50 text-[#A8071A] px-2 py-0.5 rounded-md font-bold">Home</span>
            <p className="text-xs font-bold text-slate-900 mt-1">Rahul Sharma</p>
            <p className="text-xs text-slate-600 font-medium leading-snug">
              House No. 24, Green Park Road, Sector 10, Noida, Uttar Pradesh - 201301
            </p>
          </div>
        </div>

        {/* Delivery Guarantee Banner */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Est. Delivery Time</span>
            </div>
            <p className="text-sm font-black text-emerald-900 mt-1">35 - 55 minutes</p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>70-MIN GUARANTEE</span>
            </div>
            <p className="text-[10px] font-medium text-emerald-800 leading-tight mt-1">
              Delivered within 70 mins or order is FREE.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold text-slate-900">Order Summary</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">Fresh Chicken Curry Cut</p>
                <p className="text-[10px] text-slate-500">1 KG &bull; Curry Cut &bull; Cleaned</p>
              </div>
              <span className="font-black text-slate-900">₹420</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">Mutton Boneless</p>
                <p className="text-[10px] text-slate-500">500 G &bull; Boneless &bull; Cleaned</p>
              </div>
              <span className="font-black text-slate-900">₹340</span>
            </div>
          </div>

          {/* Charges */}
          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Discount</span><span>-₹70</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Packaging Fee</span><span>₹20</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span><span>₹30</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (5%)</span><span>₹64</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-100">
              <span>Grand Total</span>
              <span className="text-[#A8071A] text-base">₹1,114</span>
            </div>
          </div>
        </div>

        {/* Payment Methods - 2 Options Per Row */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold text-slate-900">Select Payment Method</h3>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Secure</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Row 1: UPI */}
            <button
              type="button"
              onClick={() => setSelectedPayment('upi')}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                selectedPayment === 'upi'
                  ? 'border-[#A8071A] bg-red-50/60 text-[#A8071A] ring-2 ring-red-500/20 shadow-2xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-red-100 text-[#A8071A] font-black flex items-center justify-center text-xs shrink-0">
                UPI
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold leading-tight">UPI / GPay</h4>
                <p className="text-[9px] text-slate-500 font-medium">Instant Payment</p>
              </div>
            </button>

            {/* Row 1: Wallet */}
            <button
              type="button"
              onClick={() => setSelectedPayment('wallet')}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                selectedPayment === 'wallet'
                  ? 'border-[#A8071A] bg-red-50/60 text-[#A8071A] ring-2 ring-red-500/20 shadow-2xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold leading-tight">Wallet Balance</h4>
                <p className="text-[9px] text-slate-500 font-medium">MeatGhar Wallet</p>
              </div>
            </button>

            {/* Row 2: Cash On Delivery (Full Width) */}
            <button
              type="button"
              onClick={() => setSelectedPayment('cod')}
              className={`col-span-2 p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                selectedPayment === 'cod'
                  ? 'border-[#A8071A] bg-red-50/60 text-[#A8071A] ring-2 ring-red-500/20 shadow-2xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold leading-tight">Cash on Delivery (COD)</h4>
                <p className="text-[9px] text-slate-500 font-medium">Pay cash / UPI at your doorstep</p>
              </div>
            </button>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-0.5 text-center">
            <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Encrypted & Safe
            </span>
            <span className="font-mono text-slate-500 font-extrabold text-[10px] tracking-wider">
              UPI | WALLET | COD
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Place Order Button (Never scrolls) */}
      <div className="shrink-0 bg-white border-t border-slate-200 p-3 z-30 shadow-lg">
        <button
          onClick={handlePlaceOrderClick}
          className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>Pay &amp; Place Order (₹{displayTotal}) &rarr;</span>
        </button>
      </div>

      {/* Order Placed Success Modal with Green Tick Lottie */}
      {isSuccessModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 text-center shadow-2xl max-w-xs w-full space-y-3 border border-slate-100 animate-scale-up">
            <GreenTickLottie className="w-24 h-24 mx-auto" loop={true} />
            <h3 className="text-lg font-black text-slate-900">
              Order Placed Successfully!
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Your order <span className="font-bold text-slate-800">#MM10284</span> is confirmed. Directing to Live 70-Min Tracker...
            </p>
            <div className="w-full bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>70-Minute Express Guarantee Activated</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
