import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Key, 
  Settings, 
  Users, 
  User, 
  Smartphone, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { AdminHeader } from '../components/AdminHeader';

export const PushNotificationsScreen: React.FC = () => {
  const { showToast } = useAdmin();
  const [appId, setAppId] = useState('');
  const [restApiKey, setRestApiKey] = useState('');
  
  // Notification Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'specific'>('all');
  const [targetPhone, setTargetPhone] = useState('');
  
  // Status State
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiLogs, setApiLogs] = useState<string[]>([]);

  // Load Saved OneSignal Keys from LocalStorage on mount
  useEffect(() => {
    const savedAppId = localStorage.getItem('meatghar_onesignal_app_id');
    const savedApiKey = localStorage.getItem('meatghar_onesignal_rest_api_key');
    
    if (savedAppId) setAppId(savedAppId);
    if (savedApiKey) setRestApiKey(savedApiKey);
  }, []);

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      localStorage.setItem('meatghar_onesignal_app_id', appId.trim());
      localStorage.setItem('meatghar_onesignal_rest_api_key', restApiKey.trim());
      setIsSaving(false);
      showToast('OneSignal configuration saved successfully! ⚙️');
      addLog('Configuration saved to Admin console.');
    }, 600);
  };

  const addLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs(prev => [`[${timestamp}] ${text}`, ...prev.slice(0, 19)]);
  };

  // Send Actual OneSignal API Request
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appId.trim()) {
      showToast('Error: Please configure and save your OneSignal App ID first!');
      return;
    }
    if (!restApiKey.trim()) {
      showToast('Error: OneSignal REST API Key is required!');
      return;
    }
    if (!title.trim() || !message.trim()) {
      showToast('Error: Notification Title and Message are required!');
      return;
    }

    setIsSending(true);
    addLog(`Initiating push send request... Target: ${targetType === 'all' ? 'All Subscriptions' : 'User (' + targetPhone + ')'}`);

    // Build OneSignal API request payload
    const payload: any = {
      app_id: appId.trim(),
      headings: { en: title.trim() },
      contents: { en: message.trim() },
    };

    if (imageUrl.trim()) {
      payload.big_picture = imageUrl.trim(); // Rich notification image for Android
      payload.ios_attachments = { id: imageUrl.trim() }; // Image for iOS
    }

    if (targetType === 'all') {
      payload.included_segments = ['Total Subscriptions'];
    } else {
      // Filter by custom tag "phone" which we synced inside our customer app on login!
      payload.filters = [
        {
          field: 'tag',
          key: 'phone',
          relation: '=',
          value: targetPhone.trim(),
        }
      ];
    }

    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Basic ${restApiKey.trim()}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      
      if (response.ok) {
        addLog(`SUCCESS! Notification sent. OneSignal ID: ${resData.id || 'N/A'}. Recipients: ${resData.recipients || 0}`);
        showToast('Push Notification Sent successfully! 🚀');
        // Reset message fields but keep title
        setMessage('');
      } else {
        const errorText = resData.errors ? JSON.stringify(resData.errors) : 'Unknown OneSignal error';
        addLog(`FAILED! Error: ${errorText}`);
        showToast('Push failed! Check logs below.');
      }
    } catch (err: any) {
      console.error('OneSignal Push Send Error:', err);
      addLog(`NETWORK ERROR: ${err.message || String(err)}`);
      showToast('Network error while communicating with OneSignal.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start overflow-hidden">
      <AdminHeader title="Push Notifications" />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        
        {/* INFO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-3xl p-5 shadow-sm">
          <div className="flex gap-3">
            <Bell className="w-6 h-6 text-[#A8071A] shrink-0 stroke-[2] animate-bounce" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Median.co & OneSignal Engine</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                Aap is dashboard se direct apne Android / iOS APK users ko alerts aur push notifications bhej sakte hain. 
                App automatic users ke mobile numbers ko tag karti hai, jisse aap targeted personalized messages bhi send kar payenge!
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 1: ONESIGNAL CONFIGURATION CREDENTIALS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-slate-100 rounded-2xl text-slate-700">
              <Key className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 leading-none">OneSignal API Keys</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Configure your Median App credentials</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                OneSignal App ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={e => setAppId(e.target.value)}
                placeholder="e.g. 1234abcd-5678-efgh-90ij-klmnopqrstuv"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#A8071A] text-slate-800 text-xs font-bold rounded-2xl outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                OneSignal REST API Key (Basic Auth)
              </label>
              <input
                type="password"
                value={restApiKey}
                onChange={e => setRestApiKey(e.target.value)}
                placeholder="e.g. N2MyYThmNjgtY2FlMC00Mzh..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#A8071A] text-slate-800 text-xs font-bold rounded-2xl outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration ⚙️</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* SECTION 2: SEND NOTIFICATION COMPOSER */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-50 text-[#A8071A] rounded-2xl">
              <Send className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 leading-none">Broadcast Composer</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Design and send real-time push messages</p>
            </div>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4">
            {/* Target Select */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                Target Audience
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('all')}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    targetType === 'all'
                      ? 'border-[#A8071A] bg-red-50/40 text-[#A8071A] shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>All Subscriptions</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('specific')}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    targetType === 'specific'
                      ? 'border-[#A8071A] bg-red-50/40 text-[#A8071A] shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Specific User (By Phone)</span>
                </button>
              </div>
            </div>

            {/* Target Specific Phone Input */}
            {targetType === 'specific' && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-1 animate-fade-in">
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Customer's Mobile Number
                </label>
                <input
                  type="text"
                  value={targetPhone}
                  onChange={e => setTargetPhone(e.target.value)}
                  placeholder="e.g. 9876543210 (Use phone registered in App)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#A8071A] text-slate-800 text-xs font-bold rounded-xl outline-none"
                  required={targetType === 'specific'}
                />
                <span className="text-[9px] text-slate-400 font-semibold block leading-tight pt-1">
                  💡 App automatically tags active devices with their phone numbers during Google/Manual logins.
                </span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                Notification Heading (Title)
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Juicy Chicken Breast back in stock! 🍗"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#A8071A] text-slate-800 text-xs font-bold rounded-2xl outline-none transition-colors"
                required
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                Message Body
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="e.g. Get flat 15% discount for next 1 hour. Grab yours before stocks run out!"
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#A8071A] text-slate-800 text-xs font-bold rounded-2xl outline-none transition-colors resize-none"
                required
              />
            </div>

            {/* Rich Image URL */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Banner Image URL (Optional)
                </label>
                <span className="text-[9px] text-slate-400 font-bold">Unsplash or Storage Link</span>
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="e.g. https://images.unsplash.com/photo-1587593810167-a84920ea0781"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#A8071A] text-slate-800 text-xs font-bold rounded-2xl outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-4 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl transition-all shadow-md shadow-red-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Blasting Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4.5 h-4.5" />
                  <span>Send Push Notification 🚀</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* SECTION 3: SYSTEM CONSOLE LOGS */}
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 shadow-md border border-slate-850">
          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-extrabold tracking-wider text-slate-300 uppercase">OneSignal Terminal Log</span>
            </div>
            <button
              onClick={() => setApiLogs([])}
              className="text-[10px] text-slate-500 hover:text-slate-300 font-bold transition-colors cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          <div className="font-mono text-[10px] text-slate-400 leading-normal space-y-1.5 max-h-[180px] overflow-y-auto custom-scrollbar select-text">
            {apiLogs.length === 0 ? (
              <p className="text-slate-600 italic">No activity recorded yet. Initiate settings or send a message to check logs.</p>
            ) : (
              apiLogs.map((log, index) => (
                <div key={index} className="border-b border-white/2 pb-1 last:border-0">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
