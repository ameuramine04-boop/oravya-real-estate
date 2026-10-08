'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Gem, PlusCircle, Edit3, Trash2, X, UploadCloud, 
  Check, Wifi, ShieldCheck, Dumbbell, Waves, Trees, Car, Star
} from 'lucide-react';

const AVAILABLE_AMENITIES = [
  { id: 'wifi', label: 'High-Speed Wi-Fi', icon: Wifi },
  { id: 'security', label: '24/7 Security', icon: ShieldCheck },
  { id: 'gym', label: 'Private Gym', icon: Dumbbell },
  { id: 'pool', label: 'Private Pool', icon: Waves },
  { id: 'garden', label: 'Landscaped Garden', icon: Trees },
  { id: 'garage', label: 'Private Garage', icon: Car },
  { id: 'smart', label: 'Smart Home System', icon: Star },
];

export default function LuxuryAdmin() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', type: 'Villa', location: '', price: '', 
    status: 'Ready & Vacant', beds: '', baths: '', size: '', description: '',
    featured: false
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Image Upload State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/luxury');
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
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
        if(key === 'featured') data.append(key, value.toString());
        else data.append(key, value as string);
    });
    data.append('amenities', JSON.stringify(selectedAmenities));
    imageFiles.forEach(file => data.append('images', file));

    try {
      const res = await fetch('/api/luxury', { method: 'POST', body: data });
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchProperties(); // Rafraîchir le tableau
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    alert(`Fonctionnalité Delete à lier à l'API pour l'ID: ${id}`);
  };

  const resetForm = () => {
    setFormData({ name: '', type: 'Villa', location: '', price: '', status: 'Ready & Vacant', beds: '', baths: '', size: '', description: '', featured: false });
    setSelectedAmenities([]);
    setImageFiles([]);
    setImagePreviews([]);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Portfolio</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Luxury Sales (Secondary)</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Add Luxury Property
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#8C6D53]">Loading database records...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Property</th>
                <th className="p-4 font-semibold">Specs</th>
                <th className="p-4 font-semibold">Price (AED)</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {properties.map(p => {
                const images = p.images ? JSON.parse(p.images) : [];
                return (
                  <tr key={p.id} className="hover:bg-[#F2EDE4]/30">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl relative overflow-hidden bg-[#DFD6C9]">
                        {images.length > 0 && <Image src={images[0]} alt={p.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <div className="text-[#4A1F23]">{p.name}</div>
                        <div className="text-[10px] text-[#8C6D53] font-normal">{p.location}</div>
                      </div>
                    </td>
                    <td className="p-4 text-[#8C6D53]">{p.beds} Beds • {p.baths} Baths • {p.size} sq.ft</td>
                    <td className="p-4 font-bold text-[#4A1F23]">{Number(p.price).toLocaleString()}</td>
                    <td className="p-4"><span className="bg-[#F5E1C7]/50 text-[#8E3A47] font-bold px-2 py-1 rounded-md text-[10px] uppercase">{p.status}</span></td>
                    <td className="p-4">{p.featured ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : '-'}</td>
                    <td className="p-4 text-right space-x-2">
                      <button className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
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
            <h3 className="text-3xl font-serif font-bold text-[#4A1F23] mb-8 border-b border-[#E7B6A5]/30 pb-4">Add Secondary Market Property</h3>

            <form onSubmit={handleSubmit} className="space-y-8 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Property Title</label><input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]" placeholder="Ex: Signature Villa Frond G"/></div>
                <div>
                  <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Property Type</label>
                  <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none">
                    <option value="Villa">Villa</option><option value="Mansion">Mansion</option><option value="Penthouse">Penthouse</option><option value="Apartment">Apartment</option>
                  </select>
                </div>
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Location</label><input type="text" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none" placeholder="Ex: Palm Jumeirah"/></div>
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Selling Price (AED)</label><input type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Bedrooms</label><input type="number" value={formData.beds} onChange={e=>setFormData({...formData, beds: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/></div>
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Bathrooms</label><input type="number" value={formData.baths} onChange={e=>setFormData({...formData, baths: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/></div>
                <div><label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Size (sq.ft)</label><input type="number" value={formData.size} onChange={e=>setFormData({...formData, size: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/></div>
                <div>
                  <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Status</label>
                  <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none">
                    <option value="Ready & Vacant">Ready & Vacant</option><option value="Tenanted">Tenanted</option><option value="Upgraded">Upgraded</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#F5E1C7]/30 p-4 rounded-xl border border-[#E7B6A5]/40">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 accent-[#8E3A47] cursor-pointer"/>
                <label htmlFor="featured" className="font-bold text-[#4A1F23] cursor-pointer">Mark as Featured Property (Highlights on homepage)</label>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-3 uppercase text-[10px]">Property Features & Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {AVAILABLE_AMENITIES.map(amenity => (
                    <div key={amenity.id} onClick={() => toggleAmenity(amenity.id)} className={`cursor-pointer p-3 rounded-xl border flex items-center gap-2 transition-all ${selectedAmenities.includes(amenity.id) ? 'bg-[#8E3A47] border-[#8E3A47] text-white shadow-md' : 'bg-white border-[#E7B6A5]/40 text-[#8C6D53] hover:border-[#8E3A47]/50'}`}>
                      <amenity.icon className="w-4 h-4" />
                      <span className="text-[11px] font-semibold">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-3 uppercase text-[10px]">Upload High-Res Pictures</label>
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
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Full Description</label>
                <textarea rows={4} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="Sell the dream..."/>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2">
                {isSubmitting ? 'Uploading to Server...' : <><Gem className="w-5 h-5"/> List Luxury Property</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}