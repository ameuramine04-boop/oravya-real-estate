import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT : Modifier une propriété existante
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, location, type, price, beds, baths, size, status, description, amenities, images } = body;

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        name,
        location,
        type,
        price: parseFloat(price),
        beds: parseInt(beds) || 0,
        baths: parseInt(baths) || 0,
        size: parseFloat(size) || 0,
        status: status || 'Ready',
        description: description || '',
        amenities: amenities ? JSON.stringify(amenities) : JSON.stringify([]),
        images: images ? JSON.stringify(images) : JSON.stringify([]),
      },
    });

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT property:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// DELETE : Supprimer une propriété de MySQL
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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