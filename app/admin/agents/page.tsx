'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  UserCircle2, PlusCircle, Edit3, Trash2, X, UploadCloud, Save, CheckCircle2, XCircle
} from 'lucide-react';

export default function AgentsAdmin() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', languages: '', specialty: 'Luxury Properties', active: true 
  });
  
  // Image Upload State (Photo de profil)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents');
      if (res.ok) setAgents(await res.json());
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
    Object.entries(formData).forEach(([key, value]) => {
      if(key === 'active') data.append(key, value.toString());
      else data.append(key, value as string);
    });
    
    if (editingId) data.append('id', editingId);
    if (existingImage) data.append('existingPhoto', existingImage);
    if (imageFile) data.append('photo', imageFile);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/agents', { method, body: data });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchAgents(); 
      } else alert("Erreur lors de la sauvegarde.");
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this agent profile?')) return;
    try {
      const res = await fetch(`/api/agents?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchAgents();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (agent: any) => {
    setEditingId(agent.id);
    setFormData({ 
      name: agent.name, 
      email: agent.email, 
      phone: agent.phone, 
      languages: agent.languages || '', 
      specialty: agent.specialty || '',
      active: agent.active
    });
    setExistingImage(agent.photo);
    setImagePreview(agent.photo);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', languages: '', specialty: 'Luxury Properties', active: true });
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">CRM & Network</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Oravya Brokers Network</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Add New Agent
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading agents network...</div>
        ) : agents.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No agents found in the database.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Agent Profile</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Specialty & Languages</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {agents.map(agent => (
                <tr key={agent.id} className="hover:bg-[#F2EDE4]/30">
                  <td className="p-4 font-bold flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full relative overflow-hidden bg-[#DFD6C9] shrink-0 border-2 border-[#F5E1C7] flex items-center justify-center">
                      {agent.photo ? (
                        <Image src={agent.photo} alt={agent.name} fill className="object-cover" />
                      ) : (
                        <UserCircle2 className="w-6 h-6 text-[#8C6D53]" />
                      )}
                    </div>
                    <span className="text-[#4A1F23] text-sm">{agent.name}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-[11px] text-[#4A1F23] font-medium">{agent.email}</div>
                    <div className="text-[10px] text-[#8C6D53]">{agent.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#8E3A47]">{agent.specialty || '-'}</div>
                    <div className="text-[10px] text-[#8C6D53]">{agent.languages || '-'}</div>
                  </td>
                  <td className="p-4">
                    {agent.active 
                      ? <span className="flex items-center gap-1 w-fit text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><CheckCircle2 className="w-3 h-3"/> Active</span>
                      : <span className="flex items-center gap-1 w-fit text-red-700 bg-red-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase"><XCircle className="w-3 h-3"/> Inactive</span>
                    }
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(agent)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Edit Profile"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(agent.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white border border-[#E7B6A5] rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-[#F2EDE4] hover:bg-[#E7B6A5]/40 text-[#4A1F23]"><X className="w-5 h-5" /></button>
            
            <h3 className="text-3xl font-serif font-bold text-[#4A1F23] mb-8 border-b border-[#E7B6A5]/30 pb-4">
              {editingId ? 'Edit Agent Profile' : 'Onboard New Agent'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image Upload Area */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <label className="font-bold text-[#8C6D53] block mb-3 uppercase text-[10px]">Profile Picture</label>
                  {!imagePreview ? (
                    <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className="w-40 h-40 border-2 border-dashed border-[#8E3A47]/40 bg-[#F5E1C7]/10 hover:bg-[#F5E1C7]/30 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                      <UploadCloud className="w-8 h-8 text-[#8E3A47] mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] text-[#4A1F23] font-bold px-4">Upload Photo</p>
                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                    </div>
                  ) : (
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-[#E7B6A5] shadow-sm">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      <button type="button" onClick={removeImage} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Trash2 className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Fields Area */}
                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Full Name</label>
                    <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]"/>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Email Address</label>
                      <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                    </div>
                    <div>
                      <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Phone Number</label>
                      <input type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Primary Specialty</label>
                      <select value={formData.specialty} onChange={e=>setFormData({...formData, specialty: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none">
                         <option value="Luxury Properties">Luxury Properties</option>
                         <option value="Off-Plan Investments">Off-Plan Investments</option>
                         <option value="Holiday Homes">Holiday Homes</option>
                         <option value="Commercial Real Estate">Commercial Real Estate</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Spoken Languages</label>
                      <input type="text" value={formData.languages} onChange={e=>setFormData({...formData, languages: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none" placeholder="Ex: English, Arabic, French"/>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#F5E1C7]/30 p-4 rounded-xl border border-[#E7B6A5]/40 mt-4">
                    <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 accent-[#8E3A47] cursor-pointer"/>
                    <label htmlFor="active" className="font-bold text-[#4A1F23] cursor-pointer">Agent is Active (Displayed on the public website)</label>
                  </div>
                </div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-8">
                {isSubmitting ? 'Syncing with Database...' : (
                  editingId ? <><Save className="w-5 h-5"/> Update Profile</> : <><UserCircle2 className="w-5 h-5"/> Onboard Agent</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}