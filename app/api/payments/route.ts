import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. LIRE (GET)
export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

// 2. CRÉER (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientName, reference, type, totalAmount, paidAmount, dueDate, status } = body;

    const newPayment = await prisma.payment.create({
      data: {
        clientName,
        reference,
        type,
        totalAmount: parseFloat(totalAmount),
        paidAmount: parseFloat(paidAmount),
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'Pending',
      }
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error("Erreur POST Payments:", error);
    return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 });
  }
}

// 3. MODIFIER (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, clientName, reference, type, totalAmount, paidAmount, dueDate, status } = body;

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        clientName,
        reference,
        type,
        totalAmount: parseFloat(totalAmount),
        paidAmount: parseFloat(paidAmount),
        dueDate: dueDate ? new Date(dueDate) : null,
        status,
      }
    });

    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment record' }, { status: 500 });
  }
}

// 4. SUPPRIMER (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.payment.delete({ where: { id } });
    return NextResponse.json({ message: 'Payment record deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete payment record' }, { status: 500 });
  }
}