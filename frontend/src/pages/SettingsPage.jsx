import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage({ user, showToast, perfModeEnabled, setPerfModeEnabled }) {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({
    emails: true,
    orders: true,
    sms: false
  });

  if (!user) return null;

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      if (showToast) showToast("New passwords do not match!", "error");
      return;
    }
    
    // Simulate updating password
    setPasswords({ current: '', new: '', confirm: '' });
    if (showToast) {
      showToast('Password updated successfully!', 'success');
    }
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-24 min-h-[80vh] mt-12">
      <div className="mb-12">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-2">Account Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Update your security settings and storefront preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass-card p-6 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent"></div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary font-bold">
                <span className="material-symbols-outlined text-[#8A2BE2]">settings</span>
                <span className="font-headline-lg text-[16px] uppercase tracking-wider">Preferences</span>
              </div>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                Configure notification delivery options and security parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Settings Form Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Section: Security */}
          <div className="glass-card p-8 border border-white/10">
            <h3 className="font-headline-lg text-[18px] text-primary font-bold mb-6 border-b border-white/5 pb-4">Security Credentials</h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-semibold">Current Password</label>
                <input 
                  type="password" 
                  required 
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••" 
                  className="w-full bg-[#141414] border border-white/10 rounded-lg p-3.5 font-body-md text-[14px] text-primary outline-none focus:border-[#8A2BE2] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-semibold">New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="••••••••" 
                    className="w-full bg-[#141414] border border-white/10 rounded-lg p-3.5 font-body-md text-[14px] text-primary outline-none focus:border-[#8A2BE2] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-semibold">Confirm New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="••••••••" 
                    className="w-full bg-[#141414] border border-white/10 rounded-lg p-3.5 font-body-md text-[14px] text-primary outline-none focus:border-[#8A2BE2] transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="px-6 py-3 bg-[#8A2BE2]/10 hover:bg-[#8A2BE2] border border-[#8A2BE2]/40 text-[#8A2BE2] hover:text-surface font-label-caps text-[11px] uppercase tracking-widest rounded-lg transition-all cursor-pointer font-bold active:scale-95"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Section: Display & Performance */}
          <div className="glass-card p-8 border border-white/10">
            <h3 className="font-headline-lg text-[18px] text-primary font-bold mb-6 border-b border-white/5 pb-4">Theme & Display Settings</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="font-body-lg text-[14px] text-primary font-semibold">Dark Theme Mode</h4>
                  <p className="font-body-md text-[12px] text-on-surface-variant mt-0.5">Maintain premium dark mode storefront visuals.</p>
                </div>
                <span className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono-technical uppercase tracking-widest text-primary font-bold">Enabled</span>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-white/5 pt-6">
                <div>
                  <h4 className="font-body-lg text-[14px] text-primary font-semibold">Ambient Glow Animation</h4>
                  <p className="font-body-md text-[12px] text-on-surface-variant mt-0.5">Enable slow-pulse aesthetic glow backgrounds.</p>
                </div>
                <button 
                  onClick={() => {
                    const nextVal = !perfModeEnabled;
                    setPerfModeEnabled(nextVal);
                    localStorage.setItem('smartcart_perf_mode', nextVal ? 'true' : 'false');
                    if (showToast) {
                      showToast(nextVal ? 'Performance Mode enabled (Glows hidden).' : 'Immersive Mode enabled (Glows active).', 'info');
                    }
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                    perfModeEnabled ? 'bg-[#8A2BE2]' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                    perfModeEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Notification Settings */}
          <div className="glass-card p-8 border border-white/10">
            <h3 className="font-headline-lg text-[18px] text-primary font-bold mb-6 border-b border-white/5 pb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3.5 py-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={notifications.emails}
                  onChange={(e) => setNotifications({ ...notifications, emails: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 accent-[#8A2BE2]"
                />
                <div>
                  <span className="block font-body-lg text-[14px] text-primary font-semibold group-hover:text-[#8A2BE2] transition-colors">Aesthetic Newsletter Drops</span>
                  <span className="block font-body-md text-[11px] text-on-surface-variant mt-0.5">Recieve curated gear notifications in your inbox.</span>
                </div>
              </label>

              <label className="flex items-center gap-3.5 py-2 border-t border-white/5 pt-4 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={notifications.orders}
                  onChange={(e) => setNotifications({ ...notifications, orders: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 accent-[#8A2BE2]"
                />
                <div>
                  <span className="block font-body-lg text-[14px] text-primary font-semibold group-hover:text-[#8A2BE2] transition-colors">Order Progress Alerts</span>
                  <span className="block font-body-md text-[11px] text-on-surface-variant mt-0.5">Track fulfillment status notifications.</span>
                </div>
              </label>

              <label className="flex items-center gap-3.5 py-2 border-t border-white/5 pt-4 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 accent-[#8A2BE2]"
                />
                <div>
                  <span className="block font-body-lg text-[14px] text-primary font-semibold group-hover:text-[#8A2BE2] transition-colors">SMS Dispatch Messages</span>
                  <span className="block font-body-md text-[11px] text-on-surface-variant mt-0.5">Instant delivery notification alerts.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
