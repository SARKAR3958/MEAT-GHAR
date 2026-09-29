import React, { useState } from 'react';
import { Plus, Tag, Calendar, Sparkles, X } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { AdminHeader } from '../components/AdminHeader';
import { AdminBottomNav } from '../components/AdminBottomNav';
import { AdminOffer } from '../types';

export const OffersScreen: React.FC = () => {
  const { offers, toggleOfferActive, addOffer } = useAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [validTill, setValidTill] = useState('May 30, 2025');
  const [discountValue, setDiscountValue] = useState('25% OFF');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80'
  );

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addOffer({
      title: title.trim(),
      description: 'Special seasonal promotional discount.',
      image: imageUrl,
      validTill: validTill.trim(),
      discountType: 'percentage',
      discountValue: discountValue.trim(),
      isActive: true,
    });

    setTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full h-full bg-[#F8F9FA] text-slate-800 flex flex-col justify-between overflow-hidden font-sans select-none relative">
      {/* Header with "+ Add Offer" Button */}
      <AdminHeader
        title="Offers & Discounts"
        showBack={true}
        showBell={false}
        rightAction={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-full shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Offer</span>
          </button>
        }
      />

      {/* Offers List Matching Screen 12 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white p-3.5 rounded-3xl border border-slate-300 shadow-2xs flex items-center justify-between gap-3.5 hover:border-slate-400 transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-100"
              />
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-900 leading-snug">{offer.title}</h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <span>Valid till: {offer.validTill}</span>
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => toggleOfferActive(offer.id)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  offer.isActive ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    offer.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Offer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Add New Promo Offer</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Offer Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 20% OFF on All Platters"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Validity Date</label>
                <input
                  type="text"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                  placeholder="e.g. May 30, 2025"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Banner Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-red-600/20 transition-all cursor-pointer mt-1"
              >
                Create Promo Offer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <AdminBottomNav />
    </div>
  );
};
