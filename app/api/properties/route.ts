import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET : Récupérer toutes les propriétés depuis MySQL
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.error('Erreur GET properties:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des propriétés' }, { status: 500 });
  }
}

// POST : Ajouter une nouvelle propriété depuis l'administration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, type, price, beds, baths, size, status, featured, description, amenities, images } = body;

    const newProperty = await prisma.property.create({
      data: {
        name,
        location,
        type,
        price: parseFloat(price),
        beds: parseInt(beds) || 0,
        baths: parseInt(baths) || 0,
        size: parseFloat(size) || 0,
        status: status || 'Ready',
        featured: Boolean(featured),
        description: description || '',
        // Stockage sous forme de chaîne JSON pour correspondre aux types Prisma standards
        amenities: amenities ? JSON.stringify(amenities) : JSON.stringify([]),
        images: images ? JSON.stringify(images) : JSON.stringify(['/logo.png']),
      },
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Erreur POST property:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la propriété' }, { status: 500 });
  }
}