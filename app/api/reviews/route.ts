import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientName, title, comment, rating, propertyBought, active } = body;

    const newReview = await prisma.review.create({
      data: {
        clientName,
        title: title || null, // ex: "Investor from UK"
        comment,
        rating: parseInt(rating), // Convertir en nombre (ex: 5)
        propertyBought: propertyBought || null,
        active: active !== undefined ? active : true,
      }
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, clientName, title, comment, rating, propertyBought, active } = body;

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        clientName,
        title: title || null,
        comment,
        rating: parseInt(rating),
        propertyBought: propertyBought || null,
        active,
      }
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}