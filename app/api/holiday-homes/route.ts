import { NextResponse } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Récupérer toutes les Holiday Homes
export async function GET() {
  try {
    const holidayHomes = await prisma.holidayHome.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(holidayHomes);
  } catch (error) {
    console.error("Erreur GET Holiday Homes:", error);
    return NextResponse.json({ error: 'Failed to fetch holiday homes' }, { status: 500 });
  }
}

// Ajouter une nouvelle Holiday Home avec upload d'images
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1. Extraire les données textuelles (selon le schéma Prisma)
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const pricePerNight = parseFloat(formData.get('pricePerNight') as string);
    const beds = parseInt(formData.get('beds') as string);
    const maxGuests = parseInt(formData.get('maxGuests') as string);
    const active = formData.get('active') === 'true';
    const description = formData.get('description') as string;
    const amenities = formData.get('amenities') as string; // Chaine JSON
    
    // 2. Gérer l'upload des images
    const files = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    const uploadDir = path.join(process.cwd(), 'public/uploads/holiday-homes');
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, uniqueName);
        
        await writeFile(filePath, buffer);
        imageUrls.push(`/uploads/holiday-homes/${uniqueName}`);
      }
    }

    // 3. Sauvegarder dans MySQL (Table 'HolidayHome')
    const newHolidayHome = await prisma.holidayHome.create({
      data: {
        name, location, pricePerNight, beds, maxGuests, active,
        description, amenities,
        images: JSON.stringify(imageUrls),
      }
    });

    return NextResponse.json(newHolidayHome, { status: 201 });
  } catch (error) {
    console.error("Erreur POST Holiday Homes:", error);
    return NextResponse.json({ error: 'Failed to create holiday home' }, { status: 500 });
  }
}