import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Validation de base des champs requis
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé.' },
        { status: 400 }
      );
    }

    // Hacher le mot de passe de manière sécurisée (10 rounds de salage)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur dans MySQL avec le mot de passe haché
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword, // Mot de passe sécurisé et haché
        phone: phone ? phone.trim() : null,
        role: 'USER', // Rôle utilisateur classique par défaut
      },
    });

    return NextResponse.json(
      { 
        message: 'Compte créé avec succès !', 
        user: { 
          id: newUser.id, 
          email: newUser.email,
          name: newUser.name 
        } 
      },
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