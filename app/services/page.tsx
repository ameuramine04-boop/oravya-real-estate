'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, ChevronRight, ArrowRight, Layers } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ServicesHubPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filtrer uniquement les services propres à Oravya (Golden Visa, Master Agency, Development Management, Interiors, Snagging)
          const oravyaServices = data.filter(srv => 
            ['golden-visa', 'master-agency', 'development-management', 'interiors', 'snagging'].includes(srv.slug)
          );
          setServices(oravyaServices);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error('Erreur chargement des services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#4A1F23] text-[#F5E1C7] py-28 px-6 border-b border-[#E7B6A5]/20 pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1F23]/95 via-[#4A1F23]/85 to-[#4A1F23]/75" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#E7B6A5] mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white">Oravya Private Services</span>
          </div>

          <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-3 block">Private Wealth &amp; Real Estate Ecosystem</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-serif">
            Exclusive Oravya Services in Dubai
          </h1>
          <p className="text-[#F5E1C7]/90 font-light max-w-3xl text-sm md:text-base leading-relaxed">
            Specialized divisions dedicated to institutional partnerships, development management, turnkey architecture, engineering inspections, and residency advisory.
          </p>
        </div>
      </section>

      {/* STATS / COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-30">
        <div className="bg-white border border-[#E7B6A5]/60 rounded-3xl p-6 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5E1C7]/40 flex items-center justify-center text-[#8E3A47]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold font-serif text-[#4A1F23]">Core Oravya Divisions</span>
              <p className="text-xs text-[#8C6D53]">Tailored advisory, development, and inspection workflows.</p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#8E3A47] bg-[#F2EDE4] px-4 py-2 rounded-xl">
            Live Database Synced
          </span>
        </div>
      </section>

      {/* SERVICES GRID */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="text-center py-24 text-sm text-[#8C6D53]">Loading Oravya services catalog...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#E7B6A5] rounded-3xl bg-white/40">
            <Building2 className="w-12 h-12 text-[#8C6D53] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#4A1F23] mb-1">No services found in database</h3>
            <p className="text-xs text-[#8C6D53] mb-6">Configure your service offerings in the Admin Dashboard.</p>
            <Link href="/admin" className="bg-[#8E3A47] text-[#F5E1C7] text-xs font-bold px-6 py-3 rounded-xl shadow-md">
              Go to Admin Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div 
                key={srv.id}
                className="bg-white border border-[#E7B6A5]/50 rounded-3xl p-8 shadow-sm hover:border-[#8E3A47] transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <span className="inline-block bg-[#F5E1C7]/40 text-[#8E3A47] text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                    {srv.category || 'Oravya Division'}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-[#4A1F23] mb-3 group-hover:text-[#8E3A47] transition">
                    {srv.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#685248] font-light leading-relaxed mb-6">
                    {srv.description}
                  </p>
                </div>

                <div>
                  <Link
                    href={`/services/${srv.slug}`}
                    className="w-full bg-[#F2EDE4]/60 hover:bg-[#8E3A47] hover:text-[#F5E1C7] border border-[#E7B6A5] text-[#4A1F23] py-3 rounded-xl transition text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8C6D53] border-t border-[#E7B6A5]/30">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/properties" className="hover:text-[#4A1F23] transition">Properties</Link>
          <Link href="/new-projects" className="hover:text-[#4A1F23] transition">New Projects</Link>
          <Link href="/agents" className="hover:text-[#4A1F23] transition">Advisors</Link>
          <Link href="/contact" className="hover:text-[#4A1F23] transition">Contact</Link>
        </div>
      </footer>
    </div>
  );
}