'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarClock, PlusCircle, Edit3, Trash2, X, Save, 
  PhoneCall, Users, Eye, AlertTriangle
} from 'lucide-react';

export default function AgendaAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State (On utilise YYYY-MM-DDTHH:mm pour le datetime-local)
  const [formData, setFormData] = useState({ 
    title: '', date: '', type: 'Meeting', participants: '', notes: '' 
  });
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agenda');
      if (res.ok) setEvents(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData, id: editingId };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/agenda', { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchEvents(); 
      } else alert("Erreur lors de la sauvegarde.");
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this event from the agenda?')) return;
    try {
      const res = await fetch(`/api/agenda?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchEvents();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (event: any) => {
    setEditingId(event.id);
    // Convertir ISO String pour l'input type="datetime-local" (YYYY-MM-DDTHH:mm)
    const formatDateTimeLocal = (isoString: string) => {
      if (!isoString) return '';
      const d = new Date(isoString);
      // Ajustement fuseau horaire local
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    };

    setFormData({ 
      title: event.title, 
      date: formatDateTimeLocal(event.date), 
      type: event.type, 
      participants: event.participants || '', 
      notes: event.notes || '' 
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', date: '', type: 'Meeting', participants: '', notes: '' });
  };

  // UI Helpers pour les icônes selon le type d'événement
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Call': return <span className="flex items-center gap-1 text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><PhoneCall className="w-3 h-3"/> Call</span>;
      case 'Viewing': return <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><Eye className="w-3 h-3"/> Viewing</span>;
      case 'Deadline': return <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><AlertTriangle className="w-3 h-3"/> Deadline</span>;
      default: return <span className="flex items-center gap-1 text-indigo-700 bg-indigo-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><Users className="w-3 h-3"/> Meeting</span>;
    }
  };

  // Séparer les événements passés des événements futurs
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= now);
  const pastEvents = events.filter(e => new Date(e.date) < now);

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">CRM & Network</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Master Agenda</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading agenda...</div>
        ) : events.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">Your agenda is empty.</div>
        ) : (
          <div>
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
                <tr className="text-[#8C6D53] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">Event Detail</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Participants</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
                
                {upcomingEvents.length > 0 && (
                  <tr>
                    <td colSpan={4} className="bg-[#8E3A47]/5 text-[#8E3A47] font-bold p-3 text-center uppercase tracking-widest text-[10px]">Upcoming Events</td>
                  </tr>
                )}
                {upcomingEvents.map(e => (
                  <tr key={e.id} className="hover:bg-[#F2EDE4]/30">
                    <td className="p-4">
                      <div className="font-bold text-[#4A1F23] text-sm mb-1">
                        {new Date(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                      <div className="text-[#8E3A47] font-semibold text-[11px] bg-[#F5E1C7]/30 px-2 py-1 rounded w-fit">
                        {new Date(e.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="mb-1.5">{getTypeIcon(e.type)}</div>
                      <div className="font-bold text-[#4A1F23] text-sm">{e.title}</div>
                      {e.notes && <div className="text-[#8C6D53] text-[10px] truncate max-w-[200px] mt-1">{e.notes}</div>}
                    </td>
                    <td className="p-4 text-[#8C6D53] hidden md:table-cell font-medium">
                      {e.participants || 'None specified'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(e)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Edit Event"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}

                {pastEvents.length > 0 && (
                  <tr>
                    <td colSpan={4} className="bg-gray-100 text-gray-500 font-bold p-3 text-center uppercase tracking-widest text-[10px]">Past Events</td>
                  </tr>
                )}
                {pastEvents.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                    <td className="p-4">
                      <div className="font-bold text-gray-700 text-sm mb-1">{new Date(e.date).toLocaleDateString('en-GB')}</div>
                      <div className="text-gray-500 font-semibold text-[11px] bg-gray-200 px-2 py-1 rounded w-fit">
                        {new Date(e.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="mb-1.5">{getTypeIcon(e.type)}</div>
                      <div className="font-bold text-gray-700 text-sm">{e.title}</div>
                    </td>
                    <td className="p-4 text-gray-500 hidden md:table-cell">{e.participants || '-'}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(e)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7B6A5] rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-[#F2EDE4] hover:bg-[#E7B6A5]/40 text-[#4A1F23]"><X className="w-5 h-5" /></button>
            
            <h3 className="text-3xl font-serif font-bold text-[#4A1F23] mb-8 border-b border-[#E7B6A5]/30 pb-4">
              {editingId ? 'Edit Event' : 'Schedule New Event'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              
              <div>
                 <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Event Title</label>
                 <input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]" placeholder="Ex: Client Viewing - Villa 14"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Date & Time</label>
                    <input type="datetime-local" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#8E3A47]"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Event Type</label>
                    <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold">
                       <option value="Meeting">Meeting (In-person or Zoom)</option>
                       <option value="Call">Phone Call</option>
                       <option value="Viewing">Property Viewing</option>
                       <option value="Deadline">Important Deadline</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Participants (Names / Emails)</label>
                <input type="text" value={formData.participants} onChange={e=>setFormData({...formData, participants: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none" placeholder="Ex: John Doe, agent@oravya.com"/>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Notes & Location Details</label>
                <textarea rows={3} value={formData.notes} onChange={e=>setFormData({...formData, notes: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="Zoom link, physical address, or discussion points..."/>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Syncing...' : (
                  editingId ? <><Save className="w-5 h-5"/> Update Event</> : <><CalendarClock className="w-5 h-5"/> Add to Agenda</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}