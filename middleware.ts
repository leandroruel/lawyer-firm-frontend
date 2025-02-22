import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

interface JwtPayload {
  id: string
  tenantId: string
  iat: number
  aud: string
  iss: string
  sub: string
  exp: number
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicPath = publicRoutes.includes(path)

  // Se não houver token e tentar acessar rota protegida
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    try {
      const decodedToken: JwtPayload = jwtDecode(token)
      const isTokenExpired = decodedToken.exp < Date.now() / 1000

      // Se o token estiver expirado e tentar acessar rota protegida
      if (isTokenExpired && isProtectedRoute) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token') // Remove o token expirado
        return response
      }

      // Se o token for válido e tentar acessar rota pública
      if (!isTokenExpired && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // Se houver erro ao decodificar o token, remove o cookie e redireciona
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

// Configura em quais caminhos o middleware será executado
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)'
  ]
} 