// /api/acheteur/mesOffres/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { OffreStatut } from "@prisma/client";
import { getAuthSession } from "@/lib/auth"  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const session = await getAuthSession(req, res)

  const { id } = req.query;
  const offreId = parseInt(id as string);

  if (isNaN(offreId)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  function serializeBigInt<T>(obj: T): T {  
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  switch (req.method) {
    case "GET":
      try {
        const offre = await prisma.offre.findUnique({
          where: { id: offreId },
          include: { propriete: true, user: true },
        });

        if (!offre) return res.status(404).json({ error: "Offre introuvable" });

        const safeOffre = serializeBigInt(offre)

        return res.status(200).json({ data: safeOffre });
      } catch (error) {
        return res.status(500).json({ error: "Erreur serveur", details: error });
      }

    case "PATCH":
      try {  
        const { action, montant, message } = req.body;

        // Récupérer l'offre pour vérifier le propriétaire (acheteur)
        const offre = await prisma.offre.findUnique({
          where: { id: offreId },
        });

        if (!offre) return res.status(404).json({ error: "Offre introuvable" });

        // Ici tu peux vérifier l'ID de l'utilisateur connecté
        console.log("SESSION =", session);
        console.log("OFFRE =", offre);

         if (Number(session?.user?.id) !== offre.userId) return res.status(403).json({ error: "Non autorisé" });

        // 🔁 Modifier l’offre
        if (action === "modifier") {
          const updated = await prisma.offre.update({
            where: { id: offreId },
            data: {
              ...(montant !== undefined && { montant: BigInt(montant) }),
              ...(message !== undefined && { message }),
              statut: OffreStatut.EN_ATTENTE, // remise à EN_ATTENTE après modification
            },
          });

          const safeUpdated = serializeBigInt(updated)

          return res.status(200).json({ message: "Offre modifiée", data: safeUpdated });
        }

        // 🔁 Retirer l’offre
        if (action === "retirer") {
          const updated = await prisma.offre.update({
            where: { id: offreId },
            data: { statut: OffreStatut.REFUSEE },
          });

          const safeUpdated = serializeBigInt(updated)

          return res.status(200).json({ message: "Offre retirée", data: safeUpdated });
        }

        return res.status(400).json({ error: "Action invalide" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur", details: error });
      }

    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}
