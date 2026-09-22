'use client';
import Navbar from '@/components/Navbar';
import { Fraunces } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'] });

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-20">
        <h1 className={`${fraunces.className} text-5xl font-medium mb-6`}>Explore Dubai Real Estate</h1>
        <p className="text-[#685248] text-lg font-light">Guides, developer insights, and market trends to help you make the right decision.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-10 border border-[#D8CEBE] rounded-3xl bg-[#EBE4DA]">
            <h3 className="text-xl font-bold mb-2">Developer Directory</h3>
            <p className="text-sm text-[#685248] mb-4">Learn about the top builders in Dubai.</p>
            <span className="text-xs font-semibold text-[#4A151B] cursor-pointer hover:underline">Explore Developers →</span>
          </div>
          <div className="p-10 border border-[#D8CEBE] rounded-3xl bg-[#EBE4DA]">
            <h3 className="text-xl font-bold mb-2">Investment Guides</h3>
            <p className="text-sm text-[#685248] mb-4">How to invest in Dubai as a foreigner.</p>
            <span className="text-xs font-semibold text-[#4A151B] cursor-pointer hover:underline">Read Guides →</span>
          </div>
        </div>
      </main>
    </div>
  );
}
