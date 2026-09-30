import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  CreditCard,
  RotateCcw,
  HelpCircle,
  Package,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { GreenTickLottie } from '../GreenTickLottie';
import { Order } from '../../lib/orderService';

interface OrderDetailsScreenProps {
  onBack: () => void;
  onReorder: () => void;
  onGetHelp: () => void;
  order?: Order | null;
}

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  onBack,
  onReorder,
  onGetHelp,
  order,
}) => {
  const customerName = order?.customerName || 'Customer';
  const fullAddress =
    order?.deliveryAddress?.address ||
    `${order?.deliveryAddress?.houseFlat ? order.deliveryAddress.houseFlat + ', ' : ''}${
      order?.deliveryAddress?.street ? order.deliveryAddress.street + ', ' : ''
    }${order?.deliveryAddress?.locality ? order.deliveryAddress.locality + ', ' : ''}${
      order?.deliveryAddress?.landmark ? 'Near ' + order.deliveryAddress.landmark + ', ' : ''
    }${order?.deliveryAddress?.city || 'Guwahati, Assam'}`;

  const isCompleted = order?.status === 'Completed';
  const isCancelled = order?.status === 'Cancelled';
  const orderId = order?.orderNumber || '#MM10284';
  const date = order?.date || 'Today';
  const time = order?.time || '10:00 AM';

  const items = order?.items && order.items.length > 0 ? order.items : [
    {
      name: 'Fresh Chicken Curry Cut',
      qty: '1 KG',
      prep: 'Full Cleaned',
      price: '₹420',
      image: '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
    },
  ];

  const grandTotal = order?.totalAmount || '₹420';

  const steps = [
    { title: 'Placed', time: time, done: true },
    { title: 'Confirmed', time: '✓', done: true },
    { title: 'Preparing', time: '✓', done: isCompleted || order?.statusLabel !== 'Order Placed' },
    { title: 'Packed', time: '✓', done: isCompleted || order?.statusLabel === 'Quality Packed' || order?.statusLabel === 'Out for Delivery' },
    { title: 'Out for Delivery', time: '✓', done: isCompleted || order?.statusLabel === 'Out for Delivery' },
    { title: 'Delivered', time: isCompleted ? '✓' : 'Pending', done: isCompleted },
  ];

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="text-base font-black text-slate-900 leading-tight">Order Details</h2>
          </div>

          <HeaderMeatGharLogo />
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Real-time delivery journey and order summary.
        </p>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 no-scrollbar pb-28">
        {/* Order Header Badge */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Order ID
              </span>
              <p className="text-xs font-black text-slate-900">{orderId}</p>
              <p className="text-[10px] text-slate-400 font-medium">
                {date} &bull; {time}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : isCancelled
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isCompleted ? (
                <>
                  <GreenTickLottie className="w-3.5 h-3.5 shrink-0" loop={true} /> Delivered
                </>
              ) : isCancelled ? (
                'Cancelled'
              ) : (
                'In Progress'
              )}
            </span>
          </div>

          {/* Delivery confirmation info */}
          <div
            className={`border rounded-xl p-3 flex items-center justify-between ${
              isCompleted
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isCompleted ? (
                <GreenTickLottie className="w-8 h-8 shrink-0" loop={true} />
              ) : (
                <Clock className="w-6 h-6 text-amber-600" />
              )}
              <div>
                <span className="text-[10px] font-bold block uppercase">
                  {isCompleted ? 'Delivery Confirmed' : 'Live Order Journey'}
                </span>
                <span className="text-xs font-extrabold">
                  {order?.deliveredText || 'Guaranteed 70-Minute Halal Delivery'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Journey Timeline */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold text-slate-900">Order Journey</h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {isCompleted ? 'Delivered ✓' : 'Live Tracking'}
            </span>
          </div>

          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1 text-center">
            {steps.map((s) => (
              <div key={s.title} className="flex flex-col items-center min-w-[50px] shrink-0">
                <div
                  className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center mb-1 ${
                    s.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {s.done ? '✓' : '•'}
                </div>
                <span className="text-[8px] font-bold text-slate-800 leading-tight">{s.title}</span>
                <span className="text-[7px] text-slate-400 font-mono mt-0.5">{s.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold text-slate-900">Order Items</h3>
            <span className="text-[11px] font-bold text-slate-400">{items.length} Items</span>
          </div>

          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <img
                  src={item.image || '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg'}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.qty} &bull; {item.prep || 'Full Cleaned'}
                    </p>
                  </div>
                  <span className="font-extrabold text-slate-900">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-1.5 text-xs text-slate-600">
          <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-2">
            Price Breakdown
          </h3>
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span className="font-bold text-slate-900">₹{order?.subtotal || order?.totalAmount || 0}</span>
          </div>
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Discount</span>
            <span>₹{order?.discount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-bold text-slate-900">
              {order?.deliveryFee ? `₹${order.deliveryFee}` : 'FREE'}
            </span>
          </div>
          <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-100">
            <span>Grand Total</span>
            <span className="text-[#A8071A] text-base">{grandTotal}</span>
          </div>
        </div>

        {/* Address & Payment Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">Delivery Address</span>
            <p className="text-xs font-bold text-slate-900 line-clamp-1">{customerName}</p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-3">
              {fullAddress}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">Payment Method</span>
            <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> {order?.paymentMethod || 'COD'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Status: {order?.paymentStatus || 'Confirmed'}</p>
          </div>
        </div>

        {/* Delivery Partner */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img
                src="/src/assets/images/delivery_partner_avatar_1790502025354.jpg"
                alt="Partner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Boko Delivery Partner</p>
              <p className="text-[10px] text-slate-400">Meat Ghar Express Rider</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => (window.location.href = 'tel:+919876543210')}
              className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Phone className="w-3 h-3" /> Call
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="shrink-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl flex items-center gap-2">
        <button
          onClick={onReorder}
          className="flex-1 py-3 px-4 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reorder</span>
        </button>

        <button
          onClick={onGetHelp}
          className="flex-1 py-3 px-4 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Get Help</span>
        </button>
      </div>
    </div>
  );
};
