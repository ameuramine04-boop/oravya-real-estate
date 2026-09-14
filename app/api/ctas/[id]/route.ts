import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { label, href, description, icon, sortOrder, active } = body;
    const item = await prisma.homeCta.update({
      where: { id },
      data: {
        label,
        href,
        description: description || '',
        icon: icon || 'ArrowRight',
        sortOrder: parseInt(sortOrder) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT cta:', error);
    return NextResponse.json({ error: 'Erreur modification CTA' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.homeCta.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur DELETE cta:', error);
    return NextResponse.json({ error: 'Erreur suppression CTA' }, { status: 500 });
  }
}
