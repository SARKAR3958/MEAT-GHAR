import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  Clock,
  Star,
  Plus,
  Minus,
  Home as HomeIcon,
  LayoutGrid,
  ClipboardList,
  ShoppingCart,
  User,
  Share2,
} from 'lucide-react';
import { ALL_PRODUCTS, CategoryProduct } from './CategoryListScreen';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { AppImage } from '../common/AppImage';
import { useCart } from '../../context/CartContext';

interface SearchScreenProps {
  onBack: () => void;
  onSelectProduct: (productName: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onBack,
  onSelectProduct,
  onNavigateTab,
}) => {
  const { cartCount, addToCart, updateQuantity, getItemQuantity } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'chicken',
    'mutton',
    'fish',
    'eggs',
    'tikka',
  ]);

  const suggestedSearches = [
    'Chicken Curry Cut',
    'Mutton Boneless',
    'Fresh Rohu Fish',
    'Tiger Prawns',
    'Farm Eggs',
  ];

  // Dynamic search filter across all products
  const filteredProducts = useMemo(() => {
    const rawTerm = searchTerm.trim().toLowerCase();
    if (!rawTerm) {
      // Default recommended picks when search is empty
      return ALL_PRODUCTS.slice(0, 8);
    }

    const tokens = rawTerm.split(/\s+/).filter(Boolean);

    return ALL_PRODUCTS.filter((p) => {
      const name = p.name.toLowerCase();
      const cat = p.categoryId.toLowerCase();

      // Check direct inclusion
      if (name.includes(rawTerm) || cat.includes(rawTerm)) return true;

      // Handle category synonyms
      const matchesCategory =
        (rawTerm === 'fish' && cat === 'fish') ||
        (rawTerm === 'chicken' && cat === 'chicken') ||
        (rawTerm === 'mutton' && cat === 'mutton') ||
        (rawTerm.startsWith('egg') && cat === 'eggs') ||
        (rawTerm.includes('prawn') && (cat === 'prawns' || name.includes('prawn'))) ||
        (rawTerm.includes('seafood') && (cat === 'prawns' || cat === 'fish')) ||
        (rawTerm.includes('tikka') && (cat === 'ready-to-cook' || cat === 'marinades')) ||
        (rawTerm.includes('kebab') && (cat === 'ready-to-cook' || cat === 'marinades'));

      if (matchesCategory) return true;

      // Check if every token matches name or category
      return tokens.every(
        (t) =>
          name.includes(t) ||
          cat.includes(t) ||
          (t === 'egg' && cat === 'eggs') ||
          (t === 'cut' && name.includes('cut')) ||
          (t === 'curry' && name.includes('curry')) ||
          (t === 'boneless' && name.includes('boneless'))
      );
    });
  }, [searchTerm]);

  const handleSelectSearch = (term: string) => {
    setSearchTerm(term);
    if (!recentSearches.includes(term.toLowerCase())) {
      setRecentSearches((prev) => [term.toLowerCase(), ...prev.slice(0, 4)]);
    }
  };

  const handleAddQuantity = (product: CategoryProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const priceNum = parseInt(product.price.replace(/[^\d]/g, ''), 10) || 400;
    addToCart({
      id: product.id,
      name: product.name,
      price: priceNum,
      image: product.image,
      category: product.categoryId,
      quantity: 1,
    });
  };

  const handleRemoveQuantity = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(productId, -1);
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Top Header Bar */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-1 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="text-base font-black text-slate-900 leading-tight">Search</h2>
          </div>

          {/* Meat Ghar Header Branding */}
          <HeaderMeatGharLogo />
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-slate-100/90 rounded-xl px-3 py-2 border border-slate-200/90 focus-within:border-[#BA181B] focus-within:bg-white transition-all shadow-2xs">
            <Search className="w-4 h-4 text-[#BA181B] shrink-0 mr-2 stroke-[2.2]" />
            <input
              type="text"
              name="search_query_no_autofill"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chicken, mutton, fish, eggs..."
              className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Search Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-20">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Searches</span>
              </div>
              <button
                onClick={() => setRecentSearches([])}
                className="text-[11px] font-bold text-[#BA181B] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSelectSearch(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                    searchTerm.toLowerCase() === s.toLowerCase()
                      ? 'bg-[#BA181B] text-white shadow-2xs'
                      : 'bg-red-50/70 border border-red-100 text-slate-700 hover:bg-red-100'
                  }`}
                >
                  <Clock className={`w-3 h-3 ${searchTerm.toLowerCase() === s.toLowerCase() ? 'text-white' : 'text-red-400'}`} />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Searches */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <span>✨ Suggested Searches</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {suggestedSearches.map((s) => (
              <button
                key={s}
                onClick={() => handleSelectSearch(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  searchTerm.toLowerCase() === s.toLowerCase()
                    ? 'bg-[#BA181B] text-white shadow-2xs'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Search className={`w-3 h-3 ${searchTerm.toLowerCase() === s.toLowerCase() ? 'text-white' : 'text-slate-400'}`} />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Heading */}
        <div>
          <div className="flex items-center justify-between mb-2.5 pt-1">
            <h3 className="text-xs font-extrabold text-slate-900">
              {searchTerm ? `Results for "${searchTerm}"` : 'Popular Recommendations'}
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Results Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((p) => {
                const qty = getItemQuantity(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p.name)}
                    className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs hover:border-red-300 transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Product Image with Badges */}
                      <div className="w-full h-[112px] rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                        <AppImage
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        {p.discount && (
                          <span className="absolute top-1.5 left-1.5 bg-[#BA181B] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-2xs">
                            {p.discount}
                          </span>
                        )}
                        <span className="absolute top-1.5 right-1.5 bg-[#16A34A] text-white text-[9px] font-medium px-1.5 py-0.5 rounded shadow-2xs">
                          Fresh
                        </span>
                      </div>

                      {/* Product Name */}
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                        {p.name}
                      </h4>

                      {/* Price in Red with moderate bold */}
                      <div className="text-xs font-bold text-[#BA181B] mt-0.5">
                        {p.price}
                      </div>

                      {/* Rating & Stock */}
                      <div className="flex items-center justify-between text-[10px] font-bold mt-1 mb-2">
                        <div className="flex items-center gap-1 text-slate-800">
                          <Star className="w-2.5 h-2.5 fill-[#FACC15] text-[#FACC15] shrink-0" />
                          <span>{p.rating}</span>
                        </div>
                        <span className="text-[#16A34A] font-semibold text-[9px]">
                          ● In Stock
                        </span>
                      </div>
                    </div>

                    {/* Quantity or Add Button */}
                    <div className="flex flex-col gap-1.5 mt-auto">
                      <button
                        onClick={() => onSelectProduct(p.name)}
                        className="w-full py-2 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3 h-3 text-white stroke-[2.5]" />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={() => onSelectProduct(p.name)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                      >
                        <ShoppingCart className="w-3 h-3 text-white stroke-[2.5]" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State when no results found */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center shadow-2xs my-2">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#BA181B] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 stroke-[2]" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800">
                No products found for "{searchTerm}"
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1 max-w-[260px] mx-auto">
                We couldn't find matching meat or seafood cuts. Try checking your spelling or search another keyword.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Chicken', 'Mutton', 'Fish', 'Eggs', 'Kebab'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectSearch(tag)}
                    className="px-3 py-1 bg-red-50 hover:bg-red-100 text-[#BA181B] rounded-full text-xs font-bold transition-colors cursor-pointer border border-red-200"
                  >
                    Search {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shadow-md shrink-0">
        <button
          onClick={() => onNavigateTab('home')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <HomeIcon className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Home</span>
        </button>

        <button
          onClick={() => onNavigateTab('categories')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <LayoutGrid className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Categories</span>
        </button>

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
          <span className="text-[10px] font-semibold text-slate-500">Cart</span>
        </button>

        <button
          onClick={() => onNavigateTab('my_orders')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Orders</span>
        </button>

        <button
          onClick={() => onNavigateTab('share')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <Share2 className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Share</span>
        </button>
      </div>
    </div>
  );
};
