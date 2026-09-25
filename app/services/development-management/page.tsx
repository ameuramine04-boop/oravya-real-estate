'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Building2, CheckCircle2, ChevronRight, PhoneCall } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function DevelopmentManagementPage() {
  const [serviceData, setServiceData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquirySent, setInquirySent] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  useEffect(() => {
    async function fetchServiceDetail() {
      try {
        const res = await fetch('/api/services/development-management');
        const data = await res.json();
        if (data && !data.error) {
          setServiceData(data);
        } else {
          setServiceData(null);
        }
      } catch (err) {
        console.error('Erreur chargement service Development Management:', err);
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
        id: 'dev-mgmt-inquiry-' + Date.now(),
        serviceSlug: 'development-management',
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
        <p className="text-sm text-[#8C6D53]">Loading Development Management data from database...</p>
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
          <p className="text-xs text-[#8C6D53] mb-6">Please configure the Development Management service entry in your database.</p>
          <Link href="/admin" className="bg-[#4A151B] text-[#F2EDE4] px-6 py-3 rounded-xl text-xs font-bold shadow-md">
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  let galleryImages = ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'];
  try {
    if (serviceData.images) {
      const parsed = typeof serviceData.images === 'string' ? JSON.parse(serviceData.images) : serviceData.images;
      if (Array.isArray(parsed) && parsed.length > 0) galleryImages = parsed;
    }
  } catch (e) {}

  let benefitsList = [];
  try {
    if (serviceData.benefits) {
      benefitsList = typeof serviceData.benefits === 'string' ? JSON.parse(serviceData.benefits) : serviceData.benefits;
    }
  } catch (e) {}

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#4A1F23] text-[#F5E1C7] py-28 px-6 border-b border-[#E7B6A5]/20 pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1F23]/95 via-[#4A1F23]/85 to-[#4A1F23]/75" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#E7B6A5] mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <Link href="/services" className="hover:underline">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white">Development Management</span>
          </div>

          <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-3 block">Institutional Investment</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-serif">
            {serviceData.title}
          </h1>
          <p className="text-[#F5E1C7]/90 font-light max-w-3xl text-sm md:text-base leading-relaxed">
            {serviceData.subtitle}
          </p>
        </div>
      </section>

      {/* CONTENU PRINCIPAL & FORMULAIRE */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* CONTENU FLUIDE TYPE ARTICLE AVEC BANDE BURGUNDY */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="space-y-6 text-[#685248] font-light leading-relaxed text-sm md:text-base">
              
              <h2 className="text-2xl text-[#4A1F23] font-serif">Why We Built Development Management</h2>
              
              <p>
                Oravya Development Management Services was founded on the principle that the most successful ventures solve the most persistent challenges for clients. True industry competition is about creating superior value. We recognized that the key to enabling investors to capture real estate profit margins from inception lies at the development level — opportunities historically restricted strictly to developers. We have engineered seamless access to bridge this gap for our investors.
              </p>

              <div className="relative h-72 md:h-[380px] rounded-2xl overflow-hidden my-6 shadow-sm bg-[#DFD6C9]">
                <Image src={galleryImages[0]} alt="Development Management Dubai" fill className="object-cover" />
              </div>

              <p>
                {serviceData.description}
              </p>

              {/* BANDE BURGUNDY POUR METTRE EN VALEUR UN PARAGRAPHE CLÉ */}
              {serviceData.vision && (
                <div className="my-8 p-8 bg-[#4A1F23] text-[#F5E1C7] rounded-2xl shadow-md border-l-4 border-[#C5A880]">
                  <span className="text-[10px] uppercase tracking-widest text-[#E7B6A5] font-bold block mb-2">Our Vision</span>
                  <p className="text-sm md:text-base font-serif italic leading-relaxed text-[#F5E1C7]">
                    &ldquo;{serviceData.vision}&rdquo;
                  </p>
                </div>
              )}

              <h3 className="text-xl text-[#4A1F23] font-serif pt-4 mb-3">Core Pillars &amp; Strategic Advantages</h3>

              {benefitsList.length > 0 && (
                <div className="space-y-3">
                  {benefitsList.map((benefit: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 py-2 border-b border-[#E7B6A5]/30">
                      <CheckCircle2 className="w-4 h-4 text-[#8E3A47] shrink-0 mt-1" />
                      <span className="text-xs md:text-sm text-[#2C181A] font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

          {/* FORMULAIRE STICKY */}
          <div className="bg-white border border-[#E7B6A5]/60 p-8 rounded-3xl shadow-xl sticky top-28">
            {inquirySent ? (
              <div className="py-8 text-center animate-in fade-in">
                <ShieldCheck className="w-14 h-14 text-[#8E3A47] mx-auto mb-4" />
                <h3 className="text-2xl text-[#4A1F23] mb-2 font-serif">Consultation Requested</h3>
                <p className="text-xs text-[#8C6D53] font-light mb-6 leading-relaxed">
                  Thank you {clientName}. Our financial modeling and development team will walk you through the feasibility, model, and margin on our live opportunities.
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
                <h3 className="text-xl text-[#4A1F23] mb-1 font-serif">Want to see the numbers on a development?</h3>
                <p className="text-xs text-[#8C6D53] mb-6">
                  We will walk you through the feasibility, the model and the margin on a live opportunity.
                </p>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Ex: Victoria Sterling"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="w-full bg-[#F2EDE4]/50 border border-[#E7B6A5]/60 rounded-xl px-4 py-3 text-xs text-[#2C181A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Corporate Email</label>
                  <input
                    type="email"
                    placeholder="victoria@investor.com"
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
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Investment Scope</label>
                  <textarea
                    rows={3}
                    placeholder="Indicate your capital allocation target or questions..."
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
                  <span>Request Feasibility Review</span>
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-[#E7B6A5]/30 flex items-center gap-3 text-xs text-[#8C6D53]">
              <ShieldCheck className="w-5 h-5 text-[#8E3A47] shrink-0" />
              <span>Confidential financial modeling and margin walkthroughs for qualified investors.</span>
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