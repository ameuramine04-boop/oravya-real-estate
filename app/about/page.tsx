'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fraunces } from 'next/font/google';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], display: 'swap' });

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] overflow-x-hidden">
      {/* NAVBAR UNIFIÉE */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">About Oravya Real Estate</span>
          <h1 className={`${fraunces.className} text-4xl md:text-6xl font-medium tracking-tight mb-6 max-w-3xl text-[#2C181A]`}>
            Redefining luxury advisory in Dubai&apos;s dynamic market
          </h1>
          <p className="text-[#685248] text-lg font-light max-w-2xl leading-relaxed">
            Founded with a commitment to absolute transparency, discretion, and tailored excellence, Oravya bridges the gap between global investors and Dubai&apos;s most prestigious addresses.
          </p>
        </Reveal>
      </section>

      {/* LEADERSHIP / CEO SECTION AVEC LA VRAIE PHOTO ET UN BACKGROUND DÉCORATIF CLAIR */}
      <section className="relative px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE] bg-cover bg-center rounded-3xl my-6 overflow-hidden shadow-sm" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-[#F2EDE4]/92 backdrop-blur-[2px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="h-[480px] rounded-3xl relative overflow-hidden border border-[#D8CEBE] shadow-xl group">
              {/* Remplace '/oumayma.jpg' par le nom exact de ton fichier image dans le dossier public */}
              <Image 
                src="/oumayma.jpg" 
                alt="Omayma Chouta - Executive Portrait" 
                fill 
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C181A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <p className={`${fraunces.className} text-2xl font-medium`}>Omayma Chouta</p>
                <p className="text-xs tracking-wider uppercase text-[#C5A880] font-semibold mt-0.5">Founder &amp; Managing Director</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-2 block">Leadership &amp; Vision</span>
              <h2 className={`${fraunces.className} text-3xl font-medium tracking-tight mb-6 text-[#2C181A]`}>
                Excellence is not an act, it is our standard
              </h2>
              <p className="text-[#685248] font-light leading-relaxed mb-6">
                With a rigorous background in international real estate and finance, Omayma Chouta established Oravya to offer high-net-worth individuals an advisory experience completely free from high-pressure sales tactics.
              </p>
              <p className="text-[#685248] font-light leading-relaxed mb-8">
                &ldquo;Our philosophy is simple: we protect your capital as if it were our own, aligning every investment strategy with your long-term financial and lifestyle goals in Dubai.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/contact"
                  className="bg-[#4A151B] text-[#F2EDE4] font-bold px-7 py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md inline-flex items-center gap-2 text-sm"
                >
                  Book a consultation with Omayma <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CORE VALUES AVEC BACKGROUND DÉCORATIF CLAIR */}
      <section className="relative px-6 py-20 bg-[#E6DDD0]/50 border-y border-[#D8CEBE] bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1400&auto=format&fit=crop')` }}>
        <div className="absolute inset-0 bg-[#F2EDE4]/92 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Our Core Ethos</span>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight text-[#2C181A]`}>
                Built on unwavering principles
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Absolute Discretion', desc: 'We handle private transactions and high-profile clients with peerless confidentiality and care.' },
              { title: 'Data-Driven Insight', desc: 'Every market forecast and valuation is backed by deep analytics, ensuring optimal ROI.' },
              { title: 'End-to-End Partnership', desc: 'From initial off-plan selection to golden visa paperwork and property management, we stay by your side.' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <div className="bg-[#EBE4DA]/90 border border-[#D8CEBE] p-8 rounded-2xl shadow-sm h-full backdrop-blur-md">
                  <CheckCircle2 className="w-6 h-6 text-[#4A151B] mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-[#2C181A]">{item.title}</h3>
                  <p className="text-[#685248] text-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8C6D53]">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/properties" className="hover:text-[#4A151B] transition">Properties</Link>
          <Link href="/holiday-homes" className="hover:text-[#4A151B] transition">Holiday Homes</Link>
          <Link href="/about" className="hover:text-[#4A151B] transition">About Us</Link>
          <Link href="/contact" className="hover:text-[#4A151B] transition">Contact</Link>
        </div>
      </footer>
    </div>
  );
}