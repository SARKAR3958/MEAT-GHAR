import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MobileFrame, ScreenType } from './components/MobileFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { Onboarding1Screen } from './components/screens/Onboarding1Screen';
import { Onboarding2Screen } from './components/screens/Onboarding2Screen';
import { Onboarding3Screen } from './components/screens/Onboarding3Screen';
import { SignupScreen } from './components/screens/SignupScreen';
import { SignUpFormScreen } from './components/screens/SignUpFormScreen';
import { LocationPermissionScreen } from './components/screens/LocationPermissionScreen';
import { LocationSearchScreen } from './components/screens/LocationSearchScreen';
import { AddressFormScreen } from './components/screens/AddressFormScreen';
import { NoAddressOnboardingScreen } from './components/screens/NoAddressOnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoryListScreen } from './components/screens/CategoryListScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { ProductDetailsScreen } from './components/screens/ProductDetailsScreen';
import { CartScreen } from './components/screens/CartScreen';
import { DeliveryAddressScreen } from './components/screens/DeliveryAddressScreen';
import { CheckoutScreen } from './components/screens/CheckoutScreen';
import { OrderSuccessScreen } from './components/screens/OrderSuccessScreen';
import { TrackOrderScreen } from './components/screens/TrackOrderScreen';
import { DeliveryVerificationOtpScreen } from './components/screens/DeliveryVerificationOtpScreen';
import { OrderDeliveredOnTimeScreen } from './components/screens/OrderDeliveredOnTimeScreen';
import { OrderDeliveredGuaranteeBreachedScreen } from './components/screens/OrderDeliveredGuaranteeBreachedScreen';
import { RateOrderScreen } from './components/screens/RateOrderScreen';
import { MyOrdersScreen } from './components/screens/MyOrdersScreen';
import { OrderDetailsScreen } from './components/screens/OrderDetailsScreen';
import { MyProfileScreen } from './components/screens/MyProfileScreen';
import { MyAddressesScreen } from './components/screens/MyAddressesScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { HelpSupportScreen } from './components/screens/HelpSupportScreen';
import { CouponsScreen } from './components/screens/CouponsScreen';
import { EditProfileScreen } from './components/screens/EditProfileScreen';
import { ShareScreen } from './components/screens/ShareScreen';
import { WalletScreen } from './components/screens/WalletScreen';
import { AdminPanel } from './components/admin/AdminPanel';
import { LocationData, SavedAddress } from './types/location';
import { fetchUserAddresses } from './lib/addressService';
import { preloadAllImages } from './utils/preloadAssets';
import { MeatGharLogo } from './components/MeatGharLogo';
import { RotateCcw } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { supabase, signInWithGoogle } from './lib/supabase';
import { isMedianApp, registerMedianPush, syncMedianPushTags, signInWithGoogleAndroidAPK } from './utils/medianBridge';

export default function App() {
  const isInitialAdmin = typeof window !== 'undefined' && (
    window.location.pathname.toLowerCase().includes('admin-mtg') ||
    window.location.pathname.toLowerCase().includes('admin_mtg') ||
    window.location.hash.toLowerCase().includes('admin-mtg') ||
    window.location.search.toLowerCase().includes('admin-mtg') ||
    window.location.pathname.toLowerCase().includes('admin') ||
    window.location.hash.toLowerCase().includes('admin')
  );

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(isInitialAdmin ? 'admin_panel' : 'splash');
  const [phoneNumber, setPhoneNumber] = useState(() => {
    try {
      if (localStorage.getItem('meatghar_logged_out') === 'true') return '';
      const u = localStorage.getItem('meatghar_user');
      if (u) return JSON.parse(u).phone || '';
    } catch {
      // ignore
    }
    return '';
  });
  const [userName, setUserName] = useState(() => {
    try {
      if (localStorage.getItem('meatghar_logged_out') === 'true') return '';
      const u = localStorage.getItem('meatghar_user');
      if (u) return JSON.parse(u).userName || '';
    } catch {
      // ignore
    }
    return '';
  });
  const [userEmail, setUserEmail] = useState(() => {
    try {
      if (localStorage.getItem('meatghar_logged_out') === 'true') return '';
      const u = localStorage.getItem('meatghar_user');
      if (u) return JSON.parse(u).email || '';
    } catch {
      // ignore
    }
    return '';
  });
  const [editingAddress, setEditingAddress] = useState<SavedAddress | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [authMethod, setAuthMethod] = useState<'manual' | 'google'>('manual');
  const [isOrderDelivered, setIsOrderDelivered] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [productOriginScreen, setProductOriginScreen] = useState<ScreenType>('home');
  const [categoryOriginScreen, setCategoryOriginScreen] = useState<'home' | 'category_manual'>('home');
  const [userLocation, setUserLocation] = useState<LocationData>(() => {
    try {
      const savedLoc = localStorage.getItem('meatghar_selected_location');
      if (savedLoc) {
        return JSON.parse(savedLoc);
      }
    } catch {
      // ignore
    }
    return {
      address: 'Boko, Guwahati, Assam - 781123',
      lat: 26.1445,
      lng: 91.7362,
      road: 'Main Road',
      suburb: 'Boko',
      city: 'Guwahati',
      state: 'Assam',
      postcode: '781123',
    };
  });

  const handleUpdateLocation = useCallback((newLoc: LocationData) => {
    setUserLocation(newLoc);
    try {
      localStorage.setItem('meatghar_selected_location', JSON.stringify(newLoc));
    } catch {
      // ignore
    }
  }, []);

  // Fetch real addresses from Supabase when user is known
  useEffect(() => {
    if (phoneNumber || userEmail) {
      fetchUserAddresses({ phone: phoneNumber, email: userEmail, name: userName })
        .then((list) => {
          if (list && list.length > 0) {
            const def = list.find((a) => a.isDefault) || list[0];
            setUserLocation((prev) => ({
              ...prev,
              address: def.address,
              road: def.street,
              suburb: def.locality,
              city: def.city || 'Guwahati',
              state: def.state || 'Assam',
              postcode: def.pincode || '781123',
            }));
          }
        })
        .catch(() => {});
    }
  }, [phoneNumber, userEmail, userName]);

  // Check if user has addresses saved, if not redirect to require_address screen
  const checkAndRedirectUserAddress = useCallback(
    async (targetPhone?: string, targetEmail?: string): Promise<boolean> => {
      const p = targetPhone || phoneNumber;
      const e = targetEmail || userEmail;
      if (!p && !e) return false;
      try {
        const list = await fetchUserAddresses({ phone: p, email: e, name: userName });
        if (!list || list.length === 0) {
          historyStackRef.current = ['require_address'];
          navigateScreen('require_address');
          return false;
        } else {
          const def = list.find((a) => a.isDefault) || list[0];
          if (def) {
            handleUpdateLocation({
              address: def.address,
              lat: def.lat || 26.1445,
              lng: def.lng || 91.7362,
              road: def.street,
              suburb: def.locality,
              city: def.city || 'Guwahati',
              state: def.state || 'Assam',
              postcode: def.pincode || '781123',
            });
          }
          return true;
        }
      } catch (err) {
        console.warn('Address verification notice:', err);
        return false;
      }
    },
    [phoneNumber, userEmail, userName, handleUpdateLocation]
  );

  // Track screen navigation history stack for Android hardware/navigation bar back button
  const historyStackRef = useRef<ScreenType[]>([isInitialAdmin ? 'admin_panel' : 'splash']);
  const lastBackPressTimeRef = useRef<number>(0);
  const toastTimeoutRef = useRef<number | null>(null);
  const [showExitToast, setShowExitToast] = useState(false);
  const [isAppExited, setIsAppExited] = useState(false);

  // Custom Toast & Verification Modal States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [pendingSignupData, setPendingSignupData] = useState<{
    phone: string;
    email: string;
    name: string;
    userId?: string;
  } | null>(null);
  const [signupOtp, setSignupOtp] = useState('');
  const [isVerifyingSignupOtp, setIsVerifyingSignupOtp] = useState(false);
  const [signupOtpError, setSignupOtpError] = useState('');
  const [signupResendCooldown, setSignupResendCooldown] = useState(60);

  useEffect(() => {
    if (signupResendCooldown > 0 && showVerifyModal) {
      const t = setTimeout(() => setSignupResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [signupResendCooldown, showVerifyModal]);

  const showAppToast = (msg: string, type: 'success' | 'error' = 'error') => {
    setToastMessage(msg);
    setToastType(type);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load saved user profile from localStorage if exists
  useEffect(() => {
    try {
      if (localStorage.getItem('meatghar_logged_out') === 'true') {
        return;
      }
      const savedUser = localStorage.getItem('meatghar_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.userName) setUserName(parsed.userName);
        if (parsed.phone) setPhoneNumber(parsed.phone);
        if (parsed.email) setUserEmail(parsed.email);
        if (parsed.authMethod) setAuthMethod(parsed.authMethod);
      }
    } catch {
      // ignore
    }

    // Check URL pathname, hash, or query for /admin-mtg route
    const checkAdminQuery = () => {
      const loc = window.location;
      const fullPath = (loc.pathname + loc.hash + loc.search).toLowerCase();
      if (
        fullPath.includes('admin-mtg') ||
        fullPath.includes('admin_mtg') ||
        fullPath.includes('/admin') ||
        fullPath.includes('#admin') ||
        fullPath.includes('?admin')
      ) {
        setCurrentScreen('admin_panel');
      }
    };

    checkAdminQuery();
    window.addEventListener('popstate', checkAdminQuery);
    window.addEventListener('hashchange', checkAdminQuery);

    // Register Push Notifications on Mount for Median.co APK / iOS App wrapper
    if (isMedianApp()) {
      registerMedianPush();
    }

    // Supabase Auth listener (only for explicit Google OAuth callback, never auto-jump to home)
    const { data: authSub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        try {
          localStorage.removeItem('meatghar_user');
          localStorage.setItem('meatghar_logged_out', 'true');
        } catch {
          // ignore
        }
        setUserName('');
        setPhoneNumber('');
        setUserEmail('');
        setAuthMethod('manual');
        return;
      }

      // If user has explicitly logged out, DO NOT auto login
      const isLoggedOut = localStorage.getItem('meatghar_logged_out') === 'true';
      if (isLoggedOut) {
        return;
      }

      // Only handle real Google OAuth callback when URL has hash/params
      const isOAuthCallback =
        window.location.hash.includes('access_token') ||
        window.location.search.includes('code');

      if (event === 'SIGNED_IN' && session?.user && isOAuthCallback) {
        const uEmail = session.user.email || '';
        const metaName =
          session.user.user_metadata?.full_name || session.user.user_metadata?.name || uEmail.split('@')[0] || 'Customer';
        const uPhone = session.user.user_metadata?.phone || session.user.phone || '';
        setUserName(metaName);
        setUserEmail(uEmail);
        if (uPhone) setPhoneNumber(uPhone);
        setAuthMethod('google');

        if (isMedianApp() && uPhone) {
          syncMedianPushTags(uPhone, metaName);
        }

        try {
          localStorage.setItem('meatghar_logged_out', 'false');
          localStorage.setItem(
            'meatghar_user',
            JSON.stringify({
              userName: metaName,
              email: uEmail,
              phone: uPhone,
              authMethod: 'google',
              isLoggedIn: true,
              loginTime: new Date().toISOString(),
            })
          );
        } catch {
          // ignore
        }
        setCurrentScreen('home');
      }
    });

    return () => {
      window.removeEventListener('popstate', checkAdminQuery);
      window.removeEventListener('hashchange', checkAdminQuery);
      authSub.subscription.unsubscribe();
    };
  }, []);

  // Native app exit handler
  const handleExitApp = useCallback(() => {
    // 1. Try Android Capacitor App exit
    try {
      if ((window as any).Capacitor?.Plugins?.App?.exitApp) {
        (window as any).Capacitor.Plugins.App.exitApp();
        return;
      }
    } catch {
      // ignore
    }

    // 2. Try Cordova Android App exit
    try {
      if ((navigator as any).app?.exitApp) {
        (navigator as any).app.exitApp();
        return;
      }
    } catch {
      // ignore
    }

    // 3. Try standard window close or show clean standby screen
    try {
      window.close();
    } catch {
      // ignore
    }

    setIsAppExited(true);
  }, []);

  // Root back press handler (Double tap to exit)
  const handleRootBack = useCallback(() => {
    const now = Date.now();
    const timeSinceLastPress = now - lastBackPressTimeRef.current;

    if (timeSinceLastPress < 2000) {
      // Second press within 2 seconds: Exit App!
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setShowExitToast(false);
      handleExitApp();
    } else {
      // First press: show toast
      lastBackPressTimeRef.current = now;
      setShowExitToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = window.setTimeout(() => {
        setShowExitToast(false);
      }, 2000);

      // Re-push home state so browser doesn't exit prematurely on 1st tap
      try {
        window.history.pushState({ screen: 'home' }, '');
      } catch {
        // ignore
      }
    }
  }, [handleExitApp]);

  const navigateScreen = useCallback((nextScreen: ScreenType) => {
    if (nextScreen === currentScreen) return;
    try {
      const targetUrl = nextScreen === 'admin_panel' ? '/admin-mtg' : '/';
      window.history.pushState({ screen: nextScreen }, '', targetUrl);
    } catch {
      // ignore
    }
    historyStackRef.current.push(nextScreen);
    setCurrentScreen(nextScreen);
  }, [currentScreen]);

  const goBack = useCallback(() => {
    if (currentScreen === 'product_details') {
      if (productOriginScreen === 'home') {
        navigateScreen('home');
        return;
      } else if (productOriginScreen === 'category') {
        navigateScreen('category');
        return;
      } else if (productOriginScreen === 'search') {
        navigateScreen('search');
        return;
      } else {
        navigateScreen('home');
        return;
      }
    }

    if (currentScreen === 'category') {
      if (categoryOriginScreen === 'home') {
        navigateScreen('home');
        return;
      } else if (selectedCategoryName) {
        setSelectedCategoryName(null);
        return;
      } else {
        navigateScreen('home');
        return;
      }
    }

    if (
      currentScreen === 'search' ||
      currentScreen === 'delivery_address' ||
      currentScreen === 'location_search' ||
      currentScreen === 'address_form' ||
      currentScreen === 'help_support' ||
      currentScreen === 'notifications'
    ) {
      if (historyStackRef.current.length > 1) {
        window.history.back();
      } else {
        navigateScreen('home');
      }
      return;
    }

    if (historyStackRef.current.length > 1) {
      window.history.back();
    } else if (currentScreen !== 'home') {
      navigateScreen('home');
    } else {
      handleRootBack();
    }
  }, [
    currentScreen,
    categoryOriginScreen,
    handleRootBack,
    navigateScreen,
    productOriginScreen,
    selectedCategoryName,
  ]);

  useEffect(() => {
    preloadAllImages();

    // Initialize root state in browser history
    try {
      window.history.replaceState({ screen: currentScreen }, '');
    } catch {
      // ignore
    }

    // Handle browser / Android system navigation bar back button & swipe back
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        const targetScreen = event.state.screen as ScreenType;
        setCurrentScreen(targetScreen);
        const idx = historyStackRef.current.lastIndexOf(targetScreen);
        if (idx !== -1) {
          historyStackRef.current = historyStackRef.current.slice(0, idx + 1);
        } else {
          historyStackRef.current.push(targetScreen);
        }
      } else {
        // If history popped to root, check if we can step back or we are on home
        if (historyStackRef.current.length > 1) {
          historyStackRef.current.pop();
          const prevScreen = historyStackRef.current[historyStackRef.current.length - 1];
          setCurrentScreen(prevScreen);
          try {
            window.history.pushState({ screen: prevScreen }, '');
          } catch {
            // ignore
          }
        } else if (currentScreen !== 'home') {
          setCurrentScreen('home');
          try {
            window.history.pushState({ screen: 'home' }, '');
          } catch {
            // ignore
          }
        } else {
          // Already on Home screen: trigger double-back-to-exit!
          handleRootBack();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Support Android Cordova / Capacitor hardware backbutton event
    const handleAndroidBackButton = (e: Event) => {
      e.preventDefault();
      if (historyStackRef.current.length > 1) {
        window.history.back();
      } else if (currentScreen !== 'home') {
        navigateScreen('home');
      } else {
        handleRootBack();
      }
    };
    document.addEventListener('backbutton', handleAndroidBackButton);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('backbutton', handleAndroidBackButton);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [currentScreen, handleRootBack, navigateScreen]);

  // Navigation tab helper
  const handleTabNavigation = (tab: string, categoryName?: string) => {
    if (categoryName) {
      setSelectedCategoryName(categoryName);
      setCategoryOriginScreen('home');
    } else if (tab === 'category' || tab === 'categories') {
      setSelectedCategoryName(null);
      setCategoryOriginScreen('category_manual');
    }

    switch (tab) {
      case 'home':
        navigateScreen('home');
        break;
      case 'categories':
      case 'category':
        navigateScreen('category');
        break;
      case 'search':
        navigateScreen('search');
        break;
      case 'location':
      case 'location_search':
        navigateScreen('location_search');
        break;
      case 'cart':
        navigateScreen('cart');
        break;
      case 'checkout':
        navigateScreen('checkout');
        break;
      case 'orders':
      case 'my_orders':
        navigateScreen('my_orders');
        break;
      case 'share':
        navigateScreen('share');
        break;
      case 'profile':
      case 'my_profile':
        navigateScreen('my_profile');
        break;
      case 'notifications':
        navigateScreen('notifications');
        break;
      case 'delivery_address':
        navigateScreen('delivery_address');
        break;
      default:
        navigateScreen('home');
    }
  };

  // Explicit user logout handler
  const handleUserLogout = useCallback(async () => {
    try {
      localStorage.removeItem('meatghar_user');
      localStorage.removeItem('meatghar_checkout_address');
      localStorage.setItem('meatghar_logged_out', 'true');
    } catch {
      // ignore
    }
    setUserName('');
    setPhoneNumber('');
    setUserEmail('');
    setAuthMethod('manual');
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    historyStackRef.current = ['signup'];
    navigateScreen('signup');
    showAppToast('You have been logged out successfully.', 'success');
  }, [navigateScreen]);

  const handleProfileOptionClick = (optionId: string) => {
    switch (optionId) {
      case 'profile_edit':
        navigateScreen('profile_edit');
        break;
      case 'addresses':
        navigateScreen('my_addresses');
        break;
      case 'orders':
      case 'my_orders':
        navigateScreen('my_orders');
        break;
      case 'cart':
        navigateScreen('cart');
        break;
      case 'categories':
      case 'category':
        navigateScreen('category');
        break;
      case 'notifications':
        navigateScreen('notifications');
        break;
      case 'referral':
      case 'share':
        navigateScreen('share');
        break;
      case 'wallet':
        navigateScreen('wallet');
        break;
      case 'admin_panel':
      case 'admin':
        navigateScreen('admin_panel');
        break;
      case 'support':
        navigateScreen('help_support');
        break;
      case 'coupons':
        navigateScreen('coupons');
        break;
      case 'home':
        navigateScreen('home');
        break;
      case 'profile':
      case 'my_profile':
        navigateScreen('my_profile');
        break;
      default:
        navigateScreen('my_profile');
    }
  };

  return (
    <CartProvider>
      <MobileFrame currentScreen={currentScreen} setScreen={navigateScreen}>
        <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="w-full h-full flex flex-col"
        >
          {/* Screen 01: Splash */}
          {currentScreen === 'splash' && (
            <SplashScreen
              onNext={async () => {
                const savedUserStr = localStorage.getItem('meatghar_user');
                const isLoggedOut = localStorage.getItem('meatghar_logged_out') === 'true';
                if (savedUserStr && !isLoggedOut) {
                  try {
                    const u = JSON.parse(savedUserStr);
                    if (u.isLoggedIn && (u.phone || u.email)) {
                      const hasAddr = await checkAndRedirectUserAddress(u.phone, u.email);
                      if (hasAddr) {
                        historyStackRef.current = ['home'];
                        navigateScreen('home');
                      }
                      return;
                    }
                  } catch {
                    // ignore
                  }
                }
                historyStackRef.current = ['onboarding1'];
                navigateScreen('onboarding1');
              }}
            />
          )}

          {/* Screen 02: Onboarding 1 */}
          {currentScreen === 'onboarding1' && (
            <Onboarding1Screen
              onNext={() => navigateScreen('onboarding2')}
              onSkip={() => navigateScreen('signup')}
            />
          )}

          {/* Screen 03: Onboarding 2 */}
          {currentScreen === 'onboarding2' && (
            <Onboarding2Screen
              onNext={() => navigateScreen('onboarding3')}
              onSkip={() => navigateScreen('signup')}
            />
          )}

          {/* Screen 04: Onboarding 3 */}
          {currentScreen === 'onboarding3' && (
            <Onboarding3Screen
              onNext={() => navigateScreen('signup')}
              onSkip={() => navigateScreen('signup')}
            />
          )}

          {/* Screen 05: Direct Login */}
          {currentScreen === 'signup' && (
            <SignupScreen
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onLoginSubmit={async (phone, pass) => {
                const cleanPhone = phone.trim();
                if (!cleanPhone) {
                  showAppToast('Please enter your mobile number!', 'error');
                  return;
                }
                if (!pass) {
                  showAppToast('Please enter your password!', 'error');
                  return;
                }

                try {
                  // 1. Find user email mapping from Profiles table
                  const { data: profile, error: profileErr } = await supabase
                    .from('profiles')
                    .select('email, full_name')
                    .eq('phone', cleanPhone)
                    .maybeSingle();

                  if (profileErr) {
                    console.error('Database connection error (Please run the SQL schema in Supabase Dashboard):', profileErr);
                    showAppToast('Unable to connect to the login server. Please try again in a moment.', 'error');
                    return;
                  }

                  if (!profile) {
                    showAppToast('This mobile number is not registered. Please sign up!', 'error');
                    return;
                  }

                  // 2. Authenticate with Supabase Auth
                  const { error: authErr } = await supabase.auth.signInWithPassword({
                    email: profile.email,
                    password: pass,
                  });

                  if (authErr) {
                    if (authErr.message.toLowerCase().includes('confirm') || authErr.message.toLowerCase().includes('verified')) {
                      showAppToast('Please verify your email. Also check in spam folder!', 'error');
                    } else {
                      showAppToast('Incorrect mobile number or password! If you registered recently, please verify your email and also check in spam folder.', 'error');
                    }
                    return;
                  }

                  // 3. Setup login session states
                  setPhoneNumber(cleanPhone);
                  setUserName(profile.full_name);
                  setUserEmail(profile.email);
                  setAuthMethod('manual');

                  try {
                    localStorage.setItem('meatghar_logged_out', 'false');
                    localStorage.setItem(
                      'meatghar_user',
                      JSON.stringify({
                        phone: cleanPhone,
                        userName: profile.full_name,
                        email: profile.email,
                        authMethod: 'manual',
                        isLoggedIn: true,
                        loginTime: new Date().toISOString(),
                      })
                    );
                  } catch {
                    // ignore
                  }

                  const hasAddr = await checkAndRedirectUserAddress(cleanPhone, profile.email);
                  if (hasAddr) {
                    historyStackRef.current = ['home'];
                    navigateScreen('home');
                  }
                } catch (err: any) {
                  showAppToast(`An unexpected error occurred: ${err.message || String(err)}`, 'error');
                }
              }}
              onGoogleLogin={async (customEmail, customName) => {
                if (customEmail) {
                  const finalName = customName || 'User';
                  const gUser = {
                    phone: phoneNumber || '',
                    userName: finalName,
                    email: customEmail,
                    authMethod: 'google' as const,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString(),
                  };
                  setAuthMethod('google');
                  setUserName(finalName);
                  setUserEmail(customEmail);
                  try {
                    localStorage.setItem('meatghar_user', JSON.stringify(gUser));
                  } catch {
                    // ignore
                  }
                  const hasAddr = await checkAndRedirectUserAddress(phoneNumber || '', customEmail);
                  if (hasAddr) {
                    historyStackRef.current = ['home'];
                    navigateScreen('home');
                  }
                  return;
                }

                try {
                  await signInWithGoogleAndroidAPK();
                } catch (err: unknown) {
                  console.warn('Google login popup/notice:', err);
                  showAppToast('Google Sign-In was cancelled or unavailable. Please login with mobile and password.', 'error');
                }
              }}
              onGoToSignUp={() => navigateScreen('signup_form')}
              onOpenAdmin={() => navigateScreen('admin_panel')}
            />
          )}

          {/* Screen 06: Create Account (Sign Up Form) */}
          {currentScreen === 'signup_form' && (
            <SignUpFormScreen
              onSignUpSubmit={async (data) => {
                const uName = data.fullName.trim();
                const uPhone = data.phone.trim();
                const uEmail = data.email.trim().toLowerCase();
                const uPassword = data.password;

                if (!uName || !uPhone || !uEmail || !uPassword) {
                  showAppToast('Please fill in all required fields!', 'error');
                  return;
                }

                try {
                  // 1. Sign Up inside Supabase Auth (Supabase sends verification OTP to email)
                  const { data: signUpData, error: authErr } = await supabase.auth.signUp({
                    email: uEmail,
                    password: uPassword,
                    options: {
                      data: {
                        phone: uPhone,
                        full_name: uName,
                      }
                    }
                  });

                  if (authErr) {
                    showAppToast(`Registration failed: ${authErr.message}`, 'error');
                    return;
                  }

                  // 2. Open 6-digit Email OTP Verification Modal!
                  setRegisteredEmail(uEmail);
                  setPendingSignupData({
                    phone: uPhone,
                    email: uEmail,
                    name: uName,
                    userId: signUpData.user?.id,
                  });
                  setSignupOtp('');
                  setSignupOtpError('');
                  setSignupResendCooldown(60);
                  setShowVerifyModal(true);
                } catch (err: any) {
                  showAppToast(`An error occurred during sign up: ${err.message || String(err)}`, 'error');
                }
              }}
              onGoogleLogin={async () => {
                try {
                  await signInWithGoogleAndroidAPK();
                } catch {
                  showAppToast('Google Sign-In was cancelled or unavailable. Please use mobile and password.', 'error');
                }
              }}
              onGoToLogin={() => navigateScreen('signup')}
            />
          )}

          {/* Screen 07: Location Permission */}
          {currentScreen === 'location_perm' && (
            <LocationPermissionScreen
              onBack={() => goBack()}
              onUseCurrentLocation={() => navigateScreen('location_search')}
              onEnterAddressManually={() => navigateScreen('address_form')}
            />
          )}

          {/* Screen 08: Map Location Search */}
          {currentScreen === 'location_search' && (
            <LocationSearchScreen
              onBack={() => goBack()}
              onConfirmLocation={(loc) => {
                setUserLocation(loc);
                navigateScreen('address_form');
              }}
            />
          )}

          {/* Screen: Mandatory Delivery Address Onboarding */}
          {currentScreen === 'require_address' && (
            <NoAddressOnboardingScreen
              userName={userName}
              onAddAddressClick={() => {
                navigateScreen('address_form');
              }}
            />
          )}

          {/* Screen 09: Add New Address */}
          {currentScreen === 'address_form' && (
            <AddressFormScreen
              onBack={() => {
                setEditingAddress(undefined);
                goBack();
              }}
              onSaveAddress={(saved) => {
                setEditingAddress(undefined);
                if (saved) {
                  handleUpdateLocation({
                    address: saved.address,
                    lat: saved.lat || 26.1445,
                    lng: saved.lng || 91.7362,
                    suburb: saved.locality,
                    city: saved.city || 'Guwahati',
                    postcode: saved.pincode || '781123',
                    road: saved.street,
                  });
                }
                historyStackRef.current = ['home'];
                navigateScreen('home');
                showAppToast('Delivery address saved successfully! Fresh cuts on the way.', 'success');
              }}
              locationData={userLocation}
              initialAddress={editingAddress}
              userName={userName}
              userPhone={phoneNumber}
              isFirstAddressMandatory={!editingAddress}
            />
          )}

          {/* Screen 10: Home Store */}
          {currentScreen === 'home' && (
            <HomeScreen
              onNavigateTab={handleTabNavigation}
              onSelectProduct={() => {
                setProductOriginScreen('home');
                navigateScreen('product_details');
              }}
              userLocation={userLocation}
              onUpdateLocation={handleUpdateLocation}
              onOpenMapPicker={() => navigateScreen('location_search')}
              onAddNewAddress={() => {
                setEditingAddress(undefined);
                navigateScreen('address_form');
              }}
              onEditAddress={(addr) => {
                setEditingAddress(addr);
                navigateScreen('address_form');
              }}
            />
          )}

          {/* Screen 11: Category List */}
          {currentScreen === 'category' && (
            <CategoryListScreen
              initialCategory={selectedCategoryName}
              fromOrigin={categoryOriginScreen}
              onBack={() => goBack()}
              onSelectProduct={() => {
                setProductOriginScreen(categoryOriginScreen === 'home' ? 'home' : 'category');
                navigateScreen('product_details');
              }}
              onNavigateTab={handleTabNavigation}
            />
          )}

          {/* Screen 12: Search Screen */}
          {currentScreen === 'search' && (
            <SearchScreen
              onBack={() => goBack()}
              onSelectProduct={() => {
                setProductOriginScreen('search');
                navigateScreen('product_details');
              }}
              onNavigateTab={handleTabNavigation}
            />
          )}

          {/* Screen 13: Product Details */}
          {currentScreen === 'product_details' && (
            <ProductDetailsScreen
              onBack={() => goBack()}
              onAddToCart={() => navigateScreen('cart')}
              onNavigateTab={handleTabNavigation}
            />
          )}

          {/* Screen 14: Your Cart */}
          {currentScreen === 'cart' && (
            <CartScreen
              onBack={() => goBack()}
              onProceedToCheckout={() => navigateScreen('delivery_address')}
              onNavigateTab={handleTabNavigation}
            />
          )}

          {/* Screen 15: Delivery Address */}
          {currentScreen === 'delivery_address' && (
            <DeliveryAddressScreen
              onBack={() => goBack()}
              onContinueToCheckout={(sel) => {
                if (sel) {
                  try {
                    localStorage.setItem('meatghar_checkout_address', JSON.stringify(sel));
                  } catch {
                    // ignore
                  }
                }
                navigateScreen('checkout');
              }}
              onAddNewAddress={() => {
                setEditingAddress(undefined);
                navigateScreen('address_form');
              }}
              onNavigateTab={handleTabNavigation}
              userLocation={userLocation}
            />
          )}

          {/* Screen 16: Checkout */}
          {currentScreen === 'checkout' && (
            <CheckoutScreen
              onBack={() => goBack()}
              onPlaceOrder={() => navigateScreen('order_success')}
            />
          )}

          {/* Screen 17: Order Confirmed Celebration (Green Tick Lottie) */}
          {currentScreen === 'order_success' && (
            <OrderSuccessScreen
              onTrackOrder={() => navigateScreen('track_order')}
              onViewOrderDetails={() => navigateScreen('order_details')}
            />
          )}

          {/* Screen 18: Track Order */}
          {currentScreen === 'track_order' && (
            <TrackOrderScreen
              onBack={() => navigateScreen('my_orders')}
              onArrivedOtpView={() => navigateScreen('delivery_otp')}
              onMarkDelivered={() => setIsOrderDelivered(true)}
            />
          )}

          {/* Screen 19: Delivery Handover Confirmation (No OTP) */}
          {currentScreen === 'delivery_otp' && (
            <DeliveryVerificationOtpScreen
              onBack={() => goBack()}
              onOtpConfirmedOnTime={() => {
                setIsOrderDelivered(true);
                navigateScreen('delivered_ontime');
              }}
              onOtpConfirmedLate={() => {
                setIsOrderDelivered(true);
                navigateScreen('delivered_refund');
              }}
            />
          )}

          {/* Screen 20: Order Delivered On Time */}
          {currentScreen === 'delivered_ontime' && (
            <OrderDeliveredOnTimeScreen
              onBack={() => navigateScreen('my_orders')}
              onRateOrder={() => navigateScreen('rate_order')}
              onOrderAgain={() => navigateScreen('cart')}
              onViewOrderDetails={() => navigateScreen('order_details')}
            />
          )}

          {/* Screen 21: Order Delivered Late (Guarantee Breached / Refund) */}
          {currentScreen === 'delivered_refund' && (
            <OrderDeliveredGuaranteeBreachedScreen
              onBack={() => navigateScreen('order_details')}
              onContactSupport={() => navigateScreen('help_support')}
            />
          )}

          {/* Screen 22: Rate Your Order */}
          {currentScreen === 'rate_order' && (
            <RateOrderScreen
              onBack={() => navigateScreen('my_orders')}
              onSubmitReview={() => navigateScreen('my_orders')}
            />
          )}

          {/* Screen 23: My Orders */}
          {currentScreen === 'my_orders' && (
            <MyOrdersScreen
              onBack={() => navigateScreen('home')}
              onSelectOrderDetails={(_orderId, orderObj) => {
                if (orderObj) setSelectedOrder(orderObj);
                navigateScreen('order_details');
              }}
              onNavigateTab={handleTabNavigation}
              isOrderDelivered={isOrderDelivered}
            />
          )}

          {/* Screen 24: Order Details */}
          {currentScreen === 'order_details' && (
            <OrderDetailsScreen
              onBack={() => goBack()}
              onReorder={() => navigateScreen('cart')}
              onGetHelp={() => navigateScreen('help_support')}
              order={selectedOrder}
            />
          )}

          {/* Screen 25: My Profile */}
          {currentScreen === 'my_profile' && (
            <MyProfileScreen
              userName={userName}
              userPhone={phoneNumber}
              currentAddress={userLocation.address}
              onBack={() => goBack()}
              onNavigateOption={handleProfileOptionClick}
              onLogout={handleUserLogout}
            />
          )}

          {/* Screen 26: Edit Profile */}
          {currentScreen === 'profile_edit' && (
            <EditProfileScreen
              userName={userName}
              userPhone={phoneNumber}
              userEmail={userEmail}
              authMethod={authMethod}
              onBack={() => goBack()}
              onSaveProfile={(data) => {
                setUserName(data.fullName);
                if (data.phone) setPhoneNumber(data.phone);
                if (data.email) setUserEmail(data.email);
                goBack();
              }}
            />
          )}

          {/* Screen 27: My Addresses */}
          {currentScreen === 'my_addresses' && (
            <MyAddressesScreen
              onBack={() => goBack()}
              onAddNewAddress={() => {
                setEditingAddress(undefined);
                navigateScreen('address_form');
              }}
              onEditAddress={(addr) => {
                setEditingAddress(addr);
                navigateScreen('address_form');
              }}
              onNavigateTab={handleTabNavigation}
            />
          )}

          {/* Screen 28: Notifications */}
          {currentScreen === 'notifications' && (
            <NotificationsScreen
              onBack={() => goBack()}
              onNavigateTab={handleTabNavigation}
            />
          )}

          {/* Screen 29: Help & Support */}
          {currentScreen === 'help_support' && (
            <HelpSupportScreen
              onBack={() => goBack()}
              onNavigateTab={handleTabNavigation}
            />
          )}

          {/* Screen 30: Coupons & Offers */}
          {currentScreen === 'coupons' && (
            <CouponsScreen
              onBack={() => goBack()}
              onNavigateTab={handleTabNavigation}
              onApplyCoupon={() => navigateScreen('cart')}
            />
          )}

          {/* Screen 31: Share & Earn */}
          {currentScreen === 'share' && (
            <ShareScreen
              userName={userName}
              userPhone={phoneNumber}
              onBack={() => goBack()}
              onNavigateTab={handleTabNavigation}
            />
          )}

          {/* Screen 31.5: Wallet Screen */}
          {currentScreen === 'wallet' && (
            <WalletScreen
              onBack={() => goBack()}
            />
          )}

          {/* Screen 32: Meat Ghar Admin Panel */}
          {currentScreen === 'admin_panel' && (
            <AdminPanel
              onSwitchToCustomerApp={() => navigateScreen('home')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Native Android-Style Double Back Exit Toast */}
      <AnimatePresence>
        {showExitToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none px-4 py-2 bg-slate-900/95 text-white text-[12px] font-bold rounded-full shadow-2xl backdrop-blur-md border border-white/15 flex items-center gap-2 tracking-wide whitespace-nowrap"
          >
            <div className="w-2 h-2 rounded-full bg-[#BA181B] animate-ping shrink-0" />
            <span>Press back again to exit Meat Ghar</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Closed Standby State (for browsers/PWA when window.close() is sandbox-blocked) */}
      {isAppExited && (
        <div className="fixed inset-0 bg-slate-950/98 z-[10000] flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/50 border border-red-500/30 flex items-center justify-center mb-4 shadow-lg shadow-red-950/50">
            <MeatGharLogo variant="white" size="sm" showTagline={false} />
          </div>
          <h2 className="text-lg font-black text-white mb-1">Meat Ghar Exited</h2>
          <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
            The application session was closed via device navigation back gesture.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsAppExited(false);
              historyStackRef.current = ['home'];
              navigateScreen('home');
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#BA181B] hover:bg-red-800 active:bg-red-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reopen Meat Ghar</span>
          </button>
        </div>
      )}

      {/* Custom Error/Success App-wide Toast System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-4 right-4 z-[99999] p-4 rounded-2xl shadow-2xl flex items-start gap-3 border ${
              toastType === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <span className="text-base shrink-0 mt-0.5">{toastType === 'success' ? '✓' : '⚠️'}</span>
            <div className="text-left">
              <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
            </div>
            <button 
              type="button" 
              onClick={() => setToastMessage(null)}
              className="ml-auto text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6-DIGIT EMAIL OTP VERIFICATION POPUP MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-[999999] flex items-center justify-center p-5 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 text-center animate-scale-in flex flex-col space-y-4">
            
            {/* Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#A8071A] flex items-center justify-center mx-auto text-2xl font-extrabold shadow-inner">
              ✉️
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Enter Verification Code</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                We sent a verification code to:
              </p>
              <p className="text-xs font-black text-slate-900 break-all p-2 bg-slate-50 rounded-xl border border-slate-200/80 font-mono">
                {registeredEmail}
              </p>
            </div>

            {signupOtpError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
                {signupOtpError}
              </div>
            )}

            {/* OTP input (Supports 6 to 8 digits) */}
            <div className="space-y-1">
              <input
                type="text"
                maxLength={8}
                autoFocus
                value={signupOtp}
                onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Enter code"
                className="w-full py-3 px-4 text-center tracking-[0.4em] font-mono text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-[#A8071A] focus:bg-white transition-all shadow-inner"
              />
              <p className="text-[10px] text-slate-400 font-medium pt-1">
                Enter the verification code received on your email.
              </p>
            </div>

            {/* Resend Code Button */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                disabled={signupResendCooldown > 0 || isVerifyingSignupOtp}
                onClick={async () => {
                  try {
                    setSignupOtpError('');
                    const { error } = await supabase.auth.resend({
                      type: 'signup',
                      email: registeredEmail,
                    });
                    if (error) {
                      setSignupOtpError(error.message);
                    } else {
                      setSignupResendCooldown(60);
                      showAppToast('Verification OTP resent to your email!', 'success');
                    }
                  } catch (e: any) {
                    setSignupOtpError(e.message || 'Failed to resend code');
                  }
                }}
                className="text-[11px] font-bold text-[#A8071A] hover:underline disabled:opacity-40 cursor-pointer"
              >
                {signupResendCooldown > 0
                  ? `Resend Code in ${signupResendCooldown}s`
                  : 'Didn’t receive code? Resend OTP'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowVerifyModal(false);
                  setPendingSignupData(null);
                  setSignupOtp('');
                }}
                disabled={isVerifyingSignupOtp}
                className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isVerifyingSignupOtp || signupOtp.length < 6}
                onClick={async () => {
                  if (signupOtp.length < 6) {
                    setSignupOtpError('Please enter the verification code');
                    return;
                  }
                  setIsVerifyingSignupOtp(true);
                  setSignupOtpError('');

                  try {
                    // Try type 'signup' first
                    let verifyResult = await supabase.auth.verifyOtp({
                      email: registeredEmail,
                      token: signupOtp.trim(),
                      type: 'signup',
                    });

                    // If signup type gives error, fallback to 'email'
                    if (verifyResult.error) {
                      verifyResult = await supabase.auth.verifyOtp({
                        email: registeredEmail,
                        token: signupOtp.trim(),
                        type: 'email',
                      });
                    }

                    if (verifyResult.error) {
                      setSignupOtpError(verifyResult.error.message || 'Invalid OTP code. Please check and try again.');
                      setIsVerifyingSignupOtp(false);
                      return;
                    }

                    // Verification succeeded!
                    const finalUser = pendingSignupData || {
                      phone: phoneNumber || '',
                      name: userName || 'User',
                      email: registeredEmail,
                      userId: verifyResult.data.user?.id,
                    };

                    // Upsert profile in public.profiles table
                    await supabase.from('profiles').upsert({
                      phone: finalUser.phone,
                      email: finalUser.email,
                      full_name: finalUser.name,
                      id: verifyResult.data.user?.id || finalUser.userId,
                    }, { onConflict: 'phone' });

                    // Save local session
                    const userObj = {
                      phone: finalUser.phone,
                      userName: finalUser.name,
                      email: finalUser.email,
                      authMethod: 'manual' as const,
                      isLoggedIn: true,
                      loginTime: new Date().toISOString(),
                    };
                    setPhoneNumber(finalUser.phone);
                    setUserName(finalUser.name);
                    setUserEmail(finalUser.email);
                    setAuthMethod('manual');
                    try {
                      localStorage.setItem('meatghar_logged_out', 'false');
                      localStorage.setItem('meatghar_user', JSON.stringify(userObj));
                    } catch {
                      // ignore
                    }

                    setShowVerifyModal(false);
                    setPendingSignupData(null);
                    setSignupOtp('');
                    showAppToast('Account verified successfully! Please add your delivery address.', 'success');
                    historyStackRef.current = ['require_address'];
                    navigateScreen('require_address');
                  } catch (err: any) {
                    setSignupOtpError(err.message || 'Verification failed. Please try again.');
                  } finally {
                    setIsVerifyingSignupOtp(false);
                  }
                }}
                className="flex-1 py-3 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isVerifyingSignupOtp ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify &amp; Enter</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileFrame>
    </CartProvider>
  );
}
