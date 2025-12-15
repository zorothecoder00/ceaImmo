import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";     
import { VisiteStatut } from "@prisma/client";
import { notify } from "@/services/notification.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession(req, res);

  function serializeBigInt<T>(obj: T): T {
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  const userId = Number(session?.user?.id);

  try {
    // Récupérer les visites de l'utilisateur
    if (req.method === "GET") {
      const { date } = req.query;

      const visites = await prisma.visite.findMany({
        where: {
          userId,
          ...(date ? { date: new Date(date as string) } : {}),
        },
        include: {   
          propriete: {
            select: {
              nom: true,
              prix: true,
              surface: true,
              nombreChambres: true,
              geolocalisation: true,
              proprietaire: { select: { nom: true, prenom: true, } },
            },
          },
          agent: { select: { nom: true } },
        },
        orderBy: { date: "asc" },
      });

      const safeVisites = serializeBigInt(visites);

      return res.status(200).json({ data: safeVisites });
    }

    // Créer une demande de visite
    if (req.method === "POST") {
      const { proprieteId, date } = req.body;

      if (!proprieteId || !date) {
        return res.status(400).json({ error: "Champs requis manquants" });
      }

      const existing = await prisma.visite.findFirst({
        where: { proprieteId, userId },
      });

      if (existing) {
        return res.status(400).json({
          error: "Vous avez déjà une visite planifiée pour cette propriété.",
        });
      }

      const visite = await prisma.visite.create({
        data: {
          date: new Date(date),  
          statut: VisiteStatut.DEMANDEE,
          proprieteId,
          userId,
        },
      });

      // 🔔 notifier le propriétaire
      const propriete = await prisma.propriete.findUnique({
        where: { id: proprieteId },
        select: {
          nom: true,
          proprietaireId: true,
        },
      });

      if (propriete?.proprietaireId) {
        await notify({
          type: "VISITE_DEMANDEE",
          recepteurId: propriete.proprietaireId,
          emetteurId: userId,
          data: {
            type: "VISITE_DEMANDEE",
            propriete: propriete.nom,
          },
          lien: `/dashboard/vendeur/visites`,
        });
      }

      const safeVisite = serializeBigInt(visite)

      return res.status(201).json({ data: safeVisite });
    }

    // Mettre à jour le statut d'une visite (CONFIRMER, ANNULER, REPORTER)
    if (req.method === "PATCH") {
      const { visiteId, action } = req.body;

      if (!visiteId || !action) {
        return res.status(400).json({ error: "Champs requis manquants" });
      }

      let newStatut: VisiteStatut;
      switch (action) {
        case "CONFIRMER":
          newStatut = VisiteStatut.CONFIRMEE;
          break;
        case "ANNULER":
          newStatut = VisiteStatut.ANNULEE;
          break;
        case "REPORTER":
          newStatut = VisiteStatut.REPORTEE;
          break;
        default:
          return res.status(400).json({ error: "Action invalide" });
      }

      const updated = await prisma.visite.update({
        where: { id: visiteId },
        data: { statut: newStatut },
        include: {
          propriete: { select: { nom: true } },
          user: true,
        },
      });

      if (newStatut === VisiteStatut.CONFIRMEE) {   
        await notify({
          type: "VISITE_CONFIRMEE",
          recepteurId: updated.userId!,
          emetteurId: Number(session.user.id),
          data: {
            type: "VISITE_CONFIRMEE",
            propriete: updated.propriete?.nom ?? "la propriété",
            date: updated.date.toISOString(),
          },
          lien: `/dashboard/vendeur/visites`,
        });
      }

      const safeUpdated = serializeBigInt(updated);

      return res.status(200).json({ data: safeUpdated });
    }

    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error) {
    console.error("Erreur interne", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
