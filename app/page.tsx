'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] overflow-x-hidden">
      {/* NAVBAR PARTAGÉE */}
      <Navbar />

      {/* HERO SECTION AVEC BACKGROUND IMAGE & OVERLAY DE LISIBILITÉ */}
      <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-20 max-w-7xl mx-auto overflow-hidden rounded-3xl my-6 bg-cover bg-center shadow-lg" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop')` }}>
        
        {/* CALQUE D'OPACITÉ POUR ASSURER LE CONTRASTE DU TEXTE */}
        <div className="absolute inset-0 bg-[#F2EDE4]/90 backdrop-blur-[2px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-end">
          <div className="lg:col-span-3">
            <span className="inline-block text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-6 border-l-2 border-[#C5A880] pl-3">
              Luxury &amp; Investment Real Estate, Dubai
            </span>
            <h1 className={`${fraunces.className} text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 leading-[1.05] text-[#2C181A]`}>
              Find your exceptional property in{' '}
              <em className="italic text-[#4A151B] not-italic">
                the heart of Dubai
              </em>
            </h1>
            <p className="text-[#685248] text-lg max-w-xl font-light leading-relaxed">
              An exclusive selection of apartments, villas and townhouses, matched with the legal and financial guidance
              international buyers need to invest with confidence.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-4 lg:border-l lg:border-[#D8CEBE] lg:pl-10">
            {[
              { value: '8–12%', label: 'Average rental yield' },
              { value: '0%', label: 'Property & income tax' },
              { value: 'AED 5M+', label: 'Golden Visa eligibility' },
              { value: '100%', label: 'Foreign ownership' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className={`${fraunces.className} text-3xl text-[#4A151B] mb-1`}>{stat.value}</p>
                <p className="text-[#8C6D53] text-xs leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative z-10 w-full bg-[#EBE4DA]/95 border border-[#D8CEBE] p-4 md:p-5 rounded-2xl shadow-xl backdrop-blur-xl flex flex-col md:flex-row gap-3 items-center mt-14">
          <div className="flex items-center gap-3 w-full bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE]">
            <Building2 className="text-[#4A151B] w-5 h-5 shrink-0" />
            <select className="bg-transparent w-full text-[#2C181A] outline-none cursor-pointer text-sm">
              <option className="bg-[#F2EDE4]">All Categories</option>
              <option className="bg-[#F2EDE4]">Apartments</option>
              <option className="bg-[#F2EDE4]">Villas</option>
              <option className="bg-[#F2EDE4]">Townhouses</option>
              <option className="bg-[#F2EDE4]">Residential Plots</option>
              <option className="bg-[#F2EDE4]">New Projects</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE]">
            <MapPin className="text-[#4A151B] w-5 h-5 shrink-0" />
            <input
              type="text"
              placeholder="Ex: Downtown, Palm Jumeirah..."
              className="bg-transparent w-full text-[#2C181A] outline-none placeholder:text-[#A8989A] text-sm"
            />
          </div>

          <Link
            href="/properties"
            className="w-full md:w-auto bg-[#4A151B] text-[#F2EDE4] font-bold px-8 py-3.5 rounded-xl hover:bg-[#3B1115] transition flex items-center justify-center gap-2 shrink-0 shadow-md"
          >
            <Search className="w-5 h-5" />
            Search
          </Link>
        </div>
      </section>

      {/* CATEGORIES AVEC BACKGROUND DÉCORATIF CLAIR */}
      <section className="relative px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE] bg-cover bg-center rounded-3xl my-6 overflow-hidden shadow-sm" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-[#F2EDE4]/92 backdrop-blur-[2px]" />
        
        <div className="relative z-10">
          <Reveal>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className={`${fraunces.className} text-2xl md:text-4xl font-medium tracking-tight text-[#2C181A]`}>Explore by category</h2>
              </div>
              <Link href="/properties" className="hidden sm:flex items-center gap-2 text-sm text-[#4A151B] hover:underline font-medium transition">
                View all properties <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Apartments', desc: 'Panoramic views and high-end finishing', count: 'Exclusive listings' },
              { title: 'Luxury Villas', desc: 'Privacy and contemporary design', count: 'Prestigious' },
              { title: 'Townhouses', desc: 'Family-friendly modern communities', count: 'Communities' },
              { title: 'Holiday Homes', desc: 'Premium seasonal rentals', count: 'Online booking' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="group relative bg-[#EBE4DA]/85 border border-[#D8CEBE] p-8 rounded-2xl hover:border-[#4A151B]/40 transition duration-300 cursor-pointer overflow-hidden shadow-sm h-full backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A880]/10 rounded-full blur-2xl group-hover:bg-[#C5A880]/20 transition" />
                  <Home className="w-8 h-8 text-[#4A151B] mb-6 group-hover:scale-110 transition duration-300" />
                  <h4 className="text-xl font-bold mb-2 text-[#2C181A]">{item.title}</h4>
                  <p className="text-[#685248] text-sm mb-4 font-light">{item.desc}</p>
                  <span className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold">{item.count}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRIME LOCATIONS AVEC BACKGROUND DÉCORATIF CLAIR */}
      <section className="relative px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE] bg-cover bg-center rounded-3xl my-6 overflow-hidden shadow-sm" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1400&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-[#F2EDE4]/92 backdrop-blur-[2px]" />

        <div className="relative z-10">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 text-[#2C181A]`}>
                Invest in Dubai&apos;s most sought-after areas
              </h2>
              <p className="text-[#685248] font-light">
                From iconic waterfronts to thriving business hubs, find properties where demand is highest.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Downtown Dubai',
                desc: "Home to the Burj Khalifa and Dubai Mall. High capital appreciation and premium rental returns.",
                properties: '45+ Properties',
              },
              {
                name: 'Palm Jumeirah',
                desc: "The world's most famous man-made island, offering ultra-luxury beachfront villas and residences.",
                properties: '28+ Properties',
              },
              {
                name: 'Dubai Marina',
                desc: 'Vibrant waterfront community renowned for its skyscrapers, yacht clubs and luxury lifestyle.',
                properties: '35+ Properties',
              },
            ].map((area, i) => (
              <Reveal key={area.name} delay={i * 90}>
                <div className="bg-[#EBE4DA]/85 border border-[#D8CEBE] p-8 rounded-2xl hover:border-[#4A151B]/40 transition flex flex-col justify-between shadow-sm h-full backdrop-blur-md">
                  <div>
                    <span className="text-xs text-[#C5A880] font-semibold uppercase tracking-wider">{area.properties}</span>
                    <h3 className={`${fraunces.className} text-2xl mt-2 mb-3 text-[#2C181A]`}>{area.name}</h3>
                    <p className="text-[#685248] text-sm font-light leading-relaxed mb-6">{area.desc}</p>
                  </div>
                  <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A151B] hover:underline transition">
                    Explore area <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS AVEC IMAGES DE FOND RÉELLES */}
      <section className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE]">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 text-[#2C181A]`}>
              Exceptional projects in Dubai
            </h2>
            <p className="text-[#685248] font-light">A rigorous selection of prime locations to maximize your return on investment.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: 'Burj Crown, Downtown', 
              type: 'Luxury Apartment', 
              price: 'Starting from AED 2.1M', 
              loc: 'Downtown Dubai',
              img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
            },
            { 
              name: 'Palm Beach Villas', 
              type: 'Waterfront Villa', 
              price: 'Starting from AED 14.5M', 
              loc: 'Palm Jumeirah',
              img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop'
            },
            { 
              name: 'Emaar South Townhouses', 
              type: 'Family Townhouse', 
              price: 'Starting from AED 1.8M', 
              loc: 'Dubai South',
              img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop'
            },
          ].map((property, i) => (
            <Reveal key={property.name} delay={i * 90}>
              <div className="bg-[#EBE4DA]/90 border border-[#D8CEBE] rounded-2xl overflow-hidden hover:border-[#4A151B]/40 transition group shadow-sm h-full flex flex-col justify-between">
                <div>
                  {/* IMAGE DE FOND AVEC OVERLAY LÉGER POUR LA LISIBILITÉ */}
                  <div className="h-56 relative bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('${property.img}')` }}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-300" />
                    <span className="absolute top-4 left-4 bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                      Exclusive
                    </span>
                  </div>

                  <div className="p-6">
                    <span className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold">{property.type}</span>
                    <h3 className="text-lg font-bold mt-1 mb-2 text-[#2C181A] group-hover:text-[#4A151B] transition">{property.name}</h3>
                    <p className="text-[#685248] text-sm flex items-center gap-1 mb-4">
                      <MapPin className="w-4 h-4 text-[#8C6D53]" /> {property.loc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex justify-between items-center pt-4 border-t border-[#D8CEBE]">
                    <span className="font-bold text-[#4A151B]">{property.price}</span>
                    <Link
                      href="/properties"
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
      </section>

      {/* SERVICES AVEC BACKGROUND DÉCORATIF CLAIR */}
      <section className="relative px-6 py-20 bg-[#E6DDD0]/60 border-y border-[#D8CEBE] bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1400&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-[#F2EDE4]/92 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-6 text-[#2C181A]`}>
                Plan your real estate project remotely
              </h2>
              <p className="text-[#685248] mb-8 font-light leading-relaxed">
                Whether you want to invest in a new off-plan project in Dubai, purchase a holiday home, or book a seasonal
                rental, our experts guide you step by step. Schedule a direct online meeting in just a few clicks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-[#4A151B] text-[#F2EDE4] font-bold px-6 py-3.5 rounded-xl hover:bg-[#3B1115] transition text-center shadow-md"
                >
                  Book an online meeting
                </Link>
                <Link
                  href="/holiday-homes"
                  className="border border-[#C5A880] text-[#2C181A] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#F2EDE4] transition text-center"
                >
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
      </section>

      {/* WHY ORAVYA */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-4 text-[#2C181A]`}>
              Why global investors choose Oravya
            </h2>
            <p className="text-[#685248] font-light">
              End-to-end advisory services tailored to international high-net-worth individuals.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8CEBE] border-t border-b border-[#D8CEBE]">
          {[
            {
              title: 'Off-market access',
              desc: 'Get exclusive access to private listings and prime off-plan units before public release.',
            },
            {
              title: 'Legal & financial guidance',
              desc: 'Full assistance with property registration, golden visa applications, and tax structuring.',
            },
            {
              title: 'Property management',
              desc: 'Complete post-purchase management, rental leasing, and holiday home operations.',
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="p-8 md:px-8 md:py-10 first:pt-8 md:first:pt-10">
                <CheckCircle2 className="w-6 h-6 text-[#4A151B] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-[#2C181A]">{item.title}</h3>
                <p className="text-[#685248] text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ SECTION AVEC BACKGROUND DÉCORATIF CLAIR */}
      <section id="faqs" className="relative px-6 py-20 max-w-5xl mx-auto border-t border-[#D8CEBE] scroll-mt-24 bg-cover bg-center rounded-3xl my-6 overflow-hidden shadow-sm" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-[#F2EDE4]/92 backdrop-blur-[2px]" />

        <div className="relative z-10">
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
              {
                q: "Can foreign nationals own 100% property in Dubai?",
                a: "Yes. Foreigners and non-residents can have 100% absolute freehold ownership of properties in designated investment zones across Dubai."
              },
              {
                q: "What are the property taxes and rental yields in Dubai?",
                a: "Dubai offers 0% property tax, 0% capital gains tax, and 0% personal income tax. Rental yields are among the highest globally, averaging between 8% to 12% net per year depending on the location."
              },
              {
                q: "How does property investment qualify for the UAE Golden Visa?",
                a: "Investing a minimum of AED 2 million in real estate (either ready or off-plan properties) qualifies the investor, their spouse, and children for the prestigious 10-year UAE Golden Residency Visa."
              },
              {
                q: "Can I buy a property remotely from abroad?",
                a: "Absolutely. Oravya handles remote transactions securely, from virtual property viewings and digital contract signing to bank account setup and title deed registration."
              },
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
      </section>

      {/* TESTIMONIALS / CLIENT REVIEWS */}
      <section id="testimonials" className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE] scroll-mt-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Client Testimonials</span>
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight text-[#2C181A]`}>
              Trusted by global investors &amp; homeowners
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "Omayma and the Oravya team made acquiring our penthouse in Downtown Dubai completely seamless. Their market insight and legal guidance gave us total confidence from abroad.",
              author: "Alexander V.",
              location: "London, UK",
              investment: "Downtown Dubai Investor"
            },
            {
              quote: "Professionalism at its finest. No high-pressure tactics, just pure facts and exceptional off-market access. Our rental yields have exceeded projections.",
              author: "Marc & Sophie D.",
              location: "Paris, France",
              investment: "Palm Jumeirah Villa Owners"
            },
            {
              quote: "As a first-time investor in Dubai, I needed a partner I could trust blindly. Oravya handled everything from bank account setup to golden visa processing.",
              author: "Tariq M.",
              location: "Riyadh, Saudi Arabia",
              investment: "Multi-Unit Off-Plan Investor"
            },
          ].map((review, i) => (
            <Reveal key={review.author} delay={i * 90}>
              <div className="bg-[#EBE4DA]/80 border border-[#D8CEBE] p-8 rounded-2xl shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex gap-1 mb-4 text-[#C5A880]">
                    {[...Array(5)].map((_, idx) => (
                      <span key={idx} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-[#685248] text-sm font-light leading-relaxed italic mb-6">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D8CEBE]">
                  <p className="font-bold text-[#2C181A] text-sm">{review.author}</p>
                  <p className="text-xs text-[#8C6D53]">{review.location} • <span className="font-medium text-[#4A151B]">{review.investment}</span></p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
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