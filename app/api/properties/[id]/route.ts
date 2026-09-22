import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET : Récupérer une propriété par id (Ouvert au public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return NextResponse.json({ error: 'Propriété introuvable' }, { status: 404 });
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error('Erreur GET property:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// PUT : Modifier une propriété existante (Réservé aux administrateurs)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut modifier une propriété
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, location, type, price, beds, baths, size, status, description, amenities, images } = body;

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(location !== undefined && { location: location.trim() }),
        ...(type !== undefined && { type: type.trim() }),
        ...(price !== undefined && { price: parseFloat(price) || 0 }),
        ...(beds !== undefined && { beds: parseInt(beds) || 0 }),
        ...(baths !== undefined && { baths: parseInt(baths) || 0 }),
        ...(size !== undefined && { size: parseFloat(size) || 0 }),
        ...(status !== undefined && { status: status.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(amenities !== undefined && { amenities: JSON.stringify(amenities) }),
        ...(images !== undefined && { images: JSON.stringify(images) }),
      },
    });

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT property:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// DELETE : Supprimer une propriété de MySQL (Réservé aux administrateurs)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut supprimer une propriété
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur DELETE property:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}