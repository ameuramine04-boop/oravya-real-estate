import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET : Récupérer toutes les propriétés depuis MySQL
export async function GET() {
  try {
    const properties = await prisma.property.findMany();
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des propriétés' }, { status: 500 });
  }
}

// POST : Ajouter une nouvelle propriété (pour le futur panneau admin d'Omayma)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, type, price, beds, baths, size, status, featured } = body;

    const newProperty = await prisma.property.create({
      data: {
        name,
        location,
        type,
        price: parseFloat(price),
        beds: parseInt(beds),
        baths: parseInt(baths),
        size: parseFloat(size),
        status,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création de la propriété' }, { status: 500 });
  }
}