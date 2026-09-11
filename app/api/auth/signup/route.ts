import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé.' },
        { status: 400 }
      );
    }

    // Créer le nouvel utilisateur dans MySQL
    // (Note : Pour un projet en production, pense à hacher le mot de passe avec bcrypt)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Stocké en clair pour l'instant (à sécuriser plus tard avec bcrypt)
        phone,
        role: 'USER', // Rôle utilisateur classique par défaut
      },
    });

    return NextResponse.json(
      { message: 'Compte créé avec succès !', user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du compte.' },
      { status: 500 }
    );
  }
}