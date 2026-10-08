'use client';

export const dynamic = 'force-dynamic';

import { Building2, Users, FileText, Wallet, CalendarDays, Briefcase } from 'lucide-react';

export default function AdminDashboardPage() {
  // Ici, tu pourras plus tard faire des fetch('/api/stats') pour récupérer les vrais chiffres depuis Prisma.
  // Pour l'instant, on met des chiffres d'exemple pour le layout.
  const metrics = {
    totalRevenue: 45000000,
    totalCollected: 12500000,
    totalPending: 32500000,
    properties: 12,
    bookings: 4,
    leads: 28,
    services: 10
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full pb-24 animate-in fade-in">
      <div>
        <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Master Control</span>
        <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Enterprise Analytics</h2>
        <p className="text-sm text-[#8C6D53]">Real-time financial and operational overview of Oravya.</p>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-20 h-20 text-[#8E3A47]" /></div>
          <span className="text-[11px] uppercase tracking-wider text-[#8C6D53] font-bold block mb-1">Total Pipeline Value</span>
          <span className="text-3xl font-bold font-serif text-[#4A1F23]">AED {metrics.totalRevenue.toLocaleString()}</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold block mb-1">Capital Collected</span>
          <span className="text-3xl font-bold font-serif text-emerald-900">AED {metrics.totalCollected.toLocaleString()}</span>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <span className="text-[11px] uppercase tracking-wider text-amber-700 font-bold block mb-1">Pending Receivables</span>
          <span className="text-3xl font-bold font-serif text-amber-900">AED {metrics.totalPending.toLocaleString()}</span>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Bookings', count: metrics.bookings, icon: CalendarDays },
          { label: 'Property Assets', count: metrics.properties, icon: Building2 },
          { label: 'CRM Leads', count: metrics.leads, icon: Users },
          { label: 'Services Live', count: metrics.services, icon: Briefcase },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#E7B6A5]/40 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-[#8E3A47] transition">
            <div className="w-10 h-10 rounded-full bg-[#F5E1C7]/30 flex items-center justify-center text-[#8E3A47]">
              <stat.icon className="w-5 h-5"/>
            </div>
            <div>
              <div className="text-xl font-bold text-[#4A1F23]">{stat.count}</div>
              <div className="text-[10px] uppercase font-semibold text-[#8C6D53]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}