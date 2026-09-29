import React, { useState, useEffect } from 'react';
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
  Tag,
  ArrowLeft,
  Edit2,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { LocationData, SavedAddress } from '../../types/location';

export interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
}

const CITY_OPTIONS = [
  'Noida',
  'Greater Noida',
  'New Delhi',
  'South Delhi',
  'East Delhi',
  'West Delhi',
  'Gurugram',
  'Ghaziabad',
  'Faridabad',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Chandigarh',
];

const DEFAULT_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr_1',
    type: 'Home',
    fullName: 'Home - Rahul',
    phone: '98765 43210',
    altPhone: '98123 45678',
    houseFlat: 'Flat No. 402, 4th Floor, Block B',
    street: 'Green Valley Heights, MG Road',
    locality: 'Sector 10',
    landmark: 'Near City Park Metro Station',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    isDefault: true,
    address: 'Flat No. 402, Block B, Green Valley Heights, MG Road, Sector 10, Noida',
    lat: 28.5900,
    lng: 77.3300,
  },
  {
    id: 'addr_2',
    type: 'Work',
    fullName: 'Office Desk',
    phone: '98765 43210',
    altPhone: '',
    houseFlat: 'Tower B, 5th Floor',
    street: 'Cyber City, Sector 24',
    locality: 'DLF Phase 2',
    landmark: 'Opposite Cyber Hub',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    isDefault: false,
    address: 'Tower B, 5th Floor, Cyber City, DLF Phase 2, Gurugram',
    lat: 28.4900,
    lng: 77.0900,
  },
  {
    id: 'addr_3',
    type: 'Other',
    customType: 'Parents',
    fullName: 'Parents House',
    phone: '98990 12345',
    altPhone: '98765 43210',
    houseFlat: 'House No. 12B, Villa Pocket',
    street: 'Shipra Suncity, Indirapuram',
    locality: 'Ahinsa Khand 2',
    landmark: 'Near Shipra Mall',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201014',
    isDefault: false,
    address: 'House No. 12B, Shipra Suncity, Ahinsa Khand 2, Indirapuram, Ghaziabad',
    lat: 28.6400,
    lng: 77.3700,
  },
];

export const LocationSelectModal: React.FC<LocationSelectModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem('meatghar_saved_addresses_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_SAVED_ADDRESSES;
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const match = addresses.find(
      (a) =>
        a.address.toLowerCase().includes(currentLocation.suburb?.toLowerCase() || '') ||
        a.locality.toLowerCase().includes(currentLocation.suburb?.toLowerCase() || '')
    );
    return match ? match.id : addresses[0]?.id || 'addr_1';
  });

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form states with normal weights and requested field structure
  const [formType, setFormType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [formCustomType, setFormCustomType] = useState('');
  const [formAddressName, setFormAddressName] = useState('My Home');
  const [formAltPhone, setFormAltPhone] = useState('');
  const [formHouseFlat, setFormHouseFlat] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [formLocality, setFormLocality] = useState('');
  const [formLandmark, setFormLandmark] = useState('');
  const [formCity, setFormCity] = useState('Noida');
  const [formIsDefault, setFormIsDefault] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setViewMode('list');
    }
  }, [isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('meatghar_saved_addresses_v3', JSON.stringify(addresses));
    } catch {
      // ignore
    }
  }, [addresses]);

  const handleClose = () => {
    setViewMode('list');
    setEditingAddressId(null);
    setFormError(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setViewMode('list');
      setEditingAddressId(null);
      setFormError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenAddForm = () => {
    setEditingAddressId(null);
    setFormType('Home');
    setFormCustomType('');
    setFormAddressName('My Home');
    setFormAltPhone('');
    setFormHouseFlat('');
    setFormStreet('');
    setFormLocality('');
    setFormLandmark('');
    setFormCity('Noida');
    setFormIsDefault(addresses.length === 0);
    setFormError(null);
    setViewMode('form');
  };

  const handleOpenEditForm = (addr: SavedAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setFormType(addr.type);
    setFormCustomType(addr.customType || '');
    setFormAddressName(addr.fullName || 'My Address');
    setFormAltPhone(addr.altPhone || addr.phone || '');
    setFormHouseFlat(addr.houseFlat);
    setFormStreet(addr.street);
    setFormLocality(addr.locality);
    setFormLandmark(addr.landmark || '');
    setFormCity(addr.city || 'Noida');
    setFormIsDefault(!!addr.isDefault);
    setFormError(null);
    setViewMode('form');
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (addresses.length <= 1) {
      alert('You must have at least one delivery address.');
      return;
    }
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    if (selectedAddressId === id && updated[0]) {
      handleSelectAddress(updated[0]);
    }
  };

  const handleSelectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    const loc: LocationData = {
      address: addr.address,
      lat: addr.lat || 28.5900,
      lng: addr.lng || 77.3300,
      suburb: addr.locality || addr.street || addr.city,
      city: addr.city,
      state: addr.state || 'Delhi NCR',
      postcode: addr.pincode || '201301',
      road: addr.street,
    };
    onSelectLocation(loc);
    onClose();
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAddressName.trim()) {
      setFormError('Please enter address name');
      return;
    }
    if (!formHouseFlat.trim()) {
      setFormError('Please enter flat / house / floor details');
      return;
    }
    if (!formStreet.trim()) {
      setFormError('Please enter street / road / apartment name');
      return;
    }
    if (!formLocality.trim()) {
      setFormError('Please enter locality / sector');
      return;
    }
    if (!formCity.trim()) {
      setFormError('Please select a city');
      return;
    }

    const constructedAddress = [
      formHouseFlat.trim(),
      formStreet.trim(),
      formLocality.trim(),
      formLandmark.trim() ? `Near ${formLandmark.trim()}` : null,
      formCity.trim(),
    ]
      .filter(Boolean)
      .join(', ');

    if (editingAddressId) {
      const updated = addresses.map((a) => {
        if (a.id === editingAddressId) {
          return {
            ...a,
            type: formType,
            customType: formType === 'Other' ? formCustomType.trim() : undefined,
            fullName: formAddressName.trim(),
            phone: formAltPhone.trim() || a.phone,
            altPhone: formAltPhone.trim(),
            houseFlat: formHouseFlat.trim(),
            street: formStreet.trim(),
            locality: formLocality.trim(),
            landmark: formLandmark.trim(),
            city: formCity.trim(),
            isDefault: formIsDefault,
            address: constructedAddress,
          };
        }
        return formIsDefault ? { ...a, isDefault: false } : a;
      });
      setAddresses(updated);
      const edited = updated.find((a) => a.id === editingAddressId);
      if (edited) {
        handleSelectAddress(edited);
      }
    } else {
      const newId = `addr_${Date.now()}`;
      const newAddress: SavedAddress = {
        id: newId,
        type: formType,
        customType: formType === 'Other' ? formCustomType.trim() : undefined,
        fullName: formAddressName.trim(),
        phone: formAltPhone.trim() || '98765 43210',
        altPhone: formAltPhone.trim(),
        houseFlat: formHouseFlat.trim(),
        street: formStreet.trim(),
        locality: formLocality.trim(),
        landmark: formLandmark.trim(),
        city: formCity.trim(),
        state: 'Delhi NCR',
        pincode: '201301',
        isDefault: formIsDefault || addresses.length === 0,
        address: constructedAddress,
        lat: 28.5900,
        lng: 77.3300,
      };

      const updated = formIsDefault
        ? [newAddress, ...addresses.map((a) => ({ ...a, isDefault: false }))]
        : [newAddress, ...addresses];

      setAddresses(updated);
      handleSelectAddress(newAddress);
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
          {/* Top subtle bar */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 shrink-0" />

          {/* VIEW 1: SAVED ADDRESSES LIST */}
          {viewMode === 'list' && (
            <>
              {/* Header */}
              <div className="px-4 pt-2.5 pb-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-50 text-[#BA181B] flex items-center justify-center">
                    <MapPin className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Select Delivery Address
                    </h3>
                    <p className="text-[11px] text-slate-500">
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

              {/* Saved Addresses List */}
              <div className="overflow-y-auto px-4 py-3 space-y-2.5 no-scrollbar max-h-[60vh]">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
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
                          ? 'border-[#BA181B] bg-red-50/40 ring-1 ring-[#BA181B]/40'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-1.5 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#BA181B] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5 stroke-[2]" />
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-900">
                                {addr.fullName || addr.customType || addr.type}
                              </span>
                              {addr.isDefault && (
                                <span className="bg-amber-100 text-amber-900 text-[9.5px] font-medium px-1.5 py-0.2 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <span className="text-[10.5px] text-slate-500 font-normal">
                              {addr.customType || addr.type}
                            </span>
                          </div>
                        </div>

                        {/* Radio selection indicator */}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#BA181B] bg-[#BA181B] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Detailed address text */}
                      <p className="text-[11.5px] text-slate-600 font-normal leading-relaxed pl-7 mt-1">
                        {addr.houseFlat}, {addr.street}, {addr.locality}
                        {addr.landmark ? `, Near ${addr.landmark}` : ''}, {addr.city}
                      </p>

                      {/* Alternate phone if exists */}
                      {(addr.altPhone || addr.phone) && (
                        <div className="mt-1.5 pl-7 flex items-center gap-1.5 text-[10.5px] text-slate-500">
                          <Phone className="w-3 h-3 text-[#BA181B]" />
                          <span>Phone / Alt: {addr.altPhone || addr.phone}</span>
                        </div>
                      )}

                      {/* Action buttons: Edit & Delete */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between pl-7">
                        <span className="text-[10.5px] text-emerald-700 font-medium">
                          ✓ Delivery Available
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEditForm(addr, e)}
                            className="text-[11px] font-medium text-slate-600 hover:text-[#BA181B] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          {addresses.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAddress(addr.id, e)}
                              className="text-[11px] font-medium text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Address Button */}
              <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenAddForm}
                  className="w-full py-2.5 bg-[#BA181B] hover:bg-red-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Add New Address</span>
                </button>
              </div>
            </>
          )}

          {/* VIEW 2: ADD / EDIT MANUAL ADDRESS FORM */}
          {viewMode === 'form' && (
            <form onSubmit={handleSaveAddress} className="flex flex-col flex-1 overflow-hidden">
              {/* Header */}
              <div className="px-4 pt-2.5 pb-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#BA181B] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2]" />
                  </button>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {editingAddressId ? 'Edit Delivery Address' : 'Enter Delivery Address'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Fill address details for delivery
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Form Content */}
              <div className="overflow-y-auto px-4 py-3 space-y-3 no-scrollbar max-h-[62vh]">
                {formError && (
                  <div className="bg-red-50 text-[#BA181B] border border-red-200 px-3 py-1.5 rounded-xl text-xs font-normal">
                    {formError}
                  </div>
                )}

                {/* 1. Address Type */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Save Address As
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'Home', label: 'Home', icon: Home },
                      { type: 'Work', label: 'Office / Work', icon: Briefcase },
                      { type: 'Other', label: 'Other', icon: Building },
                    ].map((t) => {
                      const Icon = t.icon;
                      const isSelected = formType === t.type;
                      return (
                        <button
                          key={t.type}
                          type="button"
                          onClick={() => setFormType(t.type as any)}
                          className={`py-1.5 px-2 rounded-xl border text-xs font-normal flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#BA181B] bg-red-50 text-[#BA181B]'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 stroke-[1.8]" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {formType === 'Other' && (
                    <input
                      type="text"
                      value={formCustomType}
                      onChange={(e) => setFormCustomType(e.target.value)}
                      placeholder="e.g. Parents House, Friend Flat"
                      className="mt-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-800 outline-none focus:border-[#BA181B]"
                    />
                  )}
                </div>

                {/* 2. Address Name (Replaced Full Name) */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Address Name
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#BA181B]">
                    <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={formAddressName}
                      onChange={(e) => setFormAddressName(e.target.value)}
                      placeholder="e.g. My Home, Rahul Flat, Office"
                      className="w-full text-xs font-normal text-slate-800 bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* 3. Alternative Number (Optional) - Single Phone Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700">
                      Alternative Number
                    </label>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Optional
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#BA181B]">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="tel"
                      value={formAltPhone}
                      onChange={(e) => setFormAltPhone(e.target.value)}
                      placeholder="e.g. 98765 43210 (Optional)"
                      className="w-full text-xs font-normal text-slate-800 bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* 4. House / Flat details */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Flat / House / Floor / Building No.
                  </label>
                  <input
                    type="text"
                    value={formHouseFlat}
                    onChange={(e) => setFormHouseFlat(e.target.value)}
                    placeholder="e.g. Flat 402, 4th Floor, Block B"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-800 outline-none focus:border-[#BA181B]"
                  />
                </div>

                {/* 5. Street / Road / Society */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Street / Road / Society / Apartment Name
                  </label>
                  <input
                    type="text"
                    value={formStreet}
                    onChange={(e) => setFormStreet(e.target.value)}
                    placeholder="e.g. Green Valley Heights, MG Road"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-800 outline-none focus:border-[#BA181B]"
                  />
                </div>

                {/* 6. Locality / Sector & Landmark */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Locality / Sector
                    </label>
                    <input
                      type="text"
                      value={formLocality}
                      onChange={(e) => setFormLocality(e.target.value)}
                      placeholder="e.g. Sector 10"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-800 outline-none focus:border-[#BA181B]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-700">
                        Landmark
                      </label>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Optional
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formLandmark}
                      onChange={(e) => setFormLandmark(e.target.value)}
                      placeholder="e.g. Near City Park"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-800 outline-none focus:border-[#BA181B]"
                    />
                  </div>
                </div>

                {/* 7. City Dropdown Menu (State & Pincode removed) */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    City
                  </label>
                  <div className="relative">
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-800 outline-none focus:border-[#BA181B] appearance-none cursor-pointer"
                    >
                      {CITY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 8. Make Default Address Checkbox */}
                <div
                  onClick={() => setFormIsDefault(!formIsDefault)}
                  className="flex items-center gap-2 pt-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formIsDefault}
                    onChange={(e) => setFormIsDefault(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#BA181B] rounded border-slate-300 focus:ring-[#BA181B] cursor-pointer"
                  />
                  <span className="text-xs font-normal text-slate-700">
                    Make this my default delivery address
                  </span>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="w-1/3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-[#BA181B] hover:bg-red-800 text-white font-medium text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Save & Deliver Here
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
