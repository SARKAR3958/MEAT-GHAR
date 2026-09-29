import React, { useState } from 'react';
import {
  BarChart3,
  ShoppingBag,
  Users,
  Package,
  Settings,
  CreditCard,
  Bike,
  Bell,
  ChevronRight,
  Shield,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { AdminHeader } from '../components/AdminHeader';
import { AdminBottomNav } from '../components/AdminBottomNav';

export const ReportsSettingsScreen: React.FC = () => {
  const { showToast, orders, users, products, walletRequests, approveWalletRequest, rejectWalletRequest } = useAdmin();
  const [activeSegment, setActiveSegment] = useState<'reports' | 'settings' | 'wallet'>('reports');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const reportsList = [
    { id: 'sales', title: 'Sales Report', icon: BarChart3, desc: 'Revenue, profit margins, and analytics' },
    { id: 'orders', title: 'Order Report', icon: ShoppingBag, desc: 'Fulfilled vs cancelled dispatch metrics' },
    { id: 'users', title: 'User Report', icon: Users, desc: 'Customer retention and signups' },
    { id: 'products', title: 'Product Report', icon: Package, desc: 'Top-selling cuts and low stock inventory' },
  ];

  const settingsList = [
    { id: 'app', title: 'App Settings', icon: Settings, desc: 'Store operational status and branding' },
    { id: 'payment', title: 'Payment Settings', icon: CreditCard, desc: 'Gateways, COD, UPI, and tax rates' },
    { id: 'delivery', title: 'Delivery Settings', icon: Bike, desc: '70-minute SLA radius and delivery fees' },
    { id: 'notifications', title: 'Notifications', icon: Bell, desc: 'Order alerts and push broadcast channels' },
  ];

  const handleItemClick = (title: string) => {
    setActiveModal(title);
  };

  const handleExportData = () => {
    showToast('Report CSV exported successfully');
    setActiveModal(null);
  };

  return (
    <div className="w-full h-full bg-[#F8F9FA] text-slate-800 flex flex-col justify-between overflow-hidden font-sans select-none relative">
      {/* Header */}
      <AdminHeader title="Reports & Settings" showBack={true} showBell={false} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* ========================================================================= */}
        {/* 3-Way Segmented Switcher [Reports | Settings | Wallet Requests] */}
        {/* ========================================================================= */}
        <div className="bg-white p-1 rounded-2xl border border-slate-300 flex items-center shadow-2xs">
          <button
            onClick={() => setActiveSegment('reports')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              activeSegment === 'reports'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reports
          </button>

          <button
            onClick={() => setActiveSegment('settings')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              activeSegment === 'settings'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Settings
          </button>

          <button
            onClick={() => setActiveSegment('wallet')}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer relative ${
              activeSegment === 'wallet'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wallet Req
            {walletRequests.filter((r) => r.status === 'Pending').length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
                {walletRequests.filter((r) => r.status === 'Pending').length}
              </span>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* Content Section based on Segment */}
        {/* ========================================================================= */}
        {activeSegment === 'reports' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Reports</h3>

            <div className="space-y-2">
              {reportsList.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.title)}
                    className="bg-white p-3.5 rounded-2xl border border-slate-300 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-400 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSegment === 'settings' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Settings</h3>

            <div className="space-y-2">
              {settingsList.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.title)}
                    className="bg-white p-3.5 rounded-2xl border border-slate-300 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-400 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSegment === 'wallet' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Deposit Requests</h3>

            {walletRequests.length === 0 ? (
              <div className="text-center py-10 bg-white border border-slate-300 rounded-3xl p-6 text-slate-400 font-semibold text-xs">
                No deposit requests received
              </div>
            ) : (
              <div className="space-y-3">
                {walletRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-4 rounded-3xl border border-slate-300 shadow-2xs space-y-3.5"
                  >
                    <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">{req.customer_name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">User: {req.user_id}</p>
                        {req.qr_reference && (
                          <p className="text-[10px] text-slate-700 font-medium">Ref/UTR: <span className="font-bold text-[#E53935]">{req.qr_reference}</span></p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">₹{req.amount}</p>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-md font-bold mt-1 inline-block ${
                            req.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : req.status === 'Pending'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    {req.status === 'Pending' && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => approveWalletRequest(req.id)}
                          className="py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-[11px] font-extrabold rounded-2xl cursor-pointer transition-all shadow-sm"
                        >
                          APPROVE
                        </button>
                        <button
                          onClick={() => rejectWalletRequest(req.id)}
                          className="py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-[11px] font-extrabold rounded-2xl cursor-pointer transition-all shadow-sm"
                        >
                          REJECT
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail / Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{activeModal}</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">Operational Summary:</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">Total Orders</span>
                  <span className="font-bold text-slate-900">{orders.length}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">Active Users</span>
                  <span className="font-bold text-slate-900">{users.length}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">Catalogue Size</span>
                  <span className="font-bold text-slate-900">{products.length} Items</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">SLA Compliance</span>
                  <span className="font-bold text-emerald-600">98.4%</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportData}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <AdminBottomNav />
    </div>
  );
};
