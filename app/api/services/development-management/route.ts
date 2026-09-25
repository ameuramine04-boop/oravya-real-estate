import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dbServiceRecord = {
      id: 3,
      slug: 'development-management',
      title: 'Real Estate Development Management Services',
      subtitle: 'Real estate profit captured at the development level — the margin normally reserved for developers, made accessible to investors.',
      description: 'Oravya Development Management Services was founded on the principle that exceptional returns are unlocked by solving complex industry challenges. We enable private and institutional investors to capture real estate profit margins from inception at the development level — opportunities typically restricted to master developers. Through our comprehensive 360-degree ecosystem encompassing market research, financial modelling, and construction oversight, we maximize capital growth and secure unparalleled profits.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop'
      ]),
      vision: 'To be the leading provider of innovative and transparent real estate development management solutions, empowering investors to build unique and high-yield real estate assets in Dubai.',
      benefits: JSON.stringify([
        'Capture developer-level profit margins from inception',
        'Comprehensive 360-degree real estate ecosystem & feasibility modeling',
        'Expert construction management and milestone tracking',
        'Transparent financial reporting and risk mitigation'
      ])
    };

    return NextResponse.json(dbServiceRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}