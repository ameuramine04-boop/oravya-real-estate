import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Récupérer toutes les propriétés Luxury (Marché Secondaire)
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Erreur GET Luxury:", error);
    return NextResponse.json({ error: 'Failed to fetch luxury properties' }, { status: 500 });
  }
}

// Créer une propriété de Luxe avec upload d'images
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const price = parseFloat(formData.get('price') as string);
    const beds = parseInt(formData.get('beds') as string);
    const baths = parseInt(formData.get('baths') as string);
    const size = parseFloat(formData.get('size') as string);
    const status = formData.get('status') as string; // Ready, Vacant, Tenanted
    const featured = formData.get('featured') === 'true';
    const description = formData.get('description') as string;
    const amenities = formData.get('amenities') as string; // Chaine JSON
    
    // Gérer l'upload des images (Drag & Drop)
    const files = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    const uploadDir = path.join(process.cwd(), 'public/uploads/luxury');
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, uniqueName);
        
        await writeFile(filePath, buffer);
        imageUrls.push(`/uploads/luxury/${uniqueName}`);
      }
    }

    // Sauvegarder dans MySQL (Table 'Property' du schéma)
    const newProperty = await prisma.property.create({
      data: {
        name, location, type, price, beds, baths, size, status, featured,
        description, amenities,
        images: JSON.stringify(imageUrls),
      }
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error("Erreur POST Luxury:", error);
    return NextResponse.json({ error: 'Failed to create luxury property' }, { status: 500 });
  }
}