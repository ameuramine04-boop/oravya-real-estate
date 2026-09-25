'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fraunces } from 'next/font/google';
import { ShieldCheck, Building2, CheckCircle2, ChevronRight, Wrench, AlertTriangle, PhoneCall } from 'lucide-react';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'] });

export default function SnaggingServicePage() {
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
        const res = await fetch('/api/services/snagging');
        const data = await res.json();
        if (data && !data.error) {
          setServiceData(data);
        } else {
          setServiceData(null);
        }
      } catch (err) {
        console.error('Erreur chargement service Snagging depuis MySQL:', err);
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
        id: 'snagging-inquiry-' + Date.now(),
        serviceSlug: 'snagging',
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
      console.error('Erreur enregistrement inspection:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] flex flex-col items-center justify-center p-6">
        <p className="text-sm text-[#8C6D53]">Loading Snagging & Inspection data from database...</p>
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
          <p className="text-xs text-[#8C6D53] mb-6">Please configure the Snagging service entry in your database.</p>
          <Link href="/admin" className="bg-[#4A151B] text-[#F2EDE4] px-6 py-3 rounded-xl text-xs font-bold shadow-md">
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  let galleryImages = ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece'];
  try {
    if (serviceData.images) {
      const parsed = typeof serviceData.images === 'string' ? JSON.parse(serviceData.images) : serviceData.images;
      if (Array.isArray(parsed) && parsed.length > 0) galleryImages = parsed;
    }
  } catch (e) {}

  let suitableList = [];
  try {
    if (serviceData.suitable_for) {
      suitableList = typeof serviceData.suitable_for === 'string' ? JSON.parse(serviceData.suitable_for) : serviceData.suitable_for;
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1F23]/95 via-[#4A1F23]/85 to-[#4A1F23]/75" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#E7B6A5] mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <Link href="/services" className="hover:underline">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white">Snagging & Inspection</span>
          </div>

          <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-3 block">Pre-Handover Protection</span>
          <h1 className={`${fraunces.className} text-3xl md:text-5xl font-bold tracking-tight mb-4`}>
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
          
          {/* INFORMATIONS ET DESCRIPTION */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-[#E7B6A5]/50 p-8 md:p-10 rounded-3xl shadow-sm space-y-6">
              
              {/* Alerte / Avertissement important */}
              <div className="p-5 bg-[#F5E1C7]/20 border border-[#E7B6A5] rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-[#8E3A47] shrink-0 mt-0.5" />
                <div>
                  <h3 className={`${fraunces.className} text-base font-bold text-[#4A1F23] mb-1`}>Taking handover soon? Book before you sign.</h3>
                  <p className="text-xs text-[#685248] font-light leading-relaxed">
                    Once handover documents are signed and keys are received, rectifying construction defects becomes your financial responsibility. Let our engineers identify them first.
                  </p>
                </div>
              </div>

              <h2 className={`${fraunces.className} text-2xl text-[#4A1F23]`}>Why Professional Snagging Matters</h2>
              
              <p className="text-[#685248] font-light leading-relaxed text-sm md:text-base">
                Receiving the keys to your property is an exciting milestone, but hidden workmanship defects can quickly turn it into a burden. Without independent technical expertise, minor flaws in electrical systems, plumbing, finishes, or insulation can easily be overlooked before signing handover papers with the developer.
              </p>

              <p className="text-[#685248] font-light leading-relaxed text-sm md:text-base">
                {serviceData.description}
              </p>

              <div className="relative h-80 md:h-[400px] rounded-2xl overflow-hidden my-6 bg-[#DFD6C9] shadow-inner">
                <Image src={galleryImages[0]} alt="Property Inspection Dubai" fill className="object-cover" />
              </div>

              {/* Suitable for List */}
              {suitableList.length > 0 && (
                <div className="pt-2">
                  <h3 className={`${fraunces.className} text-xl text-[#4A1F23] mb-4`}>This Service is Suitable For</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suitableList.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2.5 bg-[#F2EDE4]/60 border border-[#E7B6A5]/40 p-3.5 rounded-xl text-xs font-medium text-[#2C181A]">
                        <CheckCircle2 className="w-4 h-4 text-[#8E3A47] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits List */}
              {benefitsList.length > 0 && (
                <div className="pt-4">
                  <h3 className={`${fraunces.className} text-xl text-[#4A1F23] mb-4`}>Inspection Deliverables</h3>
                  <div className="space-y-3">
                    {benefitsList.map((benefit: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 bg-[#F2EDE4]/60 border border-[#E7B6A5]/40 p-4 rounded-2xl text-xs font-medium text-[#2C181A]">
                        <Wrench className="w-4 h-4 text-[#8E3A47] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* FORMULAIRE DE RÉSERVATION DYNAMIQUE */}
          <div className="bg-white border border-[#E7B6A5]/60 p-8 rounded-3xl shadow-xl sticky top-28">
            {inquirySent ? (
              <div className="py-8 text-center animate-in fade-in">
                <ShieldCheck className="w-14 h-14 text-[#8E3A47] mx-auto mb-4" />
                <h3 className={`${fraunces.className} text-2xl text-[#4A1F23] mb-2`}>Inspection Requested</h3>
                <p className="text-xs text-[#8C6D53] font-light mb-6 leading-relaxed">
                  Thank you {clientName}. Our engineering team has received your handover details and will contact you shortly to schedule the inspection.
                </p>
                <button
                  onClick={() => setInquirySent(false)}
                  className="bg-[#8E3A47] text-[#F5E1C7] text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#6B2B2E] transition shadow-md"
                >
                  Book another inspection
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <h3 className={`${fraunces.className} text-xl text-[#4A1F23] mb-1`}>Book Pre-Handover Inspection</h3>
                <p className="text-xs text-[#8C6D53] mb-6">
                  Secure expert engineer assistance before signing.
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
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Property Details &amp; Location</label>
                  <textarea
                    rows={3}
                    placeholder="Community name, unit type, expected handover date..."
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
                  <span>Request Inspection Schedule</span>
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-[#E7B6A5]/30 flex items-center gap-3 text-xs text-[#8C6D53]">
              <ShieldCheck className="w-5 h-5 text-[#8E3A47] shrink-0" />
              <span>Independent engineer reports recognized by major Dubai developers.</span>
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