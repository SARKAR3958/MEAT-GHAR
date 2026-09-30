import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  ClipboardList,
  RotateCcw,
  Eye,
  Home,
  Grid,
  Share2,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { useCart } from '../../context/CartContext';
import { fetchUserOrders, Order } from '../../lib/orderService';

interface MyOrdersScreenProps {
  onBack: () => void;
  onSelectOrderDetails: (orderId: string, order?: Order) => void;
  onNavigateTab: (tab: string) => void;
  isOrderDelivered?: boolean;
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

  // 1. Instant cached orders for zero delay
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const cached = localStorage.getItem('meatghar_cached_orders_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const freshOrders = await fetchUserOrders();
      setOrders(freshOrders);
    } catch (err) {
      console.warn('Orders sync notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    // Poll active orders every 15 seconds
    const timer = setInterval(() => {
      loadOrders();
    }, 15000);
    return () => clearInterval(timer);
  }, [loadOrders]);

  const filteredOrders = orders.filter((o) => o.status === activeTab);

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
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="text-base font-black text-slate-900 leading-tight">My Orders</h2>
          </div>

          <HeaderMeatGharLogo />
        </div>

        {/* Status Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mt-2.5">
          {(['Active', 'Completed', 'Cancelled'] as const).map((tab) => {
            const count = orders.filter((o) => o.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#A8071A] shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>{tab}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-red-50 text-[#A8071A]' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SCROLLABLE ORDERS LIST */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-3 pb-28">
        {filteredOrders.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#A8071A] flex items-center justify-center mx-auto shadow-2xs">
              <Package className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900">
                No {activeTab} Orders Found
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {activeTab === 'Active'
                  ? 'You do not have any order currently in progress.'
                  : `You have no ${activeTab.toLowerCase()} orders in your account.`}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('home')}
              className="py-2.5 px-6 bg-[#A8071A] hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Fresh Cuts</span>
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isDelivered = order.status === 'Completed';
            const isCancelled = order.status === 'Cancelled';

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrderDetails(order.id, order)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-[#A8071A]/40 transition-all cursor-pointer space-y-3"
              >
                {/* Order Top Bar */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">{order.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        &bull; {order.date}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{order.time}</p>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      isDelivered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isCancelled
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                    }`}
                  >
                    {isDelivered && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {isCancelled && <XCircle className="w-3 h-3 text-slate-500" />}
                    {!isDelivered && !isCancelled && <Clock className="w-3 h-3 text-amber-600" />}
                    <span>{order.statusLabel}</span>
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#A8071A]" />
                        <span className="font-bold text-slate-800 line-clamp-1">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({item.qty})</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">{item.price}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-[10px] text-slate-400 font-medium pl-4">
                      + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Status Bar / SLA Note */}
                <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">{order.deliveredText}</span>
                  <span className="font-black text-slate-900 text-xs">{order.totalAmount}</span>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrderDetails(order.id, order);
                    }}
                    className="text-xs font-extrabold text-[#A8071A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. FIXED BOTTOM NAVIGATION BAR */}
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
          className="flex flex-col items-center gap-0.5 text-[#A8071A] relative cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 text-[#A8071A] stroke-[#A8071A] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#A8071A]">Orders</span>
          <div className="w-7 h-[2.5px] bg-[#A8071A] rounded-full absolute -bottom-1.5" />
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
