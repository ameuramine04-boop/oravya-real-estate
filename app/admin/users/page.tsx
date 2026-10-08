'use client';

import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Edit3, Trash2, X, Save, 
  CheckCircle2, XCircle, Shield, Briefcase, UserIcon, Target
} from 'lucide-react';

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', role: 'Client', status: 'Active' 
  });
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) setUsers(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData, id: editingId };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/users', { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchUsers(); 
      } else alert("Erreur lors de la sauvegarde.");
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (user: any) => {
    setEditingId(user.id);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      phone: user.phone || '', 
      role: user.role, 
      status: user.status 
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', role: 'Client', status: 'Active' });
  };

  // UI Helpers pour les badges de Rôles
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return <span className="flex items-center gap-1 w-fit text-purple-700 bg-purple-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"><Shield className="w-3 h-3"/> Admin</span>;
      case 'Agent': return <span className="flex items-center gap-1 w-fit text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"><Briefcase className="w-3 h-3"/> Agent</span>;
      case 'Lead': return <span className="flex items-center gap-1 w-fit text-amber-700 bg-amber-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"><Target className="w-3 h-3"/> Lead</span>;
      default: return <span className="flex items-center gap-1 w-fit text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"><UserIcon className="w-3 h-3"/> Client</span>;
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">CRM & Network</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Users & Clients Database</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading users database...</div>
        ) : users.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No users found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">User Details</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-[#F2EDE4]/30">
                  <td className="p-4">
                    <div className="font-bold text-[#4A1F23] text-sm">{user.name}</div>
                    <div className="text-[10px] text-[#8C6D53] mt-0.5">Joined: {new Date(user.createdAt).toLocaleDateString('en-GB')}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[#8E3A47]">{user.email}</div>
                    <div className="text-[10px] text-[#8C6D53] mt-0.5">{user.phone || 'No phone provided'}</div>
                  </td>
                  <td className="p-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="p-4">
                    {user.status === 'Active' 
                      ? <span className="flex items-center gap-1 w-fit text-emerald-700"><CheckCircle2 className="w-3 h-3"/> Active</span>
                      : <span className="flex items-center gap-1 w-fit text-red-700"><XCircle className="w-3 h-3"/> Inactive</span>
                    }
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(user)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Edit User">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete User">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FULL CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7B6A5] rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-[#F2EDE4] hover:bg-[#E7B6A5]/40 text-[#4A1F23]"><X className="w-5 h-5" /></button>
            
            <h3 className="text-3xl font-serif font-bold text-[#4A1F23] mb-8 border-b border-[#E7B6A5]/30 pb-4">
              {editingId ? 'Edit User Profile' : 'Add New User'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Full Name</label>
                    <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Email Address</label>
                    <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Phone Number</label>
                    <input type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Account Status</label>
                    <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold">
                       <option value="Active">Active (Can login/interact)</option>
                       <option value="Inactive">Inactive (Suspended)</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">User Role & Permissions</label>
                <select value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]">
                    <option value="Client">Client (Registered Customer)</option>
                    <option value="Lead">Lead (Potential Prospect)</option>
                    <option value="Agent">Agent (Real Estate Broker)</option>
                    <option value="Admin">Admin (Full Dashboard Access)</option>
                </select>
                <p className="text-[10px] text-[#8C6D53] mt-2 italic">Note: Admins have access to this entire dashboard. Clients and Leads only have access to their personal area on the main website.</p>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Syncing...' : (
                  editingId ? <><Save className="w-5 h-5"/> Update User</> : <><UserPlus className="w-5 h-5"/> Register User</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}