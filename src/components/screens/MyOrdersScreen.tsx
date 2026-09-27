import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  RotateCcw,
  Eye,
  Home,
  Grid,
  User,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { GreenTickLottie } from '../GreenTickLottie';

interface MyOrdersScreenProps {
  onBack: () => void;
  onSelectOrderDetails: (orderId: string) => void;
  onNavigateTab: (tab: string) => void;
  isOrderDelivered?: boolean;
}

interface OrderItem {
  name: string;
  qty: string;
  prep: string;
  price: string;
  image: string;
}

interface Order {
  id: string;
  date: string;
  time: string;
  status: 'Completed' | 'Active' | 'Cancelled';
  statusLabel: string;
  totalAmount: string;
  deliveredText?: string;
  items: OrderItem[];
}

export const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({
  onBack,
  onSelectOrderDetails,
  onNavigateTab,
  isOrderDelivered = false,
}) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'Cancelled'>(
    isOrderDelivered ? 'Completed' : 'Active'
  );

  const orders: Order[] = [
    {
      id: 'MM10312',
      date: 'Today',
      time: '09:15 AM',
      status: isOrderDelivered ? 'Completed' : 'Active',
      statusLabel: isOrderDelivered ? 'Delivered' : 'Out for Delivery',
      totalAmount: '₹420',
      deliveredText: isOrderDelivered
        ? 'Delivered Today at 09:50 AM'
        : 'Expected Delivery: Today by 10:25 AM',
      items: [
        {
          name: 'Fresh Chicken Curry Cut',
          qty: '1 KG',
          prep: 'Full Cleaned',
          price: '₹420',
          image: '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
        },
      ],
    },
    {
      id: 'MM10284',
      date: '29 Aug 2025',
      time: '10:28 AM',
      status: 'Completed',
      statusLabel: 'Delivered',
      totalAmount: '₹1,114',
      deliveredText: 'Delivered on 29 Aug 2025, 11:45 AM',
      items: [
        {
          name: 'Fresh Chicken Curry Cut',
          qty: '1 KG',
          prep: 'Full Cleaned',
          price: '₹420',
          image: '/src/assets/images/meat_onboarding_1_1790501345494.jpg',
        },
        {
          name: 'Mutton Boneless',
          qty: '500 G',
          prep: 'Full Cleaned',
          price: '₹340',
          image: '/src/assets/images/meat_onboarding_2_1790501365087.jpg',
        },
      ],
    },
    {
      id: 'MM10267',
      date: '24 Aug 2025',
      time: '6:15 PM',
      status: 'Completed',
      statusLabel: 'Delivered',
      totalAmount: '₹880',
      deliveredText: 'Delivered on 24 Aug 2025, 7:10 PM',
      items: [
        {
          name: 'Fresh Rohu Fish',
          qty: '1 KG',
          prep: 'Full Cleaned',
          price: '₹260',
          image: '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
        },
        {
          name: 'Mutton Curry Cut',
          qty: '1 KG',
          prep: 'Full Cleaned',
          price: '₹620',
          image: '/src/assets/images/meat_onboarding_2_1790501365087.jpg',
        },
      ],
    },
    {
      id: 'MM10190',
      date: '15 Aug 2025',
      time: '2:00 PM',
      status: 'Cancelled',
      statusLabel: 'Cancelled',
      totalAmount: '₹750',
      deliveredText: 'Cancelled on 15 Aug 2025 • Refund Processed',
      items: [
        {
          name: 'Mutton Chop',
          qty: '1 KG',
          prep: 'Full Cleaned',
          price: '₹750',
          image: '/src/assets/images/mutton_boneless_wide_1790508301717.jpg',
        },
      ],
    },
  ];

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Top Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-20 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="text-lg font-extrabold text-slate-900">My Orders</h2>
          </div>

          <HeaderMeatGharLogo onClick={() => onNavigateTab('home')} />
        </div>

        <p className="text-xs text-slate-500 font-normal leading-relaxed mb-3">
          Track your orders, view details and reorder your favourite meat.
        </p>

        {/* Filter Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
          {(['Active', 'Completed', 'Cancelled'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#BA181B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-16">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center my-6">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No {activeTab} Orders</h4>
            <p className="text-xs text-slate-400 mt-1">You don&apos;t have any orders in this section.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-3"
            >
              {/* Card Header (Order # & Status Pill, NO 70-min Guarantee tag) */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">Order #{order.id}</h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {order.date} &bull; {order.time}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {order.status === 'Completed' && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <GreenTickLottie className="w-3.5 h-3.5 shrink-0" loop={true} /> {order.statusLabel}
                    </span>
                  )}
                  {order.status === 'Active' && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" /> {order.statusLabel}
                    </span>
                  )}
                  {order.status === 'Cancelled' && (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-rose-600" /> {order.statusLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.qty} &bull; {item.prep}</p>
                      </div>
                      <span className="font-extrabold text-slate-900">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Total Amount
                </span>
                <span className="text-base font-black text-[#BA181B]">{order.totalAmount}</span>
              </div>

              {/* Delivered On / Status Text Box (Placed directly BELOW Total Amount) */}
              {order.deliveredText && (
                <div
                  className={`rounded-xl px-3 py-2 text-center text-xs font-bold border ${
                    order.status === 'Completed'
                      ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
                      : order.status === 'Active'
                      ? 'bg-amber-50/90 text-amber-800 border-amber-200'
                      : 'bg-rose-50/90 text-rose-800 border-rose-200'
                  }`}
                >
                  <span>{order.deliveredText}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onSelectOrderDetails(order.id)}
                  className="py-2 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => onNavigateTab('cart')}
                  className="py-2 px-3 bg-[#BA181B] hover:bg-red-800 active:bg-red-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Order Again</span>
                </button>
              </div>
            </div>
          ))
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
          className="flex flex-col items-center gap-0.5 text-[#BA181B] relative cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 text-[#BA181B] stroke-[#BA181B] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#BA181B]">Orders</span>
          <div className="w-7 h-[2.5px] bg-[#BA181B] rounded-full absolute -bottom-1.5" />
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
