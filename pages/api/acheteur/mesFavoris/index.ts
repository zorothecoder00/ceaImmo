import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth"
import { Categorie, Prisma } from '@prisma/client'     

  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const session = await getAuthSession(req, res)
    if (!session?.user?.id) return res.status(401).json({ message: 'Non autorisé' })

    const userId = Number(session.user.id);

    // Récupération des query params
    const { search = "", page = "1", limit = "10", sortField = "createdAt", sortOrder = "desc" } = req.query;  

    const pageNum  = parseInt(page as string)
    const take = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * take;
    // 🔹 Champs autorisés pour le tri
    const allowedFields = ['createdAt']  // sécurisation
    const field = allowedFields.includes(sortField as string)
        ? sortField
        : 'createdAt'    
    const safeField = field as string
    const order = sortOrder === 'asc' ? 'asc' : 'desc'

    // 🔹 Filtre recherche
    const searchStr = search.toString().trim().toLowerCase()
    const orFilter: Prisma.FavoriWhereInput[] = []

    // 🎯 Exemple spécifique sur enum Statut
    if (searchStr) {
      // Filtrage par catégorie (enum)
      const matchingCategorie = Object.values(Categorie).filter((c) =>
        c.toLowerCase().includes(searchStr)
      ) as Categorie[];

      if (matchingCategorie.length > 0) 
      {
        orFilter.push({
          propriete: {
            categorie: { in: matchingCategorie },
          },
        });
      }
    }

    const [favoris, total] = await Promise.all([
      prisma.favori.findMany({
        where: {
          userId,
          OR: orFilter.length > 0 ? orFilter : undefined,
        },
        include: {
          propriete: {
            include: {
              images: true, // on récupère aussi les images
              avis: true,   // éventuellement les avis
              chambres: true,
            },
          },
        },
        orderBy: {
          [safeField]: order,
        },
        skip,
        take,
      }),

      prisma.favori.count({
        where: {
          userId,
          OR: orFilter.length > 0 ? orFilter : undefined,
        },
      })

    ])

    return res.status(200).json({
     data: favoris,
      meta: {
        total,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Erreur API /favoris:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
