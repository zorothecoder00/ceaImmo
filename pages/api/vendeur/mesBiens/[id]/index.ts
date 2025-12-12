import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { Role, Categorie, Statut } from "@prisma/client";

// ✅ Helper pour BigInt
function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession(req, res);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const userId = Number(session.user.id);
  const proprieteId = Number(req.query.id);

  if (!proprieteId || isNaN(proprieteId)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  // Vérifier que l'utilisateur est VENDEUR
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== Role.VENDEUR) {
    return res.status(403).json({ message: "Accès refusé : réservé aux vendeurs" });
  }

  try {
    // ============ GET : récupérer un bien précis ============
    if (req.method === "GET") {
      const propriete = await prisma.propriete.findUnique({
        where: { id: proprieteId },
        include: {
          images: { orderBy: { ordre: "asc" } },
          chambres: true,     
          avis: { include: { user: true } },
          offres: true,
          reservations: true,
          geolocalisation: true,
        },
      });

      if (!propriete) {
        return res.status(404).json({ message: "Propriété introuvable" });
      }

      if (propriete.proprietaireId !== userId) {
        return res.status(403).json({ message: "Accès refusé à cette propriété" });
      }

      const safePropriete = serializeBigInt(propriete);
      return res.status(200).json({ data: safePropriete });
    }

    // ============ PUT / PATCH : modifier une propriété ============
    if (req.method === "PUT" || req.method === "PATCH") {
      const proprieteExistante = await prisma.propriete.findUnique({
        where: { id: proprieteId },
        include: { geolocalisation: true }, // pour savoir si elle existe déjà
      });

      if (!proprieteExistante) {
        return res.status(404).json({ message: "Propriété non trouvée" });
      }

      if (proprieteExistante.proprietaireId !== userId) {
        return res.status(403).json({ message: "Accès refusé" });
      }

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
        imageUrls = [],
      } = req.body;

      // Validation basique
      if (categorie && !Object.values(Categorie).includes(categorie as Categorie))
        return res.status(400).json({ message: "Catégorie invalide" });

      if (statut && !Object.values(Statut).includes(statut as Statut))
        return res.status(400).json({ message: "Statut invalide" });

      // ✅ Mise à jour principale
      const updated = await prisma.propriete.update({
        where: { id: proprieteId },
        data: {
          nom,
          description,
          categorie,
          prix: prix ? BigInt(Number(prix)) : undefined,
          surface: surface ? BigInt(Number(surface)) : undefined,
          statut,
          nombreChambres: nombreChambres ? Number(nombreChambres) : undefined,
          visiteVirtuelle,
          updatedAt: new Date(),

          ...(imageUrls.length > 0 && {
            images: {
              deleteMany: {},
              create: imageUrls.map((url: string, index: number) => ({
                url,
                ordre: index,
              })),
            },
          }),
        },
      });

      // ================= UPDATE GEOPOINT (PostGIS) =================
      if (geolocalisation?.latitude && geolocalisation?.longitude) {
        const lat = Number(geolocalisation.latitude);
        const lng = Number(geolocalisation.longitude);

        if (!proprieteExistante.geolocalisation) {
          // CREATE + SET POINT
          await prisma.$queryRaw`
            INSERT INTO "Geolocalisation" ("proprieteId", latitude, longitude, geopoint)
            VALUES (${proprieteId}, ${lat}, ${lng},
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))
          `;
        } else {
          // UPDATE + SET POINT
          await prisma.$queryRaw`
            UPDATE "Geolocalisation"
            SET latitude = ${lat},
                longitude = ${lng},
                geopoint = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
            WHERE "proprieteId" = ${proprieteId}
          `;
        }
      }

      const safePropriete = serializeBigInt(updated);
      return res.status(200).json({ message: "Propriété mise à jour", data: safePropriete });
    }

    // ============ DELETE : supprimer une propriété ============
    if (req.method === "DELETE") {
      const propriete = await prisma.propriete.findUnique({
        where: { id: proprieteId },
      });   

      if (!propriete) {
        return res.status(404).json({ message: "Propriété non trouvée" });
      }

      if (propriete.proprietaireId !== userId) {
        return res.status(403).json({ message: "Accès refusé" });
      }

      await prisma.propriete.delete({ where: { id: proprieteId } });
      return res.status(200).json({ message: "Propriété supprimée avec succès" });
    }

    // ❌ Méthode non autorisée
    return res.status(405).json({ message: "Méthode non autorisée" });
  } catch (error) {
    console.error("Erreur /api/vendeur/mesBiens/[id]:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
