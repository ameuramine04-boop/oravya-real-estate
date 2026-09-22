import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT : Modifier le statut ou les détails d'une réunion (Réservé aux administrateurs)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut modifier une réunion
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, name, email, phone, service, date, time, message } = body;

    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        ...(status !== undefined && { status: status.trim() }),
        ...(name !== undefined && { name: name.trim() }),
        ...(email !== undefined && { email: email.trim().toLowerCase() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(service !== undefined && { service: service.trim() }),
        ...(date !== undefined && { date: date.trim() }),
        ...(time !== undefined && { time: time.trim() }),
        ...(message !== undefined && { message: message.trim() }),
      },
    });

    return NextResponse.json(updatedMeeting, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT meeting:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// DELETE : Supprimer une réunion (Réservé aux administrateurs)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut supprimer une réunion
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;

    await prisma.meeting.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur DELETE meeting:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}