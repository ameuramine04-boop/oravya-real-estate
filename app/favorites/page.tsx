'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import { Heart, MapPin, BedDouble, Bath, Maximize, ArrowRight, ArrowLeft, Trash2, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Exemple de biens favoris (qui pourront être connectés au LocalStorage ou à MySQL plus tard)
  const [favorites, setFavorites] = useState([
    {
      id: 'bc-201',
      name: 'Burj Crown Luxury Suite',
      location: 'Downtown Dubai',
      type: 'Apartment',
      price: 'AED 2,100,000',
      beds: 1,
      baths: 2,
      size: 780,
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'pbv-114',
      name: 'Palm Beach Signature Villa',
      location: 'Palm Jumeirah',
      type: 'Villa',
      price: 'AED 14,500,000',
      beds: 5,
      baths: 6,
      size: 6200,
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop'
    },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('oravya_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6D53] hover:text-[#4A151B] transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className={`${fraunces.className} text-3xl md:text-4xl text-[#2C181A] mt-2`}>Saved Properties (Favorites)</h1>
          <p className="text-[#685248] text-sm font-light">Review and manage the exclusive Dubai properties you have bookmarked.</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24 bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl max-w-xl mx-auto">
            <Heart className="w-12 h-12 text-[#8C6D53] mx-auto mb-4 stroke-1" />
            <p className={`${fraunces.className} text-xl text-[#2C181A] mb-1`}>Your favorites list is empty</p>
            <p className="text-xs text-[#685248] mb-6">Explore our luxury inventory and click the heart icon to save listings here.</p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#3B1115] transition shadow-md"
            >
              <span>Explore Properties</span> <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((property) => (
              <div key={property.id} className="bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl overflow-hidden hover:border-[#4A151B] transition shadow-sm flex flex-col justify-between group">
                <div>
                  <div className="h-56 relative bg-cover bg-center overflow-hidden flex items-center justify-center" style={{ backgroundImage: `url('${property.img}')` }}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300" />
                    <span className="absolute top-4 left-4 bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {property.type}
                    </span>
                    <button
                      onClick={() => removeFavorite(property.id)}
                      className="absolute top-4 right-4 w-9 h-9 bg-[#F2EDE4]/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 transition shadow-sm"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6">
                    <span className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold">{property.location}</span>
                    <h3 className={`${fraunces.className} text-xl font-bold mt-1 mb-2 text-[#2C181A] group-hover:text-[#4A151B] transition`}>
                      {property.name}
                    </h3>
                    <p className="text-[#685248] text-sm flex items-center gap-1 mb-4">
                      <MapPin className="w-4 h-4 text-[#8C6D53]" /> {property.location}, Dubai
                    </p>

                    <div className="flex items-center gap-4 text-[#685248] text-xs mb-4 pb-4 border-b border-[#D8CEBE]">
                      <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-[#8C6D53]" /> {property.beds} Beds</span>
                      <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#8C6D53]" /> {property.baths} Baths</span>
                      <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4 text-[#8C6D53]" /> {property.size} sqft</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex justify-between items-center">
                  <span className="font-bold text-[#4A151B] text-lg">{property.price}</span>
                  <Link
                    href={`/properties/${property.id}`}
                    className="text-xs bg-[#F2EDE4] hover:bg-[#4A151B] hover:text-[#F2EDE4] border border-[#D8CEBE] text-[#2C181A] px-4 py-2.5 rounded-xl transition font-semibold shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}