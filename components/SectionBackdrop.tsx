'use client';

import { type ReactNode } from 'react';

const BACKDROPS = {
  soft: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop',
  city: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
  map: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1400&auto=format&fit=crop',
  lobby: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1400&auto=format&fit=crop',
  night: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop',
  villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1400&auto=format&fit=crop',
  marina: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1400&auto=format&fit=crop',
} as const;

export type BackdropKey = keyof typeof BACKDROPS;

export default function SectionBackdrop({
  children,
  variant = 'soft',
  className = '',
  overlay = 'bg-[#F2EDE4]/92',
  rounded = true,
}: {
  children: ReactNode;
  variant?: BackdropKey;
  className?: string;
  overlay?: string;
  rounded?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden bg-cover bg-center shadow-sm ${rounded ? 'rounded-3xl my-6' : ''} ${className}`}
      style={{ backgroundImage: `url('${BACKDROPS[variant]}')` }}
    >
      <div className={`absolute inset-0 ${overlay} backdrop-blur-[2px]`} />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
