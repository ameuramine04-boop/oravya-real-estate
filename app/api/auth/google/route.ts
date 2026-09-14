import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/google/callback`;

  // URL officielle de Google OAuth
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=email%20profile`;

  return NextResponse.redirect(googleUrl);
}