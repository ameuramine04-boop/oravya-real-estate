import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT : Modifier le statut d'une réunion
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, name, email, phone, service, date, time, message } = body;

    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(service !== undefined && { service }),
        ...(date !== undefined && { date }),
        ...(time !== undefined && { time }),
        ...(message !== undefined && { message }),
      },
    });

    return NextResponse.json(updatedMeeting, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT meeting:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// DELETE : Supprimer une réunion
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
