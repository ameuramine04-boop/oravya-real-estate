'use client';
import Navbar from '@/components/Navbar';
import { Fraunces } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'] });

export default function NewProjectsPage() {
  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-20">
        <h1 className={`${fraunces.className} text-5xl font-medium mb-6`}>Latest Launches & New Projects</h1>
        <p className="text-[#685248] text-lg font-light">Discover the most anticipated off-plan developments in Dubai.</p>
        <div className="mt-12 p-10 border border-[#D8CEBE] rounded-3xl bg-[#EBE4DA] text-center">
          <p>Project listings will be implemented here.</p>
        </div>
      </main>
    </div>
  );
}
