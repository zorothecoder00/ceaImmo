import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role } from '@prisma/client' 

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const url = request.nextUrl
  const { pathname } = url  

  // ⚡ Autoriser certaines routes sans fetch (API, auth, maintenance)
  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next()
  }

  // 👉 Rendre l'accueil publique
  if (pathname === "/") {
    return NextResponse.next()
  }
  
  // 🔹 Vérifier le mode maintenance via API
  let maintenance = false
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/maintenance`, {
      cache: "no-store" // 🔹 Toujours récupérer la dernière valeur
    })
    const data = await res.json()
    maintenance = data.maintenance === true
  } catch (error) {
    console.error("Erreur fetch maintenance", error)
  }

  // 🔹 Bloquer site si maintenance activée et non-admin
  if (maintenance) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL('/maintenance', request.url))
    }
  }

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // toutes les routes sauf les assets
}
