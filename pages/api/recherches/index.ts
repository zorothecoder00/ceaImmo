import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma, Categorie, Statut } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Query params
    const {
      search = "",
      categorie,
      statut,
      minPrix,
      maxPrix,
      minSurface,
      maxSurface,
      minChambres,
      maxChambres,
      page = "1",
      limit = "10",
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.max(1, parseInt(limit as string, 10) || 10);
    const skip = (pageNum - 1) * take;

    // Champs autorisés pour le tri
    const allowedFields = ["createdAt", "prix", "surface", "nombreChambres"];
    const safeField = allowedFields.includes(sortField as string)
      ? (sortField as string)
      : "createdAt";
    const order = sortOrder === "asc" ? "asc" : "desc";

    // Construction des filtres
    const where: Prisma.ProprieteWhereInput = {};

    // 🔹 Recherche texte globale
    const searchStr = search.toString().trim().toLowerCase();
    if (searchStr) {
      where.OR = [
        { nom: { contains: searchStr, mode: "insensitive" } },
        { description: { contains: searchStr, mode: "insensitive" } },
        { geolocalisation: { contains: searchStr, mode: "insensitive" } },
        {
          proprietaire: {
            OR: [
              { nom: { contains: searchStr, mode: "insensitive" } },
              { prenom: { contains: searchStr, mode: "insensitive" } },
              { email: { contains: searchStr, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // 🔹 Filtrage par catégorie
    if (categorie && Object.values(Categorie).includes(categorie as Categorie)) {
      where.categorie = categorie as Categorie;
    }

    // 🔹 Filtrage par statut
    if (statut && Object.values(Statut).includes(statut as Statut)) {
      where.statut = statut as Statut;
    }

    // 🔹 Filtres numériques avec objets séparés
    if (minPrix || maxPrix) {
      where.prix = {};
      if (minPrix) (where.prix as Prisma.IntFilter).gte = Number(minPrix);
      if (maxPrix) (where.prix as Prisma.IntFilter).lte = Number(maxPrix);
    }

    if (minSurface || maxSurface) {
      where.surface = {};
      if (minSurface) (where.surface as Prisma.IntFilter).gte = Number(minSurface);
      if (maxSurface) (where.surface as Prisma.IntFilter).lte = Number(maxSurface);
    }

    if (minChambres || maxChambres) {
      where.nombreChambres = {};
      if (minChambres) (where.nombreChambres as Prisma.IntFilter).gte = Number(minChambres);
      if (maxChambres) (where.nombreChambres as Prisma.IntFilter).lte = Number(maxChambres);
    }

    // 🔹 Récupération des résultats
    const [proprietes, total] = await Promise.all([
      prisma.propriete.findMany({
        where,
        include: {
          images: true,
          avis: true,
          chambres: true,
          proprietaire: {
            select: { id: true, nom: true, prenom: true, email: true },
          },
        },
        orderBy: { [safeField]: order },
        skip,
        take,
      }),
      prisma.propriete.count({ where }),
    ]);

    return res.status(200).json({
      data: proprietes,
      meta: {
        total,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Erreur API /recherches:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
