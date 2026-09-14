import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === '1';
    const reviews = await prisma.review.findMany({
      where: all ? undefined : { status: 'Approved' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Erreur GET reviews:', error);
    return NextResponse.json({ error: 'Erreur récupération avis' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authorName, location, investment, quote, rating } = body;

    if (!authorName?.trim() || !location?.trim() || !quote?.trim()) {
      return NextResponse.json({ error: 'Name, location and review are required' }, { status: 400 });
    }

    const stars = Math.min(5, Math.max(1, parseInt(rating) || 5));

    const review = await prisma.review.create({
      data: {
        authorName: authorName.trim(),
        location: location.trim(),
        investment: investment?.trim() || '',
        quote: quote.trim(),
        rating: stars,
        status: 'Pending',
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Erreur POST review:', error);
    return NextResponse.json({ error: 'Erreur envoi avis' }, { status: 500 });
  }
}
