'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Building2, CheckCircle2, ChevronRight, PhoneCall, Award, HelpCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function GoldenVisaServicePage() {
  const [serviceData, setServiceData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquirySent, setInquirySent] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchServiceDetail() {
      try {
        const res = await fetch('/api/services/golden-visa');
        const data = await res.json();
        if (data && !data.error) {
          setServiceData(data);
        } else {
          setServiceData(null);
        }
      } catch (err) {
        console.error('Erreur chargement service Golden Visa:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServiceDetail();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    try {
      const newInquiry = {
        id: 'golden-visa-inquiry-' + Date.now(),
        serviceSlug: 'golden-visa',
        clientName,
        clientEmail,
        clientPhone,
        clientNotes,
        createdAt: new Date().toISOString()
      };

      const existingInquiries = JSON.parse(localStorage.getItem('oravya_service_inquiries') || '[]');
      localStorage.setItem('oravya_service_inquiries', JSON.stringify([newInquiry, ...existingInquiries]));

      setInquirySent(true);
    } catch (err) {
      console.error('Erreur enregistrement consultation:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] flex flex-col items-center justify-center p-6">
        <p className="text-sm text-[#8C6D53]">Loading UAE Golden Visa data from database...</p>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] flex flex-col items-center justify-center p-6 text-center">
        <Navbar />
        <div className="mt-20">
          <Building2 className="w-12 h-12 text-[#8C6D53] mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Service data not configured in the database.</p>
          <p className="text-xs text-[#8C6D53] mb-6">Please configure the Golden Visa service entry in your database.</p>
          <Link href="/admin" className="bg-[#4A151B] text-[#F2EDE4] px-6 py-3 rounded-xl text-xs font-bold shadow-md">
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  let stats = [];
  try { stats = typeof serviceData.stats === 'string' ? JSON.parse(serviceData.stats) : serviceData.stats; } catch(e){}

  let routes = [];
  try { routes = typeof serviceData.routes === 'string' ? JSON.parse(serviceData.routes) : serviceData.routes; } catch(e){}

  let benefits = [];
  try { benefits = typeof serviceData.benefits === 'string' ? JSON.parse(serviceData.benefits) : serviceData.benefits; } catch(e){}

  let steps = [];
  try { steps = typeof serviceData.steps === 'string' ? JSON.parse(serviceData.steps) : serviceData.steps; } catch(e){}

  let rules = [];
  try { rules = typeof serviceData.rules === 'string' ? JSON.parse(serviceData.rules) : serviceData.rules; } catch(e){}

  let faqs = [];
  try { faqs = typeof serviceData.faqs === 'string' ? JSON.parse(serviceData.faqs) : serviceData.faqs; } catch(e){}

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#4A1F23] text-[#F5E1C7] py-28 px-6 border-b border-[#E7B6A5]/20 pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1F23]/95 via-[#4A1F23]/85 to-[#4A1F23]/75" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#E7B6A5] mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <Link href="/services" className="hover:underline">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white">UAE Golden Visa</span>
          </div>

          <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-3 block">Residency &amp; Wealth Advisory</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-serif">
            {serviceData.title}
          </h1>
          <p className="text-[#F5E1C7]/90 font-light max-w-3xl text-sm md:text-base leading-relaxed">
            {serviceData.subtitle}
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-[#E7B6A5]/60 rounded-3xl p-6 shadow-xl">
          {stats.map((st: any, idx: number) => (
            <div key={idx} className="text-center p-3 border-r last:border-r-0 border-[#E7B6A5]/30">
              <span className="text-2xl md:text-3xl font-bold font-serif text-[#4A1F23] block mb-1">{st.value}</span>
              <span className="text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold">{st.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTENU PRINCIPAL & FORMULAIRE */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* CONTENU TYPE ARTICLE FLUIDE */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview */}
            <div className="space-y-6 text-[#685248] font-light leading-relaxed text-sm md:text-base">
              <h2 className="text-2xl text-[#4A1F23] font-serif">Secure Your Long-Term Presence in Dubai</h2>
              <p>
                {serviceData.description}
              </p>
              <p>
                Property is the most direct route to it. One home worth AED 2,000,000 or several that add up to it will qualify, and the rules below cover the cases people actually arrive with — an off-plan unit part-paid, a mortgage still running, or a property held jointly with a spouse.
              </p>
            </div>

            {/* BANDE BURGUNDY POUR METTRE EN VALEUR LA SÉCURITÉ */}
            <div className="p-8 bg-[#4A1F23] text-[#F5E1C7] rounded-2xl shadow-md border-l-4 border-[#C5A880]">
              <span className="text-[10px] uppercase tracking-widest text-[#E7B6A5] font-bold block mb-2">Direct Advisory Note</span>
              <p className="text-sm md:text-base font-serif italic leading-relaxed text-[#F5E1C7]">
                &ldquo;No local sponsor, 100% business ownership, and extended absence permitted — the UAE Golden Visa protects your lifestyle and investments under rigorous federal law.&rdquo;
              </p>
            </div>

            {/* Routes to residency */}
            <div className="space-y-6">
              <h3 className="text-2xl text-[#4A1F23] font-serif">Three Routes to Residency</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {routes.map((rt: any, idx: number) => (
                  <div key={idx} className="bg-white border border-[#E7B6A5]/50 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <span className="inline-block bg-[#8E3A47] text-[#F5E1C7] text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                        {rt.badge}
                      </span>
                      <h4 className="text-xl font-bold font-serif text-[#4A1F23] mb-1">{rt.title}</h4>
                      <p className="text-xs text-[#8C6D53] font-semibold mb-4">{rt.duration} — {rt.condition}</p>
                      
                      <ul className="space-y-2 border-t border-[#E7B6A5]/30 pt-4">
                        {rt.details?.map((det: string, dIdx: number) => (
                          <li key={dIdx} className="text-xs text-[#685248] flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#8E3A47] shrink-0 mt-0.5" />
                            <span>{det}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What it changes */}
            <div className="space-y-6">
              <h3 className="text-2xl text-[#4A1F23] font-serif">What It Changes for Investors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((ben: any, idx: number) => (
                  <div key={idx} className="bg-white border border-[#E7B6A5]/50 p-6 rounded-2xl shadow-sm">
                    <h4 className="text-base font-bold text-[#4A1F23] font-serif mb-2">{ben.title}</h4>
                    <p className="text-xs text-[#685248] leading-relaxed">{ben.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Three steps */}
            <div className="space-y-6">
              <h3 className="text-2xl text-[#4A1F23] font-serif">Three Steps from Title Deed to Visa</h3>
              <div className="space-y-4">
                {steps.map((st: any, idx: number) => (
                  <div key={idx} className="bg-white border border-[#E7B6A5]/50 p-6 rounded-2xl shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#8E3A47] text-[#F5E1C7] font-bold font-serif text-base flex items-center justify-center shrink-0">
                      {st.step}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#4A1F23] font-serif mb-1">{st.title}</h4>
                      <p className="text-xs text-[#685248] leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The rules that decide it */}
            <div className="space-y-6">
              <h3 className="text-2xl text-[#4A1F23] font-serif">The Rules That Decide It</h3>
              <div className="space-y-4">
                {rules.map((rule: any, idx: number) => (
                  <div key={idx} className="p-6 bg-[#F2EDE4]/60 border border-[#E7B6A5]/40 rounded-2xl space-y-1">
                    <h4 className="text-sm font-bold text-[#4A1F23] font-serif">{rule.title}</h4>
                    <p className="text-xs text-[#685248] leading-relaxed">{rule.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ SECTION */}
            <div className="space-y-6 pt-6 border-t border-[#E7B6A5]/30">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-[#8E3A47]" />
                <h3 className="text-2xl text-[#4A1F23] font-serif">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-4">
                {faqs.map((faq: any, idx: number) => (
                  <div key={idx} className="bg-white border border-[#E7B6A5]/50 rounded-2xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-5 text-left flex justify-between items-center font-bold text-xs md:text-sm text-[#4A1F23]"
                    >
                      <span>{faq.q}</span>
                      <span className="text-[#8E3A47] text-lg font-bold">{openFaq === idx ? '−' : '+'}</span>
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 text-xs text-[#685248] leading-relaxed border-t border-[#E7B6A5]/20 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* FORMULAIRE STICKY */}
          <div className="bg-white border border-[#E7B6A5]/60 p-8 rounded-3xl shadow-xl sticky top-28">
            {inquirySent ? (
              <div className="py-8 text-center animate-in fade-in">
                <ShieldCheck className="w-14 h-14 text-[#8E3A47] mx-auto mb-4" />
                <h3 className="text-2xl text-[#4A1F23] mb-2 font-serif">Consultation Requested</h3>
                <p className="text-xs text-[#8C6D53] font-light mb-6 leading-relaxed">
                  Thank you {clientName}. Our Golden Visa advisory team will review your property documentation and contact you promptly.
                </p>
                <button
                  onClick={() => setInquirySent(false)}
                  className="bg-[#8E3A47] text-[#F5E1C7] text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#6B2B2E] transition shadow-md"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <h3 className="text-xl text-[#4A1F23] mb-1 font-serif">Check Your Eligibility</h3>
                <p className="text-xs text-[#8C6D53] mb-6">
                  Speak directly with our legal and conveyancing specialists regarding your UAE residency.
                </p>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Ex: Alexander Vance"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl px-4 py-3 text-xs text-[#2C181A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="alexander@investor.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl px-4 py-3 text-xs text-[#2C181A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+971 50 000 0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl px-4 py-3 text-xs text-[#2C181A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Property Status &amp; Value</label>
                  <textarea
                    rows={3}
                    placeholder="Ready or off-plan, estimated property value..."
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl p-3 text-xs text-[#2C181A] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-[#6B2B2E] transition shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  <PhoneCall className="w-4 h-4 text-[#F5E1C7]" />
                  <span>Request Visa Consultation</span>
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-[#E7B6A5]/30 flex items-center gap-3 text-xs text-[#8C6D53]">
              <ShieldCheck className="w-5 h-5 text-[#8E3A47] shrink-0" />
              <span>Direct DLD coordination and 30-day streamlined processing.</span>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8C6D53] border-t border-[#E7B6A5]/30">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/services" className="hover:text-[#4A1F23] transition">Services</Link>
          <Link href="/properties" className="hover:text-[#4A1F23] transition">Properties</Link>
          <Link href="/contact" className="hover:text-[#4A1F23] transition">Contact</Link>
        </div>
      </footer>
    </div>
  );
}