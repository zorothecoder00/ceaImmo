import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@prisma/client' 

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const url = request.nextUrl
  const { pathname } = url  

  // Si l'utilisateur n'est pas connecté → rediriger vers /login
  if (!token) {
    if (!pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
  }

  const role = token?.role as Role | undefined

  // Vérifie accès dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!role) {
      return NextResponse.redirect(new URL('/chooseRole', request.url))
    }

    // Map typée Role → chemin dashboard
    const dashboardPaths: Partial<Record<Role, string>> = {
      ADMIN: '/dashboard/admin',
      ACHETEUR: '/dashboard/acheteur',
      VENDEUR: '/dashboard/vendeur',
      AGENT: '/dashboard/agent',  
      ENTREPRISE: '/dashboard/entreprise',
    }

    // ✅ Autoriser toutes les sous-routes du dashboard du rôle
    if (!pathname.startsWith(dashboardPaths[role]!)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
