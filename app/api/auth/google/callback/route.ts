import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=GoogleDenied', request.url));
  }

  try {
    // 1. Échanger le code contre un token d'accès
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: 'http://localhost:3000/api/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('Échec du token Google');

    // 2. Récupérer les informations du profil Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    // 3. Enregistrer ou trouver l'utilisateur dans MySQL via Prisma
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          role: 'USER',
        },
      });
    }

    const userData = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // 4. Renvoyer une page HTML de transition qui écrit proprement dans le localStorage
    const htmlResponse = `
      <html>
        <head>
          <title>Connexion en cours...</title>
        </head>
        <body style="background-color: #F2EDE4; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
          <div style="text-align: center; color: #4A151B;">
            <h2>Connexion réussie, redirection vers Oravya...</h2>
          </div>
          <script>
            localStorage.setItem('oravya_user', '${userData}');
            window.location.href = '/';
          </script>
        </body>
      </html>
    `;

    return new NextResponse(htmlResponse, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('Erreur Callback Google:', error);
    return NextResponse.redirect(new URL('/login?error=GoogleFailed', request.url));
  }
}