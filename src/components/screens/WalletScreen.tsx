import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  CheckCircle,
  Copy,
  Clock,
  CheckCircle2,
  X,
  CreditCard,
  Building,
  Sparkles,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { supabase } from '../../lib/supabase';

interface WalletScreenProps {
  onBack: () => void;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'deposit' | 'payment';
  status: 'Pending' | 'Approved' | 'Rejected';
  utr?: string;
  date: string;
  notes?: string;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ onBack }) => {
  const [balance, setBalance] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrAmount, setQRAmount] = useState<number>(0);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>('');

  // Fetch Wallet Balance and Transactions from LocalStorage & Supabase
  useEffect(() => {
    // 1. Local Balance load
    const savedBalance = localStorage.getItem('meatghar_wallet_balance');
    if (savedBalance) {
      setBalance(Number(savedBalance));
    } else {
      localStorage.setItem('meatghar_wallet_balance', '500'); // default initial ₹500 welcome bonus!
      setBalance(500);
    }

    // 2. Load Local Transactions
    const savedTxns = localStorage.getItem('meatghar_wallet_transactions');
    if (savedTxns) {
      setTransactions(JSON.parse(savedTxns));
    } else {
      const initialTxns: WalletTransaction[] = [
        {
          id: 'TXN-INIT-101',
          amount: 500,
          type: 'deposit',
          status: 'Approved',
          date: 'Sep 29, 2026',
          notes: 'Welcome Bonus Credit',
        },
      ];
      localStorage.setItem('meatghar_wallet_transactions', JSON.stringify(initialTxns));
      setTransactions(initialTxns);
    }

    // 3. Attempt Supabase fetch
    const syncWallet = async () => {
      try {
        const savedUserStr = localStorage.getItem('meatghar_user');
        const userObj = savedUserStr ? JSON.parse(savedUserStr) : {};
        const phone = userObj.phone || '';
        if (!phone) return;

        // Fetch user wallet
        const { data: walletData } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', phone)
          .single();

        if (walletData) {
          setBalance(Number(walletData.balance));
          localStorage.setItem('meatghar_wallet_balance', String(walletData.balance));
        }

        // Fetch transactions
        const { data: dbTxns } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('user_id', phone)
          .order('created_at', { ascending: false });

        if (dbTxns && dbTxns.length > 0) {
          const mapped: WalletTransaction[] = dbTxns.map((t: any) => ({
            id: t.id,
            amount: Number(t.amount),
            type: t.type as 'deposit' | 'payment',
            status: t.status as 'Pending' | 'Approved' | 'Rejected',
            utr: t.qr_reference || '',
            date: new Date(t.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            notes: t.notes || '',
          }));
          setTransactions(mapped);
          localStorage.setItem('meatghar_wallet_transactions', JSON.stringify(mapped));
        }
      } catch (err) {
        console.warn('Supabase wallet load note:', err);
      }
    };

    syncWallet();
  }, []);

  const handleQuickAdd = (amount: number) => {
    setCustomAmount(String(amount));
  };

  const handleInitiateAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(customAmount);
    if (isNaN(amt) || amt <= 0) {
      setAlertMsg('Please enter a valid amount');
      return;
    }
    setQRAmount(amt);
    setUtrNumber('');
    setAlertMsg('');
    setShowQR(true);
  };

  const handleSubmitDeposit = async () => {
    if (!utrNumber.trim()) {
      setAlertMsg('Enter the 12-digit UTR or Transaction reference number');
      return;
    }

    setIsSubmitting(true);
    const txnId = `WTXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const savedUserStr = localStorage.getItem('meatghar_user');
    const userObj = savedUserStr ? JSON.parse(savedUserStr) : {};
    const phone = userObj.phone || '';

    const newTxn: WalletTransaction = {
      id: txnId,
      amount: qrAmount,
      type: 'deposit',
      status: 'Pending',
      utr: utrNumber,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      notes: 'UPI QR Deposit Request',
    };

    // 1. Update local storage
    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    localStorage.setItem('meatghar_wallet_transactions', JSON.stringify(updatedTxns));

    // 2. Sync to Supabase wallet_transactions table
    try {
      await supabase.from('wallet_transactions').insert({
        id: txnId,
        user_id: phone,
        amount: qrAmount,
        type: 'deposit',
        status: 'Pending',
        qr_reference: utrNumber,
        notes: 'UPI QR Deposit Request',
      });
    } catch (err) {
      console.warn('Supabase insert note:', err);
    }

    setIsSubmitting(false);
    setShowQR(false);
    setShowSuccess(true);
    setCustomAmount('');

    setTimeout(() => {
      setShowSuccess(false);
    }, 2800);
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText('meatghar@upi');
    setAlertMsg('UPI ID copied to clipboard!');
    setTimeout(() => setAlertMsg(''), 2000);
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
          <h2 className="text-lg font-extrabold text-slate-900">Meat Ghar Wallet</h2>
        </div>

        <HeaderMeatGharLogo />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar pb-6">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-[#A8071A] via-[#BA181B] to-[#E63946] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          {/* Sparkles background effect */}
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-4 -translate-y-4">
            <Wallet className="w-48 h-48" />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-red-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Available Balance
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3.5 text-[11px] font-semibold text-red-100">
            <span>Fast, safe & cashless checkouts</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-md text-white font-bold">100% Secure</span>
          </div>
        </div>

        {/* Quick Add Money Panel */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">Add Money to Wallet</h3>

          <form onSubmit={handleInitiateAdd} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Enter Amount (₹)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-base font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="Enter amount (e.g. 500)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-[#A8071A] focus:ring-1 focus:ring-[#A8071A] transition-all"
                />
              </div>
            </div>

            {/* Quick choices */}
            <div className="grid grid-cols-4 gap-2">
              {[100, 200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAdd(amt)}
                  className={`py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    customAmount === String(amt)
                      ? 'bg-red-50 border-[#A8071A] text-[#A8071A]'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  +{amt}
                </button>
              ))}
            </div>

            {alertMsg && <p className="text-xs text-red-600 font-bold">{alertMsg}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-[#A8071A] hover:bg-[#8C0818] text-white text-xs font-black rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Proceed to Add Money</span>
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">Transaction History</h3>

          {transactions.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Wallet className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-semibold">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto no-scrollbar">
              {transactions.map((t) => {
                const isDeposit = t.type === 'deposit';
                return (
                  <div key={t.id} className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDeposit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-[#A8071A]'
                        }`}
                      >
                        {isDeposit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-none">{t.notes || (isDeposit ? 'Money Added' : 'Paid for Order')}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">{t.date}</p>
                        {t.utr && <p className="text-[9px] text-slate-500 font-medium">Ref: {t.utr}</p>}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-xs font-black ${isDeposit ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {isDeposit ? '+' : '-'}₹{t.amount}
                      </p>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-md font-bold mt-1 inline-block ${
                          t.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : t.status === 'Pending'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* UPI QR Payment Modal Sheet */}
      {showQR && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[90%] overflow-y-auto p-5 space-y-4 no-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#A8071A]" />
                <h3 className="text-sm font-extrabold text-slate-950">UPI QR Deposit</h3>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount to Deposit</p>
              <h2 className="text-2xl font-black text-slate-900">₹{qrAmount}</h2>
            </div>

            {/* Generated QR Code Simulation Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center">
              <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-100 relative">
                {/* Visual Simulation of a real UPI QR with amount payload */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=meatghar@upi&pn=MeatGhar&am=${qrAmount}&cu=INR`}
                  alt="UPI QR Code"
                  className="w-40 h-180 object-contain mx-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <Wallet className="w-12 h-12 text-[#A8071A]" />
                </div>
              </div>

              <div className="mt-3.5 text-center">
                <p className="text-xs font-extrabold text-slate-900">meatghar@upi</p>
                <button
                  onClick={copyUPIId}
                  className="text-[11px] text-[#A8071A] font-bold hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy UPI ID</span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1 bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-slate-700 text-xs font-semibold leading-relaxed">
              <p className="text-[11px] uppercase tracking-wider text-amber-900 font-extrabold mb-1">How to pay:</p>
              <p>1. Open any UPI App (GPay, PhonePe, Paytm, BHIM) and scan this QR code.</p>
              <p>2. Complete the payment of ₹{qrAmount} successfully.</p>
              <p>3. Copy the **12-digit UTR/Ref ID** and enter it below to submit request.</p>
            </div>

            {/* UTR reference submission */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">UPI Ref No. / UTR / Transaction ID (12 Digits) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="Enter 12-digit UPI UTR Number"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 tracking-wider outline-none focus:border-[#A8071A]"
                />
              </div>

              {alertMsg && <p className="text-xs text-red-600 font-bold">{alertMsg}</p>}

              <button
                onClick={handleSubmitDeposit}
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-black rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Deposit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation Platter */}
      {showSuccess && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 text-center space-y-3.5 max-w-xs w-full shadow-2xl border border-slate-100 flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
            <h3 className="text-base font-extrabold text-slate-900">Request Sent Successfully!</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Aapki deposit request submit ho gayi hai! Admin verify karte hi ₹{qrAmount} aapke wallet me add kar dega.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
