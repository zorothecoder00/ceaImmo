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
      geolocalisation,          
      minNote,
      page = "1",
      limit = "10",
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.max(1, parseInt(limit as string, 10) || 10);
    const skip = (pageNum - 1) * take;

    // Champs autorisés pour le tri
    const allowedFields = ["createdAt", "prix", "surface", "nombreChambres", "note"];
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
            ],
          },
        },
      ];
    }

    // 🔹 Filtrage par geolocalisation (optionnel)
    if (geolocalisation) {
      where.geolocalisation = { contains: geolocalisation.toString(), mode: "insensitive" };
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
      where.prix = {
        ...(minPrix ? { gte: Number(minPrix) } : {}),
        ...(maxPrix ? { lte: Number(maxPrix) } : {}),
      };
    }

    if (minSurface || maxSurface) {
      where.surface = {
        ...(minSurface ? { gte: Number(minSurface) } : {}),
        ...(maxSurface ? { lte: Number(maxSurface) } : {}),
      };
    }

    if (minChambres || maxChambres) {
      where.nombreChambres = {
        ...(minChambres ? { gte: Number(minChambres) } : {}),
        ...(maxChambres ? { lte: Number(maxChambres) } : {}),
      };
    }

    // 🔹 Récupération des résultats
    const [proprietes, total] = await Promise.all([
      prisma.propriete.findMany({
        where,
        include: {
          images: true,
          chambres: true,
          proprietaire: {
            select: { id: true, nom: true, prenom: true },
          },
          _count: { select: { avis: true } },
          avis: { select: { note: true } },
        },
        orderBy: safeField !== "note" ? { [safeField]: order } : undefined,
        skip,
        take,
      }),
      prisma.propriete.count({ where }),
    ]);

    // 🔹 Ajout de la note moyenne
    let data = proprietes.map((p) => {
      const moyenne = p.avis.length
        ? p.avis.reduce((s, n) => s + n.note, 0) / p.avis.length
        : 0;
      return { ...p, note: moyenne };
    });

    // 🔹 Filtrage par note
    if (minNote) {
      data = data.filter((p) => p.note >= Number(minNote));
    }

    // recalcul du total après filtrage
    const totalFiltre = data.length;

    // 🔹 Tri manuel si sortField === "note"
    if (safeField === "note") {
      data.sort((a, b) =>
        order === "asc" ? a.note - b.note : b.note - a.note
      );
    }

    return res.status(200).json({
      data,
      meta: {
        total: totalFiltre,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(totalFiltre / take),
      },
    });
  } catch (error) {
    console.error("Erreur API /recherches:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
