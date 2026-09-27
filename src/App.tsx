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
import { LocationData } from './types/location';
import { preloadAllImages } from './utils/preloadAssets';
import { MeatGharLogo } from './components/MeatGharLogo';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [userName, setUserName] = useState('Rahul Sharma');
  const [userEmail, setUserEmail] = useState('rahul.sharma@example.com');
  const [authMethod, setAuthMethod] = useState<'manual' | 'google'>('manual');
  const [isOrderDelivered, setIsOrderDelivered] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [productOriginScreen, setProductOriginScreen] = useState<ScreenType>('home');
  const [userLocation, setUserLocation] = useState<LocationData>({
    address: 'MG Road, Sector 10, Noida, Uttar Pradesh, 201301',
    lat: 28.5900,
    lng: 77.3300,
    road: 'MG Road',
    suburb: 'Sector 10',
    city: 'Noida',
    state: 'Uttar Pradesh',
    postcode: '201301',
  });

  // Track screen navigation history stack for Android hardware/navigation bar back button
  const historyStackRef = useRef<ScreenType[]>(['splash']);
  const lastBackPressTimeRef = useRef<number>(0);
  const toastTimeoutRef = useRef<number | null>(null);
  const [showExitToast, setShowExitToast] = useState(false);
  const [isAppExited, setIsAppExited] = useState(false);

  // Load saved user profile from localStorage if exists
  useEffect(() => {
    try {
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
      window.history.pushState({ screen: nextScreen }, '');
    } catch {
      // ignore
    }
    historyStackRef.current.push(nextScreen);
    setCurrentScreen(nextScreen);
  }, [currentScreen]);

  const goBack = useCallback(() => {
    if (historyStackRef.current.length > 1) {
      window.history.back();
    } else if (currentScreen !== 'home') {
      navigateScreen('home');
    } else {
      handleRootBack();
    }
  }, [currentScreen, handleRootBack, navigateScreen]);

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
    } else if (tab === 'category' || tab === 'categories') {
      setSelectedCategoryName(null);
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
      case 'cart':
        navigateScreen('cart');
        break;
      case 'orders':
      case 'my_orders':
        navigateScreen('my_orders');
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
              onNext={() => {
                historyStackRef.current = ['signup'];
                navigateScreen('signup');
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
              onLoginSubmit={(phone) => {
                const uName = phone.slice(-4) ? `Customer ${phone.slice(-4)}` : 'Customer';
                setPhoneNumber(phone);
                setUserName(uName);
                setAuthMethod('manual');
                try {
                  localStorage.setItem(
                    'meatghar_user',
                    JSON.stringify({
                      phone,
                      userName: uName,
                      email: `${phone.replace(/\s+/g, '')}@meatghar.in`,
                      authMethod: 'manual',
                      isLoggedIn: true,
                      loginTime: new Date().toISOString(),
                    })
                  );
                } catch {
                  // ignore
                }
                historyStackRef.current = ['home'];
                navigateScreen('home');
              }}
              onGoogleLogin={() => {
                const gUser = {
                  phone: phoneNumber || '9876543210',
                  userName: 'Rahul Sharma',
                  email: 'rahul.google@gmail.com',
                  authMethod: 'google',
                  isLoggedIn: true,
                  loginTime: new Date().toISOString(),
                };
                setAuthMethod('google');
                setUserName('Rahul Sharma');
                setUserEmail('rahul.google@gmail.com');
                try {
                  localStorage.setItem('meatghar_user', JSON.stringify(gUser));
                } catch {
                  // ignore
                }
                historyStackRef.current = ['home'];
                navigateScreen('home');
              }}
              onGoToSignUp={() => navigateScreen('signup_form')}
            />
          )}

          {/* Screen 06: Create Account (Sign Up Form) */}
          {currentScreen === 'signup_form' && (
            <SignUpFormScreen
              onSignUpSubmit={(data) => {
                const uName = data.fullName || 'Customer';
                const uPhone = data.phone || phoneNumber;
                const uEmail = data.email || `${uPhone}@meatghar.in`;
                setUserName(uName);
                setPhoneNumber(uPhone);
                setUserEmail(uEmail);
                setAuthMethod('manual');
                try {
                  localStorage.setItem(
                    'meatghar_user',
                    JSON.stringify({
                      userName: uName,
                      phone: uPhone,
                      email: uEmail,
                      authMethod: 'manual',
                      isLoggedIn: true,
                      loginTime: new Date().toISOString(),
                    })
                  );
                } catch {
                  // ignore
                }
                historyStackRef.current = ['home'];
                navigateScreen('home');
              }}
              onGoogleLogin={() => {
                const gUser = {
                  phone: phoneNumber || '9876543210',
                  userName: 'Rahul Sharma',
                  email: 'rahul.google@gmail.com',
                  authMethod: 'google',
                  isLoggedIn: true,
                  loginTime: new Date().toISOString(),
                };
                setAuthMethod('google');
                setUserName('Rahul Sharma');
                setUserEmail('rahul.google@gmail.com');
                try {
                  localStorage.setItem('meatghar_user', JSON.stringify(gUser));
                } catch {
                  // ignore
                }
                historyStackRef.current = ['home'];
                navigateScreen('home');
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

          {/* Screen 09: Add New Address */}
          {currentScreen === 'address_form' && (
            <AddressFormScreen
              onBack={() => goBack()}
              onSaveAddress={() => navigateScreen('home')}
              locationData={userLocation}
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
            />
          )}

          {/* Screen 11: Category List */}
          {currentScreen === 'category' && (
            <CategoryListScreen
              initialCategory={selectedCategoryName}
              onBack={() => goBack()}
              onSelectProduct={() => {
                setProductOriginScreen('category');
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
              onContinueToCheckout={() => navigateScreen('checkout')}
              onAddNewAddress={() => navigateScreen('address_form')}
              onNavigateTab={handleTabNavigation}
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
              onSelectOrderDetails={() => navigateScreen('order_details')}
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
              onLogout={() => navigateScreen('signup')}
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
              onAddNewAddress={() => navigateScreen('address_form')}
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
    </MobileFrame>
  );
}
