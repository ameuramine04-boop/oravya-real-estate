import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET : Récupérer toutes les réunions depuis MySQL
export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(meetings, { status: 200 });
  } catch (error) {
    console.error('Erreur GET meetings:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des réunions' }, { status: 500 });
  }
}

// POST : Enregistrer une nouvelle demande de réunion
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, date, time, message } = body;

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMeeting = await prisma.meeting.create({
      data: {
        name,
        email,
        phone,
        service,
        date,
        time,
        message: message || '',
        status: 'Pending',
      },
    });

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error) {
    console.error('Erreur POST meeting:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la réunion' }, { status: 500 });
  }
}
