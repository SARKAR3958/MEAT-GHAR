import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AdminScreen,
  AdminProduct,
  AdminOrder,
  AdminUser,
  AdminCategory,
  AdminOffer,
  AdminSupportTicket,
  AdminBanner,
  AdminFlashDeal,
  OrderStatus,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_OFFERS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_BANNERS,
  INITIAL_FLASH_DEALS,
} from './mockData';
import {
  supabase,
  testSupabaseConnection,
  uploadImageToSupabase,
} from '../../lib/supabase';

interface AdminContextType {
  currentScreen: AdminScreen;
  screenHistory: AdminScreen[];
  navigateAdminScreen: (screen: AdminScreen) => void;
  goBackAdmin: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;

  // Supabase Database & Storage Integration
  isSupabaseConnected: boolean;
  supabaseStatus: string;
  syncWithSupabase: () => Promise<void>;
  uploadImage: (file: File, folder?: string) => Promise<string | null>;

  // Sliding Hero Banners
  banners: AdminBanner[];
  addBanner: (banner: Omit<AdminBanner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<AdminBanner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;

  // Flash Deals
  flashDeals: AdminFlashDeal[];
  addFlashDeal: (deal: Omit<AdminFlashDeal, 'id'>) => void;
  updateFlashDeal: (id: string, updates: Partial<AdminFlashDeal>) => void;
  deleteFlashDeal: (id: string) => void;
  toggleFlashDealActive: (id: string) => void;

  // Products
  products: AdminProduct[];
  selectedProduct: AdminProduct | null;
  setSelectedProduct: (p: AdminProduct | null) => void;
  addProduct: (product: Omit<AdminProduct, 'id' | 'createdAt' | 'salesCount'>) => void;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;

  // Orders
  orders: AdminOrder[];
  selectedOrder: AdminOrder | null;
  setSelectedOrder: (o: AdminOrder | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Users
  users: AdminUser[];
  toggleUserBlock: (userId: string) => void;

  // Categories
  categories: AdminCategory[];
  addCategory: (cat: Omit<AdminCategory, 'id' | 'productCount'>) => void;
  deleteCategory: (catId: string) => void;

  // Offers
  offers: AdminOffer[];
  toggleOfferActive: (offerId: string) => void;
  addOffer: (offer: Omit<AdminOffer, 'id'>) => void;

  // Support Tickets & Live Chat
  supportTickets: AdminSupportTicket[];
  selectedTicket: AdminSupportTicket | null;
  setSelectedTicket: (ticket: AdminSupportTicket | null) => void;
  sendTicketReply: (ticketId: string, text: string) => void;
  updateTicketStatus: (ticketId: string, status: 'Open' | 'In Progress' | 'Resolved') => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Auth
  isLoggedIn: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{
  initialScreen?: AdminScreen;
  onExitAdmin?: () => void;
  children: React.ReactNode;
}> = ({ initialScreen = 'splash', onExitAdmin, children }) => {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>(initialScreen);
  const [screenHistory, setScreenHistory] = useState<AdminScreen[]>([initialScreen]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Data states initialized from Mock Data
  const [products, setProducts] = useState<AdminProduct[]>(() => {
    const saved = localStorage.getItem('meatghar_admin_products_v3');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    const saved = localStorage.getItem('meatghar_admin_orders_v3');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [users, setUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('meatghar_admin_users_v3');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [categories, setCategories] = useState<AdminCategory[]>(() => {
    const saved = localStorage.getItem('meatghar_admin_categories_v3');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [offers, setOffers] = useState<AdminOffer[]>(() => {
    const saved = localStorage.getItem('meatghar_admin_offers_v3');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [supportTickets, setSupportTickets] = useState<AdminSupportTicket[]>(() => {
    const saved = localStorage.getItem('meatghar_admin_tickets_v1');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  const [banners, setBanners] = useState<AdminBanner[]>(() => {
    const saved = localStorage.getItem('meatghar_banners_v1');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [flashDeals, setFlashDeals] = useState<AdminFlashDeal[]>(() => {
    const saved = localStorage.getItem('meatghar_flash_deals_v1');
    return saved ? JSON.parse(saved) : INITIAL_FLASH_DEALS;
  });

  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('meatghar_admin_logged') === 'true';
  });

  // Supabase states
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Connecting...');

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Sync data bidirectionally with Supabase
  const syncWithSupabase = useCallback(async () => {
    try {
      const conn = await testSupabaseConnection();
      setIsSupabaseConnected(conn.ok);
      setSupabaseStatus(conn.message);

      // 1. Fetch Products
      const { data: dbProducts, error: prodErr } = await supabase.from('products').select('*');
      if (!prodErr && dbProducts && dbProducts.length > 0) {
        const mappedProds: AdminProduct[] = dbProducts.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          category: p.category,
          categoryId: p.category.toLowerCase().replace(/\s+/g, '-'),
          price: Number(p.price) || 0,
          originalPrice: p.original_price ? Number(p.original_price) : undefined,
          stockQuantity: p.in_stock ? 50 : 0,
          unit: p.weight || '500g',
          description: p.description || '',
          image: p.image || '',
          isActive: p.in_stock !== false,
          createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Today',
          salesCount: p.sales_count || 0,
        }));
        setProducts(mappedProds);
      }

      // 2. Fetch Categories
      const { data: dbCats, error: catErr } = await supabase.from('categories').select('*');
      if (!catErr && dbCats && dbCats.length > 0) {
        const mappedCats: AdminCategory[] = dbCats.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          iconName: c.icon || c.iconName || 'Drumstick',
          image: c.image || '',
          productCount: Number(c.productCount || 0),
        }));
        setCategories(mappedCats);
      }

      // 3. Fetch Orders
      const { data: dbOrders, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!orderErr && dbOrders && dbOrders.length > 0) {
        const mappedOrders: AdminOrder[] = dbOrders.map((o: any) => {
          const createdAtDate = o.created_at ? new Date(o.created_at) : new Date();
          const pMethod: 'Cash on Delivery' | 'Online / UPI' | 'Card' =
            o.payment_method === 'COD' || o.payment_method === 'Cash on Delivery'
              ? 'Cash on Delivery'
              : o.payment_method === 'Card'
              ? 'Card'
              : 'Online / UPI';
          const itemsList = Array.isArray(o.items)
            ? o.items.map((it: any) => ({
                productId: it.productId || it.id || 'prod_1',
                name: it.name || 'Fresh Cut',
                price: Number(it.price || 0),
                quantity: Number(it.quantity || 1),
                unit: it.unit || '500g',
                image: it.image,
              }))
            : [];
          return {
            id: String(o.id),
            orderNumber: String(o.id).startsWith('#') ? String(o.id) : `#${o.id}`,
            customerName: o.customer_name || 'Customer',
            customerPhone: o.customer_phone || '',
            deliveryAddress:
              typeof o.delivery_address === 'string'
                ? o.delivery_address
                : o.delivery_address?.address || 'Noida, Sector 10',
            items: itemsList,
            subTotal: Number(o.subtotal || o.total_amount),
            deliveryFee: Number(o.delivery_fee || 0),
            total: Number(o.total_amount),
            paymentMethod: pMethod,
            status: (o.status as OrderStatus) || 'Preparing',
            date: createdAtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.warn('Supabase sync exception:', err);
    }
  }, []);

  // Upload image to Supabase Storage bucket
  const uploadImage = async (file: File, folder = 'products'): Promise<string | null> => {
    showToast('Uploading to Supabase Storage...');
    const res = await uploadImageToSupabase(file, folder);
    if (res.error) {
      showToast(`Upload warning: ${res.error.message}`);
      return null;
    }
    if (res.url) {
      showToast('Image uploaded to Supabase Storage!');
    }
    return res.url;
  };

  // Sync on mount & listen to real-time new orders
  useEffect(() => {
    syncWithSupabase();

    const channel = supabase
      .channel('meatghar-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        () => {
          showToast('🔔 New Customer Order Placed!');
          syncWithSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [syncWithSupabase]);

  // Navigation handlers
  const navigateAdminScreen = (screen: AdminScreen) => {
    setIsDrawerOpen(false);
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBackAdmin = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      if (onExitAdmin) {
        onExitAdmin();
      } else {
        setCurrentScreen('dashboard');
      }
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  // Auth Handlers
  const loginAdmin = (_email: string, _pass: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('meatghar_admin_logged', 'true');
    setCurrentScreen('dashboard');
    showToast('Welcome back, Super Admin!');
    return true;
  };

  const logoutAdmin = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('meatghar_admin_logged');
    setIsDrawerOpen(false);
    setCurrentScreen('login');
    showToast('Logged out successfully');
  };

  // Product Actions
  const addProduct = (newProd: Omit<AdminProduct, 'id' | 'createdAt' | 'salesCount'>) => {
    const id = `prod_${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const fullProduct: AdminProduct = {
      ...newProd,
      id,
      createdAt: dateStr,
      salesCount: 0,
    };
    setProducts((prev) => [fullProduct, ...prev]);

    // Update category product count
    setCategories((prev) =>
      prev.map((c) => (c.name === fullProduct.category || c.id === fullProduct.categoryId ? { ...c, productCount: c.productCount + 1 } : c))
    );

    // Sync to Supabase
    supabase.from('products').upsert({
      id: fullProduct.id,
      name: fullProduct.name,
      category: fullProduct.category,
      price: fullProduct.price,
      original_price: fullProduct.originalPrice || fullProduct.price,
      weight: fullProduct.unit,
      description: fullProduct.description,
      image: fullProduct.image,
      in_stock: fullProduct.isActive,
    }).then(({ error }) => {
      if (error) console.warn('Supabase product sync error:', error.message);
    });

    showToast(`"${fullProduct.name}" added to catalogue`);
    navigateAdminScreen('products');
  };

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (selectedProduct && selectedProduct.id === id) {
            setSelectedProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );

    // Sync to Supabase
    supabase.from('products').update({
      ...(updates.name && { name: updates.name }),
      ...(updates.category && { category: updates.category }),
      ...(updates.price !== undefined && { price: updates.price }),
      ...(updates.originalPrice !== undefined && { original_price: updates.originalPrice }),
      ...(updates.description && { description: updates.description }),
      ...(updates.image && { image: updates.image }),
      ...(updates.isActive !== undefined && { in_stock: updates.isActive }),
      ...(updates.unit && { weight: updates.unit }),
    }).eq('id', id).then(({ error }) => {
      if (error) console.warn('Supabase product update error:', error.message);
    });

    showToast('Product details updated');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (prod) {
      setCategories((prev) =>
        prev.map((c) => (c.name === prod.category || c.id === prod.categoryId ? { ...c, productCount: Math.max(0, c.productCount - 1) } : c))
      );
    }

    // Sync to Supabase
    supabase.from('products').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('Supabase product delete error:', error.message);
    });

    showToast('Product removed');
    navigateAdminScreen('products');
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isActive;
          supabase.from('products').update({ in_stock: nextState }).eq('id', id).then();
          showToast(`Product set to ${nextState ? 'Active' : 'Inactive'}`);
          return { ...p, isActive: nextState };
        }
        return p;
      })
    );
  };

  // Order Actions
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.orderNumber === orderId) {
          const updated = { ...o, status };
          if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderNumber === orderId)) {
            setSelectedOrder(updated);
          }
          return updated;
        }
        return o;
      })
    );

    // Sync to Supabase
    supabase.from('orders').update({ status }).eq('id', orderId).then(({ error }) => {
      if (error) console.warn('Supabase order status sync notice:', error.message);
    });

    showToast(`Order status updated to "${status}"`);
  };

  // User Actions
  const toggleUserBlock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const next = u.status === 'Active' ? 'Blocked' : 'Active';
          showToast(`User marked as ${next}`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  // Category Actions
  const addCategory = (cat: Omit<AdminCategory, 'id' | 'productCount'>) => {
    const newCat: AdminCategory = {
      ...cat,
      id: `cat_${Date.now()}`,
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${cat.name}" created`);
  };

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast('Category deleted');
  };

  // Offers Actions
  const toggleOfferActive = (offerId: string) => {
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id === offerId) {
          const nextState = !off.isActive;
          showToast(`Offer ${nextState ? 'Activated' : 'Deactivated'}`);
          return { ...off, isActive: nextState };
        }
        return off;
      })
    );
  };

  const addOffer = (offer: Omit<AdminOffer, 'id'>) => {
    const newOffer: AdminOffer = {
      ...offer,
      id: `off_${Date.now()}`,
    };
    setOffers((prev) => [newOffer, ...prev]);
    showToast('Promotional deal added');
  };

  // Support Tickets Actions
  const sendTicketReply = (ticketId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedMessages = [
            ...t.messages,
            {
              id: `m_${Date.now()}`,
              sender: 'admin' as const,
              text: text.trim(),
              time: timeStr,
            },
          ];
          const updatedTicket = {
            ...t,
            messages: updatedMessages,
            lastMessage: text.trim(),
            lastUpdated: 'Just now',
            unreadCount: 0,
          };
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updatedTicket);
          }
          return updatedTicket;
        }
        return t;
      })
    );
    showToast('Reply sent to customer');
  };

  const updateTicketStatus = (ticketId: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedTicket = { ...t, status };
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updatedTicket);
          }
          return updatedTicket;
        }
        return t;
      })
    );
    showToast(`Ticket marked as ${status}`);
  };

  // Banner Actions
  const addBanner = (banner: Omit<AdminBanner, 'id'>) => {
    const newBanner: AdminBanner = {
      ...banner,
      id: `ban_${Date.now()}`,
    };
    setBanners((prev) => [...prev, newBanner]);
    showToast('Sliding banner added');
  };

  const updateBanner = (id: string, updates: Partial<AdminBanner>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    showToast('Banner updated');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner deleted');
  };

  const toggleBannerActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const next = !b.isActive;
          showToast(`Banner ${next ? 'activated' : 'deactivated'}`);
          return { ...b, isActive: next };
        }
        return b;
      })
    );
  };

  // Flash Deals Actions
  const addFlashDeal = (deal: Omit<AdminFlashDeal, 'id'>) => {
    const newDeal: AdminFlashDeal = {
      ...deal,
      id: `fd_${Date.now()}`,
    };
    setFlashDeals((prev) => [newDeal, ...prev]);
    showToast('Flash deal created');
  };

  const updateFlashDeal = (id: string, updates: Partial<AdminFlashDeal>) => {
    setFlashDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast('Flash deal updated');
  };

  const deleteFlashDeal = (id: string) => {
    setFlashDeals((prev) => prev.filter((d) => d.id !== id));
    showToast('Flash deal removed');
  };

  const toggleFlashDealActive = (id: string) => {
    setFlashDeals((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const next = !d.isActive;
          showToast(`Flash deal ${next ? 'enabled' : 'disabled'}`);
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <AdminContext.Provider
      value={{
        currentScreen,
        screenHistory,
        navigateAdminScreen,
        goBackAdmin,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        isSupabaseConnected,
        supabaseStatus,
        syncWithSupabase,
        uploadImage,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerActive,
        flashDeals,
        addFlashDeal,
        updateFlashDeal,
        deleteFlashDeal,
        toggleFlashDealActive,
        products,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        orders,
        selectedOrder,
        setSelectedOrder,
        updateOrderStatus,
        users,
        toggleUserBlock,
        categories,
        addCategory,
        deleteCategory,
        offers,
        toggleOfferActive,
        addOffer,
        supportTickets,
        selectedTicket,
        setSelectedTicket,
        sendTicketReply,
        updateTicketStatus,
        toastMessage,
        showToast,
        isLoggedIn,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
