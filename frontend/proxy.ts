import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = [
  '/dashboard', '/leads', '/meeting', '/analytics',
  '/followup', '/insights', '/scoring', '/activity',
  '/copilot', '/docs',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some(p =>
    pathname === p || pathname.startsWith(p + '/')
  )

  const auth = request.cookies.get('salesmind_auth')
  const isAuthenticated = !!auth?.value

  // If user is logged in, prevent them from going back to login/signup
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is trying to access a protected route without being logged in
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
