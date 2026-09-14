import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_SERVICES = [
  {
    title: 'Off Plan Properties',
    tagline: 'Premium projects — Smart investments',
    description:
      'Access exclusive off-plan developments with strong capital growth potential, flexible payment plans, and early-bird pricing before public launch.',
    icon: 'Building2',
    sortOrder: 1,
  },
  {
    title: 'Resale Properties',
    tagline: 'Great locations — Great value',
    description:
      'Curated ready and secondary-market homes in Dubai’s most demanded communities, priced for lifestyle and long-term appreciation.',
    icon: 'RefreshCcw',
    sortOrder: 2,
  },
  {
    title: 'Luxury Properties',
    tagline: 'Exclusive living — Extraordinary lifestyles',
    description:
      'Ultra-premium residences, penthouses and waterfront villas selected for privacy, design excellence and lasting prestige.',
    icon: 'Crown',
    sortOrder: 3,
  },
  {
    title: 'Rental Properties',
    tagline: 'Quality homes — Long-term comfort',
    description:
      'Quality rental homes and managed stays tailored for comfort, convenience and reliable long-term living in Dubai.',
    icon: 'KeyRound',
    sortOrder: 4,
  },
  {
    title: 'Investment Consultancy',
    tagline: 'Data-driven advice — Better returns',
    description:
      'Market analysis, yield projections and portfolio strategy so every acquisition is backed by clear numbers and local expertise.',
    icon: 'LineChart',
    sortOrder: 5,
  },
];

async function ensureDefaultServices() {
  const count = await prisma.service.count();
  if (count === 0) {
    await prisma.service.createMany({ data: DEFAULT_SERVICES });
  }
}

// GET : Récupérer tous les services depuis MySQL
export async function GET() {
  try {
    await ensureDefaultServices();
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Erreur GET services:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des services' }, { status: 500 });
  }
}

// POST : Ajouter un nouveau service depuis l'administration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, tagline, description, icon, sortOrder, active } = body;

    if (!title || !tagline) {
      return NextResponse.json({ error: 'Title and tagline are required' }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        title,
        tagline,
        description: description || '',
        icon: icon || 'Building2',
        sortOrder: parseInt(sortOrder) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Erreur POST service:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du service' }, { status: 500 });
  }
}
