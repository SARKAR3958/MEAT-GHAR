import React, { useState } from 'react';
import {
  MapPin,
  ChevronDown,
  Bell,
  Search,
  ArrowRight,
  Plus,
  Star,
  Home,
  Grid,
  ClipboardList,
  ShoppingCart,
  User,
  Leaf,
  Check,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';
import { useCart } from '../../context/CartContext';

interface HomeScreenProps {
  onNavigateTab: (tab: string, categoryName?: string) => void;
  onSelectProduct: (productName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onSelectProduct,
}) => {
  const { cartCount, addToCart, getItemQuantity } = useCart();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [notificationCount] = useState(3);
  const [searchVal, setSearchVal] = useState('');
  const [addedPopup, setAddedPopup] = useState<string | null>(null);

  const categories = [
    {
      id: 'chicken',
      name: 'Chicken',
      image: '/images/cat_chicken_1790504356265.jpg',
    },
    {
      id: 'mutton',
      name: 'Mutton',
      image: '/images/cat_mutton_1790504374485.jpg',
    },
    {
      id: 'fish',
      name: 'Fish',
      image: '/images/cat_fish_1790504389877.jpg',
    },
    {
      id: 'eggs',
      name: 'Eggs',
      image: '/images/cat_eggs_1790504403080.jpg',
    },
    {
      id: 'ready_to_cook',
      name: 'Ready to Cook',
      image: '/images/cat_ready_to_cook_1790507566251.jpg',
    },
  ];

  const popularProducts = [
    {
      id: 'chicken_curry_cut',
      name: 'Fresh Chicken Curry Cut',
      price: 420,
      priceUnit: '₹420 / KG',
      originalPrice: 465,
      rating: 4.8,
      reviews: '1.2k',
      discount: '10% OFF',
      image: '/images/chicken_curry_cut_wide_1790508282856.jpg',
    },
    {
      id: 'mutton_boneless',
      name: 'Fresh Mutton Boneless',
      price: 680,
      priceUnit: '₹680 / KG',
      originalPrice: 720,
      rating: 4.6,
      reviews: '856',
      discount: '5% OFF',
      image: '/images/mutton_boneless_wide_1790508301717.jpg',
    },
    {
      id: 'rohu_fish_curry_cut',
      name: 'Fresh Rohu Fish Cut',
      price: 360,
      priceUnit: '₹360 / KG',
      originalPrice: 400,
      rating: 4.7,
      reviews: '640',
      discount: '10% OFF',
      image: '/images/rohu_fish_wide_1790508321588.jpg',
    },
  ];

  const handleAddToCart = (e: React.MouseEvent, prod: typeof popularProducts[0]) => {
    e.stopPropagation();
    addToCart({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice,
      image: prod.image,
      quantity: 1,
    });
    setAddedPopup(prod.name);
    setTimeout(() => setAddedPopup(null), 1800);
  };

  return (
    <div className="w-full h-full bg-white text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Toast popup when item is added */}
      {addedPopup && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>Added to Cart!</span>
        </div>
      )}

      {/* 1. FIXED TOP HEADER (Logo + Location + Notifications) */}
      <div className="shrink-0 bg-white z-30 pt-3 pb-2 px-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {/* Left: Meat Ghar House Logo */}
          <div className="flex items-center">
            <HeaderMeatGharLogo />
          </div>

          {/* Center: Location selector */}
          <div
            onClick={() => onNavigateTab('location')}
            className="flex items-start gap-1.5 cursor-pointer border border-transparent hover:border-[#BA181B]/40 rounded-xl px-1.5 py-0.5 transition-all duration-150"
          >
            <MapPin className="w-4 h-4 text-[#BA181B] shrink-0 mt-0.5 stroke-[2]" />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[12.5px] font-extrabold text-slate-900 tracking-tight leading-none">
                  Sector 10, Noida
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#BA181B] stroke-[2]" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">
                Change location
              </p>
            </div>
          </div>

          {/* Right: Notification Bell */}
          <div className="flex justify-end">
            <button
              onClick={() => onNavigateTab('notifications')}
              className="relative p-1 rounded-full hover:bg-red-50 text-[#BA181B] transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5 text-[#BA181B] stroke-[2]" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#BA181B] text-white text-[9px] font-extrabold flex items-center justify-center border-1.5 border-white shadow-2xs">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Part of fixed top header) */}
        <div
          onClick={() => onNavigateTab('search')}
          className="flex items-center bg-[#F3F4F6] rounded-2xl px-3.5 py-2 border border-slate-200/60 shadow-2xs cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <Search className="w-4 h-4 text-[#BA181B] stroke-[2.5] mr-2.5 shrink-0" />
          <input
            type="text"
            name="home_search_no_autofill"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNavigateTab('search');
            }}
            placeholder="Search chicken, mutton, fish..."
            className="w-full text-xs font-normal text-slate-800 placeholder-slate-400 bg-transparent outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* 2. SCROLLABLE MAIN CONTENT AREA ONLY */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-4">
        {/* HERO PROMOTIONAL BANNER */}
        <div className="px-4">
          <div className="bg-gradient-to-r from-[#6e0513] via-[#8c0818] to-[#48020b] text-white rounded-2xl p-4 shadow-md relative overflow-hidden min-h-[160px] flex items-center justify-between">
            {/* Left Content */}
            <div className="relative z-10 max-w-[210px] space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center relative shrink-0">
                  <div className="w-0.5 h-1.5 bg-white absolute top-1 rounded-full" />
                  <div className="w-1.5 h-0.5 bg-white absolute right-1 rounded-full" />
                  <div className="w-1 h-0.5 bg-white absolute -top-1 rounded-xs" />
                </div>
                <span className="text-[19px] font-black text-white tracking-tight leading-none uppercase">
                  70 MINUTES
                </span>
              </div>

              <div className="text-[22px] font-black text-[#FACC15] tracking-tight leading-none uppercase">
                OR FREE
              </div>

              <p className="text-[11px] text-white/95 font-medium leading-snug pt-0.5">
                Fresh meat delivered to your doorstep.
              </p>

              <button
                onClick={() => onNavigateTab('category')}
                className="mt-2 py-1.5 px-4 bg-[#BA181B] hover:bg-red-800 active:scale-95 border border-white/20 text-white font-bold text-xs rounded-full inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </button>
            </div>

            {/* Right Fresh Meat Photography */}
            <div className="absolute top-0 right-0 w-[48%] h-full pointer-events-none overflow-hidden">
              <AppImage
                src="/images/hero_banner_meat_1790507616083.jpg"
                alt="Fresh Raw Steaks on Board"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-2.5 right-2.5 bg-[#BA181B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1 shadow-sm">
                <Leaf className="w-2.5 h-2.5 text-white fill-white" />
                <span>Fresh & Safe</span>
              </div>
            </div>
          </div>

          {/* Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {[0, 1, 2, 3].map((idx) => (
              <span
                key={idx}
                onClick={() => setActiveBannerIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  activeBannerIndex === idx ? 'bg-[#BA181B] w-2' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 5 CATEGORIES ROW */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black text-[#111827] tracking-tight">Categories</h2>
            <button
              onClick={() => onNavigateTab('category')}
              className="text-xs font-bold text-[#BA181B] flex items-center gap-0.5 cursor-pointer hover:underline"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex items-start justify-between gap-1 overflow-x-auto no-scrollbar py-1">
            {categories.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigateTab('category', c.name)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0 w-[62px]"
              >
                <div className="w-[56px] h-[56px] rounded-full bg-[#FDF2F2] border border-[#FEE2E2] p-0.5 shadow-2xs overflow-hidden group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                  <AppImage
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 text-center leading-tight line-clamp-1">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* POPULAR PRODUCTS */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-black text-[#111827] tracking-tight">Popular Near You</h2>
            <button
              onClick={() => onNavigateTab('category')}
              className="text-xs font-bold text-[#BA181B] flex items-center gap-0.5 cursor-pointer hover:underline"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {popularProducts.map((p) => {
              const qty = getItemQuantity(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p.name)}
                  className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-[115px] rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                      <AppImage
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-[#A8071A] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        {p.discount}
                      </span>
                      <span className="absolute top-1.5 right-1.5 bg-white/90 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                        <Leaf className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                        Fresh
                      </span>
                    </div>

                    <h3 className="text-xs font-black text-slate-900 line-clamp-1 mb-0.5">
                      {p.name}
                    </h3>
                    <p className="text-xs font-extrabold text-[#A8071A]">{p.priceUnit}</p>

                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-700">{p.rating}</span>
                        <span className="text-slate-400">({p.reviews})</span>
                      </div>
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        In Stock
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, p)}
                    className={`mt-2.5 w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                      qty > 0
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-[#A8071A] hover:bg-red-800 text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{qty > 0 ? `Added (${qty})` : 'Add'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* TODAY'S OFFERS */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black text-[#111827] tracking-tight">Today's Offers</h2>
            <button
              onClick={() => onNavigateTab('category')}
              className="text-xs font-bold text-[#BA181B] flex items-center gap-0.5 cursor-pointer hover:underline"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div
              onClick={() => onNavigateTab('category', 'Chicken')}
              className="bg-gradient-to-br from-[#720412] to-[#A8071A] text-white p-3 rounded-2xl relative overflow-hidden h-[100px] flex flex-col justify-between cursor-pointer group shadow-2xs"
            >
              <div className="z-10 max-w-[85px]">
                <span className="text-[9px] font-black uppercase tracking-wider block leading-tight text-white">
                  FRESH CHICKEN
                </span>
                <span className="text-[8px] font-bold text-amber-300 block uppercase">
                  SPECIAL OFFER
                </span>
                <span className="text-xs font-black bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                  UP TO 15% OFF
                </span>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none">
                <AppImage
                  src="/images/offer_chicken_card_1790507696774.jpg"
                  alt="Fresh Chicken Offer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('category', 'Mutton')}
              className="bg-gradient-to-br from-[#FF9800] to-[#E65100] text-white p-3 rounded-2xl relative overflow-hidden h-[100px] flex flex-col justify-between cursor-pointer group shadow-2xs"
            >
              <div className="z-10 max-w-[85px]">
                <span className="text-[10px] font-black uppercase tracking-wider block leading-tight text-white">
                  MUTTON DEAL
                </span>
                <span className="text-xs font-black bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded-md mt-2 inline-block">
                  SAVE 10%
                </span>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none">
                <AppImage
                  src="/images/offer_mutton_card_1790507713635.jpg"
                  alt="Mutton Deal"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FIXED BOTTOM NAVIGATION BAR (Never scrolls) */}
      <div className="bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shrink-0 shadow-md">
        <button
          onClick={() => onNavigateTab('home')}
          className="flex flex-col items-center gap-0.5 text-[#BA181B] relative cursor-pointer"
        >
          <Home className="w-5 h-5 text-[#BA181B] stroke-[#BA181B] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#BA181B]">Home</span>
          <div className="w-7 h-[2.5px] bg-[#BA181B] rounded-full absolute -bottom-1.5" />
        </button>

        <button
          onClick={() => onNavigateTab('category')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Categories</span>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Orders</span>
        </button>

        <button
          onClick={() => onNavigateTab('cart')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 relative cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA181B] text-white text-[9px] font-extrabold flex items-center justify-center border-1.5 border-white shadow-2xs animate-pulse">
              {cartCount}
            </span>
          )}
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
