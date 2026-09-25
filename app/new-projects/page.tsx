'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Fraunces } from 'next/font/google';
import { MapPin, Sparkles, Map, ChevronRight, Building2, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Reveal from '@/components/Reveal';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'] });

function formatAED(value: number) {
  if (!value) return 'Price on request';
  if (value >= 1000000) return `AED ${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  return `AED ${value.toLocaleString('en-US')}`;
}

function NewProjectsContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Filtres
  const [selectedCommunity, setSelectedCommunity] = useState('All communities');
  const [selectedType, setSelectedType] = useState('All unit types');
  const [selectedHandover, setSelectedHandover] = useState('Any handover');

  // Récupération des projets off-plan depuis MySQL via l'API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filtrer pour ne garder que les projets Off-Plan ou New Launch
          const offPlanList = data.filter((p: any) => p.status === 'Off-Plan' || p.status === 'New Launch');
          
          const formatted = offPlanList.map((p) => {
            let imgs = ['/logo.png'];
            try {
              if (p.images) {
                const parsed = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
                if (Array.isArray(parsed) && parsed.length > 0) imgs = parsed;
              }
            } catch (e) {}
            return { ...p, images: imgs };
          });
          setProjects(formatted);
        }
      } catch (err) {
        console.error('Erreur chargement projets off-plan:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();

    const storedFavs = localStorage.getItem('oravya_favorites');
    if (storedFavs) {
      try { setFavorites(JSON.parse(storedFavs)); } catch (e) {}
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const updated = favorites.includes(id) ? favorites.filter(favId => favId !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('oravya_favorites', JSON.stringify(updated));
  };

  // Listes dynamiques pour les sélecteurs de filtres basées sur la BDD
  const COMMUNITIES = ['All communities', ...Array.from(new Set(projects.map((p) => p.location).filter(Boolean)))];
  const TYPES = ['All unit types', ...Array.from(new Set(projects.map((p) => p.type).filter(Boolean)))];
  const HANDOVERS = ['Any handover', ...Array.from(new Set(projects.map((p) => p.handover).filter(Boolean)))];

  // Filtrage dynamique des projets
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCommunity = selectedCommunity === 'All communities' || p.location === selectedCommunity;
      const matchesType = selectedType === 'All unit types' || p.type === selectedType;
      const matchesHandover = selectedHandover === 'Any handover' || p.handover === selectedHandover;
      return matchesCommunity && matchesType && matchesHandover;
    });
  }, [projects, selectedCommunity, selectedType, selectedHandover]);

  return (
    <>
      {/* ================= DYNAMIC FILTER BAR ================= */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-30">
        <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl p-4 md:p-6 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#8E3A47] font-bold mb-1.5">Community</label>
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/40 rounded-xl px-3 py-2.5 text-xs text-[#4A1F23] outline-none cursor-pointer font-medium"
            >
              {COMMUNITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#8E3A47] font-bold mb-1.5">Unit Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/40 rounded-xl px-3 py-2.5 text-xs text-[#4A1F23] outline-none cursor-pointer font-medium"
            >
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#8E3A47] font-bold mb-1.5">Handover</label>
            <select
              value={selectedHandover}
              onChange={(e) => setSelectedHandover(e.target.value)}
              className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/40 rounded-xl px-3 py-2.5 text-xs text-[#4A1F23] outline-none cursor-pointer font-medium"
            >
              {HANDOVERS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-4 md:pt-6">
            <button 
              onClick={() => { setSelectedCommunity('All communities'); setSelectedType('All unit types'); setSelectedHandover('Any handover'); }}
              className="flex-1 bg-[#8E3A47] hover:bg-[#6B2B2E] text-[#F5E1C7] font-bold py-3 px-4 rounded-xl transition text-xs uppercase tracking-wider shadow-md"
            >
              Reset Filters
            </button>
            <Link
              href="/map"
              className="flex items-center justify-center gap-1.5 bg-[#F5E1C7]/30 hover:bg-[#F5E1C7] text-[#4A1F23] border border-[#E7B6A5] font-semibold py-3 px-4 rounded-xl transition text-xs"
              title="View on Map"
            >
              <Map className="w-4 h-4 text-[#8E3A47]" />
              <span className="hidden sm:inline">Map</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ================= PROJECTS GRID (DYNAMIC FROM DATABASE) ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <p className="text-xs uppercase tracking-widest text-[#8C6D53] font-semibold">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} available
          </p>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <p className="text-sm text-[#8C6D53]">Loading new projects from database...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#D8CEBE] rounded-2xl bg-white/40">
            <Building2 className="w-10 h-10 text-[#8C6D53] mx-auto mb-4" />
            <p className="text-[#2C181A] font-medium mb-1">No off-plan projects match these filters</p>
            <p className="text-[#685248] text-sm mb-6">Try resetting your filter selections.</p>
            <button
              onClick={() => { setSelectedCommunity('All communities'); setSelectedType('All unit types'); setSelectedHandover('Any handover'); }}
              className="text-sm font-semibold text-[#4A151B] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => {
              const isFav = favorites.includes(String(project.id));
              return (
                <Reveal key={project.id} delay={(i % 3) * 80}>
                  <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl overflow-hidden hover:border-[#8E3A47] transition duration-300 group shadow-sm flex flex-col justify-between h-full relative">
                    <div>
                      <div className="h-64 relative bg-[#DFD6C9] overflow-hidden">
                        <Image
                          src={project.images[0]}
                          alt={project.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {project.paymentPlan && (
                          <span className="absolute top-4 left-4 bg-[#8E3A47] text-[#F5E1C7] text-[11px] font-bold px-3 py-1 rounded-full z-10 shadow-md">
                            {project.paymentPlan}
                          </span>
                        )}

                        {project.developer && (
                          <span className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg">
                            {project.developer}
                          </span>
                        )}

                        {project.handover && (
                          <span className="absolute bottom-4 left-4 text-white text-xs font-medium bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg">
                            Handover: {project.handover}
                          </span>
                        )}

                        <button
                          onClick={(e) => toggleFavorite(String(project.id), e)}
                          className={`absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition shadow-md z-20 ${
                            isFav ? 'bg-[#8E3A47] text-[#F5E1C7]' : 'bg-white/90 text-[#4A1F23] hover:scale-110'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="p-6">
                        <span className="text-xs text-[#8E3A47] uppercase tracking-wider font-semibold">{project.type || 'Off-Plan'}</span>
                        <h3 className="text-lg font-bold mt-1 mb-2 text-[#4A1F23] group-hover:text-[#8E3A47] transition">{project.name}</h3>
                        <p className="text-[#8C6D53] text-sm flex items-center gap-1 mb-4">
                          <MapPin className="w-4 h-4 text-[#8E3A47]" /> {project.location}, Dubai
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="flex justify-between items-center pt-4 border-t border-[#E7B6A5]/40">
                        <div>
                          <span className="text-[10px] uppercase text-[#8C6D53] block font-semibold">Starting from</span>
                          <span className="font-bold text-[#4A1F23] text-base">{formatAED(project.price)}</span>
                        </div>
                        <Link
                          href={`/properties/${project.id}`}
                          className="text-xs bg-[#F5E1C7]/30 hover:bg-[#8E3A47] hover:text-[#F5E1C7] border border-[#E7B6A5] text-[#4A1F23] px-4 py-2.5 rounded-xl transition font-medium shadow-sm"
                        >
                          Discover
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default function NewProjectsPage() {
  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] overflow-x-hidden">
      <Navbar />

      {/* ================= HERO & BREADCRUMBS AVEC ARRIÈRE-PLAN LUXUEUX ================= */}
      <section className="relative bg-[#4A1F23] text-[#F5E1C7] py-28 px-6 border-b border-[#E7B6A5]/20 pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1F23]/95 via-[#4A1F23]/85 to-[#4A1F23]/75 backdrop-blur-[2px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#E7B6A5] mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white">New Off Plan Projects in Dubai</span>
          </div>

          <h1 className={`${fraunces.className} text-3xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-md`}>
            Off-Plan Properties &amp; New Projects in Dubai
          </h1>
          <p className="text-[#F5E1C7]/90 font-light max-w-3xl text-sm md:text-base leading-relaxed drop-shadow">
            Launches from top developers, with payment plans and handover dates on every listing. Filter dynamically by community, unit type, or handover schedule.
          </p>
        </div>
      </section>

      {/* ENVELOPPEMENT SUSPENSE POUR ÉVITER L'ERREUR BUILD */}
      <Suspense fallback={<div className="text-center py-24 text-sm text-[#8C6D53]">Loading projects interface...</div>}>
        <NewProjectsContent />
      </Suspense>

      {/* ================= SEO CONTENT ================= */}
      <div className="bg-white border-t border-[#E7B6A5]/30 py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className={`${fraunces.className} text-2xl md:text-3xl font-bold text-[#4A1F23] mb-4`}>
              Why Off Plan Properties in Dubai Are a Top Investment Choice in 2026
            </h2>
            <p className="text-[#6B2B2E]/90 text-sm md:text-base font-light leading-relaxed mb-4">
              Dubai’s off plan property market continues to thrive in 2026, cementing its position as one of the most lucrative investment opportunities in the UAE. Both local and international buyers are increasingly drawn to off plan properties in Dubai due to attractive pricing, flexible payment plans, and strong capital appreciation.
            </p>
          </div>

          <div className="bg-[#4A1F23] text-[#F5E1C7] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-2 block">Direct Access</span>
              <h3 className={`${fraunces.className} text-2xl md:text-3xl font-bold mb-4`}>Want the launch before it is public?</h3>
              <p className="text-xs md:text-sm text-[#F5E1C7]/80 font-light mb-8">
                We sell direct from master developers, ensuring our buyers get first access to release prices and payment plans.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-[#F5E1C7] font-bold px-8 py-3.5 rounded-xl transition text-xs uppercase tracking-wider shadow-md">
                  Talk to a broker
                </Link>
                <Link href="/explore/developers" className="bg-[#F5E1C7]/20 hover:bg-[#F5E1C7]/30 text-[#F5E1C7] border border-[#E7B6A5]/40 font-semibold px-8 py-3.5 rounded-xl transition text-xs uppercase tracking-wider">
                  See all developers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8C6D53] border-t border-[#D8CEBE]">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/properties" className="hover:text-[#4A151B] transition">Properties</Link>
          <Link href="/services" className="hover:text-[#4A151B] transition">Services</Link>
          <Link href="/contact" className="hover:text-[#4A151B] transition">Contact</Link>
        </div>
      </footer>
    </div>
  );
}