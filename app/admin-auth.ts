import { headers, cookies } from 'next/headers';
import { getChatGPTUser } from './chatgpt-auth';

// Server-side authorization check for Hazel's Admin Dashboard and mutation APIs
export async function isAuthorizedAdmin(request?: Request): Promise<boolean> {
  // 1. ChatGPT Sites authenticated user check
  try {
    const chatGPTUser = await getChatGPTUser();
    if (chatGPTUser?.email) {
      // In production hosting, ChatGPT user is authenticated
      return true;
    }
  } catch {
    // Continue to check admin key
  }

  // 2. Check X-Hazel-Admin-Key or Authorization header
  const reqHeaders = request ? request.headers : await headers();
  const headerKey = reqHeaders.get('x-hazel-admin-key') || reqHeaders.get('authorization')?.replace('Bearer ', '');
  const adminSecret = process.env.HAZEL_ADMIN_SECRET || 'hazel-dolls-secret-2026';

  if (headerKey && headerKey === adminSecret) {
    return true;
  }

  // 3. Check secure cookie
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('hazel_admin_token')?.value;
    if (cookieToken && cookieToken === adminSecret) {
      return true;
    }
  } catch {
    // Cookie store may not be available in all contexts
  }

  return false;
}

export function getAdminSecret(): string {
  return process.env.HAZEL_ADMIN_SECRET || 'hazel-dolls-secret-2026';
}
