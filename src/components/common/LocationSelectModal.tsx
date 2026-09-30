import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  X,
  Plus,
  Home,
  Briefcase,
  Building,
  Check,
  Phone,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { LocationData, SavedAddress } from '../../types/location';
import {
  fetchUserAddresses,
  deleteUserAddress,
  getCurrentUserIdentifier,
} from '../../lib/addressService';

export interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onAddNewAddress?: () => void;
  onEditAddress?: (addr: SavedAddress) => void;
}

export const LocationSelectModal: React.FC<LocationSelectModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onAddNewAddress,
  onEditAddress,
}) => {
  // 1. Instant cached addresses from localStorage (Zero delay)
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

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const def = addresses.find((a) => a.isDefault) || addresses[0];
    return def ? def.id : '';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<SavedAddress | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Background fetch to keep synced with Supabase
  const loadAddresses = useCallback(async () => {
    try {
      const userIdent = getCurrentUserIdentifier();
      const list = await fetchUserAddresses(userIdent);
      if (list && Array.isArray(list)) {
        setAddresses(list);
        if (list.length > 0 && !selectedAddressId) {
          const def = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(def.id);
        }
      }
    } catch (err) {
      console.warn('Sync address notice:', err);
    }
  }, [selectedAddressId]);

  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    }
  }, [isOpen, loadAddresses]);

  if (!isOpen) return null;

  const handleSelectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    const loc: LocationData = {
      address: addr.address,
      lat: addr.lat || 26.1445,
      lng: addr.lng || 91.7362,
      suburb: addr.locality || addr.street || addr.city,
      city: addr.city || 'Guwahati',
      state: addr.state || 'Assam',
      postcode: addr.pincode || '781123',
      road: addr.street,
    };
    onSelectLocation(loc);
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUserAddress(addressToDelete.id);
      const updated = addresses.filter((a) => a.id !== addressToDelete.id);
      setAddresses(updated);
      try {
        localStorage.setItem('meatghar_user_addresses', JSON.stringify(updated));
      } catch {
        // ignore
      }
      if (selectedAddressId === addressToDelete.id && updated[0]) {
        handleSelectAddress(updated[0]);
      }
      setAddressToDelete(null);
    } catch (err) {
      console.warn('Failed to delete address:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs select-none">
        {/* Backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative bg-white rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl z-10 overflow-hidden font-sans"
        >
          {/* Top subtle handle */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 shrink-0" />

          {/* Header */}
          <div className="px-4 pt-2.5 pb-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-50 text-[#A8071A] flex items-center justify-center">
                <MapPin className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                  Select Delivery Address
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Choose where you want your order delivered
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* Saved Addresses List (Instantly available from Cache) */}
          <div className="overflow-y-auto px-4 py-3 space-y-2.5 no-scrollbar max-h-[60vh]">
            {addresses.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#A8071A] flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800">No Saved Addresses Found</p>
                <p className="text-[11px] text-slate-500 mt-1 mb-3">
                  Please add your delivery address to start getting fresh halal meat.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onAddNewAddress) onAddNewAddress();
                  }}
                  className="inline-flex items-center gap-1.5 py-2 px-4 bg-[#A8071A] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Delivery Address</span>
                </button>
              </div>
            ) : (
              addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                const isDefaultAddress = Boolean(addr.isDefault);
                const IconComp =
                  addr.type === 'Home'
                    ? Home
                    : addr.type === 'Work'
                    ? Briefcase
                    : Building;

                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#A8071A] bg-red-50/40 ring-1 ring-[#A8071A]/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: Type & Radio */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`p-1.5 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#A8071A] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5 stroke-[2]" />
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              {addr.fullName || 'Customer'}
                            </span>
                            {isDefaultAddress && (
                              <span className="bg-amber-100 text-amber-900 text-[9.5px] font-bold px-1.5 py-0.2 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-slate-500 font-medium">
                            {addr.customType || addr.type}
                          </span>
                        </div>
                      </div>

                      {/* Radio Selection Icon */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#A8071A] bg-[#A8071A] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Address Text */}
                    <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed pl-7 mt-1.5">
                      {addr.houseFlat}, {addr.street ? `${addr.street}, ` : ''}{addr.locality}
                      {addr.landmark ? `, Near ${addr.landmark}` : ''}, {addr.city || 'Guwahati'}
                    </p>

                    {/* Phone Number */}
                    {(addr.phone || addr.altPhone) && (
                      <div className="mt-1 pl-7 flex items-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
                        <Phone className="w-3 h-3 text-[#A8071A]" />
                        <span>Phone / Alt: {addr.phone || addr.altPhone}</span>
                      </div>
                    )}

                    {/* Actions: Edit & Delete */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between pl-7">
                      <span className="text-[10.5px] text-emerald-700 font-bold">
                        ✓ Delivery Available
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            if (onEditAddress) {
                              onEditAddress(addr);
                            }
                          }}
                          className="text-[11px] font-bold text-slate-700 hover:text-[#A8071A] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {/* Delete button: ONLY show on non-default addresses */}
                        {!isDefaultAddress && (
                          <>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddressToDelete(addr);
                              }}
                              className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add New Address Button */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onAddNewAddress) onAddNewAddress();
              }}
              className="w-full py-3 bg-[#A8071A] hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add New Address</span>
            </button>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {addressToDelete && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl text-center border border-slate-100 space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
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
                    disabled={isDeleting}
                    className="py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60 transition-colors"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Confirm</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
