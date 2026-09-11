'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fraunces } from 'next/font/google';
import {
  MapPin,
  Users,
  BedDouble,
  Bath,
  Maximize,
  Star,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Heart,
  Calendar,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Navbar from '@/components/Navbar';
import { getStoredItems, saveStoredBooking, ItemProperty } from '@/lib/data';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

function formatAED(v: number) {
  return `AED ${v.toLocaleString('en-US')}`;
}

function nightsBetween(from: string, to: string) {
  if (!from || !to) return 0;
  const ms = new Date(to).getTime() - new Date(from).getTime();
  const nights = Math.round(ms / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

export default function HolidayHomesPage() {
  const [holidays, setHolidays] = useState<ItemProperty[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [location, setLocation] = useState('All Locations');
  
  // Modal de réservation directe
  const [selectedHome, setSelectedHome] = useState<ItemProperty | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Récupère les Holiday Homes synchronisés avec l'Admin
    setHolidays(getStoredItems('oravya_holidays'));
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

  const LOCATIONS = ['All Locations', ...Array.from(new Set(holidays.map((h) => h.location)))];
  const nights = nightsBetween(checkIn, checkOut);

  const results = useMemo(() => {
    return holidays.filter((h) => {
      const matchesLocation = location === 'All Locations' || h.location === location;
      const matchesGuests = (h.beds * 2) >= guests; // Estimation du nombre de convives par lit
      return matchesLocation && matchesGuests;
    });
  }, [holidays, location, guests]);

  const handleDirectBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHome || !clientName || !clientEmail || !clientPhone || !checkIn || !checkOut) return;

    const totalNights = nights > 0 ? nights : 1;
    const totalPrice = selectedHome.price * totalNights;

    saveStoredBooking({
      id: 'book-' + Date.now(),
      itemId: selectedHome.id,
      itemName: selectedHome.name,
      itemType: 'Holiday Home',
      clientName,
      clientEmail,
      clientPhone,
      checkIn,
      checkOut,
      totalPrice,
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    });

    setBookingSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      {/* NAVBAR UNIFIÉE */}
      <Navbar />

      {/* HERO */}
      <section className="px-6 pt-20 pb-10 max-w-7xl mx-auto">
        <Reveal>
          <span className="inline-block text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-5 border-l-2 border-[#C5A880] pl-3">
            Premium Seasonal Rentals
          </span>
          <h1 className={`${fraunces.className} text-4xl md:text-6xl font-medium tracking-tight mb-5 max-w-3xl leading-[1.1] text-[#2C181A]`}>
            Stay in Dubai&apos;s finest addresses, by the night
          </h1>
          <p className="text-[#685248] text-lg font-light max-w-2xl">
            Fully furnished, professionally managed holiday homes — booked directly, with no platform markup.
          </p>
        </Reveal>
      </section>

      {/* BOOKING SEARCH BAR */}
      <section className="px-6 max-w-7xl mx-auto">
        <Reveal delay={100}>
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-4 md:p-5 rounded-2xl shadow-xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
            <div className="flex items-center gap-3 bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE]">
              <MapPin className="text-[#4A151B] w-5 h-5 shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent w-full text-[#2C181A] outline-none cursor-pointer text-sm"
              >
                {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#F2EDE4]">{l}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE]">
              <CalendarDays className="text-[#4A151B] w-5 h-5 shrink-0" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent w-full text-[#2C181A] outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-3 bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE]">
              <CalendarDays className="text-[#4A151B] w-5 h-5 shrink-0" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent w-full text-[#2C181A] outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE]">
              <Users className="text-[#4A151B] w-5 h-5 shrink-0" />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-transparent text-[#2C181A] outline-none cursor-pointer text-sm"
              >
                {[1, 2, 3, 4, 6, 8, 10].map((g) => (
                  <option key={g} value={g} className="bg-[#F2EDE4]">{g} guest{g > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          {nights > 0 && (
            <p className="text-[#8C6D53] text-xs mt-3 pl-1 font-medium">{nights} night{nights > 1 ? 's' : ''} selected</p>
          )}
        </Reveal>
      </section>

      {/* RESULTS GRID */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[#685248] text-sm font-medium">{results.length} holiday homes available</p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-24 bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl">
            <p className="font-medium text-[#2C181A]">No holiday homes match your criteria</p>
            <p className="text-xs text-[#685248] mt-1">L'administrateur peut en ajouter de nouveaux depuis son tableau de bord.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((home, i) => {
              const isFav = favorites.includes(home.id);
              return (
                <Reveal key={home.id} delay={(i % 3) * 80}>
                  <div className="bg-[#EBE4DA]/80 border border-[#D8CEBE] rounded-2xl overflow-hidden hover:border-[#4A151B]/40 transition group shadow-sm flex flex-col justify-between h-full relative">
                    <div>
                      <div className="h-56 bg-[#DFD6C9] relative overflow-hidden">
                        <Image 
                          src={home.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'} 
                          alt={home.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition duration-500" 
                        />
                        <span className="absolute top-4 left-4 bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md z-10">
                          Holiday Stay
                        </span>
                        
                        {/* Cœur Favoris */}
                        <button
                          onClick={(e) => toggleFavorite(home.id, e)}
                          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition shadow-md z-20 ${
                            isFav ? 'bg-[#4A151B] text-[#F2EDE4]' : 'bg-[#F2EDE4]/90 text-[#4A151B] hover:scale-110'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="p-6">
                        <span className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold">{home.location}</span>
                        <h3 className="text-lg font-bold mt-1 mb-2 text-[#2C181A] group-hover:text-[#4A151B] transition">{home.name}</h3>
                        <p className="text-[#685248] text-sm flex items-center gap-1 mb-4">
                          <MapPin className="w-4 h-4 text-[#8C6D53]" /> {home.location}, Dubai
                        </p>

                        <div className="flex items-center gap-4 text-[#685248] text-xs mb-5 pb-5 border-b border-[#D8CEBE]">
                          <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> {home.beds} Beds</span>
                          <span className="flex items-center gap-1.5"><Bath className="w-4 h-4" /> {home.baths} Baths</span>
                          <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4" /> {home.size} sqft</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#4A151B] text-base">{formatAED(home.price)}</span>
                        <span className="text-[#8C6D53] text-xs"> / night</span>
                      </div>
                      
                      {/* Bouton de réservation directe */}
                      <button
                        onClick={() => {
                          setSelectedHome(home);
                          setBookingSuccess(false);
                        }}
                        className="bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#3B1115] transition shadow-md flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" /> <span>Book Stay</span>
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL DE RÉSERVATION INTERACTIVE */}
      {selectedHome && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedHome(null)}
              className="absolute top-6 right-6 p-2 text-[#685248] hover:text-[#4A151B]"
            >
              <ChevronDown className="w-5 h-5 rotate-45" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-14 h-14 text-[#4A151B] mx-auto mb-4" />
                <h3 className={`${fraunces.className} text-2xl text-[#2C181A] mb-2`}>Réservation enregistrée !</h3>
                <p className="text-xs text-[#685248] font-light mb-6 leading-relaxed">
                  Merci {clientName}. Votre séjour à {selectedHome.name} du {checkIn || 'prochainement'} au {checkOut || 'bientôt'} est confirmé dans notre agenda administrateur.
                </p>
                <button
                  onClick={() => setSelectedHome(null)}
                  className="bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#3B1115] transition"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleDirectBooking} className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-1 block">Instant Booking</span>
                <h3 className={`${fraunces.className} text-2xl mb-1 text-[#2C181A]`}>{selectedHome.name}</h3>
                <p className="text-[#685248] text-xs mb-6 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6D53]" /> {selectedHome.location}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-3 py-2.5 text-xs text-[#2C181A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-3 py-2.5 text-xs text-[#2C181A] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Nom complet</label>
                  <input
                    type="text"
                    placeholder="Ex: Alexander Vance"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-xs text-[#2C181A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="alexander@investor.co.uk"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-xs text-[#2C181A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Téléphone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-xs text-[#2C181A] outline-none"
                  />
                </div>

                {checkIn && checkOut && (
                  <div className="bg-[#F2EDE4] border border-[#D8CEBE] p-4 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-[#685248]">
                      <span>Durée :</span>
                      <span className="font-semibold text-[#2C181A]">{nights > 0 ? nights : 1} nuits</span>
                    </div>
                    <div className="flex justify-between text-[#685248] pt-2 border-t border-[#D8CEBE]">
                      <span className="font-bold text-[#2C181A]">Total séjour :</span>
                      <span className="font-bold text-[#4A151B]">
                        {formatAED(selectedHome.price * (nights > 0 ? nights : 1))}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#4A151B] text-[#F2EDE4] font-bold px-6 py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md text-xs mt-2"
                >
                  Confirmer et ajouter à l'agenda
                </button>
              </form>
            )}
          </div>
        </div>
      )}

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