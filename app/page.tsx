'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import {
  Search,
  Building2,
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
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [ctas, setCtas] = useState<HomeCtaItem[]>([]);
  const [categories, setCategories] = useState<PropertyCategoryItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [searchLocation, setSearchLocation] = useState('');

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

        const servicesData = await servicesRes.json();
        if (Array.isArray(servicesData)) {
          setServices(servicesData.filter((s: ServiceItem) => s.active !== false));
        }

        const ctasData = await ctasRes.json();
        if (Array.isArray(ctasData)) setCtas(ctasData);

        const catsData = await catsRes.json();
        if (Array.isArray(catsData)) {
          setCategories(catsData.filter((c: PropertyCategoryItem) => c.name !== 'Holiday Home'));
        }

        const reviewsData = await reviewsRes.json();
        if (Array.isArray(reviewsData)) setReviews(reviewsData);

        const propsData = await propsRes.json();
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
                    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'],
              };
            });
          const featuredOnes = saleProps.filter((p: any) => p.featured);
          setFeatured((featuredOnes.length > 0 ? featuredOnes : saleProps).slice(0, 3));
        }
      } catch (err) {
        console.error('Erreur chargement homepage:', err);
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
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] overflow-x-hidden">
      <Navbar />

      {/* HERO WITH DYNAMIC IMAGE CAROUSEL BACKGROUND */}
      <section className="relative h-[85vh] max-w-7xl mx-auto overflow-hidden rounded-3xl my-6 shadow-2xl group">
        <div className="absolute inset-0 z-0">
          {[
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600607687940-467f549687e1?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1582407947304-788b6197f39c?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6772e?q=80&w=1600&auto=format&fit=crop',
          ].map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out animate-carousel"
              style={{
                backgroundImage: `url('${img}')`,
                animationDelay: `${i * 5}s`,
                animationDuration: '25s'
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-10" />

        <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center w-full">
            <div className="lg:col-span-3">
              <Reveal>
                <span className="inline-block text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-6 border-l-2 border-[#C5A880] pl-3 text-white">
                  Luxury &amp; Investment Real Estate, Dubai
                </span>
                <h1 className={`${fraunces.className} text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 leading-[1.05] text-white`}>
                  Find your exceptional property in{' '}
                  <em className="italic text-[#C5A880] not-italic">the heart of Dubai</em>
                </h1>
                <p className="text-gray-200 text-lg max-w-xl font-light leading-relaxed mb-10">
                  An exclusive selection of apartments, villas and townhouses, matched with the legal and financial guidance
                  international buyers need to invest with confidence.
                </p>
              </Reveal>
            </div>

            {/* KEY METRICS / STATS */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-6">
              {[
                { value: '8–12%', label: 'Average rental yield' },
                { value: '0%', label: 'Property & income tax' },
                { value: 'AED 5M+', label: 'Golden Visa eligibility' },
                { value: '100%', label: 'Foreign ownership' },
              ].map((stat, i) => (
                <Reveal key={stat.label} delay={i * 100}>
                  <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                    <p className={`${fraunces.className} text-3xl text-white mb-1`}>{stat.value}</p>
                    <p className="text-gray-300 text-xs leading-snug">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* SEARCH BAR POSITIONED JUST BELOW STATS / HERO */}
          <div className="relative z-30 w-full max-w-5xl mx-auto bg-white border border-[#D8CEBE] p-4 md:p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-4 items-center mt-16">
            <div className="w-full md:w-auto flex-1 px-4 py-2 border-r border-[#D8CEBE] hidden md:block">
              <p className="text-[#2C181A] font-semibold text-sm">Find the home you want, or the investment that gets you there, with Oravya.</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE]">
              <Building2 className="text-[#4A151B] w-5 h-5 shrink-0" />
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-transparent w-full text-[#2C181A] outline-none cursor-pointer text-sm font-medium"
              >
                <option className="bg-[#F2EDE4]">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#F2EDE4]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE]">
              <MapPin className="text-[#4A151B] w-5 h-5 shrink-0" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search by community or building"
                className="bg-transparent w-full text-[#2C181A] outline-none placeholder:text-[#A8989A] text-sm font-medium"
              />
            </div>

            <Link
              href={searchHref}
              className="w-full md:w-auto bg-[#4A151B] text-[#F2EDE4] font-bold px-10 py-4 rounded-xl hover:bg-[#3B1115] transition flex items-center justify-center gap-2 shrink-0 shadow-md"
            >
              <Search className="w-5 h-5" />
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="px-6 py-12 max-w-7xl mx-auto border-y border-[#D8CEBE] my-12">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '15,000+', label: 'Google Reviews' },
              { value: '10+', label: 'Years Experience' },
              { value: '500+', label: 'Expert Agents' },
              { value: 'AED 1B+', label: 'Assets Managed' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div className="flex flex-col items-center">
                  <p className={`${fraunces.className} text-3xl font-medium text-[#4A151B]`}>{stat.value}</p>
                  <p className="text-[#8C6D53] text-xs uppercase tracking-widest font-semibold">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* DEVELOPER PARTNERSHIPS (DYNAMIC FROM ADMIN DATABASE READY) */}
      <section className="px-6 py-16 max-w-7xl mx-auto text-center">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Developers</span>
          <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium mb-4 text-[#2C181A]`}>
            Trusted partner of Dubai's biggest developers
          </h2>
          <p className="text-[#685248] max-w-2xl mx-auto text-sm md:text-base font-light mb-12">
            We sell direct from master developers, ensuring launch prices and payment plans reach you first. Managed dynamically via admin portal.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
          {['Emaar', 'Binghatti', 'Dubai Properties', 'Damac', 'Meraas'].map((dev, i) => (
            <Reveal key={dev} delay={i * 100}>
              <div className="flex items-center justify-center p-6 bg-white border border-[#D8CEBE] rounded-2xl font-bold text-[#4A151B] text-base shadow-sm hover:border-[#4A151B] transition duration-300 group">
                <span className="group-hover:scale-105 transition duration-300">{dev}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* QUICK ACTIONS / CTAs */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ctas.map((cta, i) => {
              const Icon = ICON_MAP[cta.icon] || ArrowRight;
              return (
                <Reveal key={cta.id} delay={i * 60}>
                  <Link
                    href={cta.href}
                    className="group relative overflow-hidden rounded-2xl border border-[#D8CEBE] bg-[#EBE4DA] p-5 shadow-sm hover:border-[#4A151B]/50 hover:shadow-md transition duration-300 h-full flex flex-col"
                  >
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#C5A880]/15 group-hover:bg-[#C5A880]/25 transition" />
                    <div className="w-11 h-11 rounded-xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center mb-4 group-hover:border-[#4A151B]/30 transition">
                      <Icon className="w-5 h-5 text-[#4A151B]" />
                    </div>
                    <h3 className="font-bold text-[#2C181A] text-sm mb-1 leading-snug">{cta.label}</h3>
                    <p className="text-[11px] text-[#685248] font-light leading-relaxed mb-3 flex-1">
                      {cta.description || 'Explore with Oravya'}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A151B]">
                      Continue <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* PROPERTY TYPES */}
      <SectionBackdrop variant="soft" className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE]">
        <Reveal>
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Property Types</span>
              <h2 className={`${fraunces.className} text-2xl md:text-4xl font-medium tracking-tight text-[#2C181A]`}>
                Explore by category
              </h2>
            </div>
            <Link href="/properties" className="hidden sm:flex items-center gap-2 text-sm text-[#4A151B] hover:underline font-medium transition">
              View all properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.slice(0, 8).map((item, i) => {
            const Icon = ICON_MAP[item.icon] || Building2;
            return (
              <Reveal key={item.id} delay={i * 50}>
                <Link
                  href={`/properties?type=${encodeURIComponent(item.name)}`}
                  className="group relative bg-[#EBE4DA]/85 border border-[#D8CEBE] p-7 rounded-2xl hover:border-[#4A151B]/40 transition duration-300 overflow-hidden shadow-sm h-full backdrop-blur-md block"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#C5A880]/10 rounded-full blur-2xl group-hover:bg-[#C5A880]/20 transition" />
                  <Icon className="w-7 h-7 text-[#4A151B] mb-5 group-hover:scale-110 transition duration-300" />
                  <h4 className="text-lg font-bold mb-2 text-[#2C181A]">{item.name}</h4>
                  <p className="text-[#685248] text-xs mb-4 font-light leading-relaxed line-clamp-3">{item.description}</p>
                  <span className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </SectionBackdrop>

      {/* OUR SERVICES */}
      <section id="services" className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE] scroll-mt-24">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Our Services</span>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 text-[#2C181A]`}>
                Every stage of a Dubai property journey
              </h2>
              <p className="text-[#685248] font-light">
                Off-plan, resale, luxury, rentals and investment consultancy — managed end to end by Oravya.
              </p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A151B] hover:underline shrink-0">
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
                  className="h-full bg-[#EBE4DA]/80 border border-[#D8CEBE] p-6 rounded-2xl hover:border-[#4A151B]/40 transition flex flex-col shadow-sm group"
                >
                  <Icon className="w-7 h-7 text-[#4A151B] mb-5 group-hover:scale-110 transition" />
                  <h3 className="font-bold text-[#2C181A] mb-2 leading-snug">{service.title}</h3>
                  <p className="text-[#685248] text-xs font-light leading-relaxed mt-auto">{service.tagline}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <SectionBackdrop variant="villa" className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE]">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 text-[#2C181A]`}>
              Exceptional projects in Dubai
            </h2>
            <p className="text-[#685248] font-light">Live selection from our database — prime locations for strong returns.</p>
          </div>
        </Reveal>

        {featured.length === 0 ? (
          <div className="bg-[#EBE4DA]/70 border border-[#D8CEBE] rounded-2xl p-10 text-center">
            <p className="text-[#685248] text-sm mb-4">No properties in the database yet.</p>
            <Link href="/properties" className="text-sm font-semibold text-[#4A151B] hover:underline">
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((property, i) => (
              <Reveal key={property.id} delay={i * 90}>
                <div className="bg-[#EBE4DA]/90 border border-[#D8CEBE] rounded-2xl overflow-hidden hover:border-[#4A151B]/40 transition group shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <div className="h-56 relative bg-cover bg-center" style={{ backgroundImage: `url('${property.images[0]}')` }}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-300" />
                      <span className="absolute top-4 left-4 bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                        {property.status || 'Exclusive'}
                      </span>
                    </div>
                    <div className="p-6">
                      <span className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold">{property.type}</span>
                      <h3 className="text-lg font-bold mt-1 mb-2 text-[#2C181A] group-hover:text-[#4A151B] transition">{property.name}</h3>
                      <p className="text-[#685248] text-sm flex items-center gap-1 mb-4">
                        <MapPin className="w-4 h-4 text-[#8C6D53]" /> {property.location}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="flex justify-between items-center pt-4 border-t border-[#D8CEBE]">
                      <span className="font-bold text-[#4A151B]">{formatPrice(property.price)}</span>
                      <Link
                        href={`/properties/${property.id}`}
                        className="text-xs bg-[#F2EDE4] hover:bg-[#4A151B] hover:text-[#F2EDE4] border border-[#D8CEBE] text-[#2C181A] px-3 py-2 rounded-lg transition font-medium"
                      >
                        Discover
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </SectionBackdrop>

      {/* REMOTE CTA */}
      <SectionBackdrop variant="lobby" rounded={false} className="px-6 py-20 border-y border-[#D8CEBE]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-6 text-[#2C181A]`}>
                Plan your real estate project remotely
              </h2>
              <p className="text-[#685248] mb-8 font-light leading-relaxed">
                Whether you want to invest in a new off-plan project in Dubai, purchase a holiday home, or book a seasonal
                rental, our experts guide you step by step.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="bg-[#4A151B] text-[#F2EDE4] font-bold px-6 py-3.5 rounded-xl hover:bg-[#3B1115] transition text-center shadow-md">
                  Book an online meeting
                </Link>
                <Link href="/holiday-homes" className="border border-[#C5A880] text-[#2C181A] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#F2EDE4] transition text-center">
                  Book a holiday home
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                <Calendar className="w-8 h-8 text-[#4A151B] mb-4" />
                <div>
                  <h4 className="font-bold mb-1 text-[#2C181A]">Video consultation</h4>
                  <p className="text-xs text-[#685248]">Speak directly with a Dubai market expert advisor.</p>
                </div>
              </div>
              <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-6 rounded-2xl flex flex-col justify-between mt-6 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-[#4A151B] mb-4" />
                <div>
                  <h4 className="font-bold mb-1 text-[#2C181A]">Secure transactions</h4>
                  <p className="text-xs text-[#685248]">Secure transactions and transparent deposit management.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionBackdrop>

      {/* WHY ORAVYA */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 text-[#2C181A]`}>
              Why global investors choose Oravya
            </h2>
            <p className="text-[#685248] font-light">End-to-end advisory tailored to international high-net-worth individuals.</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8CEBE] border-t border-b border-[#D8CEBE]">
          {[
            { title: 'Off-market access', desc: 'Private listings and prime off-plan units before public release.' },
            { title: 'Legal & financial guidance', desc: 'Registration, golden visa applications, and tax structuring.' },
            { title: 'Property management', desc: 'Post-purchase management, leasing, and holiday home operations.' },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="p-8 md:px-8 md:py-10">
                <CheckCircle2 className="w-6 h-6 text-[#4A151B] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-[#2C181A]">{item.title}</h3>
                <p className="text-[#685248] text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <SectionBackdrop variant="night" className="px-6 py-20 max-w-5xl mx-auto border-t border-[#D8CEBE] scroll-mt-24">
        <div id="faqs">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Frequently Asked Questions</span>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight text-[#2C181A]`}>
                Everything you need to know about investing in Dubai
              </h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {[
              { q: 'Can foreign nationals own 100% property in Dubai?', a: 'Yes. Foreigners and non-residents can have 100% freehold ownership in designated investment zones across Dubai.' },
              { q: 'What are the property taxes and rental yields in Dubai?', a: 'Dubai offers 0% property tax, 0% capital gains tax, and 0% personal income tax. Rental yields average 8–12% net depending on location.' },
              { q: 'How does property investment qualify for the UAE Golden Visa?', a: 'Investing a minimum of AED 2 million in real estate qualifies the investor and family for a 10-year UAE Golden Residency Visa.' },
              { q: 'Can I buy a property remotely from abroad?', a: 'Absolutely. Oravya handles remote transactions from virtual viewings to title deed registration.' },
            ].map((faq, i) => (
              <Reveal key={faq.q} delay={i * 80}>
                <div className="bg-[#EBE4DA]/85 border border-[#D8CEBE] p-6 md:p-8 rounded-2xl shadow-sm backdrop-blur-md">
                  <h3 className="text-lg font-bold text-[#2C181A] mb-2">{faq.q}</h3>
                  <p className="text-[#685248] text-sm font-light leading-relaxed">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionBackdrop>

      {/* TESTIMONIALS + SUBMIT REVIEW */}
      <section id="testimonials" className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE] scroll-mt-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Client Testimonials</span>
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight text-[#2C181A]`}>
              Trusted by global investors &amp; homeowners
            </h2>
            <p className="text-[#685248] text-sm font-light mt-3">Only approved reviews appear here. Share yours below.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reviews.length === 0 ? (
            <p className="text-sm text-[#8C6D53] col-span-3 text-center">No approved reviews yet.</p>
          ) : (
            reviews.slice(0, 6).map((review, i) => (
              <Reveal key={review.id} delay={i * 90}>
                <div className="bg-[#EBE4DA]/80 border border-[#D8CEBE] p-8 rounded-2xl shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex gap-1 mb-4 text-[#C5A880]">
                      {[...Array(review.rating || 5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-[#C5A880]" />
                      ))}
                    </div>
                    <p className="text-[#685248] text-sm font-light leading-relaxed italic mb-6">&ldquo;{review.quote}&rdquo;</p>
                  </div>
                  <div className="pt-4 border-t border-[#D8CEBE]">
                    <p className="font-bold text-[#2C181A] text-sm">{review.authorName}</p>
                    <p className="text-xs text-[#8C6D53]">
                      {review.location}
                      {review.investment ? (
                        <>
                          {' '}
                          • <span className="font-medium text-[#4A151B]">{review.investment}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>

        <Reveal>
          <div className="max-w-2xl mx-auto bg-[#EBE4DA]/90 border border-[#D8CEBE] rounded-3xl p-8 shadow-sm">
            <h3 className={`${fraunces.className} text-2xl text-[#2C181A] mb-2`}>Share your experience</h3>
            <p className="text-sm text-[#685248] font-light mb-6">
              Your review is submitted for admin approval before it appears on the website.
            </p>
            {reviewSent ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-[#4A151B] mx-auto mb-4" />
                <p className="font-semibold text-[#2C181A] mb-2">Thank you — review received</p>
                <p className="text-sm text-[#685248]">It will appear once approved by Oravya.</p>
                <button onClick={() => setReviewSent(false)} className="mt-4 text-sm font-semibold text-[#4A151B] hover:underline">
                  Submit another
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
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4A151B]"
                  />
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4A151B]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Investment type (optional)"
                  value={reviewForm.investment}
                  onChange={(e) => setReviewForm({ ...reviewForm, investment: e.target.value })}
                  className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4A151B]"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium">Rating</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                      className="p-1"
                    >
                      <Star className={`w-5 h-5 ${n <= reviewForm.rating ? 'fill-[#C5A880] text-[#C5A880]' : 'text-[#D8CEBE]'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={4}
                  placeholder="Your review..."
                  value={reviewForm.quote}
                  onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                  className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4A151B] resize-none"
                />
                {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#4A151B] text-[#F2EDE4] font-bold px-6 py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md disabled:opacity-60"
                >
                  <Send className="w-4 h-4" /> {reviewSubmitting ? 'Sending...' : 'Submit for approval'}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8C6D53] border-t border-[#D8CEBE]">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/properties" className="hover:text-[#4A151B] transition">Properties</Link>
          <Link href="/services" className="hover:text-[#4A151B] transition">Services</Link>
          <Link href="/holiday-homes" className="hover:text-[#4A151B] transition">Holiday Homes</Link>
          <Link href="/contact" className="hover:text-[#4A151B] transition">Contact</Link>
        </div>
      </footer>
    </div>
  );
}