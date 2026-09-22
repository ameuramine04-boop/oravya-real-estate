import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Veuillez fournir un email et un mot de passe.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Vérification sécurisée du mot de passe haché
    // (Si ton utilisateur admin de test est en texte brut 'admin123', assure-toi de le hacher ou de gérer le cas spécifique si nécessaire)
    const isPasswordValid = user && user.password 
      ? await bcrypt.compare(password, user.password) 
      : false;

    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Connexion réussie !', 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
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