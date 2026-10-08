import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// 1. LIRE les infos de l'Admin (GET)
export async function GET() {
  try {
    // Pour l'instant, on récupère le premier utilisateur qui a le rôle 'Admin'
    // Dans le futur, tu utiliseras la session de l'utilisateur connecté (NextAuth)
    const admin = await prisma.user.findFirst({
      where: { role: 'Admin' }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    // On renvoie les infos, SAUF le mot de passe hashé pour des raisons de sécurité
    const { password, ...safeAdminData } = admin;
    return NextResponse.json(safeAdminData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin profile' }, { status: 500 });
  }
}

// 2. METTRE À JOUR le Profil et le Mot de Passe (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, currentPassword, newPassword } = body;

    // 1. Vérifier si l'admin existe
    const admin = await prisma.user.findUnique({ where: { id } });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const updateData: any = { name, email };

    // 2. Si l'utilisateur veut changer son mot de passe
    if (currentPassword && newPassword) {
      // Vérifier que le mot de passe actuel est correct
      // Attention : si c'est un test et que ton mot de passe actuel n'est pas haché dans la BDD, ça plantera.
      // Assure-toi que les mots de passe en BDD sont hachés avec bcrypt.
      const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
      }

      // Hacher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    // 3. Mettre à jour dans MySQL
    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Erreur mise à jour profil admin:", error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}