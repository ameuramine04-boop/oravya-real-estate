import { NextResponse } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Récupérer tous les projets
export async function GET() {
  try {
    const projects = await prisma.newProject.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erreur GET:", error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// Créer un nouveau projet avec upload d'images
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1. Extraire les données textuelles
    const name = formData.get('name') as string;
    const developer = formData.get('developer') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;
    const price = parseFloat(formData.get('price') as string);
    const status = formData.get('status') as string;
    const handover = formData.get('handover') as string;
    const paymentPlan = formData.get('paymentPlan') as string;
    const surface = formData.get('surface') as string;
    const bedrooms = formData.get('bedrooms') as string;
    const description = formData.get('description') as string;
    const amenities = formData.get('amenities') as string; // Chaine JSON
    
    // 2. Gérer l'upload des images
    const files = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    // Créer le dossier uploads/projects physiquement s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public/uploads/projects');
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Nom de fichier unique
        const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, uniqueName);
        
        await writeFile(filePath, buffer);
        imageUrls.push(`/uploads/projects/${uniqueName}`); // Le chemin URL pour Next.js
      }
    }

    // 3. Sauvegarder dans MySQL
    const newProject = await prisma.newProject.create({
      data: {
        name, developer, type, location, price, status, handover, 
        paymentPlan, surface, bedrooms, description, amenities,
        images: JSON.stringify(imageUrls),
      }
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Erreur POST:", error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}