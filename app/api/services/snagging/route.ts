import { NextResponse } from 'next/server';
// Importe ton pool MySQL si nécessaire

export async function GET() {
  try {
    /* 
      Exemple MySQL :
      const [rows] = await pool.query('SELECT * FROM services WHERE slug = ?', ['snagging']);
      if (rows.length === 0) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      return NextResponse.json(rows[0]);
    */

    const dbServiceRecord = {
      id: 2,
      slug: 'snagging',
      title: 'Property Snagging & Inspection Services in Dubai',
      subtitle: 'An independent, engineer-led inspection before you take the keys — so the defects are the developer’s problem, not yours.',
      description: 'Purchasing a home in Dubai requires meticulous attention to detail to ensure everything is built and functioning to the highest standards. Oravya offers professional, independent pre-handover inspections for clients taking ownership of luxury villas, apartments, penthouses, or commercial assets. We provide comprehensive, detailed defect reports giving you complete peace of mind before signing handover documents.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1400&auto=format&fit=crop'
      ]),
      suitable_for: JSON.stringify([
        'Luxury Villas & Mansions',
        'Duplex Townhouses',
        'Branded Residences & Apartments',
        'Holiday Homes & Penthouses',
        'Corporate Offices & Retail Spaces'
      ]),
      benefits: JSON.stringify([
        'Independent, certified engineer-led inspection',
        'Comprehensive digital defect report with photographic evidence',
        'Pre-handover protection against unexpected repair costs',
        'Direct developer coordination for snag rectification'
      ])
    };

    return NextResponse.json(dbServiceRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}