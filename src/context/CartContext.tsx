import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  category?: string;
  weight?: string;
  prep?: string;
  cut?: string;
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

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 && subtotal < 500 ? 40 : 0;
  const taxes = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const totalAmount = subtotal > 0 ? subtotal + deliveryFee + taxes : 0;

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
    quantity?: number;
  }) => {
    const addQty = product.quantity && product.quantity > 0 ? product.quantity : 1;
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + addQty,
          prep: product.prep || updated[existingIdx].prep,
          cut: product.cut || updated[existingIdx].cut,
          weight: product.weight || updated[existingIdx].weight,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: product.category || 'Meat',
            weight: product.weight || '1 KG',
            prep: product.prep || 'Full Cleaned',
            cut: product.cut || 'Curry Cut',
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
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
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
