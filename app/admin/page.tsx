'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, Users, Wallet, CalendarDays, Briefcase, 
  ArrowRight, Clock, PlusCircle, Inbox, BellRing
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>({
    metrics: { totalRevenue: 0, totalCollected: 0, totalPending: 0, properties: 0, bookings: 0, leads: 0, services: 0 },
    recentLeads: [],
    upcomingEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const { metrics, recentLeads, upcomingEvents } = data;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full pb-24 animate-in fade-in">
      
      {/* HEADER & QUICK ACTIONS */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Master Control</span>
          <h2 className="text-3xl font-serif font-bold text-[#4A1F23]">Enterprise Analytics</h2>
          <p className="text-sm text-[#8C6D53]">Real-time operational overview of Oravya.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/sell-requests" className="bg-white border border-[#E7B6A5]/60 hover:bg-[#F2EDE4] text-[#4A1F23] text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition">
            <Inbox className="w-4 h-4" /> Inbox
          </Link>
          <Link href="/admin/agenda" className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition">
            <PlusCircle className="w-4 h-4" /> New Event
          </Link>
        </div>
      </div>

      {/* 1. FINANCIAL METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-20 h-20 text-[#8E3A47]" /></div>
          <span className="text-[11px] uppercase tracking-wider text-[#8C6D53] font-bold block mb-1">Total Pipeline Value</span>
          {loading ? <div className="h-9 w-32 bg-gray-200 animate-pulse rounded-md mt-1"></div> : (
            <span className="text-3xl font-bold font-serif text-[#4A1F23]">AED {metrics.totalRevenue.toLocaleString()}</span>
          )}
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold block mb-1">Capital Collected</span>
          {loading ? <div className="h-9 w-32 bg-emerald-200/50 animate-pulse rounded-md mt-1"></div> : (
            <span className="text-3xl font-bold font-serif text-emerald-900">AED {metrics.totalCollected.toLocaleString()}</span>
          )}
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <span className="text-[11px] uppercase tracking-wider text-amber-700 font-bold block mb-1">Pending Receivables</span>
          {loading ? <div className="h-9 w-32 bg-amber-200/50 animate-pulse rounded-md mt-1"></div> : (
            <span className="text-3xl font-bold font-serif text-amber-900">AED {metrics.totalPending.toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* 2. OPERATIONAL METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Bookings', count: metrics.bookings, icon: CalendarDays },
          { label: 'Property Assets', count: metrics.properties, icon: Building2 },
          { label: 'CRM Leads', count: metrics.leads, icon: Users },
          { label: 'Services Live', count: metrics.services, icon: Briefcase },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#E7B6A5]/40 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-[#8E3A47] transition">
            <div className="w-10 h-10 rounded-full bg-[#F5E1C7]/30 flex items-center justify-center text-[#8E3A47] shrink-0">
              <stat.icon className="w-5 h-5"/>
            </div>
            <div>
              {loading ? <div className="h-7 w-12 bg-gray-200 animate-pulse rounded-md mb-1"></div> : (
                <div className="text-xl font-bold text-[#4A1F23]">{stat.count}</div>
              )}
              <div className="text-[10px] uppercase font-semibold text-[#8C6D53]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. RECENT ACTIVITY & AGENDA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* LEFT COL: RECENT LEADS */}
        <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#E7B6A5]/30 flex justify-between items-center">
            <h3 className="font-bold text-[#4A1F23] flex items-center gap-2">
              <BellRing className="w-4 h-4 text-[#8E3A47]"/> Recent Sell Requests
            </h3>
            <Link href="/admin/sell-requests" className="text-[10px] uppercase font-bold text-[#8C6D53] hover:text-[#8E3A47] flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3"/>
            </Link>
          </div>
          <div className="p-2 flex-1">
            {loading ? (
               <div className="p-8 text-center text-[#8C6D53] text-sm">Loading activity...</div>
            ) : recentLeads.length === 0 ? (
               <div className="p-8 text-center text-[#8C6D53] text-sm italic">No recent leads found.</div>
            ) : (
              <ul className="divide-y divide-[#E7B6A5]/20">
                {recentLeads.map((lead: any) => (
                  <li key={lead.id} className="p-4 hover:bg-[#F2EDE4]/30 rounded-xl transition flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-[#4A1F23]">{lead.ownerName}</div>
                      <div className="text-[10px] text-[#8C6D53] flex items-center gap-2 mt-1">
                        <span className="bg-[#F5E1C7]/50 text-[#8E3A47] px-1.5 py-0.5 rounded font-semibold">{lead.propertyType}</span>
                        {lead.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-semibold text-[#8C6D53]">{new Date(lead.createdAt).toLocaleDateString()}</div>
                      <div className={`text-[10px] font-bold mt-1 ${lead.status === 'Pending' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {lead.status}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT COL: UPCOMING AGENDA */}
        <div className="bg-white border border-[#E7B6A5]/50 rounded-2xl shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#E7B6A5]/30 flex justify-between items-center">
            <h3 className="font-bold text-[#4A1F23] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8E3A47]"/> Upcoming Agenda
            </h3>
            <Link href="/admin/agenda" className="text-[10px] uppercase font-bold text-[#8C6D53] hover:text-[#8E3A47] flex items-center gap-1">
              Open Calendar <ArrowRight className="w-3 h-3"/>
            </Link>
          </div>
          <div className="p-2 flex-1">
            {loading ? (
               <div className="p-8 text-center text-[#8C6D53] text-sm">Loading agenda...</div>
            ) : upcomingEvents.length === 0 ? (
               <div className="p-8 text-center text-[#8C6D53] text-sm italic">No upcoming events scheduled.</div>
            ) : (
              <ul className="divide-y divide-[#E7B6A5]/20">
                {upcomingEvents.map((event: any) => (
                  <li key={event.id} className="p-4 hover:bg-[#F2EDE4]/30 rounded-xl transition flex gap-4 items-center">
                    <div className="text-center bg-[#F5E1C7]/30 border border-[#E7B6A5]/40 rounded-lg p-2 min-w-[60px]">
                      <div className="text-[10px] uppercase font-bold text-[#8E3A47]">{new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}</div>
                      <div className="text-lg font-bold text-[#4A1F23] leading-none mt-1">{new Date(event.date).getDate()}</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#4A1F23]">{event.title}</div>
                      <div className="text-[11px] text-[#8C6D53] font-medium mt-0.5">
                        {new Date(event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • {event.type}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}