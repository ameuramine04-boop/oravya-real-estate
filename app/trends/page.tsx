'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fraunces } from 'next/font/google';
import { TrendingUp, BarChart3, Building, ArrowUpRight, ShieldAlert, FileText, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'] });

function formatAED(value: number) {
  if (value >= 1000000) return `AED ${(value / 1000000).toFixed(1)}M`;
  return `AED ${value.toLocaleString('en-US')}`;
}

export default function MarketTrendsPage() {
  const [trendsData, setTrendsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const res = await fetch('/api/trends');
        if (res.ok) {
          const data = await res.json();
          setTrendsData(data);
        } else {
          // Fallback dynamique si la route API n'est pas encore créée
          setTrendsData({
            averageROI: '8.4%',
            appreciationYoY: '+14.2%',
            totalSalesVolume: 'AED 125B+',
            offPlanShare: '64%',
            topCommunities: [
              { name: 'Palm Jumeirah', growth: '+18.5%', avgPrice: 16500000 },
              { name: 'Downtown Dubai', growth: '+15.2%', avgPrice: 4200000 },
              { name: 'Dubai Creek Harbour', growth: '+14.8%', avgPrice: 2900000 },
              { name: 'Dubai Hills Estate', growth: '+12.9%', avgPrice: 3800000 },
            ]
          });
        }
      } catch (err) {
        console.error('Erreur chargement tendances:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, []);

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C181A] font-sans selection:bg-[#4A151B] selection:text-[#F2EDE4]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-[#4A1F23] text-[#F5E1C7] py-28 px-6 border-b border-[#E7B6A5]/20 pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1F23]/95 via-[#4A1F23]/85 to-[#4A1F23]/75" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#E7B6A5] mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white">Dubai Real Estate Market Trends 2026</span>
          </div>

          <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-3 block">Data &amp; Analytics</span>
          <h1 className={`${fraunces.className} text-3xl md:text-5xl font-bold tracking-tight mb-4`}>
            Dubai Property Market Intelligence &amp; Trends
          </h1>
          <p className="text-[#F5E1C7]/90 font-light max-w-3xl text-sm md:text-base leading-relaxed">
            Real-time macroeconomic analysis, capital appreciation metrics, and community performance indexes curated for serious institutional and private investors.
          </p>
        </div>
      </section>

      {/* STATS HIGHLIGHTS GRID */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-30">
        {loading ? (
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center text-xs text-[#8C6D53]">Loading market statistics...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#E7B6A5]/60 rounded-3xl p-6 shadow-xl">
              <span className="text-[10px] uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Average Net ROI</span>
              <p className={`${fraunces.className} text-3xl font-bold text-[#4A1F23]`}>{trendsData?.averageROI}</p>
              <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Outperforming global hubs
              </p>
            </div>

            <div className="bg-white border border-[#E7B6A5]/60 rounded-3xl p-6 shadow-xl">
              <span className="text-[10px] uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">YoY Appreciation</span>
              <p className={`${fraunces.className} text-3xl font-bold text-[#4A1F23]`}>{trendsData?.appreciationYoY}</p>
              <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> High capital growth
              </p>
            </div>

            <div className="bg-white border border-[#E7B6A5]/60 rounded-3xl p-6 shadow-xl">
              <span className="text-[10px] uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Q1 Sales Volume</span>
              <p className={`${fraunces.className} text-3xl font-bold text-[#4A1F23]`}>{trendsData?.totalSalesVolume}</p>
              <p className="text-xs text-[#8C6D53] font-medium mt-2">Record-breaking market liquidity</p>
            </div>

            <div className="bg-white border border-[#E7B6A5]/60 rounded-3xl p-6 shadow-xl">
              <span className="text-[10px] uppercase tracking-widest text-[#8E3A47] font-bold block mb-1">Off-Plan Market Share</span>
              <p className={`${fraunces.className} text-3xl font-bold text-[#4A1F23]`}>{trendsData?.offPlanShare}</p>
              <p className="text-xs text-[#8C6D53] font-medium mt-2">Driven by master developers</p>
            </div>
          </div>
        )}
      </section>

      {/* TOP PERFORMING COMMUNITIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8E3A47] font-semibold mb-2 block">Performance Index</span>
            <h2 className={`${fraunces.className} text-2xl md:text-4xl font-bold text-[#4A1F23]`}>Top Performing Communities</h2>
          </div>
          <p className="text-xs text-[#8C6D53] max-w-sm">
            Analysis of capital appreciation and average transaction entry points across Dubai's most sought-after districts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendsData?.topCommunities?.map((comm: any, idx: number) => (
            <div key={idx} className="bg-white border border-[#E7B6A5]/50 rounded-3xl p-8 shadow-sm flex items-center justify-between hover:border-[#8E3A47] transition">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8E3A47] font-bold">District #{idx + 1}</span>
                <h3 className={`${fraunces.className} text-xl font-bold text-[#4A1F23] mt-1 mb-2`}>{comm.name}</h3>
                <p className="text-xs text-[#8C6D53]">Average entry price: <span className="font-semibold text-[#4A1F23]">{formatAED(comm.avgPrice)}</span></p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl">
                  {comm.growth} growth
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INVESTMENT ADVISORY CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-[#4A1F23] text-[#F5E1C7] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#E7B6A5] font-semibold mb-2 block">Customized Reports</span>
            <h3 className={`${fraunces.className} text-2xl md:text-3xl font-bold mb-4`}>Need a bespoke market valuation for your portfolio?</h3>
            <p className="text-xs md:text-sm text-[#F5E1C7]/80 font-light mb-8 leading-relaxed">
              Our research team provides institutional-grade advisory reports covering tax implications, golden visa compliance, and yield projections.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="bg-[#8E3A47] hover:bg-[#6B2B2E] text-[#F5E1C7] font-bold px-8 py-3.5 rounded-xl transition text-xs uppercase tracking-wider shadow-md">
                Request Analytical Report
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#8C6D53] border-t border-[#E7B6A5]/30">
        <p>© 2026 Oravya Real Estate. All rights reserved. Dubai, UAE.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/properties" className="hover:text-[#4A1F23] transition">Properties</Link>
          <Link href="/new-projects" className="hover:text-[#4A1F23] transition">New Projects</Link>
          <Link href="/agents" className="hover:text-[#4A1F23] transition">Advisors</Link>
          <Link href="/contact" className="hover:text-[#4A1F23] transition">Contact</Link>
        </div>
      </footer>
    </div>
  );
}