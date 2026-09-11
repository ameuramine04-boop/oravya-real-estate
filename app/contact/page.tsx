'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], display: 'swap' });

const VALUES = [
  { icon: ShieldCheck, title: 'Trust', desc: 'Every recommendation is built on transparency, not pressure.' },
  { icon: Award, title: 'Expertise', desc: 'Deep, current knowledge of Dubai’s fastest-moving market.' },
  { icon: Scale, title: 'Integrity', desc: 'We tell you what a deal is worth — even when it isn’t the one you asked about.' },
  { icon: HeartHandshake, title: 'Focus on You', desc: 'Your goals set the strategy, not a sales quota.' },
];

const SERVICES = [
  { icon: Building2, title: 'Off-Plan Properties', tag: 'Premium projects. Smart investments.' },
  { icon: RefreshCcw, title: 'Resale Properties', tag: 'Great locations. Great value.' },
  { icon: Crown, title: 'Luxury Properties', tag: 'Exclusive living. Extraordinary lifestyles.' },
  { icon: KeyRound, title: 'Rental Properties', tag: 'Quality homes. Long-term comfort.' },
  { icon: LineChart, title: 'Investment Consultancy', tag: 'Data-driven advice. Better returns.' },
];

const TIME_SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: SERVICES[0].title,
    date: '',
    time: TIME_SLOTS[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.date) {
      setError('Please fill in your name, email, phone and a preferred date.');
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] overflow-x-hidden">
      {/* NAVBAR UNIFIÉE */}
      <Navbar />

      {/* HERO */}
      <section className="relative px-6 pt-28 pb-24 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-[#C5A880]/10 blur-[120px] animate-glow-a" />
          <div className="absolute left-1/3 top-40 w-[380px] h-[380px] rounded-full bg-[#4A151B]/5 blur-[100px] animate-glow-b" />
        </div>

        <div className="flex flex-col items-center animate-rise-in">
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

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="#meeting-form"
              className="bg-[#4A151B] text-[#F2EDE4] font-bold px-8 py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md flex items-center gap-2"
            >
              Let&apos;s find your next opportunity <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
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

      {/* SERVICES */}
      <section className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE]">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Our Services</span>
          <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium tracking-tight mb-14 max-w-xl text-[#2C181A]`}>
            Every stage of a Dubai property journey
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="h-full bg-[#EBE4DA]/70 border border-[#D8CEBE] p-6 rounded-2xl hover:border-[#4A151B]/40 transition flex flex-col shadow-sm">
                <s.icon className="w-7 h-7 text-[#4A151B] mb-5" />
                <h3 className="font-bold text-[#2C181A] mb-2 leading-snug">{s.title}</h3>
                <p className="text-[#685248] text-xs font-light leading-relaxed mt-auto">{s.tag}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MEETING FORM + CONTACT INFO */}
      <section id="meeting-form" className="px-6 py-20 max-w-7xl mx-auto border-t border-[#D8CEBE] scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Contact info column with interactive button blocks */}
          <Reveal className="lg:col-span-2">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">Get In Touch</span>
            <h2 className={`${fraunces.className} text-3xl font-medium tracking-tight mb-6 text-[#2C181A]`}>
              Let&apos;s find your next opportunity
            </h2>
            <p className="text-[#685248] font-light leading-relaxed mb-8">
              Book a direct online meeting below or reach out instantly via our direct channels.
            </p>

            {/* BLOCS BOUTONS CONTACT */}
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
                  <div className="w-10 h-10 rounded-xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center shrink-0 group-hover:bg-[#4A151B] group-hover:text-[#F2EDE4] transition">
                    <Mail className="w-5 h-5 text-[#4A151B] group-hover:text-[#F2EDE4]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8C6D53] uppercase tracking-wider font-semibold">Email Us</p>
                    <p className="text-[#2C181A] text-sm font-medium">Omayma@oravya.net</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C6D53] group-hover:text-[#4A151B] transition" />
              </a>

              <a href="tel:+971502392395" className="flex items-center justify-between bg-[#EBE4DA] border border-[#D8CEBE] p-4 rounded-2xl hover:border-[#4A151B] transition group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center shrink-0 group-hover:bg-[#4A151B] group-hover:text-[#F2EDE4] transition">
                    <Phone className="w-5 h-5 text-[#4A151B] group-hover:text-[#F2EDE4]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8C6D53] uppercase tracking-wider font-semibold">Direct Phone 1</p>
                    <p className="text-[#2C181A] text-sm font-medium">+971 50 239 2395</p>
                  </div>
                </div>
                <span className="text-xs bg-[#4A151B] text-[#F2EDE4] px-2.5 py-1 rounded-md font-medium">Call</span>
              </a>

              <a href="tel:+971585905281" className="flex items-center justify-between bg-[#EBE4DA] border border-[#D8CEBE] p-4 rounded-2xl hover:border-[#4A151B] transition group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center shrink-0 group-hover:bg-[#4A151B] group-hover:text-[#F2EDE4] transition">
                    <Phone className="w-5 h-5 text-[#4A151B] group-hover:text-[#F2EDE4]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8C6D53] uppercase tracking-wider font-semibold">Direct Phone 2</p>
                    <p className="text-[#2C181A] text-sm font-medium">+971 58 590 5281</p>
                  </div>
                </div>
                <span className="text-xs bg-[#4A151B] text-[#F2EDE4] px-2.5 py-1 rounded-md font-medium">Call</span>
              </a>
            </div>

            {/* Social Media Buttons */}
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/oravyarealestate" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#EBE4DA] border border-[#D8CEBE] py-3 px-4 rounded-xl hover:border-[#4A151B] hover:text-[#4A151B] transition text-[#4E3B30] text-sm font-semibold shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#EBE4DA] border border-[#D8CEBE] py-3 px-4 rounded-xl hover:border-[#4A151B] hover:text-[#4A151B] transition text-[#4E3B30] text-sm font-semibold shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
            </div>

            <div className="mt-8 h-36 rounded-2xl bg-[#EBE4DA] border border-[#D8CEBE] flex items-center justify-center shadow-sm">
              <span className="text-xs tracking-wider uppercase text-[#8C6D53]">[ Dubai Office Map ]</span>
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal delay={100} className="lg:col-span-3">
            <div className="bg-[#EBE4DA]/90 border border-[#D8CEBE] rounded-2xl p-6 md:p-8 shadow-sm">
              {submitted ? (
                <div className="py-16 flex flex-col items-center text-center animate-rise-in">
                  <CheckCircle2 className="w-14 h-14 text-[#4A151B] mb-6" />
                  <h3 className={`${fraunces.className} text-2xl mb-3 text-[#2C181A]`}>Request received</h3>
                  <p className="text-[#685248] font-light max-w-sm mb-8">
                    Thank you, {form.name.split(' ')[0]}. An Oravya advisor will confirm your meeting on{' '}
                    {form.date || 'your requested date'} at {form.time} shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-semibold text-[#4A151B] hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-[#2C181A]">Book an online meeting</h3>
                    <p className="text-[#8C6D53] text-sm font-light">Tell us what you&apos;re looking for — we&apos;ll take it from there.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B] placeholder:text-[#A8989A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="+971 5X XXX XXXX"
                        className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B] placeholder:text-[#A8989A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="jane@email.com"
                      className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B] placeholder:text-[#A8989A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">I&apos;m interested in</label>
                    <select
                      value={form.service}
                      onChange={(e) => update('service', e.target.value)}
                      className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.title} value={s.title} className="bg-[#F2EDE4]">{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Preferred Date</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => update('date', e.target.value)}
                        className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Preferred Time</label>
                      <select
                        value={form.time}
                        onChange={(e) => update('time', e.target.value)}
                        className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t} className="bg-[#F2EDE4]">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-2 block">Message (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      rows={4}
                      placeholder="A few words about what you're looking for..."
                      className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-lg px-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B] placeholder:text-[#A8989A] resize-none"
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#4A151B] text-[#F2EDE4] font-bold px-6 py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md"
                  >
                    <Send className="w-4 h-4" /> Request meeting
                  </button>
                </form>
              )}
            </div>
          </Reveal>
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

      <style jsx global>{`
        @keyframes rise-in {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-rise-in { animation: rise-in 0.8s ease-out both; }

        @keyframes glow-a {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, 20px) scale(1.08); }
        }
        @keyframes glow-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-16px, -14px) scale(1.05); }
        }
        .animate-glow-a { animation: glow-a 9s ease-in-out infinite; }
        .animate-glow-b { animation: glow-b 11s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-rise-in, .animate-glow-a, .animate-glow-b { animation: none; }
        }
      `}</style>
    </div>
  );
}