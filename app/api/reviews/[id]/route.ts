import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut modifier ou modérer un avis
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, authorName, location, investment, quote, rating } = body;

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(status !== undefined && { status: status.trim() }),
        ...(authorName !== undefined && { authorName: authorName.trim() }),
        ...(location !== undefined && { location: location.trim() }),
        ...(investment !== undefined && { investment: investment.trim() }),
        ...(quote !== undefined && { quote: quote.trim() }),
        ...(rating !== undefined && { rating: Math.min(5, Math.max(1, parseInt(rating) || 5)) }),
      },
    });

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT review:', error);
    return NextResponse.json({ error: 'Erreur modification avis' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut supprimer un avis
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur DELETE review:', error);
    return NextResponse.json({ error: 'Erreur suppression avis' }, { status: 500 });
  }
}