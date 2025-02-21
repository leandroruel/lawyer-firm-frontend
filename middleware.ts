import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const isPublicPath = ['/login', '/signup'].includes(request.nextUrl.pathname)

  // Se estiver tentando acessar uma página pública (login/signup) e já estiver autenticado
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se estiver tentando acessar uma página protegida sem estar autenticado
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configura em quais caminhos o middleware será executado
export const config = {
  matcher: [
    '/login',
    '/signup',
    '/dashboard/:path*'
  ]
} 