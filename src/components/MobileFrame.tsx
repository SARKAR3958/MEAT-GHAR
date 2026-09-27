import React from 'react';

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
  currentScreen?: ScreenType;
  setScreen?: (screen: ScreenType) => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-white text-slate-800 flex flex-col items-center justify-start overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Container adapts directly to full width on mobile/tablet or clean max-w on larger displays */}
      <div className="w-full max-w-lg min-h-screen bg-white flex flex-col relative overflow-x-hidden shadow-none md:shadow-xl border-none">
        {children}
      </div>
    </div>
  );
};
