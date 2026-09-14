import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, authorName, location, investment, quote, rating } = body;

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(authorName !== undefined && { authorName }),
        ...(location !== undefined && { location }),
        ...(investment !== undefined && { investment }),
        ...(quote !== undefined && { quote }),
        ...(rating !== undefined && { rating: parseInt(rating) || 5 }),
      },
    });

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT review:', error);
    return NextResponse.json({ error: 'Erreur modification avis' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur DELETE review:', error);
    return NextResponse.json({ error: 'Erreur suppression avis' }, { status: 500 });
  }
}
