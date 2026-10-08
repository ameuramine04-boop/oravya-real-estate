import { NextResponse } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const developers = await prisma.developer.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(developers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch developers' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    const file = formData.get('logo') as File | null;
    let logoUrl = '';

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/developers');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      logoUrl = `/uploads/developers/${uniqueName}`;
    }

    const newDeveloper = await prisma.developer.create({
      data: { name, description, logo: logoUrl || null }
    });
    return NextResponse.json(newDeveloper, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create developer' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    const file = formData.get('logo') as File | null;
    let logoUrl = formData.get('existingLogo') as string; // Garde l'ancien logo si non modifié

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/developers');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      logoUrl = `/uploads/developers/${uniqueName}`; // Nouveau logo
    }

    const updatedDeveloper = await prisma.developer.update({
      where: { id },
      data: { name, description, logo: logoUrl || null }
    });
    return NextResponse.json(updatedDeveloper, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update developer' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.developer.delete({ where: { id } });
    return NextResponse.json({ message: 'Developer deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete developer' }, { status: 500 });
  }
}