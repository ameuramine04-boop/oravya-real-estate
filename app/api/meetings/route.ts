import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(meetings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, service, date, time, message, status } = body;

    const newMeeting = await prisma.meeting.create({
      data: {
        name,
        email,
        phone,
        service,
        date,
        time,
        message: message || null,
        status: status || 'Pending',
      }
    });

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, phone, service, date, time, message, status } = body;

    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        service,
        date,
        time,
        message: message || null,
        status,
      }
    });

    return NextResponse.json(updatedMeeting, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.meeting.delete({ where: { id } });
    return NextResponse.json({ message: 'Meeting deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}