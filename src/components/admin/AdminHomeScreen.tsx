import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Package,
  Bike,
  Users,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Play,
  Volume2,
  VolumeX,
  Store,
  Phone,
  MapPin,
  Flame,
  Check,
  X,
  ExternalLink,
  Sliders,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  Bell,
  Eye
} from 'lucide-react';
import { HeaderMeatGharLogo, MeatGharLogo } from '../MeatGharLogo';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  distance: string;
  items: { name: string; quantity: string; price: number }[];
  totalAmount: number;
  paymentMethod: 'UPI' | 'COD' | 'Card';
  status: 'New' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  orderedAt: string;
  minutesRemaining: number;
  assignedRider?: { name: string; phone: string; bikeNumber: string };
  specialNote?: string;
}

interface AdminHomeScreenProps {
  onBackToApp?: () => void;
  onLogout?: () => void;
}

export const AdminHomeScreen: React.FC<AdminHomeScreenProps> = ({
  onBackToApp,
  onLogout,
}) => {
  // Store status state
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedHub, setSelectedHub] = useState('Sector 10, Noida Hub');
  const [timeFilter, setTimeFilter] = useState<'today' | 'yesterday' | 'week'>('today');
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'preparing' | 'delivery' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<AdminOrder | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Mock live orders data
  const [orders, setOrders] = useState<AdminOrder[]>([
    {
      id: 'ord-101',
      orderNumber: 'MG-9482',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98765 43210',
      address: 'Flat 402, Royal Palms, Sector 62, Noida',
      distance: '2.4 km',
      items: [
        { name: 'Fresh Chicken Curry Cut', quantity: '1 kg', price: 420 },
        { name: 'Fresh Mutton Boneless', quantity: '500 gm', price: 340 },
      ],
      totalAmount: 760,
      paymentMethod: 'UPI',
      status: 'New',
      orderedAt: '10:48 AM',
      minutesRemaining: 58,
      specialNote: 'Please make medium curry pieces, clean skinless cut.',
    },
    {
      id: 'ord-102',
      orderNumber: 'MG-9481',
      customerName: 'Priya Verma',
      customerPhone: '+91 98111 22334',
      address: 'House #45, Block C, Sector 18, Noida',
      distance: '1.8 km',
      items: [
        { name: 'Fresh Rohu Fish Curry Cut', quantity: '1 kg', price: 360 },
        { name: 'Farm Fresh Eggs (Pack of 12)', quantity: '1 pack', price: 110 },
      ],
      totalAmount: 470,
      paymentMethod: 'UPI',
      status: 'Preparing',
      orderedAt: '10:35 AM',
      minutesRemaining: 45,
      assignedRider: { name: 'Vikas Kumar', phone: '+91 97110 44556', bikeNumber: 'UP 16 AZ 4421' },
      specialNote: 'Bengali cut round pieces with head cleaned.',
    },
    {
      id: 'ord-103',
      orderNumber: 'MG-9480',
      customerName: 'Amit Saxena',
      customerPhone: '+91 99220 88990',
      address: 'Tower 4, Floor 12, Express Greens, Sector 137',
      distance: '4.8 km',
      items: [
        { name: 'Premium Goat Mutton Biryani Cut', quantity: '1.5 kg', price: 1020 },
        { name: 'Fresh Chicken Breast Boneless', quantity: '500 gm', price: 230 },
      ],
      totalAmount: 1250,
      paymentMethod: 'COD',
      status: 'Out for Delivery',
      orderedAt: '10:15 AM',
      minutesRemaining: 25,
      assignedRider: { name: 'Mohit Rawat', phone: '+91 96541 33221', bikeNumber: 'UP 16 BY 9012' },
    },
    {
      id: 'ord-104',
      orderNumber: 'MG-9479',
      customerName: 'Ananya Gupta',
      customerPhone: '+91 95400 11223',
      address: 'Villa 12, Jaypee Greens, Greater Noida',
      distance: '6.2 km',
      items: [
        { name: 'Ready to Cook Mutton Seekh Kebab', quantity: '2 packs', price: 580 },
        { name: 'Fresh Chicken Drumsticks (Tangdi)', quantity: '6 pcs', price: 290 },
      ],
      totalAmount: 870,
      paymentMethod: 'UPI',
      status: 'Out for Delivery',
      orderedAt: '10:05 AM',
      minutesRemaining: 15,
      assignedRider: { name: 'Deepak Singh', phone: '+91 98991 77665', bikeNumber: 'UP 16 CD 1188' },
    },
    {
      id: 'ord-105',
      orderNumber: 'MG-9478',
      customerName: 'Dr. Sunil Mehta',
      customerPhone: '+91 98100 66554',
      address: 'B-102, ATS Village, Sector 93A, Noida',
      distance: '3.5 km',
      items: [
        { name: 'Fresh Chicken Curry Cut', quantity: '2 kg', price: 840 },
      ],
      totalAmount: 840,
      paymentMethod: 'Card',
      status: 'Delivered',
      orderedAt: '09:40 AM',
      minutesRemaining: 0,
      assignedRider: { name: 'Vikas Kumar', phone: '+91 97110 44556', bikeNumber: 'UP 16 AZ 4421' },
    },
    {
      id: 'ord-106',
      orderNumber: 'MG-9477',
      customerName: 'Kavita Joshi',
      customerPhone: '+91 97180 55443',
      address: 'Pocket 3, Mayur Vihar Phase 1',
      distance: '5.1 km',
      items: [
        { name: 'Fresh Mutton Chops / Chaap', quantity: '1 kg', price: 740 },
      ],
      totalAmount: 740,
      paymentMethod: 'UPI',
      status: 'Delivered',
      orderedAt: '09:20 AM',
      minutesRemaining: 0,
      assignedRider: { name: 'Ravi Shankar', phone: '+91 99112 33445', bikeNumber: 'DL 08 AT 9980' },
    },
  ]);

  // Inventory snapshot
  const inventoryCuts = [
    { name: 'Fresh Chicken Curry Cut', available: '28 kg', total: '80 kg', percent: 35, isLow: false },
    { name: 'Fresh Mutton Boneless', available: '8.5 kg', total: '40 kg', percent: 21, isLow: true },
    { name: 'Fresh Rohu Fish Cut', available: '14 kg', total: '35 kg', percent: 40, isLow: false },
    { name: 'Chicken Breast Boneless', available: '4.2 kg', total: '30 kg', percent: 14, isLow: true },
  ];

  // Riders active
  const riders = [
    { name: 'Mohit Rawat', status: 'On Delivery', order: '#MG-9480', battery: '92%' },
    { name: 'Deepak Singh', status: 'On Delivery', order: '#MG-9479', battery: '84%' },
    { name: 'Vikas Kumar', status: 'At Hub (Ready)', order: 'Available', battery: '96%' },
    { name: 'Ravi Shankar', status: 'At Hub (Ready)', order: 'Available', battery: '78%' },
  ];

  // Calculations
  const totalOrdersToday = orders.length + 138; // 144
  const totalDeliveredToday = orders.filter(o => o.status === 'Delivered').length + 104; // 106
  const totalRemainingActive = orders.filter(o => ['New', 'Preparing', 'Out for Delivery'].includes(o.status)).length; // 4 live in list
  const totalCancelledToday = 2;
  const todayRevenue = 68450;
  const onTimePercentage = '98.4%';

  // Update order status handler
  const handleUpdateStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Order status updated to: ${newStatus}`);
  };

  // Simulate new order
  const handleSimulateNewOrder = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrd: AdminOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `MG-${randomNum}`,
      customerName: 'Sunita Mehra (Live)',
      customerPhone: '+91 98711 00992',
      address: 'A-204, Prateek Edifice, Sector 107, Noida',
      distance: '3.1 km',
      items: [
        { name: 'Fresh Chicken Curry Cut', quantity: '1 kg', price: 420 },
        { name: 'Ready to Cook Chicken Tikka', quantity: '1 pack', price: 290 },
      ],
      totalAmount: 710,
      paymentMethod: 'UPI',
      status: 'New',
      orderedAt: 'Just Now',
      minutesRemaining: 70,
      specialNote: 'Express delivery required for lunch gathering.',
    };

    setOrders(prev => [newOrd, ...prev]);
    showToast(`🔥 New Live Order Received: #MG-${randomNum}`);
  };

  // Filtered orders
  const filteredOrders = orders.filter(ord => {
    if (activeTab === 'new' && ord.status !== 'New') return false;
    if (activeTab === 'preparing' && ord.status !== 'Preparing') return false;
    if (activeTab === 'delivery' && ord.status !== 'Out for Delivery') return false;
    if (activeTab === 'delivered' && ord.status !== 'Delivered') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.customerPhone.includes(q) ||
        ord.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full h-full bg-[#FBFBFB] text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1E293B] text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER - MATCHING USER APP THEME (White + Meat Ghar Red Branding) */}
      {/* ========================================================================= */}
      <header className="shrink-0 bg-white z-30 pt-3 pb-2 px-3 sm:px-4 border-b border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Meat Ghar Brand Logo + Admin Badge */}
          <div className="flex items-center gap-2">
            <HeaderMeatGharLogo />
            <span className="bg-[#BA181B] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
              Admin Hub
            </span>
          </div>

          {/* Center: Hub Selector & Store Status */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
              <Store className="w-3.5 h-3.5 text-[#BA181B]" />
              <span>{selectedHub}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            <button
              onClick={() => {
                setIsStoreOpen(!isStoreOpen);
                showToast(isStoreOpen ? 'Store marked CLOSED' : 'Store marked OPEN');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isStoreOpen
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-red-50 text-red-700 border border-red-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span>{isStoreOpen ? 'STORE OPEN' : 'STORE CLOSED'}</span>
            </button>
          </div>

          {/* Right: Quick Controls & Back to App */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? 'Sound alert muted' : 'Sound alert turned ON');
              }}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Toggle Sound Alerts"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#BA181B]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Simulate Order Test */}
            <button
              onClick={handleSimulateNewOrder}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#BA181B] hover:bg-[#A01417] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Simulate incoming order"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Simulate Order</span>
            </button>

            {/* Switch to User App */}
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                title="Switch to customer mobile app"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xs:inline">User App</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Hub Strip */}
        <div className="flex md:hidden items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-[#BA181B]" />
            <span>Sector 10, Noida Hub</span>
          </div>

          <button
            onClick={() => {
              setIsStoreOpen(!isStoreOpen);
              showToast(isStoreOpen ? 'Store marked CLOSED' : 'Store marked OPEN');
            }}
            className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
              isStoreOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isStoreOpen ? 'bg-emerald-600' : 'bg-red-600'}`} />
            <span>{isStoreOpen ? 'OPEN' : 'CLOSED'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN SCROLLABLE DASHBOARD VIEW */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-4 no-scrollbar">
        {/* Welcome & Live Date Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-red-50 via-white to-orange-50/40 p-3.5 rounded-2xl border border-red-100 shadow-2xs">
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Operations & Live Orders Dashboard</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● Live 70-Min SLA
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time butcher dispatch, meat cuts inventory, and fleet status
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                timeFilter === 'today'
                  ? 'bg-[#BA181B] text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('yesterday')}
              className={`px-3 py-1 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                timeFilter === 'yesterday'
                  ? 'bg-[#BA181B] text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => {
                showToast('Refreshing latest orders...');
              }}
              className="p-1.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KPI CARDS (TOTAL ORDERS TODAY, DONE, REMAINING, REVENUE) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* CARD 1: Total Orders Today */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#BA181B] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {totalOrdersToday}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span>+14.2% vs yesterday</span>
              </div>
            </div>
          </div>

          {/* CARD 2: Total Done / Delivered */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Total Delivered
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {totalDeliveredToday}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600">
                <span>{onTimePercentage} In 70-Min SLA</span>
              </div>
            </div>
          </div>

          {/* CARD 3: Total Remaining / Active */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Active Pending
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#BA181B] tracking-tight">
                {totalRemainingActive}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-slate-500">
                <span>Dispatch in progress</span>
              </div>
            </div>
          </div>

          {/* CARD 4: Today Revenue */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Today's Sales
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-100 text-[#BA181B] flex items-center justify-center">
                <span className="text-sm font-black">₹</span>
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ₹{todayRevenue.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-slate-500">
                <span>Avg Order: ₹482</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECONDARY ROW: LIVE INVENTORY & RIDER FLEET QUICK WIDGETS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Butchery Stock Alert Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#BA181B] flex items-center justify-center">
                  <Package className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900">Meat Stock & Butchery</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Daily cut allotment</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-[#BA181B] bg-red-50 px-2 py-0.5 rounded-full">
                2 Items Low
              </span>
            </div>

            <div className="space-y-2.5">
              {inventoryCuts.map((cut, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{cut.name}</span>
                    <span className={cut.isLow ? 'text-red-600 font-extrabold' : 'text-slate-600'}>
                      {cut.available} left {cut.isLow && '⚠️'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cut.isLow ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${cut.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rider Fleet Status Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Bike className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900">Delivery Fleet</h3>
                  <p className="text-[10px] text-slate-400 font-medium">4 Riders Online at Noida Hub</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                2 Available
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {riders.map((r, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{r.name}</span>
                    <span className="text-[9px] font-black text-slate-400">{r.battery}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                      r.status.includes('Available') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {r.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{r.order}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. LIVE ORDERS MANAGEMENT QUEUE */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-3.5">
          {/* Queue Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-slate-900">Live Orders Queue</h2>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#BA181B] text-white">
                {filteredOrders.length}
              </span>
            </div>

            {/* Search input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order #, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#BA181B]"
              />
            </div>
          </div>

          {/* Filter Tabs matching User App Pill Style */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#BA181B] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              New Unassigned ({orders.filter(o => o.status === 'New').length})
            </button>
            <button
              onClick={() => setActiveTab('preparing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'preparing'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Cutting & Butchery ({orders.filter(o => o.status === 'Preparing').length})
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'delivery'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              On Bike ({orders.filter(o => o.status === 'Out for Delivery').length})
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'delivered'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Delivered ({orders.filter(o => o.status === 'Delivered').length})
            </button>
          </div>

          {/* Orders Cards List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">No orders found matching this filter.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 hover:border-red-200 transition-all shadow-2xs hover:shadow-sm"
                >
                  {/* Top Row: Order Number + Status Badge + SLA Countdown */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            order.status === 'New'
                              ? 'bg-red-100 text-red-800 animate-pulse'
                              : order.status === 'Preparing'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'Out for Delivery'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Ordered at {order.orderedAt} • {order.paymentMethod}
                      </p>
                    </div>

                    {/* SLA countdown timer */}
                    <div className="text-right">
                      {order.status !== 'Delivered' ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-[#BA181B] rounded-lg text-xs font-black border border-red-100">
                          <Clock className="w-3 h-3" />
                          <span>{order.minutesRemaining}m SLA left</span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Delivered On-Time
                        </span>
                      )}
                      <div className="text-[13px] font-black text-slate-900 mt-1">
                        ₹{order.totalAmount}
                      </div>
                    </div>
                  </div>

                  {/* Middle Row: Customer Info & Items List */}
                  <div className="py-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Customer */}
                    <div className="space-y-1">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1">
                        <span>{order.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({order.distance})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {order.address}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        📞 {order.customerPhone}
                      </p>
                    </div>

                    {/* Items */}
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        Fresh Meat Cuts
                      </span>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span>{it.quantity} x {it.name}</span>
                          <span>₹{it.price}</span>
                        </div>
                      ))}
                      {order.specialNote && (
                        <p className="text-[10px] text-amber-700 bg-amber-50/80 p-1 rounded font-medium mt-1">
                          📝 {order.specialNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Rider Assignment & Quick Action Buttons */}
                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    {/* Rider Info */}
                    <div className="flex items-center gap-1.5 text-xs">
                      {order.assignedRider ? (
                        <div className="flex items-center gap-1 text-slate-700 font-bold text-[11px]">
                          <Bike className="w-3.5 h-3.5 text-orange-600" />
                          <span>Rider: {order.assignedRider.name}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-red-600 font-black">
                          ⚠️ No Rider Assigned
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedOrderForModal(order)}
                        className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        View Details
                      </button>

                      {order.status === 'New' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                          className="px-3 py-1 text-xs font-black text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-2xs transition-all cursor-pointer"
                        >
                          Start Butchery
                        </button>
                      )}

                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                          className="px-3 py-1 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-all cursor-pointer"
                        >
                          Dispatch Rider
                        </button>
                      )}

                      {order.status === 'Out for Delivery' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                          className="px-3 py-1 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs transition-all cursor-pointer"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. MODAL: ORDER DETAILS QUICK VIEW */}
      {/* ========================================================================= */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto no-scrollbar space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Order {selectedOrderForModal.orderNumber}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-[#BA181B]">
                  {selectedOrderForModal.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer info */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900">{selectedOrderForModal.customerName}</h4>
              <p className="text-xs text-slate-600">📞 {selectedOrderForModal.customerPhone}</p>
              <p className="text-xs text-slate-600">📍 {selectedOrderForModal.address} ({selectedOrderForModal.distance})</p>
            </div>

            {/* Items */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase text-slate-400">Order Items</h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {selectedOrderForModal.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs font-bold bg-white">
                    <span>{it.quantity} x {it.name}</span>
                    <span className="text-slate-900">₹{it.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl text-sm font-black text-slate-900">
              <span>Total Payable</span>
              <span className="text-[#BA181B]">₹{selectedOrderForModal.totalAmount} ({selectedOrderForModal.paymentMethod})</span>
            </div>

            {/* Close */}
            <button
              onClick={() => setSelectedOrderForModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-extrabold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
