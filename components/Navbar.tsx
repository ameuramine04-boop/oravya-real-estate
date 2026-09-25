'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  Heart,
  ShoppingBag,
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
  ShieldAlert,
  Sparkles,
  KeyRound,
  MapPin,
  Star,
  Briefcase,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const favoritesCount = 2; // À relier à ton état global/localStorage

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
      <header className="sticky top-0 z-50 border-b border-[#D8CEBE] bg-[#F2EDE4]/90 backdrop-blur-md px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-widest text-[#4A151B]">ORAVYA</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header 
      className={`${
        isHome 
          ? 'absolute top-0 left-0 w-full z-50 bg-transparent border-b border-white/10' 
          : 'sticky top-0 z-50 border-b border-[#D8CEBE] bg-[#F2EDE4]/90 backdrop-blur-md shadow-sm'
      } px-6 md:px-10 py-4 transition-all`}
    >
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">

        {/* ================= LOGO ================= */}
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="relative w-11 h-11 overflow-hidden rounded-xl border border-[#D8CEBE]/80 bg-[#F2EDE4] flex items-center justify-center shadow-md group-hover:scale-105 transition duration-300">
            <Image
              src="/logo.png"
              alt="Oravya Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className={`text-xl font-bold tracking-widest block leading-tight ${isHome ? 'text-white drop-shadow-md' : 'text-[#4A151B]'}`}>ORAVYA</span>
            <span className={`text-[10px] tracking-widest font-light block uppercase leading-tight ${isHome ? 'text-[#E7B6A5]' : 'text-[#8C6D53]'}`}>Real Estate • Dubai</span>
          </div>
        </Link>

        {/* ================= NAVIGATION LINKS & HORIZONTAL MEGA MENUS ================= */}
        <nav className={`hidden xl:flex items-center gap-7 text-xs uppercase tracking-wider font-semibold ${isHome ? 'text-white' : 'text-[#2C181A]'}`}>
          
          <Link href="/new-projects" className="hover:text-[#C5A880] transition py-1 relative group whitespace-nowrap">
            New Projects
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isHome ? 'bg-white' : 'bg-[#4A151B]'}`} />
          </Link>

          {/* BUY MEGA MENU */}
          <div className="relative group py-1">
            <Link href="/properties?status=Buy" className="hover:text-[#C5A880] transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
              Buy <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="absolute top-full left-0 w-[500px] bg-white border border-[#D8CEBE] rounded-2xl shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 text-[#2C181A] normal-case grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">Property Types</div>
                <Link href="/properties?status=Buy&type=Apartment" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Apartments in Dubai</Link>
                <Link href="/properties?status=Buy&type=Villa" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Villas in Dubai</Link>
                <Link href="/properties?status=Buy&type=Townhouse" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Townhouses in Dubai</Link>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">Commercial & Land</div>
                <Link href="/properties?status=Buy&type=Plot" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Plots in Dubai</Link>
                <Link href="/properties?status=Buy&type=Office" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Offices in Dubai</Link>
                <Link href="/properties?status=Buy&type=Shop" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Shops in Dubai</Link>
                <Link href="/properties?status=Buy&type=Commercial" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Commercial plots</Link>
              </div>
            </div>
          </div>

          {/* RENT MEGA MENU */}
          <div className="relative group py-1">
            <Link href="/properties?status=Rent" className="hover:text-[#C5A880] transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
              Rent <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="absolute top-full left-0 w-[350px] bg-white border border-[#D8CEBE] rounded-2xl shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 text-[#2C181A] normal-case">
              <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">Rental Categories</div>
              <Link href="/properties?status=Rent&type=Apartment" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Apartments in Dubai</Link>
              <Link href="/properties?status=Rent&type=Villa" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Villas in Dubai</Link>
              <Link href="/properties?status=Rent&type=Townhouse" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Townhouses in Dubai</Link>
              <Link href="/properties?status=Rent" className="block py-1.5 hover:text-[#4A151B] transition text-xs font-semibold text-[#4A151B]">Properties for rent</Link>
              <Link href="/properties?status=Rent&type=Office" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Offices in Dubai</Link>
              <Link href="/properties?status=Rent&type=Shop" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Shops in Dubai</Link>
            </div>
          </div>

          {/* LUXE MEGA MENU */}
          <div className="relative group py-1">
            <Link href="/properties?type=Luxury" className="hover:text-[#C5A880] transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
              Luxe <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="absolute top-full left-0 w-[300px] bg-white border border-[#D8CEBE] rounded-2xl shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 text-[#2C181A] normal-case">
              <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">Prestige Collections</div>
              <Link href="/properties?collection=luxury-projects" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Luxury projects</Link>
              <Link href="/properties?collection=ultra-luxury" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Ultra luxury projects</Link>
              <Link href="/properties?collection=branded-residences" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Dubai Branded Residences</Link>
            </div>
          </div>

          <Link href="/sell" className="hover:text-[#C5A880] transition py-1 relative group whitespace-nowrap">
            Sell
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isHome ? 'bg-white' : 'bg-[#4A151B]'}`} />
          </Link>

          <Link href="/agents" className="hover:text-[#C5A880] transition py-1 relative group whitespace-nowrap">
            Agents
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isHome ? 'bg-white' : 'bg-[#4A151B]'}`} />
          </Link>

          {/* SERVICES MEGA MENU */}
          <div className="relative group py-1">
            <Link href="/services" className="hover:text-[#C5A880] transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
              Services <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="absolute top-full left-0 w-[450px] bg-white border border-[#D8CEBE] rounded-2xl shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 text-[#2C181A] normal-case grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">Management</div>
                <Link href="/services" className="block py-1.5 hover:text-[#4A151B] transition text-xs font-semibold text-[#4A151B]">View all</Link>
                <Link href="/services/property-management" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Property Management</Link>
                <Link href="/services/snagging" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Snagging & Handover</Link>
                <Link href="/services/master-agency" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Oravya Master Agency</Link>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">Lifestyle & Visa</div>
                <Link href="/services/development-management" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Oravya Development Management</Link>
                <Link href="/services/interiors" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Oravya Interiors</Link>
                <Link href="/services/golden-visa" className="block py-1.5 hover:text-[#4A151B] transition text-xs">UAE Golden Visa</Link>
                <Link href="/services" className="block py-1.5 hover:text-[#4A151B] transition text-xs font-semibold text-[#C5A880]">All Services</Link>
              </div>
            </div>
          </div>

          <Link href="/trends" className="hover:text-[#C5A880] transition py-1 relative group whitespace-nowrap">
            Trends
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isHome ? 'bg-white' : 'bg-[#4A1F23]'}`} />
          </Link>

          {/* EXPLORE MEGA MENU */}
          <div className="relative group py-1">
            <Link href="/explore" className="hover:text-[#C5A880] transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
              Explore <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="absolute top-full left-0 w-[260px] bg-white border border-[#D8CEBE] rounded-2xl shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 text-[#2C181A] normal-case">
              <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">Discover Dubai</div>
              <Link href="/explore/areas" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Areas</Link>
              <Link href="/explore/developers" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Developers</Link>
            </div>
          </div>

          {/* MORE MEGA MENU */}
          <div className="relative group py-1">
            <Link href="/more" className="hover:text-[#C5A880] transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
              More <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="absolute top-full right-0 w-[650px] bg-white border border-[#D8CEBE] rounded-2xl shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 text-[#2C181A] normal-case grid grid-cols-3 gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">Projects & Off-plan</div>
                <Link href="/new-homes" className="block py-1.5 hover:text-[#4A151B] transition text-xs">New homes</Link>
                <Link href="/properties?status=Off-Plan" className="block py-1.5 hover:text-[#4A151B] transition text-xs">New projects in Dubai</Link>
                <Link href="/map" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Off-plan properties map</Link>
                <Link href="/properties?status=Off-Plan&type=Apartment" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Buy off-plan apartments</Link>
                <Link href="/properties?status=Off-Plan&type=Villa" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Buy off-plan villas</Link>
                <Link href="/properties?status=Off-Plan&type=Townhouse" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Buy off-plan townhouses</Link>
                <Link href="/properties?paymentPlan=true" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Properties with payment plan</Link>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">About & Resources</div>
                <Link href="/about" className="block py-1.5 hover:text-[#4A151B] transition text-xs">About us</Link>
                <Link href="/contact" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Contact us</Link>
                <Link href="/careers" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Careers</Link>
                <Link href="/news" className="block py-1.5 hover:text-[#4A151B] transition text-xs">News</Link>
                <Link href="/guides" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Guides</Link>
                <Link href="/rental-increase" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Property rental increase</Link>
                <Link href="/commercial" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Commercial Properties</Link>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold border-b border-[#F2EDE4] pb-2 mb-2">More Links</div>
                <Link href="/faqs" className="block py-1.5 hover:text-[#4A151B] transition text-xs">FAQs</Link>
                <Link href="/why-invest-dubai" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Why Invest in Dubai?</Link>
                <Link href="/partners" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Our Partners</Link>
                <Link href="/valuation" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Quick links & Valuation</Link>
                <Link href="/open-houses" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Open houses Dubai</Link>
                <Link href="/videos" className="block py-1.5 hover:text-[#4A151B] transition text-xs">Featured videos</Link>
              </div>
            </div>
          </div>

        </nav>

        {/* ================= ACTIONS ================= */}
        <div className="flex items-center gap-3 shrink-0">
          
          <Link
            href="/favorites"
            className={`relative p-2.5 rounded-xl border transition flex items-center justify-center shadow-sm ${
              isHome 
                ? 'bg-black/35 backdrop-blur-md border-white/25 text-white hover:border-white' 
                : 'bg-[#EBE4DA] border-[#D8CEBE] text-[#2C181A] hover:border-[#4A151B]'
            }`}
            title="Favorites"
          >
            <Heart className="w-4 h-4 text-[#C5A880]" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#4A151B] text-[#F2EDE4] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#C5A880] shadow-md">
                {favoritesCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-3 border px-3.5 py-2 rounded-2xl text-sm font-semibold transition shadow-sm group ${
                  isHome 
                    ? 'bg-black/35 backdrop-blur-md border-white/25 text-white hover:border-white' 
                    : 'bg-[#EBE4DA] border-[#D8CEBE] text-[#2C181A] hover:border-[#4A151B]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#4A151B] text-[#F2EDE4] flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold leading-tight truncate max-w-[100px]">{user.name}</p>
                  <p className="text-[10px] font-light leading-tight opacity-80">
                    {user.role === 'ADMIN' ? 'Administrator' : 'Investor'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
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
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm ${
                  isHome 
                    ? 'bg-black/35 backdrop-blur-md border border-white/25 text-white hover:border-white' 
                    : 'bg-[#EBE4DA] border border-[#D8CEBE] text-[#2C181A] hover:border-[#4A151B]'
                }`}
              >
                <LogIn className="w-4 h-4 text-[#C5A880]" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 bg-[#4A151B] text-[#F2EDE4] text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#3B1115] transition shadow-md border border-[#C5A880]/30"
              >
                <UserPlus className="w-4 h-4 text-[#C5A880]" />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}