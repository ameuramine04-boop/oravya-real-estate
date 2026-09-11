'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import { MapPin, BedDouble, Bath, Maximize, CheckCircle2, Calendar, ArrowLeft, ShieldCheck, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getStoredItems, saveStoredBooking, ItemProperty } from '@/lib/data';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<ItemProperty | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // États de réservation / prise de contact
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  useEffect(() => {
    // Recherche dans les propriétés et les holiday homes
    const allItems = [...getStoredItems('oravya_properties'), ...getStoredItems('oravya_holidays')];
    const found = allItems.find(p => p.id === id);
    if (found) {
      setItem(found);
      setActiveImage(found.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00');
    }
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] flex flex-col items-center justify-center p-6">
        <p className="text-lg font-medium mb-4">Propriété introuvable ou supprimée.</p>
        <Link href="/properties" className="bg-[#4A151B] text-[#F2EDE4] px-6 py-3 rounded-xl text-sm font-bold">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const isHoliday = item.type === 'Holiday Home';

  // Calcul du nombre de nuits et du prix total pour les Holiday Homes
  const calculateTotalDays = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const totalNights = calculateTotalDays();
  const totalPrice = isHoliday ? item.price * totalNights : item.price;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;
    if (isHoliday && (!checkIn || !checkOut)) return;

    saveStoredBooking({
      id: 'book-' + Date.now(),
      itemId: item.id,
      itemName: item.name,
      itemType: isHoliday ? 'Holiday Home' : 'Property',
      clientName,
      clientEmail,
      clientPhone,
      checkIn: checkIn || 'N/A',
      checkOut: checkOut || 'N/A',
      totalPrice,
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    });

    setBookedSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* BOUTON RETOUR */}
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6D53] hover:text-[#4A151B] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Retour aux annonces
        </button>

        {/* EN-TÊTE DU BIEN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-2 block">{item.type} • {item.status}</span>
            <h1 className={`${fraunces.className} text-3xl md:text-5xl text-[#2C181A]`}>{item.name}</h1>
            <p className="text-[#685248] text-sm flex items-center gap-1.5 mt-2">
              <MapPin className="w-4 h-4 text-[#8C6D53]" /> {item.location}, Dubai, UAE
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs uppercase text-[#8C6D53]">{isHoliday ? 'Rate per night' : 'Asking Price'}</p>
            <p className={`${fraunces.className} text-3xl md:text-4xl text-[#4A151B] font-bold`}>
              AED {item.price.toLocaleString()} {isHoliday && <span className="text-xs font-sans font-normal text-[#685248]">/ night</span>}
            </p>
          </div>
        </div>

        {/* GALERIE DE PHOTOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 h-[420px] md:h-[500px] rounded-3xl overflow-hidden relative border border-[#D8CEBE] shadow-md bg-[#DFD6C9]">
            <Image src={activeImage} alt={item.name} fill className="object-cover" priority />
          </div>
          <div className="flex lg:flex-col gap-4 overflow-x-auto pb-2">
            {item.images?.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`h-[140px] rounded-2xl overflow-hidden relative border cursor-pointer shrink-0 w-44 lg:w-full transition ${
                  activeImage === img ? 'border-[#4A151B] ring-2 ring-[#4A151B]/20' : 'border-[#D8CEBE]'
                }`}
              >
                <Image src={img} alt={`${item.name} ${idx}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* CONTENU PRINCIPAL & FORMULAIRE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* DESCRIPTION & CARACTÉRISTIQUES */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-8 rounded-3xl shadow-sm">
              <h3 className={`${fraunces.className} text-2xl text-[#2C181A] mb-4`}>Caractéristiques principales</h3>
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#D8CEBE] text-center">
                <div>
                  <p className="text-xs text-[#8C6D53] uppercase font-semibold">Chambres</p>
                  <p className={`${fraunces.className} text-2xl text-[#4A151B] mt-1`}>{item.beds}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8C6D53] uppercase font-semibold">Salles de bain</p>
                  <p className={`${fraunces.className} text-2xl text-[#4A151B] mt-1`}>{item.baths}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8C6D53] uppercase font-semibold">Surface</p>
                  <p className={`${fraunces.className} text-2xl text-[#4A151B] mt-1`}>{item.size} sqft</p>
                </div>
              </div>

              <h4 className={`${fraunces.className} text-xl text-[#2C181A] mt-8 mb-3`}>À propos de ce bien</h4>
              <p className="text-[#685248] font-light leading-relaxed">
                {item.description || 'Propriété haut de gamme sélectionnée par les experts d’Oravya pour son emplacement stratégique et sa rentabilité exceptionnelle à Dubaï.'}
              </p>

              {item.amenities && item.amenities.length > 0 && (
                <>
                  <h4 className={`${fraunces.className} text-xl text-[#2C181A] mt-8 mb-4`}>Équipements & Services</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {item.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#F2EDE4] border border-[#D8CEBE] px-4 py-2.5 rounded-xl text-xs font-medium text-[#2C181A]">
                        <CheckCircle2 className="w-4 h-4 text-[#4A151B]" /> {amenity}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MODULE DE RÉSERVATION OU VISITE INTERACTIF */}
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-8 rounded-3xl shadow-xl sticky top-28">
            {bookedSuccess ? (
              <div className="py-8 text-center animate-in fade-in">
                <CheckCircle2 className="w-14 h-14 text-[#4A151B] mx-auto mb-4" />
                <h3 className={`${fraunces.className} text-2xl text-[#2C181A] mb-2`}>
                  {isHoliday ? 'Réservation confirmée !' : 'Demande de visite enregistrée !'}
                </h3>
                <p className="text-xs text-[#685248] font-light mb-6 leading-relaxed">
                  Merci {clientName}. Un conseiller expert d'Oravya vous contactera par email et téléphone pour finaliser les détails.
                </p>
                <button
                  onClick={() => setBookedSuccess(false)}
                  className="bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#3B1115] transition"
                >
                  Effectuer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <h3 className={`${fraunces.className} text-2xl text-[#2C181A] mb-1`}>
                  {isHoliday ? 'Réserver ce séjour' : 'Planifier une visite'}
                </h3>
                <p className="text-xs text-[#685248] mb-6">
                  {isHoliday ? 'Sélectionnez vos dates sur l\'agenda interactif.' : 'Remplissez vos coordonnées pour être contacté en priorité.'}
                </p>

                {isHoliday && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Arrivée (Check-in)</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                        className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-3 py-2.5 text-xs text-[#2C181A] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Départ (Check-out)</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        required
                        className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-3 py-2.5 text-xs text-[#2C181A] outline-none"
                      />
                    </div>
                  </div>
                )}

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
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Email professionnel</label>
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
                    placeholder="+44 20 7946 0921"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-xs text-[#2C181A] outline-none"
                  />
                </div>

                {isHoliday && checkIn && checkOut && (
                  <div className="bg-[#F2EDE4] border border-[#D8CEBE] p-4 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-[#685248]">
                      <span>Durée du séjour :</span>
                      <span className="font-semibold text-[#2C181A]">{totalNights} nuits</span>
                    </div>
                    <div className="flex justify-between text-[#685248] pt-2 border-t border-[#D8CEBE]">
                      <span className="font-bold text-[#2C181A]">Total estimé :</span>
                      <span className="font-bold text-[#4A151B]">AED {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#4A151B] text-[#F2EDE4] font-bold py-3.5 rounded-xl text-xs hover:bg-[#3B1115] transition shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span>{isHoliday ? 'Confirmer la réservation' : 'Demander une visite privée'}</span>
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-[#D8CEBE] flex items-center gap-3 text-xs text-[#685248]">
              <ShieldCheck className="w-5 h-5 text-[#4A151B] shrink-0" />
              <span>Transactions sécurisées et accompagnement juridique certifié par Oravya Dubai.</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}