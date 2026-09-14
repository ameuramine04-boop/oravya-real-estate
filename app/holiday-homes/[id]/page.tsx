'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import { MapPin, CheckCircle2, Calendar, ArrowLeft, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { saveStoredBooking } from '@/lib/data';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

export default function HolidayDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [holiday, setHoliday] = useState<any | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  useEffect(() => {
    async function fetchHoliday() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) {
          setHoliday(null);
          return;
        }
        const found = await res.json();
        if (found.type !== 'Holiday Home') {
          setHoliday(null);
          return;
        }

        let imgs = ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'];
        try {
          if (found.images) {
            const parsed = typeof found.images === 'string' ? JSON.parse(found.images) : found.images;
            if (Array.isArray(parsed) && parsed.length > 0) imgs = parsed;
          }
        } catch (e) {}

        let ams: string[] = [];
        try {
          if (found.amenities) {
            ams = typeof found.amenities === 'string' ? JSON.parse(found.amenities) : found.amenities;
          }
        } catch (e) {}

        const formatted = { ...found, images: imgs, amenities: ams };
        setHoliday(formatted);
        setActiveImage(imgs[0]);
      } catch (err) {
        console.error('Erreur chargement holiday home:', err);
        setHoliday(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchHoliday();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] flex flex-col items-center justify-center p-6">
        <p className="text-sm text-[#8C6D53]">Chargement depuis MySQL...</p>
      </div>
    );
  }

  if (!holiday) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] flex flex-col items-center justify-center p-6">
        <p className="text-lg font-medium mb-4">Ce Holiday Home est introuvable.</p>
        <Link href="/holiday-homes" className="bg-[#4A151B] text-[#F2EDE4] px-6 py-3 rounded-xl text-sm font-bold">
          Retour aux Holiday Homes
        </Link>
      </div>
    );
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const totalPrice = holiday.price * nights;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !clientName || !clientEmail || !clientPhone) return;

    saveStoredBooking({
      id: 'book-' + Date.now(),
      clientName,
      clientEmail,
      clientPhone,
      itemName: holiday.name,
      checkIn,
      checkOut,
      totalPrice,
      status: 'Confirmed',
    });

    setBookedSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6D53] hover:text-[#4A151B] mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Retour aux Holiday Homes
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-2 block">Short-Term Luxury Stay</span>
            <h1 className={`${fraunces.className} text-3xl md:text-5xl text-[#2C181A]`}>{holiday.name}</h1>
            <p className="text-[#685248] text-sm flex items-center gap-1.5 mt-2">
              <MapPin className="w-4 h-4 text-[#8C6D53]" /> {holiday.location}, Dubai, UAE
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs uppercase text-[#8C6D53]">Rate per night</p>
            <p className={`${fraunces.className} text-3xl md:text-4xl text-[#4A151B] font-bold`}>
              AED {holiday.price.toLocaleString()} <span className="text-xs font-sans font-normal text-[#685248]">/ night</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 h-[420px] md:h-[500px] rounded-3xl overflow-hidden relative border border-[#D8CEBE] shadow-md bg-[#DFD6C9]">
            <Image src={activeImage} alt={holiday.name} fill className="object-cover" priority />
          </div>
          <div className="flex lg:flex-col gap-4 overflow-x-auto pb-2">
            {holiday.images?.map((img: string, idx: number) => (
              <div
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`h-[140px] rounded-2xl overflow-hidden relative border cursor-pointer shrink-0 w-44 lg:w-full transition ${
                  activeImage === img ? 'border-[#4A151B] ring-2 ring-[#4A151B]/20' : 'border-[#D8CEBE]'
                }`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-8 rounded-3xl shadow-sm">
              <h3 className={`${fraunces.className} text-2xl text-[#2C181A] mb-4`}>Détails du logement</h3>
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#D8CEBE] text-center">
                <div>
                  <p className="text-xs text-[#8C6D53] uppercase font-semibold">Chambres</p>
                  <p className={`${fraunces.className} text-2xl text-[#4A151B] mt-1`}>{holiday.beds}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8C6D53] uppercase font-semibold">Salles de bain</p>
                  <p className={`${fraunces.className} text-2xl text-[#4A151B] mt-1`}>{holiday.baths}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8C6D53] uppercase font-semibold">Surface</p>
                  <p className={`${fraunces.className} text-2xl text-[#4A151B] mt-1`}>{holiday.size} sqft</p>
                </div>
              </div>

              <h4 className={`${fraunces.className} text-xl text-[#2C181A] mt-8 mb-3`}>Description</h4>
              <p className="text-[#685248] font-light leading-relaxed">
                {holiday.description || 'Appartement de standing entièrement équipé pour vos vacances ou séjours professionnels à Dubaï.'}
              </p>

              {holiday.amenities && holiday.amenities.length > 0 && (
                <>
                  <h4 className={`${fraunces.className} text-xl text-[#2C181A] mt-8 mb-4`}>Équipements inclus</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {holiday.amenities.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#F2EDE4] border border-[#D8CEBE] px-4 py-2.5 rounded-xl text-xs font-medium text-[#2C181A]">
                        <CheckCircle2 className="w-4 h-4 text-[#4A151B]" /> {item}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-8 rounded-3xl shadow-xl sticky top-28">
            {bookedSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-14 h-14 text-[#4A151B] mx-auto mb-4" />
                <h3 className={`${fraunces.className} text-2xl text-[#2C181A] mb-2`}>Réservation enregistrée !</h3>
                <p className="text-xs text-[#685248] font-light mb-6 leading-relaxed">
                  Félicitations {clientName}. Votre séjour du {checkIn} au {checkOut} est bien validé.
                </p>
                <button
                  onClick={() => setBookedSuccess(false)}
                  className="bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#3B1115] transition"
                >
                  Effectuer une autre réservation
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <h3 className={`${fraunces.className} text-2xl text-[#2C181A] mb-1`}>Réserver vos dates</h3>
                <p className="text-xs text-[#685248] mb-6">Sélectionnez votre agenda d&apos;arrivée et de départ.</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Arrivée</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-3 py-2.5 text-xs text-[#2C181A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Départ</label>
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
                    placeholder="Ex: Sophie Martin"
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
                    placeholder="sophie@gmail.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-xs text-[#2C181A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+33 6 00 00 00 00"
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
                      <span className="font-semibold text-[#2C181A]">{nights} nuits</span>
                    </div>
                    <div className="flex justify-between text-[#685248] pt-2 border-t border-[#D8CEBE]">
                      <span className="font-bold text-[#2C181A]">Total séjour :</span>
                      <span className="font-bold text-[#4A151B]">AED {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#4A151B] text-[#F2EDE4] font-bold py-3.5 rounded-xl text-xs hover:bg-[#3B1115] transition shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span>Valider la réservation</span>
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-[#D8CEBE] flex items-center gap-3 text-xs text-[#685248]">
              <ShieldCheck className="w-5 h-5 text-[#4A151B] shrink-0" />
              <span>Garantie de séjour sécurisé par Oravya Holiday Homes Dubai.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
