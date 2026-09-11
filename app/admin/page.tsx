'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Fraunces } from 'next/font/google';
import {
  ShieldAlert,
  Users,
  Building2,
  Calendar,
  LogOut,
  PlusCircle,
  Trash2,
  Edit3,
  X,
  Upload,
  Search,
  Wallet,
  Home,
  CalendarCheck,
  Inbox,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  getStoredItems,
  saveStoredItems,
  getStoredMeetings,
  saveStoredMeetings,
  getStoredUsers,
  getStoredBookings,
  saveStoredBookings,
  AMENITY_OPTIONS,
  ItemProperty,
  MeetingRequest,
  UserAccount,
  BookingRequest,
  PropertyStatus,
} from '@/lib/data';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' });

type Tab = 'properties' | 'holidays' | 'meetings' | 'bookings' | 'users';

const STATUS_FILTERS: Record<Tab, string[]> = {
  properties: ['All', 'Off-Plan', 'Ready'],
  holidays: ['All', 'Available', 'Booked'],
  bookings: ['All', 'Pending', 'Confirmed', 'Cancelled', 'Completed'],
  meetings: ['All', 'Pending', 'Handled'],
  users: [],
};

function formatAED(value: number) {
  return `AED ${value.toLocaleString('en-US')}`;
}

// Small shared empty-state block, reused across every table.
function EmptyState({ icon: Icon, label }: { icon: typeof Inbox; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#F2EDE4] border border-[#D8CEBE] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#8C6D53]" />
      </div>
      <p className="text-[#685248] text-sm">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('properties');

  const [properties, setProperties] = useState<ItemProperty[]>([]);
  const [holidays, setHolidays] = useState<ItemProperty[]>([]);
  const [meetings, setMeetings] = useState<MeetingRequest[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [usersList, setUsersList] = useState<UserAccount[]>([]);

  // Search & status filter, shared across tabs
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal state (add / edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    location: 'Downtown Dubai',
    type: 'Apartment' as ItemProperty['type'],
    price: 2000000,
    beds: 2,
    baths: 2,
    size: 1200,
    status: 'Off-Plan' as PropertyStatus,
    images: [] as string[],
    description: '',
    amenities: [] as string[],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('oravya_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(storedUser);
      if (user.role !== 'ADMIN') {
        router.push('/');
        return;
      }
      setIsAdmin(true);
      setProperties(getStoredItems('oravya_properties'));
      setHolidays(getStoredItems('oravya_holidays'));
      setMeetings(getStoredMeetings());
      setBookings(getStoredBookings());
      setUsersList(getStoredUsers());
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Reset search/filter when switching tabs so stale filters don't hide data
  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setQuery('');
    setStatusFilter('All');
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const imageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...imageUrls] }));
    }
  };

  function toggleAmenity(name: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter((a) => a !== name)
        : [...prev.amenities, name],
    }));
  }

  const handleOpenAddModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      location: 'Downtown Dubai',
      type: activeTab === 'holidays' ? 'Holiday Home' : 'Apartment',
      price: 2000000,
      beds: 2,
      baths: 2,
      size: 1200,
      status: activeTab === 'holidays' ? 'Available' : 'Off-Plan',
      images: [],
      description: '',
      amenities: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ItemProperty) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      location: item.location,
      type: item.type,
      price: item.price,
      beds: item.beds,
      baths: item.baths,
      size: item.size,
      status: item.status,
      images: item.images || [],
      description: item.description || '',
      amenities: item.amenities || [],
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    const currentList = activeTab === 'holidays' ? holidays : properties;
    let updatedList: ItemProperty[];
    const finalImages =
      form.images.length > 0
        ? form.images
        : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'];

    if (editingId) {
      updatedList = currentList.map((item) =>
        item.id === editingId ? { ...item, ...form, images: finalImages } : item
      );
    } else {
      const newItem: ItemProperty = {
        id: 'item-' + Date.now(),
        ...form,
        images: finalImages,
      };
      updatedList = [newItem, ...currentList];
    }

    if (activeTab === 'holidays') {
      setHolidays(updatedList);
      saveStoredItems('oravya_holidays', updatedList);
    } else {
      setProperties(updatedList);
      saveStoredItems('oravya_properties', updatedList);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'holidays') {
      const updated = holidays.filter((i) => i.id !== id);
      setHolidays(updated);
      saveStoredItems('oravya_holidays', updated);
    } else {
      const updated = properties.filter((i) => i.id !== id);
      setProperties(updated);
      saveStoredItems('oravya_properties', updated);
    }
  };

  const handleDeleteMeeting = (id: string) => {
    const updated = meetings.filter((m) => m.id !== id);
    setMeetings(updated);
    saveStoredMeetings(updated);
  };

  const handleToggleMeetingStatus = (id: string) => {
    const updated = meetings.map((m) =>
      m.id === id ? { ...m, status: (m.status === 'Handled' ? 'Pending' : 'Handled') as MeetingRequest['status'] } : m
    );
    setMeetings(updated);
    saveStoredMeetings(updated);
  };

  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    saveStoredBookings(updated);
  };

  const handleUpdateBookingStatus = (id: string, status: BookingRequest['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    saveStoredBookings(updated);
  };

  // --- Filtering (search + status) per tab -----------------------------

  const filteredProperties = useMemo(() => {
    const list = activeTab === 'holidays' ? holidays : properties;
    return list.filter((item) => {
      const matchesQuery =
        query.trim() === '' ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [activeTab, holidays, properties, query, statusFilter]);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((b) => {
        const matchesQuery =
          query.trim() === '' ||
          b.clientName.toLowerCase().includes(query.toLowerCase()) ||
          b.itemName.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [bookings, query, statusFilter]
  );

  const filteredMeetings = useMemo(
    () =>
      meetings.filter((m) => {
        const matchesQuery =
          query.trim() === '' ||
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.service.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [meetings, query, statusFilter]
  );

  const filteredUsers = useMemo(
    () =>
      usersList.filter(
        (u) =>
          query.trim() === '' ||
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())
      ),
    [usersList, query]
  );

  // --- KPIs ---------------------------------------------------------------

  const kpis = useMemo(() => {
    const revenue = bookings.reduce((sum, b) => (b.status === 'Cancelled' ? sum : sum + b.totalPrice), 0);
    return [
      { icon: Building2, label: 'Active Properties', value: properties.length.toString() },
      { icon: Home, label: 'Holiday Homes', value: holidays.length.toString() },
      { icon: Wallet, label: 'Booking Revenue', value: formatAED(revenue) },
      { icon: Users, label: 'Registered Users', value: usersList.length.toString() },
      { icon: Calendar, label: 'Meetings Scheduled', value: meetings.length.toString() },
    ];
  }, [properties, holidays, bookings, usersList, meetings]);

  if (loading || !isAdmin) return null;

  const statusOptions = STATUS_FILTERS[activeTab];

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans">
      {/* HEADER */}
      <header className="border-b border-[#D8CEBE] bg-[#EBE4DA] px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4A151B] text-[#F2EDE4] flex items-center justify-center shadow-md">
            <ShieldAlert className="w-5 h-5 text-[#C5A880]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-[#4A151B]">ORAVYA ADMIN</h1>
            <p className="text-[10px] uppercase text-[#8C6D53] tracking-widest font-light">Secure Control Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-[#685248] hover:text-[#4A151B] transition">
            Voir le site public
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('oravya_user');
              router.push('/login');
            }}
            className="flex items-center gap-2 bg-red-500/10 border border-red-300 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-2 block">
              Live Management
            </span>
            <h2 className={`${fraunces.className} text-3xl md:text-4xl text-[#2C181A]`}>Tableau de bord Administrateur</h2>
          </div>
          {(activeTab === 'properties' || activeTab === 'holidays') && (
            <button
              onClick={handleOpenAddModal}
              className="bg-[#4A151B] text-[#F2EDE4] font-bold px-6 py-3.5 rounded-xl hover:bg-[#3B1115] transition shadow-lg flex items-center gap-2 text-sm shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-[#C5A880]" />
              <span>Ajouter {activeTab === 'holidays' ? 'un Holiday Home' : 'une Propriété'}</span>
            </button>
          )}
        </div>

        {/* KPI ROW */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-[#EBE4DA] border border-[#D8CEBE] rounded-2xl p-5 shadow-sm">
              <kpi.icon className="w-5 h-5 text-[#4A151B] mb-3" />
              <p className={`${fraunces.className} text-xl md:text-2xl text-[#2C181A] leading-tight`}>{kpi.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-[#8C6D53] mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-6 border-b border-[#D8CEBE] pb-4">
          {(
            [
              ['properties', `Propriétés (${properties.length})`],
              ['holidays', `Holiday Homes (${holidays.length})`],
              ['meetings', `Réunions (${meetings.length})`],
              ['bookings', `Réservations (${bookings.length})`],
              ['users', `Utilisateurs (${usersList.length})`],
            ] as [Tab, string][]
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-[#4A151B] text-[#F2EDE4] shadow-md'
                  : 'bg-[#EBE4DA] text-[#2C181A] border border-[#D8CEBE]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* SEARCH + STATUS FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex items-center gap-3 flex-1 bg-[#EBE4DA] border border-[#D8CEBE] px-4 py-3 rounded-xl">
            <Search className="w-4 h-4 text-[#8C6D53] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === 'users'
                  ? 'Rechercher par nom ou email...'
                  : activeTab === 'meetings'
                  ? 'Rechercher par client ou service...'
                  : activeTab === 'bookings'
                  ? 'Rechercher par client ou bien...'
                  : 'Rechercher par nom ou localisation...'
              }
              className="bg-transparent w-full outline-none text-sm text-[#2C181A] placeholder:text-[#8C6D53]/70"
            />
          </div>
          {statusOptions.length > 0 && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#EBE4DA] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm text-[#2C181A] outline-none"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'Tous les statuts' : s}</option>
              ))}
            </select>
          )}
        </div>

        {/* PROPERTIES / HOLIDAYS TABLE */}
        {(activeTab === 'properties' || activeTab === 'holidays') && (
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#D8CEBE]">
              <h3 className={`${fraunces.className} text-xl text-[#2C181A]`}>
                Gestion des annonces — {activeTab === 'holidays' ? 'Holiday Homes' : 'Propriétés'}
              </h3>
            </div>
            {filteredProperties.length === 0 ? (
              <EmptyState icon={Building2} label="Aucun bien ne correspond à ta recherche." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#DFD6C9]/60 text-[#8C6D53] uppercase text-[11px] tracking-wider border-b border-[#D8CEBE]">
                    <tr>
                      <th className="px-6 py-4">Photos</th>
                      <th className="px-6 py-4">Nom du Bien</th>
                      <th className="px-6 py-4">Localisation</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4">Prix</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8CEBE]">
                    {filteredProperties.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F2EDE4]/40 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {item.images?.slice(0, 3).map((img, idx) => (
                              <div key={idx} className="w-10 h-8 rounded-lg overflow-hidden relative border border-[#D8CEBE] bg-[#DFD6C9]">
                                <Image src={img} alt={item.name} fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#2C181A]">{item.name}</td>
                        <td className="px-6 py-4 text-[#685248]">{item.location}</td>
                        <td className="px-6 py-4">
                          <span className="bg-[#F2EDE4] border border-[#D8CEBE] px-2.5 py-1 rounded-lg text-xs font-medium text-[#4A151B]">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#4A151B]">
                          {formatAED(item.price)}
                          {activeTab === 'holidays' && <span className="text-[#8C6D53] font-normal"> /night</span>}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenEditModal(item)} className="p-2 text-[#8C6D53] hover:bg-[#D8CEBE]/50 rounded-lg transition" title="Modifier">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-700 hover:bg-red-500/10 rounded-lg transition" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MEETINGS TABLE */}
        {activeTab === 'meetings' && (
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#D8CEBE]">
              <h3 className={`${fraunces.className} text-xl text-[#2C181A]`}>Demandes de réunions ({filteredMeetings.length})</h3>
            </div>
            {filteredMeetings.length === 0 ? (
              <EmptyState icon={Calendar} label="Aucune demande de réunion pour le moment." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#DFD6C9]/60 text-[#8C6D53] uppercase text-[11px] tracking-wider border-b border-[#D8CEBE]">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Sujet</th>
                      <th className="px-6 py-4">Date & Heure</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8CEBE]">
                    {filteredMeetings.map((m) => (
                      <tr key={m.id} className="hover:bg-[#F2EDE4]/40 transition">
                        <td className="px-6 py-4 font-semibold text-[#2C181A]">{m.name}</td>
                        <td className="px-6 py-4 text-[#685248]">
                          <p className="text-xs">{m.email}</p>
                          <p className="text-xs font-medium text-[#2C181A]">{m.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-[#F2EDE4] border border-[#D8CEBE] px-2.5 py-1 rounded-lg text-xs font-medium text-[#4A151B]">
                            {m.service}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-[#2C181A]">{m.date} à {m.time}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${m.status === 'Handled' ? 'bg-[#4A151B] text-[#F2EDE4]' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleMeetingStatus(m.id)}
                            className="p-2 text-[#4A151B] hover:bg-[#D8CEBE]/50 rounded-lg transition"
                            title={m.status === 'Handled' ? 'Rouvrir' : 'Marquer comme traité'}
                          >
                            {m.status === 'Handled' ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDeleteMeeting(m.id)} className="p-2 text-red-700 hover:bg-red-500/10 rounded-lg transition" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TABLE */}
        {activeTab === 'bookings' && (
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#D8CEBE]">
              <h3 className={`${fraunces.className} text-xl text-[#2C181A]`}>Réservations & Agendas des séjours ({filteredBookings.length})</h3>
            </div>
            {filteredBookings.length === 0 ? (
              <EmptyState icon={CalendarCheck} label="Aucune réservation ne correspond à ta recherche." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#DFD6C9]/60 text-[#8C6D53] uppercase text-[11px] tracking-wider border-b border-[#D8CEBE]">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Logement / Bien</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Montant</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8CEBE]">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#F2EDE4]/40 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#2C181A]">{b.clientName}</p>
                          <p className="text-xs text-[#685248]">{b.clientEmail} • {b.clientPhone}</p>
                        </td>
                        <td className="px-6 py-4 font-medium text-[#2C181A]">{b.itemName}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-[#4A151B]">{b.checkIn} ➔ {b.checkOut}</td>
                        <td className="px-6 py-4 font-bold text-[#4A151B]">{formatAED(b.totalPrice)}</td>
                        <td className="px-6 py-4">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as BookingRequest['status'])}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold outline-none border ${
                              b.status === 'Confirmed'
                                ? 'bg-[#4A151B] text-[#F2EDE4] border-[#4A151B]'
                                : b.status === 'Cancelled'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : b.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteBooking(b.id)} className="p-2 text-red-700 hover:bg-red-500/10 rounded-lg transition" title="Supprimer la réservation">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USERS TABLE */}
        {activeTab === 'users' && (
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#D8CEBE]">
              <h3 className={`${fraunces.className} text-xl text-[#2C181A]`}>Utilisateurs enregistrés ({filteredUsers.length})</h3>
            </div>
            {filteredUsers.length === 0 ? (
              <EmptyState icon={Users} label="Aucun utilisateur ne correspond à ta recherche." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#DFD6C9]/60 text-[#8C6D53] uppercase text-[11px] tracking-wider border-b border-[#D8CEBE]">
                    <tr>
                      <th className="px-6 py-4">Nom</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Rôle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8CEBE]">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F2EDE4]/40 transition">
                        <td className="px-6 py-4 font-semibold text-[#2C181A]">{u.name}</td>
                        <td className="px-6 py-4 text-[#685248]">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'ADMIN' ? 'bg-[#4A151B] text-[#F2EDE4]' : 'bg-[#F2EDE4] border border-[#D8CEBE] text-[#2C181A]'}`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL — Add / Edit property or holiday home */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#EBE4DA] border border-[#D8CEBE] w-full max-w-xl p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-[#685248] hover:text-[#4A151B]">
              <X className="w-5 h-5" />
            </button>
            <h3 className={`${fraunces.className} text-2xl text-[#2C181A] mb-6`}>
              {editingId ? "Modifier l'annonce" : 'Ajouter une nouvelle annonce'}
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-1.5">Nom du bien</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm text-[#2C181A] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-1.5">Localisation</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm text-[#2C181A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-1.5">
                    Prix (AED){activeTab === 'holidays' && ' / nuit'}
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    required
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm text-[#2C181A] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-1.5">Chambres</label>
                  <input
                    type="number"
                    value={form.beds}
                    onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })}
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm text-[#2C181A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-1.5">Salles de bain</label>
                  <input
                    type="number"
                    value={form.baths}
                    onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })}
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm text-[#2C181A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-1.5">Surface (sqft)</label>
                  <input
                    type="number"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: Number(e.target.value) })}
                    className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm text-[#2C181A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-1.5">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as PropertyStatus })}
                  className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm text-[#2C181A] outline-none"
                >
                  {(activeTab === 'holidays' ? ['Available', 'Booked'] : ['Off-Plan', 'Ready']).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-1.5">Description détaillée</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Décris le bien pour la page de détail publique..."
                  className="w-full bg-[#F2EDE4] border border-[#D8CEBE] rounded-xl px-4 py-3 text-sm text-[#2C181A] outline-none resize-none placeholder:text-[#8C6D53]/60"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-2">Équipements (amenities)</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const active = form.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          active
                            ? 'bg-[#4A151B] text-[#F2EDE4] border-[#4A151B]'
                            : 'bg-[#F2EDE4] text-[#685248] border-[#D8CEBE] hover:border-[#4A151B]/40'
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8C6D53] font-semibold mb-1.5">Photos locales</label>
                <label className="border-2 border-dashed border-[#D8CEBE] bg-[#F2EDE4] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#4A151B] transition">
                  <Upload className="w-6 h-6 text-[#8C6D53] mb-2" />
                  <span className="text-xs font-semibold text-[#2C181A]">Choisir des images depuis l'ordinateur</span>
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                </label>
                {form.images.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {form.images.map((imgSrc, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-xl relative overflow-hidden border border-[#D8CEBE] shadow-sm">
                        <Image src={imgSrc} alt="Preview" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-[#F2EDE4] border border-[#D8CEBE] text-[#2C181A] px-5 py-2.5 rounded-xl text-xs font-semibold">
                  Annuler
                </button>
                <button type="submit" className="bg-[#4A151B] text-[#F2EDE4] px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#3B1115] transition shadow-md">
                  {editingId ? 'Mettre à jour' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
