import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET : Récupérer toutes les propriétés depuis MySQL (Ouvert au public)
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

// POST : Ajouter une nouvelle propriété depuis l'administration (Réservé aux administrateurs)
export async function POST(request: Request) {
  try {
    // Vérification de sécurité : Seul un administrateur peut créer une propriété
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, location, type, price, beds, baths, size, status, featured, description, amenities, images } = body;

    // Validation des champs critiques
    if (!name || !location || !type || price === undefined) {
      return NextResponse.json(
        { error: 'Veuillez remplir les champs obligatoires (nom, localisation, type, prix).' },
        { status: 400 }
      );
    }

    const newProperty = await prisma.property.create({
      data: {
        name: name.trim(),
        location: location.trim(),
        type: type.trim(),
        price: parseFloat(price) || 0,
        beds: parseInt(beds) || 0,
        baths: parseInt(baths) || 0,
        size: parseFloat(size) || 0,
        status: status ? status.trim() : 'Ready',
        featured: Boolean(featured),
        description: description ? description.trim() : '',
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