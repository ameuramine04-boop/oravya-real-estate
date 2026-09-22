'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Mail,
  HelpCircle,
  User,
  Heart,
  ShoppingBag,
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
  ShieldAlert,
  Info,
  Star,
  Briefcase,
  Sparkles,
  KeyRound,
  MapPin,
} from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem('oravya_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur de lecture du profil utilisateur", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('oravya_user');
    setUser(null);
    setDropdownOpen(false);
    window.location.href = '/';
  };

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-[#D8CEBE] bg-[#F2EDE4]/90 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-widest text-[#4A151B]">ORAVYA</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#D8CEBE] bg-[#F2EDE4]/90 backdrop-blur-md px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">

        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-[#D8CEBE] bg-[#F2EDE4] flex items-center justify-center shadow-sm">
            <Image
              src="/logo.png"
              alt="Oravya Logo"
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
              priority
            />
          </div>
          <div>
            <span className="text-xl font-bold tracking-widest text-[#4A151B] block leading-tight">ORAVYA</span>
            <span className="text-[#8C6D53] text-[10px] tracking-widest font-light block uppercase leading-tight">Real Estate • Dubai</span>
          </div>
        </Link>

        {/* NAVIGATION LINKS WITH FLUID HOVER EFFECTS (LIKE BUY) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2C181A]">
          <Link href="/" className="flex items-center gap-1.5 hover:text-[#4A151B] transition py-1 group">
            <Home className="w-4 h-4 text-[#8C6D53] group-hover:text-[#4A151B] transition" />
            <span className="relative">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A151B] transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>

          {/* BUY MEGA MENU */}
          <div className="relative group py-1">
            <Link href="/buy" className="flex items-center gap-1.5 hover:text-[#4A151B] transition group cursor-pointer">
              <Home className="w-4 h-4 text-[#8C6D53] group-hover:text-[#4A151B] transition" />
              <span className="relative">
                Buy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A151B] transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
            <div className="absolute top-full left-0 w-64 bg-white border border-[#D8CEBE] rounded-2xl shadow-xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] mb-2">Property Types</div>
              <Link href="/buy/apartments" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Apartments in Dubai</Link>
              <Link href="/buy/villas" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Villas in Dubai</Link>
              <Link href="/buy/townhouses" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Townhouses in Dubai</Link>
              <Link href="/buy/plots" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Plots in Dubai</Link>
              <Link href="/buy/offices" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Offices in Dubai</Link>
              <Link href="/buy/shops" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Shops in Dubai</Link>
              <Link href="/buy/commercial" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Commercial plots in Dubai</Link>
            </div>
          </div>

          <Link href="/new-projects" className="flex items-center gap-1.5 hover:text-[#4A151B] transition py-1 group">
            <Sparkles className="w-4 h-4 text-[#8C6D53] group-hover:text-[#4A151B] transition" />
            <span className="relative">
              New Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A151B] transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
          <Link href="/rent" className="flex items-center gap-1.5 hover:text-[#4A151B] transition py-1 group">
            <KeyRound className="w-4 h-4 text-[#8C6D53] group-hover:text-[#4A151B] transition" />
            <span className="relative">
              Rent
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A151B] transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
          <Link href="/sell" className="flex items-center gap-1.5 hover:text-[#4A151B] transition py-1 group">
            <Briefcase className="w-4 h-4 text-[#8C6D53] group-hover:text-[#4A151B] transition" />
            <span className="relative">
              Sell
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A151B] transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>

          {/* EXPLORE MEGA MENU */}
          <div className="relative group py-1">
            <Link href="/explore" className="flex items-center gap-1.5 hover:text-[#4A151B] transition group cursor-pointer">
              <MapPin className="w-4 h-4 text-[#8C6D53] group-hover:text-[#4A151B] transition" />
              <span className="relative">
                Explore
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A151B] transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
            <div className="absolute top-full left-0 w-56 bg-white border border-[#D8CEBE] rounded-2xl shadow-xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] mb-2">Knowledge Hub</div>
              <Link href="/explore/developers" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Top Developers</Link>
              <Link href="/explore/guides" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Investment Guides</Link>
              <Link href="/explore/trends" className="block px-5 py-2.5 hover:bg-[#F2EDE4] text-[#2C181A] hover:text-[#4A151B] transition text-xs">Market Trends</Link>
            </div>
          </div>

          <Link href="/contact" className="flex items-center gap-1.5 hover:text-[#4A151B] transition py-1 group">
            <Mail className="w-4 h-4 text-[#8C6D53] group-hover:text-[#4A151B] transition" />
            <span className="relative">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A151B] transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
          <Link href="/about" className="flex items-center gap-1.5 hover:text-[#4A151B] transition py-1 group">
            <Info className="w-4 h-4 text-[#8C6D53] group-hover:text-[#4A151B] transition" />
            <span className="relative">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A151B] transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-[#EBE4DA] border border-[#D8CEBE] px-3.5 py-2 rounded-2xl text-sm font-semibold text-[#2C181A] hover:border-[#4A151B] transition shadow-sm group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#4A151B] text-[#F2EDE4] flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#2C181A] leading-tight truncate max-w-[100px]">{user.name}</p>
                  <p className="text-[10px] font-light text-[#8C6D53] leading-tight">
                    {user.role === 'ADMIN' ? 'Administrator' : 'Investor'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#8C6D53] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl shadow-2xl py-3 text-sm text-[#2C181A] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-5 py-3 border-b border-[#D8CEBE] mb-1">
                    <p className="text-[11px] uppercase tracking-wider text-[#C5A880] font-bold">Signed in as</p>
                    <p className="font-semibold text-xs text-[#4A151B] truncate mt-0.5">{user.email}</p>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#4A151B] hover:text-[#F2EDE4] transition text-[#4A151B] font-medium mx-2 rounded-xl"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShieldAlert className="w-4 h-4 text-[#C5A880]" /> Admin Dashboard
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#D8CEBE]/60 transition text-[#2C181A] mx-2 rounded-xl"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-[#8C6D53]" /> My Profile
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#D8CEBE]/60 transition text-[#2C181A] mx-2 rounded-xl"
                    onClick={() => setDropdownOpen(false)}
                    >
                    <ShoppingBag className="w-4 h-4 text-[#8C6D53]" /> My Orders & Meetings
                  </Link>

                  <Link
                    href="/favorites"
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#D8CEBE]/60 transition text-[#2C181A] mx-2 rounded-xl"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Heart className="w-4 h-4 text-[#8C6D53]" /> My Favorites
                  </Link>

                  <div className="border-t border-[#D8CEBE] my-2 mx-3" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-red-500/10 text-red-700 transition font-medium text-left mx-2 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="flex items-center gap-2 bg-[#EBE4DA] border border-[#D8CEBE] text-[#2C181A] text-sm font-semibold px-4 py-2.5 rounded-xl hover:border-[#4A151B] transition shadow-sm"
              >
                <LogIn className="w-4 h-4 text-[#8C6D53]" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 bg-[#4A151B] text-[#F2EDE4] text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#3B1115] transition shadow-md"
              >
                <UserPlus className="w-4 h-4 text-[#C5A880]" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}