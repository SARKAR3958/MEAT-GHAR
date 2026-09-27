import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, RotateCcw, EyeOff, SlidersHorizontal } from 'lucide-react';

export type ScreenType =
  | 'splash'
  | 'onboarding1'
  | 'onboarding2'
  | 'onboarding3'
  | 'signup'
  | 'signup_form'
  | 'location_perm'
  | 'location_search'
  | 'address_form'
  | 'home'
  | 'category'
  | 'search'
  | 'product_details'
  | 'cart'
  | 'delivery_address'
  | 'checkout'
  | 'order_success'
  | 'track_order'
  | 'delivery_otp'
  | 'delivered_ontime'
  | 'delivered_refund'
  | 'rate_order'
  | 'my_orders'
  | 'order_details'
  | 'my_profile'
  | 'profile_edit'
  | 'my_addresses'
  | 'notifications'
  | 'help_support'
  | 'coupons';

interface MobileFrameProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  currentScreen,
  setScreen,
  children,
}) => {
  const [isFrameEnabled, setIsFrameEnabled] = useState(true);
  const [isClientDemoMode, setIsClientDemoMode] = useState(false);
  const [isNativeMobile, setIsNativeMobile] = useState(false);

  useEffect(() => {
    // Detect mobile viewport or standalone display (like installed PWA or APK WebView)
    const checkMobile = () => {
      const isSmallScreen = window.innerWidth <= 640;
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsNativeMobile(isSmallScreen || isStandalone);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const screensList: { id: ScreenType; label: string; number: string }[] = [
    { id: 'splash', label: '01. Splash', number: '01' },
    { id: 'onboarding1', label: '02. Onboarding 1', number: '02' },
    { id: 'onboarding2', label: '03. Onboarding 2', number: '03' },
    { id: 'onboarding3', label: '04. Onboarding 3', number: '04' },
    { id: 'signup', label: '05. Direct Login', number: '05' },
    { id: 'signup_form', label: '06. Create Account', number: '06' },
    { id: 'location_perm', label: '07. Location Access', number: '07' },
    { id: 'location_search', label: '08. Map Pin', number: '08' },
    { id: 'address_form', label: '09. Add Address', number: '09' },
    { id: 'home', label: '10. Home Store', number: '10' },
    { id: 'category', label: '11. Category List', number: '11' },
    { id: 'search', label: '12. Search Screen', number: '12' },
    { id: 'product_details', label: '13. Product Details', number: '13' },
    { id: 'cart', label: '14. Your Cart', number: '14' },
    { id: 'delivery_address', label: '15. Delivery Address', number: '15' },
    { id: 'checkout', label: '16. Checkout', number: '16' },
    { id: 'order_success', label: '17. Order Confirmed', number: '17' },
    { id: 'track_order', label: '18. Track Order', number: '18' },
    { id: 'delivery_otp', label: '19. Delivery Confirmation', number: '19' },
    { id: 'delivered_ontime', label: '20. Delivered (On Time)', number: '20' },
    { id: 'delivered_refund', label: '21. Late (Refund)', number: '21' },
    { id: 'rate_order', label: '22. Rate Order', number: '22' },
    { id: 'my_orders', label: '23. My Orders', number: '23' },
    { id: 'order_details', label: '24. Order Details', number: '24' },
    { id: 'my_profile', label: '25. My Profile', number: '25' },
    { id: 'my_addresses', label: '26. My Addresses', number: '26' },
    { id: 'notifications', label: '27. Notifications', number: '27' },
    { id: 'help_support', label: '28. Help & Support', number: '28' },
  ];

  // If in native mobile mode or APK, render full screen directly without frame wrappers
  if (isNativeMobile) {
    return (
      <div className="w-full min-h-screen bg-white text-slate-800 flex flex-col relative overflow-x-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center selection:bg-red-500 selection:text-white">
      {/* Top Reviewer Controls / Screen Selector Bar (Hidable in Client Demo Mode) */}
      {!isClientDemoMode ? (
        <header className="w-full bg-slate-950 border-b border-slate-800 py-2 px-4 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Logo & App Info */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#A8071A] text-white font-black flex items-center justify-center text-xs shadow-inner">
                MG
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white tracking-wide">Meat Ghar</span>
                  <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-800/50 px-2 py-0.5 rounded-full font-medium">
                    Customer App
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Click any screen tab to preview flow
                </p>
              </div>
            </div>

            {/* Quick Screen Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 no-scrollbar max-w-full sm:max-w-3xl">
              {screensList.map((screen) => {
                const isActive = currentScreen === screen.id;
                return (
                  <button
                    key={screen.id}
                    onClick={() => setScreen(screen.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#A8071A] text-white shadow-sm ring-1 ring-red-400'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${
                        isActive ? 'bg-white text-[#A8071A]' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {screen.number}
                    </span>
                    <span>{screen.label.split('. ')[1]}</span>
                  </button>
                );
              })}
            </div>

            {/* Frame Controls & Client Demo Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setScreen('splash')}
                className="p-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                title="Restart Onboarding Flow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Restart</span>
              </button>

              <button
                onClick={() => setIsFrameEnabled(!isFrameEnabled)}
                className="p-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg hidden sm:flex items-center gap-1 transition-colors cursor-pointer"
                title="Toggle Smartphone Frame View"
              >
                {isFrameEnabled ? (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-red-400" />
                    <span>Full View</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Phone Frame</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsClientDemoMode(true)}
                className="py-1.5 px-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Hide top bar for client demonstration"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Client Demo View</span>
              </button>
            </div>
          </div>
        </header>
      ) : (
        /* Floating Pill to exit Client Demo Mode if needed */
        <div className="fixed top-3 right-3 z-50">
          <button
            onClick={() => setIsClientDemoMode(false)}
            className="px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white backdrop-blur-md rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-xl border border-slate-700/60 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-400" />
            <span>Show Screen Tabs</span>
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 w-full flex items-center justify-center py-4 sm:py-8 px-2 sm:px-4">
        {isFrameEnabled ? (
          /* Modern Clean Smartphone Preview */
          <div className="relative w-full max-w-[400px] h-[840px] bg-slate-950 rounded-[44px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-2 border-slate-700/80 ring-1 ring-slate-600/30 flex flex-col overflow-hidden transition-all duration-300">
            {/* Phone Outer Body */}
            <div className="relative w-full h-full bg-white rounded-[34px] overflow-hidden flex flex-col shadow-inner">
              {/* Phone Content Canvas */}
              <div className="w-full h-full flex flex-col overflow-hidden relative">
                {children}
              </div>
            </div>
          </div>
        ) : (
          /* Clean Card View */
          <div className="w-full max-w-[420px] min-h-[800px] bg-white rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800">
            {children}
          </div>
        )}
      </main>

      {/* Footer info */}
      {!isClientDemoMode && (
        <footer className="w-full py-2 px-4 bg-slate-950 text-slate-500 text-xs text-center border-t border-slate-800/80">
          <span>Meat Ghar &copy; Pure Fresh Cuts & Express Delivery</span>
        </footer>
      )}
    </div>
  );
};
