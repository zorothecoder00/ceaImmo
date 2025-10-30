'use client'
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { Categorie, Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession(req, res);
  if (!session?.user?.id) return res.status(401).json({ message: 'Non autorisé' });

  const userId = Number(session.user.id);
  
  function serializeBigInt<T>(obj: T): T {  
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  try {
    // ------------------- GET -------------------
    if (req.method === "GET") {
      // Récupération des query params
      const { search = "", page = "1", limit = "10", sortField = "createdAt", sortOrder = "desc" } = req.query;  

      const pageNum  = parseInt(page as string)
      const take = parseInt(limit as string, 10) || 10;
      const skip = (pageNum - 1) * take;
      const allowedFields = ['createdAt']  // sécurisation
      const field = allowedFields.includes(sortField as string) ? sortField : 'createdAt';    
      const safeField = field as string
      const order = sortOrder === 'asc' ? 'asc' : 'desc'

      const searchStr = search.toString().trim().toLowerCase()
      const orFilter: Prisma.FavoriWhereInput[] = []

      if (searchStr) {
        const matchingCategorie = Object.values(Categorie).filter((c) =>
          c.toLowerCase().includes(searchStr)
        ) as Categorie[];
        if (matchingCategorie.length > 0) {
          orFilter.push({ propriete: { categorie: { in: matchingCategorie } } });
        }
      }

      const [favoris, total] = await Promise.all([
        prisma.favori.findMany({
          where: { userId, OR: orFilter.length > 0 ? orFilter : undefined },
          include: {
            propriete: {
              include: {
                images: true,
                chambres: true,
                proprietaire: { select: { id: true, nom: true, prenom: true } },
                _count: { select: { avis: true } },
                avis: { select: { note: true } },
              },
            },
          },
          orderBy: { [safeField]: order },
          skip,
          take,
        }),
        prisma.favori.count({
          where: { userId, OR: orFilter.length > 0 ? orFilter : undefined },
        }),
      ]);  

      // ✅ Calcul de la note moyenne pour chaque propriété favorite
      const data = favoris.map((f) => {
        const avis = f.propriete.avis;
        const moyenne = avis.length ? avis.reduce((sum, a) => sum + a.note, 0) / avis.length : 0;
        return { ...f, propriete: { ...f.propriete, note: moyenne } };
      });

      // ✅ Tri manuel si sortField === "note"
      if (safeField === "note") {
        data.sort((a, b) =>
          order === "asc" ? a.propriete.note - b.propriete.note : b.propriete.note - a.propriete.note
        );
      }

      // ✅ Pagination finale (après filtrage et tri)
      const paginatedData = data.slice(skip, skip + take);

      const safePaginatedData = serializeBigInt(paginatedData)

      return res.status(200).json({
        data: safePaginatedData,
        meta: { total, page: pageNum, limit: take, totalPages: Math.ceil(total / take) },
      });
    }

    // ------------------- POST -------------------
    if (req.method === "POST") {
      const { proprieteId } = req.body;

      if (!proprieteId || typeof proprieteId !== "number") {
        return res.status(400).json({ message: "proprieteId invalide" });
      }

      const propriete = await prisma.propriete.findUnique({ where: { id: proprieteId } });
      if (!propriete) return res.status(404).json({ message: "Propriété non trouvée" });

      const exist = await prisma.favori.findUnique({
        where: { userId_proprieteId: { userId, proprieteId } },
      });

      if (exist) return res.status(200).json({ message: "Propriété déjà en favoris", favori: exist });

      const favori = await prisma.favori.create({
        data: { userId, proprieteId },
        include: { propriete: true },
      });

      return res.status(201).json({ message: "Favori ajouté avec succès", favori });
    }

    // ------------------- Méthode non autorisée -------------------
    return res.status(405).json({ error: "Méthode non autorisée" });

  } catch (error) {
    console.error("Erreur API /favoris:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
