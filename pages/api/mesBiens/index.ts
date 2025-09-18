// pages/api/mesBiens/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; 
import { Prisma, Role, Categorie, Statut } from "@prisma/client";
import { getAuthSession } from "@/lib/auth"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1️⃣ Vérification user connecté
  const session = await getAuthSession(req, res);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const userId = Number(session.user.id);

  // Vérifier que l'utilisateur est VENDEUR
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== Role.VENDEUR) {
    return res.status(403).json({ message: "Accès refusé : réservé aux vendeurs" });
  }
    
  // ============ GESTION GET ============
  if (req.method === "GET") {
    // 2️⃣ Gestion des filtres depuis query
    const {
      categorie,
      statut,
      search,
      minPrix,
      maxPrix,
      minSurface,
      maxSurface,
      minChambres,
      maxChambres,
      latitude,
      longitude,
      radius, // rayon en km
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const where: Prisma.ProprieteWhereInput = { proprietaireId: userId };

    if (categorie && Object.values(Categorie).includes(categorie as Categorie)) {
      where.categorie = categorie as Categorie;
    }

    if (statut && Object.values(Statut).includes(statut as Statut)) {
      where.statut = statut as Statut;
    }

    if (search) {
      where.OR = [
        { nom: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
        { geolocalisation: { contains: String(search), mode: "insensitive"}},
      ];
    }

    if (minPrix || maxPrix) {
      where.prix = {};
      if (minPrix) where.prix.gte = Number(minPrix);
      if (maxPrix) where.prix.lte = Number(maxPrix);
    }

    if (minSurface || maxSurface) {
      where.surface = {};
      if (minSurface) where.surface.gte = Number(minSurface);
      if (maxSurface) where.surface.lte = Number(maxSurface);
    }

    if (minChambres || maxChambres) {
      where.nombreChambres = {};
      if (minChambres) where.nombreChambres.gte = Number(minChambres);
      if (maxChambres) where.nombreChambres.lte = Number(maxChambres);
    }    

    // 4️⃣ Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // 5️⃣ Gestion du tri dynamique
    const validSortFields = ["prix", "surface", "nombreChambres", "createdAt"];
    const sortField = validSortFields.includes(sortBy as string) ? (sortBy as string) : "createdAt";
    const sortOrder = order === "asc" ? "asc" : "desc";

    try{
      // 6️⃣ Requête principale
      const [biens, total] = await Promise.all([
        prisma.propriete.findMany({
          where: {
            ...where,
          },
          skip,
          take: limitNum,
          orderBy: { [sortField]: sortOrder },
          include: {
            images: true,
            chambres: true,
            avis: { include: { user: true } },
            offres: true,
            reservations: true,
          },
        }),

        prisma.propriete.count({ where }),

      ]);

      // 7️⃣ Réponse
      return res.status(200).json({
        total,
        page: pageNum,
        limit: limitNum,
        sortBy: sortField,
        order: sortOrder,
        data: biens,
      });

    } catch (error) {
      console.error("Erreur API /mesBiens:", error);
      return res.status(500).json({ message: "Erreur interne", error });
    }

  }else if (req.method === "POST") {
    const {  
      nom,
      description,
      categorie,
      prix,
      surface,
      statut,
      geolocalisation,
      nombreChambres,
      visiteVirtuelle,
      images, // tableau de string URLs
    } = req.body;

    // --- validation minimale ---
    if (!nom || !prix || !surface || !categorie || !statut || !geolocalisation) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    if (!Object.values(Categorie).includes(categorie as Categorie)) {
      return res.status(400).json({ message: "Catégorie invalide" });
    }

    if (!Object.values(Statut).includes(statut as Statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    try{
      const newPropriete = await prisma.propriete.create({
        data: {
          nom,
          description,
          categorie: categorie as Categorie,
          prix: Number(prix),
          surface: Number(surface),
          statut: statut as Statut,
          geolocalisation,
          nombreChambres: nombreChambres ? Number(nombreChambres) : 1,
          visiteVirtuelle: visiteVirtuelle || null,
          proprietaireId: userId,
          images: images && Array.isArray(images)
            ? {
                createMany: {
                  data: images.map((url: string) => ({ url })),
                },
              }
            : undefined,
        },
        include: {
          images: true,
        },
      });

      return res.status(201).json({ message: "Propriété créée avec succès", data: newPropriete });
    } catch (error) {
      console.error("Erreur API /mesBiens POST:", error);
      return res.status(500).json({ message: "Erreur interne", error });
    }

  }

  return res.status(405).json({ message: 'Méthode non autorisée' })
}
