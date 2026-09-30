import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Create a response
  const response = NextResponse.next()

  // Set CSP headers that allow our app to work
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' http://localhost:8001 http://127.0.0.1:8001;
    frame-src 'self';
  `.replace(/\s{2,}/g, ' ').trim()

  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}