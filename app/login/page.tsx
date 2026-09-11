'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fraunces } from 'next/font/google';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // 1. Vérification stricte pour l'Admin
      if (identifier.trim().toLowerCase() === 'admin' && password === 'admin123') {
        const adminUser = { name: 'Admin Omayma', email: 'admin@oravya.com', role: 'ADMIN' };
        localStorage.setItem('oravya_user', JSON.stringify(adminUser));
        router.push('/admin');
        return;
      }

      // 2. Connexion normale via l'API et la base MySQL
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier.trim(), password }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Erreur serveur : la route API est introuvable ou a planté.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      // 3. Sauvegarder l'utilisateur dans le localStorage pour la session
      localStorage.setItem('oravya_user', JSON.stringify(data.user));

      // Succès : Redirection vers l'accueil
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to connect.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4] flex flex-col justify-between">
      {/* NAVBAR DE LA PAGE LOGIN */}
      <header className="border-b border-[#D8CEBE] bg-[#F2EDE4]/90 backdrop-blur-md px-6 py-4 max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-widest text-[#4A151B]">
          ORAVYA <span className="text-[#8C6D53] text-[10px] tracking-normal font-light block uppercase">Real Estate • Dubai</span>
        </Link>
        <Link href="/signup" className="text-sm font-semibold text-[#4A151B] hover:underline">
          Create an account
        </Link>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="px-6 py-12 max-w-md mx-auto w-full my-auto">
        <Reveal>
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] p-8 rounded-3xl shadow-xl backdrop-blur-xl">
            
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-2 block">Secure Authentication</span>
              <h1 className={`${fraunces.className} text-3xl text-[#2C181A]`}>Welcome back</h1>
              <p className="text-[#685248] text-sm font-light mt-1">Sign in to your Oravya account</p>
            </div>

            {/* FORMULAIRE LOGIN */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#8C6D53] font-medium mb-1.5 block">Email or Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C6D53] absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com or admin"
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
              </div>

              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A151B] text-[#F2EDE4] font-bold py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Continue'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* SÉPARATEUR */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-[#D8CEBE]" />
              <span className="px-3 text-xs text-[#8C6D53] uppercase tracking-wider font-medium">or continue with</span>
              <div className="flex-grow border-t border-[#D8CEBE]" />
            </div>

            {/* BOUTONS SOCIAUX */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => router.push('/')}
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

              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center gap-3 bg-[#F2EDE4] border border-[#D8CEBE] py-3 px-4 rounded-xl text-sm font-semibold text-[#2C181A] hover:border-[#4A151B] transition shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.31c.64-.78 1.07-1.86.95-2.94-.92.04-2.03.62-2.68 1.4-.58.68-1.09 1.78-.95 2.84 1.03.08 2.04-.51 2.68-1.3z"/>
                </svg>
                Continue with Apple
              </button>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center gap-3 bg-[#F2EDE4] border border-[#D8CEBE] py-3 px-4 rounded-xl text-sm font-semibold text-[#2C181A] hover:border-[#4A151B] transition shadow-sm"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>

          </div>
        </Reveal>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-[#8C6D53]">
        © 2026 Oravya Real Estate. Secure authentication.
      </footer>
    </div>
  );
}