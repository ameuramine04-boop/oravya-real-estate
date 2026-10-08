'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Handshake, PlusCircle, Edit3, Trash2, X, UploadCloud, Save, ExternalLink
} from 'lucide-react';

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', type: 'Financial & Banking', link: '' });
  
  // Image Upload State (Logo)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/partners');
      if (res.ok) setPartners(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleFile(e.target.files[0]);
  };
  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('type', formData.type);
    data.append('link', formData.link);
    
    if (editingId) data.append('id', editingId);
    if (existingImage) data.append('existingLogo', existingImage);
    if (imageFile) data.append('logo', imageFile);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/partners', { method, body: data });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchPartners();
      } else alert("Erreur lors de la sauvegarde.");
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this partner?')) return;
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchPartners();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (partner: any) => {
    setEditingId(partner.id);
    setFormData({ name: partner.name, type: partner.type, link: partner.link || '' });
    setExistingImage(partner.logo);
    setImagePreview(partner.logo);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', type: 'Financial & Banking', link: '' });
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">CRM & Network</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Strategic Partners</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Add Partner
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading partners database...</div>
        ) : partners.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No strategic partners listed yet.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Partner Brand</th>
                <th className="p-4 font-semibold">Industry Sector</th>
                <th className="p-4 font-semibold hidden md:table-cell">Website Link</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {partners.map(partner => (
                <tr key={partner.id} className="hover:bg-[#F2EDE4]/30">
                  <td className="p-4 font-bold flex items-center gap-4">
                    <div className="w-20 h-12 relative overflow-hidden bg-white shrink-0 border border-[#E7B6A5]/30 rounded-lg flex items-center justify-center p-1.5">
                      {partner.logo ? (
                        <Image src={partner.logo} alt={partner.name} fill className="object-contain p-1" />
                      ) : (
                        <Handshake className="w-5 h-5 text-[#E7B6A5]" />
                      )}
                    </div>
                    <span className="text-[#4A1F23] text-sm">{partner.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="bg-[#F5E1C7]/50 text-[#8E3A47] font-bold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">
                      {partner.type}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {partner.link ? (
                      <a href={partner.link.startsWith('http') ? partner.link : `https://${partner.link}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#8C6D53] hover:text-[#8E3A47] transition">
                        {partner.link} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(partner)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Edit Partner"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(partner.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
              {editingId ? 'Edit Partner Details' : 'Add Strategic Partner'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Partner / Company Name</label>
                    <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]" placeholder="Ex: Emirates NBD"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Industry Sector</label>
                    <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold">
                       <option value="Financial & Banking">Financial & Banking</option>
                       <option value="Legal & Conveyancing">Legal & Conveyancing</option>
                       <option value="Interior Design">Architecture & Interior Design</option>
                       <option value="Media & Advertising">Media & Advertising</option>
                       <option value="Hospitality">Hospitality</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Website URL (Optional)</label>
                <input type="text" value={formData.link} onChange={e=>setFormData({...formData, link: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none" placeholder="Ex: www.emiratesnbd.com"/>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-3 uppercase text-[10px]">Company Logo</label>
                {!imagePreview ? (
                  <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#8E3A47]/40 bg-[#F5E1C7]/10 hover:bg-[#F5E1C7]/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                    <UploadCloud className="w-8 h-8 text-[#8E3A47] mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-[#4A1F23] font-bold text-xs">Drag & drop logo image</p>
                    <p className="text-[10px] text-[#8C6D53] mt-1">(PNG with transparent background highly recommended)</p>
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                  </div>
                ) : (
                  <div className="relative w-48 h-24 mx-auto rounded-xl overflow-hidden border border-[#E7B6A5] shadow-sm group bg-white flex items-center justify-center">
                    <Image src={imagePreview} alt="Preview" fill className="object-contain p-2" />
                    <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md shadow-md transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Syncing...' : (
                  editingId ? <><Save className="w-5 h-5"/> Save Details</> : <><Handshake className="w-5 h-5"/> Add Partner</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}