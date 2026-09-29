import React, { useState } from 'react';
import {
  ShoppingBag,
  Users,
  CreditCard,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Package,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { AdminHeader } from '../components/AdminHeader';
import { AdminBottomNav } from '../components/AdminBottomNav';
import { SALES_CHART_DATA } from '../mockData';
import { AdminOrder } from '../types';

export const DashboardScreen: React.FC = () => {
  const { orders, users, products, navigateAdminScreen, setSelectedOrder } = useAdmin();
  const [chartTimeframe, setChartTimeframe] = useState<'7' | '30' | '90'>('7');

  // Computed metrics
  const totalOrdersCount = orders.length > 0 ? 240 + orders.length : 248;
  const totalUsersCount = users.length > 0 ? 1240 + users.length : 1248;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 125680);

  const handleOrderClick = (order: AdminOrder) => {
    setSelectedOrder(order);
    navigateAdminScreen('order_details');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Preparing':
        return 'bg-amber-50 text-amber-600 border border-amber-200/60';
      case 'On the Way':
        return 'bg-blue-50 text-blue-600 border border-blue-200/60';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200/60';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border border-rose-200/60';
      case 'Pending':
      default:
        return 'bg-rose-50 text-rose-600 border border-rose-200/60';
    }
  };

  return (
    <div className="w-full h-full bg-[#F8F9FA] text-slate-800 flex flex-col justify-between overflow-hidden font-sans select-none">
      {/* Top Header */}
      <AdminHeader title="Dashboard" showDrawer={true} showBell={true} />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* ========================================================================= */}
        {/* 1. TOP METRIC STAT CARDS (Orders, Users, Revenue) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Total Orders */}
          <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] text-slate-400 font-bold">...</span>
            </div>
            <div className="mt-2">
              <p className="text-[10px] text-slate-400 font-medium leading-none">Total Orders</p>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{totalOrdersCount}</h3>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
                <span>↑ 12%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Users */}
          <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] text-slate-400 font-bold">...</span>
            </div>
            <div className="mt-2">
              <p className="text-[10px] text-slate-400 font-medium leading-none">Total Users</p>
              <h3 className="text-sm font-bold text-slate-900 mt-1">1,248</h3>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
                <span>↑ 8%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Revenue */}
          <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] text-slate-400 font-bold">...</span>
            </div>
            <div className="mt-2">
              <p className="text-[10px] text-slate-400 font-medium leading-none">Total Revenue</p>
              <h3 className="text-xs font-bold text-slate-900 mt-1 truncate">Rs. {totalRevenue.toLocaleString()}</h3>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
                <span>↑ 15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SALES OVERVIEW CARD (Red Line Chart) */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Sales Overview</h2>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-300">
              <span>Last 7 Days</span>
              <span className="text-xs">▾</span>
            </div>
          </div>

          {/* Line Chart with Coordinates matching the uploaded image */}
          <div className="relative pt-2 pb-1">
            {/* Chart SVG with Red line & nodes */}
            <div className="h-32 w-full flex flex-col justify-between relative">
              {/* Y Axis Grid lines & labels */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-slate-400">
                <div className="border-b border-dashed border-slate-100 pb-0.5 flex justify-between">
                  <span>15K</span>
                </div>
                <div className="border-b border-dashed border-slate-100 pb-0.5 flex justify-between">
                  <span>10K</span>
                </div>
                <div className="border-b border-dashed border-slate-100 pb-0.5 flex justify-between">
                  <span>5K</span>
                </div>
                <div className="flex justify-between">
                  <span>0</span>
                </div>
              </div>

              {/* Red Line Chart Path */}
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E53935" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#E53935" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <path
                  d="M 20 70 Q 60 40 105 60 T 195 20 T 285 10 L 285 95 L 20 95 Z"
                  fill="url(#chartGrad)"
                />
                {/* Stroke curve */}
                <path
                  d="M 20 70 Q 60 40 105 60 T 195 20 T 285 10"
                  fill="none"
                  stroke="#E53935"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Data points */}
                <circle cx="20" cy="70" r="3" fill="#E53935" />
                <circle cx="65" cy="45" r="3" fill="#E53935" />
                <circle cx="110" cy="62" r="3" fill="#E53935" />
                <circle cx="155" cy="35" r="3" fill="#E53935" />
                <circle cx="200" cy="22" r="3" fill="#E53935" />
                <circle cx="245" cy="30" r="3" fill="#E53935" />
                <circle cx="285" cy="10" r="3.5" fill="#E53935" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>
            </div>

            {/* X Axis Labels */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-2 px-1">
              <span>22</span>
              <span>23</span>
              <span>24</span>
              <span>25</span>
              <span>26</span>
              <span>27</span>
              <span>28</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. RECENT ORDERS SECTION */}
        {/* ========================================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Orders</h2>
            <button
              onClick={() => navigateAdminScreen('orders')}
              className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {orders.slice(0, 4).map((order) => {
              const firstItem = order.items[0];
              return (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  className="bg-white p-3 rounded-2xl border border-slate-300 shadow-2xs flex items-center justify-between gap-3 active:scale-[0.99] transition-all cursor-pointer hover:border-slate-400"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={firstItem?.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80'}
                      alt={firstItem?.name || 'Dish'}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80';
                      }}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 tracking-tight">{order.orderNumber}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{firstItem?.name || 'Order Item'}</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">Rs. {order.total}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <AdminBottomNav />
    </div>
  );
};
