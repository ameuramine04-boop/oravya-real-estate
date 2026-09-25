import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const servicesList = [
      {
        id: 1,
        slug: 'golden-visa',
        category: 'Residency',
        title: 'UAE Golden Visa',
        description: 'A ten-year residency through property you already own, or are about to. The AED 2M threshold, how off-plan and mortgaged homes count, and the three steps to applying.'
      },
      {
        id: 2,
        slug: 'master-agency',
        category: 'Development & Agency',
        title: 'Real Estate Master Agency',
        description: 'Acting as a master agency to streamline and manage property transactions, coordinating sub-agencies and driving sales velocity.'
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
        description: 'Design, build and deliver under one roof: from the feasibility model to the light fittings, blending Nordic minimalism with luxury.'
      },
      {
        id: 5,
        slug: 'snagging',
        category: 'Inspection',
        title: 'Property Snagging & Inspection Services',
        description: 'An independent, engineer-led inspection before you take the keys — so the defects are the developer’s problem, not yours.'
      },
      {
        id: 6,
        slug: 'sales',
        category: 'Transactions',
        title: 'Property Sales Services',
        description: 'Expertly managing off-plan and secondary sales for developers and private owners — delivered with precision and maximum returns.'
      },
      {
        id: 7,
        slug: 'rental',
        category: 'Management',
        title: 'Property Rental Services',
        description: 'Managing rental properties to optimize rental yields, tenant relations, and occupancy rates across prime Dubai locations.'
      },
      {
        id: 8,
        slug: 'conveyancing',
        category: 'Legal & Admin',
        title: 'Conveyancing Services',
        description: 'Streamlining property sales, property valuation, gifting, registration, and DLD regulatory compliance.'
      },
      {
        id: 9,
        slug: 'mortgage',
        category: 'Finance',
        title: 'Mortgage Advisory and Brokerage',
        description: 'Offering expert advice and tailored brokerage services for local and international property financing.'
      },
      {
        id: 10,
        slug: 'holiday-homes',
        category: 'Short-Term',
        title: 'Holiday Homes Management',
        description: 'Managing short-term luxury rental properties to provide exceptional guest experiences and higher yields.'
      },
      {
        id: 11,
        slug: 'mep',
        category: 'Engineering',
        title: 'MEP Services',
        description: 'Mechanical, electrical, and plumbing solutions ensuring seamless integration, energy efficiency, and safety.'
      },
      {
        id: 12,
        slug: 'proptech',
        category: 'Technology',
        title: 'PropTech & Market Data (DXB Interact)',
        description: 'Leveraging cutting-edge technology and data analytics to improve real estate transactions and market transparency.'
      }
    ];

    return NextResponse.json(servicesList);
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}