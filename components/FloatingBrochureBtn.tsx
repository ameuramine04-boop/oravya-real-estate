'use client';

import { useState } from 'react';
import { Download, X, Send, CheckCircle2 } from 'lucide-react';

export default function FloatingBrochureBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    // Simulation d'envoi ou appel API vers ton backend
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <>
      {/* Bouton Flottant Fixe */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#8E3A47] hover:bg-[#6B2B2E] text-[#F5E1C7] px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 border border-[#E7B6A5]/40 cursor-pointer group"
        aria-label="Download Brochure"
      >
        <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Brochure PDF</span>
      </button>

      {/* Modal / Popup de Téléchargement */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#F5E1C7] border border-[#E7B6A5] rounded-3xl p-8 shadow-2xl text-[#4A1F23]">
            
            {/* Bouton Fermer */}
            <button
              onClick={() => { setIsOpen(false); setSubmitted(false); setEmail(''); }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#E7B6A5]/40 transition text-[#4A1F23] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-semibold mb-2 block">
              Oravya Real Estate
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#4A1F23] mb-2">
              Download Dubai Portfolio
            </h3>
            <p className="text-xs text-[#6B2B2E]/80 font-light mb-6">
              Get our exclusive 2026 luxury collection, off-plan payment plans, and investment guides directly to your inbox.
            </p>

            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-[#8E3A47] mx-auto mb-3" />
                <h4 className="font-bold text-[#4A1F23] mb-1">Brochure Sent Successfully!</h4>
                <p className="text-xs text-[#6B2B2E]/80 mb-6">Check your email to download the document instantly.</p>
                <button
                  onClick={() => { setIsOpen(false); setSubmitted(false); setEmail(''); }}
                  className="w-full bg-[#8E3A47] text-[#F5E1C7] font-bold py-3 rounded-xl hover:bg-[#6B2B2E] transition text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8E3A47] font-semibold mb-1.5">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#E7B6A5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8E3A47] text-[#4A1F23]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#8E3A47] hover:bg-[#6B2B2E] text-[#F5E1C7] font-bold py-3.5 rounded-xl transition shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : 'Get Brochure Now'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}