import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  ShoppingBag,
  Bell,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  Flame,
  Home,
  Grid,
  Zap,
  ShoppingBag as OrderIcon,
  User,
  RotateCcw,
} from 'lucide-react';
import { GreenTickLottie } from '../GreenTickLottie';

interface HomeScreenPreviewProps {
  userName: string;
  userPhone: string;
  onReset: () => void;
}

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Rich Mutton Curry Cut (Bone-In)',
    weight: '500g',
    pieces: '12-16 Pieces',
    price: 499,
    originalPrice: 599,
    rating: 4.8,
    reviews: 240,
    category: 'Mutton',
    tag: 'Bestseller',
    image: '/src/assets/images/meat_onboarding_1_1790501345494.jpg',
  },
  {
    id: 'p2',
    name: 'Fresh Chicken Breast (Boneless)',
    weight: '500g',
    pieces: '2-4 Tender Fillets',
    price: 249,
    originalPrice: 299,
    rating: 4.9,
    reviews: 512,
    category: 'Chicken',
    tag: '70 Min Express',
    image: '/src/assets/images/meat_onboarding_2_1790501365087.jpg',
  },
  {
    id: 'p3',
    name: 'Prime Ribeye Steak & Ribs',
    weight: '400g',
    pieces: 'Custom Thick Cut',
    price: 699,
    originalPrice: 799,
    rating: 4.9,
    reviews: 180,
    category: 'Steaks',
    tag: 'Chef Choice',
    image: '/src/assets/images/meat_bottom_platter_1790501395172.jpg',
  },
];

export const HomeScreenPreview: React.FC<HomeScreenPreviewProps> = ({
  userName,
  userPhone,
  onReset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({
    p1: 1,
  });

  // 70 Minute Live Countdown Simulation
  const [minutes, setMinutes] = useState(68);
  const [seconds, setSeconds] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          setMinutes((m) => (m > 0 ? m - 1 : 69));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateCart = (id: string, delta: number) => {
    setCartItems((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalCartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  const categories = ['All', 'Mutton', 'Chicken', 'Steaks', 'Seafood', 'Ready to Cook'];

  const filteredProducts =
    selectedCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-[#A8071A] text-white px-4 pt-3 pb-4 shadow-md rounded-b-2xl">
        <div className="flex items-center justify-between mb-3">
          {/* Location Delivery Selector */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[11px] text-white/80 font-medium">
                <span>Deliver to</span>
                <ChevronRight className="w-3 h-3" />
              </div>
              <p className="text-xs font-bold text-white tracking-wide truncate max-w-[170px]">
                Home - MG Road, Sector 14
              </p>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative">
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#A8071A]" />
            </button>
            <div className="p-1 rounded-full bg-white/20 border border-white/30 text-white font-bold text-xs w-7 h-7 flex items-center justify-center">
              {userName ? userName.charAt(0).toUpperCase() : 'R'}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search mutton, chicken breast, steaks..."
            className="w-full py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-800 bg-white rounded-xl shadow-inner placeholder-slate-400 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar">
        {/* Welcome Toast Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <GreenTickLottie className="w-6 h-6 shrink-0" loop={true} />
            <div>
              <p className="text-xs font-bold text-emerald-950">
                Welcome, {userName || 'Rahul Sharma'}!
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Account verified (+91 {userPhone || '98765 43210'})
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="text-[10px] font-bold text-[#A8071A] hover:underline flex items-center gap-1 shrink-0 bg-white px-2 py-1 rounded-md border border-slate-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset UI</span>
          </button>
        </div>

        {/* Live 70-Minute Delivery Countdown Banner */}
        <div className="bg-gradient-to-r from-red-900 via-[#A8071A] to-red-800 text-white rounded-2xl p-3.5 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-200 uppercase tracking-wider mb-0.5">
                <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>70-Min Express Delivery</span>
              </div>
              <h3 className="text-sm font-extrabold text-white">
                Fresh Cut Guarantee
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Delivered in 70 mins or it's FREE!
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 border border-white/20 text-center shrink-0">
              <div className="text-[9px] font-semibold text-red-100 uppercase">
                Guaranteed In
              </div>
              <div className="text-sm font-black font-mono tracking-wider text-white">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Explore Fresh Categories
            </h3>
            <span className="text-[11px] font-semibold text-[#A8071A]">View All</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#A8071A] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards List */}
        <div className="space-y-3 pb-16">
          {filteredProducts.map((p) => {
            const count = cartItems[p.id] || 0;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex gap-3 relative overflow-hidden transition-all hover:border-red-200"
              >
                {/* Product Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-[#A8071A] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-2xs">
                    {p.tag}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {p.weight} &bull; {p.pieces}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Price */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-extrabold text-[#A8071A]">
                        ₹{p.price}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{p.originalPrice}
                      </span>
                    </div>

                    {/* Add Button / Counter */}
                    {count === 0 ? (
                      <button
                        onClick={() => updateCart(p.id, 1)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#A8071A] border border-red-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-[#A8071A] text-white rounded-lg px-2 py-1 shadow-sm">
                        <button
                          onClick={() => updateCart(p.id, -1)}
                          className="hover:text-red-200 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-3 text-center">
                          {count}
                        </span>
                        <button
                          onClick={() => updateCart(p.id, 1)}
                          className="hover:text-red-200 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Floating Bar & Tab Bar */}
      {totalCartCount > 0 && (
        <div className="absolute bottom-14 left-3 right-3 z-30 bg-[#A8071A] text-white rounded-xl p-3 shadow-xl flex items-center justify-between animate-bounce-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
              {totalCartCount}
            </div>
            <div>
              <p className="text-xs font-extrabold">Items Added to Cart</p>
              <p className="text-[10px] font-medium text-white/80">
                70-Min Express Delivery Ready
              </p>
            </div>
          </div>
          <button className="bg-white text-[#A8071A] font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow-sm hover:bg-red-50 transition-colors">
            View Cart &rarr;
          </button>
        </div>
      )}

      {/* Bottom App Navigation Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around z-20">
        <button className="flex flex-col items-center gap-0.5 text-[#A8071A]">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Categories</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <Zap className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Express</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <OrderIcon className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Account</span>
        </button>
      </div>
    </div>
  );
};
