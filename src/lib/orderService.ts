import { supabase } from './supabase';
import { getCurrentUserIdentifier } from './addressService';

export interface OrderItem {
  name: string;
  qty: string;
  prep?: string;
  price: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  timestamp?: number;
  status: 'Active' | 'Completed' | 'Cancelled';
  statusLabel: string;
  totalAmount: string;
  subtotal?: number;
  deliveryFee?: number;
  discount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  deliveredText?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: {
    address: string;
    city?: string;
    locality?: string;
    houseFlat?: string;
    street?: string;
    landmark?: string;
  };
  items: OrderItem[];
  etaMinutes?: number;
  trackingStep?: number;
}

/**
 * Normalizes status from backend to 'Active' | 'Completed' | 'Cancelled'
 */
export function normalizeOrderStatus(dbStatus?: string): 'Active' | 'Completed' | 'Cancelled' {
  const s = (dbStatus || '').toLowerCase();
  if (s.includes('deliver') || s.includes('complete') || s.includes('success')) {
    return 'Completed';
  }
  if (s.includes('cancel') || s.includes('reject') || s.includes('fail')) {
    return 'Cancelled';
  }
  return 'Active';
}

/**
 * Format a Supabase order row into UI Order model
 */
export function formatOrderRow(row: any): Order {
  const normalizedStatus = normalizeOrderStatus(row.status);
  const createdAt = row.created_at ? new Date(row.created_at) : new Date();

  const formattedDate = createdAt.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = createdAt.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  let itemsList: OrderItem[] = [];
  if (Array.isArray(row.items)) {
    itemsList = row.items.map((it: any) => ({
      name: it.name || it.productName || 'Fresh Cut',
      qty: `${it.quantity || 1} ${it.unit || 'Unit'}`,
      prep: it.prep || 'Full Cleaned',
      price: `₹${(it.price || 0) * (it.quantity || 1)}`,
      image: it.image || '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
    }));
  }

  // Address parsing
  let addrObj: any = { address: 'Delivery Address' };
  if (row.delivery_address) {
    if (typeof row.delivery_address === 'string') {
      try {
        addrObj = JSON.parse(row.delivery_address);
      } catch {
        addrObj = { address: row.delivery_address };
      }
    } else {
      addrObj = row.delivery_address;
    }
  }

  // Calculate live ETA for active orders
  const diffMinutes = Math.floor((Date.now() - createdAt.getTime()) / 60000);
  const remainingMinutes = Math.max(5, 70 - diffMinutes);

  let statusLabel = row.status || 'Active';
  if (normalizedStatus === 'Completed') {
    statusLabel = 'Delivered';
  } else if (normalizedStatus === 'Cancelled') {
    statusLabel = 'Cancelled';
  } else {
    if (diffMinutes < 5) statusLabel = 'Order Placed';
    else if (diffMinutes < 15) statusLabel = 'Preparing Cuts';
    else if (diffMinutes < 30) statusLabel = 'Quality Packed';
    else statusLabel = 'Out for Delivery';
  }

  return {
    id: row.id,
    orderNumber: row.id.startsWith('#') ? row.id : `#${row.id}`,
    date: formattedDate,
    time: formattedTime,
    timestamp: createdAt.getTime(),
    status: normalizedStatus,
    statusLabel,
    totalAmount: `₹${row.total_amount || row.total || 0}`,
    subtotal: row.subtotal || row.total_amount || 0,
    deliveryFee: row.delivery_fee || 0,
    discount: row.discount || 0,
    paymentMethod: row.payment_method || 'COD',
    paymentStatus: row.payment_status || 'Pending',
    deliveredText:
      normalizedStatus === 'Completed'
        ? `Delivered on ${formattedDate} at ${formattedTime}`
        : `Expected Delivery: ${remainingMinutes} mins • 70-Min Halal SLA`,
    customerName: row.customer_name || 'Customer',
    customerPhone: row.customer_phone || '',
    deliveryAddress: addrObj,
    items: itemsList,
    etaMinutes: remainingMinutes,
  };
}

/**
 * Fetch real user orders from Supabase with instant cache for completed orders
 */
export async function fetchUserOrders(): Promise<Order[]> {
  const ident = getCurrentUserIdentifier();
  const phone = ident.phone?.replace(/\D/g, '').slice(-10);
  const email = ident.email;

  // 1. Load cached completed/all orders first for instant UI response
  let cachedOrders: Order[] = [];
  try {
    const cached = localStorage.getItem('meatghar_cached_orders_v1');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) cachedOrders = parsed;
    }
  } catch {
    // ignore
  }

  // 2. Fetch fresh orders from Supabase
  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    const orFilters: string[] = [];
    if (phone) {
      orFilters.push(`customer_phone.eq.${phone}`);
      orFilters.push(`customer_phone.ilike.%${phone}%`);
      orFilters.push(`user_id.eq.${phone}`);
    }
    if (email) {
      orFilters.push(`customer_email.eq.${email}`);
      orFilters.push(`user_id.eq.${email}`);
    }

    if (orFilters.length > 0) {
      query = query.or(orFilters.join(','));
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      const freshOrders = data.map(formatOrderRow);

      // Cache all orders for instant future access
      try {
        localStorage.setItem('meatghar_cached_orders_v1', JSON.stringify(freshOrders));
      } catch {
        // ignore
      }

      return freshOrders;
    }
  } catch (err) {
    console.warn('Error fetching orders from Supabase:', err);
  }

  // Fallback to local storage if user placed orders locally
  try {
    const localSaved = localStorage.getItem('meatghar_admin_orders_v3');
    if (localSaved) {
      const parsed = JSON.parse(localSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(formatOrderRow);
      }
    }
  } catch {
    // ignore
  }

  return cachedOrders;
}
