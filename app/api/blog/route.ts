import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const shortDesc = formData.get('shortDesc') as string;
    const fullDesc = formData.get('fullDesc') as string;
    
    // Gérer l'upload de l'image
    const file = formData.get('image') as File | null;
    let imageUrl = '';

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/services');
      await mkdir(uploadDir, { recursive: true });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, uniqueName);
      
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/services/${uniqueName}`;
    }

    const newService = await prisma.service.create({
      data: {
        title,
        shortDesc: shortDesc || null,
        fullDesc: fullDesc || null,
        image: imageUrl || null,
      }
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const shortDesc = formData.get('shortDesc') as string;
    const fullDesc = formData.get('fullDesc') as string;
    
    // Gérer l'upload de l'image (conserver l'ancienne si non modifiée)
    const file = formData.get('image') as File | null;
    let imageUrl = formData.get('existingImage') as string; 

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/services');
      await mkdir(uploadDir, { recursive: true });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, uniqueName);
      
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/services/${uniqueName}`; 
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title,
        shortDesc: shortDesc || null,
        fullDesc: fullDesc || null,
        image: imageUrl || null,
      }
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}