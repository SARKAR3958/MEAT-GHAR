import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Bell,
  Clock,
  ArrowRight,
  Star,
  Home as HomeIcon,
  LayoutGrid,
  ClipboardList,
  User,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  Leaf,
} from 'lucide-react';
import { MeatGharLogo, HeaderMeatGharLogo } from '../MeatGharLogo';

interface HomeScreenProps {
  onNavigateTab: (tab: string, categoryName?: string) => void;
  onSelectProduct: (productName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onSelectProduct,
}) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount] = useState(3);
  const [searchVal, setSearchVal] = useState('');

  const categories = [
    {
      name: 'Chicken',
      image: '/src/assets/images/cat_chicken_1790504356265.jpg',
    },
    {
      name: 'Mutton',
      image: '/src/assets/images/cat_mutton_1790504374485.jpg',
    },
    {
      name: 'Fish',
      image: '/src/assets/images/cat_fish_1790504389877.jpg',
    },
    {
      name: 'Eggs',
      image: '/src/assets/images/cat_eggs_1790504403080.jpg',
    },
    {
      name: 'Ready to Cook',
      image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
    },
  ];

  const popularProducts = [
    {
      id: 'p1',
      name: 'Fresh Chicken Curry Cut',
      price: '₹420 / KG',
      discount: '10% OFF',
      rating: '4.8 (1.2k)',
      image: '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
    },
    {
      id: 'p2',
      name: 'Fresh Mutton Boneless',
      price: '₹680 / KG',
      discount: '5% OFF',
      rating: '4.6 (856)',
      image: '/src/assets/images/mutton_boneless_wide_1790508301717.jpg',
    },
    {
      id: 'p3',
      name: 'Fresh Rohu Fish (Cleaned)',
      price: '₹260 / KG',
      discount: '8% OFF',
      rating: '4.7 (632)',
      image: '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
    },
  ];

  const handleAddToCart = (e: React.MouseEvent, productName: string) => {
    e.stopPropagation();
    onSelectProduct(productName);
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-white text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 2. HEADER: Left = Meat Ghar Logo (top) + Meat Ghar (bottom, no tagline), Middle = Location, Right = Notification */}
      <div className="bg-white px-4 pt-3 pb-2 z-20 flex items-center justify-between gap-2">
        {/* Left: MEAT GHAR with logo on top (no tagline) */}
        <HeaderMeatGharLogo onClick={() => onNavigateTab('home')} />

        {/* Middle: Location Option */}
        <div
          onClick={() => onNavigateTab('delivery_address')}
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

      {/* 3. SEARCH BAR */}
      <div className="px-4 mb-3 z-10">
        <div
          onClick={() => onNavigateTab('search')}
          className="flex items-center bg-[#F3F4F6] rounded-2xl px-3.5 py-2.5 border border-slate-200/60 shadow-2xs cursor-pointer hover:bg-slate-100 transition-colors"
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

      {/* SCROLLABLE MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {/* 4. HERO PROMOTIONAL BANNER */}
        <div className="px-4 mb-1">
          <div className="bg-gradient-to-r from-[#6e0513] via-[#8c0818] to-[#48020b] text-white rounded-2xl p-4 shadow-md relative overflow-hidden min-h-[160px] flex items-center justify-between">
            {/* Left Content */}
            <div className="relative z-10 max-w-[210px] space-y-1">
              <div className="flex items-center gap-2">
                {/* Stopwatch Icon */}
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

            {/* Right Fresh Meat Photography with Cutting Board & Fresh & Safe Badge */}
            <div className="absolute top-0 right-0 w-[48%] h-full pointer-events-none overflow-hidden">
              <img
                src="/src/assets/images/hero_banner_meat_1790507616083.jpg"
                alt="Fresh Raw Steaks on Board"
                className="w-full h-full object-cover object-center"
              />
              {/* Fresh & Safe Badge */}
              <div className="absolute top-2.5 right-2.5 bg-[#BA181B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1 shadow-sm">
                <Leaf className="w-2.5 h-2.5 text-white fill-white" />
                <span>Fresh & Safe</span>
              </div>
            </div>
          </div>

          {/* Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2 mb-3.5">
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

        {/* 5. CATEGORIES SECTION */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Categories</h3>
            <button
              onClick={() => onNavigateTab('category')}
              className="text-xs font-bold text-[#BA181B] flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* 5 Categories with enlarged image circles */}
          <div className="grid grid-cols-5 gap-2 text-center">
            {categories.map((c) => (
              <div
                key={c.name}
                onClick={() => onNavigateTab('category', c.name)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                {/* Circular light pink/cream frame - enlarged to 60px */}
                <div className="w-[60px] h-[60px] rounded-full bg-[#FDF2F2] border border-[#FEE2E2] p-1 shadow-2xs overflow-hidden group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="text-[10.5px] font-bold text-slate-800 leading-tight">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. POPULAR NEAR YOU */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Popular Near You</h3>
            <button
              onClick={() => onNavigateTab('category')}
              className="text-xs font-bold text-[#BA181B] flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Horizontally Scrollable Visible Cards matching Image 2 */}
          <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-0.5">
            {popularProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p.name)}
                className="w-[188px] bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs shrink-0 cursor-pointer hover:border-red-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image with discount & fresh badges */}
                  <div className="w-full h-[122px] rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Red Discount Tag */}
                    <span className="absolute top-2 left-2 bg-[#BA181B] text-white text-[9.5px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                      {p.discount}
                    </span>
                    {/* Green Fresh Tag */}
                    <span className="absolute top-2 right-2 bg-[#16A34A] text-white text-[9.5px] font-medium px-2 py-0.5 rounded-md shadow-xs">
                      Fresh
                    </span>
                  </div>

                  {/* Title without truncation */}
                  <h4 className="text-[13px] font-bold text-slate-900 leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
                    {p.name}
                  </h4>

                  {/* Price in red with moderate bold */}
                  <div className="text-sm font-bold text-[#BA181B] mt-0.5">
                    {p.price}
                  </div>

                  {/* Rating & Stock on single clean line */}
                  <div className="flex items-center justify-between text-[11px] font-bold mt-1.5 mb-2.5">
                    <div className="flex items-center gap-1 text-slate-800">
                      <Star className="w-3 h-3 fill-[#FACC15] text-[#FACC15] shrink-0" />
                      <span>{p.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#16A34A] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                      <span>In Stock</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, p.name)}
                  className="w-full py-2 bg-[#BA181B] hover:bg-red-800 active:bg-red-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-white stroke-[2]" />
                  <span>Add</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 7. TODAY'S OFFERS */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Today&apos;s Offers</h3>
            <button
              onClick={() => onNavigateTab('category')}
              className="text-xs font-bold text-[#BA181B] flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Offer 1: Fresh Chicken Special Offer */}
            <div
              onClick={() => onNavigateTab('category')}
              className="bg-gradient-to-r from-[#6e0513] to-[#BA181B] text-white rounded-2xl p-3 flex items-center justify-between shadow-2xs relative overflow-hidden min-h-[96px] cursor-pointer hover:shadow-sm transition-all"
            >
              <div className="z-10 max-w-[58%]">
                <h4 className="text-[11px] font-black uppercase text-white leading-tight">
                  FRESH CHICKEN
                </h4>
                <h4 className="text-[11px] font-black uppercase text-[#FACC15] leading-tight">
                  SPECIAL OFFER
                </h4>
                <span className="bg-[#FACC15] text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded uppercase mt-1.5 inline-block shadow-2xs">
                  UP TO 15% OFF
                </span>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none">
                <img
                  src="/src/assets/images/offer_chicken_card_1790507696774.jpg"
                  alt="Fresh Chicken Offer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Offer 2: Mutton Deal */}
            <div
              onClick={() => onNavigateTab('category')}
              className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#780000] rounded-2xl p-3 flex items-center justify-between shadow-2xs relative overflow-hidden min-h-[96px] cursor-pointer hover:shadow-sm transition-all"
            >
              <div className="z-10 max-w-[58%]">
                <h4 className="text-[11px] font-black uppercase text-[#780000] leading-tight">
                  MUTTON
                </h4>
                <h4 className="text-[11px] font-black uppercase text-[#780000] leading-tight">
                  DEAL
                </h4>
                <span className="bg-[#780000] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase mt-1.5 inline-block shadow-2xs">
                  SAVE 10%
                </span>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none">
                <img
                  src="/src/assets/images/offer_mutton_card_1790507713635.jpg"
                  alt="Mutton Deal"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. FIXED BOTTOM NAVIGATION BAR */}
      <div className="bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shadow-md">
        {/* HOME */}
        <button
          onClick={() => onNavigateTab('home')}
          className="flex flex-col items-center gap-0.5 text-[#BA181B] relative cursor-pointer"
        >
          <HomeIcon className="w-5 h-5 text-[#BA181B] stroke-[#BA181B] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#BA181B]">Home</span>
          <div className="w-7 h-[2.5px] bg-[#BA181B] rounded-full absolute -bottom-1.5" />
        </button>

        {/* CATEGORIES */}
        <button
          onClick={() => onNavigateTab('category')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <LayoutGrid className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Categories</span>
        </button>

        {/* ORDERS */}
        <button
          onClick={() => onNavigateTab('my_orders')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Orders</span>
        </button>

        {/* CART */}
        <button
          onClick={() => onNavigateTab('cart')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors relative cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA181B] text-white text-[9px] font-extrabold flex items-center justify-center border-1.5 border-white shadow-2xs">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium text-slate-500">Cart</span>
        </button>

        {/* PROFILE */}
        <button
          onClick={() => onNavigateTab('my_profile')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <User className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Profile</span>
        </button>
      </div>
    </div>
  );
};
