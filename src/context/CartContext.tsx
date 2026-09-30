import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStoreSettings } from '../lib/settingsService';

export interface CartItem {
  id: string;
  name: string;
  category?: string;
  weight?: string;
  prep?: string;
  cut?: string;
  notes?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  totalAmount: number;
  baseDeliveryFee: number;
  addToCart: (item: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category?: string;
    weight?: string;
    prep?: string;
    cut?: string;
    notes?: string;
    quantity?: number;
  }) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'meatghar_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseDeliveryFee, setBaseDeliveryFee] = useState<number>(40);
  const [freeThreshold, setFreeThreshold] = useState<number | undefined>(undefined);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Fetch real delivery fee and settings from Supabase
  useEffect(() => {
    fetchStoreSettings()
      .then((settings) => {
        if (settings.deliveryFee !== undefined) {
          setBaseDeliveryFee(settings.deliveryFee);
        }
        if (settings.freeDeliveryThreshold !== undefined) {
          setFreeThreshold(settings.freeDeliveryThreshold);
        }
      })
      .catch((err) => console.warn('Delivery settings fetch notice:', err));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery fee is fetched from Supabase setting (NOT automatically free)
  const deliveryFee = subtotal > 0
    ? (freeThreshold && subtotal >= freeThreshold ? 0 : baseDeliveryFee)
    : 0;

  const taxes = 0; // Removed extra taxes
  const totalAmount = subtotal > 0 ? subtotal + deliveryFee : 0;

  const addToCart = (product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category?: string;
    weight?: string;
    prep?: string;
    cut?: string;
    notes?: string;
    quantity?: number;
  }) => {
    const addQty = product.quantity && product.quantity > 0 ? product.quantity : 1;
    const targetCut = product.cut || 'Curry Cut';
    const targetWeight = product.weight || '1 KG';
    const targetPrep = product.prep || '';

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          (item.id === product.id || item.id.startsWith(`${product.id}_`)) &&
          (item.cut || 'Curry Cut') === targetCut &&
          (item.weight || '1 KG') === targetWeight &&
          (item.prep || '') === targetPrep
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + addQty,
          notes: product.notes || updated[existingIdx].notes,
        };
        return updated;
      } else {
        const uniqueId = `${product.id}_${targetCut.replace(/\s+/g, '')}_${targetWeight.replace(/\s+/g, '')}`;
        return [
          ...prev,
          {
            id: uniqueId,
            name: product.name,
            category: product.category || 'Meat',
            weight: targetWeight,
            prep: targetPrep,
            cut: targetCut,
            notes: product.notes,
            price: product.price,
            originalPrice: product.originalPrice || Math.round(product.price * 1.15),
            quantity: addQty,
            image: product.image,
          },
        ];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id || item.name === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id && item.name !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (id: string) => {
    const item = cartItems.find((i) => i.id === id || i.name === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        deliveryFee,
        taxes,
        totalAmount,
        baseDeliveryFee,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
