import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  ChevronDown,
  Bell,
  Search,
  ArrowRight,
  Plus,
  Minus,
  Star,
  Home,
  Grid,
  ClipboardList,
  ShoppingCart,
  User,
  Share2,
  Leaf,
  Check,
  Flame,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';
import { useCart } from '../../context/CartContext';
import { LocationSelectModal } from '../common/LocationSelectModal';
import { LocationData } from '../../types/location';

interface HomeScreenProps {
  onNavigateTab: (tab: string, categoryName?: string) => void;
  onSelectProduct: (productName: string) => void;
  userLocation?: LocationData;
  onUpdateLocation?: (loc: LocationData) => void;
  onOpenMapPicker?: () => void;
  onAddNewAddress?: () => void;
}

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  tagline?: string;
  badgeText?: string;
  image: string;
  targetCategory: string;
  targetCategoryName: string;
  backgroundColor?: string;
  buttonText?: string;
  isActive: boolean;
}

interface FlashDealItem {
  id: string;
  title: string;
  productName: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice: number;
  discountPercentage: string;
  image: string;
  stockLeft: number;
  totalStock: number;
  endsInMinutes: number;
  unit: string;
  isActive: boolean;
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'ban_1',
    title: '70 MINUTES',
    subtitle: 'OR FREE',
    tagline: 'Fresh meat delivered to your doorstep.',
    badgeText: 'Fresh & Safe',
    image: '/src/assets/images/hero_banner_meat_1790507616083.jpg',
    targetCategory: 'mutton',
    targetCategoryName: 'Mutton',
    backgroundColor: 'from-[#6e0513] via-[#8c0818] to-[#48020b]',
    buttonText: 'Order Now',
    isActive: true,
  },
  {
    id: 'ban_2',
    title: 'FRESH CATCH',
    subtitle: 'SEA & RIVER FISH',
    tagline: 'Bengali cut Rohu, Surmai steaks & Pomfret cleaned fresh.',
    badgeText: 'Catch of Day',
    image: '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
    targetCategory: 'fish',
    targetCategoryName: 'Fish',
    backgroundColor: 'from-[#0e3b43] via-[#155e75] to-[#082f49]',
    buttonText: 'Explore Fish',
    isActive: true,
  },
  {
    id: 'ban_3',
    title: 'JUICY CHICKEN',
    subtitle: 'FLAT ₹100 OFF',
    tagline: 'Farm-fresh curry cuts, drumsticks & tender breast fillets.',
    badgeText: 'Top Choice',
    image: '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
    targetCategory: 'chicken',
    targetCategoryName: 'Chicken',
    backgroundColor: 'from-[#7c2d12] via-[#9a3412] to-[#431407]',
    buttonText: 'Order Chicken',
    isActive: true,
  },
  {
    id: 'ban_4',
    title: 'READY TO GRILL',
    subtitle: 'KEBABS & TIKKA',
    tagline: 'Marinated Malai Tikka & Seekh kebabs ready in 8 mins.',
    badgeText: 'Chef Special',
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
    targetCategory: 'ready-to-cook',
    targetCategoryName: 'Ready to Cook',
    backgroundColor: 'from-[#312e81] via-[#3730a3] to-[#1e1b4b]',
    buttonText: 'View Kebabs',
    isActive: true,
  },
];

const DEFAULT_FLASH_DEALS: FlashDealItem[] = [
  {
    id: 'fd_1',
    title: 'Flash Deal - Fresh Rohu Fish Steak',
    productName: 'Fresh Rohu Fish Cut (Steak)',
    category: 'Fish',
    categoryId: 'fish',
    price: 260,
    originalPrice: 320,
    discountPercentage: '19% OFF',
    image: '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
    stockLeft: 12,
    totalStock: 30,
    endsInMinutes: 120,
    unit: '1 KG',
    isActive: true,
  },
  {
    id: 'fd_2',
    title: 'Weekend Flash - Fresh Mutton Boneless',
    productName: 'Royal Mutton Boneless Cubes',
    category: 'Mutton',
    categoryId: 'mutton',
    price: 680,
    originalPrice: 780,
    discountPercentage: '13% OFF',
    image: '/src/assets/images/mutton_boneless_wide_1790508301717.jpg',
    stockLeft: 8,
    totalStock: 25,
    endsInMinutes: 90,
    unit: '1 KG',
    isActive: true,
  },
  {
    id: 'fd_3',
    title: 'Lightning Deal - Chicken Curry Cut',
    productName: 'Farm Fresh Chicken Curry Cut',
    category: 'Chicken',
    categoryId: 'chicken',
    price: 390,
    originalPrice: 460,
    discountPercentage: '15% OFF',
    image: '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
    stockLeft: 18,
    totalStock: 40,
    endsInMinutes: 150,
    unit: '1 KG',
    isActive: true,
  },
  {
    id: 'fd_4',
    title: 'Jumbo Prawns Flash Promo',
    productName: 'Fresh Sea Tiger Prawns (Cleaned)',
    category: 'Prawns & Seafood',
    categoryId: 'prawns',
    price: 690,
    originalPrice: 830,
    discountPercentage: '17% OFF',
    image: '/src/assets/images/cat_prawns_seafood_1790508815698.jpg',
    stockLeft: 6,
    totalStock: 20,
    endsInMinutes: 60,
    unit: '500G',
    isActive: true,
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onSelectProduct,
  userLocation,
  onUpdateLocation,
  onOpenMapPicker,
  onAddNewAddress,
}) => {
  const { cartCount, addToCart, getItemQuantity } = useCart();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [searchVal, setSearchVal] = useState('');
  const [addedPopup, setAddedPopup] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Dynamic Banners from Admin state
  const [banners, setBanners] = useState<BannerItem[]>(() => {
    try {
      const saved = localStorage.getItem('meatghar_banners_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((b: BannerItem) => b.isActive);
        }
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_BANNERS;
  });

  // Dynamic Flash Deals from Admin state
  const [flashDeals, setFlashDeals] = useState<FlashDealItem[]>(() => {
    try {
      const saved = localStorage.getItem('meatghar_flash_deals_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((d: FlashDealItem) => d.isActive);
        }
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_FLASH_DEALS;
  });

  // Listen for storage updates if admin modifies banners/deals in parallel
  useEffect(() => {
    const handleStorage = () => {
      try {
        const savedBanners = localStorage.getItem('meatghar_banners_v1');
        if (savedBanners) {
          const parsed = JSON.parse(savedBanners);
          setBanners(parsed.filter((b: BannerItem) => b.isActive));
        }
        const savedDeals = localStorage.getItem('meatghar_flash_deals_v1');
        if (savedDeals) {
          const parsed = JSON.parse(savedDeals);
          setFlashDeals(parsed.filter((d: FlashDealItem) => d.isActive));
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleNextBanner = () => {
    if (banners.length <= 1) return;
    setSlideDirection(1);
    setActiveBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrevBanner = () => {
    if (banners.length <= 1) return;
    setSlideDirection(-1);
    setActiveBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Auto-play sliding banner rotation
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setSlideDirection(1);
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 45) {
      // Swiped Left -> Next
      handleNextBanner();
    } else if (diff < -45) {
      // Swiped Right -> Prev
      handlePrevBanner();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const activeBanner = banners[activeBannerIndex] || banners[0] || DEFAULT_BANNERS[0];

  const handleBannerClick = (banner: BannerItem) => {
    const target = banner.targetCategoryName || banner.targetCategory || 'Chicken';
    onNavigateTab('category', target);
  };

  const categories = [
    {
      id: 'chicken',
      name: 'Chicken',
      image: '/src/assets/images/cat_chicken_1790504356265.jpg',
    },
    {
      id: 'mutton',
      name: 'Mutton',
      image: '/src/assets/images/cat_mutton_1790504374485.jpg',
    },
    {
      id: 'fish',
      name: 'Fish',
      image: '/src/assets/images/cat_fish_1790504389877.jpg',
    },
    {
      id: 'eggs',
      name: 'Eggs',
      image: '/src/assets/images/cat_eggs_1790504403080.jpg',
    },
    {
      id: 'ready_to_cook',
      name: 'Ready to Cook',
      image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
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
      image: '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
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
      image: '/src/assets/images/mutton_boneless_wide_1790508301717.jpg',
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
      image: '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
    },
  ];

  const handleAddToCart = (e: React.MouseEvent, prod: { id: string; name: string; price: number; originalPrice?: number; image: string }) => {
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
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce border border-white/20">
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
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-start gap-1.5 cursor-pointer border border-transparent hover:border-[#BA181B]/40 rounded-xl px-1.5 py-0.5 transition-all duration-150 active:scale-95 group"
          >
            <MapPin className="w-4 h-4 text-[#BA181B] shrink-0 mt-0.5 stroke-[2] group-hover:scale-110 transition-transform" />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[12.5px] font-extrabold text-slate-900 tracking-tight leading-none line-clamp-1 max-w-[130px]">
                  {userLocation?.suburb || userLocation?.city || 'Sector 10, Noida'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#BA181B] stroke-[2]" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">
                Change location
              </p>
            </div>
          </div>

          {/* Right: Notifications */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('notifications')}
              className="relative p-1.5 rounded-xl hover:bg-red-50 text-[#BA181B] transition-colors cursor-pointer border border-slate-100"
            >
              <Bell className="w-5 h-5 text-[#BA181B] stroke-[2]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#BA181B] border border-white" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div
          onClick={() => onNavigateTab('search')}
          className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl cursor-pointer hover:border-[#BA181B]/50 transition-colors shadow-2xs"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            readOnly
            value={searchVal}
            placeholder="Search chicken, mutton, fish, kebabs..."
            className="w-full text-xs font-normal text-slate-800 placeholder-slate-400 bg-transparent outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* 2. SCROLLABLE MAIN CONTENT AREA ONLY */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-4">
        {/* ========================================================================= */}
        {/* HERO PROMOTIONAL SLIDING BANNER (Dynamic from Admin with swipe animations) */}
        {/* ========================================================================= */}
        <div
          className="px-4 relative group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative min-h-[165px] rounded-2xl overflow-hidden shadow-md">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeBanner.id || activeBannerIndex}
                initial={{ opacity: 0, x: slideDirection > 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection > 0 ? -80 : 80 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.25 }}
                onClick={() => handleBannerClick(activeBanner)}
                className={`w-full min-h-[165px] bg-gradient-to-r ${
                  activeBanner.backgroundColor || 'from-[#6e0513] via-[#8c0818] to-[#48020b]'
                } text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer transform active:scale-[0.99] transition-transform`}
              >
                {/* Left Content */}
                <div className="relative z-10 max-w-[210px] space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center relative shrink-0">
                      <div className="w-0.5 h-1.5 bg-white absolute top-1 rounded-full" />
                      <div className="w-1.5 h-0.5 bg-white absolute right-1 rounded-full" />
                      <div className="w-1 h-0.5 bg-white absolute -top-1 rounded-xs" />
                    </div>
                    <span className="text-[17px] font-black text-white tracking-tight leading-none uppercase">
                      {activeBanner.title}
                    </span>
                  </div>

                  <div className="text-[20px] font-black text-[#FACC15] tracking-tight leading-none uppercase">
                    {activeBanner.subtitle}
                  </div>

                  <p className="text-[11px] text-white/95 font-medium leading-snug pt-0.5 line-clamp-2">
                    {activeBanner.tagline || 'Fresh meat delivered to your doorstep.'}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBannerClick(activeBanner);
                    }}
                    className="mt-2 py-1.5 px-3.5 bg-[#BA181B] hover:bg-red-800 active:scale-95 border border-white/20 text-white font-bold text-xs rounded-full inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                  >
                    <span>{activeBanner.buttonText || 'Order Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  </button>
                </div>

                {/* Right Fresh Meat Photography */}
                <div className="absolute top-0 right-0 w-[48%] h-full pointer-events-none overflow-hidden">
                  <img
                    src={activeBanner.image}
                    alt={activeBanner.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/src/assets/images/hero_banner_meat_1790507616083.jpg';
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  {activeBanner.badgeText && (
                    <div className="absolute top-2.5 right-2.5 bg-[#BA181B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1 shadow-sm">
                      <Leaf className="w-2.5 h-2.5 text-white fill-white" />
                      <span>{activeBanner.badgeText}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Subtle Left / Right arrows for easy navigation */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevBanner();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextBanner();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                >
                  <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
                </button>
              </>
            )}
          </div>

          {/* Carousel Indicator Dots */}
          {banners.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {banners.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => {
                    setSlideDirection(idx > activeBannerIndex ? 1 : -1);
                    setActiveBannerIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeBannerIndex === idx ? 'bg-[#BA181B] w-5' : 'bg-slate-300 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 5 CATEGORIES ROW */}
        {/* ========================================================================= */}
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
                  <img
                    src={c.image}
                    alt={c.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80';
                    }}
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

        {/* ========================================================================= */}
        {/* ⚡ FLASH DEALS SECTION (DYNAMIC FROM ADMIN PANEL) */}
        {/* ========================================================================= */}
        {flashDeals.length > 0 && (
          <div className="px-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <Flame className="w-4 h-4 fill-red-600 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#111827] tracking-tight flex items-center gap-1">
                    <span>⚡ Flash Deals</span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10.5px] font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 stroke-[2.5]" />
                <span>Limited Stock</span>
              </div>
            </div>

            {/* Horizontal Scrolling Flash Deals Cards */}
            <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-1">
              {flashDeals.map((deal) => {
                const percentClaimed = Math.min(
                  100,
                  Math.round(((deal.totalStock - deal.stockLeft) / deal.totalStock) * 100)
                );

                return (
                  <div
                    key={deal.id}
                    onClick={() => onNavigateTab('category', deal.category)}
                    className="w-[210px] shrink-0 bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full h-[110px] rounded-xl overflow-hidden bg-slate-100 relative mb-2">
                        <img
                          src={deal.image}
                          alt={deal.productName}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-white" />
                          <span>{deal.discountPercentage}</span>
                        </span>
                        <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-amber-300 text-[8.5px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{deal.endsInMinutes}m left</span>
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {deal.productName}
                      </h3>

                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-sm font-black text-red-600">₹{deal.price}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{deal.originalPrice}</span>
                        <span className="text-[9.5px] text-slate-400">/{deal.unit}</span>
                      </div>

                      {/* Stock Bar */}
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>Only {deal.stockLeft} left</span>
                          <span>{percentClaimed}% sold</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                            style={{ width: `${percentClaimed}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: deal.id,
                          name: deal.productName,
                          price: deal.price,
                          originalPrice: deal.originalPrice,
                          image: deal.image,
                          quantity: 1,
                        });
                        setAddedPopup(deal.productName);
                        setTimeout(() => setAddedPopup(null), 1800);
                      }}
                      className="mt-2.5 w-full py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-[10.5px] rounded-xl flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Add Deal</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* POPULAR PRODUCTS */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-black text-[#111827] tracking-tight">Popular Today</h2>
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
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p.name)}
                  className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-[115px] rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80';
                        }}
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

                  <div className="flex flex-col gap-1.5 mt-2.5">
                    <button
                      onClick={(e) => handleAddToCart(e, p)}
                      className="w-full py-2 rounded-xl bg-[#A8071A] hover:bg-red-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
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
          onClick={() => onNavigateTab('orders')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Orders</span>
        </button>

        <button
          onClick={() => onNavigateTab('share')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <Share2 className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-medium text-slate-500">Share</span>
        </button>
      </div>

      {/* Interactive Location Selection Modal */}
      {isLocationModalOpen && (
        <LocationSelectModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={
            userLocation || {
              address: 'Flat No. 402, Block B, Green Valley Heights, MG Road, Sector 10, Noida, UP - 201301',
              lat: 28.5900,
              lng: 77.3300,
              suburb: 'Sector 10',
              city: 'Noida',
              state: 'Uttar Pradesh',
              postcode: '201301',
            }
          }
          onSelectLocation={(loc) => {
            if (onUpdateLocation) onUpdateLocation(loc);
          }}
        />
      )}
    </div>
  );
};
