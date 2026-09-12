'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import { ShoppingBag, Calendar, ArrowLeft, Building2, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getStoredBookings, getStoredMeetings } from '@/lib/data';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'meetings'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('oravya_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Charger dynamiquement les réservations et filtrer par l'email de l'utilisateur connecté
      const allBookings = getStoredBookings();
      const userBookings = allBookings.filter(
        (b) => b.clientEmail?.toLowerCase() === parsedUser.email?.toLowerCase()
      );
      setOrders(userBookings);

      // Charger dynamiquement les réunions et filtrer par l'email de l'utilisateur connecté
      const allMeetings = getStoredMeetings();
      const userMeetings = allMeetings.filter(
        (m) => m.email?.toLowerCase() === parsedUser.email?.toLowerCase()
      );
      setMeetings(userMeetings);

    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6D53] hover:text-[#4A151B] transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className={`${fraunces.className} text-3xl md:text-4xl text-[#2C181A] mt-2`}>My Orders & Meetings</h1>
          <p className="text-[#685248] text-sm font-light">Track your real estate bookings, transactions, and scheduled advisory sessions.</p>
        </div>

        {/* ONGLETS DE NAVIGATION INTERNE */}
        <div className="flex gap-3 mb-8 border-b border-[#D8CEBE] pb-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-[#4A151B] text-[#F2EDE4] shadow-md'
                : 'bg-[#EBE4DA] text-[#2C181A] border border-[#D8CEBE] hover:border-[#4A151B]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Property Orders ({orders.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('meetings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'meetings'
                ? 'bg-[#4A151B] text-[#F2EDE4] shadow-md'
                : 'bg-[#EBE4DA] text-[#2C181A] border border-[#D8CEBE] hover:border-[#4A151B]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Scheduled Meetings ({meetings.length})</span>
          </button>
        </div>

        {/* SECTION 1 : COMMANDES / RÉSERVATIONS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl">
                <ShoppingBag className="w-10 h-10 text-[#8C6D53] mx-auto mb-3" />
                <p className="font-medium text-[#2C181A]">No property orders found</p>
                <p className="text-xs text-[#685248] mt-1">Explore our inventory and begin your investment journey or holiday booking.</p>
                <Link href="/properties" className="inline-block mt-4 bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-5 py-2.5 rounded-xl">
                  Browse Properties
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-[#EBE4DA] border border-[#D8CEBE] p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#4A151B] text-[#F2EDE4] flex items-center justify-center shrink-0 shadow-sm">
                      <Building2 className="w-6 h-6 text-[#C5A880]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#C5A880]">{order.id}</span>
                        <span className="text-[#D8CEBE]">•</span>
                        <span className="text-xs text-[#8C6D53] font-medium">{order.itemType || 'Property'}</span>
                      </div>
                      <h3 className={`${fraunces.className} text-xl text-[#2C181A]`}>{order.itemName}</h3>
                      <p className="text-xs text-[#685248] mt-0.5">
                        {order.checkIn && order.checkIn !== 'N/A' ? `Dates: ${order.checkIn} ➔ ${order.checkOut}` : `Booked on ${order.createdAt}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#D8CEBE]">
                    <span className="font-bold text-[#4A151B] text-lg mb-1">AED {order.totalPrice?.toLocaleString()}</span>
                    <span className="inline-flex items-center gap-1.5 bg-[#F2EDE4] border border-[#D8CEBE] text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{order.status}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SECTION 2 : RÉUNIONS EN LIGNE */}
        {activeTab === 'meetings' && (
          <div className="space-y-4">
            {meetings.length === 0 ? (
              <div className="text-center py-16 bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl">
                <Calendar className="w-10 h-10 text-[#8C6D53] mx-auto mb-3" />
                <p className="font-medium text-[#2C181A]">No upcoming meetings</p>
                <p className="text-xs text-[#685248] mt-1">Book an online video consultation with our Dubai market advisors.</p>
                <Link href="/contact" className="inline-block mt-4 bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-5 py-2.5 rounded-xl">
                  Book a Meeting
                </Link>
              </div>
            ) : (
              meetings.map((meeting) => (
                <div key={meeting.id} className="bg-[#EBE4DA] border border-[#D8CEBE] p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#4A151B] text-[#F2EDE4] flex items-center justify-center shrink-0 shadow-sm">
                      <Calendar className="w-6 h-6 text-[#C5A880]" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#C5A880]">{meeting.service}</span>
                      <h3 className={`${fraunces.className} text-xl text-[#2C181A] mt-0.5`}>Dubai Market Expert Consultation</h3>
                      <p className="text-xs text-[#685248] flex items-center gap-1.5 mt-2">
                        <Clock className="w-3.5 h-3.5 text-[#8C6D53]" /> {meeting.date} at {meeting.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#D8CEBE]">
                    <span className={`inline-flex items-center gap-1.5 border px-3.5 py-1.5 rounded-full text-xs font-semibold ${meeting.status === 'Handled' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                      <span>{meeting.status}</span>
                    </span>
                    <a
                      href="#join"
                      onClick={(e) => { e.preventDefault(); alert("Le lien de la réunion sécurisée sera actif 10 minutes avant l'heure prévue."); }}
                      className="bg-[#4A151B] text-[#F2EDE4] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#3B1115] transition shadow-sm flex items-center gap-1.5"
                    >
                      <span>Join Call</span> <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}