'use client';
import Navbar from '@/components/Navbar';
import { Fraunces } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'] });

export default function BuyPage() {
  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-20">
        <h1 className={`${fraunces.className} text-5xl font-medium mb-6`}>Properties for Sale</h1>
        <p className="text-[#685248] text-lg font-light">Find your dream home or a high-yield investment property in Dubai.</p>
        <div className="mt-12 p-10 border border-[#D8CEBE] rounded-3xl bg-[#EBE4DA] text-center">
          <p>Buy listings will be implemented here.</p>
        </div>
      </main>
    </div>
  );
}
