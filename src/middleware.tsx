import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that don't need authentication
    const publicRoutes = ['/login', '/api/login'];

    // Protected pages (excluding login and api routes)
    const protectedRoutes = !publicRoutes.includes(pathname);

    // Allow public routes without token
    if (publicRoutes.includes(pathname)) {
        // Redirect to dashboard if user is already logged in
        if (token && pathname === '/login') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next();
    }

    // Check authentication for protected pages
    if (protectedRoutes) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
