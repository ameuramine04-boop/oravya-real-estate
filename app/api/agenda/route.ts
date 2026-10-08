import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. LIRE (GET) - Trie par date croissante pour voir les événements à venir en premier
export async function GET() {
  try {
    const events = await prisma.agendaEvent.findMany({
      orderBy: { date: 'asc' }
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agenda events' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, date, type, participants, notes } = body;

    const newEvent = await prisma.agendaEvent.create({
      data: {
        title,
        date: new Date(date), // Date et Heure
        type,
        participants: participants || null,
        notes: notes || null,
      }
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create agenda event' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, date, type, participants, notes } = body;

    const updatedEvent = await prisma.agendaEvent.update({
      where: { id },
      data: {
        title,
        date: new Date(date),
        type,
        participants: participants || null,
        notes: notes || null,
      }
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update agenda event' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.agendaEvent.delete({ where: { id } });
    return NextResponse.json({ message: 'Agenda event deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete agenda event' }, { status: 500 });
  }
}