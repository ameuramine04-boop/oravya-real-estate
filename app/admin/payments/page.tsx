'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, PlusCircle, Edit3, Trash2, X, Save, 
  CheckCircle2, Clock, AlertCircle, TrendingUp, Building2, Palmtree, Briefcase
} from 'lucide-react';

export default function PaymentsAdmin() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    clientName: '', reference: '', type: 'Property Sale', 
    totalAmount: '', paidAmount: '', dueDate: '', status: 'Pending' 
  });
  
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments');
      if (res.ok) setPayments(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData, id: editingId };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/payments', { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchPayments(); 
      } else alert("Erreur lors de la sauvegarde.");
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this payment record? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/payments?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchPayments();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (payment: any) => {
    setEditingId(payment.id);
    const formatForInput = (isoString: string) => isoString ? isoString.split('T')[0] : '';
    
    setFormData({ 
      clientName: payment.clientName, 
      reference: payment.reference, 
      type: payment.type, 
      totalAmount: payment.totalAmount.toString(), 
      paidAmount: payment.paidAmount.toString(), 
      dueDate: formatForInput(payment.dueDate), 
      status: payment.status 
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ clientName: '', reference: '', type: 'Property Sale', totalAmount: '', paidAmount: '0', dueDate: '', status: 'Pending' });
  };

  // UI Helpers pour les badges de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Fully Paid': return <span className="flex items-center gap-1 w-fit text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><CheckCircle2 className="w-3 h-3"/> Fully Paid</span>;
      case 'Partial': return <span className="flex items-center gap-1 w-fit text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><TrendingUp className="w-3 h-3"/> Partial</span>;
      case 'Defaulted': return <span className="flex items-center gap-1 w-fit text-red-700 bg-red-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><AlertCircle className="w-3 h-3"/> Defaulted</span>;
      default: return <span className="flex items-center gap-1 w-fit text-amber-700 bg-amber-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><Clock className="w-3 h-3"/> Pending</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'Holiday Rental') return <Palmtree className="w-4 h-4 text-cyan-600" />;
    if (type === 'Property Sale') return <Building2 className="w-4 h-4 text-indigo-600" />;
    return <Briefcase className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Accounting</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Payments & Cashflow</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Add Payment Record
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading accounting records...</div>
        ) : payments.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No payment records found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Transaction Reference</th>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Financial Progress (AED)</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {payments.map(p => {
                const total = Number(p.totalAmount);
                const paid = Number(p.paidAmount);
                const percentage = total > 0 ? Math.round((paid / total) * 100) : 0;
                const balance = total - paid;
                
                return (
                  <tr key={p.id} className="hover:bg-[#F2EDE4]/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-bold text-[#4A1F23] mb-1">
                        {getTypeIcon(p.type)} {p.type}
                      </div>
                      <div className="text-[10px] text-[#8C6D53] bg-[#F5E1C7]/30 px-2 py-1 rounded w-fit border border-[#E7B6A5]/20">{p.reference}</div>
                    </td>
                    <td className="p-4 font-bold text-[#4A1F23]">{p.clientName}</td>
                    <td className="p-4">
                      <div className="flex justify-between items-end mb-1">
                        <span className="font-bold text-[#4A1F23]">{paid.toLocaleString()} AED</span>
                        <span className="text-[10px] text-[#8C6D53]">of {total.toLocaleString()} AED</span>
                      </div>
                      {/* Barre de progression */}
                      <div className="w-full bg-[#E7B6A5]/30 rounded-full h-1.5 mb-1 overflow-hidden">
                        <div className="bg-[#8E3A47] h-1.5 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <div className="text-[9px] text-[#8C6D53] font-semibold uppercase tracking-wider text-right">
                        Balance: <span className={balance > 0 ? 'text-amber-600' : 'text-emerald-600'}>{balance.toLocaleString()} AED</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#8E3A47]">
                      {p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td className="p-4">{getStatusBadge(p.status)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(p)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Edit Record">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete">
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
              {editingId ? 'Edit Payment Record' : 'Register New Payment'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Client Name</label>
                    <input type="text" value={formData.clientName} onChange={e=>setFormData({...formData, clientName: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Transaction Type</label>
                    <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]">
                       <option value="Property Sale">Property Sale (Off-Plan/Secondary)</option>
                       <option value="Holiday Rental">Holiday Rental</option>
                       <option value="Service Fee">Service / Advisory Fee</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Reference / Invoice Detail</label>
                <input type="text" value={formData.reference} onChange={e=>setFormData({...formData, reference: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none" placeholder="Ex: Tranche 1 - Ritz Carlton Residences"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#F5E1C7]/20 rounded-2xl border border-[#E7B6A5]/40">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Total Amount (AED)</label>
                    <input type="number" value={formData.totalAmount} onChange={e=>setFormData({...formData, totalAmount: e.target.value})} required className="w-full bg-white border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Amount Paid So Far (AED)</label>
                    <input type="number" value={formData.paidAmount} onChange={e=>setFormData({...formData, paidAmount: e.target.value})} required className="w-full bg-white border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-emerald-700"/>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Due Date / Next Installment</label>
                    <input type="date" value={formData.dueDate} onChange={e=>setFormData({...formData, dueDate: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-medium text-[#8E3A47]"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Payment Status</label>
                    <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold">
                       <option value="Pending">Pending (Not Started)</option>
                       <option value="Partial">Partial Payment</option>
                       <option value="Fully Paid">Fully Paid</option>
                       <option value="Defaulted">Defaulted (Overdue)</option>
                    </select>
                 </div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Saving to Database...' : (
                  editingId ? <><Save className="w-5 h-5"/> Update Record</> : <><CreditCard className="w-5 h-5"/> Register Payment</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}