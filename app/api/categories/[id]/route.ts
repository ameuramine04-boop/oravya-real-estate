import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, icon, sortOrder, active } = body;
    const item = await prisma.propertyCategory.update({
      where: { id },
      data: {
        name,
        description,
        icon: icon || 'Building2',
        sortOrder: parseInt(sortOrder) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error('Erreur PUT category:', error);
    return NextResponse.json({ error: 'Erreur modification' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.propertyCategory.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur DELETE category:', error);
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
  }
}
