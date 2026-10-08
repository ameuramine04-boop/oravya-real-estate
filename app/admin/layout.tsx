'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Building2, Gem, Palmtree, MapPin, Landmark, 
  Inbox, CalendarDays, CreditCard, CalendarClock, Users, 
  BadgeCheck, Handshake, UserCircle, Briefcase, BookOpen, 
  LineChart, Star, LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Organisation de tes boutons par PÔLES STRATÉGIQUES
  const menuCategories = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Real Estate Portfolio',
      items: [
        { name: 'New Projects', href: '/admin/new-projects', icon: Building2 },
        { name: 'Luxury Sales', href: '/admin/luxury', icon: Gem },
        { name: 'Holiday Homes', href: '/admin/holiday-homes', icon: Palmtree },
        { name: 'Areas', href: '/admin/areas', icon: MapPin },
        { name: 'Developers', href: '/admin/developers', icon: Landmark },
      ]
    },
    {
      title: 'Sales & Finance',
      items: [
        { name: 'Sell Requests', href: '/admin/sell-requests', icon: Inbox },
        { name: 'Bookings', href: '/admin/bookings', icon: CalendarDays },
        { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      ]
    },
    {
      title: 'CRM & Network',
      items: [
        { name: 'Agenda', href: '/admin/agenda', icon: CalendarClock },
        { name: 'Meetings', href: '/admin/meetings', icon: Users },
        { name: 'Agents', href: '/admin/agents', icon: BadgeCheck },
        { name: 'Partners', href: '/admin/partners', icon: Handshake },
        { name: 'Users', href: '/admin/users', icon: UserCircle },
      ]
    },
    {
      title: 'Brand & Content',
      items: [
        { name: 'Services', href: '/admin/services', icon: Briefcase },
        { name: 'Blog', href: '/admin/blog', icon: BookOpen },
        { name: 'Trends', href: '/admin/trends', icon: LineChart },
        { name: 'Reviews', href: '/admin/reviews', icon: Star },
      ]
    }
  ];

  // Aplatir les items pour la navigation mobile
  const allMenuItems = menuCategories.flatMap(cat => cat.items);

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] flex overflow-hidden">
      
      {/* ================= SIDEBAR DESKTOP ================= */}
      <aside className="w-72 bg-[#4A1F23] text-[#F5E1C7] flex-col hidden lg:flex border-r border-[#E7B6A5]/20 h-screen overflow-y-auto custom-scrollbar">
        
        {/* En-tête fixe */}
        <div className="p-6 border-b border-[#E7B6A5]/20 flex items-center gap-3 sticky top-0 bg-[#4A1F23] z-10 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8E3A47] to-[#4A1F23] flex items-center justify-center font-serif font-bold text-xl text-white shadow-inner shrink-0">
            O
          </div>
          <div>
            <span className="font-serif font-bold text-lg tracking-wider block">Oravya ERP</span>
            <span className="text-[10px] uppercase tracking-widest text-[#E7B6A5]/70">Master Control</span>
          </div>
        </div>

        {/* Liens de navigation */}
        <div className="flex-1 p-4 space-y-6 pb-6">
          {menuCategories.map((category, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-[10px] uppercase tracking-widest text-[#E7B6A5]/50 font-bold mb-2">
                {category.title}
              </h3>
              <nav className="space-y-1">
                {category.items.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#8E3A47] text-white shadow-md' 
                          : 'text-[#F5E1C7]/80 hover:bg-[#F5E1C7]/10'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-[#F5E1C7]' : 'opacity-70'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer Fixe */}
        <div className="p-4 border-t border-[#E7B6A5]/20 bg-[#4A1F23] sticky bottom-0 z-10 shrink-0">
          <Link href="/" className="w-full flex items-center justify-center gap-2 bg-[#F5E1C7]/10 hover:bg-[#F5E1C7]/20 text-[#F5E1C7] py-3 rounded-xl transition text-xs font-semibold">
            <LogOut className="w-4 h-4" /> 
            <span>Exit to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* ================= CONTENU PRINCIPAL ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Mobile */}
        <header className="bg-[#4A1F23] text-[#F5E1C7] p-6 lg:hidden flex justify-between items-center border-b border-[#E7B6A5]/20 shrink-0">
          <h1 className="font-serif font-bold text-lg">Oravya Master Admin</h1>
          <Link href="/" className="bg-[#8E3A47] text-white px-4 py-2 rounded-lg text-xs font-bold">Exit</Link>
        </header>

        {/* Navigation Mobile Scrollable */}
        <div className="lg:hidden flex bg-[#4A1F23]/95 text-[#F5E1C7] overflow-x-auto p-2 gap-2 border-b border-[#E7B6A5]/20 shrink-0 custom-scrollbar">
          {allMenuItems.map(item => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap flex items-center gap-2 ${pathname === item.href ? 'bg-[#8E3A47] text-white' : 'text-[#F5E1C7]/70'}`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Espace Dynamique où s'afficheront les sous-pages */}
        <main className="flex-1 overflow-y-auto bg-[#F2EDE4] relative">
          {children}
        </main>

      </div>
    </div>
  );
}