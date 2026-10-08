'use client';

import { useState, useEffect } from 'react';
import { 
  Inbox, PlusCircle, Edit3, Trash2, X, Save, Clock, PhoneForwarded, CheckCircle2, XCircle, Eye
} from 'lucide-react';

export default function SellRequestsAdmin() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    ownerName: '', email: '', phone: '', propertyType: 'Villa', 
    location: '', expectedPrice: '', message: '', status: 'Pending' 
  });
  
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sell-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData, id: editingId };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/sell-requests', { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchRequests(); 
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this sell request?')) return;
    
    try {
      const res = await fetch(`/api/sell-requests?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (req: any) => {
    setEditingId(req.id);
    setFormData({ 
      ownerName: req.ownerName, 
      email: req.email, 
      phone: req.phone, 
      propertyType: req.propertyType, 
      location: req.location, 
      expectedPrice: req.expectedPrice ? req.expectedPrice.toString() : '', 
      message: req.message || '', 
      status: req.status 
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ ownerName: '', email: '', phone: '', propertyType: 'Villa', location: '', expectedPrice: '', message: '', status: 'Pending' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Listed': return <span className="flex items-center gap-1 w-fit text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase"><CheckCircle2 className="w-3 h-3"/> Listed</span>;
      case 'Contacted': return <span className="flex items-center gap-1 w-fit text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase"><PhoneForwarded className="w-3 h-3"/> Contacted</span>;
      case 'Rejected': return <span className="flex items-center gap-1 w-fit text-gray-700 bg-gray-200 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase"><XCircle className="w-3 h-3"/> Rejected</span>;
      default: return <span className="flex items-center gap-1 w-fit text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase"><Clock className="w-3 h-3"/> Pending</span>;
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Sales CRM</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Sell Requests Inbox</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Add Manual Request
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading database records...</div>
        ) : requests.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No sell requests found in the inbox.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Owner Contact</th>
                <th className="p-4 font-semibold">Property Details</th>
                <th className="p-4 font-semibold">Expected Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-[#F2EDE4]/30">
                  <td className="p-4">
                    <div className="font-bold text-[#4A1F23]">{req.ownerName}</div>
                    <div className="text-[10px] text-[#8C6D53]">{req.email}</div>
                    <div className="text-[10px] text-[#8C6D53]">{req.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#8E3A47]">{req.propertyType}</div>
                    <div className="text-[10px] text-[#8C6D53] font-medium">{req.location}</div>
                    <div className="text-[10px] text-gray-500 mt-1 truncate max-w-[200px]">{req.message || 'No additional message'}</div>
                  </td>
                  <td className="p-4 font-bold text-[#4A1F23]">
                    {req.expectedPrice ? `${Number(req.expectedPrice).toLocaleString()} AED` : 'TBD'}
                  </td>
                  <td className="p-4">{getStatusBadge(req.status)}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(req)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Process Request">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(req.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7B6A5] rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-[#F2EDE4] hover:bg-[#E7B6A5]/40 text-[#4A1F23]"><X className="w-5 h-5" /></button>
            
            <h3 className="text-3xl font-serif font-bold text-[#4A1F23] mb-8 border-b border-[#E7B6A5]/30 pb-4">
              {editingId ? 'Process Sell Request' : 'Log Manual Sell Request'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Owner Name</label>
                    <input type="text" value={formData.ownerName} onChange={e=>setFormData({...formData, ownerName: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">CRM Status</label>
                    <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold">
                       <option value="Pending">Pending (New)</option>
                       <option value="Contacted">Contacted / In Discussion</option>
                       <option value="Listed">Listed on Oravya</option>
                       <option value="Rejected">Rejected</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Email Address</label>
                    <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Phone Number</label>
                    <input type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Property Type</label>
                    <select value={formData.propertyType} onChange={e=>setFormData({...formData, propertyType: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none">
                       <option value="Villa">Villa</option>
                       <option value="Apartment">Apartment</option>
                       <option value="Penthouse">Penthouse</option>
                       <option value="Townhouse">Townhouse</option>
                       <option value="Plot">Plot / Land</option>
                    </select>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Location / Community</label>
                    <input type="text" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Expected Price (AED)</label>
                    <input type="number" value={formData.expectedPrice} onChange={e=>setFormData({...formData, expectedPrice: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Client Message / Internal Notes</label>
                <textarea rows={4} value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="Details about upgrades, exact address, or meeting notes..."/>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Syncing...' : (
                  editingId ? <><Save className="w-5 h-5"/> Update CRM Status</> : <><Inbox className="w-5 h-5"/> Log Request</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}