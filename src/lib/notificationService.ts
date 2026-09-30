// Meat Ghar Real Notifications State Manager

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'delivery' | 'offer' | 'deal' | 'system';
  createdAt: number;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Order #MM10284 Confirmed',
    message: 'Your order has been confirmed. Fresh halal cut is being prepared for 70-min delivery.',
    time: '10:28 AM',
    type: 'order',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'n2',
    title: 'Rider Assigned for Delivery',
    message: 'Delivery partner has been assigned and is heading to the pickup station.',
    time: '10:45 AM',
    type: 'delivery',
    createdAt: Date.now() - 2400000,
  },
  {
    id: 'n3',
    title: 'Special 250g Free Meat Offer Active',
    message: 'Invite 10 friends with your referral code to unlock your 250g Chicken/Mutton pack.',
    time: 'Yesterday',
    type: 'offer',
    createdAt: Date.now() - 86400000,
  },
];

const READ_KEY = 'meatghar_read_notifications_v1';
const LAST_READ_ALL_KEY = 'meatghar_notifications_read_all_timestamp';

export function getReadNotificationIds(): string[] {
  try {
    const data = localStorage.getItem(READ_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return [];
}

export function isAllNotificationsRead(): boolean {
  try {
    const lastReadAll = localStorage.getItem(LAST_READ_ALL_KEY);
    return Boolean(lastReadAll);
  } catch {
    return false;
  }
}

export function getUnreadNotificationCount(): number {
  try {
    if (isAllNotificationsRead()) return 0;
    const readIds = getReadNotificationIds();
    const unread = DEFAULT_NOTIFICATIONS.filter((n) => !readIds.includes(n.id));
    return unread.length;
  } catch {
    return 0;
  }
}

export function markAllNotificationsAsRead(): void {
  try {
    localStorage.setItem(LAST_READ_ALL_KEY, Date.now().toString());
    const allIds = DEFAULT_NOTIFICATIONS.map((n) => n.id);
    localStorage.setItem(READ_KEY, JSON.stringify(allIds));
    window.dispatchEvent(new Event('meatghar_notifications_updated'));
  } catch {
    // ignore
  }
}
