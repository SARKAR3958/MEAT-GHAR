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
} from 'lucide-react';
import { MeatGharLogo } from '../MeatGharLogo';
import { LocationData } from '../../types/location';

interface AddressFormScreenProps {
  onBack: () => void;
  onSaveAddress: () => void;
  locationData?: LocationData;
}

export const AddressFormScreen: React.FC<AddressFormScreenProps> = ({
  onBack,
  onSaveAddress,
  locationData,
}) => {
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [mobileNumber, setMobileNumber] = useState('98765 43210');
  const [houseFlat, setHouseFlat] = useState('B-302');
  const [street, setStreet] = useState(locationData?.road || 'Green Park Road');
  const [locality, setLocality] = useState(locationData?.suburb || 'Sector 10');
  const [landmark, setLandmark] = useState('Near City Mall');
  const [city, setCity] = useState(locationData?.city || 'Noida');
  const [pinCode, setPinCode] = useState(locationData?.postcode || '201301');

  useEffect(() => {
    if (locationData) {
      if (locationData.road) setStreet(locationData.road);
      if (locationData.suburb) setLocality(locationData.suburb);
      if (locationData.city) setCity(locationData.city);
      if (locationData.postcode) setPinCode(locationData.postcode);
    }
  }, [locationData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAddress();
  };

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Navigation */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Add New Address</h2>
        </div>

        <MeatGharLogo variant="red" size="sm" showTagline={false} />
      </div>

      {/* Main Form Fields Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 no-scrollbar">
        {/* Selected Location Card */}
        <div className="bg-red-50/50 border border-red-200/80 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#A8071A] text-white flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#A8071A]">Location selected</span>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">✓</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-snug mt-0.5">
                {locationData?.address || 'MG Road, Sector 10, Noida, Delhi, 201301'}
              </p>
            </div>
          </div>

          <button onClick={onBack} className="p-2 text-[#A8071A] hover:bg-red-100 rounded-xl transition-colors cursor-pointer">
            <Map className="w-5 h-5" />
          </button>
        </div>

        {/* Address Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3"
          autoComplete="off"
          noValidate
          data-form-type="other"
        >
          {/* Full Name */}
          <div className="bg-white border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <label className="text-[10px] font-semibold text-slate-400 block">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                name="addr_fullname_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="bg-white border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <label className="text-[10px] font-semibold text-slate-400 block">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-600">+91</span>
              <div className="h-3 w-px bg-slate-300" />
              <input
                type="tel"
                name="addr_phone_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="98765 43210"
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* House / Flat */}
          <div className="bg-white border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <label className="text-[10px] font-semibold text-slate-400 block">
              House/Flat <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <Home className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                name="addr_house_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={houseFlat}
                onChange={(e) => setHouseFlat(e.target.value)}
                placeholder="B-302"
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Street */}
          <div className="bg-white border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <label className="text-[10px] font-semibold text-slate-400 block">
              Street <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-black text-slate-400 shrink-0">A</span>
              <input
                type="text"
                name="addr_street_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Green Park Road"
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Locality */}
          <div className="bg-white border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <label className="text-[10px] font-semibold text-slate-400 block">
              Locality <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                name="addr_locality_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="Sector 10"
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Landmark */}
          <div className="bg-white border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#A8071A] focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
            <label className="text-[10px] font-semibold text-slate-400 block">
              Landmark <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <Building className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                name="addr_landmark_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Near City Mall"
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* City & PIN Code (2 columns) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#A8071A] transition-all">
              <label className="text-[10px] font-semibold text-slate-400 block">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addr_city_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Noida"
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
              />
            </div>

            <div className="bg-white border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#A8071A] transition-all">
              <label className="text-[10px] font-semibold text-slate-400 block">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addr_pincode_no_autofill"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="201301"
                className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Address Type Selection */}
          <div className="pt-1">
            <label className="text-[11px] font-bold text-slate-700 block mb-2">
              Address Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAddressType('Home')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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

          {/* Save Address Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Save className="w-4 h-4" />
            <span>Save Address</span>
          </button>
        </form>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium justify-center pt-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>We'll use this address to calculate delivery availability and charges.</span>
        </div>
      </div>
    </div>
  );
};
