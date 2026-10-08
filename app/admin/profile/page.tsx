'use client';

import { useState, useEffect } from 'react';
import { 
  User, Shield, Save, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Visibilité des mots de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form State
  const [adminId, setAdminId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-profile');
      if (res.ok) {
        const data = await res.json();
        setAdminId(data.id);
        setFormData(prev => ({
          ...prev,
          name: data.name,
          email: data.email
        }));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation des mots de passe
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required to set a new password.' });
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match.' });
        return;
      }
      if (formData.newPassword.length < 8) {
        setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        id: adminId,
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };

      const res = await fetch('/api/admin-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Vider les champs de mot de passe après succès
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        const errorData = await res.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'A network error occurred.' });
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="p-10 text-center text-[#8C6D53]">Loading account details...</div>;
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div>
        <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">System Administration</span>
        <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Account Settings</h2>
      </div>

      {/* NOTIFICATIONS */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: PERSONAL INFO */}
        <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40 p-4 px-6 flex items-center gap-3">
            <User className="w-5 h-5 text-[#8E3A47]" />
            <h3 className="font-bold text-[#4A1F23]">Personal Information</h3>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Display Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C6D53] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 pl-11 outline-none font-bold text-[#4A1F23] focus:border-[#8E3A47] transition"/>
                </div>
              </div>
              
              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Email Address (Login ID)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C6D53] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 pl-11 outline-none font-bold text-[#4A1F23] focus:border-[#8E3A47] transition"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SECURITY & PASSWORD */}
        <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40 p-4 px-6 flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#8E3A47]" />
            <h3 className="font-bold text-[#4A1F23]">Security & Password</h3>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <p className="text-xs text-[#8C6D53] italic mb-4">Leave these fields blank if you do not wish to change your password.</p>

            <div>
              <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Current Password</label>
              <div className="relative max-w-md">
                <Lock className="w-4 h-4 text-[#8C6D53] absolute left-4 top-1/2 -translate-y-1/2" />
                <input type={showCurrentPassword ? "text" : "password"} value={formData.currentPassword} onChange={e=>setFormData({...formData, currentPassword: e.target.value})} className="w-full bg-white border border-[#E7B6A5]/60 rounded-xl p-3.5 pl-11 pr-11 outline-none focus:border-[#8E3A47] transition" placeholder="Enter current password to authorize changes"/>
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C6D53] hover:text-[#8E3A47] transition">
                  {showCurrentPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E7B6A5]/20">
              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type={showNewPassword ? "text" : "password"} value={formData.newPassword} onChange={e=>setFormData({...formData, newPassword: e.target.value})} className="w-full bg-white border border-emerald-200 rounded-xl p-3.5 pl-11 pr-11 outline-none focus:border-emerald-500 transition" placeholder="Min. 8 characters"/>
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C6D53] hover:text-[#8E3A47] transition">
                    {showNewPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type={showNewPassword ? "text" : "password"} value={formData.confirmPassword} onChange={e=>setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-white border border-emerald-200 rounded-xl p-3.5 pl-11 outline-none focus:border-emerald-500 transition" placeholder="Type password again"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT ACTION */}
        <div className="flex justify-end pt-4">
          <button disabled={isSubmitting} type="submit" className="bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 px-10 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex items-center gap-2">
            {isSubmitting ? 'Saving changes...' : <><Save className="w-5 h-5"/> Save Profile Settings</>}
          </button>
        </div>

      </form>
    </div>
  );
}