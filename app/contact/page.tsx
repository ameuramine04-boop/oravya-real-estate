'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Fraunces } from 'next/font/google';
import {
  Gem,
  ShieldCheck,
  Award,
  Scale,
  HeartHandshake,
  Building2,
  RefreshCcw,
  Crown,
  KeyRound,
  LineChart,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Navbar from '@/components/Navbar';
import { ServiceItem } from '@/lib/data';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], display: 'swap' });

const VALUES = [
  { icon: ShieldCheck, title: 'Trust', desc: 'Every recommendation is built on transparency, not pressure.' },
  { icon: Award, title: 'Expertise', desc: "Deep, current knowledge of Dubai's fastest-moving market." },
  { icon: Scale, title: 'Integrity', desc: "We tell you what a deal is worth — even when it isn't the one you asked about." },
  { icon: HeartHandshake, title: 'Focus on You', desc: 'Your goals set the strategy, not a sales quota.' },
];

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  RefreshCcw,
  Crown,
  KeyRound,
  LineChart,
  Sparkles,
};

const TIME_SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

function ContactForm() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: TIME_SLOTS[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (Array.isArray(data)) {
          const active = data.filter((s: ServiceItem) => s.active !== false);
          setServices(active);
          const fromUrl = searchParams.get('service');
          const match = active.find((s: ServiceItem) => s.title === fromUrl);
          setForm((f) => ({
            ...f,
            service: match?.title || active[0]?.title || '',
          }));
        }
      } catch (err) {
        console.error('Erreur chargement services:', err);
      }
    }
    loadServices();
  }, [searchParams]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.date || !form.service) {
      setError('Please fill in your name, email, phone, service and a preferred date.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save meeting');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Unable to send your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] overflow-x-hidden">
      <Navbar />

      <section className="relative px-6 pt-28 pb-24 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl border border-[#4A151B]/30 bg-[#4A151B]/5 flex items-center justify-center">
              <Gem className="w-7 h-7 text-[#4A151B]" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold tracking-widest text-[#4A151B] leading-none">ORAVYA</p>
              <p className="text-[11px] tracking-[0.2em] text-[#8C6D53] uppercase mt-1">Real Estate</p>
            </div>
          </div>
          <h1 className={`${fraunces.className} text-4xl md:text-6xl font-medium tracking-tight mb-6 max-w-3xl leading-[1.1] text-[#2C181A]`}>
            Your trusted real estate partner in Dubai
          </h1>
          <p className="text-[#685248] text-lg font-light max-w-xl mb-10">
            Connecting people to the right properties and the right opportunities.
          </p>
          <a href="#meeting-form" className="bg-[#4A151B] text-[#F2EDE4] font-bold px-8 py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md inline-flex items-center gap-2">
            Let&apos;s find your next opportunity <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE]">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">What Drives Us</span>
          <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-14 max-w-xl text-[#2C181A]`}>
            Four principles behind every deal
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 90}>
              <div className="h-full bg-[#EBE4DA]/70 border border-[#D8CEBE] p-7 rounded-2xl hover:border-[#4A151B]/40 transition duration-300 shadow-sm">
                <v.icon className="w-7 h-7 text-[#4A151B] mb-5" />
                <h3 className="text-lg font-bold mb-2 text-[#2C181A]">{v.title}</h3>
                <p className="text-[#685248] text-sm font-light leading-relaxed">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE]">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Our Services</span>
          <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-14 max-w-xl text-[#2C181A]`}>
            Every stage of a Dubai property journey
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((s, i) => {
            const Icon = ICON_MAP[s.icon] || Building2;
            return (
              <Reveal key={s.id} delay={i * 80}>
                <div className="h-full bg-[#EBE4DA]/70 border border-[#D8CEBE] p-6 rounded-2xl hover:border-[#4A151B]/40 transition flex flex-col shadow-sm">
                  <Icon className="w-7 h-7 text-[#4A151B] mb-5" />
                  <h3 className="font-bold text-[#2C181A] mb-2 leading-snug">{s.title}</h3>
                  <p className="text-[#685248] text-xs font-light leading-relaxed mt-auto">{s.tagline}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="meeting-form" className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE] scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <Reveal className="lg:col-span-2">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Get In Touch</span>
            <h2 className={`${fraunces.className} text-3xl font-medium tracking-tight mb-6 text-[#2C181A]`}>
              Let&apos;s find your next opportunity
            </h2>
            <p className="text-[#685248] font-light leading-relaxed mb-8">
              Book a direct online meeting below or reach out instantly via our direct channels.
            </p>
            <div className="space-y-3 mb-10">
              <div className="flex items-center gap-4 bg-[#EBE4DA] border border-[#D8CEBE] p-4 rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#4A151B]" />
                </div>
                <div>
                  <p className="text-xs text-[#8C6D53] uppercase tracking-wider font-semibold">Office Location</p>
                  <p className="text-[#2C181A] text-sm font-medium">Dubai, UAE</p>
                </div>
              </div>
              <a href="mailto:Omayma@oravya.net" className="flex items-center justify-between bg-[#EBE4DA] border border-[#D8CEBE] p-4 rounded-2xl hover:border-[#4A151B] transition group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#4A151B]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8C6D53] uppercase tracking-wider font-semibold">Email Us</p>
                    <p className="text-[#2C181A] text-sm font-medium">Omayma@oravya.net</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C6D53]" />
              </a>
              <a href="tel:+971502392395" className="flex items-center justify-between bg-[#EBE4DA] border border-[#D8CEBE] p-4 rounded-2xl hover:border-[#4A151B] transition shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#4A151B]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8C6D53] uppercase tracking-wider font-semibold">Direct Phone 1</p>
                    <p className="text-[#2C181A] text-sm font-medium">+971 50 239 2395</p>
                  </div>
                </div>
                <span className="text-xs bg-[#4A151B] text-[#F2EDE4] px-2.5 py-1 rounded-md font-medium">Call</span>
              </a>
              <a href="tel:+971585905281" className="flex items-center justify-between bg-[#EBE4DA] border border-[#D8CEBE] p-4 rounded-2xl hover:border-[#4A151B] transition shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#4A151B]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8C6D53] uppercase tracking-wider font-semibold">Direct Phone 2</p>
                    <p className="text-[#2C181A] text-sm font-medium">+971 58 590 5281</p>
                  </div>
                </div>
                <span className="text-xs bg-[#4A151B] text-[#F2EDE4] px-2.5 py-1 rounded-md font-medium">Call</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-3">
            <div className="bg-[#EBE4DA]/90 border border-[#D8CEBE] rounded-2xl p-6 md:p-8 shadow-sm">
              {submitted ? (
                <div className="py-16 flex flex-col items-center text-center">
                  <CheckCircle2 className="w-14 h-14 text-[#4A151B] mb-6" />
                  <h3 className={`${fraunces.className} text-2xl mb-3 text-[#2C181A]`}>Request received</h3>
                  <p className="text-[#685248] font-light max-w-sm mb-8">
                    Thank you, {form.name.split(' ')[0]}. An Oravya advisor will confirm your meeting on {form.date} at {form.time} shortly.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="text-sm font-semibold text-[#4A151B] hover:underline">
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-[#2C181A]">Book an online meeting</h3>
                    <p className="text-[#8C6D53] text-sm font-light">Tell us what you&apos;re looking for.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Full Name</label>
                      <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Doe" className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Phone</label>
                      <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+971 5X XXX XXXX" className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Email</label>
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@email.com" className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">I&apos;m interested in</label>
                    <select value={form.service} onChange={(e) => update('service', e.target.value)} className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]">
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Preferred Date</label>
                      <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Preferred Time</label>
                      <select value={form.time} onChange={(e) => update('time', e.target.value)} className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]">
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Message (optional)</label>
                    <textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={4} placeholder="A few words about what you are looking for..." className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B] resize-none" />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-[#4A151B] text-[#F2EDE4] font-bold px-6 py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md disabled:opacity-60">
                    <Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Request meeting'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
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

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center text-[#8C6D53] text-sm">Loading...</div>}>
      <ContactForm />
    </Suspense>
  );
}
