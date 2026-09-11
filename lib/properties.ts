export interface Property {
  id: string;
  name: string;
  location: string;
  type: 'Apartment' | 'Villa' | 'Townhouse' | 'Penthouse' | 'Plot';
  price: number;
  beds: number;
  baths: number;
  size: number;
  status: 'Off-Plan' | 'Ready';
  featured?: boolean;
  images: string[];
}

export const INITIAL_PROPERTIES: Property[] = [
  { 
    id: 'bc-201', 
    name: 'Burj Crown, Downtown', 
    location: 'Downtown Dubai', 
    type: 'Apartment', 
    price: 2100000, 
    beds: 1, 
    baths: 2, 
    size: 780, 
    status: 'Off-Plan', 
    featured: true, 
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'] 
  },
  { 
    id: 'pbv-114', 
    name: 'Palm Beach Villas', 
    location: 'Palm Jumeirah', 
    type: 'Villa', 
    price: 14500000, 
    beds: 5, 
    baths: 6, 
    size: 6200, 
    status: 'Ready', 
    featured: true, 
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop'] 
  },
];

export function getStoredProperties(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;
  const stored = localStorage.getItem('oravya_properties');
  if (!stored) {
    localStorage.setItem('oravya_properties', JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PROPERTIES;
  }
}

export function saveStoredProperties(props: Property[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('oravya_properties', JSON.stringify(props));
}