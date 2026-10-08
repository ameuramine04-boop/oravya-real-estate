'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Palmtree, PlusCircle, Edit3, Trash2, X, UploadCloud, 
  Check, Wifi, Tv, Waves, Coffee, Sparkles, Map, Key, Utensils
} from 'lucide-react';

const HOLIDAY_AMENITIES = [
  { id: 'wifi', label: 'High-Speed Wi-Fi', icon: Wifi },
  { id: 'tv', label: 'Smart TV & Netflix', icon: Tv },
  { id: 'kitchen', label: 'Fully Equipped Kitchen', icon: Utensils },
  { id: 'pool', label: 'Private/Shared Pool', icon: Waves },
  { id: 'cleaning', label: 'Daily Housekeeping', icon: Sparkles },
  { id: 'concierge', label: '24/7 Concierge', icon: Key },
  { id: 'view', label: 'Ocean/City View', icon: Map },
  { id: 'coffee', label: 'Nespresso Machine', icon: Coffee },
];

export default function HolidayHomesAdmin() {
  const [holidayHomes, setHolidayHomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', location: '', pricePerNight: '', 
    beds: '', maxGuests: '', description: '',
    active: true
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Image Upload State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHolidayHomes();
  }, []);

  const fetchHolidayHomes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/holiday-homes');
      if (res.ok) {
        const data = await res.json();
        setHolidayHomes(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setImageFiles(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  // Sauvegarde (POST via API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        if(key === 'active') data.append(key, value.toString());
        else data.append(key, value as string);
    });
    data.append('amenities', JSON.stringify(selectedAmenities));
    imageFiles.forEach(file => data.append('images', file));

    try {
      const res = await fetch('/api/holiday-homes', { method: 'POST', body: data });
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchHolidayHomes(); // Rafraîchir le tableau
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday home?')) return;
    alert(`Fonctionnalité Delete à lier à l'API pour l'ID: ${id}`);
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', pricePerNight: '', beds: '', maxGuests: '', description: '', active: true });
    setSelectedAmenities([]);
    setImageFiles([]);
    setImagePreviews([]);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Portfolio</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Holiday Homes (Short-Term)</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Add Holiday Home
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#8C6D53]">Loading database records...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Property Name</th>
                <th className="p-4 font-semibold">Capacity</th>
                <th className="p-4 font-semibold">Rate / Night (AED)</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {holidayHomes.map(home => {
                const images = home.images ? JSON.parse(home.images) : [];
                return (
                  <tr key={home.id} className="hover:bg-[#F2EDE4]/30">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl relative overflow-hidden bg-[#DFD6C9]">
                        {images.length > 0 && <Image src={images[0]} alt={home.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <div className="text-[#4A1F23]">{home.name}</div>
                        <div className="text-[10px] text-[#8C6D53] font-normal">{home.location}</div>
                      </div>
                    </td>
                    <td className="p-4 text-[#8C6D53]">{home.beds} Beds • Max {home.maxGuests} Guests</td>
                    <td className="p-4 font-bold text-[#4A1F23]">{Number(home.pricePerNight).toLocaleString()}</td>
                    <td className="p-4">
                      {home.active 
                        ? <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-md text-[10px] uppercase">Active</span>
                        : <span className="bg-gray-200 text-gray-800 font-bold px-2 py-1 rounded-md text-[10px] uppercase">Disabled</span>
                      }
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(home.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7B6A5] rounded-3xl max-w-4xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => {setIsModalOpen(false); resetForm();}} className="absolute top-6 right-6 p-2 rounded-full bg-[#F2EDE4] hover:bg-[#E7B6A5]/40 text-[#4A1F23]"><X className="w-5 h-5" /></button>
            <h3 className="text-3xl font-serif font-bold text-[#4A1F23] mb-8 border-b border-[#E7B6A5]/30 pb-4">Add Holiday Home</h3>

            <form onSubmit={handleSubmit} className="space-y-8 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Listing Title</label><input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]" placeholder="Ex: Luxury Oceanfront Villa"/></div>
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Location</label><input type="text" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none" placeholder="Ex: Bluewaters Island"/></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Nightly Rate (AED)</label><input type="number" value={formData.pricePerNight} onChange={e=>setFormData({...formData, pricePerNight: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]"/></div>
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Number of Beds</label><input type="number" value={formData.beds} onChange={e=>setFormData({...formData, beds: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/></div>
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Max Guests Allowed</label><input type="number" value={formData.maxGuests} onChange={e=>setFormData({...formData, maxGuests: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/></div>
              </div>

              <div className="flex items-center gap-3 bg-[#F5E1C7]/30 p-4 rounded-xl border border-[#E7B6A5]/40">
                <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 accent-[#8E3A47] cursor-pointer"/>
                <label htmlFor="active" className="font-bold text-[#4A1F23] cursor-pointer">Listing is Active (Visible to public for booking)</label>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-3 uppercase text-[10px]">Hospitality & Features</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {HOLIDAY_AMENITIES.map(amenity => (
                    <div key={amenity.id} onClick={() => toggleAmenity(amenity.id)} className={`cursor-pointer p-3 rounded-xl border flex items-center gap-2 transition-all ${selectedAmenities.includes(amenity.id) ? 'bg-[#8E3A47] border-[#8E3A47] text-white shadow-md' : 'bg-white border-[#E7B6A5]/40 text-[#8C6D53] hover:border-[#8E3A47]/50'}`}>
                      <amenity.icon className="w-4 h-4" />
                      <span className="text-[11px] font-semibold">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-3 uppercase text-[10px]">Upload Gallery Images</label>
                <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#8E3A47]/40 bg-[#F5E1C7]/10 hover:bg-[#F5E1C7]/30 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                  <UploadCloud className="w-10 h-10 text-[#8E3A47] mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-[#4A1F23] font-bold">Drag & drop your local images here</p>
                  <p className="text-[#8C6D53] text-xs mt-1">or click to browse your computer files</p>
                  <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-[#E7B6A5] shadow-sm group">
                        <Image src={src} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={(e) => {e.stopPropagation(); removeImage(idx);}} className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Listing Description</label>
                <textarea rows={4} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="Describe the guest experience..."/>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2">
                {isSubmitting ? 'Uploading to Server...' : <><Palmtree className="w-5 h-5"/> List Holiday Home</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}