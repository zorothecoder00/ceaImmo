import { NextRequest , NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"
import { Role } from '@prisma/client'  
import { prisma } from "@/lib/prisma"

// Petit cache mémoire pour la config
let cachedConfig: { maintenance: boolean } | null = null
let lastFetch = 0
const CACHE_DURATION = 60 * 1000 // 1 minute

async function getConfig(request: NextRequest) {
  const now = Date.now()
  if (!cachedConfig || now - lastFetch > CACHE_DURATION) {
    const res = await fetch(new URL("/api/config/maintenance", request.url).toString())
    const data = await res.json()
    cachedConfig = data
    lastFetch = now
  }
  return cachedConfig
}    

export async function middleware(request: NextRequest) {

	const url = request.nextUrl
	const { pathname } = url  

	// 🚧 1. Gestion du mode maintenance
  	const config = await getConfig(request)
	if (config?.maintenance) {
	   // exceptions : page maintenance, assets statiques, login admin
	   const allowedPaths = ["/maintenance", "/auth/login", "/auth/logout", "/api/auth", "/dashboard/admin"]
	   const isAllowed = allowedPaths.some(p => pathname.startsWith(p))

	   if (!isAllowed) {
	     return NextResponse.redirect(new URL("/maintenance", request.url))
	   }
	  }

  	// 🔑 2. Gestion des tokens NextAuth
	const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET})        
	// Si l'utilisateur n'est pas connecté → rediriger vers /login
	if(!token){
		if(!pathname.startsWith("/auth")){
			return NextResponse.redirect(new URL("/auth/login", request.url))
		}
		return NextResponse.next()
	}

	// 🎭 3. Vérifie les rôles pour le dashboard
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

	    if (pathname !== dashboardPaths[role]) {
	      return NextResponse.redirect(new URL('/unauthorized', request.url))
	    }
	}

	return NextResponse.next()
} 

export const config = {
	  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}