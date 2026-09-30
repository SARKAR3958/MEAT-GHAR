import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  MapPin,
  Trash2,
  Plus,
  Truck,
  ArrowRight,
  Home,
  Briefcase,
  MoreHorizontal,
  Grid,
  ShoppingBag,
  User,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { SavedAddress, LocationData } from '../../types/location';
import {
  fetchUserAddresses,
  deleteUserAddress,
  getCurrentUserIdentifier,
} from '../../lib/addressService';

interface DeliveryAddressScreenProps {
  onBack: () => void;
  onContinueToCheckout: (selectedAddress?: SavedAddress) => void;
  onAddNewAddress: () => void;
  onNavigateTab: (tab: string) => void;
  userLocation?: LocationData;
}

export const DeliveryAddressScreen: React.FC<DeliveryAddressScreenProps> = ({
  onBack,
  onContinueToCheckout,
  onAddNewAddress,
  onNavigateTab,
  userLocation,
}) => {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const userIdent = getCurrentUserIdentifier();
      const list = await fetchUserAddresses(userIdent);
      setAddresses(list);
      if (list.length > 0) {
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (err) {
      console.warn('Error loading addresses from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this saved address?')) {
      setIsDeletingId(id);
      try {
        await deleteUserAddress(id);
        const remaining = addresses.filter((a) => a.id !== id);
        setAddresses(remaining);
        if (selectedAddressId === id && remaining.length > 0) {
          setSelectedAddressId(remaining[0].id);
        }
      } catch (err) {
        console.warn('Failed to delete address:', err);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'Home':
        return Home;
      case 'Work':
        return Briefcase;
      default:
        return MoreHorizontal;
    }
  };

  const selectedAddr = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleContinue = () => {
    if (selectedAddr) {
      try {
        localStorage.setItem('meatghar_checkout_address', JSON.stringify(selectedAddr));
      } catch {
        // ignore
      }
      onContinueToCheckout(selectedAddr);
    } else {
      onAddNewAddress();
    }
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-extrabold text-slate-900">Delivery Address</h2>
        </div>

        <HeaderMeatGharLogo />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar pb-28">
        {/* Top Current Area Selector Banner */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-50 text-[#A8071A] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 fill-[#A8071A]" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 font-medium">Deliver to</span>
            <p className="text-xs font-extrabold text-slate-900 truncate">
              {selectedAddr?.locality || selectedAddr?.city || userLocation?.suburb || userLocation?.city || 'Select Address'}
            </p>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-slate-900">Saved Addresses (Supabase)</h3>
            <span onClick={onAddNewAddress} className="text-[11px] font-bold text-[#A8071A] cursor-pointer">
              + Add New
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#A8071A]" />
              <span className="text-xs font-medium">Loading addresses from your account...</span>
            </div>
          ) : addresses.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#A8071A] flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 mb-1">No Saved Addresses Found</h4>
              <p className="text-[11px] text-slate-500 mb-4">
                Please add a delivery address to complete your order.
              </p>
              <button
                onClick={onAddNewAddress}
                className="w-full py-2.5 px-4 bg-[#A8071A] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Delivery Address</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => {
                const IconComponent = getAddressIcon(addr.type);
                const isSelected = selectedAddressId === addr.id;
                const isDeleting = isDeletingId === addr.id;

                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer relative shadow-2xs ${
                      isSelected ? 'border-[#A8071A] ring-2 ring-red-500/10' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-50 text-[#A8071A] p-1.5 rounded-lg">
                          <IconComponent className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">{addr.type}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-red-100 text-[#A8071A] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Default
                          </span>
                        )}
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#A8071A] bg-[#A8071A]' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div className="mt-2.5">
                      {addr.fullName && <p className="text-xs font-bold text-slate-900">{addr.fullName}</p>}
                      {addr.phone && <p className="text-[11px] text-slate-500 font-medium">📞 {addr.phone}</p>}
                      <p className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                        📍 {addr.address}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs font-bold">
                      <span className="text-[10px] text-emerald-600 font-bold">✓ Ready for delivery</span>
                      <button
                        onClick={(e) => handleDelete(addr.id, e)}
                        disabled={isDeleting}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add New Address Button */}
              <button
                onClick={onAddNewAddress}
                className="w-full mt-3 py-3 px-4 bg-white border-2 border-[#A8071A] text-[#A8071A] hover:bg-red-50 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Address</span>
              </button>
            </div>
          )}
        </div>

        {/* Delivery Information Box */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3.5 space-y-2">
          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#A8071A]" />
            <span>Delivery Information</span>
          </h4>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] text-slate-400 font-semibold block">Store Distance</span>
              <span className="text-xs font-black text-slate-900">~2.8 KM</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] text-slate-400 font-semibold block">Delivery Fee</span>
              <span className="text-xs font-black text-emerald-600">FREE</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] text-slate-400 font-semibold block">Guarantee</span>
              <span className="text-xs font-black text-emerald-600 flex items-center justify-center gap-0.5">
                70-min ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Button */}
      <div className="absolute bottom-12 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl">
        <button
          onClick={handleContinue}
          className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{addresses.length > 0 ? 'Continue to Checkout' : 'Add Address & Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around z-20">
        <button onClick={() => onNavigateTab('home')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button onClick={() => onNavigateTab('category')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Categories</span>
        </button>
        <button onClick={() => onNavigateTab('orders')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Orders</span>
        </button>
        <button onClick={() => onNavigateTab('cart')} className="flex flex-col items-center gap-0.5 text-[#A8071A] relative cursor-pointer">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">Cart</span>
        </button>
        <button onClick={() => onNavigateTab('profile')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </div>
    </div>
  );
};
