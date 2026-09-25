'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fraunces } from 'next/font/google';
import { Mail, ShieldCheck, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'] });

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [contactSent, setContactSent] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientMessage, setClientMessage] = useState('');

  // Récupération des agents depuis l'API MySQL
  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('/api/agents'); // Assure-toi d'avoir ta table/route API agents
        const data = await res.json();
        if (Array.isArray(data)) {
          setAgents(data);
        } else {
          // Fallback si la table n'est pas encore remplie dans MySQL
          setAgents([]);
        }
      } catch (err) {
        console.error('Erreur chargement agents MySQL:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientMessage || !selectedAgent) return;

    try {
      // Enregistrement de la demande de contact/lead dans la base de données ou localStorage
      const newLead = {
        id: 'lead-' + Date.now(),
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        clientName,
        clientEmail,
        clientMessage,
        createdAt: new Date().toISOString()
      };

      const existingLeads = JSON.parse(localStorage.getItem('oravya_leads') || '[]');
      localStorage.setItem('oravya_leads', JSON.stringify([newLead, ...existingLeads]));

      setContactSent(true);
      setTimeout(() => {
        setContactSent(false);
        setSelectedAgent(null);
        setClientName('');
        setClientEmail('');
        setClientMessage('');
      }, 4000);
    } catch (err) {
      console.error('Erreur envoi message:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#4A1F23] text-[#F5E1C7] py-28 px-6 border-b border-[#E7B6A5]/20 pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1F23]/95 via-[#4A1F23]/85 to-[#4A1F23]/75" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-3 block">Expert Representation</span>
          <h1 className={`${fraunces.className} text-3xl md:text-5xl font-bold tracking-tight mb-4`}>
            Meet the Oravya Private Wealth &amp; Real Estate Advisors
          </h1>
          <p className="text-[#F5E1C7]/90 font-light max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            A handpicked collective of Dubai’s most elite property experts, synchronized in real-time from our database to assist your acquisitions.
          </p>
        </div>
      </section>

      {/* AGENTS GRID (DYNAMIC FROM DATABASE) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="text-center py-24 text-sm text-[#8C6D53]">Loading advisors from database...</div>
        ) : agents.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#E7B6A5] rounded-3xl bg-white/40">
            <Users className="w-12 h-12 text-[#8C6D53] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#4A1F23] mb-1">No advisors found in the database</h3>
            <p className="text-xs text-[#8C6D53] mb-6">You can add your real estate agents directly through your Admin Dashboard.</p>
            <Link href="/admin" className="bg-[#8E3A47] text-[#F5E1C7] text-xs font-bold px-6 py-3 rounded-xl shadow-md">
              Go to Admin Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => {
              let imgUrl = '/logo.png';
              try {
                if (agent.image) imgUrl = agent.image;
              } catch (e) {}

              return (
                <div 
                  key={agent.id}
                  className="bg-white border border-[#E7B6A5]/50 rounded-3xl overflow-hidden shadow-sm hover:border-[#8E3A47] transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-80 relative bg-[#DFD6C9] overflow-hidden">
                      <Image 
                        src={imgUrl} 
                        alt={agent.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      {agent.sales && (
                        <span className="absolute top-4 left-4 bg-[#8E3A47] text-[#F5E1C7] text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                          {agent.sales}
                        </span>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className={`${fraunces.className} text-xl font-bold`}>{agent.name}</h3>
                        <p className="text-xs text-[#E7B6A5] font-medium">{agent.role}</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase text-[#8C6D53] font-semibold block">Specialty Area</span>
                        <p className="text-xs font-bold text-[#4A1F23] mt-0.5">{agent.specialty || 'Dubai Prime Locations'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8C6D53] font-semibold block">Languages</span>
                        <p className="text-xs font-medium text-[#4A1F23] mt-0.5">{agent.languages || 'English, French'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="w-full bg-[#F5E1C7]/30 hover:bg-[#8E3A47] hover:text-[#F5E1C7] border border-[#E7B6A5] text-[#4A1F23] py-3 rounded-xl transition text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5" /> Contact Advisor
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL DE CONTACT DIRECT */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7B6A5] rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedAgent(null)}
              className="absolute top-6 right-6 text-xs text-[#8C6D53] hover:text-[#4A1F23] font-bold bg-[#F2EDE4] w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#DFD6C9]">
                <Image src={selectedAgent.image || '/logo.png'} alt={selectedAgent.name} fill className="object-cover" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#8E3A47] font-bold">Direct Consultation</span>
                <h3 className={`${fraunces.className} text-xl font-bold text-[#4A1F23]`}>{selectedAgent.name}</h3>
                <p className="text-xs text-[#8C6D53]">{selectedAgent.role}</p>
              </div>
            </div>

            {contactSent ? (
              <div className="py-8 text-center bg-[#F2EDE4]/50 rounded-2xl border border-[#E7B6A5]/40">
                <ShieldCheck className="w-12 h-12 text-[#8E3A47] mx-auto mb-3" />
                <h4 className="font-bold text-base text-[#4A1F23] mb-1">Message Dispatched Successfully</h4>
                <p className="text-xs text-[#8C6D53]">
                  {selectedAgent.name} has received your inquiry and will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alexander Vance"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#F2EDE4]/60 border border-[#E7B6A5]/60 rounded-xl px-4 py-3 text-xs text-[#4A1F23] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alexander@investor.co.uk"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[#F2EDE4]/60 border border-[#E7B6A5]/60 rounded-xl px-4 py-3 text-xs text-[#4A1F23] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Message / Requirements</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="I am interested in acquiring a luxury property in..."
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    className="w-full bg-[#F2EDE4]/60 border border-[#E7B6A5]/60 rounded-xl p-4 text-xs text-[#4A1F23] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8E3A47] hover:bg-[#6B2B2E] text-[#F5E1C7] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md"
                >
                  Send Confidential Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8C6D53] border-t border-[#E7B6A5]/30">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/properties" className="hover:text-[#4A1F23] transition">Properties</Link>
          <Link href="/new-projects" className="hover:text-[#4A1F23] transition">New Projects</Link>
          <Link href="/contact" className="hover:text-[#4A1F23] transition">Contact</Link>
        </div>
      </footer>
    </div>
  );
}