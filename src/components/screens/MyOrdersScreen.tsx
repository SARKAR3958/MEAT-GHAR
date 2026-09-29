import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  ClipboardList,
  RotateCcw,
  Eye,
  Home,
  Grid,
  User,
  Share2,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';
import { useCart } from '../../context/CartContext';

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
  const { cartCount } = useCart();
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'Cancelled'>(
    isOrderDelivered ? 'Completed' : 'Active'
  );

  const [dynamicOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('meatghar_admin_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((o: any) => ({
            id: o.orderNumber || o.id,
            date: o.date || 'Today',
            time: o.time || '10:00 AM',
            status: o.status === 'Delivered' ? 'Completed' : o.status === 'Cancelled' ? 'Cancelled' : 'Active',
            statusLabel: o.status === 'On the Way' ? 'Out for Delivery' : o.status,
            totalAmount: `₹${o.total}`,
            deliveredText: o.status === 'Delivered'
              ? `Delivered on ${o.date || 'Today'}, ${o.time || '10:30 AM'}`
              : `Status: ${o.status} • 70-Min SLA Guaranteed`,
            items: o.items.map((it: any) => ({
              name: it.name,
              qty: `${it.quantity} ${it.unit || 'Unit'}`,
              prep: 'Full Cleaned',
              price: `₹${it.price * it.quantity}`,
              image: it.image || '/images/chicken_curry_cut_wide_1790508282856.jpg',
            })),
          }));
        }
      }
    } catch {}
    return [];
  });

  const orders: Order[] = dynamicOrders.length > 0 ? dynamicOrders : [
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
          image: '/images/chicken_curry_cut_wide_1790508282856.jpg',
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
          image: '/images/chicken_curry_cut_wide_1790508282856.jpg',
        },
        {
          name: 'Mutton Boneless',
          qty: '500 G',
          prep: 'Full Cleaned',
          price: '₹340',
          image: '/images/mutton_boneless_wide_1790508301717.jpg',
        },
      ],
    },
    {
      id: 'MM10245',
      date: '14 Aug 2025',
      time: '07:45 PM',
      status: 'Completed',
      statusLabel: 'Delivered',
      totalAmount: '₹760',
      deliveredText: 'Delivered on 14 Aug 2025, 08:35 PM',
      items: [
        {
          name: 'Fresh Rohu Fish Curry Cut',
          qty: '1 KG',
          prep: 'Full Cleaned',
          price: '₹360',
          image: '/images/rohu_fish_wide_1790508321588.jpg',
        },
      ],
    },
  ];

  const filteredOrders = orders.filter((o) => o.status === activeTab);

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. FIXED TOP HEADER (Never scrolls) */}
      <div className="shrink-0 bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-1 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="text-base font-black text-slate-900 leading-tight">My Orders</h2>
          </div>

          <HeaderMeatGharLogo />
        </div>

        <p className="text-xs text-slate-500 font-medium mb-3">
          Track your orders, view details and reorder your favourite meat.
        </p>

        {/* Tab Filters */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60">
          {(['Active', 'Completed', 'Cancelled'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
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

      {/* 2. SCROLLABLE ORDERS LIST ONLY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
        {filteredOrders.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 bg-white rounded-2xl p-6 border border-slate-200">
            <ClipboardList className="w-10 h-10 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No {activeTab} Orders</h3>
            <p className="text-xs text-slate-400">You don't have any {activeTab.toLowerCase()} orders right now.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-3 hover:border-red-200 transition-all"
            >
              {/* Card Header: Order ID & Date + Status Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-black text-slate-900">Order #{order.id}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {order.date} &bull; {order.time}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                    order.status === 'Active'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : order.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {order.statusLabel}
                </span>
              </div>

              {/* Items in Order */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <AppImage
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {item.qty} &bull; {item.prep}
                        </p>
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

              {/* Delivered Text */}
              {order.deliveredText && (
                <div
                  className={`rounded-xl px-3 py-2 text-center text-xs font-bold border ${
                    order.status === 'Completed'
                      ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50/90 text-amber-800 border-amber-200'
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

      {/* 3. FIXED BOTTOM NAVIGATION BAR (Never scrolls) */}
      <div className="shrink-0 bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shadow-md">
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
          className="flex flex-col items-center gap-0.5 text-[#BA181B] relative cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 text-[#BA181B] stroke-[#BA181B] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#BA181B]">Orders</span>
          <div className="w-7 h-[2.5px] bg-[#BA181B] rounded-full absolute -bottom-1.5" />
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
  );
};
