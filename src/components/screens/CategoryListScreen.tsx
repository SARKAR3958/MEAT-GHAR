import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Home as HomeIcon,
  LayoutGrid,
  ClipboardList,
  User,
  Share2,
  SlidersHorizontal,
  ChevronRight,
  Leaf,
  Zap,
} from 'lucide-react';
import { AppImage } from '../common/AppImage';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import { getCleanProductImage } from './HomeScreen';

interface CategoryListScreenProps {
  initialCategory?: string | null;
  fromOrigin?: 'home' | 'category_manual';
  onBack: () => void;
  onSelectProduct: (productName: string) => void;
  onNavigateTab: (tab: string) => void;
}

export interface CategoryInfo {
  id: string;
  name: string;
  itemCount: number;
  image: string;
}

export interface CategoryProduct {
  id: string;
  categoryId: string;
  name: string;
  price: string;
  discount?: string;
  rating: string;
  inStock: boolean;
  image: string;
}

const ALL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'chicken',
    name: 'Chicken',
    itemCount: 6,
    image: '/src/assets/images/cat_chicken_1790504356265.jpg',
  },
  {
    id: 'mutton',
    name: 'Mutton',
    itemCount: 5,
    image: '/src/assets/images/cat_mutton_1790504374485.jpg',
  },
  {
    id: 'fish',
    name: 'Fish',
    itemCount: 5,
    image: '/src/assets/images/cat_fish_1790504389877.jpg',
  },
  {
    id: 'eggs',
    name: 'Eggs',
    itemCount: 4,
    image: '/src/assets/images/cat_eggs_1790504403080.jpg',
  },
  {
    id: 'ready-to-cook',
    name: 'Ready to Cook',
    itemCount: 5,
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  },
  {
    id: 'special-cuts',
    name: 'Special Cuts',
    itemCount: 4,
    image: '/src/assets/images/cat_special_cuts_1790507586236.jpg',
  },
  {
    id: 'prawns',
    name: 'Prawns & Seafood',
    itemCount: 4,
    image: '/src/assets/images/cat_prawns_seafood_1790508815698.jpg',
  },
  {
    id: 'cold-cuts',
    name: 'Cold Cuts',
    itemCount: 4,
    image: '/src/assets/images/cat_cold_cuts_1790508827963.jpg',
  },
  {
    id: 'marinades',
    name: 'Marinades & Kebabs',
    itemCount: 4,
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  },
];

export const ALL_PRODUCTS: CategoryProduct[] = [
  // Chicken
  {
    id: 'ch-1',
    categoryId: 'chicken',
    name: 'Fresh Chicken Curry Cut',
    price: '₹420 / KG',
    discount: '10% OFF',
    rating: '4.8 (1.2k)',
    inStock: true,
    image: '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
  },
  {
    id: 'ch-2',
    categoryId: 'chicken',
    name: 'Fresh Chicken Breast Boneless',
    price: '₹480 / KG',
    discount: '5% OFF',
    rating: '4.9 (820)',
    inStock: true,
    image: '/src/assets/images/cat_chicken_1790504356265.jpg',
  },
  {
    id: 'ch-3',
    categoryId: 'chicken',
    name: 'Tender Chicken Drumsticks',
    price: '₹390 / KG',
    discount: '8% OFF',
    rating: '4.7 (640)',
    inStock: true,
    image: '/src/assets/images/offer_chicken_card_1790507696774.jpg',
  },
  {
    id: 'ch-4',
    categoryId: 'chicken',
    name: 'Fresh Chicken Wings (Skin-On)',
    price: '₹340 / KG',
    discount: '12% OFF',
    rating: '4.6 (410)',
    inStock: true,
    image: '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
  },
  {
    id: 'ch-5',
    categoryId: 'chicken',
    name: 'Minced Chicken Keema',
    price: '₹460 / KG',
    rating: '4.8 (390)',
    inStock: true,
    image: '/src/assets/images/cat_chicken_1790504356265.jpg',
  },
  {
    id: 'ch-6',
    categoryId: 'chicken',
    name: 'Boneless Chicken Thighs',
    price: '₹510 / KG',
    discount: '6% OFF',
    rating: '4.8 (510)',
    inStock: true,
    image: '/src/assets/images/curry_cut_chicken_1790507633294.jpg',
  },

  // Mutton
  {
    id: 'mu-1',
    categoryId: 'mutton',
    name: 'Fresh Mutton Boneless',
    price: '₹680 / KG',
    discount: '5% OFF',
    rating: '4.6 (856)',
    inStock: true,
    image: '/src/assets/images/mutton_boneless_wide_1790508301717.jpg',
  },
  {
    id: 'mu-2',
    categoryId: 'mutton',
    name: 'Rich Mutton Curry Cut (Bone-In)',
    price: '₹620 / KG',
    discount: '10% OFF',
    rating: '4.8 (940)',
    inStock: true,
    image: '/src/assets/images/cat_mutton_1790504374485.jpg',
  },
  {
    id: 'mu-3',
    categoryId: 'mutton',
    name: 'Fresh Mutton Chops & Ribs',
    price: '₹740 / KG',
    rating: '4.7 (380)',
    inStock: true,
    image: '/src/assets/images/offer_mutton_card_1790507713635.jpg',
  },
  {
    id: 'mu-4',
    categoryId: 'mutton',
    name: 'Fine Mutton Keema (Minced)',
    price: '₹710 / KG',
    discount: '5% OFF',
    rating: '4.9 (420)',
    inStock: true,
    image: '/src/assets/images/mutton_boneless_cubes_1790507651522.jpg',
  },
  {
    id: 'mu-5',
    categoryId: 'mutton',
    name: 'Tender Goat Biryani Cut',
    price: '₹650 / KG',
    rating: '4.8 (610)',
    inStock: true,
    image: '/src/assets/images/mutton_boneless_wide_1790508301717.jpg',
  },

  // Fish
  {
    id: 'fi-1',
    categoryId: 'fish',
    name: 'Fresh Rohu Fish (Cleaned)',
    price: '₹260 / KG',
    discount: '8% OFF',
    rating: '4.7 (632)',
    inStock: true,
    image: '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
  },
  {
    id: 'fi-2',
    categoryId: 'fish',
    name: 'White Pomfret (Cleaned & Gutted)',
    price: '₹790 / KG',
    discount: '5% OFF',
    rating: '4.9 (512)',
    inStock: true,
    image: '/src/assets/images/cat_fish_1790504389877.jpg',
  },
  {
    id: 'fi-3',
    categoryId: 'fish',
    name: 'Surmai Steaks (King Fish)',
    price: '₹850 / KG',
    rating: '4.8 (340)',
    inStock: true,
    image: '/src/assets/images/product_rohu_fish_1790507600370.jpg',
  },
  {
    id: 'fi-4',
    categoryId: 'fish',
    name: 'Fresh Catla Bengalee Cut',
    price: '₹280 / KG',
    discount: '10% OFF',
    rating: '4.6 (430)',
    inStock: true,
    image: '/src/assets/images/cat_fish_1790504389877.jpg',
  },
  {
    id: 'fi-5',
    categoryId: 'fish',
    name: 'Boneless Basa Fish Fillets',
    price: '₹420 / KG',
    rating: '4.7 (290)',
    inStock: true,
    image: '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
  },

  // Eggs
  {
    id: 'eg-1',
    categoryId: 'eggs',
    name: 'Classic White Farm Eggs (Pack of 30)',
    price: '₹210 / PACK',
    discount: '15% OFF',
    rating: '4.9 (1.8k)',
    inStock: true,
    image: '/src/assets/images/cat_eggs_1790504403080.jpg',
  },
  {
    id: 'eg-2',
    categoryId: 'eggs',
    name: 'Organic Brown Eggs (Pack of 12)',
    price: '₹140 / PACK',
    discount: '5% OFF',
    rating: '4.8 (890)',
    inStock: true,
    image: '/src/assets/images/cat_eggs_1790504403080.jpg',
  },
  {
    id: 'eg-3',
    categoryId: 'eggs',
    name: 'Free Range Country Eggs (Pack of 6)',
    price: '₹95 / PACK',
    rating: '4.9 (540)',
    inStock: true,
    image: '/src/assets/images/cat_eggs_1790504403080.jpg',
  },
  {
    id: 'eg-4',
    categoryId: 'eggs',
    name: 'Fresh Quail Eggs (Pack of 24)',
    price: '₹160 / PACK',
    rating: '4.7 (210)',
    inStock: true,
    image: '/src/assets/images/cat_eggs_1790504403080.jpg',
  },

  // Ready to Cook
  {
    id: 'rc-1',
    categoryId: 'ready-to-cook',
    name: 'Chicken Malai Tikka (Marinated)',
    price: '₹320 / 400G',
    discount: '10% OFF',
    rating: '4.8 (980)',
    inStock: true,
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  },
  {
    id: 'rc-2',
    categoryId: 'ready-to-cook',
    name: 'Spicy Mutton Seekh Kebab (4 Pcs)',
    price: '₹360 / PACK',
    discount: '5% OFF',
    rating: '4.9 (810)',
    inStock: true,
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  },
  {
    id: 'rc-3',
    categoryId: 'ready-to-cook',
    name: 'Amritsari Fish Fry Cut',
    price: '₹380 / 500G',
    rating: '4.7 (430)',
    inStock: true,
    image: '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
  },
  {
    id: 'rc-4',
    categoryId: 'ready-to-cook',
    name: 'Peri Peri Chicken Wings (Raw & Spiced)',
    price: '₹290 / 450G',
    discount: '8% OFF',
    rating: '4.8 (640)',
    inStock: true,
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  },
  {
    id: 'rc-5',
    categoryId: 'ready-to-cook',
    name: 'Tandoori Chicken Whole Leg (2 Pcs)',
    price: '₹340 / PACK',
    rating: '4.9 (530)',
    inStock: true,
    image: '/src/assets/images/cat_chicken_1790504356265.jpg',
  },

  // Special Cuts
  {
    id: 'sc-1',
    categoryId: 'special-cuts',
    name: 'Prime Ribeye Steak Cut',
    price: '₹890 / KG',
    discount: '10% OFF',
    rating: '4.9 (620)',
    inStock: true,
    image: '/src/assets/images/cat_special_cuts_1790507586236.jpg',
  },
  {
    id: 'sc-2',
    categoryId: 'special-cuts',
    name: 'Tender Lamb Shank (Osso Buco Cut)',
    price: '₹950 / KG',
    rating: '4.8 (390)',
    inStock: true,
    image: '/src/assets/images/hero_banner_meat_1790507616083.jpg',
  },
  {
    id: 'sc-3',
    categoryId: 'special-cuts',
    name: 'Gourmet French Lamb Chops',
    price: '₹1100 / KG',
    discount: '5% OFF',
    rating: '4.9 (410)',
    inStock: true,
    image: '/src/assets/images/cat_special_cuts_1790507586236.jpg',
  },
  {
    id: 'sc-4',
    categoryId: 'special-cuts',
    name: 'Chicken Breast Supreme (Skin-On)',
    price: '₹490 / KG',
    rating: '4.7 (280)',
    inStock: true,
    image: '/src/assets/images/cat_chicken_1790504356265.jpg',
  },

  // Prawns & Seafood
  {
    id: 'pr-1',
    categoryId: 'prawns',
    name: 'Fresh Jumbo Tiger Prawns',
    price: '₹750 / 500G',
    discount: '10% OFF',
    rating: '4.9 (810)',
    inStock: true,
    image: '/src/assets/images/cat_prawns_seafood_1790508815698.jpg',
  },
  {
    id: 'pr-2',
    categoryId: 'prawns',
    name: 'Cleaned Medium White Prawns',
    price: '₹520 / 500G',
    rating: '4.8 (520)',
    inStock: true,
    image: '/src/assets/images/cat_prawns_seafood_1790508815698.jpg',
  },
  {
    id: 'pr-3',
    categoryId: 'prawns',
    name: 'Fresh Crab Meat',
    price: '₹640 / 400G',
    rating: '4.7 (310)',
    inStock: true,
    image: '/src/assets/images/cat_prawns_seafood_1790508815698.jpg',
  },
  {
    id: 'pr-4',
    categoryId: 'prawns',
    name: 'Tender Squid Rings (Cleaned)',
    price: '₹480 / 400G',
    rating: '4.6 (190)',
    inStock: true,
    image: '/src/assets/images/cat_prawns_seafood_1790508815698.jpg',
  },

  // Cold Cuts
  {
    id: 'cc-1',
    categoryId: 'cold-cuts',
    name: 'Chicken Smoked Salami (Sliced)',
    price: '₹190 / 250G',
    discount: '10% OFF',
    rating: '4.8 (490)',
    inStock: true,
    image: '/src/assets/images/cat_cold_cuts_1790508827963.jpg',
  },
  {
    id: 'cc-2',
    categoryId: 'cold-cuts',
    name: 'Gourmet Chicken Frankfurters',
    price: '₹220 / 300G',
    rating: '4.7 (380)',
    inStock: true,
    image: '/src/assets/images/cat_cold_cuts_1790508827963.jpg',
  },
  {
    id: 'cc-3',
    categoryId: 'cold-cuts',
    name: 'Spicy Chicken Pepperoni Slices',
    price: '₹240 / 200G',
    discount: '5% OFF',
    rating: '4.9 (410)',
    inStock: true,
    image: '/src/assets/images/cat_cold_cuts_1790508827963.jpg',
  },
  {
    id: 'cc-4',
    categoryId: 'cold-cuts',
    name: 'Smoked Chicken Ham Loaf',
    price: '₹230 / 250G',
    rating: '4.8 (260)',
    inStock: true,
    image: '/src/assets/images/cat_cold_cuts_1790508827963.jpg',
  },

  // Marinades
  {
    id: 'mr-1',
    categoryId: 'marinades',
    name: 'Haryali Chicken Kebab Cut',
    price: '₹330 / 450G',
    discount: '8% OFF',
    rating: '4.8 (560)',
    inStock: true,
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  },
  {
    id: 'mr-2',
    categoryId: 'marinades',
    name: 'Melt-in-Mouth Galouti Kebab (6 Pcs)',
    price: '₹380 / PACK',
    rating: '4.9 (720)',
    inStock: true,
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  },
  {
    id: 'mr-3',
    categoryId: 'marinades',
    name: 'Mustard Kasundi Fish Tikka',
    price: '₹410 / 400G',
    rating: '4.7 (310)',
    inStock: true,
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  },
  {
    id: 'mr-4',
    categoryId: 'marinades',
    name: 'Afghani Chicken Shashlik Skewers',
    price: '₹350 / 450G',
    discount: '10% OFF',
    rating: '4.8 (440)',
    inStock: true,
    image: '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  },
];

export const CategoryListScreen: React.FC<CategoryListScreenProps> = ({
  initialCategory,
  fromOrigin = 'category_manual',
  onBack,
  onSelectProduct,
  onNavigateTab,
}) => {
  const { cartCount, addToCart, updateQuantity, getItemQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  
  const [categoriesList, setCategoriesList] = useState<CategoryInfo[]>(ALL_CATEGORIES);
  const [productsList, setProductsList] = useState<CategoryProduct[]>(ALL_PRODUCTS);

  // Load from Supabase on mount
  useEffect(() => {
    const fetchSupabaseMenu = async () => {
      try {
        const { data: dbCats } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true);
          
        if (dbCats && dbCats.length > 0) {
          const formattedCats: CategoryInfo[] = dbCats.map((c: any) => ({
            id: c.id,
            name: c.name,
            itemCount: 0, // Computed dynamically below or default
            image: c.image || '/src/assets/images/cat_chicken_1790504356265.jpg',
          }));
          setCategoriesList(formattedCats);
        }

        const { data: dbProducts } = await supabase
          .from('products')
          .select('*');
          
        if (dbProducts && dbProducts.length > 0) {
          const formattedProducts: CategoryProduct[] = dbProducts.map((p: any) => ({
            id: p.id,
            categoryId: p.category.toLowerCase().replace(/\s+/g, '-'),
            name: p.name,
            price: `₹${p.price} / ${p.weight || '500g'}`,
            discount: p.badge || (p.original_price ? `${Math.round(((p.original_price - p.price) / p.original_price) * 100)}% OFF` : undefined),
            rating: `${p.rating || 4.8} (${p.rating_count || 120})`,
            inStock: p.in_stock !== false,
            image: p.image || '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
          }));
          setProductsList(formattedProducts);
        }
      } catch (err) {
        console.warn('Error fetching Supabase products in CategoryListScreen:', err);
      }
    };
    fetchSupabaseMenu();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      // Find category matching name or id
      const matched = categoriesList.find(
        (c) => c.name.toLowerCase() === initialCategory.toLowerCase() || c.id === initialCategory.toLowerCase()
      );
      if (matched) {
        setSelectedCategory(matched.id);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [initialCategory, categoriesList]);

  const getCategoryCount = (cat: CategoryInfo) => {
    const catIdNorm = cat.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const catNameNorm = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    return productsList.filter((p) => {
      const pCat = (p.categoryId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const pName = (p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      if (pCat === catIdNorm || pCat === catNameNorm) return true;
      if (pCat.includes(catIdNorm) || catIdNorm.includes(pCat)) return true;

      if (catIdNorm === 'chicken' && (pCat.includes('chicken') || pName.includes('chicken'))) return true;
      if (catIdNorm === 'mutton' && (pCat.includes('mutton') || pCat.includes('goat') || pName.includes('mutton') || pName.includes('goat'))) return true;
      if (catIdNorm === 'fish' && (pCat.includes('fish') || pName.includes('fish') || pName.includes('rohu') || pName.includes('salmon') || pName.includes('pomfret'))) return true;
      if (catIdNorm === 'eggs' && (pCat.includes('egg') || pName.includes('egg'))) return true;
      if ((catIdNorm === 'readytocook' || catIdNorm === 'ready_to_cook') && (pCat.includes('ready') || pCat.includes('cook') || pCat.includes('tikka') || pCat.includes('kebab'))) return true;
      if (catIdNorm === 'specialcuts' && (pCat.includes('special') || pCat.includes('steak') || pCat.includes('shank') || pCat.includes('chops'))) return true;
      if (catIdNorm === 'prawns' && (pCat.includes('prawn') || pCat.includes('seafood') || pName.includes('prawn'))) return true;
      if (catIdNorm === 'coldcuts' && (pCat.includes('cold') || pCat.includes('salami') || pCat.includes('sausage'))) return true;
      if (catIdNorm === 'marinades' && (pCat.includes('marinade') || pCat.includes('kebab') || pName.includes('marinade'))) return true;

      return false;
    }).length;
  };

  const currentCategoryInfo = ALL_CATEGORIES.find((c) => c.id === selectedCategory) || categoriesList.find((c) => c.id === selectedCategory);
  const displayedProducts = selectedCategory && currentCategoryInfo
    ? productsList.filter((p) => {
        const catIdNorm = currentCategoryInfo.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        const catNameNorm = currentCategoryInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const pCat = (p.categoryId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const pName = (p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        if (pCat === catIdNorm || pCat === catNameNorm) return true;
        if (pCat.includes(catIdNorm) || catIdNorm.includes(pCat)) return true;

        if (catIdNorm === 'chicken' && (pCat.includes('chicken') || pName.includes('chicken'))) return true;
        if (catIdNorm === 'mutton' && (pCat.includes('mutton') || pCat.includes('goat') || pName.includes('mutton') || pName.includes('goat'))) return true;
        if (catIdNorm === 'fish' && (pCat.includes('fish') || pName.includes('fish') || pName.includes('rohu') || pName.includes('salmon') || pName.includes('pomfret'))) return true;
        if (catIdNorm === 'eggs' && (pCat.includes('egg') || pName.includes('egg'))) return true;
        if ((catIdNorm === 'readytocook' || catIdNorm === 'ready_to_cook') && (pCat.includes('ready') || pCat.includes('cook') || pCat.includes('tikka') || pCat.includes('kebab'))) return true;
        if (catIdNorm === 'specialcuts' && (pCat.includes('special') || pCat.includes('steak') || pCat.includes('shank') || pCat.includes('chops'))) return true;
        if (catIdNorm === 'prawns' && (pCat.includes('prawn') || pCat.includes('seafood') || pName.includes('prawn'))) return true;
        if (catIdNorm === 'coldcuts' && (pCat.includes('cold') || pCat.includes('salami') || pCat.includes('sausage'))) return true;
        if (catIdNorm === 'marinades' && (pCat.includes('marinade') || pCat.includes('kebab') || pName.includes('marinade'))) return true;

        return false;
      })
    : [];

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
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Top Header - Fixed */}
      <div className="shrink-0 bg-white px-4 pt-3 pb-3 border-b border-slate-200/80 shadow-2xs z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (selectedCategory) {
                  setSelectedCategory(null); // Return to All Categories overview
                } else {
                  onBack(); // Return to Home
                }
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                {selectedCategory && currentCategoryInfo
                  ? currentCategoryInfo.name
                  : 'All Categories'}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                {selectedCategory && currentCategoryInfo
                  ? `${displayedProducts.length} items available`
                  : 'Explore Daily Fresh Meat'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('search')}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-4.5 h-4.5 text-slate-700 stroke-[2.2]" />
            </button>
            <button
              onClick={() => onNavigateTab('cart')}
              className="relative p-2 rounded-full hover:bg-red-50 text-[#BA181B] transition-colors cursor-pointer flex items-center justify-center"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#BA181B] stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#BA181B] text-white text-[9px] font-black flex items-center justify-center border-1.5 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* If category selected: Quick Category Switcher Tabs */}
        {selectedCategory && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2.5 mt-1 border-t border-slate-100">
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-2.5 py-1 rounded-full text-xs font-bold shrink-0 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              All Categories
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#BA181B] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-red-200 hover:text-[#BA181B]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 no-scrollbar pb-20">
        {/* VIEW 1: ALL CATEGORIES IN 3-PER-ROW GRID (when no category selected) */}
        {!selectedCategory ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                Select Category ({ALL_CATEGORIES.length})
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Tap to view cuts</span>
            </div>

            {/* Exactly 3 per row cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {ALL_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-2xs hover:border-[#BA181B] hover:shadow-xs active:scale-95 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  {/* Category Image */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-rose-50/50 mb-1.5 p-1 relative flex items-center justify-center">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Title & Item Count */}
                  <div className="text-center">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#BA181B] transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {getCategoryCount(cat)} Items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW 2: PRODUCTS OF THE SELECTED CATEGORY */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
              <span>{currentCategoryInfo?.name} Products ({displayedProducts.length})</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-[11px] text-[#BA181B] font-bold hover:underline"
              >
                Change Category
              </button>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center my-4">
                <div className="w-12 h-12 rounded-full bg-red-50 text-[#BA181B] font-black text-lg flex items-center justify-center mx-auto mb-2">
                  0
                </div>
                <h3 className="text-sm font-extrabold text-slate-800">0 Items in {currentCategoryInfo?.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Currently no products are listed under this category.</p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-3.5 px-4 py-2 bg-[#BA181B] text-white text-xs font-bold rounded-xl"
                >
                  Browse Other Categories
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {displayedProducts.map((p) => {
                  const qty = getItemQuantity(p.id) || getItemQuantity(p.name);

                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProduct(p.name)}
                      className="bg-white rounded-2xl p-3.5 border border-slate-300 shadow-xs hover:border-[#BA181B]/50 hover:shadow-md transition-all flex gap-3.5 items-center cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative border border-slate-100">
                        <AppImage
                          src={getCleanProductImage(p.name, p.image)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Top-right: Green pill badge Fresh only */}
                        <span className="absolute top-2 right-2 bg-[#16A34A] text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded-full shadow-xs flex items-center justify-center">
                          Fresh
                        </span>
                      </div>

                      {/* Product Details (Full Title without ...) */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug break-words">
                            {p.name}
                          </h4>

                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-sm font-black text-[#A8071A]">
                              {p.price}
                            </span>
                            <span className="text-[8.5px] text-emerald-600 font-bold flex items-center gap-0.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                              In Stock
                            </span>
                          </div>
                        </div>

                        {/* Add Button & Buy Now Button (Opens Product Details Screen) */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProduct(p.name);
                            }}
                            className="flex-1 min-w-0 py-2 bg-[#BA181B] hover:bg-red-800 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 fill-white/20 stroke-[2.2]" />
                            <span>Add</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProduct(p.name);
                            }}
                            className="flex-1 min-w-0 py-2 bg-[#16A34A] hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 fill-white/20 stroke-[2.2]" />
                            <span>Buy Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shadow-md">
        {/* HOME */}
        <button
          onClick={() => onNavigateTab('home')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <HomeIcon className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Home</span>
        </button>

        {/* CATEGORIES (Active) */}
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex flex-col items-center gap-0.5 text-[#BA181B] relative cursor-pointer"
        >
          <LayoutGrid className="w-5 h-5 text-[#BA181B] stroke-[#BA181B] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#BA181B]">Categories</span>
          <div className="w-7 h-[2.5px] bg-[#BA181B] rounded-full absolute -bottom-1.5" />
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
          <span className="text-[10px] font-semibold text-slate-500">Cart</span>
        </button>

        {/* ORDERS */}
        <button
          onClick={() => onNavigateTab('my_orders')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ClipboardList className="w-5 h-5 text-slate-400 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Orders</span>
        </button>

        {/* SHARE */}
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
