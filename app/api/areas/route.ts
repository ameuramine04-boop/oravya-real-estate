import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(agents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const languages = formData.get('languages') as string;
    const specialty = formData.get('specialty') as string;
    const active = formData.get('active') === 'true';
    
    const file = formData.get('photo') as File | null;
    let photoUrl = '';

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/agents');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      photoUrl = `/uploads/agents/${uniqueName}`;
    }

    const newAgent = await prisma.agent.create({
      data: { name, email, phone, languages, specialty, active, photo: photoUrl || null }
    });
    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const languages = formData.get('languages') as string;
    const specialty = formData.get('specialty') as string;
    const active = formData.get('active') === 'true';
    
    const file = formData.get('photo') as File | null;
    let photoUrl = formData.get('existingPhoto') as string; 

    if (file && typeof file === 'object' && file.name) {
      const uploadDir = path.join(process.cwd(), 'public/uploads/agents');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      photoUrl = `/uploads/agents/${uniqueName}`; 
    }

    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: { name, email, phone, languages, specialty, active, photo: photoUrl || null }
    });
    return NextResponse.json(updatedAgent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.agent.delete({ where: { id } });
    return NextResponse.json({ message: 'Agent deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
}