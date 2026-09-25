import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const oravyaServices = [
      {
        id: 1,
        slug: 'golden-visa',
        category: 'Residency',
        title: 'UAE Golden Visa',
        description: 'A ten-year residency through property you own. The AED 2M threshold, off-plan rules, and streamlined 30-day processing handled end-to-end.'
      },
      {
        id: 2,
        slug: 'master-agency',
        category: 'Development & Agency',
        title: 'Real Estate Master Agency',
        description: 'Acting as a master agency to streamline sales, orchestrate sub-agency networks, and drive high-velocity property transactions.'
      },
      {
        id: 3,
        slug: 'development-management',
        category: 'Investment',
        title: 'Real Estate Development Management',
        description: 'Real estate profit captured at the development level — the margin normally reserved for developers, made accessible to investors.'
      },
      {
        id: 4,
        slug: 'interiors',
        category: 'Design & Fit-Out',
        title: 'Interior Design & Fit-Out Services',
        description: 'Design, build and deliver under one roof: from feasibility models to custom light fittings, blending Nordic minimalism with bespoke luxury.'
      },
      {
        id: 5,
        slug: 'snagging',
        category: 'Inspection',
        title: 'Property Snagging & Inspection Services',
        description: 'An independent, engineer-led inspection before you take the keys — so construction defects are the developer’s problem, not yours.'
      },
      {
        id: 6,
        slug: 'sales',
        category: 'Transactions',
        title: 'Property Sales Services',
        description: 'Expertly managing off-plan and secondary market sales with precision, ensuring maximum returns for buyers and investors.'
      },
      {
        id: 7,
        slug: 'rental',
        category: 'Management',
        title: 'Property Rental Services',
        description: 'Comprehensive rental management designed to optimize rental yields, tenant relations, and asset occupancy rates.'
      },
      {
        id: 8,
        slug: 'conveyancing',
        category: 'Legal & Admin',
        title: 'Conveyancing Services',
        description: 'Streamlining property registrations, valuations, gifting, and full regulatory compliance with the Dubai Land Department.'
      },
      {
        id: 9,
        slug: 'mortgage',
        category: 'Finance',
        title: 'Mortgage Advisory and Brokerage',
        description: 'Tailored financial advisory and brokerage services to secure optimal mortgage structures for local and international clients.'
      },
      {
        id: 10,
        slug: 'holiday-homes',
        category: 'Short-Term',
        title: 'Holiday Homes Management',
        description: 'Managing short-term luxury rentals to provide exceptional guest experiences and maximize short-term investment yields.'
      }
    ];

    return NextResponse.json(oravyaServices);
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}