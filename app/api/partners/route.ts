import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const type = formData.get('type') as string; // ex: 'Banking', 'Legal', 'Interior Design'
    const link = formData.get('link') as string;
    
    const file = formData.get('logo') as File | null;
    let logoUrl = '';

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/partners');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      logoUrl = `/uploads/partners/${uniqueName}`;
    }

    const newPartner = await prisma.partner.create({
      data: { name, type, link: link || null, logo: logoUrl || null }
    });
    return NextResponse.json(newPartner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const link = formData.get('link') as string;
    
    const file = formData.get('logo') as File | null;
    let logoUrl = formData.get('existingLogo') as string;

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/partners');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      logoUrl = `/uploads/partners/${uniqueName}`;
    }

    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: { name, type, link: link || null, logo: logoUrl || null }
    });
    return NextResponse.json(updatedPartner, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.partner.delete({ where: { id } });
    return NextResponse.json({ message: 'Partner deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}