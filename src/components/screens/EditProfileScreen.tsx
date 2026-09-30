import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  Save,
  X,
  Smartphone,
  Info,
} from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';

interface EditProfileScreenProps {
  userName: string;
  userPhone: string;
  userEmail?: string;
  authMethod: 'manual' | 'google';
  onBack: () => void;
  onSaveProfile: (updatedData: { fullName: string; phone: string; email: string }) => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  userName,
  userPhone,
  userEmail = 'customer@meatghar.in',
  authMethod,
  onBack,
  onSaveProfile,
}) => {
  const [fullName, setFullName] = useState(userName || 'Customer');
  const [phone, setPhone] = useState(userPhone || '9876543210');
  const [email] = useState(userEmail);

  // Password fields for manual auth
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status & modal states
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [tempPhone, setTempPhone] = useState(phone);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (authMethod === 'manual' && (newPassword || currentPassword)) {
      if (!currentPassword) {
        setErrorMsg('Please enter your current password.');
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New password and confirm password do not match.');
        return;
      }
    }

    setErrorMsg('');
    setSaveSuccessMsg(true);
    onSaveProfile({ fullName: fullName.trim(), phone, email });

    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const handleSavePhoneFromPopup = () => {
    if (tempPhone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    setPhone(tempPhone);
    setPhoneVerified(true);
    setShowPhonePopup(false);
    setErrorMsg('');
  };

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* 1. TOP HEADER */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-30 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h1 className="text-base font-bold text-slate-900">Edit Profile</h1>
          </div>

          <HeaderMeatGharLogo />
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Update your account details for delivery and notifications.
        </p>
      </div>

      {/* 2. SCROLLABLE FORM - STARTS DIRECTLY WITH FULL NAME */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 no-scrollbar pb-28">
        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile changes saved successfully! Returning...</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-[#A8071A] rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200">
            <ShieldAlert className="w-4 h-4 text-[#A8071A] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Edit Form Starting directly with inputs */}
        <form
          id="edit-profile-form"
          onSubmit={handleSave}
          className="space-y-3.5"
          autoComplete="off"
          noValidate
        >
          {/* 1. Full Name Input */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-1.5 focus-within:border-[#A8071A] transition-colors">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#A8071A]" />
              <span>Full Name</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus-within:bg-white focus-within:border-[#A8071A] transition-colors">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full text-xs font-medium text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                required
              />
            </div>
            <p className="text-[10px] text-slate-400 font-normal">
              Your name as it should appear on invoices.
            </p>
          </div>

          {/* 2. Phone Number (Locked for Security) */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#A8071A]" />
                <span>Phone Number</span>
              </label>
              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Locked
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <span className="text-xs font-medium text-slate-700 font-mono">
                +91 {phone}
              </span>

              {authMethod === 'google' ? (
                <button
                  type="button"
                  onClick={() => {
                    setTempPhone(phone);
                    setShowPhonePopup(true);
                  }}
                  className="text-[11px] font-semibold text-[#A8071A] bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                >
                  Verify / Update
                </button>
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>

            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">
              Phone number cannot be changed directly to protect your delivery tracking and order history.
            </p>

            {phoneVerified && (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Phone verified.
              </span>
            )}
          </div>

          {/* 3. Email Address (Locked) */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#A8071A]" />
                <span>Email Address</span>
              </label>
              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Locked
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">{email}</span>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <p className="text-[10px] text-slate-400 font-normal">
              Primary email used for order receipts and notifications.
            </p>
          </div>

          {/* 4. PASSWORD CHANGE SECTION (Conditional for Manual Auth) */}
          {authMethod === 'manual' ? (
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Lock className="w-3.5 h-3.5 text-[#A8071A]" />
                <h3 className="text-xs font-semibold text-slate-800">
                  Change Password (Optional)
                </h3>
              </div>

              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600">Current Password</label>
                <div className="relative flex items-center border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-[#A8071A] bg-slate-50 focus-within:bg-white transition-colors">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full text-xs font-medium text-slate-800 bg-transparent outline-none pr-7 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600">New Password</label>
                <div className="relative flex items-center border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-[#A8071A] bg-slate-50 focus-within:bg-white transition-colors">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full text-xs font-medium text-slate-800 bg-transparent outline-none pr-7 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600">Confirm New Password</label>
                <div className="relative flex items-center border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-[#A8071A] bg-slate-50 focus-within:bg-white transition-colors">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full text-xs font-medium text-slate-800 bg-transparent outline-none pr-7 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Google Login Notice */
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                G
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-blue-900">Signed in via Google</h4>
                <p className="text-[11px] text-blue-700 leading-relaxed font-normal">
                  Your password is automatically managed by your Google Account.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* 3. DOCKED BOTTOM ACTION BAR (Clean & Never Cut Off) */}
      <div className="shrink-0 bg-white border-t border-slate-200 p-3.5 z-30 shadow-md">
        <button
          type="submit"
          form="edit-profile-form"
          className="w-full py-3 bg-[#A8071A] hover:bg-red-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* 4. GOOGLE LOGIN PHONE VERIFICATION POPUP MODAL */}
      {showPhonePopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#A8071A]" />
                <h3 className="text-xs font-bold text-slate-900">Verify Phone Number</h3>
              </div>
              <button
                onClick={() => setShowPhonePopup(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-100 p-2.5 rounded-xl flex items-start gap-2 text-xs text-[#A8071A]">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p className="text-[11px] font-normal leading-relaxed">
                Enter your 10-digit mobile number for order delivery coordination.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-600">
                Mobile Number
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-[#A8071A] transition-colors">
                <span className="text-xs font-semibold text-slate-600 pr-2 border-r border-slate-300 mr-2">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit number"
                  className="w-full text-xs font-medium text-slate-800 bg-transparent outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowPhonePopup(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhoneFromPopup}
                disabled={tempPhone.length < 10}
                className={`flex-1 py-2 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer ${
                  tempPhone.length >= 10
                    ? 'bg-[#A8071A] hover:bg-red-800 shadow-xs'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Verify & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
