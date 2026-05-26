import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfilePage({ user, setUser, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: localStorage.getItem(`technest_phone_${user?.email}`) || '+1 (555) 019-2834',
    address: localStorage.getItem(`technest_address_${user?.email}`) || 'Sector 7G, Cyber City, CC 95014'
  });

  if (!user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(`technest_phone_${user.email}`, formData.phone);
    localStorage.setItem(`technest_address_${user.email}`, formData.address);
    
    // Update global user name if changed
    if (formData.name !== user.name) {
      const updatedUser = { ...user, name: formData.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    
    setIsEditing(false);
    if (showToast) {
      showToast('Profile details updated successfully!', 'success');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-24 min-h-[80vh] mt-12">
      <div className="mb-12">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-2">My Profile</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage your account details and delivery addresses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Sidebar */}
        <div className="md:col-span-1 glass-card p-8 flex flex-col items-center text-center h-fit border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent"></div>
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#8A2BE2]/20 to-primary/20 border-2 border-[#8A2BE2]/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(138,43,226,0.3)]">
            <span className="font-headline-xl text-[32px] text-primary font-bold tracking-wider">{getInitials(user.name)}</span>
          </div>

          <h3 className="font-headline-lg text-[22px] text-primary font-bold line-clamp-1">{user.name}</h3>
          <p className="font-body-md text-[13px] text-on-surface-variant mt-1.5 break-all">{user.email}</p>

          <div className="mt-6 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary text-[10px] font-mono-technical uppercase tracking-widest font-semibold">
            {user.role === 'ADMIN' ? 'Administrator' : 'Verified Customer'}
          </div>
        </div>

        {/* Details Form Area */}
        <div className="md:col-span-2 glass-card p-8 border border-white/10 relative">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <h3 className="font-headline-lg text-[18px] text-primary font-bold">Personal Details</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-primary/30 hover:border-primary bg-primary/5 hover:bg-[#8A2BE2]/10 text-primary rounded-lg font-label-caps text-[11px] uppercase tracking-wider transition-all cursor-pointer font-semibold active:scale-95"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-semibold">Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg p-3.5 font-body-md text-[14px] text-primary outline-none focus:border-[#8A2BE2] transition-colors"
                  />
                ) : (
                  <p className="font-body-lg text-[15px] text-primary font-medium py-2.5">{user.name}</p>
                )}
              </div>

              <div>
                <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-semibold">Email Address</label>
                <p className="font-body-lg text-[15px] text-on-surface-variant/80 py-2.5 break-all">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-semibold">Phone Number</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    required 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg p-3.5 font-body-md text-[14px] text-primary outline-none focus:border-[#8A2BE2] transition-colors"
                  />
                ) : (
                  <p className="font-body-lg text-[15px] text-primary font-medium py-2.5">{formData.phone}</p>
                )}
              </div>

              <div>
                <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-semibold">Default Shipping Address</label>
                {isEditing ? (
                  <textarea 
                    rows="2" 
                    required 
                    value={formData.address} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg p-3.5 font-body-md text-[14px] text-primary outline-none focus:border-[#8A2BE2] transition-colors resize-none"
                  />
                ) : (
                  <p className="font-body-lg text-[15px] text-primary font-medium py-2.5 leading-relaxed">{formData.address}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary text-surface font-label-caps text-[11px] uppercase tracking-widest rounded-lg hover:bg-primary/90 shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all cursor-pointer font-bold"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      phone: localStorage.getItem(`technest_phone_${user.email}`) || '+1 (555) 019-2834',
                      address: localStorage.getItem(`technest_address_${user.email}`) || 'Sector 7G, Cyber City, CC 95014'
                    });
                  }}
                  className="px-6 py-3 bg-transparent border border-white/10 hover:border-white/20 text-on-surface-variant hover:text-primary font-label-caps text-[11px] uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
