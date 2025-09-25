import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // ton client prisma
import { getAuthSession } from "@/lib/auth"; // ta fonction d’auth
import { Type, ReservationStatut } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthSession(req, res);

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  const userId = session.user.id;

  try {
    if (req.method === "GET") {
      const { dateArrivee } = req.query;

      const visites = await prisma.reservation.findMany({
        where: {
          userId,
          type: Type.VISITE,
          ...(dateArrivee
            ? { dateArrivee: new Date(dateArrivee as string) }
            : {}),
        },
        include: {
          propriete: {
            select: {
              nom: true,
              prix: true,
              surface: true,
              nombreChambres: true,
              geolocalisation: true,
              proprietaire: { select: { nom: true } },
            },
          },
        },
        orderBy: { dateArrivee: "asc" },
      });

      return res.status(200).json(visites);
    }

    if (req.method === "POST") {
      const { proprieteId, dateArrivee } = req.body;

      if (!proprieteId || !dateArrivee) {
        return res.status(400).json({ error: "Champs requis manquants" });
      }

      const reservation = await prisma.reservation.create({
        data: {
          dateArrivee: new Date(dateArrivee),
          dateDepart: new Date(dateArrivee), // pour une visite, tu peux mettre dateArrivee = dateDepart
          nombreVoyageurs: 1,
          type: Type.VISITE,
          statut: ReservationStatut.DEMANDEE,
          proprieteId,
          userId,
        },
      });

      return res.status(201).json(reservation);
    }

    if (req.method === "PATCH") {
      const { reservationId, action } = req.body;

      if (!reservationId || !action) {
        return res.status(400).json({ error: "Champs requis manquants" });
      }

      let newStatut: ReservationStatut;
      switch (action) {
        case "CONFIRMER":
          newStatut = ReservationStatut.CONFIRMEE;
          break;
        case "ANNULER":
          newStatut = ReservationStatut.ANNULEE;
          break;
        case "REPORTER":
          newStatut = ReservationStatut.REPORTEE;
          break;
        default:
          return res.status(400).json({ error: "Action invalide" });
      }

      const updated = await prisma.reservation.update({
        where: { id: reservationId },
        data: { statut: newStatut },
      });

      return res.status(200).json({ data: updated });
    }

    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}
