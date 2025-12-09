// pages/api/mesBiens/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; 
import { Prisma, Role, Categorie, Statut } from "@prisma/client";
import { getAuthSession } from "@/lib/auth"; 
   
interface ChambreInput {  
  nom: string;     
  description?: string;
  prixParNuit: number | string;   
  capacite: number | string;
  disponible?: boolean;
}


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

  function serializeBigInt<T>(obj: T): T {  
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
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
      longitude,
      latitude,
      radius,
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    // ⬅️ Exclure automatiquement les propriétés vendues
    const where: Prisma.ProprieteWhereInput = { 
      proprietaireId: userId,
      statut: { not: Statut.VENDU }
    };

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
            images: {
              orderBy: { ordre: 'asc' } // ✅ Trier par ordre
            },
            hotel: true,
            geolocalisation: true,
            chambres: true,
            avis: { include: { user: true } },
            offres: true,
            reservations: true,
          },
        }),

        prisma.propriete.count({ where }),

      ]);

      const safeBiens = serializeBigInt(biens);
      const safeTotal = serializeBigInt(total);

      // 7️⃣ Réponse
      return res.status(200).json({
        total: safeTotal,
        page: pageNum,
        limit: limitNum,
        sortBy: sortField,
        order: sortOrder,
        data: safeBiens,
      });

    } catch (error) {
      console.error("Erreur API /mesBiens:", error);
      return res.status(500).json({ message: "Erreur interne", error });
    }
  }

  /* --------------------------------------------------------------- POST */
  if(req.method ==='POST'){
    try{
      const {
        nom,  
        description = "",
        categorie,
        prix,
        surface,    
        statut,
        geolocalisation,
        nombreChambres = 1,
        visiteVirtuelle = null,
        imageUrls = [], // ✅ Changé de "images" à "imageUrls" (array de strings)
        chambres = [] as ChambreInput[],
      } = req.body;

      if (!nom || !categorie || !statut || !prix || !surface) {
        return res.status(400).json({ message: 'Champs requis manquants' })
      }

      if (
        !geolocalisation ||
        typeof geolocalisation.latitude === "undefined" ||
        typeof geolocalisation.longitude === "undefined"
      ) {
        return res.status(400).json({
          message: "Géolocalisation invalide : { latitude, longitude } requis",
        });
      }

      if (!Object.values(Categorie).includes(categorie as Categorie))
        return res.status(400).json({ message: "Catégorie invalide" });
      if (!Object.values(Statut).includes(statut as Statut))
        return res.status(400).json({ message: "Statut invalide" });


      // 🧱 Création de la propriété + images liées
      const propriete = await prisma.propriete.create({
        data: {
          nom,   
          description,
          categorie: categorie as Categorie,
          prix: BigInt(Number(prix)), // ✅ stocké correctement,   
          surface,
          statut: statut as Statut,
          // ⚠️ Géolocalisation avec PostGIS via UncheckedCreate
          geolocalisation: {
            create: {  
              latitude: Number(geolocalisation.latitude),
              longitude: Number(geolocalisation.longitude),
            },
          },  
          nombreChambres,
          visiteVirtuelle,
          proprietaireId: userId,
          // ✅ Création des images avec ordre
          images: imageUrls.length > 0
            ? {
                create: imageUrls.map((url: string, index: number) => ({
                  url,
                  ordre: index,
                })),
              }
            : undefined,

          // ✅ Création des chambres (optionnel, pour hôtels)
          chambres: chambres.length > 0
            ? {
                create: chambres.map((ch: ChambreInput) => ({
                  nom: ch.nom,
                  description: ch.description || "",
                  prixParNuit: Number(ch.prixParNuit),
                  capacite: Number(ch.capacite),
                  disponible: ch.disponible ?? true,
                })),
              }
            : undefined,    
        },
        include: {
          images: true,  
          geolocalisation: true,
        },
      });

      await prisma.$executeRaw`
        UPDATE "Geolocalisation"
        SET "geoPoint" = ST_SetSRID(ST_MakePoint(${geolocalisation.longitude}, ${geolocalisation.latitude}), 4326)
        WHERE "proprieteId" = ${propriete.id};
      `;


      const safePropriete = serializeBigInt(propriete)

      return res.status(201).json({ message: "Propriété créée avec succès", data: safePropriete });

    }catch (error) {
      console.error('Erreur serveur POST /mesBiens:', error)
      return res.status(500).json({ message: 'Erreur serveur' })
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' })
}
  