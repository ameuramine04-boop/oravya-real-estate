import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.APPLE_CLIENT_ID || ''; // Ton Service ID Apple
  const redirectUri = 'http://localhost:3000/api/auth/apple/callback';

  // URL officielle d'authentification Apple
  const appleUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code%20id_token&scope=name%20email&response_mode=form_post`;

  return NextResponse.redirect(appleUrl);
}