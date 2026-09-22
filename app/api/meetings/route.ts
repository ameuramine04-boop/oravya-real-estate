import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET : Récupérer toutes les réunions (Réservé aux administrateurs)
export async function GET(request: Request) {
  try {
    // Vérification de sécurité : Seul un administrateur peut voir toutes les réunions
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(meetings, { status: 200 });
  } catch (error) {
    console.error('Erreur GET meetings:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des réunions' }, { status: 500 });
  }
}

// POST : Enregistrer une nouvelle demande de réunion (Ouvert au public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, date, time, message } = body;

    // Validation des champs obligatoires
    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMeeting = await prisma.meeting.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        service: service.trim(),
        date: date.trim(),
        time: time.trim(),
        message: message ? message.trim() : '',
        status: 'Pending',
      },
    });

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error) {
    console.error('Erreur POST meeting:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la réunion' }, { status: 500 });
  }
}