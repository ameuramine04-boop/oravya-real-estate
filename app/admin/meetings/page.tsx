'use client';

import { useState, useEffect } from 'react';
import { 
  Users, PlusCircle, Edit3, Trash2, X, Save, Clock, 
  CheckCircle2, XCircle, CalendarCheck, Eye
} from 'lucide-react';

export default function MeetingsAdmin() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', service: 'Investment Consultation', 
    date: '', time: '', message: '', status: 'Pending' 
  });
  
  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meetings');
      if (res.ok) setMeetings(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData, id: editingId };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/meetings', { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchMeetings(); 
      } else alert("Erreur lors de la sauvegarde.");
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this meeting request?')) return;
    try {
      const res = await fetch(`/api/meetings?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchMeetings();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (meeting: any) => {
    setEditingId(meeting.id);
    setFormData({ 
      name: meeting.name, 
      email: meeting.email, 
      phone: meeting.phone, 
      service: meeting.service, 
      date: meeting.date, 
      time: meeting.time, 
      message: meeting.message || '', 
      status: meeting.status 
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', service: 'Investment Consultation', date: '', time: '', message: '', status: 'Pending' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled': return <span className="flex items-center gap-1 w-fit text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><CalendarCheck className="w-3 h-3"/> Scheduled</span>;
      case 'Completed': return <span className="flex items-center gap-1 w-fit text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><CheckCircle2 className="w-3 h-3"/> Completed</span>;
      case 'Cancelled': return <span className="flex items-center gap-1 w-fit text-red-700 bg-red-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><XCircle className="w-3 h-3"/> Cancelled</span>;
      default: return <span className="flex items-center gap-1 w-fit text-amber-700 bg-amber-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><Clock className="w-3 h-3"/> Pending</span>;
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">CRM & Network</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Client Meetings</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Schedule Meeting
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading meetings...</div>
        ) : meetings.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No meetings found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Client Contact</th>
                <th className="p-4 font-semibold">Service Required</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {meetings.map(m => (
                <tr key={m.id} className="hover:bg-[#F2EDE4]/30">
                  <td className="p-4">
                    <div className="font-bold text-[#4A1F23]">{m.name}</div>
                    <div className="text-[10px] text-[#8C6D53]">{m.email}</div>
                    <div className="text-[10px] text-[#8C6D53]">{m.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#8E3A47]">{m.service}</div>
                    {m.message && <div className="text-[10px] text-gray-500 mt-1 truncate max-w-[200px]">{m.message}</div>}
                  </td>
                  <td className="p-4 font-medium">
                    <div className="text-[#4A1F23]">{m.date}</div>
                    <div className="text-[#8C6D53] text-[10px] bg-[#F5E1C7]/30 px-2 py-0.5 rounded w-fit mt-1 border border-[#E7B6A5]/20">{m.time}</div>
                  </td>
                  <td className="p-4">{getStatusBadge(m.status)}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(m)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Process Meeting">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete">
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
              {editingId ? 'Process Meeting Request' : 'Schedule New Meeting'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Client Name</label>
                    <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">CRM Status</label>
                    <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold">
                       <option value="Pending">Pending (New Request)</option>
                       <option value="Scheduled">Scheduled</option>
                       <option value="Completed">Completed</option>
                       <option value="Cancelled">Cancelled</option>
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
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Service Required</label>
                    <select value={formData.service} onChange={e=>setFormData({...formData, service: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none">
                       <option value="Investment Consultation">Investment Consultation</option>
                       <option value="Property Viewing">Property Viewing</option>
                       <option value="Golden Visa Advisory">Golden Visa Advisory</option>
                       <option value="Property Management">Property Management</option>
                    </select>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Preferred Date</label>
                    <input type="date" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-medium"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Preferred Time</label>
                    <input type="time" value={formData.time} onChange={e=>setFormData({...formData, time: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-medium text-[#8E3A47]"/>
                 </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Client Message / Questions</label>
                <textarea rows={4} value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="Specific questions from the client..."/>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Syncing...' : (
                  editingId ? <><Save className="w-5 h-5"/> Update Meeting Status</> : <><Users className="w-5 h-5"/> Schedule Meeting</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}