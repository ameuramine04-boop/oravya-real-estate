import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const areas = await prisma.area.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(areas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch areas' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    const file = formData.get('image') as File | null;
    let imageUrl = '';

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/areas');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      imageUrl = `/uploads/areas/${uniqueName}`;
    }

    const newArea = await prisma.area.create({
      data: { name, description, image: imageUrl || null }
    });
    return NextResponse.json(newArea, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create area' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    const file = formData.get('image') as File | null;
    let imageUrl = formData.get('existingImage') as string; // Garde l'ancienne image si non modifiée

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/areas');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      imageUrl = `/uploads/areas/${uniqueName}`; // Nouvelle image
    }

    const updatedArea = await prisma.area.update({
      where: { id },
      data: { name, description, image: imageUrl || null }
    });
    return NextResponse.json(updatedArea, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update area' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.area.delete({ where: { id } });
    return NextResponse.json({ message: 'Area deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete area' }, { status: 500 });
  }
}