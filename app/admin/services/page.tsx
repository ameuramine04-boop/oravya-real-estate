'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Briefcase, PlusCircle, Edit3, Trash2, X, UploadCloud, Save
} from 'lucide-react';

export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    title: '', shortDesc: '', fullDesc: '' 
  });
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
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

  // ==========================================
  // ACTION : SAUVEGARDER (CRÉER OU MODIFIER)
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('shortDesc', formData.shortDesc);
    data.append('fullDesc', formData.fullDesc);
    
    if (editingId) data.append('id', editingId);
    if (existingImage) data.append('existingImage', existingImage);
    if (imageFile) data.append('image', imageFile);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/services', { method, body: data });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchServices(); 
      } else {
        alert("Erreur lors de la sauvegarde avec la base de données.");
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  // ==========================================
  // ACTION : SUPPRIMER
  // ==========================================
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this service division?')) return;
    
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchServices(); 
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // ACTION : OUVRIR LE MODAL EN MODE "ÉDITION"
  // ==========================================
  const openEditModal = (service: any) => {
    setEditingId(service.id);
    setFormData({ 
      title: service.title, 
      shortDesc: service.shortDesc || '', 
      fullDesc: service.fullDesc || '' 
    });
    setExistingImage(service.image);
    setImagePreview(service.image);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', shortDesc: '', fullDesc: '' });
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Brand & Content</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Oravya Service Divisions</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#8C6D53]">Loading database records...</div>
        ) : services.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No services found in the database.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Service Division</th>
                <th className="p-4 font-semibold hidden md:table-cell">Short Description</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {services.map(service => (
                <tr key={service.id} className="hover:bg-[#F2EDE4]/30">
                  <td className="p-4 font-bold flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl relative overflow-hidden bg-[#DFD6C9] shrink-0 border border-[#E7B6A5]/30">
                      {service.image ? (
                        <Image src={service.image} alt={service.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Briefcase className="w-6 h-6 text-[#8C6D53] opacity-50"/></div>
                      )}
                    </div>
                    <span className="text-[#4A1F23] text-sm">{service.title}</span>
                  </td>
                  <td className="p-4 text-[#8C6D53] hidden md:table-cell">
                     {service.shortDesc && service.shortDesc.length > 80 ? service.shortDesc.substring(0, 80) + '...' : (service.shortDesc || '-')}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(service)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete">
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
              {editingId ? 'Edit Service Division' : 'Add New Service Division'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div>
                 <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Service Title</label>
                 <input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]" placeholder="Ex: Master Agency, Golden Visa Advisory..."/>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-3 uppercase text-[10px]">Service Cover Image</label>
                {!imagePreview ? (
                  <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#8E3A47]/40 bg-[#F5E1C7]/10 hover:bg-[#F5E1C7]/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                    <UploadCloud className="w-8 h-8 text-[#8E3A47] mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-[#4A1F23] font-bold text-xs">Drag & drop cover image</p>
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                  </div>
                ) : (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-[#E7B6A5] shadow-sm group">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-2 rounded-lg shadow-md transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Short Description (Card Teaser)</label>
                <textarea rows={2} value={formData.shortDesc} onChange={e=>setFormData({...formData, shortDesc: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="A brief one-sentence pitch..."/>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Full Service Description</label>
                <textarea rows={5} value={formData.fullDesc} onChange={e=>setFormData({...formData, fullDesc: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="Elaborate on the value proposition, process, and benefits..."/>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Syncing with Database...' : (
                  editingId ? <><Save className="w-5 h-5"/> Save Changes</> : <><Briefcase className="w-5 h-5"/> Add Service</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}