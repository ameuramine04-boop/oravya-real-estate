'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Users,
  Zap,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'] });

export default function SellPage() {
  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-4 block">Sell Your Property</span>
            <h1 className={`${fraunces.className} text-5xl md:text-6xl font-medium tracking-tight mb-6 leading-tight text-[#2C181A]`}>
              List your property <br />
              <span className="italic text-[#4A151B]">with Dubai's experts</span>
            </h1>
            <p className="text-[#685248] text-lg font-light leading-relaxed mb-8 max-w-xl">
              We don't just list your property; we position it. Using actual transaction data,
              we ensure your home is priced to sell quickly and for the best possible value.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#list-now" className="bg-[#4A151B] text-[#F2EDE4] font-bold px-8 py-4 rounded-xl hover:bg-[#3B1115] transition shadow-lg flex items-center gap-2">
                List My Property <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="bg-white border border-[#D8CEBE] text-[#2C181A] font-semibold px-8 py-4 rounded-xl hover:bg-[#F2EDE4] transition shadow-sm">
                Get a Valuation
              </Link>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="relative">
              <div className="absolute -inset-4 bg-[#C5A880]/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white border border-[#D8CEBE] p-8 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#4A151B] text-white flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8C6D53] uppercase font-bold tracking-wider">Market Success</p>
                    <p className="text-xl font-bold text-[#2C181A]">94% Sold within 60 Days</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: ShieldCheck, text: 'Data-driven pricing based on actual sales' },
                    { icon: Users, text: 'Dedicated community-expert broker' },
                    { icon: Zap, text: 'Maximum visibility on top portals' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#685248]">
                      <item.icon className="w-5 h-5 text-[#C5A880]" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE PROCESS */}
      <section className="bg-[#EBE4DA] py-20 px-6 border-y border-[#D8CEBE]">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 block">How it Works</span>
              <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium text-[#2C181A]`}>Simple, Transparent, Effective</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Information', desc: 'Answer a few basic questions about your property. No account needed.' },
              { step: '02', title: 'Pricing', desc: 'We analyze actual Dubai Land Department data to find the perfect price.' },
              { step: '03', title: 'Distribution', desc: 'Your property is listed on our portal and all major global real estate sites.' },
              { step: '04', title: 'Management', desc: 'You approve all viewings and offers. We handle the bureaucracy.' },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 100}>
                <div className="relative p-8 bg-white border border-[#D8CEBE] rounded-3xl shadow-sm hover:shadow-md transition group">
                  <span className="absolute -top-4 -left-4 w-12 h-12 bg-[#4A151B] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold mb-4 mt-4 text-[#2C181A]">{item.title}</h3>
                  <p className="text-[#685248] text-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LISTING FORM */}
      <section id="list-now" className="py-20 px-6 max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium text-[#2C181A] mb-4`}>Ready to list your property?</h2>
            <p className="text-[#685248] font-light">Fill in the details and our community expert will contact you.</p>
          </div>
        </Reveal>

        <div className="bg-white border border-[#D8CEBE] p-8 md:p-12 rounded-3xl shadow-xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4A151B]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4A151B]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">Phone Number</label>
                <input type="tel" placeholder="+971 ..." className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4A151B]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">Property Location</label>
                <input type="text" placeholder="Ex: Downtown Dubai, Palm Jumeirah" className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4A151B]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8C6D53]">Intent</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-[#D8CEBE] cursor-pointer hover:bg-[#F2EDE4] transition">
                  <input type="radio" name="intent" className="accent-[#4A151B]" />
                  <span className="text-sm font-medium text-[#2C181A]">Sell my property</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border border-[#D8CEBE] cursor-pointer hover:bg-[#F2EDE4] transition">
                  <input type="radio" name="intent" className="accent-[#4A151B]" />
                  <span className="text-sm font-medium text-[#2C181A]">Rent out my property</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-slider text-[#8C6D53]">Additional Notes</label>
              <textarea rows={4} placeholder="Tell us more about your property..." className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4A151B] resize-none"></textarea>
            </div>

            <button className="w-full bg-[#4A151B] text-[#F2EDE4] font-bold py-4 rounded-xl hover:bg-[#3B1115] transition shadow-lg flex items-center justify-center gap-2">
              Submit Listing Request <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center border-t border-[#D8CEBE]">
        <Reveal>
          <h2 className={`${fraunces.className} text-3xl font-medium mb-12 text-[#2C181A]`}>Not sure where to start?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MessageCircle, label: 'Chat with us on WhatsApp', color: 'bg-green-500' },
              { icon: Phone, label: 'Request a callback', color: 'bg-blue-500' },
              { icon: Mail, label: 'Send an email enquiry', color: 'bg-gray-500' },
            ].map((item, i) => (
              <Link key={i} href="/contact" className="p-8 bg-white border border-[#D8CEBE] rounded-3xl hover:shadow-lg transition flex flex-col items-center gap-4">
                <div className={`w-12 h-12 ${item.color} text-white rounded-full flex items-center justify-center shadow-md`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-[#2C181A]">{item.label}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
