'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FloatingBrochureBtn from '@/components/FloatingBrochureBtn';
import { Fraunces } from 'next/font/google';
import {
  Search,
  Building2,
  MessageSquarePlus, 
  X,
  Home,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  RefreshCcw,
  Crown,
  KeyRound,
  LineChart,
  Sparkles,
  Tag,
  Star,
  Send,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Navbar from '@/components/Navbar';
import SectionBackdrop from '@/components/SectionBackdrop';
import {
  ServiceItem,
  ReviewItem,
  HomeCtaItem,
  PropertyCategoryItem,
} from '@/lib/data';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  RefreshCcw,
  Crown,
  KeyRound,
  LineChart,
  Sparkles,
  Home,
  Tag,
  ArrowRight,
  Star,
};

// Photos de Dubaï garanties 100% stables et fonctionnelles (Pexels HD)
const HERO_SLIDES = [
  {
    image: 'https://images.pexels.com/photos/442579/pexels-photo-442579.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Redefining Luxury in Dubai',
    subtitle: 'Discover exceptional residences in the heart of Dubai.',
    tag: 'Exclusive Collection'
  },
  {
    image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Waterfront Villas & Penthouses',
    subtitle: 'A sumptuous lifestyle featuring breathtaking panoramic views of Dubai.',
    tag: 'Waterfront Living'
  },
  {
    image: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'High-Yield Investments',
    subtitle: 'Gain early access to the most sought-after off-plan projects before public launch.',
    tag: 'Smart Investment'
  }
];

function formatPrice(price: number) {
  return `AED ${price.toLocaleString('en-US')}`;
}

function parseList(raw: any): string[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [ctas, setCtas] = useState<HomeCtaItem[]>([]);
  const [categories, setCategories] = useState<PropertyCategoryItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [searchLocation, setSearchLocation] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    authorName: '',
    location: '',
    investment: '',
    quote: '',
    rating: 5,
  });
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Auto-play of the hero slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

 useEffect(() => {
    async function loadHomeData() {
      try {
        const [servicesRes, propsRes, ctasRes, catsRes, reviewsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/properties'),
          fetch('/api/ctas'),
          fetch('/api/categories'),
          fetch('/api/reviews'),
        ]);

        // Helper pour parser le JSON en toute sécurité si la réponse est bien du JSON
        const safeJson = async (res: Response) => {
          const contentType = res.headers.get('content-type');
          if (res.ok && contentType && contentType.includes('application/json')) {
            return await res.json();
          }
          return null;
        };

        const [servicesData, ctasData, catsData, reviewsData, propsData] = await Promise.all([
          safeJson(servicesRes),
          safeJson(ctasRes),
          safeJson(catsRes),
          safeJson(reviewsRes),
          safeJson(propsRes),
        ]);

        if (Array.isArray(servicesData)) {
          setServices(servicesData.filter((s: ServiceItem) => s.active !== false));
        }

        if (Array.isArray(ctasData)) {
          setCtas(ctasData);
        }

        if (Array.isArray(catsData)) {
          setCategories(catsData.filter((c: PropertyCategoryItem) => c.name !== 'Holiday Home'));
        }

        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData);
        }

        if (Array.isArray(propsData)) {
          const saleProps = propsData
            .filter((p: any) => p.type !== 'Holiday Home')
            .map((p: any) => {
              const images = parseList(p.images);
              return {
                ...p,
                images:
                  images.length > 0
                    ? images
                    : ['https://images.pexels.com/photos/162031/dubai-luxury-architecture-skyscraper-162031.jpeg?auto=compress&cs=tinysrgb&w=1200'],
              };
            });
          const featuredOnes = saleProps.filter((p: any) => p.featured);
          setFeatured((featuredOnes.length > 0 ? featuredOnes : saleProps).slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      }
    }
    loadHomeData();
  }, []);

  const searchHref = (() => {
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set('location', searchLocation.trim());
    if (searchCategory !== 'All Categories') params.set('type', searchCategory);
    const qs = params.toString();
    return qs ? `/properties?${qs}` : '/properties';
  })();

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewForm.authorName.trim() || !reviewForm.location.trim() || !reviewForm.quote.trim()) {
      setReviewError('Please fill in your name, location and review.');
      return;
    }
    setReviewError('');
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) throw new Error('Failed');
      setReviewSent(true);
      setReviewForm({ authorName: '', location: '', investment: '', quote: '', rating: 5 });
    } catch {
      setReviewError('Unable to send your review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5E1C7]/10 text-[#4A1F23] font-sans selection:bg-[#8E3A47] selection:text-[#F5E1C7] overflow-x-hidden">
      <Navbar />

      {/* ================= HERO SECTION (FULL SCREEN IMMERSIVE SLIDER) ================= */}
     <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-[#4A1F23]">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-25 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A1F23]/90 via-[#6B2B2E]/40 to-black/30" />

              <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-32 sm:pt-36">
                <span className="px-4 py-1.5 rounded-full bg-[#E7B6A5]/20 backdrop-blur-md text-[#F5E1C7] text-xs sm:text-sm font-medium tracking-widest uppercase mb-6 border border-[#E7B6A5]/30 shadow-lg">
                  {slide.tag}
                </span>
                <h1 className={`${fraunces.className} text-4xl sm:text-6xl lg:text-7xl font-bold text-[#F5E1C7] tracking-tight leading-tight drop-shadow-xl mb-4`}>
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl text-[#F5E1C7]/90 max-w-2xl font-light drop-shadow-md mb-10">
                  {slide.subtitle}
                </p>

                {/* Quick Search Bar */}
                <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-3 border border-[#E7B6A5]/40">
                  <div className="flex items-center gap-2 w-full px-3 py-2.5 bg-[#F5E1C7]/20 rounded-xl border border-[#E7B6A5]/30">
                    <Building2 className="w-5 h-5 text-[#8E3A47] shrink-0" />
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="bg-transparent w-full text-[#4A1F23] outline-none cursor-pointer text-sm font-medium"
                    >
                      <option value="All Categories">All Categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full px-3 py-2.5 bg-[#F5E1C7]/20 rounded-xl border border-[#E7B6A5]/30">
                    <MapPin className="w-5 h-5 text-[#8E3A47] shrink-0" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Search by community or building"
                      className="bg-transparent w-full text-[#4A1F23] outline-none placeholder:text-[#8E3A47]/60 text-sm font-medium"
                    />
                  </div>

                  <Link
                    href={searchHref}
                    className="w-full md:w-auto bg-[#8E3A47] hover:bg-[#6B2B2E] text-[#F5E1C7] font-bold px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shrink-0 shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/30 hover:bg-[#8E3A47] text-white backdrop-blur-md transition-all border border-white/20 cursor-pointer shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/30 hover:bg-[#8E3A47] text-white backdrop-blur-md transition-all border border-white/20 cursor-pointer shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-10 bg-[#F5E1C7]' : 'w-2.5 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="px-6 py-12 max-w-7xl mx-auto border-y border-[#E7B6A5]/40 my-12 bg-white/40 backdrop-blur-sm rounded-2xl shadow-sm">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '100%', label: 'Freehold Ownership' },
              { value: '0%', label: 'Property & Income Tax' },
              { value: 'VIP', label: 'Off-Market Access' },
              { value: '24/7', label: 'Dedicated Support' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div className="flex flex-col items-center">
                  <p className={`${fraunces.className} text-3xl font-medium text-[#4A1F23]`}>{stat.value}</p>
                  <p className="text-[#8E3A47] text-xs uppercase tracking-widest font-semibold mt-1">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* DEVELOPER PARTNERSHIPS */}
      <section className="px-6 py-16 max-w-7xl mx-auto text-center">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-semibold mb-3 block">Developers</span>
          <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium mb-4 text-[#4A1F23]`}>
            Trusted partner of Dubai&apos;s biggest developers
          </h2>
          <p className="text-[#6B2B2E]/80 max-w-2xl mx-auto text-sm md:text-base font-light mb-12">
            We sell direct from master developers, ensuring launch prices and payment plans reach you first.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
          {['Emaar', 'Binghatti', 'Dubai Properties', 'Damac', 'Meraas'].map((dev, i) => (
            <Reveal key={dev} delay={i * 100}>
              <div className="flex items-center justify-center p-6 bg-white border border-[#E7B6A5]/50 rounded-2xl font-bold text-[#4A1F23] text-base shadow-sm hover:border-[#8E3A47] transition duration-300 group">
                <span className="group-hover:scale-105 transition duration-300">{dev}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

{/* ================= LATEST OFF-PLAN & NEW LAUNCHES (GRID OR CAROUSEL IF > 4) ================= */}
      <section className="relative w-full py-24 my-12 overflow-hidden border-y border-[#E7B6A5]/30 text-[#F5E1C7]">
        {/* Image de fond professionnelle et moderne (Dubaï skyline) */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1920&auto=format&fit=crop')` }}
        />

        {/* Voile bordeaux semi-transparent pour harmoniser avec le thème de la marque */}
        <div className="absolute inset-0 bg-[#4A1F23]/88 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-3 block">Off Plan</span>
                <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight text-[#F5E1C7]`}>
                  The latest launches in Dubai
                </h2>
                <p className="text-[#F5E1C7]/80 font-light mt-2">
                  Newly released projects from the developers building the city, with the payment plan and handover quarter stated up front.
                </p>
              </div>
              <Link href="/properties?type=Off-Plan" className="inline-flex items-center gap-2 text-sm font-semibold text-[#E7B6A5] hover:underline shrink-0">
                View all projects <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          {featured.length === 0 ? (
            <div className="bg-[#6B2B2E]/70 border border-[#E7B6A5]/50 rounded-2xl p-10 text-center backdrop-blur-md">
              <p className="text-[#F5E1C7]/80 text-sm">No off-plan projects currently listed.</p>
            </div>
          ) : featured.length > 4 ? (
            /* Si plus de 4 éléments : Défilement horizontal automatique (Marquee) */
            <div className="relative w-full overflow-hidden py-4">
              <div className="flex gap-6 animate-marquee whitespace-nowrap">
                {[...featured, ...featured].map((property, i) => (
                  <div
                    key={`${property.id}-${i}`}
                    className="w-[350px] sm:w-[380px] shrink-0 bg-white border border-[#E7B6A5]/50 rounded-2xl overflow-hidden hover:border-[#8E3A47] transition duration-300 group shadow-sm flex flex-col justify-between whitespace-normal"
                  >
                    <div>
                      <div className="h-64 relative bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${property.images[0]}')` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:scale-105 transition duration-500" />
                        <span className="absolute top-4 left-4 bg-[#8E3A47] text-[#F5E1C7] text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                          {property.status || 'New Launch'}
                        </span>
                        {property.handover && (
                          <span className="absolute bottom-4 left-4 text-white text-xs font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg">
                            Handover: {property.handover}
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <span className="text-xs text-[#8E3A47] uppercase tracking-wider font-semibold">{property.type}</span>
                        <h3 className="text-lg font-bold mt-1 mb-2 text-[#4A1F23] group-hover:text-[#8E3A47] transition">{property.name}</h3>
                        <p className="text-[#6B2B2E]/80 text-sm flex items-center gap-1 mb-4">
                          <MapPin className="w-4 h-4 text-[#8E3A47]" /> {property.location}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="flex justify-between items-center pt-4 border-t border-[#E7B6A5]/40">
                        <div>
                          <span className="text-[10px] uppercase text-[#8E3A47] block font-semibold">Starting from</span>
                          <span className="font-bold text-[#4A1F23]">{formatPrice(property.price)}</span>
                        </div>
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-xs bg-[#F5E1C7]/30 hover:bg-[#8E3A47] hover:text-[#F5E1C7] border border-[#E7B6A5] text-[#4A1F23] px-4 py-2.5 rounded-xl transition font-medium"
                        >
                          Explore
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Si 4 éléments ou moins : Grille fixe classique */
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featured.map((property, i) => (
                <Reveal key={property.id} delay={i * 90}>
                  <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl overflow-hidden hover:border-[#8E3A47] transition duration-300 group shadow-sm h-full flex flex-col justify-between hover:shadow-lg">
                    <div>
                      <div className="h-64 relative bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${property.images[0]}')` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:scale-105 transition duration-500" />
                        <span className="absolute top-4 left-4 bg-[#8E3A47] text-[#F5E1C7] text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                          {property.status || 'New Launch'}
                        </span>
                        {property.handover && (
                          <span className="absolute bottom-4 left-4 text-white text-xs font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg">
                            Handover: {property.handover}
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <span className="text-xs text-[#8E3A47] uppercase tracking-wider font-semibold">{property.type}</span>
                        <h3 className="text-lg font-bold mt-1 mb-2 text-[#4A1F23] group-hover:text-[#8E3A47] transition">{property.name}</h3>
                        <p className="text-[#6B2B2E]/80 text-sm flex items-center gap-1 mb-4">
                          <MapPin className="w-4 h-4 text-[#8E3A47]" /> {property.location}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="flex justify-between items-center pt-4 border-t border-[#E7B6A5]/40">
                        <div>
                          <span className="text-[10px] uppercase text-[#8E3A47] block font-semibold">Starting from</span>
                          <span className="font-bold text-[#4A1F23]">{formatPrice(property.price)}</span>
                        </div>
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-xs bg-[#F5E1C7]/30 hover:bg-[#8E3A47] hover:text-[#F5E1C7] border border-[#E7B6A5] text-[#4A1F23] px-4 py-2.5 rounded-xl transition font-medium"
                        >
                          Explore
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= MOST TRENDING PROJECTS (VILLAS, LUXURY, FLATS) ================= */}
      <section className="px-6 py-16 max-w-7xl mx-auto border-t border-[#E7B6A5]/40 bg-white/30 rounded-3xl my-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-semibold mb-3 block">Trending</span>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight text-[#4A1F23]`}>
                Most trending projects in Dubai
              </h2>
              <p className="text-[#6B2B2E]/80 font-light mt-2">
                Explore high-demand property types curated for lifestyle and capital appreciation.
              </p>
            </div>
            <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E3A47] hover:underline shrink-0">
              View all projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: 'Villas', subtitle: 'Spacious family homes & private gardens', icon: Home, image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'Villa' },
            { title: 'Luxury', subtitle: 'Ultra-exclusive penthouses & waterfront estates', icon: Crown, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'Luxury' },
            { title: 'Flats', subtitle: 'Modern apartments in prime downtown locations', icon: Building2, image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'Apartment' }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 100}>
                <Link
                  href={`/properties?type=${encodeURIComponent(item.type)}`}
                  className="group relative h-80 rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-6 border border-[#E7B6A5]/50 block transition duration-500 hover:shadow-xl"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-700 ease-out"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4A1F23]/90 via-[#4A1F23]/30 to-transparent group-hover:from-[#4A1F23] transition duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-[#F5E1C7]/20 backdrop-blur-md flex items-center justify-center text-[#F5E1C7] mb-3 border border-[#E7B6A5]/30">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className={`${fraunces.className} text-2xl font-bold text-[#F5E1C7] mb-1`}>{item.title}</h3>
                    <p className="text-xs text-[#F5E1C7]/80 font-light mb-4">{item.subtitle}</p>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#E7B6A5] uppercase tracking-wider group-hover:translate-x-1 transition duration-300">
                      Explore properties <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* QUICK ACTIONS / CTAS */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ctas.map((cta, i) => {
              const Icon = ICON_MAP[cta.icon] || ArrowRight;
              return (
                <Reveal key={cta.id} delay={i * 60}>
                  <Link
                    href={cta.href}
                    className="group relative overflow-hidden rounded-2xl border border-[#E7B6A5]/50 bg-white/70 backdrop-blur-md p-5 shadow-sm hover:border-[#8E3A47] hover:shadow-md transition duration-300 h-full flex flex-col"
                  >
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#E7B6A5]/30 group-hover:bg-[#E7B6A5]/50 transition" />
                    <div className="w-11 h-11 rounded-xl bg-[#F5E1C7] border border-[#E7B6A5] flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <Icon className="w-5 h-5 text-[#8E3A47]" />
                    </div>
                    <h3 className="font-bold text-[#4A1F23] text-sm mb-1 leading-snug">{cta.label}</h3>
                    <p className="text-[11px] text-[#6B2B2E]/80 font-light leading-relaxed mb-3 flex-1">
                      {cta.description || 'Explore with Oravya'}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8E3A47]">
                      Continue <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </section>

 {/* ================= PROPERTY TYPES (WITH UNIQUE MATCHING IMAGES & ENGLISH DESCRIPTIONS) ================= */}
      <section className="w-full py-24 bg-[#4A1F23] text-[#F5E1C7] border-y border-[#E7B6A5]/30 my-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-3 block">Property Types</span>
                <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight text-[#F5E1C7]`}>
                  Explore by category
                </h2>
              </div>
              <Link href="/properties" className="hidden sm:flex items-center gap-2 text-sm text-[#E7B6A5] hover:underline font-medium transition">
                View all properties <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((item, i) => {
              const Icon = ICON_MAP[item.icon] || Building2;
              
              // Dictionnaire associant chaque catégorie à son image spécifique et sa description en anglais
              const categoryDetails: Record<string, { image: string; desc: string }> = {
                'Villa': {
                  image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
                  desc: 'Spacious family homes featuring private gardens and premium amenities.'
                },
                'Apartment': {
                  image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
                  desc: 'Modern urban apartments situated in prime downtown locations.'
                },
                'Penthouse': {
                  image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
                  desc: 'Ultra-exclusive top-floor residences offering panoramic skyline views.'
                },
                'Townhouse': {
                  image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
                  desc: 'Contemporary multi-level family residences in vibrant communities.'
                },
                'Duplex': {
                  image: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800',
                  desc: 'Stylish two-story residences combining space and architectural elegance.'
                },
                'Luxury': {
                  image: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=800',
                  desc: 'Handcrafted prestige estates tailored for high-net-worth lifestyles.'
                },
                'Triplex': {
                  image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
                  desc: 'Expansive luxury residence spread gracefully across three distinct levels.'
                },
                'Mansion': {
                  image: 'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg?auto=compress&cs=tinysrgb&w=800',
                  desc: 'Massive and ultra-luxurious property styled as a modern grand estate.'
                },
                'Serviced Apartment': {
                  image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
                  desc: 'Hotel-managed residences by elite brands featuring integrated concierge services.'
                }
              };

              const details = categoryDetails[item.name] || {
                image: (item as any).image || 'https://images.pexels.com/photos/162031/dubai-luxury-architecture-skyscraper-162031.jpeg?auto=compress&cs=tinysrgb&w=800',
                desc: (item as any).description || 'Explore exceptional properties tailored to your refined lifestyle.'
              };
              
              return (
                <Reveal key={item.id} delay={i * 50}>
                  <Link
                    href={`/properties?type=${encodeURIComponent(item.name)}`}
                    className="group relative h-72 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-end p-6 border border-[#E7B6A5]/30 block transition duration-500 hover:border-[#E7B6A5] hover:shadow-xl"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-700 ease-out"
                      style={{ backgroundImage: `url('${details.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A1F23]/95 via-[#4A1F23]/50 to-transparent group-hover:from-[#4A1F23] transition duration-500" />
                    
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-[#F5E1C7]/20 backdrop-blur-md flex items-center justify-center text-[#F5E1C7] mb-3 border border-[#E7B6A5]/30">
                        <Icon className="w-5 h-5 text-[#E7B6A5]" />
                      </div>
                      <h4 className="text-lg font-bold mb-1 text-[#F5E1C7]">{item.name}</h4>
                      <p className="text-[#F5E1C7]/80 text-xs mb-3 font-light leading-relaxed line-clamp-2">{details.desc}</p>
                      <span className="text-xs text-[#E7B6A5] uppercase tracking-wider font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition duration-300">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUR SERVICES */}
      <section id="services" className="px-6 py-20 max-w-7xl mx-auto border-t border-[#E7B6A5]/40 scroll-mt-24">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-semibold mb-3 block">Our Services</span>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 text-[#4A1F23]`}>
                Every stage of a Dubai property journey
              </h2>
              <p className="text-[#6B2B2E]/80 font-light">
                Off-plan, resale, luxury, rentals and investment consultancy — managed end to end by Oravya.
              </p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E3A47] hover:underline shrink-0">
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Building2;
            return (
              <Reveal key={service.id} delay={i * 70}>
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="h-full bg-white/80 border border-[#E7B6A5]/50 p-6 rounded-2xl hover:border-[#8E3A47] transition flex flex-col shadow-sm group"
                >
                  <Icon className="w-7 h-7 text-[#8E3A47] mb-5 group-hover:scale-110 transition" />
                  <h3 className="font-bold text-[#4A1F23] mb-2 leading-snug">{service.title}</h3>
                  <p className="text-[#6B2B2E]/80 text-xs font-light leading-relaxed mt-auto">{service.tagline}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* REMOTE CTA */}
      <section className="px-6 py-20 border-y border-[#E7B6A5]/40 bg-[#4A1F23] text-[#F5E1C7]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-3 block">Remote Advisory</span>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-6 text-[#F5E1C7]`}>
                Plan your real estate project remotely
              </h2>
              <p className="text-[#F5E1C7]/90 mb-8 font-light leading-relaxed">
                Whether you want to invest in a new off-plan project in Dubai, purchase a holiday home, or book a seasonal
                rental, our experts guide you step by step.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="bg-[#F5E1C7] text-[#4A1F23] font-bold px-6 py-3.5 rounded-xl hover:bg-white transition text-center shadow-lg">
                  Book an online meeting
                </Link>
                <Link href="/holiday-homes" className="border-2 border-[#E7B6A5] text-[#F5E1C7] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#F5E1C7]/10 transition text-center">
                  Book a holiday home
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#6B2B2E] backdrop-blur-md border border-[#E7B6A5]/40 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
                <Calendar className="w-8 h-8 text-[#E7B6A5] mb-4" />
                <div>
                  <h4 className="font-bold mb-1 text-[#F5E1C7] text-base">Video consultation</h4>
                  <p className="text-xs text-[#F5E1C7]/80 font-light leading-relaxed">Speak directly with a Dubai market expert advisor.</p>
                </div>
              </div>
              <div className="bg-[#6B2B2E] backdrop-blur-md border border-[#E7B6A5]/40 p-6 rounded-2xl flex flex-col justify-between shadow-xl sm:mt-6">
                <ShieldCheck className="w-8 h-8 text-[#E7B6A5] mb-4" />
                <div>
                  <h4 className="font-bold mb-1 text-[#F5E1C7] text-base">Secure transactions</h4>
                  <p className="text-xs text-[#F5E1C7]/80 font-light leading-relaxed">Secure transactions and transparent deposit management.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY ORAVYA */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 text-[#4A1F23]`}>
              Why global investors choose Oravya
            </h2>
            <p className="text-[#6B2B2E]/80 font-light">End-to-end advisory tailored to international high-net-worth individuals.</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E7B6A5]/40 border-t border-b border-[#E7B6A5]/40">
          {[
            { title: 'Off-market access', desc: 'Private listings and prime off-plan units before public release.' },
            { title: 'Legal & financial guidance', desc: 'Registration, golden visa applications, and tax structuring.' },
            { title: 'Property management', desc: 'Post-purchase management, leasing, and holiday home operations.' },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="p-8 md:px-8 md:py-10">
                <CheckCircle2 className="w-6 h-6 text-[#8E3A47] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-[#4A1F23]">{item.title}</h3>
                <p className="text-[#6B2B2E]/80 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

{/* TESTIMONIALS + SUBMIT REVIEW MODAL (WITH LIGHT BACKGROUND IMAGE) */}
      <section 
        id="testimonials" 
        className="relative py-20 border-t border-[#E7B6A5]/40 scroll-mt-24 overflow-hidden w-full text-[#4A1F23]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Voile clair semi-transparent (teinte crème #F5E1C7) pour un rendu lumineux et professionnel */}
        <div className="absolute inset-0 bg-[#F5E1C7]/90 backdrop-blur-[2px]" />

        <div className="relative z-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16 px-6">
              <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-semibold mb-3 block">Client Testimonials</span>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight text-[#4A1F23]`}>
                Trusted by global investors &amp; homeowners
              </h2>
              <p className="text-[#6B2B2E]/80 text-sm font-light mt-3">Share your experience with us, Your opinion matters</p>
              
              {/* Bouton ouvrant le modal d'ajout d'avis */}
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 bg-[#8E3A47] hover:bg-[#6B2B2E] text-[#F5E1C7] px-6 py-3.5 rounded-xl transition shadow-lg text-xs uppercase tracking-wider font-bold cursor-pointer border border-[#E7B6A5]/40"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>
          </Reveal>

          {/* Défilement horizontal automatique et infini sur toute la largeur (Full Width) */}
          <div className="relative w-full overflow-hidden py-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-[#8E3A47] text-center px-6">No approved reviews yet.</p>
            ) : (
              <div className="flex gap-6 animate-marquee whitespace-nowrap px-3">
                {[...reviews, ...reviews, ...reviews].map((review, i) => (
                  <div
                    key={`${review.id}-${i}`}
                    className="w-[350px] sm:w-[420px] shrink-0 bg-white/95 border border-[#E7B6A5]/60 p-8 rounded-2xl shadow-md flex flex-col justify-between whitespace-normal backdrop-blur-sm"
                  >
                    <div>
                      <div className="flex gap-1 mb-4 text-[#8E3A47]">
                        {[...Array(review.rating || 5)].map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-[#8E3A47]" />
                        ))}
                      </div>
                      <p className="text-[#6B2B2E]/90 text-sm font-light leading-relaxed italic mb-6">&ldquo;{review.quote}&rdquo;</p>
                    </div>
                    <div className="pt-4 border-t border-[#E7B6A5]/40">
                      <p className="font-bold text-[#4A1F23] text-sm">{review.authorName}</p>
                      <p className="text-xs text-[#8E3A47]">
                        {review.location}
                        {review.investment ? (
                          <>
                            {' '}
                            • <span className="font-medium text-[#4A1F23]">{review.investment}</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal / Popup pour soumettre un avis */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-white border border-[#E7B6A5] rounded-3xl p-8 shadow-2xl text-[#4A1F23]">
              
              <button
                onClick={() => { setIsReviewModalOpen(false); setReviewSent(false); }}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#F5E1C7]/40 transition text-[#4A1F23] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className={`${fraunces.className} text-2xl text-[#4A1F23] mb-2`}>Share your experience</h3>
              <p className="text-sm text-[#6B2B2E]/80 font-light mb-6">
                Your review is submitted for admin approval before it appears on the website.
              </p>

              {reviewSent ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-[#8E3A47] mx-auto mb-4" />
                  <p className="font-semibold text-[#4A1F23] mb-2">Thank you — review received</p>
                  <p className="text-sm text-[#6B2B2E]/80 mb-6">It will appear once approved by Oravya.</p>
                  <button 
                    onClick={() => { setIsReviewModalOpen(false); setReviewSent(false); }} 
                    className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-3 rounded-xl hover:bg-[#6B2B2E] transition text-xs uppercase tracking-wider"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={submitReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={reviewForm.authorName}
                      onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                      className="w-full bg-[#F5E1C7]/20 border border-[#E7B6A5]/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8E3A47] text-[#4A1F23]"
                    />
                    <input
                      type="text"
                      placeholder="City, Country"
                      value={reviewForm.location}
                      onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                      className="w-full bg-[#F5E1C7]/20 border border-[#E7B6A5]/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8E3A47] text-[#4A1F23]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Investment type (optional)"
                    value={reviewForm.investment}
                    onChange={(e) => setReviewForm({ ...reviewForm, investment: e.target.value })}
                    className="w-full bg-[#F5E1C7]/20 border border-[#E7B6A5]/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8E3A47] text-[#4A1F23]"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-[#8E3A47] font-medium">Rating</span>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${n <= reviewForm.rating ? 'fill-[#8E3A47] text-[#8E3A47]' : 'text-[#E7B6A5]'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Your review..."
                    value={reviewForm.quote}
                    onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                    className="w-full bg-[#F5E1C7]/20 border border-[#E7B6A5]/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8E3A47] resize-none text-[#4A1F23]"
                  />
                  {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#8E3A47] text-[#F5E1C7] font-bold px-6 py-3.5 rounded-xl hover:bg-[#6B2B2E] transition shadow-md disabled:opacity-60 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> {reviewSubmitting ? 'Sending...' : 'Submit for approval'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Style CSS pour l'animation fluide et l'effet de boucle continue full-width */}
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-33.333%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 40s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8E3A47] border-t border-[#E7B6A5]/40">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/properties" className="hover:text-[#4A1F23] transition">Properties</Link>
          <Link href="/services" className="hover:text-[#4A1F23] transition">Services</Link>
          <Link href="/holiday-homes" className="hover:text-[#4A1F23] transition">Holiday Homes</Link>
          <Link href="/contact" className="hover:text-[#4A1F23] transition">Contact</Link>
        </div>
      </footer>

      {/* Bouton Flottant de Téléchargement de Brochure */}
      <FloatingBrochureBtn />
    </div>
  );
}