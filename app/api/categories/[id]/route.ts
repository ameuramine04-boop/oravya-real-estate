import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut modifier une catégorie
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, icon, sortOrder, active } = body;
    
    const item = await prisma.propertyCategory.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        description: description ? description.trim() : undefined,
        icon: icon || 'Building2',
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) || 0 : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });
    
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT category:', error);
    return NextResponse.json({ error: 'Erreur modification' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Seul un administrateur peut supprimer une catégorie
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.propertyCategory.delete({ where: { id } });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur DELETE category:', error);
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
  }
}