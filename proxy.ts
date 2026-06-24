import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const getSecret = () => new TextEncoder().encode(JWT_SECRET ?? '');

const protectedPaths = ['/admin'];

interface JwtPayload extends JWTPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const data = payload as JwtPayload;

    if (data.role !== 'admin') {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
