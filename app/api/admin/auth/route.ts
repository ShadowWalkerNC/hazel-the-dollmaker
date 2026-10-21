import { NextResponse } from 'next/server';
import { getAdminSecret, isAuthorizedAdmin } from '../../../admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { secret?: string };
    const adminSecret = getAdminSecret();

    if (!body.secret || body.secret !== adminSecret) {
      return NextResponse.json({ error: 'Invalid admin secret key.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, message: 'Admin authenticated.' });
    response.cookies.set('hazel_admin_token', adminSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const authorized = await isAuthorizedAdmin(request);
  return NextResponse.json({ authorized });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, message: 'Logged out.' });
  response.cookies.delete('hazel_admin_token');
  return response;
}
