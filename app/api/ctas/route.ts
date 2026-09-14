import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function ensureCtas() {
  const count = await prisma.homeCta.count();
  if (count > 0) return;
  await prisma.homeCta.createMany({
    data: [
      { label: 'Buy Property', href: '/properties', description: 'Browse ready & investment homes', icon: 'Building2', sortOrder: 1 },
      { label: 'Rent Holiday Homes', href: '/holiday-homes', description: 'Premium short stays in Dubai', icon: 'Home', sortOrder: 2 },
      { label: 'Sell / List', href: '/contact?service=Resale%20Properties', description: 'List your property with Oravya', icon: 'Tag', sortOrder: 3 },
      { label: 'VIP Advisory', href: '/contact?service=Investment%20Consultancy', description: 'Private investor guidance', icon: 'Crown', sortOrder: 4 },
      { label: 'Exclusive Off-Plan', href: '/properties?status=Off-Plan', description: 'Early access to new launches', icon: 'Sparkles', sortOrder: 5 },
    ],
  });
}

export async function GET(request: Request) {
  try {
    await ensureCtas();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === '1';
    const ctas = await prisma.homeCta.findMany({
      where: all ? undefined : { active: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(ctas, { status: 200 });
  } catch (error) {
    console.error('Erreur GET ctas:', error);
    return NextResponse.json({ error: 'Erreur récupération CTAs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, href, description, icon, sortOrder, active } = body;
    if (!label || !href) {
      return NextResponse.json({ error: 'Label and href required' }, { status: 400 });
    }
    const item = await prisma.homeCta.create({
      data: {
        label,
        href,
        description: description || '',
        icon: icon || 'ArrowRight',
        sortOrder: parseInt(sortOrder) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Erreur POST cta:', error);
    return NextResponse.json({ error: 'Erreur création CTA' }, { status: 500 });
  }
}
