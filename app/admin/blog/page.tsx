'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  BookOpen, PlusCircle, Edit3, Trash2, X, UploadCloud, Save 
} from 'lucide-react';

export default function BlogAdmin() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', slug: '', category: 'Market Insights', author: 'Oravya Editorial', excerpt: '', content: ''
  });
  
  // Image Upload State (Couverture)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog');
      if (res.ok) setArticles(await res.json());
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
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    
    if (editingId) data.append('id', editingId);
    if (existingImage) data.append('existingImage', existingImage);
    if (imageFile) data.append('image', imageFile);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/blog', { method, body: data });
      
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchArticles();
      } else alert("Erreur lors de la sauvegarde.");
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this article?')) return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchArticles();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (article: any) => {
    setEditingId(article.id);
    setFormData({ 
      title: article.title, 
      slug: article.slug, 
      category: article.category, 
      author: article.author, 
      excerpt: article.excerpt, 
      content: article.content 
    });
    setExistingImage(article.image);
    setImagePreview(article.image);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', category: 'Market Insights', author: 'Oravya Editorial', excerpt: '', content: '' });
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  // Convertir le titre en slug (URL-friendly) automatiquement
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const autoSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Enlève les caractères spéciaux
      .replace(/[\s_-]+/g, '-') // Remplace espaces par des tirets
      .replace(/^-+|-+$/g, ''); // Enlève les tirets en début et fin
      
    setFormData({ ...formData, title: newTitle, slug: autoSlug });
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Brand & Content</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Oravya Journal (Blog)</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition">
          <PlusCircle className="w-4 h-4" /> Write Article
        </button>
      </div>

      <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-10 text-center text-[#8C6D53]">Loading database records...</div>
        ) : articles.length === 0 ? (
           <div className="p-10 text-center text-[#8C6D53]">No articles published yet.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EDE4]/50 border-b border-[#E7B6A5]/40">
              <tr className="text-[#8C6D53] uppercase tracking-wider">
                <th className="p-4 font-semibold">Article Details</th>
                <th className="p-4 font-semibold hidden md:table-cell">Category</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B6A5]/20 text-[#2C181A]">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-[#F2EDE4]/30">
                  <td className="p-4 font-bold flex items-center gap-4">
                    <div className="w-20 h-14 rounded-lg relative overflow-hidden bg-[#DFD6C9] shrink-0 border border-[#E7B6A5]/30">
                      {article.image ? (
                        <Image src={article.image} alt={article.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-5 h-5 text-[#8C6D53] opacity-50"/></div>
                      )}
                    </div>
                    <div>
                      <div className="text-[#4A1F23] text-sm">{article.title}</div>
                      <div className="text-[#8C6D53] text-[10px] font-normal flex items-center gap-2 mt-0.5">
                        <span className="font-semibold">{article.author}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="bg-[#F5E1C7]/50 text-[#8E3A47] font-bold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">
                      {article.category}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(article)} className="text-[#8E3A47] hover:bg-[#F2EDE4] p-2 rounded-lg transition" title="Edit Article"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(article.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white border border-[#E7B6A5] rounded-3xl max-w-4xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-[#F2EDE4] hover:bg-[#E7B6A5]/40 text-[#4A1F23]"><X className="w-5 h-5" /></button>
            
            <h3 className="text-3xl font-serif font-bold text-[#4A1F23] mb-8 border-b border-[#E7B6A5]/30 pb-4">
              {editingId ? 'Edit Article' : 'Write New Article'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Title</label>
                    <input type="text" value={formData.title} onChange={handleTitleChange} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold text-[#4A1F23]" placeholder="Ex: Why Invest in Dubai in 2026?"/>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">URL Slug (Auto-generated)</label>
                    <input type="text" value={formData.slug} onChange={e=>setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none text-[#8C6D53]"/>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Category</label>
                    <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none font-bold">
                       <option value="Market Insights">Market Insights</option>
                       <option value="Lifestyle">Luxury Lifestyle</option>
                       <option value="Investment Guides">Investment Guides</option>
                       <option value="Company News">Company News</option>
                    </select>
                 </div>
                 <div>
                    <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Author Name</label>
                    <input type="text" value={formData.author} onChange={e=>setFormData({...formData, author: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none"/>
                 </div>
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-3 uppercase text-[10px]">Cover Image</label>
                {!imagePreview ? (
                  <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#8E3A47]/40 bg-[#F5E1C7]/10 hover:bg-[#F5E1C7]/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                    <UploadCloud className="w-8 h-8 text-[#8E3A47] mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-[#4A1F23] font-bold text-xs">Drag & drop cover image</p>
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                  </div>
                ) : (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-[#E7B6A5] shadow-sm">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-2 rounded-lg shadow-md transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-[#8C6D53] block mb-2 uppercase text-[10px]">Short Excerpt (Intro for the card)</label>
                <textarea rows={2} value={formData.excerpt} onChange={e=>setFormData({...formData, excerpt: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none" placeholder="A brief summary to hook the reader..."/>
              </div>
              
              <div>
                <label className="flex justify-between font-bold text-[#8C6D53] mb-2 uppercase text-[10px]">
                  <span>Full Article Content</span>
                  <span className="text-[#8E3A47]">Supports HTML: &lt;h2&gt;, &lt;b&gt;, &lt;br&gt;</span>
                </label>
                <textarea rows={8} value={formData.content} onChange={e=>setFormData({...formData, content: e.target.value})} required className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3.5 outline-none resize-none font-mono text-xs leading-relaxed" placeholder="Write your masterpiece..."/>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex justify-center items-center gap-2 mt-4">
                {isSubmitting ? 'Publishing...' : (
                  editingId ? <><Save className="w-5 h-5"/> Save Changes</> : <><BookOpen className="w-5 h-5"/> Publish Article</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}