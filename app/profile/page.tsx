'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import { User, Mail, Phone, MapPin, Shield, Save, CheckCircle2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('oravya_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
      setPhone(parsed.phone || '+971 50 123 4567');
      setCountry(parsed.country || 'United Arab Emirates');
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = { ...user, name, email, phone, country };
    localStorage.setItem('oravya_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Lien de retour */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6D53] hover:text-[#4A151B] transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className={`${fraunces.className} text-3xl md:text-4xl text-[#2C181A] mt-2`}>Investor Profile</h1>
          <p className="text-[#685248] text-sm font-light">Manage your personal credentials and preferences.</p>
        </div>

        {saved && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Your profile details have been successfully updated.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CARTE DE RÉSUMÉ DU PROFIL */}
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-8 rounded-3xl shadow-sm text-center flex flex-col items-center justify-between h-fit">
            <div>
              <div className="w-20 h-20 bg-[#4A151B] text-[#F2EDE4] rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md mb-4 mx-auto">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="font-bold text-lg text-[#2C181A]">{name || 'Valued Investor'}</h2>
              <p className="text-xs text-[#8C6D53] truncate max-w-[200px] mt-1">{email}</p>
              
              <div className="mt-6 inline-flex items-center gap-1.5 bg-[#F2EDE4] border border-[#D8CEBE] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#4A151B]">
                <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{user.role === 'ADMIN' ? 'Administrator' : 'Verified Investor'}</span>
              </div>
            </div>

            <div className="w-full mt-8 pt-6 border-t border-[#D8CEBE] text-left space-y-2 text-xs text-[#685248]">
              <p className="flex justify-between"><span>Account Status:</span> <span className="font-semibold text-emerald-700">Active</span></p>
              <p className="flex justify-between"><span>Member Since:</span> <span className="font-semibold text-[#2C181A]">2026</span></p>
            </div>
          </div>

          {/* FORMULAIRE DE MISE À JOUR */}
          <div className="md:col-span-2 bg-[#EBE4DA] border border-[#D8CEBE] p-8 rounded-3xl shadow-sm">
            <h3 className={`${fraunces.className} text-xl text-[#2C181A] mb-6`}>Personal Information</h3>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-2">Full Name</label>
                <div className="flex items-center gap-3 bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE] focus-within:border-[#4A151B] transition">
                  <User className="w-4 h-4 text-[#8C6D53]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-transparent w-full text-sm text-[#2C181A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-2">Email Address</label>
                <div className="flex items-center gap-3 bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE] focus-within:border-[#4A151B] transition">
                  <Mail className="w-4 h-4 text-[#8C6D53]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-transparent w-full text-sm text-[#2C181A] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-2">Phone Number</label>
                  <div className="flex items-center gap-3 bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE] focus-within:border-[#4A151B] transition">
                    <Phone className="w-4 h-4 text-[#8C6D53]" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-transparent w-full text-sm text-[#2C181A] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-2">Country of Residence</label>
                  <div className="flex items-center gap-3 bg-[#F2EDE4] px-4 py-3 rounded-xl border border-[#D8CEBE] focus-within:border-[#4A151B] transition">
                    <MapPin className="w-4 h-4 text-[#8C6D53]" />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="bg-transparent w-full text-sm text-[#2C181A] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#4A151B] text-[#F2EDE4] font-bold px-7 py-3 rounded-xl hover:bg-[#3B1115] transition shadow-md flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4 text-[#C5A880]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}