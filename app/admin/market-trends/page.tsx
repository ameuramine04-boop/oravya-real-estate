'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, PlusCircle, Edit3, Trash2, X, Save, 
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';

export default function MarketTrendsAdmin() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    title: '', value: '', description: '', category: 'Market Insights', direction: 'Up' 
  });
  
  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market-trends');
      if (res.ok) setTrends(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData, id: editingId };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/market-trends', { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchTrends(); 
      } else alert("Erreur lors de la sauvegarde.");
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this market trend?')) return;
    try {
      const res = await fetch(`/api/market-trends?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTrends();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (trend: any) => {
    setEditingId(trend.id);
    setFormData({ 
      title: trend.title, 
      value: trend.value, 
      description: trend.description || '', 
      category: trend.category, 
      direction: trend.direction 
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', value: '', description: '', category: 'Market Insights', direction: 'Up' });
  };

  // UI Helpers pour afficher la direction (Hausse, Baisse, Stable)
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'Up': return <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-[11px] font-bold border border-emerald-200"><TrendingUp className="w-4 h-4"/> Upward</div>;
      case 'Down': return <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-[11px] font-bold border border-red-200"><TrendingDown className="w-4 h-4"/> Downward</div>;
      default: return <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md text-[11px] font-bold border border-gray-200"><Minus className="w-4 h-4"/> Stable</div>;
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Brand & Content</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Dubai Market Trends</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Add Data Point
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading market data...</div>
        ) : trends.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No market trends published yet.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Key Metric</th>
                <th className="p-4 font-semibold">Value & Trend</th>
                <th className="p-4 font-semibold hidden md:table-cell">Insight Summary</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {trends.map(trend => (
                <tr key={trend.id} className="hover:bg-[#F2EDE4]/30">
                  <td className="p-4">
                    <div className="font-bold text-[#4A1F23] text-sm">{trend.title}</div>
                    <div className="text-[10px] text-[#8E3A47] bg-[#F5E1C7]/40 px-2 py-0.5 rounded w-fit mt-1 uppercase tracking-widest font-semibold">{trend.category}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-[#4A1F23]">{trend.value}</span>
                      {getDirectionIcon(trend.direction)}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-[#8C6D53]">
                    {trend.description ? (trend.description.length > 70 ? trend.description.substring(0, 70) + '...' : trend.description) : '-'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(trend)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Edit Metric"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(trend.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
              {editingId ? 'Edit Market Metric' : 'Add Market Metric'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Metric Name / Title</label>
                    <input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]" placeholder="Ex: Average ROI, Sales Volume..."/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Market Segment</label>
                    <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]">
                       <option value="Off-Plan Market">Off-Plan Market</option>
                       <option value="Secondary Market">Secondary Market (Luxury)</option>
                       <option value="Holiday Rentals">Holiday Rentals</option>
                       <option value="General Insights">General Insights</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#F5E1C7]/20 rounded-2xl border border-[#E7B6A5]/40">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Data Value (Displayed boldly)</label>
                    <input type="text" value={formData.value} onChange={e=>setFormData({...formData, value: e.target.value})} required className="w-full bg-white border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-xl text-[#8E3A47]" placeholder="Ex: +12%, 1.2M AED..."/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Trend Direction</label>
                    <select value={formData.direction} onChange={e=>setFormData({...formData, direction: e.target.value})} className="w-full bg-white border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold">
                       <option value="Up">📈 Upward Trend (Positive)</option>
                       <option value="Down">📉 Downward Trend (Negative)</option>
                       <option value="Neutral">➖ Stable / Neutral</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Analysis / Description</label>
                <textarea rows={3} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="Explain the reasons behind this trend..."/>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Syncing...' : (
                  editingId ? <><Save className="w-5 h-5"/> Update Metric</> : <><LineChart className="w-5 h-5"/> Publish Trend</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}