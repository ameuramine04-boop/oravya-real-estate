import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const trends = await prisma.marketTrend.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(trends);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market trends' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, value, description, category, direction } = body;

    const newTrend = await prisma.marketTrend.create({
      data: {
        title,
        value,
        description: description || null,
        category: category || 'General',
        direction: direction || 'Neutral',
      }
    });

    return NextResponse.json(newTrend, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create market trend' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, value, description, category, direction } = body;

    const updatedTrend = await prisma.marketTrend.update({
      where: { id },
      data: {
        title,
        value,
        description: description || null,
        category,
        direction,
      }
    });

    return NextResponse.json(updatedTrend, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update market trend' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.marketTrend.delete({ where: { id } });
    return NextResponse.json({ message: 'Market trend deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete market trend' }, { status: 500 });
  }
}