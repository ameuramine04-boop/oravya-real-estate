import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const idToken = formData.get('id_token') as string;
    const userString = formData.get('user') as string; // Apple envoie le nom et l'email ici à la toute première connexion

    if (!idToken) {
      return NextResponse.redirect(new URL('/login?error=AppleDenied', request.url));
    }

    // Décodage basique du jeton JWT d'Apple pour récupérer l'email (partie payload)
    const base64Url = idToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const applePayload = JSON.parse(jsonPayload);
    const email = applePayload.email;

    let name = 'Apple User';
    if (userString) {
      const userInfo = JSON.parse(userString);
      if (userInfo.name) {
        name = `${userInfo.name.firstName || ''} ${userInfo.name.lastName || ''}`.trim();
      }
    }

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=AppleEmailNotFound', request.url));
    }

    // Vérifier ou créer l'utilisateur dans MySQL via Prisma
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name !== '' ? name : 'Apple User',
          email,
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

    // Page HTML de transition qui écrit dans le localStorage puis redirige vers l'accueil
    const htmlResponse = `
      <html>
        <head><title>Connexion Apple en cours...</title></head>
        <body style="background-color: #F2EDE4; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
          <div style="text-align: center; color: #4A151B;">
            <h2>Connexion Apple réussie, redirection...</h2>
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
    console.error('Erreur Callback Apple:', error);
    return NextResponse.redirect(new URL('/login?error=AppleFailed', request.url));
  }
}