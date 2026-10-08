import { NextResponse } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const bookings = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientName, clientEmail, clientPhone, assetName, startDate, endDate, status, notes } = body;

    const newBooking = await prisma.reservation.create({
      data: {
        clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        assetName,
        startDate: new Date(startDate), 
        endDate: new Date(endDate),
        status: status || 'Pending',
        notes: notes || null,
      }
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, clientName, clientEmail, clientPhone, assetName, startDate, endDate, status, notes } = body;

    const updatedBooking = await prisma.reservation.update({
      where: { id },
      data: {
        clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        assetName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        notes: notes || null,
      }
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.reservation.delete({ where: { id } });
    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}