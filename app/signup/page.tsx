'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import Reveal from '@/components/Reveal';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation des critères du mot de passe
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialOrNumber = /[0-9@$!%*?&]/.test(password);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('Please fill in all personal and account details.');
      return;
    }
    if (!hasMinLength || !hasUpperCase || !hasSpecialOrNumber) {
      setError('Password does not meet the security criteria.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de l’inscription.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] flex flex-col justify-between">
      {/* NAVBAR SIMPLE */}
      <header className="border-b border-[#D8CEBE] bg-[#F2EDE4]/90 backdrop-blur-md px-6 py-4 max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-widest text-[#4A151B]">
          ORAVYA <span className="text-[#8C6D53] text-[10px] tracking-normal font-light block uppercase">Real Estate • Dubai</span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-[#4A151B] hover:underline">
          Already have an account? Log In
        </Link>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="px-6 py-12 max-w-lg mx-auto w-full my-auto">
        <Reveal>
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-8 md:p-10 rounded-3xl shadow-xl backdrop-blur-xl">
            
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-2 block">New Investor Account</span>
              <h1 className={`${fraunces.className} text-3xl text-[#2C181A]`}>Create your profile</h1>
              <p className="text-[#685248] text-sm font-light mt-1">Join Oravya to manage your property portfolio</p>
            </div>

            {success ? (
              <div className="py-12 flex flex-col items-center text-center">
                <CheckCircle2 className="w-16 h-16 text-[#4A151B] mb-4" />
                <h3 className={`${fraunces.className} text-2xl mb-2 text-[#2C181A]`}>Account Created Successfully</h3>
                <p className="text-[#685248] text-sm font-light mb-6">
                  Welcome aboard, {name}. Your account has been saved in MySQL. You can now sign in.
                </p>
                <Link
                  href="/login"
                  className="bg-[#4A151B] text-[#F2EDE4] font-bold px-8 py-3 rounded-xl hover:bg-[#3B1115] transition shadow-md"
                >
                  Go to Log In
                </Link>
              </div>
            ) : (
              <>
                {/* FORMULAIRE D'INSCRIPTION */}
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-1.5 block">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8C6D53] absolute left-4 top-3.5" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl pl-11 pr-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-1.5 block">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#8C6D53] absolute left-4 top-3.5" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+971 5X XXX XXXX"
                          className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl pl-11 pr-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-1.5 block">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8C6D53] absolute left-4 top-3.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl pl-11 pr-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8C6D53] absolute left-4 top-3.5" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl pl-11 pr-4 py-3 text-sm text-[#2C181A] outline-none focus:border-[#4A151B]"
                      />
                    </div>
                    {/* Indicateurs de sécurité du mot de passe */}
                    <div className="grid grid-cols-3 gap-2 mt-2 text-[11px]">
                      <span className={hasMinLength ? 'text-green-700 font-medium' : 'text-[#8C6D53]'}>✓ Min. 8 chars</span>
                      <span className={hasUpperCase ? 'text-green-700 font-medium' : 'text-[#8C6D53]'}>✓ 1 Uppercase</span>
                      <span className={hasSpecialOrNumber ? 'text-green-700 font-medium' : 'text-[#8C6D53]'}>✓ 1 Number/Symbol</span>
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#4A151B] text-[#F2EDE4] font-bold py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* SÉPARATEUR */}
                <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-[#D8CEBE]" />
                  <span className="px-3 text-xs text-[#8C6D53] uppercase tracking-wider font-medium">or sign up with</span>
                  <div className="flex-grow border-t border-[#D8CEBE]" />
                </div>

                {/* BOUTON SOCIAL GOOGLE FONCTIONNEL */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = '/api/auth/google';
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-[#F2EDE4] border border-[#D8CEBE] py-3 px-4 rounded-xl text-sm font-semibold text-[#2C181A] hover:border-[#4A151B] transition shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"/>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                      <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 15.6C3.5 19.4 7.4 23 12 23z"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </>
            )}

          </div>
        </Reveal>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-[#8C6D53]">
        © 2026 Oravya Real Estate. Secure registration.
      </footer>
    </div>
  );
}