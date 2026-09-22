import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Réservé aux administrateurs
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { label, href, description, icon, sortOrder, active } = body;
    
    const item = await prisma.homeCta.update({
      where: { id },
      data: {
        label: label ? label.trim() : undefined,
        href: href ? href.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        icon: icon || 'ArrowRight',
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) || 0 : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT cta:', error);
    return NextResponse.json({ error: 'Erreur modification CTA' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification de sécurité : Réservé aux administrateurs
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.homeCta.delete({ where: { id } });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur DELETE cta:', error);
    return NextResponse.json({ error: 'Erreur suppression CTA' }, { status: 500 });
  }
}