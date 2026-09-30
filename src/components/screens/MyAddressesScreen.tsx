import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  MapPin,
  Home,
  Briefcase,
  MoreHorizontal,
  Edit2,
  Trash2,
  Plus,
  Info,
  Grid,
  ShoppingCart,
  ClipboardList,
  User,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { useCart } from '../../context/CartContext';
import { SavedAddress } from '../../types/location';
import {
  fetchUserAddresses,
  deleteUserAddress,
  setDefaultUserAddress,
  getCurrentUserIdentifier,
} from '../../lib/addressService';

interface MyAddressesScreenProps {
  onBack: () => void;
  onAddNewAddress: () => void;
  onNavigateTab: (tab: string) => void;
  onEditAddress?: (address: SavedAddress) => void;
}

export const MyAddressesScreen: React.FC<MyAddressesScreenProps> = ({
  onBack,
  onAddNewAddress,
  onNavigateTab,
  onEditAddress,
}) => {
  const { cartCount } = useCart();
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    try {
      const cached = localStorage.getItem('meatghar_user_addresses');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<SavedAddress | null>(null);

  const loadAddresses = useCallback(async () => {
    try {
      const userIdent = getCurrentUserIdentifier();
      const data = await fetchUserAddresses(userIdent);
      setAddresses(data);
    } catch (err) {
      console.warn('Error fetching addresses from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this address?')) {
      setActionLoadingId(id);
      try {
        await deleteUserAddress(id);
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.warn('Failed to delete address:', err);
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleSetDefault = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoadingId(id);
    try {
      await setDefaultUserAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
    } catch (err) {
      console.warn('Failed to set default address:', err);
    } finally {
      setActionLoadingId(null);
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

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. FIXED TOP HEADER (Never scrolls) */}
      <div className="shrink-0 bg-white px-4 pt-3 pb-3 border-b border-slate-200/90 shadow-2xs z-30">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#BA181B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="text-base font-black text-slate-900 leading-tight">My Addresses</h2>
          </div>

          <HeaderMeatGharLogo />
        </div>
        <p className="text-xs text-slate-500 font-medium">Manage delivery locations fetched from your account.</p>
      </div>

      {/* 2. SCROLLABLE CONTENT ONLY */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar pb-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#BA181B]" />
            <span className="text-xs font-semibold">Fetching your addresses from Supabase...</span>
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs my-2">
            <div className="w-14 h-14 rounded-full bg-red-50 text-[#BA181B] flex items-center justify-center mb-3">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">No Saved Addresses Found</h3>
            <p className="text-xs text-slate-500 mb-5 max-w-[240px] leading-relaxed">
              You haven't added any delivery addresses to your account yet. Add an address to start ordering.
            </p>
            <button
              onClick={onAddNewAddress}
              className="py-3 px-5 bg-[#BA181B] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Address</span>
            </button>
          </div>
        ) : (
          <>
            {addresses.map((item) => {
              const IconComponent = getAddressIcon(item.type);
              const isBusy = actionLoadingId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-3.5 border shadow-2xs relative transition-all ${
                    item.isDefault ? 'border-[#BA181B]/80 ring-1 ring-[#BA181B]/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          item.isDefault ? 'bg-red-50 text-[#BA181B]' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-slate-900 text-xs">{item.type}</span>
                      {item.isDefault && (
                        <span className="text-[9px] bg-red-100 text-[#BA181B] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Default
                        </span>
                      )}
                    </div>

                    {!item.isDefault && (
                      <button
                        onClick={(e) => handleSetDefault(item.id, e)}
                        disabled={isBusy}
                        className="text-[10px] font-bold text-slate-500 hover:text-[#BA181B] transition-colors cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <div className="space-y-0.5 mb-2.5">
                    {item.fullName && <p className="text-xs font-bold text-slate-800">{item.fullName}</p>}
                    {item.phone && <p className="text-xs text-slate-500">📞 {item.phone}</p>}
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">📍 {item.address}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-xs font-semibold">
                    {onEditAddress && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditAddress(item)}
                          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <span className="text-slate-300">|</span>
                      </>
                    )}
                    {!item.isDefault && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddressToDelete(item);
                        }}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 cursor-pointer disabled:opacity-50"
                      >
                        {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add New Address Button */}
            <button
              onClick={onAddNewAddress}
              className="w-full py-3 px-6 bg-[#BA181B] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </>
        )}

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium justify-center pt-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>All addresses are securely synced with your account.</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {addressToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl text-center border border-slate-100 space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">Delete Address?</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Are you sure you want to delete this address? Please confirm.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-[11px] text-slate-700 font-medium">
              <p className="font-bold text-slate-900 line-clamp-1">{addressToDelete.fullName}</p>
              <p className="line-clamp-2 text-slate-500 mt-0.5">{addressToDelete.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!addressToDelete) return;
                  setActionLoadingId(addressToDelete.id);
                  try {
                    await deleteUserAddress(addressToDelete.id);
                    setAddresses((prev) => prev.filter((a) => a.id !== addressToDelete.id));
                  } catch (err) {
                    console.warn('Failed to delete address:', err);
                  } finally {
                    setActionLoadingId(null);
                    setAddressToDelete(null);
                  }
                }}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FIXED BOTTOM NAVIGATION BAR (Never scrolls) */}
      <div className="shrink-0 bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 shadow-md">
        <button onClick={() => onNavigateTab('home')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Home</span>
        </button>
        <button onClick={() => onNavigateTab('category')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Categories</span>
        </button>
        <button onClick={() => onNavigateTab('orders')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
          <ClipboardList className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold text-slate-500">Orders</span>
        </button>
        <button onClick={() => onNavigateTab('cart')} className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 relative cursor-pointer">
          <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#BA181B] text-white text-[9px] font-bold flex items-center justify-center border-1.5 border-white shadow-2xs">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-semibold text-slate-500">Cart</span>
        </button>
        <button onClick={() => onNavigateTab('profile')} className="flex flex-col items-center gap-0.5 text-[#BA181B] cursor-pointer">
          <User className="w-5 h-5 text-[#BA181B] stroke-[#BA181B] stroke-[2.2]" />
          <span className="text-[10px] font-bold text-[#BA181B]">Profile</span>
          <div className="w-7 h-[2.5px] bg-[#BA181B] rounded-full absolute -bottom-1.5" />
        </button>
      </div>
    </div>
  );
};
