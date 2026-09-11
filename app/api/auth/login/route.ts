import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Connexion réussie !', 
        user: { id: user.id, name: user.name, email: user.email, role: user.role } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur login:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue sur le serveur.' },
      { status: 500 }
    );
  }
}