import { NextResponse } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. LIRE (GET) - Récupérer toutes les demandes de vente
export async function GET() {
  try {
    const requests = await prisma.sellRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sell requests' }, { status: 500 });
  }
}

// 2. CRÉER (POST) - Ajouter manuellement une demande (ex: reçue par téléphone)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ownerName, email, phone, propertyType, location, expectedPrice, message, status } = body;

    const newRequest = await prisma.sellRequest.create({
      data: {
        ownerName,
        email,
        phone,
        propertyType,
        location,
        expectedPrice: expectedPrice ? parseFloat(expectedPrice) : null,
        message: message || null,
        status: status || 'Pending'
      }
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sell request' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT) - Mettre à jour les infos ou le STATUT (ex: "Contacted", "Listed")
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ownerName, email, phone, propertyType, location, expectedPrice, message, status } = body;

    const updatedRequest = await prisma.sellRequest.update({
      where: { id },
      data: {
        ownerName,
        email,
        phone,
        propertyType,
        location,
        expectedPrice: expectedPrice ? parseFloat(expectedPrice) : null,
        message: message || null,
        status
      }
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sell request' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE) - Effacer une demande (ex: Spam)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.sellRequest.delete({ where: { id } });
    return NextResponse.json({ message: 'Sell request deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sell request' }, { status: 500 });
  }
}