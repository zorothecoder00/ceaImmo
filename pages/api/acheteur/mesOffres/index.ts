import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth"; // 👈 ta fonction auth
import { OffreStatut, Prisma } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  const userId = Number(session.user.id);

  try {
    if (req.method === "GET") {  
      const { statut } = req.query;

      // Filtrage par statut si fourni
      const whereClause: Prisma.OffreWhereInput = { userId };

      // Vérifie si un filtre statut est passé
      if (statut && typeof statut === "string" && Object.values(OffreStatut).includes(statut as OffreStatut)) {
        whereClause.statut = statut as OffreStatut;
      }

      const offres = await prisma.offre.findMany({
        where: whereClause,
        include: {
          propriete: {
            include: { images: true, proprietaire: { select: { id: true, nom: true, prenom: true } } },
          },
          reservation: true,
          agent: { select: { id: true, nom: true, prenom: true } },
          transaction: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ data: offres });
    }

    if (req.method === "POST") {
      const { montant, message, proprieteId, reservationId, agentId } = req.body;

      if (!montant || !proprieteId) {
        return res.status(400).json({ error: "Montant et proprieteId sont requis" });
      }

      const montantNum = Number(montant);
      if (isNaN(montantNum) || montantNum <= 0) {
        return res.status(400).json({ error: "Montant invalide" });
      }

      const propriete = await prisma.propriete.findUnique({ where: { id: Number(proprieteId) } });
      if (!propriete) {
        return res.status(404).json({ error: "Propriété introuvable" });
      }

      const offre = await prisma.offre.create({
        data: {
          montant: Number(montant),
          message: message || null,
          proprieteId: Number(proprieteId),
          reservationId: reservationId ? Number(reservationId) : null,
          agentId: agentId ? Number(agentId) : null,
          userId,
          statut: OffreStatut.EN_ATTENTE, // par défaut
        },
        include: {
          propriete: true,
          agent: true,
        }, 
      });

      return res.status(201).json({ data: offre });
    }

    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error) {
    console.error("Erreur API /acheteur/mesOffres:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
