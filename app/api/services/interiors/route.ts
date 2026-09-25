import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dbServiceRecord = {
      id: 4,
      slug: 'interiors',
      title: 'Interior Design & Fit-Out Services in Dubai',
      subtitle: 'Design, build and deliver under one roof: from the feasibility model to the light fittings.',
      description: 'Oravya Interiors embodies visionary architecture and design excellence, delivered through a seamless development management approach. Every villa and high-end residence is thoughtfully planned, expertly coordinated and meticulously executed — blending Nordic minimalism with luxurious aesthetics. From concept to handover, each stage is managed with precision, ensuring homes that are visually striking and functionally exceptional.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop'
      ]),
      vision: 'Blending Nordic minimalism with bespoke luxury craftsmanship to deliver turnkey living spaces that redefine elegance and functionality in Dubai.',
      services_grid: JSON.stringify([
        {
          title: 'Development Management (360 Solutions)',
          desc: 'End-to-end real estate development services from financial structuring and ROI feasibility to construction and asset leasing.'
        },
        {
          title: 'Construction Project Management',
          desc: 'Full spectrum project life-cycle management, regulatory compliance, quality control, strict budgeting, and risk mitigation.'
        },
        {
          title: 'Construction Services',
          desc: 'Base-build development, enabling works, civil works, MEP installations, swimming pools, landscaping, and waterproofing.'
        },
        {
          title: 'Fit-Out Services',
          desc: 'Turnkey fit-out solutions, aluminium façades, joinery, glass, custom lighting, smart home automation, spas, and bespoke furniture.'
        },
        {
          title: 'Design Services',
          desc: 'Comprehensive architecture, interior design, FF&E selection, detailed shop drawings, and rigorous design supervision.'
        },
        {
          title: 'MEP Services',
          desc: 'Mechanical, electrical, and plumbing solutions ensuring seamless integration, energy efficiency, safety, and sustainability.'
        }
      ])
    };

    return NextResponse.json(dbServiceRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}