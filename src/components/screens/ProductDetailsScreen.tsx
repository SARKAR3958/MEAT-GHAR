import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Info,
  ChevronDown,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';
import { useCart } from '../../context/CartContext';

interface ProductDetailsScreenProps {
  onBack: () => void;
  onAddToCart?: () => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  onBack,
  onAddToCart,
}) => {
  const { addToCart } = useCart();
  const [quantityKg, setQuantityKg] = useState(1);
  const [selectedCut, setSelectedCut] = useState('Curry Cut');
  const [customCutInstruction, setCustomCutInstruction] = useState('');
  const [selectedPrep, setSelectedPrep] = useState('Full Cleaned');
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const pricePerKg = 420;
  const totalPrice = Math.round(pricePerKg * quantityKg);

  const cutOptions = ['Curry Cut', 'Small Pieces', 'Large Pieces', 'Custom Cut'];
  const prepOptions = [
    { id: 'Full Cleaned', line1: 'Full', line2: 'Cleaned' },
    { id: 'Extra Cleaned', line1: 'Extra', line2: 'Cleaned' },
    { id: 'Skinless', line1: 'Skin', line2: 'Less' },
    { id: 'With Skin', line1: 'With Skin', line2: '' },
    { id: 'Bone-in', line1: 'Bone-in', line2: '' },
    { id: 'Boneless', line1: 'Boneless', line2: '' },
  ];

  const handleAddProductToCart = () => {
    addToCart({
      id: 'chicken_curry_cut',
      name: 'Fresh Chicken Curry Cut',
      price: totalPrice,
      originalPrice: Math.round(totalPrice * 1.1),
      image: '/images/chicken_curry_cut_wide_1790508282856.jpg',
      category: 'Chicken',
      weight: `${quantityKg} KG`,
      cut: selectedCut === 'Custom Cut' ? `Custom: ${customCutInstruction || 'Special Cut'}` : selectedCut,
      prep: selectedPrep,
      quantity: 1,
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      if (onAddToCart) onAddToCart();
    }, 900);
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
          <span>Added {quantityKg} KG to Cart!</span>
        </div>
      )}

      {/* 1. FIXED TOP HEADER (Never scrolls) */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30 shrink-0 flex items-center justify-between">
        {/* Left: Back button + Meat Ghar logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <HeaderMeatGharLogo />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#BA181B] cursor-pointer"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#BA181B]' : ''}`} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT ONLY */}
      <div className="flex-1 overflow-y-auto pb-4 no-scrollbar">
        {/* Large Product Hero Image */}
        <div className="relative w-full aspect-16/10 bg-slate-100 overflow-hidden shadow-2xs">
          <AppImage
            src="/images/chicken_curry_cut_wide_1790508282856.jpg"
            alt="Fresh Chicken Curry Cut"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-[#BA181B] text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md">
            10% OFF
          </span>
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs flex items-center gap-1">
            <span>🍃</span> Fresh & Safe
          </span>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#BA181B]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white p-4 space-y-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
              Fresh Chicken Curry Cut
            </h1>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-[#BA181B]">
                ₹{pricePerKg} <span className="text-xs font-semibold text-[#BA181B]/80">/ KG</span>
              </span>
              <span className="text-xs text-slate-400 line-through">₹465</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>In Stock &bull; Express 70 Min Delivery</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Fresh and tender chicken curry cut, perfect for your daily curries and gravies. 100% fresh, juicy, and hygienic. Farm to fork guaranteed.
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setQuantityKg((prev) => Math.max(0.5, Number((prev - 0.25).toFixed(2))))}
                className="w-9 h-9 rounded-xl bg-red-100/70 text-[#A8071A] flex items-center justify-center hover:bg-red-200 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                <span>{quantityKg} KG</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              <button
                onClick={() => setQuantityKg((prev) => Math.min(5, Number((prev + 0.25).toFixed(2))))}
                className="w-9 h-9 rounded-xl bg-red-100/70 text-[#A8071A] flex items-center justify-center hover:bg-red-200 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-medium mt-2">
              Min 500g &bull; Max 5KG &bull; Increment 250g
            </p>
          </div>

          {/* Choose Cut Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-slate-900">
                Choose Cut <span className="text-red-500">*</span>
              </label>
              <button className="text-[10px] font-bold text-[#BA181B] flex items-center gap-1">
                <span>View Guide</span>
                <Info className="w-3 h-3 text-[#BA181B]" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cutOptions.map((c) => {
                const isSelected = selectedCut === c;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCut(c)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#BA181B] text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Cut Input */}
            {selectedCut === 'Custom Cut' && (
              <div className="mt-2.5 bg-red-50/60 border border-red-200/90 rounded-xl p-2.5">
                <label className="text-[11px] font-extrabold text-[#BA181B] block mb-1">
                  Custom Cut Instructions <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="custom_cut_no_autofill"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  value={customCutInstruction}
                  onChange={(e) => setCustomCutInstruction(e.target.value)}
                  placeholder="e.g. Please cut into 1.5 inch cubes with bone"
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-red-200 rounded-lg px-3 py-2 outline-none focus:border-[#BA181B] focus:ring-1 focus:ring-[#BA181B] placeholder-slate-400"
                />
              </div>
            )}
          </div>

          {/* Choose Preparation Options */}
          <div>
            <label className="text-xs font-extrabold text-slate-900 block mb-2">
              Choose Preparation <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {prepOptions.map((p) => {
                const isSelected = selectedPrep === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPrep(p.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[46px] ${
                      isSelected
                        ? 'bg-[#BA181B] text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p.line2 ? (
                      <>
                        <span className="leading-tight">{p.line1}</span>
                        <span className="leading-tight">{p.line2}</span>
                      </>
                    ) : (
                      <span>{p.line1}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Notes (Optional) */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-1">
              Add Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2">
              <input
                type="text"
                name="order_notes_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please cut into small pieces."
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. FIXED BOTTOM ACTION BAR (Sticky & Never Scrolls) */}
      <div className="shrink-0 bg-white border-t border-slate-200/90 px-4 py-3 z-30 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 block leading-tight">Total Price</span>
          <span className="text-base font-black text-[#BA181B]">
            ₹{totalPrice} <span className="text-xs font-normal text-slate-500">({quantityKg} KG)</span>
          </span>
        </div>

        <button
          onClick={handleAddProductToCart}
          className="py-2.5 px-6 bg-[#BA181B] hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm rounded-xl shadow-md shadow-red-900/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
