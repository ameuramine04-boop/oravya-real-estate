'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarDays, PlusCircle, Edit3, Trash2, X, Save, Clock, 
  CheckCircle2, XCircle, Palmtree, Building2, Briefcase, Eye
} from 'lucide-react';

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    clientName: '', clientEmail: '', clientPhone: '', 
    bookingType: 'Holiday Home', assetDetail: '', 
    startDate: '', endDate: '', status: 'Pending', notes: '' 
  });
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) setBookings(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // On combine le "Type" et le "Détail" pour l'enregistrer dans assetName
    const combinedAssetName = `${formData.bookingType} | ${formData.assetDetail}`;
    
    const payload = { 
      ...formData, 
      id: editingId,
      assetName: combinedAssetName 
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/bookings', { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchBookings(); 
      } else alert("Erreur lors de la sauvegarde.");
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this booking?')) return;
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchBookings();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (booking: any) => {
    setEditingId(booking.id);
    
    // On sépare le type et le détail s'ils ont été enregistrés avec le séparateur " | "
    let type = 'Holiday Home';
    let detail = booking.assetName;
    if (booking.assetName.includes(' | ')) {
      const parts = booking.assetName.split(' | ');
      type = parts[0];
      detail = parts[1];
    }

    const formatForInput = (isoString: string) => isoString ? isoString.split('T')[0] : '';
    
    setFormData({ 
      clientName: booking.clientName, 
      clientEmail: booking.clientEmail || '', 
      clientPhone: booking.clientPhone || '', 
      bookingType: type,
      assetDetail: detail, 
      startDate: formatForInput(booking.startDate), 
      endDate: formatForInput(booking.endDate), 
      status: booking.status, 
      notes: booking.notes || '' 
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ clientName: '', clientEmail: '', clientPhone: '', bookingType: 'Holiday Home', assetDetail: '', startDate: '', endDate: '', status: 'Pending', notes: '' });
  };

  // UI Helpers pour les badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed': return <span className="flex items-center gap-1 w-fit text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><CheckCircle2 className="w-3 h-3"/> Confirmed</span>;
      case 'Cancelled': return <span className="flex items-center gap-1 w-fit text-red-700 bg-red-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><XCircle className="w-3 h-3"/> Cancelled</span>;
      case 'Completed': return <span className="flex items-center gap-1 w-fit text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><CheckCircle2 className="w-3 h-3"/> Completed</span>;
      default: return <span className="flex items-center gap-1 w-fit text-amber-700 bg-amber-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><Clock className="w-3 h-3"/> Pending</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Holiday')) return <Palmtree className="w-4 h-4 text-cyan-600" />;
    if (type.includes('Viewing') || type.includes('Off-Plan')) return <Building2 className="w-4 h-4 text-indigo-600" />;
    return <Briefcase className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Sales & Operations</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Global Bookings & Appointments</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> New Booking
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading database records...</div>
        ) : bookings.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No bookings found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Booking Type</th>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Date / Duration</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {bookings.map(b => {
                let type = 'Holiday Home';
                let detail = b.assetName;
                if (b.assetName.includes(' | ')) {
                  const parts = b.assetName.split(' | ');
                  type = parts[0]; detail = parts[1];
                }
                return (
                  <tr key={b.id} className="hover:bg-[#F2EDE4]/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-bold text-[#4A1F23] mb-1">
                        {getTypeIcon(type)} {type}
                      </div>
                      <div className="text-[10px] text-[#8C6D53] bg-[#F5E1C7]/30 px-2 py-1 rounded w-fit">{detail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#4A1F23]">{b.clientName}</div>
                      <div className="text-[10px] text-[#8C6D53]">{b.clientEmail || '-'}</div>
                      <div className="text-[10px] text-[#8C6D53]">{b.clientPhone || '-'}</div>
                    </td>
                    <td className="p-4 font-medium">
                      <div className="text-[#8E3A47]">{new Date(b.startDate).toLocaleDateString('en-GB')}</div>
                      {b.startDate !== b.endDate && (
                        <div className="text-[#8C6D53] text-[10px]">to {new Date(b.endDate).toLocaleDateString('en-GB')}</div>
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(b.status)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(b)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Edit Booking">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Cancel & Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
              {editingId ? 'Edit Booking' : 'Register New Booking'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Category / Section</label>
                    <select value={formData.bookingType} onChange={e=>setFormData({...formData, bookingType: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]">
                       <option value="Holiday Home">Holiday Home (Stay)</option>
                       <option value="Property Viewing">Property Viewing (Luxury)</option>
                       <option value="Off-Plan Launch">Off-Plan Consultation</option>
                       <option value="Service Meeting">Service/Advisory Meeting</option>
                    </select>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Specific Asset / Topic</label>
                    <input type="text" value={formData.assetDetail} onChange={e=>setFormData({...formData, assetDetail: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none" placeholder="Ex: Villa 12, Palm Jumeirah or Golden Visa"/>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Client Full Name</label>
                    <input type="text" value={formData.clientName} onChange={e=>setFormData({...formData, clientName: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Client Email</label>
                    <input type="email" value={formData.clientEmail} onChange={e=>setFormData({...formData, clientEmail: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">{formData.bookingType.includes('Holiday') ? 'Check-in Date' : 'Date'}</label>
                    <input type="date" value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">{formData.bookingType.includes('Holiday') ? 'Check-out Date' : 'End Date (Optional)'}</label>
                    <input type="date" value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Status</label>
                    <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold">
                       <option value="Pending">Pending</option>
                       <option value="Confirmed">Confirmed</option>
                       <option value="Completed">Completed</option>
                       <option value="Cancelled">Cancelled</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Notes / Requests</label>
                <textarea rows={3} value={formData.notes} onChange={e=>setFormData({...formData, notes: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="Client requests airport pickup..."/>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Saving to Database...' : (
                  editingId ? <><Save className="w-5 h-5"/> Update Booking</> : <><CalendarDays className="w-5 h-5"/> Log Booking</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}