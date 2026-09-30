import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Map,
  User,
  Phone,
  Home,
  Briefcase,
  MoreHorizontal,
  Save,
  Info,
  Building,
  Loader2,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { MeatGharLogo } from '../MeatGharLogo';
import { LocationData, SavedAddress } from '../../types/location';
import { saveUserAddress, getCurrentUserIdentifier } from '../../lib/addressService';
import { supabase } from '../../lib/supabase';

interface AddressFormScreenProps {
  onBack: () => void;
  onSaveAddress: (savedAddress?: SavedAddress) => void;
  locationData?: LocationData;
  initialAddress?: SavedAddress;
  userName?: string;
  userPhone?: string;
  isFirstAddressMandatory?: boolean;
}

export const AddressFormScreen: React.FC<AddressFormScreenProps> = ({
  onBack,
  onSaveAddress,
  locationData,
  initialAddress,
  userName = '',
  userPhone = '',
  isFirstAddressMandatory = false,
}) => {
  const currentIdent = getCurrentUserIdentifier();
  const effectiveName = initialAddress?.fullName || userName || currentIdent.name || '';
  const effectivePhone = (initialAddress?.phone || userPhone || currentIdent.phone || '').replace(/\D/g, '').slice(0, 10);

  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>(initialAddress?.type || 'Home');
  const [fullName, setFullName] = useState(effectiveName);
  const [mobileNumber, setMobileNumber] = useState(effectivePhone);
  
  // Fixed City: Guwahati (Locked, cannot be changed)
  const city = 'Guwahati';
  
  // Area Selection: Boko or Dhupdhara
  const parsedArea = (initialAddress?.locality || initialAddress?.address || '').includes('Dhupdhara')
    ? 'Dhupdhara'
    : 'Boko';
  const [area, setArea] = useState<'Boko' | 'Dhupdhara'>(parsedArea);

  const [houseFlat, setHouseFlat] = useState(initialAddress?.houseFlat || '');
  const [street, setStreet] = useState(initialAddress?.street || locationData?.road || '');
  const [sectorLocality, setSectorLocality] = useState(
    initialAddress?.locality && initialAddress.locality !== 'Boko' && initialAddress.locality !== 'Dhupdhara'
      ? initialAddress.locality
      : ''
  );
  const [landmark, setLandmark] = useState(initialAddress?.landmark || '');
  const [isDefault, setIsDefault] = useState(initialAddress?.isDefault ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync profile data if loaded later
  useEffect(() => {
    if (!fullName && (userName || currentIdent.name)) {
      setFullName(userName || currentIdent.name || '');
    }
    if (!mobileNumber && (userPhone || currentIdent.phone)) {
      setMobileNumber((userPhone || currentIdent.phone || '').replace(/\D/g, '').slice(0, 10));
    }
  }, [userName, userPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = fullName.trim();
    const cleanPhone = mobileNumber.replace(/\D/g, '').slice(0, 10);
    const cleanHouse = houseFlat.trim();
    const cleanStreet = street.trim();
    const cleanSector = sectorLocality.trim();
    const cleanLandmark = landmark.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter recipient full name');
      return;
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!cleanHouse) {
      setErrorMessage('Please enter Flat, House No., or Building Name');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build clean complete address string
      const fullAddr = `${cleanHouse}${cleanStreet ? ', ' + cleanStreet : ''}${cleanSector ? ', ' + cleanSector : ''}, ${area}, Guwahati, Assam`;

      const saved = await saveUserAddress({
        id: initialAddress?.id,
        type: addressType,
        fullName: cleanName,
        phone: cleanPhone,
        houseFlat: cleanHouse,
        street: cleanStreet,
        locality: `${area}${cleanSector ? ' (' + cleanSector + ')' : ''}`,
        landmark: cleanLandmark,
        city: 'Guwahati',
        state: 'Assam',
        pincode: area === 'Boko' ? '781123' : '783123',
        address: fullAddr,
        isDefault,
      });

      // Also update profile table in Supabase
      try {
        const uPhone = cleanPhone || currentIdent.phone;
        if (uPhone) {
          await supabase.from('profiles').upsert(
            {
              phone: uPhone,
              full_name: cleanName,
              address: fullAddr,
              default_address: fullAddr,
              city: 'Guwahati',
              landmark: cleanLandmark,
            },
            { onConflict: 'phone' }
          );
        }
      } catch (profErr) {
        console.warn('Profile address sync notice:', profErr);
      }

      onSaveAddress(saved);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-y-auto no-scrollbar select-none">
      {/* Top Header */}
      <div className="bg-white px-4 h-[69px] border-b border-slate-200 shadow-2xs sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Back Icon hidden on mandatory first address */}
          {!isFirstAddressMandatory && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-base font-extrabold text-slate-900">
            {initialAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
        </div>

        <MeatGharLogo variant="red" size="sm" showTagline={false} />
      </div>

      {/* Main Form Fields */}
      <div className="flex-1 px-4 py-3.5 space-y-3 max-w-lg mx-auto w-full">
        {/* Location Selected Card */}
        <div className="bg-red-50/60 border border-red-200/80 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#A8071A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#A8071A]">Location Selected</span>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">✓</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-snug mt-0.5">
                Current Delivery Zone: {area}, Guwahati, Assam
              </p>
            </div>
          </div>

          <div className="p-2 text-[#A8071A]">
            <Map className="w-5 h-5" />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-100/90 border border-red-300 rounded-xl text-xs text-red-700 font-bold animate-shake">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5" autoComplete="off">
          
          {/* Row 1: Full Name & Mobile (2 per row) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs focus-within:border-[#A8071A] focus-within:ring-1 focus-within:ring-[#A8071A]">
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
                <User className="w-3 h-3 text-[#A8071A]" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full text-xs font-bold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
                required
              />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs focus-within:border-[#A8071A] focus-within:ring-1 focus-within:ring-[#A8071A]">
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#A8071A]" />
                <span>Mobile *</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile"
                className="w-full text-xs font-bold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          {/* Row 2: City (Guwahati Locked - Single Line Full Width) */}
          <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-2.5 shadow-2xs relative">
            <label className="text-[10px] font-bold text-slate-500 block mb-0.5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#A8071A]" />
                <span>City *</span>
              </div>
              <span className="text-[9px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> Selected
              </span>
            </label>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-xs font-extrabold text-slate-900">Guwahati</span>
              <span className="text-[10px] text-slate-400 font-medium">Assam</span>
            </div>
          </div>

          {/* Row 3: Area Dropdown (Boko / Dhupdhara - Single Line Full Width) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs focus-within:border-[#A8071A] focus-within:ring-1 focus-within:ring-[#A8071A] relative">
            <label className="text-[10px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#A8071A]" />
              <span>Area / Delivery Zone *</span>
            </label>
            <div className="relative flex items-center">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as 'Boko' | 'Dhupdhara')}
                className="w-full text-xs font-extrabold text-slate-900 bg-transparent outline-none appearance-none cursor-pointer pr-5 py-0.5"
              >
                <option value="Boko">Boko</option>
                <option value="Dhupdhara">Dhupdhara</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-0 pointer-events-none" />
            </div>
          </div>

          {/* Row 4: Flat, House No., Building Name (Single Input Full Width) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs focus-within:border-[#A8071A] focus-within:ring-1 focus-within:ring-[#A8071A]">
            <label className="text-[10px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
              <Building className="w-3 h-3 text-[#A8071A]" />
              <span>Flat, House No., Building Name *</span>
            </label>
            <input
              type="text"
              value={houseFlat}
              onChange={(e) => setHouseFlat(e.target.value)}
              placeholder="e.g. Flat 302, Tower 4, Royal Greens"
              className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
              required
            />
          </div>

          {/* Row 5: Street / Road / Lane (Single Input Full Width) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs focus-within:border-[#A8071A] focus-within:ring-1 focus-within:ring-[#A8071A]">
            <label className="text-[10px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#A8071A]" />
              <span>Street / Road / Lane</span>
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. MG Road, Near Central Park"
              className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Row 6: Locality / Sector (Single Input Full Width) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs focus-within:border-[#A8071A] focus-within:ring-1 focus-within:ring-[#A8071A]">
            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
              Locality / Sector (Optional)
            </label>
            <input
              type="text"
              value={sectorLocality}
              onChange={(e) => setSectorLocality(e.target.value)}
              placeholder="e.g. Sector 10 / Ward 2"
              className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Row 7: Landmark (Single Input Full Width) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs focus-within:border-[#A8071A] focus-within:ring-1 focus-within:ring-[#A8071A]">
            <label className="text-[10px] font-bold text-slate-600 block mb-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#A8071A]" />
              <span>Landmark (Optional)</span>
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Behind Metro Station / Near Masjid"
              className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Address Type Selection */}
          <div className="pt-0.5">
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Address Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAddressType('Home')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  addressType === 'Home'
                    ? 'bg-[#A8071A] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={() => setAddressType('Work')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  addressType === 'Work'
                    ? 'bg-[#A8071A] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Work</span>
              </button>

              <button
                type="button"
                onClick={() => setAddressType('Other')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  addressType === 'Other'
                    ? 'bg-[#A8071A] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
                <span>Other</span>
              </button>
            </div>
          </div>

          {/* Set as default checkbox */}
          <div className="flex items-center gap-2 pt-0.5 px-1">
            <input
              type="checkbox"
              id="set_default_chk"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="accent-[#A8071A] w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="set_default_chk" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Set as default delivery address
            </label>
          </div>

          {/* Save Address Button */}
          <div className="pt-2 pb-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#A8071A] to-[#8c0615] hover:from-red-800 hover:to-red-900 active:bg-red-950 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-red-950/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Address...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Address</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium justify-center pb-2">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Address is saved securely with 256-bit encryption.</span>
        </div>
      </div>
    </div>
  );
};
