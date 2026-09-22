import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT : Modifier un service existant (Réservé aux administrateurs)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut modifier un service
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, tagline, description, icon, sortOrder, active } = body;

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(tagline !== undefined && { tagline: tagline.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(icon !== undefined && { icon: icon || 'Building2' }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) || 0 }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT service:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// DELETE : Supprimer un service de MySQL (Réservé aux administrateurs)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut supprimer un service
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

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