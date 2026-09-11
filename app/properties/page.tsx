'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fraunces } from 'next/font/google';
import {
  Search,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Building2,
  PhoneCall,
  Menu,
  Lock,
  UserPlus,
  Heart,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Navbar from '@/components/Navbar';
import { getStoredItems, ItemProperty } from '@/lib/data';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const SORTS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Size: Largest First'] as const;

function formatAED(value: number) {
  if (value >= 1000000) return `AED ${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  return `AED ${value.toLocaleString('en-US')}`;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<ItemProperty[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [type, setType] = useState<string>('All Types');
  const [status, setStatus] = useState<'All' | 'Off-Plan' | 'Ready'>('All');
  const [maxPrice, setMaxPrice] = useState(25000000);
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    // Récupération dynamique depuis l'espace Admin / localStorage
    setProperties(getStoredItems('oravya_properties'));
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

  const LOCATIONS = ['All Locations', ...Array.from(new Set(properties.map((p) => p.location)))];
  const TYPES = ['All Types', ...Array.from(new Set(properties.map((p) => p.type)))];

  const results = useMemo(() => {
    let list = properties.filter((p) => {
      const matchesQuery =
        query.trim() === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase());
      const matchesLocation = location === 'All Locations' || p.location === location;
      const matchesType = type === 'All Types' || p.type === type;
      const matchesStatus = status === 'All' || p.status === status;
      const matchesPrice = p.price <= maxPrice;
      return matchesQuery && matchesLocation && matchesType && matchesStatus && matchesPrice;
    });

    switch (sort) {
      case 'Price: Low to High':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'Size: Largest First':
        list = [...list].sort((a, b) => b.size - a.size);
        break;
      default:
        list = [...list].sort((a, b) => Number(b.status === 'Ready') - Number(a.status === 'Ready'));
    }
    return list;
  }, [properties, query, location, type, status, maxPrice, sort]);

  const activeFilterCount =
    (location !== 'All Locations' ? 1 : 0) +
    (type !== 'All Types' ? 1 : 0) +
    (status !== 'All' ? 1 : 0) +
    (maxPrice < 25000000 ? 1 : 0);

  function resetFilters() {
    setLocation('All Locations');
    setType('All Types');
    setStatus('All');
    setMaxPrice(25000000);
  }

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] overflow-x-hidden">
      {/* NAVBAR UNIFIÉE */}
      <Navbar />

      {/* PAGE HEADER */}
      <section className="px-6 pt-16 pb-10 max-w-7xl mx-auto border-b border-[#D8CEBE]">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">
            {results.length} {results.length === 1 ? 'Property' : 'Properties'} Available
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1 className={`${fraunces.className} text-3xl md:text-5xl font-medium tracking-tight max-w-2xl text-[#2C181A]`}>
              The Full Portfolio, Curated for Serious Buyers
            </h1>
            <p className="text-[#685248] font-light max-w-sm">
              Every listing below is verified and available today — filter by location, budget, and property type to find your match.
            </p>
          </div>
        </Reveal>
      </section>

      {/* SEARCH + FILTER BAR */}
      <section className="px-6 py-6 max-w-7xl mx-auto sticky top-[73px] z-40 bg-[#F2EDE4]/95 backdrop-blur-md border-b border-[#D8CEBE]">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-3 flex-1 bg-[#EBE4DA] px-4 py-3 rounded-xl border border-[#D8CEBE]">
            <Search className="text-[#4A151B] w-5 h-5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by property or location..."
              className="bg-transparent w-full text-[#2C181A] outline-none placeholder:text-[#A8989A] text-sm"
            />
          </div>

          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center justify-center gap-2 bg-[#EBE4DA] border border-[#D8CEBE] px-5 py-3 rounded-xl text-sm font-medium text-[#2C181A] hover:border-[#4A151B]/50 transition relative"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#4A151B]" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#4A151B] text-[#F2EDE4] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 bg-[#EBE4DA] border border-[#D8CEBE] px-4 py-3 rounded-xl">
            <ArrowUpDown className="w-4 h-4 text-[#4A151B] shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
              className="bg-transparent text-[#2C181A] text-sm outline-none cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s} value={s} className="bg-[#F2EDE4]">{s}</option>
              ))}
            </select>
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-4 p-6 bg-[#EBE4DA]/90 border border-[#D8CEBE] rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-sm">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-3 py-2.5 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
              >
                {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#F2EDE4]">{l}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-3 py-2.5 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
              >
                {TYPES.map((t) => <option key={t} value={t} className="bg-[#F2EDE4]">{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'All' | 'Off-Plan' | 'Ready')}
                className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-3 py-2.5 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
              >
                <option value="All" className="bg-[#F2EDE4]">All Statuses</option>
                <option value="Off-Plan" className="bg-[#F2EDE4]">Off-Plan</option>
                <option value="Ready" className="bg-[#F2EDE4]">Ready</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">
                Max Price — {formatAED(maxPrice)}
              </label>
              <input
                type="range"
                min={1000000}
                max={25000000}
                step={500000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#4A151B] mt-3.5 cursor-pointer"
              />
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="sm:col-span-2 lg:col-span-4 flex items-center justify-center gap-2 text-sm text-[#685248] hover:text-[#4A151B] transition pt-2 font-medium"
              >
                <X className="w-4 h-4" /> Clear all filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* RESULTS GRID */}
      <section className="px-6 py-14 max-w-7xl mx-auto">
        {results.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#D8CEBE] rounded-2xl bg-[#EBE4DA]/40">
            <Building2 className="w-10 h-10 text-[#8C6D53] mx-auto mb-4" />
            <p className="text-[#2C181A] font-medium mb-1">No properties match these filters</p>
            <p className="text-[#685248] text-sm mb-6">Try widening your budget or clearing a filter.</p>
            <button
              onClick={resetFilters}
              className="text-sm font-semibold text-[#4A151B] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((property, i) => {
              const isFav = favorites.includes(property.id);
              return (
                <Reveal key={property.id} delay={(i % 3) * 80}>
                  <div className="bg-[#EBE4DA]/80 border border-[#D8CEBE] rounded-2xl overflow-hidden hover:border-[#4A151B]/40 transition group shadow-sm flex flex-col justify-between h-full relative">
                    <div>
                      <div className="h-56 bg-[#DFD6C9] relative overflow-hidden">
                        <Image 
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'} 
                          alt={property.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition duration-500" 
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            {property.status}
                          </span>
                        </div>

                        {/* Bouton Favoris */}
                        <button
                          onClick={(e) => toggleFavorite(property.id, e)}
                          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition shadow-md z-20 ${
                            isFav ? 'bg-[#4A151B] text-[#F2EDE4]' : 'bg-[#F2EDE4]/90 text-[#4A151B] hover:scale-110'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="p-6">
                        <span className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold">{property.type}</span>
                        <h3 className="text-lg font-bold mt-1 mb-2 text-[#2C181A] group-hover:text-[#4A151B] transition">
                          {property.name}
                        </h3>
                        <p className="text-[#685248] text-sm flex items-center gap-1 mb-4">
                          <MapPin className="w-4 h-4 text-[#8C6D53]" /> {property.location}, Dubai
                        </p>

                        <div className="flex items-center gap-4 text-[#685248] text-xs mb-5 pb-5 border-b border-[#D8CEBE]">
                          {property.beds > 0 && (
                            <span className="flex items-center gap-1.5">
                              <BedDouble className="w-4 h-4 text-[#8C6D53]" /> {property.beds}
                            </span>
                          )}
                          {property.baths > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Bath className="w-4 h-4 text-[#8C6D53]" /> {property.baths}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Maximize className="w-4 h-4 text-[#8C6D53]" /> {property.size.toLocaleString('en-US')} sqft
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-[#4A151B] text-base">{formatAED(property.price)}</span>
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-xs bg-[#F2EDE4] hover:bg-[#4A151B] hover:text-[#F2EDE4] border border-[#D8CEBE] text-[#2C181A] px-3.5 py-2 rounded-lg transition font-medium shadow-sm"
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

      {/* FOOTER */}
      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8C6D53] border-t border-[#D8CEBE]">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/properties" className="hover:text-[#4A151B] transition">Properties</Link>
          <Link href="/holiday-homes" className="hover:text-[#4A151B] transition">Holiday Homes</Link>
          <Link href="/contact" className="hover:text-[#4A151B] transition">Contact</Link>
        </div>
      </footer>
    </div>
  );
}