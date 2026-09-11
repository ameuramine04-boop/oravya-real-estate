export type PropertyType = 'Apartment' | 'Villa' | 'Townhouse' | 'Penthouse' | 'Plot' | 'Holiday Home';
export type PropertyStatus = 'Off-Plan' | 'Ready' | 'Available' | 'Booked';

export interface ItemProperty {
  id: string;
  name: string;
  location: string;
  type: PropertyType;
  price: number; // AED — nightly rate for holiday homes, sale price otherwise
  beds: number;
  baths: number;
  size: number; // sq ft
  status: PropertyStatus;
  images: string[];
  description?: string;
  amenities?: string[];
}

export interface MeetingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
  status: 'Pending' | 'Handled';
}

export interface BookingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  itemName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
}

export const AMENITY_OPTIONS = [
  'WiFi',
  'Swimming Pool',
  'Covered Parking',
  'Air Conditioning',
  'Gym Access',
  '24/7 Security',
  'Private Balcony',
  'Sea View',
  'Smart Home',
  "Maid's Room",
  'Concierge',
  'Beach Access',
];

function readList<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

function writeList<T>(key: string, list: T[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(list));
}

// --- Seed Data --------------------------------------------------------------

const SEED_PROPERTIES: ItemProperty[] = [
  {
    id: 'prop-001',
    name: 'Burj Crown, Downtown',
    location: 'Downtown Dubai',
    type: 'Apartment',
    price: 2100000,
    beds: 1,
    baths: 2,
    size: 780,
    status: 'Off-Plan',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'],
    description: 'A signature Downtown address with direct views of the Burj Khalifa fountains.',
    amenities: ['WiFi', 'Swimming Pool', 'Covered Parking', '24/7 Security'],
  },
  {
    id: 'prop-002',
    name: 'Palm Beach Villas',
    location: 'Palm Jumeirah',
    type: 'Villa',
    price: 14500000,
    beds: 5,
    baths: 6,
    size: 6200,
    status: 'Ready',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'],
    description: 'Beachfront villa on Palm Jumeirah with private pool and direct sea access.',
    amenities: ['Beach Access', 'Swimming Pool', 'Smart Home', 'Concierge'],
  },
  {
    id: 'prop-003',
    name: 'Emaar South Townhouses',
    location: 'Dubai South',
    type: 'Townhouse',
    price: 1800000,
    beds: 3,
    baths: 4,
    size: 2100,
    status: 'Off-Plan',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'],
    description: 'Family-friendly community close to Expo City and Al Maktoum Airport.',
    amenities: ['Covered Parking', 'Gym Access', '24/7 Security'],
  },
];

const SEED_HOLIDAYS: ItemProperty[] = [
  {
    id: 'hol-001',
    name: 'Marina Skyline Loft',
    location: 'Dubai Marina',
    type: 'Holiday Home',
    price: 1450,
    beds: 2,
    baths: 2,
    size: 1100,
    status: 'Available',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'],
    description: 'Fully furnished marina-view loft, professionally managed and cleaned between stays.',
    amenities: ['WiFi', 'Swimming Pool', 'Covered Parking', 'Air Conditioning'],
  },
  {
    id: 'hol-002',
    name: 'Palm Beachfront Villa',
    location: 'Palm Jumeirah',
    type: 'Holiday Home',
    price: 6200,
    beds: 5,
    baths: 5,
    size: 5800,
    status: 'Booked',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'],
    description: 'Private beach villa with pool, ideal for family groups and extended stays.',
    amenities: ['Beach Access', 'Swimming Pool', 'WiFi', 'Air Conditioning'],
  },
];

const SEED_MEETINGS: MeetingRequest[] = [
  { id: 'mtg-001', name: 'Sara Al Farsi', email: 'sara.alfarsi@email.com', phone: '+971 55 123 4567', service: 'Luxury Properties', date: '2026-09-18', time: '10:30', status: 'Pending' },
  { id: 'mtg-002', name: 'Thomas Weber', email: 'thomas.weber@email.com', phone: '+49 170 555 2211', service: 'Investment Consultancy', date: '2026-09-20', time: '14:00', status: 'Handled' },
];

const SEED_BOOKINGS: BookingRequest[] = [
  { id: 'bkg-001', clientName: 'Amira Khalil', clientEmail: 'amira.k@email.com', clientPhone: '+971 50 987 6543', itemName: 'Marina Skyline Loft', checkIn: '2026-10-02', checkOut: '2026-10-06', totalPrice: 5800, status: 'Confirmed' },
  { id: 'bkg-002', clientName: 'James Whitfield', clientEmail: 'j.whitfield@email.com', clientPhone: '+44 7700 900123', itemName: 'Palm Beachfront Villa', checkIn: '2026-11-14', checkOut: '2026-11-21', totalPrice: 43400, status: 'Pending' },
];

const SEED_USERS: UserAccount[] = [
  { id: 'usr-001', name: 'Oravya Admin', email: 'admin@oravya.net', role: 'ADMIN' },
  { id: 'usr-002', name: 'Amira Khalil', email: 'amira.k@email.com', role: 'CLIENT' },
  { id: 'usr-003', name: 'James Whitfield', email: 'j.whitfield@email.com', role: 'CLIENT' },
];

// --- Store Getters & Setters ------------------------------------------------

export function getStoredItems(key: 'oravya_properties' | 'oravya_holidays'): ItemProperty[] {
  const seed = key === 'oravya_holidays' ? SEED_HOLIDAYS : SEED_PROPERTIES;
  return readList<ItemProperty>(key, seed);
}

export function saveStoredItems(key: 'oravya_properties' | 'oravya_holidays', list: ItemProperty[]) {
  writeList(key, list);
}

export function getStoredMeetings(): MeetingRequest[] {
  return readList<MeetingRequest>('oravya_meetings', SEED_MEETINGS);
}

export function saveStoredMeetings(list: MeetingRequest[]) {
  writeList('oravya_meetings', list);
}

export function getStoredBookings(): BookingRequest[] {
  return readList<BookingRequest>('oravya_bookings', SEED_BOOKINGS);
}

export function saveStoredBookings(list: BookingRequest[]) {
  writeList('oravya_bookings', list);
}

export function getStoredUsers(): UserAccount[] {
  return readList<UserAccount>('oravya_users', SEED_USERS);
}

export function saveStoredUsers(list: UserAccount[]) {
  writeList('oravya_users', list);
}

export function saveStoredBooking(booking: BookingRequest) {
  const current = getStoredBookings();
  const updated = [booking, ...current];
  saveStoredBookings(updated);
}

export function saveStoredMeeting(meeting: MeetingRequest) {
  const current = getStoredMeetings();
  const updated = [meeting, ...current];
  saveStoredMeetings(updated);
}