import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Flame,
  Clock,
  UploadCloud,
  Check,
  X,
  Sparkles,
  ShoppingBag,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { AdminHeader } from '../components/AdminHeader';
import { AdminBottomNav } from '../components/AdminBottomNav';
import { AdminFlashDeal } from '../types';

const PRESET_FLASH_IMAGES = [
  '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
  '/src/assets/images/mutton_boneless_wide_1790508301717.jpg',
  '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
  '/src/assets/images/cat_prawns_seafood_1790508815698.jpg',
  '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  '/src/assets/images/cat_eggs_1790504403080.jpg',
];

export const FlashDealsScreen: React.FC = () => {
  const { flashDeals, categories, addFlashDeal, updateFlashDeal, deleteFlashDeal, toggleFlashDealActive } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState('Flash Deal');
  const [productName, setProductName] = useState('Fresh Rohu Fish Steak');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'fish');
  const [price, setPrice] = useState('260');
  const [originalPrice, setOriginalPrice] = useState('320');
  const [discountPercentage, setDiscountPercentage] = useState('19% OFF');
  const [image, setImage] = useState(PRESET_FLASH_IMAGES[0]);
  const [stockLeft, setStockLeft] = useState('12');
  const [totalStock, setTotalStock] = useState('30');
  const [endsInMinutes, setEndsInMinutes] = useState('120');
  const [unit, setUnit] = useState('1 KG');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setEditingDealId(null);
    setTitle('Lightning Flash Deal');
    setProductName('');
    setCategoryId(categories[0]?.id || 'chicken');
    setPrice('390');
    setOriginalPrice('480');
    setDiscountPercentage('20% OFF');
    setImage(PRESET_FLASH_IMAGES[0]);
    setStockLeft('15');
    setTotalStock('40');
    setEndsInMinutes('180');
    setUnit('1 KG');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (deal: AdminFlashDeal) => {
    setEditingDealId(deal.id);
    setTitle(deal.title);
    setProductName(deal.productName);
    setCategoryId(deal.categoryId);
    setPrice(deal.price.toString());
    setOriginalPrice(deal.originalPrice.toString());
    setDiscountPercentage(deal.discountPercentage);
    setImage(deal.image);
    setStockLeft(deal.stockLeft.toString());
    setTotalStock(deal.totalStock.toString());
    setEndsInMinutes(deal.endsInMinutes.toString());
    setUnit(deal.unit);
    setIsAddModalOpen(true);
  };

  const handleSaveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCategory = categories.find((c) => c.id === categoryId);
    const categoryName = matchedCategory ? matchedCategory.name : 'General';

    if (editingDealId) {
      updateFlashDeal(editingDealId, {
        title,
        productName: productName.trim() || title,
        category: categoryName,
        categoryId,
        price: parseFloat(price) || 0,
        originalPrice: parseFloat(originalPrice) || 0,
        discountPercentage,
        image,
        stockLeft: parseInt(stockLeft, 10) || 10,
        totalStock: parseInt(totalStock, 10) || 30,
        endsInMinutes: parseInt(endsInMinutes, 10) || 120,
        unit,
      });
    } else {
      addFlashDeal({
        title,
        productName: productName.trim() || title,
        category: categoryName,
        categoryId,
        price: parseFloat(price) || 0,
        originalPrice: parseFloat(originalPrice) || 0,
        discountPercentage,
        image,
        stockLeft: parseInt(stockLeft, 10) || 10,
        totalStock: parseInt(totalStock, 10) || 30,
        endsInMinutes: parseInt(endsInMinutes, 10) || 120,
        unit,
        isActive: true,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full h-full bg-[#F8F9FA] text-slate-800 flex flex-col justify-between overflow-hidden font-sans select-none relative">
      {/* Header */}
      <AdminHeader
        title="Flash Deals"
        showDrawer={true}
        showBell={true}
        rightAction={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-full shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Deal</span>
          </button>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Top Info Card */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-300 shadow-2xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-600 fill-red-600" />
              <h3 className="text-xs font-bold text-slate-900">User App Bottom Flash Deals</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Limited-time countdown deals shown prominently on consumer home screen.
            </p>
          </div>
          <span className="bg-red-50 text-red-600 text-xs font-black px-2.5 py-1 rounded-full border border-red-200">
            {flashDeals.filter((d) => d.isActive).length} Live
          </span>
        </div>

        {/* Flash Deals Cards List */}
        <div className="space-y-3">
          {flashDeals.map((deal) => {
            const percentClaimed = Math.min(
              100,
              Math.round(((deal.totalStock - deal.stockLeft) / deal.totalStock) * 100)
            );

            return (
              <div
                key={deal.id}
                className="bg-white p-3.5 rounded-3xl border border-slate-300 shadow-2xs space-y-3 hover:border-slate-400 transition-all"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>{deal.discountPercentage}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">{deal.productName}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleFlashDealActive(deal.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                        deal.isActive
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {deal.isActive ? 'Live' : 'Paused'}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(deal)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Delete this flash deal?')) {
                          deleteFlashDeal(deal.id);
                        }
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Deal Content */}
                <div className="flex items-center gap-3">
                  <img
                    src={deal.image}
                    alt={deal.productName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80';
                    }}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                  />

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-black text-red-600">₹{deal.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{deal.originalPrice}</span>
                      <span className="text-[10px] text-slate-400">/ {deal.unit}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10.5px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg w-fit border border-amber-200/60">
                      <Clock className="w-3 h-3" />
                      <span>Ends in {deal.endsInMinutes} mins</span>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                        <span>Only {deal.stockLeft} left</span>
                        <span>{percentClaimed}% claimed</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                          style={{ width: `${percentClaimed}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT FLASH DEAL MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-4 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto no-scrollbar space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingDealId ? 'Edit Flash Deal' : 'Add Flash Deal'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDeal} className="space-y-3.5">
              {/* Image selection and upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">Deal Photo</label>
                <div className="h-28 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 relative bg-slate-50 flex items-center justify-center">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold gap-1.5 cursor-pointer opacity-80 hover:opacity-100"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Image from Gallery</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-6 gap-1.5 pt-1">
                  {PRESET_FLASH_IMAGES.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImage(imgUrl)}
                      className={`h-9 rounded-lg overflow-hidden border-2 cursor-pointer ${
                        image === imgUrl ? 'border-red-600 ring-2 ring-red-500/20' : 'border-slate-200'
                      }`}
                    >
                      <img src={imgUrl} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Name & Category */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Royal Mutton Boneless Cubes"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Target Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price, Original Price, Discount */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Deal Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Orig. Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    required
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Badge %</label>
                  <input
                    type="text"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="20% OFF"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Stock & Timer */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Stock Left</label>
                  <input
                    type="number"
                    value={stockLeft}
                    onChange={(e) => setStockLeft(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Total Stock</label>
                  <input
                    type="number"
                    value={totalStock}
                    onChange={(e) => setTotalStock(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Ends (Mins)</label>
                  <input
                    type="number"
                    value={endsInMinutes}
                    onChange={(e) => setEndsInMinutes(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 active:scale-95 cursor-pointer"
                >
                  {editingDealId ? 'Save Changes' : 'Create Flash Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <AdminBottomNav />
    </div>
  );
};
