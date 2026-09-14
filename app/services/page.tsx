'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import {
  Building2,
  RefreshCcw,
  Crown,
  KeyRound,
  LineChart,
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Navbar from '@/components/Navbar';
import { ServiceItem } from '@/lib/data';

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
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] || Building2;
  return <Icon className="w-8 h-8 text-[#4A151B]" />;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (Array.isArray(data)) {
          setServices(data.filter((s: ServiceItem) => s.active !== false));
        }
      } catch (err) {
        console.error('Erreur chargement services:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] overflow-x-hidden">
      <Navbar />

      <section className="relative px-6 pt-28 pb-16 max-w-7xl mx-auto overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-8 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-[#C5A880]/12 blur-[110px]" />
        </div>

        <Reveal>
          <span className="inline-block text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-6 border-l-2 border-[#C5A880] pl-3">
            Our Services
          </span>
          <h1 className={`${fraunces.className} text-4xl md:text-6xl font-medium tracking-tight mb-6 max-w-3xl leading-[1.08] text-[#2C181A]`}>
            Every stage of a Dubai property journey
          </h1>
          <p className="text-[#685248] text-lg font-light max-w-2xl leading-relaxed">
            From off-plan launches to luxury acquisitions and ongoing consultancy — Oravya guides international buyers with clarity and care.
          </p>
        </Reveal>
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        {loading ? (
          <p className="text-sm text-[#8C6D53] py-16 text-center">Loading services from database...</p>
        ) : services.length === 0 ? (
          <p className="text-sm text-[#8C6D53] py-16 text-center">No services available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 80}>
                <article className="h-full bg-[#EBE4DA]/85 border border-[#D8CEBE] p-8 rounded-2xl hover:border-[#4A151B]/40 transition duration-300 shadow-sm flex flex-col group">
                  <div className="w-14 h-14 rounded-2xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center mb-6 group-hover:border-[#4A151B]/30 transition">
                    <ServiceIcon name={service.icon} />
                  </div>
                  <h2 className={`${fraunces.className} text-2xl font-medium text-[#2C181A] mb-2`}>{service.title}</h2>
                  <p className="text-sm font-semibold text-[#4A151B] mb-4">{service.tagline}</p>
                  <p className="text-[#685248] text-sm font-light leading-relaxed mb-8 flex-1">
                    {service.description || service.tagline}
                  </p>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A151B] hover:underline"
                  >
                    Book a meeting <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-16 bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div>
              <h3 className={`${fraunces.className} text-2xl md:text-3xl text-[#2C181A] mb-2`}>
                Not sure which path fits you?
              </h3>
              <p className="text-[#685248] font-light max-w-xl">
                Speak with an Oravya advisor — we map your goals to the right service and the right Dubai opportunity.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-[#4A151B] text-[#F2EDE4] font-bold px-7 py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md shrink-0"
            >
              Contact us
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8C6D53] border-t border-[#D8CEBE]">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/properties" className="hover:text-[#4A151B] transition">Properties</Link>
          <Link href="/services" className="hover:text-[#4A151B] transition">Services</Link>
          <Link href="/contact" className="hover:text-[#4A151B] transition">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
