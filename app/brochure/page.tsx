'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import { Building2, ShieldCheck, TrendingUp, Award, Download, ArrowLeft, Mail, Phone, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function BrochurePage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = () => {
    setDownloading(true);
    window.print(); // Ouvre la boîte de dialogue d'impression du navigateur (permet d'enregistrer en PDF proprement)
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans">
      {/* NAVBAR (Cachée à l'impression PDF) */}
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* BARRE D'ACTIONS RAPIDES */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center print:hidden">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A151B] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Oravya
        </Link>
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="bg-[#4A151B] text-[#F2EDE4] font-bold px-6 py-3 rounded-xl hover:bg-[#3B1115] transition shadow-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-[#C5A880]" />
          <span>{downloading ? 'Preparing PDF...' : 'Download / Print Brochure (PDF)'}</span>
        </button>
      </div>

      {/* CONTENEUR DE LA BROCHURE (2 PAGES STYLISÉES FORMAT MAGAZINE DE LUXE) */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-16 print:p-0 print:space-y-0">
        
        {/* ================= PAGE 1 : INTRODUCTION & CHIFFRES CLÉS ================= */}
        <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden print:shadow-none print:border-none print:rounded-none print:min-h-screen print:page-break-after-always flex flex-col justify-between">
          
          {/* En-tête de la brochure */}
          <div>
            <div className="flex justify-between items-center border-b border-[#D8CEBE] pb-6 mb-12">
              <div>
                <h2 className={`${fraunces.className} text-2xl font-bold tracking-widest text-[#4A151B]`}>ORAVYA</h2>
                <p className="text-[10px] tracking-widest text-[#8C6D53] uppercase">Exclusive Real Estate • Dubai</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold bg-[#F2EDE4] px-4 py-1.5 rounded-full border border-[#D8CEBE]">
                Investor Portfolio 2026
              </span>
            </div>

            {/* Titre Principal */}
            <div className="max-w-2xl mb-12">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">High-Yield Investment</span>
              <h1 className={`${fraunces.className} text-4xl md:text-6xl text-[#2C181A] leading-tight mb-6`}>
                Your Gateway to <span className="text-[#4A151B] italic">Dubai Luxury Assets</span>
              </h1>
              <p className="text-[#685248] text-base md:text-lg font-light leading-relaxed">
                Oravya curates the most prestigious residential and commercial properties in Dubai, offering global investors absolute security, high rental returns, and seamless remote management.
              </p>
            </div>

            {/* Statistiques clés */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
              {[
                { val: '8–12%', label: 'Net Rental Yield' },
                { val: '0%', label: 'Tax on Income & Capital' },
                { val: 'AED 5M+', label: 'Golden Visa Eligible' },
                { val: '100%', label: 'Foreign Ownership' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#F2EDE4] border border-[#D8CEBE] p-4 rounded-2xl text-center shadow-sm">
                  <p className={`${fraunces.className} text-2xl text-[#4A151B] font-bold mb-1`}>{stat.val}</p>
                  <p className="text-[#8C6D53] text-[11px] uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pied de page Page 1 */}
          <div className="border-t border-[#D8CEBE] pt-6 flex justify-between items-center text-xs text-[#8C6D53]">
            <span>Page 01 / 02</span>
            <span>www.oravya-dubai.com</span>
          </div>
        </div>


        {/* ================= PAGE 2 : ZONES PHARES & SERVICES ================= */}
        <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden print:shadow-none print:border-none print:rounded-none print:min-h-screen flex flex-col justify-between">
          
          <div>
            <div className="flex justify-between items-center border-b border-[#D8CEBE] pb-6 mb-10">
              <h3 className={`${fraunces.className} text-xl font-bold text-[#4A151B]`}>Prime Locations & Advisory Services</h3>
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">Oravya Standard</span>
            </div>

            {/* Grille des emplacements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { name: 'Downtown Dubai', desc: 'Burj Khalifa district with unmatched capital growth.' },
                { name: 'Palm Jumeirah', desc: 'World-renowned beachfront ultra-luxury villas.' },
                { name: 'Dubai Marina', desc: 'Vibrant skyscraper waterfront community.' },
              ].map((loc, i) => (
                <div key={i} className="bg-[#F2EDE4] border border-[#D8CEBE] p-6 rounded-2xl">
                  <h4 className={`${fraunces.className} text-lg font-bold text-[#2C181A] mb-2`}>{loc.name}</h4>
                  <p className="text-xs text-[#685248] font-light leading-relaxed">{loc.desc}</p>
                </div>
              ))}
            </div>

            {/* Accompagnement et services */}
            <div className="bg-[#4A151B] text-[#F2EDE4] p-8 rounded-2xl mb-8 shadow-md">
              <h4 className={`${fraunces.className} text-xl mb-3 text-[#C5A880]`}>End-to-End Remote Acquisition</h4>
              <p className="text-xs font-light leading-relaxed text-[#F2EDE4]/90 max-w-xl">
                We handle every step from virtual property walk-throughs and secure deposit transfers to title deed registration and Golden Visa sponsorship processing.
              </p>
            </div>
          </div>

          {/* Contact & Pied de page Page 2 */}
          <div className="border-t border-[#D8CEBE] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#8C6D53]">
            <div className="flex gap-6">
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#4A151B]" /> www.oravya.com</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#4A151B]" /> contact@oravya.com</span>
            </div>
            <span>Page 02 / 02</span>
          </div>

        </div>

      </main>
    </div>
  );
}