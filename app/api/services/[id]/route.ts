import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT : Modifier un service existant
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, tagline, description, icon, sortOrder, active } = body;

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title,
        tagline,
        description: description || '',
        icon: icon || 'Building2',
        sortOrder: parseInt(sortOrder) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT service:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// DELETE : Supprimer un service de MySQL
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur DELETE service:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
